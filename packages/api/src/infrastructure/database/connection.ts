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
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      target_days INTEGER NOT NULL,
      icon TEXT DEFAULT '🎯',
      active INTEGER DEFAULT 1,
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
  `);
}
