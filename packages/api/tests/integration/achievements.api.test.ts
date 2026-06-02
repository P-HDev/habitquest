import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { getTestDatabase } from '../../src/infrastructure/database/connection';
import { SQLiteHabitRepository } from '../../src/infrastructure/repositories/sqlite-habit.repository';
import { SQLiteCheckinRepository } from '../../src/infrastructure/repositories/sqlite-checkin.repository';
import { SQLiteAchievementRepository } from '../../src/infrastructure/repositories/sqlite-achievement.repository';
import { Express } from 'express';
import Database from 'better-sqlite3';

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

describe('Achievements API', () => {
  let app: Express;
  let db: Database.Database;

  beforeEach(() => {
    const t = createTestApp();
    app = t.app;
    db = t.db;
  });

  it('GET /achievements returns empty array initially', async () => {
    const res = await request(app).get('/achievements');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('creating a habit auto-seeds achievements', async () => {
    const res = await request(app)
      .post('/habits')
      .send({ name: 'Meditar', targetDays: 30 });

    expect(res.status).toBe(201);

    const achievements = await request(app).get('/achievements');
    expect(achievements.body.length).toBe(3); // 7, 21, 30
    expect(achievements.body[0].title).toBe('Meditar — 7 dias');
    expect(achievements.body[1].title).toBe('Meditar — 21 dias');
    expect(achievements.body[2].title).toBe('Meditar — 30 dias');
  });

  it('GET /achievements/:id returns achievements for a habit', async () => {
    const habit = await request(app)
      .post('/habits')
      .send({ name: 'Correr', targetDays: 90 });

    const res = await request(app).get(`/achievements/${habit.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5); // 7, 21, 30, 60, 90
  });

  it('checkin unlocks achievement and returns it', async () => {
    const habit = await request(app)
      .post('/habits')
      .send({ name: 'Ler', targetDays: 30 });

    const habitId = habit.body.id;

    // Do 7 checkins
    for (let i = 1; i <= 7; i++) {
      const day = i.toString().padStart(2, '0');
      await request(app)
        .post(`/habits/${habitId}/checkin`)
        .send({ date: `2024-06-${day}` });
    }

    // The 7th checkin should have unlocked the achievement
    const achievements = await request(app).get(`/achievements/${habitId}`);
    const sevenDay = achievements.body.find((a: any) => a.targetDays === 7);

    expect(sevenDay.unlocked).toBe(true);
    expect(sevenDay.currentProgress).toBe(7);
    expect(sevenDay.progressPercent).toBe(100);
  });

  it('checkin response includes newlyUnlocked', async () => {
    const habit = await request(app)
      .post('/habits')
      .send({ name: 'Yoga', targetDays: 30 });

    const habitId = habit.body.id;

    // Do 6 checkins
    for (let i = 1; i <= 6; i++) {
      const day = i.toString().padStart(2, '0');
      await request(app)
        .post(`/habits/${habitId}/checkin`)
        .send({ date: `2024-06-${day}` });
    }

    // 7th checkin should unlock
    const res = await request(app)
      .post(`/habits/${habitId}/checkin`)
      .send({ date: '2024-06-07' });

    expect(res.status).toBe(201);
    expect(res.body.newlyUnlocked).toHaveLength(1);
    expect(res.body.newlyUnlocked[0].title).toBe('Yoga — 7 dias');
  });

  it('progress updates correctly across checkins', async () => {
    const habit = await request(app)
      .post('/habits')
      .send({ name: 'Água', targetDays: 30 });

    const habitId = habit.body.id;

    // Do 3 checkins
    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post(`/habits/${habitId}/checkin`)
        .send({ date: `2024-06-0${i}` });
    }

    const achievements = await request(app).get(`/achievements/${habitId}`);
    const sevenDay = achievements.body.find((a: any) => a.targetDays === 7);

    expect(sevenDay.currentProgress).toBe(3);
    expect(sevenDay.progressPercent).toBe(43); // 3/7 = 42.8 → 43
    expect(sevenDay.unlocked).toBe(false);
  });
});
