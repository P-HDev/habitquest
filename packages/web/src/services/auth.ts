const API_BASE = '/api';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string; avatarUrl?: string };
}

export async function register(email: string, name: string, password: string): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erro ao registrar');
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erro ao fazer login');
  }
  return res.json();
}

export async function googleLogin(idToken: string): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erro ao fazer login com Google');
  }
  return res.json();
}

export async function refreshToken(token: string): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: token }),
  });
  if (!res.ok) throw new Error('Token expirado');
  return res.json();
}

export async function getMe(accessToken: string): Promise<{ id: string; email: string; name: string }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Não autenticado');
  return res.json();
}
