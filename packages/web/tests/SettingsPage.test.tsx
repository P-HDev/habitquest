import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SettingsPage } from '../src/pages/SettingsPage';

vi.mock('../src/services/notifications', () => ({
  getNotificationSettings: vi.fn().mockResolvedValue({
    enabled: true,
    hours: ['08:00', '14:00', '21:00'],
  }),
  updateNotificationSettings: vi.fn().mockResolvedValue(undefined),
}));

describe('SettingsPage', () => {
  it('renders settings after loading', async () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando configurações...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('⚙️ Configurações')).toBeDefined();
    });

    expect(screen.getByText('08:00')).toBeDefined();
    expect(screen.getByText('14:00')).toBeDefined();
    expect(screen.getByText('21:00')).toBeDefined();
  });

  it('can remove an hour', async () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('08:00')).toBeDefined();
    });

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText('08:00')).toBeNull();
  });

  it('has a save button', async () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Salvar Configurações')).toBeDefined();
    });
  });
});
