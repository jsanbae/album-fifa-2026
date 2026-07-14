import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SignInForm } from '../src/shared/infrastructure/ui/SignInForm.js';

function mockBoundingRect(element: HTMLElement) {
  element.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
}

function dispatchPointerMove(target: HTMLElement, clientX: number, clientY: number) {
  act(() => {
    const event = new Event('pointermove', { bubbles: true });
    Object.defineProperty(event, 'clientX', { value: clientX });
    Object.defineProperty(event, 'clientY', { value: clientY });
    target.dispatchEvent(event);
  });
}

vi.mock('../src/shared/infrastructure/supabaseClient.js', () => ({
  getAccessToken: vi.fn(() => Promise.resolve(null)),
  supabase: {
    auth: {
      signInWithPassword: vi.fn(() => new Promise(() => {})),
      signInWithOtp: vi.fn(() => new Promise(() => {})),
      signUp: vi.fn(() => new Promise(() => {})),
      resetPasswordForEmail: vi.fn(() => new Promise(() => {})),
    },
  },
}));

describe('The SignInForm', () => {
  it('renders sign-in branding through SignInBranding', () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    expect(screen.getByTestId('sign-in-branding')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-branding-divider')).toBeInTheDocument();
  });

  it('exposes the selected sign-in method with aria-pressed', () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    expect(screen.getByRole('img', { name: 'FIFA World Cup 2026' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Panini' })).toBeInTheDocument();

    const passwordMode = screen.getByRole('button', { name: 'Email & password' });
    const magicLinkMode = screen.getByRole('button', { name: 'Magic link' });

    expect(passwordMode).toHaveAttribute('aria-pressed', 'true');
    expect(magicLinkMode).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(magicLinkMode);

    expect(passwordMode).toHaveAttribute('aria-pressed', 'false');
    expect(magicLinkMode).toHaveAttribute('aria-pressed', 'true');
  });

  it('groups sign-in method choices for assistive technologies', () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Sign-in method' })).toBeInTheDocument();
  });

  it('announces loading state while sign-in is in progress', async () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'collector@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByRole('form', { name: 'Sign in' })).toHaveAttribute('aria-busy', 'true');

    await waitFor(() => {
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveTextContent('Signing in, please wait.');
    });
  });

  it('announces a distinct loading message for magic link requests', async () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Magic link' }));
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'collector@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send magic link' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Sending magic link, please wait.');
    });
  });

  it('keeps the sign-in card static when the pointer moves over it', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<SignInForm onSignedIn={vi.fn()} />);

    const card = screen.getByTestId('sign-in-card');
    mockBoundingRect(card);
    dispatchPointerMove(card, 100, 0);

    expect(card.style.getPropertyValue('--tilt-y')).toBe('');
    expect(card.style.getPropertyValue('--tilt-x')).toBe('');
  });

  it('navigates between sign-in, sign-up, and forgot-password views', () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    expect(screen.getByRole('form', { name: 'Sign in' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect(screen.getByRole('form', { name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Back to sign in' }));
    expect(screen.getByRole('form', { name: 'Sign in' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Forgot password' }));
    expect(screen.getByRole('form', { name: 'Forgot password' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  });

  it('calls signUp and shows a success message after sign up', async () => {
    const { supabase } = await import('../src/shared/infrastructure/supabaseClient.js');
    const signUp = vi.mocked(supabase!.auth.signUp);
    signUp.mockResolvedValueOnce({ data: { session: null, user: null }, error: null });

    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret-pass' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'secret-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'secret-pass',
        options: { emailRedirectTo: window.location.origin },
      });
      expect(screen.getByRole('status')).toHaveTextContent('Check your email to confirm your account.');
    });
  });

  it('displays Supabase validation errors on sign up', async () => {
    const { supabase } = await import('../src/shared/infrastructure/supabaseClient.js');
    const signUp = vi.mocked(supabase!.auth.signUp);
    signUp.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: { message: 'Password should be at least 6 characters' } as never,
    });

    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Password should be at least 6 characters');
    });
  });

  it('calls resetPasswordForEmail and shows a success message', async () => {
    const { supabase } = await import('../src/shared/infrastructure/supabaseClient.js');
    const resetPasswordForEmail = vi.mocked(supabase!.auth.resetPasswordForEmail);
    resetPasswordForEmail.mockResolvedValueOnce({ data: {}, error: null });

    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Forgot password' }));
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'collector@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

    await waitFor(() => {
      expect(resetPasswordForEmail).toHaveBeenCalledWith('collector@example.com', {
        redirectTo: window.location.origin,
      });
      expect(screen.getByRole('status')).toHaveTextContent(
        'Check your email for the password reset link.',
      );
    });
  });
});
