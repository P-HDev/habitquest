import Database from 'better-sqlite3';
import { Checkin, ICheckinRepository } from '../../domain/repositories/checkin.repository.js';

export class SQLiteCheckinRepository implements ICheckinRepository {
  constructor(private readonly db: Database.Database) {}

  async save(checkin: Checkin): Promise<void> {
    this.db
      .prepare('INSERT OR IGNORE INTO checkins (habit_id, date) VALUES (?, ?)')
      .run(checkin.habitId, checkin.date);
  }

  async remove(habitId: string, date: string): Promise<void> {
    this.db
      .prepare('DELETE FROM checkins WHERE habit_id = ? AND date = ?')
      .run(habitId, date);
  }

  async findByHabitAndDate(habitId: string, date: string): Promise<Checkin | null> {
    const row = this.db
      .prepare('SELECT * FROM checkins WHERE habit_id = ? AND date = ?')
      .get(habitId, date) as { id: number; habit_id: string; date: string } | undefined;

    return row ? { id: row.id, habitId: row.habit_id, date: row.date } : null;
  }

  async findDatesByHabit(habitId: string): Promise<string[]> {
    const rows = this.db
      .prepare('SELECT date FROM checkins WHERE habit_id = ? ORDER BY date DESC')
      .all(habitId) as { date: string }[];

    return rows.map((r) => r.date);
  }

  async countByHabit(habitId: string): Promise<number> {
    const row = this.db
      .prepare('SELECT COUNT(*) as count FROM checkins WHERE habit_id = ?')
      .get(habitId) as { count: number };

    return row.count;
  }
}
