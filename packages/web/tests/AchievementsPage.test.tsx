import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AchievementsPage } from '../src/pages/AchievementsPage';

vi.mock('../src/hooks/useAchievements', () => ({
  useAchievements: vi.fn(),
}));

import { useAchievements } from '../src/hooks/useAchievements';
const mockUseAchievements = vi.mocked(useAchievements);

describe('AchievementsPage', () => {
  it('shows loading state', () => {
    mockUseAchievements.mockReturnValue({
      achievements: [],
      unlocked: [],
      locked: [],
      loading: true,
      error: null,
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AchievementsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Carregando conquistas...')).toBeDefined();
  });

  it('shows empty state', () => {
    mockUseAchievements.mockReturnValue({
      achievements: [],
      unlocked: [],
      locked: [],
      loading: false,
      error: null,
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AchievementsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Crie hábitos para desbloquear conquistas!')).toBeDefined();
  });

  it('shows unlocked and locked sections', () => {
    const unlocked = [
      { id: 1, habitId: 'h1', title: 'Conquista A', description: null, targetDays: 7, currentProgress: 7, progressPercent: 100, unlocked: true, unlockedAt: '2024-01-01' },
    ];
    const locked = [
      { id: 2, habitId: 'h1', title: 'Conquista B', description: null, targetDays: 21, currentProgress: 10, progressPercent: 48, unlocked: false, unlockedAt: null },
    ];

    mockUseAchievements.mockReturnValue({
      achievements: [...unlocked, ...locked],
      unlocked,
      locked,
      loading: false,
      error: null,
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AchievementsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('⭐ Desbloqueadas')).toBeDefined();
    expect(screen.getByText('🔒 Em progresso')).toBeDefined();
    expect(screen.getByText('Conquista A')).toBeDefined();
    expect(screen.getByText('Conquista B')).toBeDefined();
    expect(screen.getByText('1/2 desbloqueadas')).toBeDefined();
  });

  it('shows error state', () => {
    mockUseAchievements.mockReturnValue({
      achievements: [],
      unlocked: [],
      locked: [],
      loading: false,
      error: 'Falha ao carregar',
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AchievementsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Falha ao carregar')).toBeDefined();
  });
});
