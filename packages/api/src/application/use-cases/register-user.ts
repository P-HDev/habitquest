import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { User } from '../../domain/entities/user.js';

interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export class RegisterUser {
  constructor(private userRepo: IUserRepository) {}

  execute(input: RegisterInput): User {
    const existing = this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new Error('EMAIL_EXISTS');
    }

    if (input.password.length < 6) {
      throw new Error('PASSWORD_TOO_SHORT');
    }

    const user: User = {
      id: randomUUID(),
      email: input.email.toLowerCase().trim(),
      name: input.name.trim(),
      passwordHash: bcrypt.hashSync(input.password, 10),
      createdAt: new Date().toISOString(),
    };

    this.userRepo.create(user);
    return user;
  }
}
