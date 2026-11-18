// OpenChamber service for the "Multi-Account Usage" Work Status section.
//
// Reads every saved account at request time, so a newly added account shows up
// on the next refresh without touching the extension:
//   - Codex: legacy ChatGPT browser/device-code logins in OpenCode's SQLite
//     credential store (read-only).
//   - Claude: Claude Code's default config dir (~/.claude) plus any
//     ~/.claude-<name> dir holding a .credentials.json (CLAUDE_CONFIG_DIR logins).
//
// Tokens are used only as bearer credentials for the providers' usage
// endpoints. They are never logged, returned to the UI, refreshed, or stored.
//
// Endpoints (all behind the service bearer):
//   GET  /accounts            grouped usage for the Work Status section
//   GET  /accounts?force=1    same, bypassing the short result cache
//   POST /quota               OpenChamber quota-provider contract (Usage page card)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
const serviceToken = process.env.OPENCHAMBER_SERVICE_TOKEN ?? '';
const home = process.env.HOME ?? '';
const databasePath = process.env.OPENCODE_CREDENTIAL_DB
  ?? path.join(home, '.local/share/opencode/opencode.db');

if (!port || !serviceToken) {
  console.error('OPENCHAMBER_SERVICE_PORT and OPENCHAMBER_SERVICE_TOKEN are required');
  process.exit(1);
}

const CODEX_USAGE_URL = 'https://chatgpt.com/backend-api/wham/usage';
const CLAUDE_USAGE_URL = 'https://api.anthropic.com/api/oauth/usage';
const CLAUDE_OAUTH_BETA = 'oauth-2025-04-20';
const CODEX_METHODS = new Set(['chatgpt-browser', 'chatgpt-headless']);
const MAX_BODY_BYTES = 64 * 1024;
const MAX_ERROR_LENGTH = 2_000;
// Anthropic rate-limits its usage endpoint hard; Codex is gentler.
// How often each account is re-read in the background. Codex and Zen are
// remote calls; custom providers are local. Claude's endpoint interval applies
// only when there is no saved reply data (see readClaude).
const CACHE_MS = { codex: 120_000, claude: 600_000, zen: 300_000, custom: 10_000 };
const FORCE_FLOOR_MS = { codex: 0, claude: 120_000, zen: 15_000, custom: 0 };
const FORCE_MIN_MS = 15_000;
const CLAUDE_COOLDOWN_DEFAULT_MS = 5 * 60_000;
const CLAUDE_COOLDOWN_MAX_MS = 60 * 60_000;

// ---------------------------------------------------------------- helpers

const finiteNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

