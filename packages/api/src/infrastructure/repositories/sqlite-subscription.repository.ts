import Database from 'better-sqlite3';
import { ISubscriptionRepository, PushSubscriptionData } from '../../domain/repositories/subscription.repository.js';

export class SQLiteSubscriptionRepository implements ISubscriptionRepository {
  constructor(private db: Database.Database) {}

  async save(subscription: PushSubscriptionData): Promise<void> {
    this.db
      .prepare(
        `INSERT OR REPLACE INTO push_subscriptions (endpoint, keys_p256dh, keys_auth)
         VALUES (?, ?, ?)`
      )
      .run(subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth);
  }

  async remove(endpoint: string): Promise<void> {
    this.db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint);
  }

  async findAll(): Promise<PushSubscriptionData[]> {
    const rows = this.db
      .prepare('SELECT endpoint, keys_p256dh, keys_auth FROM push_subscriptions')
      .all() as { endpoint: string; keys_p256dh: string; keys_auth: string }[];

    return rows.map((row) => ({
      endpoint: row.endpoint,
      keys: { p256dh: row.keys_p256dh, auth: row.keys_auth },
    }));
  }

  async getSettings(): Promise<{ enabled: boolean; hours: string[] }> {
    const row = this.db
      .prepare('SELECT enabled, hours FROM notification_settings WHERE id = 1')
      .get() as { enabled: number; hours: string } | undefined;

    if (!row) return { enabled: true, hours: ['08:00', '14:00', '21:00'] };
    return { enabled: row.enabled === 1, hours: row.hours.split(',') };
  }

  async updateSettings(enabled: boolean, hours: string[]): Promise<void> {
    this.db
      .prepare('UPDATE notification_settings SET enabled = ?, hours = ? WHERE id = 1')
      .run(enabled ? 1 : 0, hours.join(','));
  }
}
