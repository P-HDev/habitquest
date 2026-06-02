import { describe, it, expect, beforeEach } from 'vitest';
import { getTestDatabase } from '../../src/infrastructure/database/connection.js';
import { SQLiteAchievementRepository } from '../../src/infrastructure/repositories/sqlite-achievement.repository.js';
import { SQLiteCheckinRepository } from '../../src/infrastructure/repositories/sqlite-checkin.repository.js';
import { EvaluateAchievements } from '../../src/application/use-cases/evaluate-achievements.use-case.js';
import { createAchievement } from '../../src/domain/entities/achievement.js';
import Database from 'better-sqlite3';

describe('EvaluateAchievements Use Case', () => {
  let db: Database.Database;
  let achievementRepo: SQLiteAchievementRepository;
  let checkinRepo: SQLiteCheckinRepository;
  let useCase: EvaluateAchievements;

  beforeEach(() => {
    db = getTestDatabase();
    achievementRepo = new SQLiteAchievementRepository(db);
    checkinRepo = new SQLiteCheckinRepository(db);
    useCase = new EvaluateAchievements(achievementRepo, checkinRepo);
    db.prepare("INSERT INTO habits (id, name, target_days) VALUES ('h1', 'Meditar', 30)").run();
  });

  it('updates progress based on total checkins', async () => {
    await achievementRepo.save(
      createAchievement({ habitId: 'h1', title: '7 dias', targetDays: 7 })
    );

    // Simulate 5 checkins
    for (let i = 1; i <= 5; i++) {
      await checkinRepo.save({ habitId: 'h1', date: `2024-06-0${i}` });
    }

    const result = await useCase.execute('h1');

    expect(result.newlyUnlocked).toHaveLength(0);
    const achievements = await achievementRepo.findByHabit('h1');
    expect(achievements[0].currentProgress).toBe(5);
  });

  it('unlocks achievement when progress reaches target', async () => {
    await achievementRepo.save(
      createAchievement({ habitId: 'h1', title: '7 dias', targetDays: 7 })
    );

    for (let i = 1; i <= 7; i++) {
      const day = i.toString().padStart(2, '0');
      await checkinRepo.save({ habitId: 'h1', date: `2024-06-${day}` });
    }

    const result = await useCase.execute('h1');

    expect(result.newlyUnlocked).toHaveLength(1);
    expect(result.newlyUnlocked[0].title).toBe('7 dias');
    expect(result.newlyUnlocked[0].unlocked).toBe(true);
  });

  it('does not re-unlock already unlocked achievement', async () => {
    const achievement = createAchievement({ habitId: 'h1', title: '7 dias', targetDays: 7 });
    achievement.currentProgress = 7;
    achievement.unlock();
    await achievementRepo.save(achievement);

    for (let i = 1; i <= 8; i++) {
      const day = i.toString().padStart(2, '0');
      await checkinRepo.save({ habitId: 'h1', date: `2024-06-${day}` });
    }

    const result = await useCase.execute('h1');
    expect(result.newlyUnlocked).toHaveLength(0);
  });

  it('unlocks multiple achievements at once', async () => {
    await achievementRepo.save(
      createAchievement({ habitId: 'h1', title: '7 dias', targetDays: 7 })
    );
    await achievementRepo.save(
      createAchievement({ habitId: 'h1', title: '21 dias', targetDays: 21 })
    );

    for (let i = 1; i <= 21; i++) {
      const day = i.toString().padStart(2, '0');
      await checkinRepo.save({ habitId: 'h1', date: `2024-06-${day}` });
    }

    const result = await useCase.execute('h1');
    expect(result.newlyUnlocked).toHaveLength(2);
  });

  it('returns empty when no achievements exist', async () => {
    const result = await useCase.execute('h1');
    expect(result.newlyUnlocked).toHaveLength(0);
  });
});
