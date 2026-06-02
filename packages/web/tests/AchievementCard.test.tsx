import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AchievementCard } from '../src/components/AchievementCard';
import { AchievementDTO } from '../src/services/achievements';

function makeAchievement(overrides: Partial<AchievementDTO> = {}): AchievementDTO {
  return {
    id: 1,
    habitId: 'h1',
    title: 'Meditar — 7 dias',
    description: '7 check-ins no hábito',
    targetDays: 7,
    currentProgress: 3,
    progressPercent: 43,
    unlocked: false,
    unlockedAt: null,
    ...overrides,
  };
}

describe('AchievementCard', () => {
  it('renders locked achievement with lock icon', () => {
    render(<AchievementCard achievement={makeAchievement()} />);
    expect(screen.getByText('🔒')).toBeDefined();
    expect(screen.getByText('Meditar — 7 dias')).toBeDefined();
    expect(screen.getByText('3/7 dias')).toBeDefined();
  });

  it('renders unlocked achievement with trophy icon', () => {
    render(
      <AchievementCard
        achievement={makeAchievement({
          unlocked: true,
          currentProgress: 7,
          progressPercent: 100,
          unlockedAt: '2024-06-07T10:00:00Z',
        })}
      />
    );
    expect(screen.getByText('🏆')).toBeDefined();
    expect(screen.getByText('7/7 dias')).toBeDefined();
  });

  it('shows progress bar with correct width', () => {
    render(<AchievementCard achievement={makeAchievement({ progressPercent: 50 })} />);
    const bar = screen.getByTestId('progress-bar');
    expect(bar.style.width).toBe('50%');
  });

  it('shows checkmark badge when unlocked', () => {
    render(<AchievementCard achievement={makeAchievement({ unlocked: true })} />);
    expect(screen.getByText('✓')).toBeDefined();
  });

  it('does not show checkmark when locked', () => {
    render(<AchievementCard achievement={makeAchievement({ unlocked: false })} />);
    expect(screen.queryByText('✓')).toBeNull();
  });
});
