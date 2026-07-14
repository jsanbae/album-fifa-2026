import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from '../src/shared/infrastructure/ui/components/Modal/Modal.js';

describe('Modal', () => {
  it('renders a dialog with an accessible title', () => {
    render(
      <Modal open title="Register stickers" titleId="modal-title" onClose={vi.fn()}>
        <p>Body content</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Register stickers' });

    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('does not show dialog content when closed', () => {
    render(
      <Modal open={false} title="Register stickers" titleId="modal-title" onClose={vi.fn()}>
        <p>Body content</p>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is activated', () => {
    const onClose = vi.fn();

    render(
      <Modal open title="Register stickers" titleId="modal-title" onClose={onClose}>
        <p>Body content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();

    render(
      <Modal open title="Register stickers" titleId="modal-title" onClose={onClose}>
        <p>Body content</p>
      </Modal>,
    );

    fireEvent(
      screen.getByRole('dialog'),
      new Event('cancel', { bubbles: true, cancelable: true }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
