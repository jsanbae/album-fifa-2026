import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RegisterByCodeForm } from '../src/collection/infrastructure/ui/components/RegisterByCodeForm.js';

describe('RegisterByCodeForm', () => {
  it('submits comma-separated codes', async () => {
    const onRegister = vi.fn().mockResolvedValue({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: [],
    });

    render(<RegisterByCodeForm onRegister={onRegister} />);

    fireEvent.change(screen.getByLabelText('Registrar por código'), {
      target: { value: 'MEX1, FWC1' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(onRegister).toHaveBeenCalledWith('MEX1, FWC1');
    });
  });

  it('disables submit while loading', () => {
    render(<RegisterByCodeForm onRegister={vi.fn()} loading />);

    expect(screen.getByRole('button', { name: 'Registrar' })).toBeDisabled();
  });

  it('shows unknown codes after submit', async () => {
    const onRegister = vi.fn().mockResolvedValue({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: ['NOTREAL'],
    });

    render(<RegisterByCodeForm onRegister={onRegister} />);

    fireEvent.change(screen.getByLabelText('Registrar por código'), {
      target: { value: 'MEX1, NOTREAL' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(screen.getByText(/NOTREAL/)).toBeInTheDocument();
    });
  });

  it('clears input after successful registration', async () => {
    const onRegister = vi.fn().mockResolvedValue({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: [],
    });

    render(<RegisterByCodeForm onRegister={onRegister} />);

    const input = screen.getByLabelText('Registrar por código');
    fireEvent.change(input, { target: { value: 'MEX1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('calls onSuccess after a fully successful registration', async () => {
    const onRegister = vi.fn().mockResolvedValue({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: [],
    });
    const onSuccess = vi.fn();

    render(<RegisterByCodeForm onRegister={onRegister} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText('Registrar por código'), {
      target: { value: 'MEX1' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
