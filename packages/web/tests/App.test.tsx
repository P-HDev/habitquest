import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';

describe('App', () => {
  it('should render the header with HabitQuest title', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    // Header renders the navigation
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render the habits page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('Hoje').length).toBeGreaterThanOrEqual(1);
  });

  it('should show new habit button', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Novo Hábito')).toBeInTheDocument();
  });
});
