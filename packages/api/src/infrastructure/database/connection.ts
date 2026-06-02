import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync } from 'fs';

let db: Database.Database | null = null;

export function getDatabase(dbPath?: string): Database.Database {
  if (!db) {
    const resolvedPath = dbPath || path.resolve(process.cwd(), 'data', 'habitquest.db');
    mkdirSync(path.dirname(resolvedPath), { recursive: true });
    db = new Database(resolvedPath);
    db.pragma('journal_mode = WAL');
    runMigrations(db);
  }
  return db;
}

export function resetDatabase(): void {
  db = null;
}

export function getTestDatabase(): Database.Database {
  const testDb = new Database(':memory:');
  testDb.pragma('journal_mode = WAL');
  runMigrations(testDb);
  return testDb;
}

function runMigrations(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT,
      auth_provider TEXT DEFAULT 'local',
      google_id TEXT,
      avatar_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      target_days INTEGER NOT NULL,
      icon TEXT DEFAULT '🎯',
      active INTEGER DEFAULT 1,
      user_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (habit_id) REFERENCES habits(id),
      UNIQUE(habit_id, date)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target_days INTEGER NOT NULL,
      current_progress INTEGER DEFAULT 0,
      unlocked INTEGER DEFAULT 0,
      unlocked_at TEXT,
      FOREIGN KEY (habit_id) REFERENCES habits(id)
    );

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT NOT NULL UNIQUE,
      keys_p256dh TEXT NOT NULL,
      keys_auth TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notification_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      enabled INTEGER DEFAULT 1,
      hours TEXT DEFAULT '08:00,14:00,21:00'
    );

    INSERT OR IGNORE INTO notification_settings (id, enabled, hours) VALUES (1, 1, '08:00,14:00,21:00');
  `);

  // Migration: add Google OAuth columns to existing users table
  const cols = database.prepare("PRAGMA table_info(users)").all() as any[];
  const colNames = cols.map((c: any) => c.name);
  if (!colNames.includes('auth_provider')) {
    database.exec("ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'local'");
  }
  if (!colNames.includes('google_id')) {
    database.exec("ALTER TABLE users ADD COLUMN google_id TEXT");
  }
  if (!colNames.includes('avatar_url')) {
    database.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT");
  }
  // Make password_hash nullable (already nullable in new schema, but old rows may need this)
  // SQLite doesn't support ALTER COLUMN, but TEXT columns already accept NULL

  // Migration: add user_id to habits if missing
  const habitCols = database.prepare("PRAGMA table_info(habits)").all() as any[];
  const habitColNames = habitCols.map((c: any) => c.name);
  if (!habitColNames.includes('user_id')) {
    database.exec("ALTER TABLE habits ADD COLUMN user_id TEXT");
  }
}