/** Seconds, milliseconds, or an ISO string → epoch ms. */
const timestampMs = (value) => {
  if (typeof value === 'string' && value && !/^\d+(\.\d+)?$/.test(value)) {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  const number = finiteNumber(value);
  if (number === null || number < 0) return null;
  return number < 10_000_000_000 ? Math.round(number * 1_000) : Math.round(number);
};

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const errorText = (error) => (error instanceof Error ? error.message : String(error));

const windowLabel = (seconds, fallback) => {
  if (seconds === 5 * 3600) return '5-Hour';
  if (seconds === 7 * 86400) return 'Weekly';
  if (seconds && seconds % 86400 === 0) return `${seconds / 86400}-Day`;
  if (seconds && seconds % 3600 === 0) return `${seconds / 3600}-Hour`;
  return fallback;
};

const makeWindow = (label, usedPercent, resetAt, windowSeconds) => ({
  label,
  usedPercent: usedPercent === null ? null : Math.max(0, usedPercent),
  resetAt: resetAt ?? null,
  windowSeconds: windowSeconds ?? null,
});

// ---------------------------------------------------------------- Codex

const codexAccountIdFromToken = (token) => {
  const encoded = String(token ?? '').split('.')[1];
  if (!encoded) return null;
  try {
    const claims = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return claims.chatgpt_account_id
      ?? claims['https://api.openai.com/auth']?.chatgpt_account_id
      ?? claims.organizations?.[0]?.id
      ?? null;
  } catch {
    return null;
  }
};

const readCodexAccounts = () => {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  try {
    const rows = database.prepare(`
      SELECT id, label, value, active
      FROM credential
      WHERE integration_id = 'openai'
      ORDER BY label COLLATE NOCASE, id
    `).all();
    const accounts = [];
    for (const row of rows) {
      let credential;
      try {
        credential = JSON.parse(String(row.value));
      } catch {
        continue;
      }
      if (credential?.type !== 'oauth' || !CODEX_METHODS.has(credential.methodID)) continue;
      const access = typeof credential.access === 'string' ? credential.access : '';
      if (!access) continue;
      accounts.push({
        key: `codex:${row.id}`,
        provider: 'codex',
        label: String(row.label || 'OpenAI account'),
        active: Boolean(row.active),
        access,
        accountId: credential.metadata?.accountID ?? codexAccountIdFromToken(access),
      });
    }
    return accounts;
  } finally {
    database.close();
  }
};

const fetchCodexUsage = async (account) => {
  const response = await fetch(CODEX_USAGE_URL, {
    method: 'GET',
    redirect: 'error',
    headers: {
      authorization: `Bearer ${account.access}`,
      accept: 'application/json',
      ...(account.accountId ? { 'ChatGPT-Account-Id': account.accountId } : {}),
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status === 401 || response.status === 403) {
    throw new Error('Sign-in expired. Select this account under Providers and sign in again.');
  }
  if (!response.ok) throw new Error(`Usage service answered HTTP ${response.status}`);
  const payload = await response.json();

  const windows = [];
  const addRate = (raw, fallback) => {
    if (!raw) return;
    const used = finiteNumber(raw.used_percent);
    if (used === null) return;
    const seconds = finiteNumber(raw.limit_window_seconds);
    const resetAfter = finiteNumber(raw.reset_after_seconds);
    const resetAt = timestampMs(raw.reset_at)
      ?? (resetAfter !== null ? Date.now() + resetAfter * 1_000 : null);
    windows.push(makeWindow(windowLabel(seconds, fallback), used, resetAt, seconds));
  };
  addRate(payload?.rate_limit?.primary_window, '5-Hour');
  addRate(payload?.rate_limit?.secondary_window, 'Weekly');

  // A zero balance on an account that never bought credits is noise.
  const credits = payload?.credits;
  const balance = finiteNumber(credits?.balance);
  let creditsLabel = null;
  if (credits?.unlimited) creditsLabel = 'Unlimited';
  else if (balance !== null && balance > 0) creditsLabel = String(balance);

  // Usage resets the account holds. `applicable_available_count` is how many
  // can be used right now: 0 while under the limits, 1 once the account hit
  // one (checked 2026-11-16 on a maxed and two unmaxed accounts). Undocumented.
  const resetCredits = payload?.rate_limit_reset_credits;
  const available = finiteNumber(resetCredits?.available_count);
  const resets = available !== null && available > 0
    ? { available, usable: Math.max(0, finiteNumber(resetCredits?.applicable_available_count) ?? 0) }
    : null;

  return {
    windows,
    credits: creditsLabel,
    resets,
    plan: typeof payload?.plan_type === 'string' ? payload.plan_type : null,
  };
};

// ---------------------------------------------------------------- Claude

/**
 * Claude Code keeps one login per config dir. The default dir is what a plain
 * `claude` uses, so it is the active one; others are `CLAUDE_CONFIG_DIR`
 * logins named ~/.claude-<name>.
 */
const readClaudeAccounts = () => {
  const candidates = [{ dir: path.join(home, '.claude'), profile: path.join(home, '.claude.json'), active: true }];
  let entries = [];
  try {
    entries = fs.readdirSync(home, { withFileTypes: true });
  } catch {
    entries = [];
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('.claude-')) continue;
    const dir = path.join(home, entry.name);
    candidates.push({ dir, profile: path.join(dir, '.claude.json'), active: false });
  }

  const accounts = [];
  const seen = new Set();
  for (const candidate of candidates) {
    const oauth = readJson(path.join(candidate.dir, '.credentials.json'))?.claudeAiOauth;
    const access = typeof oauth?.accessToken === 'string' ? oauth.accessToken : '';
    if (!access) continue;
    const profile = readJson(candidate.profile)?.oauthAccount ?? {};
    const identity = profile.accountUuid ?? profile.emailAddress ?? candidate.dir;
    if (seen.has(identity)) continue;
    seen.add(identity);
    accounts.push({
      key: `claude:${candidate.dir}`,
      provider: 'claude',
      label: String(profile.emailAddress || path.basename(candidate.dir).replace(/^\.claude-?/, '') || 'Claude'),
      active: candidate.active,
      access,
      plan: typeof oauth.subscriptionType === 'string' ? oauth.subscriptionType : null,
    });
  }
  return accounts;
};

/** key → { until, strikes }: back-off after consecutive 429s. */
const claudeCooldowns = new Map();

/**
 * Anthropic answers 429 with `retry-after: 0` (observed 2026-11-14), so the
 * header rarely helps. Back off 5 → 10 → 20 → 40 → 60 min on consecutive 429s,
 * the same 5 min floor / 1 h cap Claude Code itself uses; reset on success.
 */
const cooldownFrom = (response, strikes) => {
  const raw = response.headers.get('retry-after');
  const seconds = raw === null ? null : finiteNumber(raw);
  const backoff = Math.min(CLAUDE_COOLDOWN_DEFAULT_MS * 2 ** Math.max(0, strikes - 1), CLAUDE_COOLDOWN_MAX_MS);
  const hinted = seconds !== null && seconds > 0 ? Math.min(seconds * 1_000, CLAUDE_COOLDOWN_MAX_MS) : 0;
  return Math.max(backoff, hinted);
};

const fetchClaudeUsage = async (account) => {
  const cooldown = claudeCooldowns.get(account.key);
  if (cooldown && cooldown.until > Date.now()) {
    throw Object.assign(new Error('Rate limited by Anthropic. Retrying soon.'), { keepLast: true });
  }
  // `skip_spend=1` is the lighter read Claude Code uses when it only needs the windows.
  const response = await fetch(`${CLAUDE_USAGE_URL}?skip_spend=1`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${account.access}`,
      'anthropic-beta': CLAUDE_OAUTH_BETA,
      accept: 'application/json',
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status === 429) {
    const strikes = (cooldown?.strikes ?? 0) + 1;
    claudeCooldowns.set(account.key, { until: Date.now() + cooldownFrom(response, strikes), strikes });
    throw Object.assign(new Error('Rate limited by Anthropic. Retrying soon.'), { keepLast: true });
  }
  claudeCooldowns.delete(account.key);
  if (response.status === 401) {
    throw new Error('Sign-in expired. Run Claude Code with this account to sign in again.');
  }
  if (response.status === 403) {
    throw new Error('This Claude token cannot read usage. Sign in with Claude Code /login.');
  }
  if (!response.ok) throw new Error(`Anthropic answered HTTP ${response.status}`);
  const payload = await response.json();

  const windows = [];
  const limits = Array.isArray(payload?.limits) ? payload.limits : [];
  if (limits.length > 0) {
    const scoped = [];
    for (const limit of limits) {
      const percent = finiteNumber(limit?.percent);
      if (percent === null) continue;
      const resetAt = timestampMs(limit.resets_at);
      if (limit.kind === 'session') windows.push(makeWindow('5-Hour', percent, resetAt, 5 * 3600));
      else if (limit.kind === 'weekly_all') windows.push(makeWindow('Weekly', percent, resetAt, 7 * 86400));
      else if (limit.kind === 'weekly_scoped') {
        const model = limit.scope?.model?.display_name;
        if (typeof model === 'string' && model) {
          scoped.push(makeWindow(`${model} · Weekly`, percent, resetAt, 7 * 86400));
        }
      }
    }
    windows.push(...scoped);
  } else {
    const fiveHour = payload?.five_hour;
    const sevenDay = payload?.seven_day;
    const fivePercent = finiteNumber(fiveHour?.utilization);
    const sevenPercent = finiteNumber(sevenDay?.utilization);
    if (fivePercent !== null) windows.push(makeWindow('5-Hour', fivePercent, timestampMs(fiveHour.resets_at), 5 * 3600));
    if (sevenPercent !== null) windows.push(makeWindow('Weekly', sevenPercent, timestampMs(sevenDay.resets_at), 7 * 86400));
  }
  return { windows, credits: null, plan: account.plan };
};

// ---------------------------------------------------------------- OpenCode Zen

const ZEN_API = 'https://opencode.ai/console/api';
// Free models share one account-wide pool. OpenCode doesn't publish the size;
// 50 requests per rolling 24 h is what its API enforced when tested 2026-11-14.
const ZEN_FREE_DAILY_LIMIT = 50;
const ZEN_PAGE_SIZE = 50;

/** Console sign-ins (and API keys) saved on OpenCode's `opencode` integration. */
const readZenAccounts = () => {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  try {
    const rows = database.prepare(`
      SELECT id, label, value, active FROM credential
      WHERE integration_id = 'opencode'
      ORDER BY label COLLATE NOCASE, id
    `).all();
    const accounts = [];
    for (const row of rows) {
      let credential;
      try {
        credential = JSON.parse(String(row.value));
      } catch {
        continue;
      }
      const meta = credential?.metadata ?? {};
      let token = '';
      let orgID = null;
      if (credential?.type === 'oauth' && typeof credential.access === 'string'
        && String(meta.server ?? '').startsWith('https://opencode.ai/console')) {
        token = credential.access;
        orgID = typeof meta.orgID === 'string' ? meta.orgID : null;
      } else if (credential?.type === 'api' && typeof credential.key === 'string') {
        token = credential.key;
      }
      if (!token) continue;
      accounts.push({
        key: `zen:${row.id}`,
        provider: 'zen',
        label: String(meta.email || row.label || 'OpenCode'),
        active: Boolean(row.active),
        token,
        orgID,
      });
    }
    return accounts;
  } finally {
    database.close();
  }
};

const zenJson = async (account, apiPath) => {
  const response = await fetch(`${ZEN_API}${apiPath}`, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${account.token}`,
      'x-opencode-session': 'accounts-usage',
      ...(account.orgID ? { 'x-org-id': account.orgID } : {}),
    },
    // The token belongs to opencode.ai; never follow a redirect elsewhere.
    redirect: 'error',
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status === 401 || response.status === 403) {
    throw new Error('Sign-in expired. Sign in to OpenCode again under Providers.');
  }
  if (!response.ok) throw new Error(`OpenCode Console answered HTTP ${response.status}`);
  return response.json();
};

/** Sums one range of `/usage/models` into free requests and paid spend (USD). */
const zenRange = async (account, range) => {
  let free = 0;
  let paidRequests = 0;
  let paidMicroCents = 0;
  for (let page = 1, pageCount = 1; page <= pageCount && page <= 20; page++) {
    const payload = await zenJson(account, `/usage/models?range=${range}&page=${page}&pageSize=${ZEN_PAGE_SIZE}`);
    if (!Array.isArray(payload?.items)) throw new Error('OpenCode Console usage could not be read');
    pageCount = Number.isSafeInteger(payload.pageInfo?.pageCount) ? payload.pageInfo.pageCount : 1;
    for (const item of payload.items) {
      // The workspace can also serve OpenCode Go; only Zen rows count here.
      if (item?.provider !== 'opencode') continue;
      const requests = finiteNumber(item.totalRequests) ?? 0;
      if (String(item.model ?? '').endsWith('-free')) free += requests;
      else {
        paidRequests += requests;
        paidMicroCents += finiteNumber(item.totalCostMicroCents) ?? 0;
      }
    }
  }
  return { free, paidRequests, paidUsd: paidMicroCents / 100_000_000 };
};

const fetchZenUsage = async (account) => {
  const [day, month] = await Promise.all([zenRange(account, '24h'), zenRange(account, '30d')]);
  // The Console's "24h" range is the current UTC day, not a rolling 24 h: on
  // 2026-11-15 at 05:48 UTC it read 0 for requests made 14:00-16:30 UTC the day
  // before. So the free pool resets at the next UTC midnight.
  const now = new Date();
  const nextUtcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  const windows = [{
    label: 'Free requests',
    usedPercent: Math.min(100, (day.free / ZEN_FREE_DAILY_LIMIT) * 100),
    valueLabel: `${day.free} / ${ZEN_FREE_DAILY_LIMIT}`,
    resetAt: nextUtcMidnight,
    windowSeconds: 86400,
  }];
  if (month.paidRequests > 0) {
    windows.push({
      label: 'Paid',
      sub: '30d',
      usedPercent: null,
      valueLabel: `$${month.paidUsd.toFixed(2)}`,
      resetAt: null,
      windowSeconds: 30 * 86400,
    });
  }
  return { windows, credits: null, plan: null };
};

// ---------------------------------------------------------------- custom providers (cost)

// Providers this extension already shows by usage, or that are OpenCode
// built-ins; every other provider with a saved credential counts as custom.
const NOT_CUSTOM = new Set(['openai', 'opencode', 'opencode-go', 'claude-agent', 'anthropic', 'claude']);
const CONFIG_FILE = path.join(home, '.config', 'openchamber-accounts-usage', 'config.json');

/**
 * Prices live in the extension's config file, per 1M tokens:
 *   { "customProviders": { "my-provider": { "name": "My Provider", "currency": "$",
 *       "input": 0.3, "output": 1.2, "cacheRead": 0.03, "cacheWrite": 0.375,
 *       "reasoning": 1.2, "hidden": false } } }
 * `reasoning` defaults to the output price; missing prices count as unset.
 */
const readConfig = () => readJson(CONFIG_FILE) ?? {};

const price = (value) => {
  const number = finiteNumber(value);
  return number !== null && number >= 0 ? number : null;
};

/**
 * OpenCode keeps the full models.dev price catalog in its `kv` table and
 * refreshes it from the cloud itself. Custom providers with no configured
 * prices are priced from it, so a new machine needs no config file for
 * well-known models.
 */
const CATALOG_KEY = 'models-dev:v2:catalog';
let catalogCache = { digest: null, models: null };

const loadCatalog = () => {
  let head;
  let full;
  try {
    const database = new DatabaseSync(databasePath, { readOnly: true });
    try {
      // Read only the header first; re-parse the ~12 MB body only when the
      // digest changed.
      head = database.prepare('SELECT substr(value, 1, 200) AS head FROM kv WHERE key = ?').get(CATALOG_KEY);
      if (!head) return catalogCache.models;
      const digest = /"digest":"([^"]+)"/.exec(head.head)?.[1] ?? null;
      if (catalogCache.models && digest === catalogCache.digest) return catalogCache.models;
      full = database.prepare('SELECT value FROM kv WHERE key = ?').get(CATALOG_KEY).value;
    } finally {
      database.close();
    }
  } catch {
    // No kv table (older OpenCode) or unreadable: keep whatever we had.
    return catalogCache.models;
  }
  const models = new Map();
  try {
    const body = JSON.parse(JSON.parse(full).body);
    for (const [providerId, provider] of Object.entries(body)) {
      for (const [modelId, model] of Object.entries(provider?.models ?? {})) {
        // Two shapes exist: the flat `{ input, output, cache_read }` of the
        // public API and OpenCode's cached per-modality form
        // `{ text: { input: { price, cache: { read, write } }, output: … } }`.
        const cost = model?.cost;
        if (!cost) continue;
        const flat = price(cost.input) !== null;
        const text = cost.text ?? Object.values(cost)[0];
        const input = flat ? price(cost.input) : price(text?.input?.price);
        const output = flat ? price(cost.output) : price(text?.output?.price);
        if (input === null || output === null) continue;
        const key = String(modelId).toLowerCase();
        if (!models.has(key)) models.set(key, []);
        models.get(key).push({
          provider: String(providerId),
          input,
          output,
          cacheRead: flat ? price(cost.cache_read) : price(text?.input?.cache?.read),
          cacheWrite: flat ? price(cost.cache_write) : price(text?.input?.cache?.write),
        });
      }
    }
  } catch {
    return catalogCache.models;
  }
  catalogCache = { digest: /"digest":"([^"]+)"/.exec(head.head)?.[1] ?? null, models };
  return models;
};

