import { User } from '../entities/user.js';

export interface IUserRepository {
  create(user: User): void;
  findByEmail(email: string): User | undefined;
  findById(id: string): User | undefined;
}
