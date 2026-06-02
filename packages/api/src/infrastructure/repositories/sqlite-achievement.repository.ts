import Database from 'better-sqlite3';
import { IAchievementRepository } from '../../domain/repositories/achievement.repository.js';
import { Achievement, createAchievement } from '../../domain/entities/achievement.js';

export class SQLiteAchievementRepository implements IAchievementRepository {
  constructor(private db: Database.Database) {}

  async save(achievement: Achievement): Promise<void> {
    this.db
      .prepare(
        `INSERT INTO achievements (habit_id, title, description, target_days, unlocked, unlocked_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        achievement.habitId,
        achievement.title,
        achievement.description,
        achievement.targetDays,
        achievement.unlocked ? 1 : 0,
        achievement.unlockedAt?.toISOString() || null
      );
  }

  async findByHabit(habitId: string): Promise<Achievement[]> {
    const rows = this.db
      .prepare('SELECT * FROM achievements WHERE habit_id = ? ORDER BY target_days ASC')
      .all(habitId) as AchievementRow[];

    return rows.map(this.toEntity);
  }

  async findAll(): Promise<Achievement[]> {
    const rows = this.db
      .prepare('SELECT * FROM achievements ORDER BY habit_id, target_days ASC')
      .all() as AchievementRow[];

    return rows.map(this.toEntity);
  }

  async updateProgress(id: number, progress: number): Promise<void> {
    this.db.prepare('UPDATE achievements SET current_progress = ? WHERE id = ?').run(progress, id);
  }

  async unlock(id: number, unlockedAt: Date): Promise<void> {
    this.db
      .prepare('UPDATE achievements SET unlocked = 1, unlocked_at = ? WHERE id = ?')
      .run(unlockedAt.toISOString(), id);
  }

  private toEntity(row: AchievementRow): Achievement {
    return createAchievement({
      id: row.id,
      habitId: row.habit_id,
      title: row.title,
      description: row.description || undefined,
      targetDays: row.target_days,
      currentProgress: row.current_progress || 0,
      unlocked: row.unlocked === 1,
      unlockedAt: row.unlocked_at ? new Date(row.unlocked_at) : null,
    });
  }
}

interface AchievementRow {
  id: number;
  habit_id: string;
  title: string;
  description: string | null;
  target_days: number;
  current_progress: number | null;
  unlocked: number;
  unlocked_at: string | null;
}
