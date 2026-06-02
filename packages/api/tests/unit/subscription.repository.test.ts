import { describe, it, expect, beforeEach } from 'vitest';
import { getTestDatabase } from '../../src/infrastructure/database/connection.js';
import { SQLiteSubscriptionRepository } from '../../src/infrastructure/repositories/sqlite-subscription.repository.js';
import Database from 'better-sqlite3';

describe('SQLiteSubscriptionRepository', () => {
  let db: Database.Database;
  let repo: SQLiteSubscriptionRepository;

  beforeEach(() => {
    db = getTestDatabase();
    repo = new SQLiteSubscriptionRepository(db);
  });

  it('saves and retrieves subscription', async () => {
    await repo.save({
      endpoint: 'https://push.example.com/sub1',
      keys: { p256dh: 'key1', auth: 'auth1' },
    });

    const all = await repo.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].endpoint).toBe('https://push.example.com/sub1');
    expect(all[0].keys.p256dh).toBe('key1');
  });

  it('removes subscription by endpoint', async () => {
    await repo.save({
      endpoint: 'https://push.example.com/sub1',
      keys: { p256dh: 'key1', auth: 'auth1' },
    });

    await repo.remove('https://push.example.com/sub1');
    const all = await repo.findAll();
    expect(all).toHaveLength(0);
  });

  it('replaces subscription with same endpoint', async () => {
    await repo.save({ endpoint: 'https://ep.com/1', keys: { p256dh: 'old', auth: 'old' } });
    await repo.save({ endpoint: 'https://ep.com/1', keys: { p256dh: 'new', auth: 'new' } });

    const all = await repo.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].keys.p256dh).toBe('new');
  });

  it('gets default settings', async () => {
    const settings = await repo.getSettings();
    expect(settings.enabled).toBe(true);
    expect(settings.hours).toEqual(['08:00', '14:00', '21:00']);
  });

  it('updates settings', async () => {
    await repo.updateSettings(false, ['09:00', '18:00']);
    const settings = await repo.getSettings();
    expect(settings.enabled).toBe(false);
    expect(settings.hours).toEqual(['09:00', '18:00']);
  });
});
