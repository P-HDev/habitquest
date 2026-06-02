import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../../src/app';
import { SQLiteHabitRepository } from '../../src/infrastructure/repositories/sqlite-habit.repository';
import { SQLiteCheckinRepository } from '../../src/infrastructure/repositories/sqlite-checkin.repository';
import { Express } from 'express';

function createTestApp() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      target_days INTEGER NOT NULL,
      icon TEXT DEFAULT '🎯',
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (habit_id) REFERENCES habits(id),
      UNIQUE(habit_id, date)
    );
  `);
  const habitRepo = new SQLiteHabitRepository(db);
  const checkinRepo = new SQLiteCheckinRepository(db);
  return createApp(habitRepo, checkinRepo);
}

describe('Checkin API', () => {
  let app: Express;

  beforeEach(() => {
    app = createTestApp();
  });

  it('POST /habits/:id/checkin should complete a habit', async () => {
    const created = await request(app).post('/habits').send({ name: 'Gym', targetDays: 30 });
    const id = created.body.id;

    const res = await request(app).post(`/habits/${id}/checkin`).send({ date: '2026-06-02' });

    expect(res.status).toBe(201);
    expect(res.body.habitId).toBe(id);
    expect(res.body.streak).toBe(1);
    expect(res.body.alreadyCompleted).toBe(false);
  });

  it('POST /habits/:id/checkin should return 200 if already completed', async () => {
    const created = await request(app).post('/habits').send({ name: 'Gym', targetDays: 30 });
    const id = created.body.id;

    await request(app).post(`/habits/${id}/checkin`).send({ date: '2026-06-02' });
    const res = await request(app).post(`/habits/${id}/checkin`).send({ date: '2026-06-02' });

    expect(res.status).toBe(200);
    expect(res.body.alreadyCompleted).toBe(true);
  });

  it('POST /habits/:id/checkin should return 404 for unknown habit', async () => {
    const res = await request(app).post('/habits/unknown/checkin').send({ date: '2026-06-02' });
    expect(res.status).toBe(404);
  });

  it('DELETE /habits/:id/checkin should undo a checkin', async () => {
    const created = await request(app).post('/habits').send({ name: 'Read', targetDays: 60 });
    const id = created.body.id;

    await request(app).post(`/habits/${id}/checkin`).send({ date: '2026-06-02' });
    const res = await request(app).delete(`/habits/${id}/checkin`).send({ date: '2026-06-02' });

    expect(res.status).toBe(200);
    expect(res.body.removed).toBe(true);
  });

  it('DELETE /habits/:id/checkin should return 404 if no checkin', async () => {
    const res = await request(app).delete('/habits/any/checkin').send({ date: '2026-06-02' });
    expect(res.status).toBe(404);
  });

  it('GET /habits/today should return habits with status', async () => {
    const created = await request(app).post('/habits').send({ name: 'Meditate', targetDays: 30 });
    const id = created.body.id;

    const before = await request(app).get('/habits/today?date=2026-06-02');
    expect(before.body).toHaveLength(1);
    expect(before.body[0].completedToday).toBe(false);
    expect(before.body[0].streak).toBe(0);

    await request(app).post(`/habits/${id}/checkin`).send({ date: '2026-06-02' });

    const after = await request(app).get('/habits/today?date=2026-06-02');
    expect(after.body[0].completedToday).toBe(true);
    expect(after.body[0].streak).toBe(1);
    expect(after.body[0].totalCompleted).toBe(1);
  });

  it('GET /habits/today should show streak for consecutive days', async () => {
    const created = await request(app).post('/habits').send({ name: 'Exercise', targetDays: 90 });
    const id = created.body.id;

    await request(app).post(`/habits/${id}/checkin`).send({ date: '2026-05-30' });
    await request(app).post(`/habits/${id}/checkin`).send({ date: '2026-05-31' });
    await request(app).post(`/habits/${id}/checkin`).send({ date: '2026-06-01' });
    await request(app).post(`/habits/${id}/checkin`).send({ date: '2026-06-02' });

    const res = await request(app).get('/habits/today?date=2026-06-02');
    expect(res.body[0].streak).toBe(4);
    expect(res.body[0].totalCompleted).toBe(4);
  });
});
