# Accounts usage extension

v2.0.0 (2026-11-15), OpenChamber ≥ 2.7.1.

Adds an **Accounts** section to the chat's Work Status panel with one block per
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
  The account OpenCode currently uses is marked *active*.
- **Claude**: Claude Code's default login (`~/.claude`, marked *active*) plus
  any `~/.claude-<name>` directory holding a `.credentials.json`. To add a
  second Claude account, sign in with
  `CLAUDE_CONFIG_DIR=~/.claude-work claude` and run `/login`. The name comes
  from that directory's `.claude.json`.

- **OpenCode Zen**: every OpenCode Console sign-in (or API key) saved on
  OpenCode's `opencode` integration. Shows **Free requests** over the last
  24 h against the shared free-model pool (50/day, the limit OpenCode's API
  enforced when tested; it isn't published, so it's a constant in
  `service/main.js`), and **Paid** spend over 30 days when there is any.
  The pool is a rolling window with no reset time. Data comes from the
  Console's undocumented `/usage/models` endpoint, the same one OpenChamber's
  built-in Zen card reads.

Percentages turn amber at 70 % and red at 90 %. Credits rows only appear when an
account has a positive or unlimited balance. The section polls every minute;
results are cached for 1 min (Codex) / 2 min (OpenCode Zen) / 10 min (Claude). The header's Refresh
button forces a new read, at most every 15 s for Codex and every 2 min for
Claude.

Anthropic's usage endpoint has an unpublished per-account limit that every
client reading it shares (Claude Code, OpenChamber's built-in Claude card, this
extension). Its 429s carry `retry-after: 0`, so after consecutive 429s the
service backs off 5 → 10 → 20 → 40 → 60 min, the same 5 min floor and 1 h cap
Claude Code uses, and keeps the last reading on screen as "Updated N min ago".

The extension still serves a **Codex Accounts** quota card (Usage page, header,
tray) with short names. To avoid seeing Codex twice in Work Status, untick that
card under the Usage block's provider list.

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
