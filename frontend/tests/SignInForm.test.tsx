import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

const supabaseAuth = vi.hoisted(() => ({
  signInWithPassword: vi.fn(() => new Promise(() => {})),
  signInWithOtp: vi.fn(() => new Promise(() => {})),
  signUp: vi.fn(() => new Promise(() => {})),
  resetPasswordForEmail: vi.fn(() => new Promise(() => {})),
  signInWithOAuth: vi.fn(() => new Promise(() => {})),
}));

const supabaseClient = vi.hoisted(() => ({
  current: { auth: supabaseAuth } as { auth: typeof supabaseAuth } | null,
}));

vi.mock('../src/shared/infrastructure/supabaseClient.js', () => ({
  getAccessToken: vi.fn(() => Promise.resolve(null)),
  get supabase() {
    return supabaseClient.current;
  },
}));

describe('The SignInForm', () => {
  afterEach(() => {
    supabaseClient.current = { auth: supabaseAuth };
    vi.clearAllMocks();
  });

  it('renders sign-in branding through SignInBranding', () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    expect(screen.getByTestId('sign-in-branding')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-branding-divider')).toBeInTheDocument();
  });

  it('exposes the selected sign-in method with aria-pressed', () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    expect(screen.getByRole('img', { name: 'FIFA World Cup 2026' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Panini' })).toBeInTheDocument();

    const passwordMode = screen.getByRole('button', { name: 'Correo y contraseña' });
    const magicLinkMode = screen.getByRole('button', { name: 'Enlace mágico' });

    expect(passwordMode).toHaveAttribute('aria-pressed', 'true');
    expect(magicLinkMode).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(magicLinkMode);

    expect(passwordMode).toHaveAttribute('aria-pressed', 'false');
    expect(magicLinkMode).toHaveAttribute('aria-pressed', 'true');
  });

  it('groups sign-in method choices for assistive technologies', () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Método de inicio de sesión' })).toBeInTheDocument();
  });

  it('announces loading state while sign-in is in progress', async () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Correo'), {
      target: { value: 'collector@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'secret-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(screen.getByRole('form', { name: 'Iniciar sesión' })).toHaveAttribute('aria-busy', 'true');

    await waitFor(() => {
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveTextContent('Iniciando sesión, espera…');
    });
  });

  it('announces a distinct loading message for magic link requests', async () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Enlace mágico' }));
    fireEvent.change(screen.getByLabelText('Correo'), {
      target: { value: 'collector@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar enlace mágico' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Enviando enlace mágico, espera…');
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

    expect(screen.getByRole('form', { name: 'Iniciar sesión' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByRole('form', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Volver a iniciar sesión' }));
    expect(screen.getByRole('form', { name: 'Iniciar sesión' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Olvidé mi contraseña' }));
    expect(screen.getByRole('form', { name: 'Olvidé mi contraseña' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Contraseña')).not.toBeInTheDocument();
  });

  it('calls signUp and shows a success message after sign up', async () => {
    const { supabase } = await import('../src/shared/infrastructure/supabaseClient.js');
    const signUp = vi.mocked(supabase!.auth.signUp);
    signUp.mockResolvedValueOnce({ data: { session: null, user: null }, error: null });

    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    fireEvent.change(screen.getByLabelText('Correo'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'secret-pass' },
    });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
      target: { value: 'secret-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'secret-pass',
        options: { emailRedirectTo: window.location.origin },
      });
      expect(screen.getByRole('status')).toHaveTextContent('Revisa tu correo para confirmar tu cuenta.');
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

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    fireEvent.change(screen.getByLabelText('Correo'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Password should be at least 6 characters');
    });
  });

  it('calls resetPasswordForEmail and shows a success message', async () => {
    const { supabase } = await import('../src/shared/infrastructure/supabaseClient.js');
    const resetPasswordForEmail = vi.mocked(supabase!.auth.resetPasswordForEmail);
    resetPasswordForEmail.mockResolvedValueOnce({ data: {}, error: null });

    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Olvidé mi contraseña' }));
    fireEvent.change(screen.getByLabelText('Correo'), {
      target: { value: 'collector@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar enlace de restablecimiento' }));

    await waitFor(() => {
      expect(resetPasswordForEmail).toHaveBeenCalledWith('collector@example.com', {
        redirectTo: window.location.origin,
      });
      expect(screen.getByRole('status')).toHaveTextContent(
        'Revisa tu correo para el enlace de restablecimiento.',
      );
    });
  });

  it('shows Iniciar sesión con Google on sign-in and hides it on forgot-password', () => {
    render(<SignInForm onSignedIn={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Iniciar sesión con Google' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Olvidé mi contraseña' }));

    expect(screen.queryByRole('button', { name: 'Iniciar sesión con Google' })).not.toBeInTheDocument();
  });

  it('starts Google OAuth with redirect to the app origin', async () => {
    supabaseAuth.signInWithOAuth.mockResolvedValueOnce({ data: { provider: 'google', url: null }, error: null });

    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión con Google' }));

    await waitFor(() => {
      expect(supabaseAuth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
    });
  });

  it('explains missing Supabase config when Google sign-in is unavailable', async () => {
    supabaseClient.current = null;

    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión con Google' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.',
      );
    });
    expect(supabaseAuth.signInWithOAuth).not.toHaveBeenCalled();
  });

  it('displays Google OAuth errors and clears the loading state', async () => {
    supabaseAuth.signInWithOAuth.mockResolvedValueOnce({
      data: { provider: 'google', url: null },
      error: { message: 'Provider is not enabled' } as never,
    });

    render(<SignInForm onSignedIn={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión con Google' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Provider is not enabled');
    });
    expect(screen.getByRole('button', { name: 'Iniciar sesión con Google' })).not.toBeDisabled();
  });
});
