import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { getTestDatabase } from '../../src/infrastructure/database/connection';
import { SQLiteHabitRepository } from '../../src/infrastructure/repositories/sqlite-habit.repository';
import { SQLiteCheckinRepository } from '../../src/infrastructure/repositories/sqlite-checkin.repository';
import { SQLiteAchievementRepository } from '../../src/infrastructure/repositories/sqlite-achievement.repository';
import { Express } from 'express';

function createTestApp() {
  const db = getTestDatabase();
  const habitRepo = new SQLiteHabitRepository(db);
  const checkinRepo = new SQLiteCheckinRepository(db);
  const achievementRepo = new SQLiteAchievementRepository(db);
  return {
    app: createApp({ habitRepository: habitRepo, checkinRepository: checkinRepo, achievementRepository: achievementRepo }),
    db,
  };
}

describe('Stats API', () => {
  let app: Express;

  beforeEach(() => {
    const t = createTestApp();
    app = t.app;
  });

  it('GET /stats returns stats for empty app', async () => {
    const res = await request(app).get('/stats');
    expect(res.status).toBe(200);
    expect(res.body.totalHabits).toBe(0);
    expect(res.body.totalCheckins).toBe(0);
    expect(res.body.maxStreak).toBe(0);
    expect(res.body.unlockedAchievements).toBe(0);
  });

  it('GET /stats returns correct counts after activity', async () => {
    // Create a habit
    const habit = await request(app).post('/habits').send({ name: 'Test', targetDays: 30 });
    const id = habit.body.id;

    // Do 3 consecutive checkins
    await request(app).post(`/habits/${id}/checkin`).send({ date: '2024-06-01' });
    await request(app).post(`/habits/${id}/checkin`).send({ date: '2024-06-02' });
    await request(app).post(`/habits/${id}/checkin`).send({ date: '2024-06-03' });

    const res = await request(app).get('/stats');
    expect(res.body.totalHabits).toBe(1);
    expect(res.body.totalCheckins).toBe(3);
    expect(res.body.maxStreak).toBe(3);
    expect(res.body.totalAchievements).toBe(3); // 7, 21, 30 day milestones
  });

  it('GET /stats calculates achievement percent', async () => {
    const habit = await request(app).post('/habits').send({ name: 'X', targetDays: 30 });
    const id = habit.body.id;

    // Complete 7 checkins to unlock first achievement
    for (let i = 1; i <= 7; i++) {
      const day = i.toString().padStart(2, '0');
      await request(app).post(`/habits/${id}/checkin`).send({ date: `2024-06-${day}` });
    }

    const res = await request(app).get('/stats');
    expect(res.body.unlockedAchievements).toBe(1);
    expect(res.body.achievementPercent).toBe(33); // 1/3
  });
});
