import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { User } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import { AccountSettingsDialog } from '../src/shared/infrastructure/ui/AccountSettingsDialog.js';

vi.mock('../src/shared/infrastructure/supabaseClient.js', () => ({
  getAccessToken: vi.fn(() => Promise.resolve('test-token')),
  supabase: {
    auth: {
      updateUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  },
}));

const passwordUser = {
  email: 'collector@example.com',
  identities: [{ provider: 'email' }],
} as User;

const magicLinkUser = {
  email: 'magic@example.com',
  identities: [{ provider: 'magiclink' }],
} as User;

describe('The AccountSettingsDialog', () => {
  it('shows the user email when opened', () => {
    render(
      <AccountSettingsDialog
        open
        user={passwordUser}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Configuración de cuenta' })).toBeInTheDocument();
    expect(screen.getByText('collector@example.com')).toBeInTheDocument();
  });

  it('shows change-password fields for password users', () => {
    render(
      <AccountSettingsDialog
        open
        user={passwordUser}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument();
  });

  it('hides change-password fields for magic-link-only users', () => {
    render(
      <AccountSettingsDialog
        open
        user={magicLinkUser}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />,
    );

    expect(screen.queryByLabelText('Nueva contraseña')).not.toBeInTheDocument();
    expect(
      screen.getByText('El cambio de contraseña no está disponible para cuentas solo con enlace mágico.'),
    ).toBeInTheDocument();
  });

  it('shows confirmation after a successful password change', async () => {
    const { supabase } = await import('../src/shared/infrastructure/supabaseClient.js');
    const updateUser = vi.mocked(supabase!.auth.updateUser);

    render(
      <AccountSettingsDialog
        open
        user={passwordUser}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'new-secret-pass' },
    });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
      target: { value: 'new-secret-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar contraseña' }));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({ password: 'new-secret-pass' });
      expect(screen.getByRole('status')).toHaveTextContent('Contraseña actualizada correctamente.');
    });
  });
});