/**
 * Longest catalog model id that prefixes the reply's model id, so quantised
 * or variant names (qwen3.8-flash-next-huihui-v2-...) price as their base
 * model. Ties resolve to the alphabetically first provider, deterministically.
 */
const catalogPriceForModel = (modelId) => {
  const models = loadCatalog();
  if (!models || !modelId) return null;
  const id = String(modelId).toLowerCase();
  let best = null;
  for (const [key, entries] of models) {
    if (!id.startsWith(key)) continue;
    const rest = id.slice(key.length);
    if (rest && !/^[-@:]/.test(rest)) continue;
    if (!best || key.length > best.key.length) best = { key, entries };
    else if (key.length === best.key.length) best.entries = best.entries.concat(entries);
  }
  if (!best) return null;
  // $0/$0 rows are usually "unpriced" placeholders (e.g. amd), not real free
  // tiers; prefer a priced reseller, then the alphabetically first provider.
  const chosen = [...best.entries].sort((a, b) =>
    ((a.input === 0 && a.output === 0) - (b.input === 0 && b.output === 0))
    || a.provider.localeCompare(b.provider))[0];
  return { ...chosen, label: `models.dev ${chosen.provider}/${best.key}` };
};

const compactTokens = (count) => {
  if (count >= 1e9) return `${(count / 1e9).toFixed(1)}B`;
  if (count >= 1e6) return `${(count / 1e6).toFixed(1)}M`;
  if (count >= 1e3) return `${(count / 1e3).toFixed(count >= 1e5 ? 0 : 1)}K`;
  return String(count);
};

