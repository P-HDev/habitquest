import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import { User } from '../../domain/entities/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'habitquest-secret-dev';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const ACCESS_TOKEN_EXPIRY = '2h';
const REFRESH_TOKEN_EXPIRY = '7d';

interface GoogleAuthResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string; avatarUrl?: string };
}

export class GoogleAuth {
  private client: OAuth2Client;

  constructor(private userRepo: IUserRepository) {
    this.client = new OAuth2Client(GOOGLE_CLIENT_ID);
  }

  async execute(idToken: string): Promise<GoogleAuthResult> {
    const payload = await this.verifyGoogleToken(idToken);

    if (!payload || !payload.email) {
      throw new Error('INVALID_GOOGLE_TOKEN');
    }

    const { email, name, sub: googleId, picture } = payload;
    let user = this.userRepo.findByGoogleId(googleId!) || this.userRepo.findByEmail(email!);

    if (user) {
      // Link Google ID if not already linked
      if (!user.googleId) {
        this.userRepo.updateGoogleId(user.id, googleId!);
      }
    } else {
      // Create new user from Google
      user = {
        id: randomUUID(),
        email: email!.toLowerCase(),
        name: name || email!.split('@')[0],
        passwordHash: null,
        authProvider: 'google',
        googleId: googleId!,
        avatarUrl: picture,
        createdAt: new Date().toISOString(),
      };
      this.userRepo.create(user);
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    };
  }

  private async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    } catch {
      throw new Error('INVALID_GOOGLE_TOKEN');
    }
  }
}
