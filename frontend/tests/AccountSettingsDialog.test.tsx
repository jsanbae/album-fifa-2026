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

    expect(screen.getByRole('dialog', { name: 'Account settings' })).toBeInTheDocument();
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

    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
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

    expect(screen.queryByLabelText('New password')).not.toBeInTheDocument();
    expect(
      screen.getByText('Password changes are not available for magic-link-only accounts.'),
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

    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'new-secret-pass' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'new-secret-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update password' }));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({ password: 'new-secret-pass' });
      expect(screen.getByRole('status')).toHaveTextContent('Password updated successfully.');
    });
  });
});
