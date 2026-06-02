import Database from 'better-sqlite3';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { User } from '../../domain/entities/user.js';

export class SQLiteUserRepository implements IUserRepository {
  constructor(private db: Database.Database) {}

  create(user: User): void {
    this.db
      .prepare('INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(user.id, user.email, user.name, user.passwordHash, user.createdAt);
  }

  findByEmail(email: string): User | undefined {
    const row = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!row) return undefined;
    return { id: row.id, email: row.email, name: row.name, passwordHash: row.password_hash, createdAt: row.created_at };
  }

  findById(id: string): User | undefined {
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    if (!row) return undefined;
    return { id: row.id, email: row.email, name: row.name, passwordHash: row.password_hash, createdAt: row.created_at };
  }
}
