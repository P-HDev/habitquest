import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/user.repository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'habitquest-secret-dev';
const ACCESS_TOKEN_EXPIRY = '2h';
const REFRESH_TOKEN_EXPIRY = '7d';

interface GoogleAuthResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string; avatarUrl?: string };
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export class GoogleAuth {
  constructor(private userRepo: IUserRepository) {}

  async execute(token: string): Promise<GoogleAuthResult> {
    // The token from useGoogleLogin is an access_token, not an id_token
    // We use it to fetch user info from Google's userinfo endpoint
    const userInfo = await this.fetchGoogleUserInfo(token);

    if (!userInfo || !userInfo.email) {
      throw new Error('INVALID_GOOGLE_TOKEN');
    }

    const { email, name, sub: googleId, picture } = userInfo;
    let user = this.userRepo.findByGoogleId(googleId) || this.userRepo.findByEmail(email);

    if (user) {
      if (!user.googleId) {
        this.userRepo.updateGoogleId(user.id, googleId);
      }
    } else {
      user = {
        id: randomUUID(),
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        passwordHash: '',
        authProvider: 'google',
        googleId: googleId,
        avatarUrl: picture,
        createdAt: new Date().toISOString(),
      };
      this.userRepo.create(user);
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ userId: user.id, type: 'refresh' }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    };
  }

  private async fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      return (await res.json()) as GoogleUserInfo;
    } catch (err) {
      console.error('[GoogleAuth] Failed to fetch user info:', err);
      throw new Error('INVALID_GOOGLE_TOKEN', { cause: err });
    }
  }
}
