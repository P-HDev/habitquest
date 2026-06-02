import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';

vi.mock('../src/services/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  refreshToken: vi.fn(),
  getMe: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/habits']}>
        <App />
      </MemoryRouter>,
    );
    // Should show login page
    expect(screen.getByText('HabitQuest')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('shows habits page when authenticated', () => {
    localStorage.setItem('accessToken', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'a@a.com', name: 'A' }));

    render(
      <MemoryRouter initialEntries={['/habits']}>
        <App />
      </MemoryRouter>,
    );
    // Should show habits page (has "Novo Hábito" button)
    expect(screen.getByText('Novo Hábito')).toBeInTheDocument();
  });

  it('shows header with nav when authenticated', () => {
    localStorage.setItem('accessToken', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'a@a.com', name: 'A' }));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
