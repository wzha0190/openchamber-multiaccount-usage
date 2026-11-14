// 2026-11-15: Redacted OpenCode credential-schema inspection for the
// OpenChamber multi-account Codex usage extension. Never prints token values.
import { DatabaseSync } from 'node:sqlite';

const databasePath = process.argv[2]
  ?? `${process.env.HOME}/.local/share/opencode/opencode.db`;

const database = new DatabaseSync(databasePath, { readOnly: true });

const table = database.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'credential'").get();
const columns = database.prepare('PRAGMA table_info(credential)').all().map((column) => column.name);
const integrationColumn = columns.includes('integrationID')
  ? 'integrationID'
  : columns.includes('integration_id')
    ? 'integration_id'
    : null;
const activeColumn = columns.includes('active') ? 'active' : null;
const rows = integrationColumn
  ? database.prepare(`SELECT * FROM credential WHERE ${integrationColumn} = 'openai'${activeColumn ? ` ORDER BY ${activeColumn} DESC` : ''}`).all()
  : [];

const redact = (value) => {
  let parsed;
  try {
    parsed = JSON.parse(String(value));
  } catch {
    return { parseable: false, length: String(value ?? '').length };
  }

  const metadata = parsed && typeof parsed.metadata === 'object' && parsed.metadata
    ? parsed.metadata
    : {};

  return {
    parseable: true,
    keys: Object.keys(parsed).sort(),
    type: parsed.type ?? null,
    methodID: parsed.methodID ?? parsed.methodId ?? null,
    expires: parsed.expires ?? null,
    accountIdPresent: Boolean(parsed.accountId ?? parsed.accountID ?? metadata.accountId ?? metadata.accountID),
    email: parsed.email ?? metadata.email ?? null,
    metadataKeys: Object.keys(metadata).sort(),
    accessPresent: Boolean(parsed.access ?? parsed.token),
    refreshPresent: Boolean(parsed.refresh),
  };
};

console.log(JSON.stringify({
  databasePath,
  tableSql: table?.sql ?? null,
  columns,
  accounts: rows.map((row) => ({
    id: row.id,
    integrationID: row.integrationID ?? row.integration_id ?? null,
    label: row.label,
    active: Boolean(row.active),
    createdAt: row.createdAt ?? row.created_at ?? null,
    updatedAt: row.updatedAt ?? row.updated_at ?? null,
    credential: redact(row.value),
  })),
}, null, 2));

database.close();