const readCustomAccounts = () => {
  const settings = readConfig().customProviders ?? {};
  const database = new DatabaseSync(databasePath, { readOnly: true });
  try {
    const rows = database.prepare(`
      SELECT integration_id AS id, MAX(active) AS active FROM credential GROUP BY integration_id
    `).all();
    return rows
      .filter((row) => !NOT_CUSTOM.has(row.id) && !settings[row.id]?.hidden)
      .map((row) => ({
        key: `custom:${row.id}`,
        provider: 'custom',
        integration: String(row.id),
        label: String(settings[row.id]?.name || row.id),
        active: false,
      }));
  } finally {
    database.close();
  }
};

/**
 * Append unseen endpoint replies to the extension's own lifetime ledger.
 * Each assistant message contains the API response's actual `tokens` usage.
 * Once added, usage stays in our ledger even if OpenCode compacts or prunes the
 * message later. This is not a sum of OpenCode's mutable session snapshots.
 */
/**
 * Some servers (llama.cpp/vLLM-style gateways) report no cached tokens at all,
 * so each agent turn's whole context counts as fresh input. A caching cloud
 * API would bill the part repeated from the session's previous turn as a
 * cache hit. Estimate that part: the previous prompt's size, when this prompt
 * continued it (did not shrink by >10%, as compaction or a new branch does).
 */
const SESSION_LAST_MAX = 300;
const noteCacheEstimate = (ledger, sessionId, input) => {
  if (!sessionId) return;
  ledger.sessionLast = ledger.sessionLast ?? {};
  ledger.estCacheRead = ledger.estCacheRead ?? 0;
  const last = ledger.sessionLast[sessionId];
  if (last !== undefined && input >= last * 0.9) ledger.estCacheRead += Math.min(last, input);
  delete ledger.sessionLast[sessionId];
  ledger.sessionLast[sessionId] = input;
  const ids = Object.keys(ledger.sessionLast);
  for (const id of ids.slice(0, Math.max(0, ids.length - SESSION_LAST_MAX))) delete ledger.sessionLast[id];
};

