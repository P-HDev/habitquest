import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../src/pages/LoginPage';
import { AuthProvider } from '../src/contexts/AuthContext';

vi.mock('../src/services/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  googleLogin: vi.fn(),
  refreshToken: vi.fn(),
  getMe: vi.fn(),
}));

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess }: any) => (
    <button onClick={() => onSuccess({ credential: 'mock-token' })} data-testid="google-btn">
      Google Login
    </button>
  ),
  GoogleOAuthProvider: ({ children }: any) => <>{children}</>,
}));

import * as authService from '../src/services/auth';
const mockLogin = vi.mocked(authService.login);
const mockRegister = vi.mocked(authService.register);
const mockGoogleLogin = vi.mocked(authService.googleLogin);

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form by default', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Email')).toBeDefined();
    expect(screen.getByPlaceholderText(/Senha/)).toBeDefined();
    expect(screen.getByText('Entrar')).toBeDefined();
  });

  it('switches to register form', () => {
    renderLogin();
    fireEvent.click(screen.getByText('Criar conta'));
    expect(screen.getByPlaceholderText('Seu nome')).toBeDefined();
    expect(screen.getByText('Criar Conta')).toBeDefined();
  });

  it('shows error on failed login', async () => {
    mockLogin.mockRejectedValue(new Error('Email ou senha inválidos'));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'x@x.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Senha/), { target: { value: 'wrong1' } });
    fireEvent.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('Email ou senha inválidos')).toBeDefined();
    });
  });

  it('calls login on submit', async () => {
    mockLogin.mockResolvedValue({
      accessToken: 'tok',
      refreshToken: 'ref',
      user: { id: '1', email: 'x@x.com', name: 'X' },
    });
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'x@x.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Senha/), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('x@x.com', 'pass123');
    });
  });

  it('calls register on register submit', async () => {
    mockRegister.mockResolvedValue({
      accessToken: 'tok',
      refreshToken: 'ref',
      user: { id: '1', email: 'y@y.com', name: 'Y' },
    });
    renderLogin();

    fireEvent.click(screen.getByText('Criar conta'));
    fireEvent.change(screen.getByPlaceholderText('Seu nome'), { target: { value: 'Y' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'y@y.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Senha/), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByText('Criar Conta'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('y@y.com', 'Y', 'pass123');
    });
  });

  it('renders Google login button', () => {
    renderLogin();
    expect(screen.getByTestId('google-btn')).toBeDefined();
  });

  it('calls googleLogin when Google button clicked', async () => {
    mockGoogleLogin.mockResolvedValue({
      accessToken: 'tok',
      refreshToken: 'ref',
      user: { id: '1', email: 'g@g.com', name: 'G' },
    });
    renderLogin();

    fireEvent.click(screen.getByTestId('google-btn'));

    await waitFor(() => {
      expect(mockGoogleLogin).toHaveBeenCalledWith('mock-token');
    });
  });
});
