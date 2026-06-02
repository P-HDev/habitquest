import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../src/pages/DashboardPage';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../src/hooks/useStats', () => ({
  useStats: vi.fn(),
}));

import { useStats } from '../src/hooks/useStats';
const mockUseStats = vi.mocked(useStats);

describe('DashboardPage', () => {
  it('shows loading state', () => {
    mockUseStats.mockReturnValue({ stats: null, loading: true, reload: vi.fn() });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Carregando dashboard...')).toBeDefined();
  });

  it('shows stats when loaded', () => {
    mockUseStats.mockReturnValue({
      stats: {
        totalHabits: 5,
        totalCheckins: 42,
        completedToday: 3,
        maxStreak: 14,
        unlockedAchievements: 4,
        totalAchievements: 10,
        achievementPercent: 40,
      },
      loading: false,
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('📊 Dashboard')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('3/5')).toBeDefined();
    expect(screen.getByText('14 dias')).toBeDefined();
    expect(screen.getByText('42')).toBeDefined();
    expect(screen.getByText('4/10')).toBeDefined();
    expect(screen.getByText('40%')).toBeDefined();
  });

  it('shows streak record card when maxStreak > 0', () => {
    mockUseStats.mockReturnValue({
      stats: {
        totalHabits: 1,
        totalCheckins: 10,
        completedToday: 0,
        maxStreak: 7,
        unlockedAchievements: 1,
        totalAchievements: 3,
        achievementPercent: 33,
      },
      loading: false,
      reload: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Recorde de Streak')).toBeDefined();
    expect(screen.getByText('7 dias seguidos')).toBeDefined();
  });
});
