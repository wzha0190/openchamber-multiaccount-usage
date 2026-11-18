# Multi-Account Usage

Requires OpenChamber ≥ 2.7.1.

Adds a **Multi-Account Usage** section to the chat's Work Status panel with one block per
saved account, laid out like the built-in provider blocks:

```
⌁ Claude · alice      active
    5-Hour        4:30 AM   12%
    Weekly        9:00 AM    2%
› Codex · work       active
    5-Hour        12:02 AM 100%
    Weekly    Fri 7:03 PM   16%
› Codex · personal
    …
```

Accounts are discovered on every refresh, so adding or removing one needs no
change to the extension:

- **Codex**: every legacy ChatGPT browser/device-code login saved by OpenCode
  (`~/.local/share/opencode/opencode.db`, opened read-only). The name shown is
  the label OpenCode stores for the credential; rename it under Providers.
  The account OpenCode currently uses is marked *active*. The header shows
  the usage resets an account holds (`↺ 1`), in green as `↺ 1 usable` when
  the account has hit its limit and a reset can be used.
- **Claude**: Claude Code's default login (`~/.claude`, marked *active*) plus
  any `~/.claude-<name>` directory holding a `.credentials.json`. To add a
  second Claude account, sign in with
  `CLAUDE_CONFIG_DIR=~/.claude-work claude` and run `/login`. The name comes
  from that directory's `.claude.json`.

- **OpenCode Zen**: every OpenCode Console sign-in (or API key) saved on
  OpenCode's `opencode` integration. Shows **Free requests** today against
  the shared free-model pool (50/day, the limit OpenCode's API enforced when
  tested; it isn't published, so it's a constant in `service/main.js`), and
  **Paid** spend over 30 days when there is any. The Console's "24h" count is
  the current UTC day (it cleared well under 24 h after the requests), so the
  row shows the reset as the next UTC midnight. Data comes from the
  Console's undocumented `/usage/models` endpoint, the same one OpenChamber's
  built-in Zen card reads.

- **Custom providers** (any other provider with a saved OpenCode credential,
  e.g. an OpenAI-compatible endpoint): tracks **cost** instead of usage, since
  such APIs rarely report spend. Cost is estimated from the token counts
  OpenCode records on each immutable assistant reply × prices per 1M tokens.
  Prices come from `~/.config/openchamber-accounts-usage/config.json` (see
  `config.example.json`; `reasoning` defaults to the output price, `hidden`
  removes a provider) and otherwise fall back to the **models.dev catalog**,
  which OpenCode caches in its own database and keeps fresh from the cloud:
  the reply's most-used model id is matched against catalog ids by longest
  prefix, so quantised/variant names price as their base model (the hover
  says which catalog entry was used). Only if neither has a price does the
  block show tokens plus a note. A new machine therefore needs no config for
  well-known models.
  Only completed replies are recorded (`time.completed`), so streaming
  replies are never captured with partial token counts.
  **Cache estimate:** some gateways (llama.cpp/vLLM-style) report no cached
  tokens, so every agent turn's full context looks like fresh input. For such
  providers the part of each prompt repeated from the session's previous turn
  is priced at the cache-read rate, which is what a caching cloud API would charge.
  The hover shows the estimated amount and the no-cache total. Set
  `"estimateCache": false` to price all input as fresh, or `true` to force it.
  Totals run from the provider's first saved reply. The service appends every
  unseen API reply's actual returned token usage to its own persistent ledger;
  it never subtracts usage, even after OpenCode compacts or prunes that reply.
  The provider has no billing endpoint, so dollars are an estimate from this
  endpoint-usage ledger × the configured equivalent-model prices.

Percentages turn amber at 70 % and red at 90 %. Credits rows only appear when an
account has a positive or unlimited balance. ### Polling

The service keeps running (`keepRunning`) and scans local reply usage every
10 s. Each remote account is re-fetched only when its interval is due: Codex
2 min, OpenCode Zen 5 min, Claude's usage endpoint 10 min (30 min when reply
data covers it). The section just reads the latest snapshot, so opening it or
switching tabs never triggers a rescan. The header's Refresh button forces a
new read (at most every 15 s for Codex, 2 min for Claude).

### Claude without the usage endpoint

Every Claude reply carries Anthropic's live window utilization in
`anthropic-ratelimit-unified-*` response headers; Claude Code forwards them as
a `rate_limit_event`, and OpenCode stores them on the assistant message as
`native.rateLimit.unifiedWindows` (verified 2026-11-16). For the active Claude
account the section reads the newest one straight from OpenCode's database —
no request, no rate limit, exact as of the last reply. The usage endpoint then
runs only as a backup and for per-model weekly rows (e.g. `Fable · Weekly`);
its numbers are used only when fresher than the reply data. When reply data is
over 15 min old (Claude hasn't been used since), the block notes "As of your
last Claude reply" — those numbers don't move until you use that account again.

Anthropic's usage endpoint has an unpublished per-account limit that every
client reading it shares (Claude Code, OpenChamber's built-in Claude card, this
extension). Its 429s carry `retry-after: 0`, so after consecutive 429s the
service backs off 5 → 10 → 20 → 40 → 60 min, the same 5 min floor and 1 h cap
Claude Code uses, and keeps the last reading on screen as "Updated N min ago".

The extension also serves a **Multi-Account Usage** quota card (Usage page, header,
tray) listing every account's rows as `Codex work · 5-Hour`. To avoid
seeing them twice in Work Status, untick that card under the Usage block's
provider list.

## Security

- Tokens are sent only as bearer credentials to
  `https://chatgpt.com/backend-api/wham/usage` and
  `https://api.anthropic.com/api/oauth/usage`. They are never logged, returned
  to the UI, refreshed, or written anywhere.
- No token refresh: an idle account whose sign-in expired shows an error
  under its header. Sign it in again (Providers for Codex, Claude Code for Claude).
- Reading every Codex credential relies on OpenCode's internal SQLite schema;
  re-check after an OpenCode schema upgrade. `inspect-credentials.mjs` prints
  redacted schema/account metadata, never token values.

## Layout

| Path | Role |
|---|---|
| `service/main.js` | Local service: `GET /accounts` for the section, `POST /quota` for the card |
| `status/index.html`, `status/main.js` | Work Status section (built bundle) |
| `status/src/main.js` | Section source |
| `build.sh` | Rebuilds `status/main.js`: `ESBUILD=/path/to/esbuild ./build.sh` |

## Deployment

The folder is installed in place from Settings → Extensions. After an update
that adds a capability (v2 adds the status section), OpenChamber asks for
approval again there. `OPENCODE_CREDENTIAL_DB` overrides the database path for
testing.

Last readings and the Claude back-off are kept in
`~/.cache/openchamber-accounts-usage/state.json` (mode 600, numbers and
timestamps only, no tokens), so restarting the service doesn't blank the
section or spend a request on a rate-limited account.
