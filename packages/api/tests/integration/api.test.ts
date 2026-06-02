import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../../src/app';
import { SQLiteHabitRepository } from '../../src/infrastructure/repositories/sqlite-habit.repository';
import { Express } from 'express';

function createTestApp(): Express {
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
  `);
  const repository = new SQLiteHabitRepository(db);
  return createApp(repository);
}

describe('Health endpoint', () => {
  it('GET /health should return status ok', async () => {
    const app = createTestApp();
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('Habits API', () => {
  let app: Express;

  beforeEach(() => {
    app = createTestApp();
  });

  it('POST /habits should create a habit', async () => {
    const res = await request(app).post('/habits').send({
      name: 'Exercise',
      targetDays: 30,
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Exercise');
    expect(res.body.targetDays).toBe(30);
    expect(res.body.id).toBeDefined();
  });

  it('POST /habits should return 400 without name', async () => {
    const res = await request(app).post('/habits').send({
      targetDays: 30,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /habits should return 400 for empty name', async () => {
    const res = await request(app).post('/habits').send({
      name: '',
      targetDays: 30,
    });

    expect(res.status).toBe(400);
  });

  it('GET /habits should return list of habits', async () => {
    await request(app).post('/habits').send({
      name: 'Read',
      targetDays: 60,
    });

    const res = await request(app).get('/habits');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Read');
  });

  it('GET /habits should return empty array when no habits', async () => {
    const res = await request(app).get('/habits');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
