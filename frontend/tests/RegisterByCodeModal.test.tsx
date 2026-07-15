import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RegisterByCodeModal } from '../src/collection/infrastructure/ui/components/RegisterByCodeModal.js';

describe('RegisterByCodeModal', () => {
  it('renders the register form inside a dialog', () => {
    render(
      <RegisterByCodeModal open onClose={vi.fn()} onRegister={vi.fn()} />,
    );

    expect(screen.getByRole('dialog', { name: 'Registrar cromos' })).toBeInTheDocument();
    expect(screen.getByLabelText('Registrar por código')).toBeInTheDocument();
  });

  it('closes after a fully successful registration', async () => {
    const onClose = vi.fn();
    const onRegister = vi.fn().mockResolvedValue({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: [],
    });

    render(
      <RegisterByCodeModal open onClose={onClose} onRegister={onRegister} />,
    );

    fireEvent.change(screen.getByLabelText('Registrar por código'), {
      target: { value: 'MEX1' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('stays open when unknown codes are returned', async () => {
    const onClose = vi.fn();
    const onRegister = vi.fn().mockResolvedValue({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: ['NOTREAL'],
    });

    render(
      <RegisterByCodeModal open onClose={onClose} onRegister={onRegister} />,
    );

    fireEvent.change(screen.getByLabelText('Registrar por código'), {
      target: { value: 'MEX1, NOTREAL' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(screen.getByText(/NOTREAL/)).toBeInTheDocument();
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
