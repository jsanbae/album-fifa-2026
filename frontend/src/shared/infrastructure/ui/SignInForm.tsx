import { Maybe } from '@album/common';
import type { FormEvent } from 'react';
import { useId, useState } from 'react';
import { AUTH_SUBTITLES, type AuthView, type SignInMode } from './authViews.js';
import { SignInBranding } from './components/SignInBranding/SignInBranding.js';
import { supabase } from '../supabaseClient.js';
import { ui } from './uiStrings.js';
import styles from './SignInForm.module.css';

interface SignInFormProps {
  onSignedIn: () => void;
}

interface SignInState {
  view: AuthView;
  email: string;
  password: string;
  confirmPassword: string;
  mode: SignInMode;
  loading: boolean;
  pendingGoogle: boolean;
  message: Maybe<string>;
  error: Maybe<string>;
}

const initialState: SignInState = {
  view: 'sign-in',
  email: '',
  password: '',
  confirmPassword: '',
  mode: 'password',
  loading: false,
  pendingGoogle: false,
  message: Maybe.none(),
  error: Maybe.none(),
};

export function SignInForm(props: SignInFormProps) {
  const [state, setState] = useState<SignInState>(initialState);
  const titleId = useId();

  const setView = (view: AuthView) => {
    setState((prev) => ({
      ...prev,
      view,
      error: Maybe.none(),
      message: Maybe.none(),
    }));
  };

  const setEmail = (email: string) => {
    setState((prev) => ({ ...prev, email, error: Maybe.none(), message: Maybe.none() }));
  };

  const setPassword = (password: string) => {
    setState((prev) => ({ ...prev, password, error: Maybe.none(), message: Maybe.none() }));
  };

  const setConfirmPassword = (confirmPassword: string) => {
    setState((prev) => ({ ...prev, confirmPassword, error: Maybe.none(), message: Maybe.none() }));
  };

  const setMode = (mode: SignInMode) => {
    setState((prev) => ({ ...prev, mode, error: Maybe.none(), message: Maybe.none() }));
  };

  const startLoading = () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      pendingGoogle: false,
      error: Maybe.none(),
      message: Maybe.none(),
    }));
  };

  const startGoogleLoading = () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      pendingGoogle: true,
      error: Maybe.none(),
      message: Maybe.none(),
    }));
  };

  const setError = (error: string) => {
    setState((prev) => ({
      ...prev,
      loading: false,
      pendingGoogle: false,
      error: Maybe.some(error),
    }));
  };

  const setMessage = (message: string) => {
    setState((prev) => ({
      ...prev,
      loading: false,
      pendingGoogle: false,
      message: Maybe.some(message),
    }));
  };

  const handlePasswordSignIn = async () => {
    if (!supabase) {
      setError(ui.supabaseNotConfigured);
      return;
    }
    startLoading();
    const { error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    props.onSignedIn();
  };

  const handleMagicLink = async () => {
    if (!supabase) {
      setError(ui.supabaseNotConfigured);
      return;
    }
    startLoading();
    const { error } = await supabase.auth.signInWithOtp({
      email: state.email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setError(error.message);
      return;
    }
    setMessage(ui.auth.magicLinkSent);
  };

  const handleSignUp = async () => {
    if (!supabase) {
      setError(ui.supabaseNotConfigured);
      return;
    }

    if (state.password !== state.confirmPassword) {
      setError(ui.passwordsDoNotMatch);
      return;
    }

    startLoading();
    const { data, error } = await supabase.auth.signUp({
      email: state.email,
      password: state.password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      props.onSignedIn();
      return;
    }

    setMessage(ui.auth.confirmAccountEmail);
  };

  const handleForgotPassword = async () => {
    if (!supabase) {
      setError(ui.supabaseNotConfigured);
      return;
    }
    startLoading();
    const { error } = await supabase.auth.resetPasswordForEmail(state.email, {
      redirectTo: window.location.origin,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setMessage(ui.auth.resetLinkSent);
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setError(ui.supabaseNotConfigured);
      return;
    }
    startGoogleLoading();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (state.view === 'sign-up') {
      handleSignUp();
      return;
    }

    if (state.view === 'forgot-password') {
      handleForgotPassword();
      return;
    }

    if (state.mode === 'password') {
      handlePasswordSignIn();
      return;
    }

    handleMagicLink();
  };

  const formLabel =
    state.view === 'sign-up'
      ? ui.auth.formSignUp
      : state.view === 'forgot-password'
        ? ui.auth.formForgotPassword
        : ui.auth.formSignIn;

  const submitLabel =
    state.view === 'sign-up'
      ? ui.auth.createAccount
      : state.view === 'forgot-password'
        ? ui.auth.sendResetLink
        : state.mode === 'password'
          ? ui.auth.signIn
          : ui.auth.sendMagicLink;

  const loadingMessage = state.pendingGoogle
    ? ui.auth.redirectingGoogle
    : state.view === 'sign-up'
      ? ui.auth.creatingAccount
      : state.view === 'forgot-password'
        ? ui.auth.sendingResetLink
        : state.mode === 'password'
          ? ui.auth.signingIn
          : ui.auth.sendingMagicLink;

  return (
    <main className={styles.container} aria-labelledby={titleId}>
      <div className={styles.card} data-testid="sign-in-card">
        <SignInBranding titleId={titleId} subtitle={AUTH_SUBTITLES[state.view]} />

        {state.view === 'sign-in' && (
          <>
            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleSignIn}
              disabled={state.loading}
              aria-busy={state.pendingGoogle}
            >
              {state.pendingGoogle ? ui.pleaseWait : ui.auth.signInWithGoogle}
            </button>

            <div className={styles.authDivider} role="separator" aria-label={ui.or}>
              <span className={styles.authDividerLabel}>{ui.or}</span>
            </div>

            <div className={styles.modeToggle} role="group" aria-label={ui.auth.signInMethod}>
              <button
                type="button"
                className={state.mode === 'password' ? styles.modeActive : styles.modeButton}
                onClick={() => setMode('password')}
                aria-pressed={state.mode === 'password'}
                disabled={state.loading}
              >
                {ui.auth.emailPassword}
              </button>
              <button
                type="button"
                className={state.mode === 'magic-link' ? styles.modeActive : styles.modeButton}
                onClick={() => setMode('magic-link')}
                aria-pressed={state.mode === 'magic-link'}
                disabled={state.loading}
              >
                {ui.auth.magicLink}
              </button>
            </div>
          </>
        )}

        <form
          className={styles.form}
          aria-label={formLabel}
          aria-busy={state.loading}
          onSubmit={handleSubmit}
        >
          <label className={styles.label} htmlFor="sign-in-email">
            {ui.email}
          </label>
          <input
            id="sign-in-email"
            className={styles.input}
            type="email"
            autoComplete="email"
            required
            value={state.email}
            onChange={(event) => setEmail(event.target.value)}
          />

          {state.view === 'sign-in' && state.mode === 'password' && (
            <>
              <label className={styles.label} htmlFor="sign-in-password">
                {ui.password}
              </label>
              <input
                id="sign-in-password"
                className={styles.input}
                type="password"
                autoComplete="current-password"
                required
                value={state.password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </>
          )}

          {state.view === 'sign-up' && (
            <>
              <label className={styles.label} htmlFor="sign-up-password">
                {ui.password}
              </label>
              <input
                id="sign-up-password"
                className={styles.input}
                type="password"
                autoComplete="new-password"
                required
                value={state.password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <label className={styles.label} htmlFor="sign-up-confirm-password">
                {ui.confirmPassword}
              </label>
              <input
                id="sign-up-confirm-password"
                className={styles.input}
                type="password"
                autoComplete="new-password"
                required
                value={state.confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </>
          )}

          {state.error.isSome() && (
            <p className={styles.error} role="alert">
              {state.error.getOrThrow()}
            </p>
          )}

          {state.message.isSome() && (
            <p className={styles.message} role="status">
              {state.message.getOrThrow()}
            </p>
          )}

          {state.loading && (
            <p className={styles.loadingStatus} role="status" aria-live="polite">
              {loadingMessage}
            </p>
          )}

          <button className={styles.submitButton} type="submit" disabled={state.loading}>
            {state.loading ? ui.pleaseWait : submitLabel}
          </button>

          <div className={styles.navLinks}>
            {state.view === 'sign-in' && state.mode === 'password' && (
              <>
                <button type="button" className={styles.navLink} onClick={() => setView('sign-up')}>
                  {ui.auth.createAccount}
                </button>
                <button
                  type="button"
                  className={styles.navLink}
                  onClick={() => setView('forgot-password')}
                >
                  {ui.auth.forgotPassword}
                </button>
              </>
            )}

            {state.view === 'sign-in' && state.mode === 'magic-link' && (
              <button type="button" className={styles.navLink} onClick={() => setView('sign-up')}>
                {ui.auth.createAccount}
              </button>
            )}

            {(state.view === 'sign-up' || state.view === 'forgot-password') && (
              <button type="button" className={styles.navLink} onClick={() => setView('sign-in')}>
                {ui.auth.backToSignIn}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
