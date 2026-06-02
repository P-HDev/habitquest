import { describe, it, expect, beforeEach } from 'vitest';
import { getTestDatabase } from '../../src/infrastructure/database/connection.js';
import { SQLiteAchievementRepository } from '../../src/infrastructure/repositories/sqlite-achievement.repository.js';
import { createAchievement } from '../../src/domain/entities/achievement.js';
import Database from 'better-sqlite3';

describe('SQLiteAchievementRepository', () => {
  let db: Database.Database;
  let repo: SQLiteAchievementRepository;

  beforeEach(() => {
    db = getTestDatabase();
    repo = new SQLiteAchievementRepository(db);
    db.prepare("INSERT INTO habits (id, name, target_days) VALUES ('h1', 'Meditar', 30)").run();
    db.prepare("INSERT INTO habits (id, name, target_days) VALUES ('h2', 'Correr', 90)").run();
  });

  it('saves and retrieves achievement by habit', async () => {
    const achievement = createAchievement({
      habitId: 'h1',
      title: 'Meditar — 7 dias',
      description: '7 check-ins',
      targetDays: 7,
    });

    await repo.save(achievement);
    const results = await repo.findByHabit('h1');

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Meditar — 7 dias');
    expect(results[0].targetDays).toBe(7);
    expect(results[0].unlocked).toBe(false);
  });

  it('finds all achievements across habits', async () => {
    await repo.save(createAchievement({ habitId: 'h1', title: 'A1', targetDays: 7 }));
    await repo.save(createAchievement({ habitId: 'h2', title: 'A2', targetDays: 21 }));

    const all = await repo.findAll();
    expect(all).toHaveLength(2);
  });

  it('updates progress', async () => {
    await repo.save(createAchievement({ habitId: 'h1', title: 'A1', targetDays: 7 }));
    const [saved] = await repo.findByHabit('h1');

    await repo.updateProgress(saved.id!, 5);

    const [updated] = await repo.findByHabit('h1');
    expect(updated.currentProgress).toBe(5);
  });

  it('unlocks achievement', async () => {
    await repo.save(createAchievement({ habitId: 'h1', title: 'A1', targetDays: 7 }));
    const [saved] = await repo.findByHabit('h1');
    const now = new Date('2024-06-01T10:00:00Z');

    await repo.unlock(saved.id!, now);

    const [updated] = await repo.findByHabit('h1');
    expect(updated.unlocked).toBe(true);
    expect(updated.unlockedAt?.toISOString()).toBe(now.toISOString());
  });

  it('orders achievements by target_days ascending', async () => {
    await repo.save(createAchievement({ habitId: 'h1', title: '30d', targetDays: 30 }));
    await repo.save(createAchievement({ habitId: 'h1', title: '7d', targetDays: 7 }));
    await repo.save(createAchievement({ habitId: 'h1', title: '21d', targetDays: 21 }));

    const results = await repo.findByHabit('h1');
    expect(results.map((a) => a.targetDays)).toEqual([7, 21, 30]);
  });
});
