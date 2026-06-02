import Database from 'better-sqlite3';
import { Habit } from '../../domain/entities/habit.js';
import { IHabitRepository } from '../../domain/repositories/habit.repository.js';

export class SQLiteHabitRepository implements IHabitRepository {
  constructor(private readonly db: Database.Database) {}

  async save(habit: Habit): Promise<void> {
    this.db
      .prepare(
        `INSERT INTO habits (id, name, description, target_days, icon, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        habit.id,
        habit.name,
        habit.description,
        habit.targetDays,
        habit.icon,
        habit.active ? 1 : 0,
        habit.createdAt.toISOString(),
      );
  }

  async findAll(): Promise<Habit[]> {
    const rows = this.db.prepare('SELECT * FROM habits WHERE active = 1').all() as any[];
    return rows.map(this.mapRowToHabit);
  }

  async findById(id: string): Promise<Habit | null> {
    const row = this.db.prepare('SELECT * FROM habits WHERE id = ?').get(id) as any;
    return row ? this.mapRowToHabit(row) : null;
  }

  async delete(id: string): Promise<void> {
    this.db.prepare('UPDATE habits SET active = 0 WHERE id = ?').run(id);
  }

  private mapRowToHabit(row: any): Habit {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      targetDays: row.target_days,
      icon: row.icon,
      active: row.active === 1,
      createdAt: new Date(row.created_at),
    };
  }
}
