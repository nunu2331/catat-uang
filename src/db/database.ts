import * as SQLite from 'expo-sqlite';

const DB_NAME = 'catatuang.db';

let db: SQLite.SQLiteDatabase | null = null;

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS transactions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    date          TEXT    NOT NULL,
    type          TEXT    NOT NULL,
    category      TEXT    NOT NULL,
    description   TEXT    NOT NULL,
    amount        INTEGER NOT NULL,
    created_at    TEXT    DEFAULT (datetime('now'))
  );`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);`,
];

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');
  for (const sql of MIGRATIONS) {
    await db.execAsync(sql);
  }
  return db;
}

export function getDatabase(): SQLite.SQLiteDatabase | null {
  return db;
}
