// Work Status section: one block per saved account, grouped like the built-in
// provider blocks (header row, metrics indented under it).
// Built into ../main.js as a classic IIFE by ../../build.sh.
import { connectHost } from '@openchamber/sdk';
import { applyHostReady } from '@openchamber/sdk/ui';

const POLL_MS = 60_000;
const host = connectHost();
const root = document.getElementById('root');

let ready = false;
let controlsShown = false;
let timer = null;
let inFlight = null;
let lastData = null;
let lastError = null;

const ICONS = {
  // Generic glyphs (not provider logos): a terminal prompt for Codex, a spark for Claude.
  codex: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 6l6 6-6 6M12 18h8"/></svg>',
  claude: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/></svg>',
  // A plain square bracket pair for OpenCode.
  zen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 4H5v16h3M16 4h3v16h-3"/></svg>',
};
const PROVIDER_NAME = { codex: 'Codex', claude: 'Claude', zen: 'OpenCode Zen' };

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const shortName = (label) => (label.includes('@') ? label.split('@')[0] : label);

const formatReset = (resetAt) => {
  if (!resetAt) return '';
  const date = new Date(resetAt);
  if (Number.isNaN(date.getTime())) return '';
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (resetAt - Date.now() < 24 * 3600 * 1000) return time;
  const day = date.toLocaleDateString(undefined, { weekday: 'short' });
  return `${day} ${time}`;
};

const tone = (percent) => {
  if (percent === null || percent === undefined) return '';
  if (percent >= 90) return 'hot';
  if (percent >= 70) return 'warm';
  return '';
};

const metricRow = (label, sub, value, toneClass, title) => {
  const row = el('div', 'row');
  row.append(el('span', 'lab', label));
  if (sub) row.append(el('span', 'sub', sub));
  row.append(el('span', `val ${toneClass || ''}`.trim(), value));
  if (title) row.title = title;
  return row;
};

const render = () => {
  root.replaceChildren();

  if (!lastData) {
    root.append(el('div', 'empty', lastError ?? 'Loading accounts…'));
    fit();
    return;
  }

  const accounts = lastData.accounts ?? [];
  if (accounts.length === 0) {
    root.append(el('div', 'empty', 'No Codex or Claude accounts found.'));
  }

  // Claude first, then Codex, matching the Usage block's order; active first in each.
  const order = ['claude', 'codex', 'zen'];
  const sorted = [...accounts].sort((a, b) => (
    order.indexOf(a.provider) - order.indexOf(b.provider)
    || Number(b.active) - Number(a.active)
  ));

  for (const account of sorted) {
    const block = el('section', 'acct');
    const head = el('div', 'head');
    head.title = account.label;
    const icon = el('span', 'ic');
    icon.innerHTML = ICONS[account.provider] ?? '';
    head.append(icon, el('span', 'name', PROVIDER_NAME[account.provider] ?? account.provider));
    head.append(el('span', 'who', `· ${shortName(account.label)}`));
    if (account.active) head.append(el('span', 'badge', 'active'));
    if (account.resets) {
      const { available, usable } = account.resets;
      const resets = el('span', `resets ${usable > 0 ? 'usable' : ''}`.trim(), usable > 0 ? `↺ ${usable} usable` : `↺ ${available}`);
      resets.title = `${available} usage reset${available === 1 ? '' : 's'} on this account. `
        + (usable > 0
          ? `${usable} can be used now, since the account has hit its limit.`
          : 'A reset can only be used once the account hits its limit.');
      head.append(resets);
    }
    block.append(head);

    const body = el('div', 'body');
    for (const window of account.windows ?? []) {
      const percent = window.usedPercent;
      const reset = window.resetAt ? new Date(window.resetAt).toLocaleString() : '';
      // An old reading whose window has since reset says nothing about now.
      if (window.resetAt && window.resetAt <= Date.now()) {
        body.append(metricRow(window.label, 'reset', '—', '', `Reset ${reset}; waiting for a fresh reading`));
        continue;
      }
      const value = window.valueLabel ?? (percent === null ? '—' : `${Math.round(percent)}%`);
      const sub = window.sub ?? formatReset(window.resetAt);
      body.append(metricRow(window.label, sub, value, tone(percent), reset && `Resets ${reset}`));
    }
    if (account.credits) body.append(metricRow('Credits', '', account.credits));
    const nextTry = account.retryAt ? ` · next try ${formatReset(account.retryAt)}` : '';
    const limitedTip = 'Anthropic limits how often an account’s usage can be read, shared by every app that reads it '
      + '(Claude Code, OpenChamber’s Claude card, other devices). This does not affect using Claude.';
    if (account.stale && account.updatedAt) {
      const minutes = Math.max(1, Math.round((Date.now() - account.updatedAt) / 60_000));
      const age = minutes < 90 ? `${minutes} min` : `${Math.round(minutes / 60)} h`;
      const note = el('div', 'note', `Updated ${age} ago${nextTry}`);
      note.title = limitedTip;
      body.append(note);
    }
    if (account.waiting) {
      const note = el('div', 'note', `Usage reads are rate-limited${nextTry}`);
      note.title = limitedTip;
      body.append(note);
    }
    if (account.error) {
      const note = el('div', `note ${account.windows?.length ? '' : 'bad'}`.trim(), account.error);
      note.title = account.error;
      body.append(note);
    }
    block.append(body);
    root.append(block);
  }

  for (const problem of lastData.problems ?? []) root.append(el('div', 'note bad', problem));
  if (lastError) root.append(el('div', 'note bad', lastError));

  if (!controlsShown) {
    const refresh = el('button', 'refresh', 'Refresh');
    refresh.type = 'button';
    refresh.addEventListener('click', () => load(true));
    root.append(refresh);
  }
  fit();
};

const fit = () => {
  // Measure the content, not the document: scrollHeight never drops below the
  // frame's current height, so the section could only ever grow.
  const height = Math.ceil(root.getBoundingClientRect().height);
  host.setHeight(Math.max(24, height)).catch(() => {});
};

const load = (force = false) => {
  if (inFlight && !force) return inFlight;
  const run = host.serviceRequest({ method: 'GET', path: '/accounts', ...(force ? { query: { force: '1' } } : {}) })
    .then((response) => {
      const data = typeof response.body === 'string' ? JSON.parse(response.body || '{}') : response.body;
      if (response.status !== 200) throw new Error(data?.error ?? `Service answered HTTP ${response.status}`);
      lastData = data;
      lastError = null;
    })
    .catch((error) => {
      const code = error?.code;
      lastError = code === 'NO_SERVICE' || code === 'DISABLED'
        ? 'Approve this extension’s local service in Settings → Extensions.'
        : `Could not read accounts: ${error?.message ?? error}`;
    })
    .finally(() => {
      if (inFlight === run) inFlight = null;
      render();
    });
  inFlight = run;
  return run;
};

host.onStatusControl((event) => {
  if (event.id === 'refresh') load(true);
});

host.onReady((ctx) => {
  applyHostReady(ctx, document.documentElement);
  if (!ready) {
    ready = true;
    if (ctx.features?.statusControls) {
      host.setStatusControls([{ kind: 'button', id: 'refresh', label: 'Refresh' }])
        .then(() => {
          controlsShown = true;
          render();
        })
        .catch(() => {});
    }
    load();
    timer = setInterval(() => load(), POLL_MS);
  }
  render();
});

new ResizeObserver(fit).observe(root);
window.addEventListener('unload', () => clearInterval(timer));
