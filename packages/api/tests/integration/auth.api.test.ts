import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { getTestDatabase } from '../../src/infrastructure/database/connection';
import { SQLiteUserRepository } from '../../src/infrastructure/repositories/sqlite-user.repository';
import { Express } from 'express';

function createTestApp() {
  const db = getTestDatabase();
  const userRepo = new SQLiteUserRepository(db);
  return { app: createApp({ userRepository: userRepo }), db, userRepo };
}

describe('Auth API', () => {
  let app: Express;

  beforeEach(() => {
    const t = createTestApp();
    app = t.app;
  });

  describe('POST /auth/register', () => {
    it('registers a new user and returns tokens', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'senha123',
      });

      expect(res.status).toBe(201);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body.user.name).toBe('Test User');
    });

    it('rejects duplicate email', async () => {
      await request(app).post('/auth/register').send({
        email: 'test@example.com',
        name: 'User 1',
        password: 'senha123',
      });

      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        name: 'User 2',
        password: 'senha456',
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('já cadastrado');
    });

    it('rejects short password', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        name: 'User',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('6 caracteres');
    });

    it('rejects missing fields', async () => {
      const res = await request(app).post('/auth/register').send({ email: 'x@x.com' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/auth/register').send({
        email: 'user@test.com',
        name: 'Login User',
        password: 'mypassword',
      });
    });

    it('logs in with correct credentials', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'user@test.com',
        password: 'mypassword',
      });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.user.email).toBe('user@test.com');
    });

    it('rejects wrong password', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'user@test.com',
        password: 'wrong',
      });

      expect(res.status).toBe(401);
    });

    it('rejects non-existent email', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'nobody@test.com',
        password: 'anything',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('issues new tokens from refresh token', async () => {
      const reg = await request(app).post('/auth/register').send({
        email: 'ref@test.com',
        name: 'Refresh User',
        password: 'password123',
      });

      const res = await request(app).post('/auth/refresh').send({
        refreshToken: reg.body.refreshToken,
      });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('rejects invalid refresh token', async () => {
      const res = await request(app).post('/auth/refresh').send({
        refreshToken: 'invalid-token',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /auth/me', () => {
    it('returns user info with valid token', async () => {
      const reg = await request(app).post('/auth/register').send({
        email: 'me@test.com',
        name: 'Me User',
        password: 'password123',
      });

      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${reg.body.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('me@test.com');
      expect(res.body.name).toBe('Me User');
    });

    it('rejects request without token', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
    });

    it('rejects invalid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid');

      expect(res.status).toBe(401);
    });
  });
});