const fetchCustomUsage = async (account) => {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  const previous = customLedgers.get(account.integration);
  const ledger = previous
    ? { ...previous, lastIds: [...(previous.lastIds ?? [])] }
    : {
        replies: 0,
        input: 0,
        output: 0,
        reasoning: 0,
        cacheRead: 0,
        cacheWrite: 0,
        estCacheRead: 0,
        sessionLast: {},
        models: {},
        since: null,
        lastAt: 0,
        lastIds: [],
      };
  let rows;
  try {
    rows = database.prepare(`
      SELECT id, session_id AS sid, time_created AS at, data
      FROM session_message
      WHERE type = 'assistant'
        AND json_extract(data, '$.model.providerID') = ?
        AND time_created >= ?
      ORDER BY time_created, id
    `).all(account.integration, ledger.lastAt);
    // Ledgers from before cache estimation: replay the rows still present.
    if (previous && ledger.estCacheRead === undefined && ledger.since !== null) {
      ledger.estCacheRead = 0;
      ledger.sessionLast = {};
      const past = database.prepare(`
        SELECT session_id AS sid, json_extract(data, '$.tokens.input') AS input
        FROM session_message
        WHERE type = 'assistant'
          AND json_extract(data, '$.model.providerID') = ?
          AND json_extract(data, '$.time.completed') IS NOT NULL
          AND time_created >= ? AND time_created <= ?
        ORDER BY time_created, id
      `).all(account.integration, ledger.since, ledger.lastAt);
      for (const row of past) noteCacheEstimate(ledger, row.sid, Number(row.input) || 0);
    }
    // Ledgers written before per-model tracking: rebuild the model split from
    // the rows still present (older pruned rows only blur which model is top).
    if (!ledger.models) {
      const byModel = database.prepare(`
        SELECT COALESCE(json_extract(data, '$.model.id'), 'unknown') AS mid,
               SUM(COALESCE(json_extract(data, '$.tokens.input'), 0)
                 + COALESCE(json_extract(data, '$.tokens.output'), 0)
                 + COALESCE(json_extract(data, '$.tokens.reasoning'), 0)
                 + COALESCE(json_extract(data, '$.tokens.cache.read'), 0)
                 + COALESCE(json_extract(data, '$.tokens.cache.write'), 0)) AS tokens
        FROM session_message
        WHERE type = 'assistant' AND json_extract(data, '$.model.providerID') = ?
        GROUP BY mid
      `).all(account.integration);
      ledger.models = Object.fromEntries(byModel.map((row) => [String(row.mid), Number(row.tokens) || 0]));
    }
  } finally {
    database.close();
  }

  // Ledgers from before v2.5.1 recorded replies while they were still
  // streaming (tokens 0 or partial) and never revisited them. Lift each total
  // to at least what the rows still present since the ledger began add up to.
  if (previous && !ledger.completedOnly && ledger.since !== null) {
    const repairDb = new DatabaseSync(databasePath, { readOnly: true });
    try {
      const sums = repairDb.prepare(`
        SELECT count(*) AS replies,
               SUM(COALESCE(json_extract(data, '$.tokens.input'), 0)) AS input,
               SUM(COALESCE(json_extract(data, '$.tokens.output'), 0)) AS output,
               SUM(COALESCE(json_extract(data, '$.tokens.reasoning'), 0)) AS reasoning,
               SUM(COALESCE(json_extract(data, '$.tokens.cache.read'), 0)) AS cacheRead,
               SUM(COALESCE(json_extract(data, '$.tokens.cache.write'), 0)) AS cacheWrite
        FROM session_message
        WHERE type = 'assistant'
          AND json_extract(data, '$.model.providerID') = ?
          AND json_extract(data, '$.time.completed') IS NOT NULL
          AND time_created >= ? AND time_created <= ?
      `).get(account.integration, ledger.since, ledger.lastAt);
      for (const key of ['replies', 'input', 'output', 'reasoning', 'cacheRead', 'cacheWrite']) {
        ledger[key] = Math.max(ledger[key] ?? 0, Number(sums?.[key]) || 0);
      }
    } finally {
      repairDb.close();
    }
  }
  ledger.completedOnly = true;

  // A reply's tokens are final only once OpenCode stamps `time.completed`.
  // Stop at the first unfinished one so the cursor never skips past it; one
  // left unfinished for over an hour (crashed run) is taken as it stands.
  const STALE_UNFINISHED_MS = 60 * 60 * 1000;
  for (const row of rows) {
    if (row.at === ledger.lastAt && ledger.lastIds.includes(row.id)) continue;
    let message;
    try {
      message = JSON.parse(row.data);
    } catch {
      continue;
    }
    if (message?.time?.completed == null && Date.now() - row.at < STALE_UNFINISHED_MS) break;
    if (row.at > ledger.lastAt) {
      ledger.lastAt = row.at;
      ledger.lastIds = [];
    }
    const tokens = message?.tokens ?? {};
    const replyTokens = Math.max(0, finiteNumber(tokens.input) ?? 0)
      + Math.max(0, finiteNumber(tokens.output) ?? 0)
      + Math.max(0, finiteNumber(tokens.reasoning) ?? 0)
      + Math.max(0, finiteNumber(tokens.cache?.read) ?? 0)
      + Math.max(0, finiteNumber(tokens.cache?.write) ?? 0);
    noteCacheEstimate(ledger, row.sid, Math.max(0, finiteNumber(tokens.input) ?? 0));
    ledger.input += Math.max(0, finiteNumber(tokens.input) ?? 0);
    ledger.output += Math.max(0, finiteNumber(tokens.output) ?? 0);
    ledger.reasoning += Math.max(0, finiteNumber(tokens.reasoning) ?? 0);
    ledger.cacheRead += Math.max(0, finiteNumber(tokens.cache?.read) ?? 0);
    ledger.cacheWrite += Math.max(0, finiteNumber(tokens.cache?.write) ?? 0);
    const modelId = String(message?.model?.id ?? 'unknown');
    ledger.models = ledger.models ?? {};
    ledger.models[modelId] = (ledger.models[modelId] ?? 0) + replyTokens;
    ledger.replies += 1;
    ledger.since = ledger.since === null ? row.at : Math.min(ledger.since, row.at);
    ledger.lastIds.push(row.id);
  }
  customLedgers.set(account.integration, ledger);
  const totals = ledger;

  const settings = readConfig().customProviders?.[account.integration] ?? {};
  let prices = {
    input: price(settings.input),
    output: price(settings.output),
    cacheRead: price(settings.cacheRead),
    cacheWrite: price(settings.cacheWrite),
  };
  prices.reasoning = price(settings.reasoning) ?? prices.output;
  let pricedAs = typeof settings.pricedAs === 'string' ? settings.pricedAs : null;
  if (prices.input === null || prices.output === null) {
    const topModel = Object.entries(ledger.models ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const auto = catalogPriceForModel(topModel);
    if (auto) {
      prices = { input: auto.input, output: auto.output, cacheRead: auto.cacheRead, cacheWrite: auto.cacheWrite };
      prices.reasoning = auto.output;
      pricedAs = auto.label;
    }
  }
  const priced = prices.input !== null && prices.output !== null;
  // Default: estimate only for providers that never report cache tokens.
  const reportsCache = totals.cacheRead > 0 || totals.cacheWrite > 0;
  const estimateCache = (typeof settings.estimateCache === 'boolean' ? settings.estimateCache : !reportsCache)
    && prices.cacheRead !== null && (totals.estCacheRead ?? 0) > 0;
  const estCached = estimateCache ? Math.min(totals.estCacheRead, totals.input) : 0;
  const costOf = (cached) => (
    (totals.input - cached) * prices.input
    + cached * prices.cacheRead
    + totals.output * prices.output
    + totals.reasoning * prices.reasoning
    + totals.cacheRead * (prices.cacheRead ?? 0)
    + totals.cacheWrite * (prices.cacheWrite ?? 0)) / 1e6;
  const cost = priced ? costOf(estCached) : null;
  const currency = typeof settings.currency === 'string' && settings.currency ? settings.currency : '$';
  if (priced && estCached > 0) {
    pricedAs = `${pricedAs ? `${pricedAs}; ` : ''}${compactTokens(estCached)} of input estimated as cache hits`
      + ` (the provider reports none); without caching ${currency}${costOf(0).toFixed(2)}`;
  }
  const since = totals.since
    ? new Date(totals.since).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;
  const allTokens = totals.input + totals.output + totals.reasoning + totals.cacheRead + totals.cacheWrite;

  return {
    windows: [
      {
        label: 'Cost',
        sub: since ? `since ${since}` : 'no use yet',
        usedPercent: null,
        valueLabel: cost === null ? '—' : `${currency}${cost.toFixed(2)}`,
        resetAt: null,
        windowSeconds: null,
      },
      {
        label: 'Tokens',
        // Kept short so the "Tokens" label is never truncated; the cache
        // estimate is in the hover (pricedAs).
        // Share of prompt tokens served from cache: reported cache reads, or
        // the estimate for providers that report none (hover says which).
        sub: (() => {
          const prompt = totals.input + totals.cacheRead + totals.cacheWrite;
          const cached = totals.cacheRead + estCached;
          const share = prompt > 0 && cached > 0
            ? ` · ${Math.round((100 * cached) / prompt)}% cached`
            : '';
          return `${compactTokens(prompt)} in${share} · ${compactTokens(totals.output + totals.reasoning)} out`;
        })(),
        usedPercent: null,
        valueLabel: compactTokens(allTokens),
        resetAt: null,
        windowSeconds: null,
      },
    ],
    credits: null,
    plan: null,
    pricedAs,
    note: priced ? null : `No price found for ${account.label}; set one in ~/.config/openchamber-accounts-usage/config.json`,
  };
};

// ---------------------------------------------------------------- aggregation

/** key → { at, result } — the last good reading per account. */
const cache = new Map();
/** provider id → append-only endpoint-usage ledger and message cursor. */
const customLedgers = new Map();
let pending = null;
let lastForcedAt = 0;

// Last readings and Claude back-off survive a service restart (OpenChamber
// stops idle services and restarts them on pause/resume), so a restart neither
// blanks the section nor spends a fresh request on a rate-limited account.
// Holds usage numbers, aggregate custom-provider token totals and timestamps;
// never credentials, message content or per-reply data.
const STATE_FILE = path.join(home, '.cache', 'openchamber-accounts-usage', 'state.json');
const STATE_MAX_AGE_MS = 24 * 3600 * 1000;

const loadState = () => {
  const state = readJson(STATE_FILE);
  if (!state) return;
  const now = Date.now();
  for (const [key, entry] of Object.entries(state.cache ?? {})) {
    // Rebuild custom-provider display rows from the append-only ledger on every
    // start; never show a cached result from the old mutable-session scheme.
    if (key.startsWith('custom:')) continue;
    if (entry && typeof entry.at === 'number' && now - entry.at < STATE_MAX_AGE_MS) cache.set(key, entry);
  }
  for (const [key, entry] of Object.entries(state.cooldowns ?? {})) {
    if (entry && typeof entry.until === 'number' && entry.until > now) claudeCooldowns.set(key, entry);
  }
  for (const [key, entry] of Object.entries(state.customLedgers ?? {})) {
    if (entry && typeof entry === 'object') customLedgers.set(key, entry);
  }
};

const saveState = () => {
  try {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true, mode: 0o700 });
    const temp = `${STATE_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(temp, JSON.stringify({
      cache: Object.fromEntries(cache),
      cooldowns: Object.fromEntries(claudeCooldowns),
      customLedgers: Object.fromEntries(customLedgers),
    }), { mode: 0o600 });
    fs.renameSync(temp, STATE_FILE);
  } catch {
    // Persistence is best-effort; the in-memory state still works.
  }
};

loadState();

// ---------------------------------------------------------------- Claude from saved replies

/**
 * Every Claude reply carries Anthropic's live window utilization in its
 * `anthropic-ratelimit-unified-*` headers; Claude Code forwards them as a
 * `rate_limit_event`, and OpenCode saves them on the assistant message as
 * `native.rateLimit.unifiedWindows` (found 2026-11-16). Reading the newest one
 * costs no request and is exact as of the last reply. It belongs to the login
 * OpenCode's claude-agent uses, i.e. the default (active) Claude account.
 */
const readClaudeLocal = () => {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  let row;
  try {
    row = database.prepare(`
      SELECT time_created AS at, json_extract(data, '$.native.rateLimit.unifiedWindows') AS windows
      FROM session_message
      WHERE type = 'assistant'
        AND json_extract(data, '$.model.providerID') = 'claude-agent'
        AND json_extract(data, '$.native.rateLimit.unifiedWindows') IS NOT NULL
      ORDER BY time_created DESC
      LIMIT 1
    `).get();
  } finally {
    database.close();
  }
  if (!row) return null;
  let raw;
  try {
    raw = JSON.parse(row.windows);
  } catch {
    return null;
  }
  const windows = [];
  const add = (label, entry, seconds) => {
    const utilization = finiteNumber(entry?.utilization);
    if (utilization === null) return;
    windows.push(makeWindow(label, utilization * 100, timestampMs(entry.resetsAt), seconds));
  };
  add('5-Hour', raw.five_hour, 5 * 3600);
  add('Weekly', raw.seven_day, 7 * 86400);
  return windows.length ? { at: Number(row.at), windows } : null;
};

/** With saved reply data at hand, the usage endpoint is only a backup. */
const CLAUDE_ENDPOINT_BACKUP_MS = 30 * 60_000;
const CLAUDE_LOCAL_STALE_MS = 15 * 60_000;

const readClaude = async (account, force) => {
  let local = null;
  if (account.active) {
    try {
      local = readClaudeLocal();
    } catch {
      local = null;
    }
  }
  const endpoint = await readAccount(account, force, local ? CLAUDE_ENDPOINT_BACKUP_MS : null);
  if (!local) return endpoint;
  const endpointAt = endpoint.stale ? 0 : (endpoint.updatedAt ?? 0);
  if (endpointAt > local.at) return endpoint;
  // Per-model weekly limits (e.g. "Fable · Weekly") only come from the endpoint.
  const scoped = (endpoint.windows ?? []).filter((window) => window.label !== '5-Hour' && window.label !== 'Weekly');
  return {
    windows: [...local.windows, ...scoped],
    credits: null,
    plan: endpoint.plan ?? null,
    error: null,
    source: 'replies',
    stale: Date.now() - local.at > CLAUDE_LOCAL_STALE_MS,
    retryAt: null,
    updatedAt: local.at,
  };
};

const readAccount = async (account, force, ttlOverride = null) => {
  const cached = cache.get(account.key);
  // A forced refresh still keeps Claude at most one read per 2 min.
  const ttl = force ? FORCE_FLOOR_MS[account.provider] : (ttlOverride ?? CACHE_MS[account.provider]);
  if (cached && Date.now() - cached.at < ttl) return cached.result;
  try {
    const fetcher = {
      codex: fetchCodexUsage, claude: fetchClaudeUsage, zen: fetchZenUsage, custom: fetchCustomUsage,
    }[account.provider];
    const usage = await fetcher(account);
    const result = { ...usage, error: null, updatedAt: Date.now() };
    cache.set(account.key, { at: Date.now(), result });
    saveState();
    return result;
  } catch (error) {
    saveState();
    // A rate limit keeps the last good numbers on screen, marked stale; the
    // section shows their age instead of an error. With no reading yet it says
    // when the next try is, rather than showing an error.
    const retryAt = claudeCooldowns.get(account.key)?.until ?? null;
    if (error?.keepLast && cached) return { ...cached.result, error: null, stale: true, retryAt };
    if (error?.keepLast) return { windows: [], credits: null, plan: null, error: null, waiting: true, retryAt, updatedAt: null };
    return { windows: [], credits: null, plan: null, error: errorText(error), updatedAt: null };
  }
};

const discover = () => {
  const accounts = [];
  const problems = [];
  try {
    accounts.push(...readClaudeAccounts());
  } catch (error) {
    problems.push(`Claude: ${errorText(error)}`);
  }
  try {
    accounts.push(...readCodexAccounts());
  } catch (error) {
    problems.push(`Codex: could not read OpenCode accounts (${errorText(error)})`);
  }
  try {
    accounts.push(...readZenAccounts());
  } catch (error) {
    problems.push(`OpenCode Zen: could not read OpenCode accounts (${errorText(error)})`);
  }
  try {
    accounts.push(...readCustomAccounts());
  } catch (error) {
    problems.push(`Custom providers: could not read OpenCode data (${errorText(error)})`);
  }
  return { accounts, problems };
};

const collectUncoalesced = async (force) => {
  const { accounts, problems } = discover();
  const readings = await Promise.all(accounts.map(async (account) => {
    const result = account.provider === 'claude'
      ? await readClaude(account, force)
      : await readAccount(account, force);
    return {
      id: account.key,
      provider: account.provider,
      label: account.label,
      active: account.active,
      plan: result.plan ?? null,
      windows: result.windows,
      credits: result.credits,
      resets: result.resets ?? null,
      note: result.note ?? null,
      pricedAs: account.provider === 'custom'
        ? (result.pricedAs ?? readConfig().customProviders?.[account.integration]?.pricedAs ?? null)
        : null,
      error: result.error ? result.error.slice(0, 300) : null,
      stale: Boolean(result.stale),
      waiting: Boolean(result.waiting),
      retryAt: result.retryAt ?? null,
      source: result.source ?? null,
      updatedAt: result.updatedAt,
    };
  }));
  // Drop cached readings of accounts that no longer exist.
  const live = new Set(accounts.map((account) => account.key));
  for (const key of cache.keys()) if (!live.has(key)) cache.delete(key);
  return { accounts: readings, problems, readAt: Date.now() };
};

const collect = (force = false) => {
  if (force && Date.now() - lastForcedAt < FORCE_MIN_MS) force = false;
  if (force) lastForcedAt = Date.now();
  // Never overlap collectors: two custom-provider scans must not append the
  // same API reply twice.
  if (pending) return pending;
  const run = collectUncoalesced(force).finally(() => {
    if (pending === run) pending = null;
  });
  pending = run;
  return run;
};

// ---------------------------------------------------------------- background polling

/**
 * The service refreshes on its own: every tick it re-reads local data (saved
 * Claude replies, custom-provider tokens) and fetches each remote account only
 * when its CACHE_MS interval is due. Readers get the latest snapshot at once,
 * so opening the section never starts a rescan. `keepRunning` in the manifest
 * keeps this going while nobody is looking.
 */
// Local reply-ledger scans are cheap and run every 10 s. Remote providers keep
// their longer CACHE_MS intervals, so this does not increase API polling.
const TICK_MS = 10_000;
let snapshot = null;

const refresh = (force = false) => collect(force).then((data) => {
  snapshot = data;
  return data;
});

/** The latest snapshot; waits only when there is none yet or a refresh is forced. */
const current = (force = false) => (force || !snapshot ? refresh(force) : Promise.resolve(snapshot));

refresh().catch(() => {});
setInterval(() => refresh().catch(() => {}), TICK_MS);

// ---------------------------------------------------------------- quota card

const shortName = (label) => (label.includes('@') ? label.split('@')[0] : label);

const CARD_PROVIDER = { claude: 'Claude', codex: 'Codex', zen: 'Zen', custom: '' };
const CARD_WINDOWS_MAX = 32; // OpenChamber's quota schema bound

/** The Usage-page card: every account's rows, named "Codex work · 5-Hour". */
const toQuotaData = async () => {
  const { accounts, problems } = await current();
  if (accounts.length === 0) {
    return {
      ok: false,
      configured: true,
      error: (problems.join('; ') || 'No Codex, Claude or OpenCode Zen accounts are saved.').slice(0, MAX_ERROR_LENGTH),
      usage: null,
    };
  }
  const order = ['claude', 'codex', 'zen', 'custom'];
  const sorted = [...accounts].sort((a, b) => (
    order.indexOf(a.provider) - order.indexOf(b.provider)
    || a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' })
  ));
  const windows = {};
  const add = (key, window) => {
    if (Object.keys(windows).length < CARD_WINDOWS_MAX) windows[key] = window;
  };
  const failures = [];
  let successCount = 0;
  for (const account of sorted) {
    const name = [CARD_PROVIDER[account.provider], shortName(account.label)].filter(Boolean).join(' ')
      + (account.active ? ' ●' : '');
    if (account.windows.length === 0) {
      failures.push(`${name}: ${account.error ?? 'usage reads are rate-limited'}`);
      continue;
    }
    successCount += 1;
    for (const window of account.windows) {
      // A cached window that has reset since says nothing about now.
      if (window.resetAt && window.resetAt <= Date.now()) continue;
      add(`${name} · ${window.label}`, {
        usedPercent: window.usedPercent,
        ...(window.valueLabel ? { valueLabel: window.valueLabel } : {}),
        ...(window.windowSeconds ? { windowSeconds: window.windowSeconds } : {}),
        ...(window.resetAt ? { resetAt: window.resetAt } : {}),
      });
    }
    if (account.credits) add(`${name} · Credits`, { usedPercent: null, valueLabel: account.credits });
  }
  if (successCount === 0) {
    return { ok: false, configured: true, error: failures.join('; ').slice(0, MAX_ERROR_LENGTH), usage: null };
  }
  return {
    ok: true,
    configured: true,
    ...(failures.length ? { error: failures.join('; ').slice(0, MAX_ERROR_LENGTH) } : {}),
    planLabel: `${successCount}/${accounts.length} accounts`,
    usage: { windows },
  };
};

// ---------------------------------------------------------------- HTTP

const readBody = (request) => new Promise((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
    if (body.length > MAX_BODY_BYTES) request.destroy(new Error('request body too large'));
  });
  request.on('end', () => resolve(body));
  request.on('error', reject);
});

const validQuotaRequest = (body) => {
  try {
    const request = JSON.parse(body);
    return request?.v === 1
      && typeof request.requestId === 'string'
      && request.requestId.length > 0
      && request.method === 'usage.read'
      && typeof request.provider === 'string'
      && request.provider.length > 0
      && request.input
      && typeof request.input.credentials === 'object'
      && !Array.isArray(request.input.credentials);
  } catch {
    return false;
  }
};

const send = (response, status, body) => {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(JSON.stringify(body));
};

const server = http.createServer((request, response) => {
  if (request.headers.authorization !== `Bearer ${serviceToken}`) {
    send(response, 401, { error: 'unauthorized' });
    return;
  }
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');

  if (url.pathname === '/health') {
    send(response, 200, { ok: true });
    return;
  }

  if (url.pathname === '/accounts' && request.method === 'GET') {
    current(url.searchParams.get('force') === '1')
      .then((data) => send(response, 200, data))
      .catch((error) => send(response, 500, { error: errorText(error).slice(0, MAX_ERROR_LENGTH) }));
    return;
  }

  if (url.pathname === '/quota' && request.method === 'POST') {
    readBody(request)
      .then(async (body) => {
        if (!validQuotaRequest(body)) {
          send(response, 400, { ok: false, error: { message: 'not a supported usage request', status: 400 } });
          return;
        }
        send(response, 200, { ok: true, data: await toQuotaData() });
      })
      .catch(() => send(response, 500, { ok: false, error: { message: 'could not read the request', status: 500 } }));
    return;
  }

  send(response, 404, { error: 'not-found' });
});

server.listen(port, '127.0.0.1');
