import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/user.repository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'habitquest-secret-dev';
const ACCESS_TOKEN_EXPIRY = '2h';
const REFRESH_TOKEN_EXPIRY = '7d';

interface LoginInput {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string };
}

export class LoginUser {
  constructor(private userRepo: IUserRepository) {}

  execute(input: LoginInput): AuthTokens {
    const user = this.userRepo.findByEmail(input.email.toLowerCase().trim());
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Google-only accounts can't login with password
    if (!user.passwordHash) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const valid = bcrypt.compareSync(input.password, user.passwordHash);
    if (!valid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}

export class RefreshToken {
  constructor(private userRepo: IUserRepository) {}

  execute(refreshToken: string): AuthTokens {
    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET) as any;
      if (payload.type !== 'refresh') throw new Error('INVALID_TOKEN');

      const user = this.userRepo.findById(payload.userId);
      if (!user) throw new Error('INVALID_TOKEN');

      const newAccessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
      const newRefreshToken = jwt.sign({ userId: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: { id: user.id, email: user.email, name: user.name },
      };
    } catch {
      throw new Error('INVALID_TOKEN');
    }
  }
}

export { JWT_SECRET };
