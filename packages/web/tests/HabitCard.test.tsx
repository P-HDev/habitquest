import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HabitCard } from '../src/components/HabitCard';
import { TodayHabit } from '../src/services/habits';

const makeTodayHabit = (overrides?: Partial<TodayHabit>): TodayHabit => ({
  habit: {
    id: '1',
    name: 'Meditar',
    description: '10 minutos por dia',
    targetDays: 30,
    icon: '🧘',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  completedToday: false,
  streak: 0,
  totalCompleted: 0,
  ...overrides,
});

describe('HabitCard', () => {
  it('should render habit name', () => {
    render(<HabitCard todayHabit={makeTodayHabit()} onToggle={() => {}} />);
    expect(screen.getByText('Meditar')).toBeInTheDocument();
  });

  it('should show unchecked icon when not completed', () => {
    render(<HabitCard todayHabit={makeTodayHabit()} onToggle={() => {}} />);
    expect(screen.getByText('🧘')).toBeInTheDocument();
  });

  it('should show check icon when completed', () => {
    render(<HabitCard todayHabit={makeTodayHabit({ completedToday: true })} onToggle={() => {}} />);
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('should call onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<HabitCard todayHabit={makeTodayHabit()} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith('1', false);
  });

  it('should show streak when > 0', () => {
    render(<HabitCard todayHabit={makeTodayHabit({ streak: 5, completedToday: true })} onToggle={() => {}} />);
    expect(screen.getByText('🔥 5')).toBeInTheDocument();
  });

  it('should not show streak when 0', () => {
    render(<HabitCard todayHabit={makeTodayHabit({ streak: 0 })} onToggle={() => {}} />);
    expect(screen.queryByText(/🔥/)).not.toBeInTheDocument();
  });

  it('should show progress counter', () => {
    render(<HabitCard todayHabit={makeTodayHabit({ totalCompleted: 15 })} onToggle={() => {}} />);
    expect(screen.getByText('15/30')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<HabitCard todayHabit={makeTodayHabit()} onToggle={() => {}} />);
    expect(screen.getByText('10 minutos por dia')).toBeInTheDocument();
  });

  it('should have aria-pressed reflecting completion state', () => {
    const { rerender } = render(<HabitCard todayHabit={makeTodayHabit()} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

    rerender(<HabitCard todayHabit={makeTodayHabit({ completedToday: true })} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });
});
