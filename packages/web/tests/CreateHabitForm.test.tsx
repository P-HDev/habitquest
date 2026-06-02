import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateHabitForm } from '../src/components/CreateHabitForm';

describe('CreateHabitForm', () => {
  it('should render form fields', () => {
    render(<CreateHabitForm onSubmit={async () => {}} />);

    expect(screen.getByPlaceholderText('Nome do hábito')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descrição (opcional)')).toBeInTheDocument();
    expect(screen.getByText('Criar Hábito')).toBeInTheDocument();
  });

  it('should disable submit button when name is empty', () => {
    render(<CreateHabitForm onSubmit={async () => {}} />);

    const button = screen.getByText('Criar Hábito');
    expect(button).toBeDisabled();
  });

  it('should enable submit button when name has value', () => {
    render(<CreateHabitForm onSubmit={async () => {}} />);

    const input = screen.getByPlaceholderText('Nome do hábito');
    fireEvent.change(input, { target: { value: 'Gym' } });

    const button = screen.getByText('Criar Hábito');
    expect(button).not.toBeDisabled();
  });

  it('should have default target days of 30', () => {
    render(<CreateHabitForm onSubmit={async () => {}} />);

    const input = screen.getByDisplayValue('30');
    expect(input).toBeInTheDocument();
  });
});
