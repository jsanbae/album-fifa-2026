import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResetPasswordForm } from '../src/shared/infrastructure/ui/ResetPasswordForm.js';

vi.mock('../src/shared/infrastructure/supabaseClient.js', () => ({
  getAccessToken: vi.fn(() => Promise.resolve(null)),
  supabase: {
    auth: {
      updateUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  },
}));

describe('The ResetPasswordForm', () => {
  it('calls updateUser and completes after saving a new password', async () => {
    const { supabase } = await import('../src/shared/infrastructure/supabaseClient.js');
    const updateUser = vi.mocked(supabase!.auth.updateUser);
    const onComplete = vi.fn();

    render(<ResetPasswordForm onComplete={onComplete} />);

    fireEvent.change(screen.getByLabelText('Nueva contraseña'), {
      target: { value: 'new-secret-pass' },
    });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
      target: { value: 'new-secret-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar nueva contraseña' }));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({ password: 'new-secret-pass' });
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });
});
