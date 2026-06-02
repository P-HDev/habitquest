import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HabitCard } from '../src/components/HabitCard';

describe('HabitCard', () => {
  const mockHabit = {
    id: '1',
    name: 'Meditar',
    description: '10 minutos por dia',
    targetDays: 30,
    icon: '🧘',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  it('should render habit name', () => {
    render(<HabitCard habit={mockHabit} />);
    expect(screen.getByText('Meditar')).toBeInTheDocument();
  });

  it('should render habit icon', () => {
    render(<HabitCard habit={mockHabit} />);
    expect(screen.getByRole('img', { name: 'Meditar' })).toHaveTextContent('🧘');
  });

  it('should render description', () => {
    render(<HabitCard habit={mockHabit} />);
    expect(screen.getByText('10 minutos por dia')).toBeInTheDocument();
  });

  it('should render target days', () => {
    render(<HabitCard habit={mockHabit} />);
    expect(screen.getByText('Meta: 30 dias')).toBeInTheDocument();
  });

  it('should render progress counter', () => {
    render(<HabitCard habit={mockHabit} />);
    expect(screen.getByText('0/30')).toBeInTheDocument();
  });

  it('should not render description if null', () => {
    const habitNoDesc = { ...mockHabit, description: null };
    render(<HabitCard habit={habitNoDesc} />);
    expect(screen.queryByText('10 minutos por dia')).not.toBeInTheDocument();
  });
});
