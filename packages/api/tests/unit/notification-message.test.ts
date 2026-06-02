import { describe, it, expect, beforeEach } from 'vitest';
import { getTestDatabase } from '../../src/infrastructure/database/connection.js';
import { SQLiteHabitRepository } from '../../src/infrastructure/repositories/sqlite-habit.repository.js';
import { SQLiteCheckinRepository } from '../../src/infrastructure/repositories/sqlite-checkin.repository.js';
import { SQLiteAchievementRepository } from '../../src/infrastructure/repositories/sqlite-achievement.repository.js';
import { NotificationMessageBuilder } from '../../src/infrastructure/services/notification-message.service.js';
import { createAchievement } from '../../src/domain/entities/achievement.js';
import Database from 'better-sqlite3';

describe('NotificationMessageBuilder', () => {
  let db: Database.Database;
  let builder: NotificationMessageBuilder;
  let habitRepo: SQLiteHabitRepository;
  let checkinRepo: SQLiteCheckinRepository;
  let achievementRepo: SQLiteAchievementRepository;

  beforeEach(() => {
    db = getTestDatabase();
    habitRepo = new SQLiteHabitRepository(db);
    checkinRepo = new SQLiteCheckinRepository(db);
    achievementRepo = new SQLiteAchievementRepository(db);
    builder = new NotificationMessageBuilder(habitRepo, checkinRepo, achievementRepo);
  });

  it('returns pending habits count message', async () => {
    db.prepare("INSERT INTO habits (id, name, target_days) VALUES ('h1', 'Meditar', 30)").run();
    db.prepare("INSERT INTO habits (id, name, target_days) VALUES ('h2', 'Correr', 30)").run();

    const msg = await builder.buildMessage();
    expect(msg.body).toContain('2 hábitos');
    expect(msg.body).toContain('dia perfeito');
  });

  it('returns perfect day message when all habits done', async () => {
    const today = new Date().toISOString().split('T')[0];
    db.prepare("INSERT INTO habits (id, name, target_days) VALUES ('h1', 'Meditar', 30)").run();
    db.prepare("INSERT INTO checkins (habit_id, date) VALUES ('h1', ?)").run(today);

    const msg = await builder.buildMessage();
    expect(msg.title).toContain('Dia Perfeito');
  });

  it('includes closest achievement info when available', async () => {
    db.prepare("INSERT INTO habits (id, name, target_days) VALUES ('h1', 'Meditar', 30)").run();

    const achievement = createAchievement({
      habitId: 'h1',
      title: 'Meditar — 7 dias',
      targetDays: 7,
    });
    achievement.currentProgress = 5;
    await achievementRepo.save(achievement);
    // Update progress manually
    const [saved] = await achievementRepo.findByHabit('h1');
    await achievementRepo.updateProgress(saved.id!, 5);

    const msg = await builder.buildMessage();
    expect(msg.body).toContain('Meditar — 7 dias');
    expect(msg.body).toContain('2 dias');
  });
});
