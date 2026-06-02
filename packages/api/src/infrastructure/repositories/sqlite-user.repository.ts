import Database from 'better-sqlite3';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { User } from '../../domain/entities/user.js';

export class SQLiteUserRepository implements IUserRepository {
  constructor(private db: Database.Database) {}

  create(user: User): void {
    this.db
      .prepare('INSERT INTO users (id, email, name, password_hash, auth_provider, google_id, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(user.id, user.email, user.name, user.passwordHash, user.authProvider, user.googleId || null, user.avatarUrl || null, user.createdAt);
  }

  findByEmail(email: string): User | undefined {
    const row = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    return row ? this.mapRow(row) : undefined;
  }

  findById(id: string): User | undefined {
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    return row ? this.mapRow(row) : undefined;
  }

  findByGoogleId(googleId: string): User | undefined {
    const row = this.db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId) as any;
    return row ? this.mapRow(row) : undefined;
  }

  updateGoogleId(userId: string, googleId: string): void {
    this.db.prepare('UPDATE users SET google_id = ?, auth_provider = ? WHERE id = ?').run(googleId, 'google', userId);
  }

  private mapRow(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      authProvider: row.auth_provider || 'local',
      googleId: row.google_id || undefined,
      avatarUrl: row.avatar_url || undefined,
      createdAt: row.created_at,
    };
  }
}
