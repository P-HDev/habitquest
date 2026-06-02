export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  authProvider: 'local' | 'google';
  googleId?: string;
  avatarUrl?: string;
  createdAt: string;
}
