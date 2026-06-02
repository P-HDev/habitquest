import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { getTestDatabase } from '../../src/infrastructure/database/connection';
import { SQLiteSubscriptionRepository } from '../../src/infrastructure/repositories/sqlite-subscription.repository';
import { Express } from 'express';

function createTestApp() {
  const db = getTestDatabase();
  const subscriptionRepo = new SQLiteSubscriptionRepository(db);
  return createApp({ subscriptionRepository: subscriptionRepo });
}

describe('Notifications API', () => {
  let app: Express;

  beforeEach(() => {
    app = createTestApp();
  });

  it('POST /notifications/subscribe saves subscription', async () => {
    const res = await request(app).post('/notifications/subscribe').send({
      endpoint: 'https://push.example.com/sub1',
      keys: { p256dh: 'p256dh_key', auth: 'auth_key' },
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Subscribed');
  });

  it('POST /notifications/subscribe rejects invalid data', async () => {
    const res = await request(app).post('/notifications/subscribe').send({
      endpoint: 'https://push.example.com/sub1',
    });

    expect(res.status).toBe(400);
  });

  it('POST /notifications/unsubscribe removes subscription', async () => {
    await request(app).post('/notifications/subscribe').send({
      endpoint: 'https://push.example.com/sub1',
      keys: { p256dh: 'key', auth: 'auth' },
    });

    const res = await request(app).post('/notifications/unsubscribe').send({
      endpoint: 'https://push.example.com/sub1',
    });

    expect(res.status).toBe(200);
  });

  it('GET /notifications/settings returns default settings', async () => {
    const res = await request(app).get('/notifications/settings');

    expect(res.status).toBe(200);
    expect(res.body.enabled).toBe(true);
    expect(res.body.hours).toEqual(['08:00', '14:00', '21:00']);
  });

  it('PUT /notifications/settings updates settings', async () => {
    const res = await request(app).put('/notifications/settings').send({
      enabled: false,
      hours: ['09:00', '17:00'],
    });

    expect(res.status).toBe(200);
    expect(res.body.enabled).toBe(false);
    expect(res.body.hours).toEqual(['09:00', '17:00']);
  });

  it('PUT /notifications/settings rejects invalid data', async () => {
    const res = await request(app).put('/notifications/settings').send({
      enabled: 'yes',
    });

    expect(res.status).toBe(400);
  });

  it('GET /notifications/vapid-public-key returns key', async () => {
    const res = await request(app).get('/notifications/vapid-public-key');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('publicKey');
  });
});
