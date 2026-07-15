import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/shared/infrastructure/App.js';

const { onAuthStateChange } = vi.hoisted(() => ({
  onAuthStateChange: vi.fn(),
}));

vi.mock('../src/shared/infrastructure/supabaseClient.js', () => ({
  getAccessToken: vi.fn(() => Promise.resolve('test-token')),
  supabase: {
    auth: {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: {
            session: {
              user: { email: 'collector@example.com', identities: [{ provider: 'email' }] },
            },
          },
        }),
      ),
      onAuthStateChange,
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      updateUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  },
}));

vi.mock('../src/catalog/infrastructure/ui/pages/StickerListPage.js', () => ({
  StickerListPage: () => <div data-testid="sticker-list-page">Dashboard</div>,
}));

describe('The authenticated App shell', () => {
  beforeEach(() => {
    onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    }));
  });

  it('exposes the account toolbar as a landmark', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('banner', { name: 'Cuenta' })).toBeInTheDocument();
    });
  });

  it('opens account settings from the Account control', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cuenta' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cuenta' }));

    const dialog = screen.getByRole('dialog', { name: 'Configuración de cuenta' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('collector@example.com')).toBeInTheDocument();
  });

  it('shows reset-password form when a recovery session is detected', async () => {
    onAuthStateChange.mockImplementation((callback: (event: string, session: unknown) => void) => {
      callback('PASSWORD_RECOVERY', { user: { email: 'collector@example.com' } });
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('form', { name: 'Restablecer contraseña' })).toBeInTheDocument();
      expect(screen.queryByTestId('sticker-list-page')).not.toBeInTheDocument();
    });
  });
});
