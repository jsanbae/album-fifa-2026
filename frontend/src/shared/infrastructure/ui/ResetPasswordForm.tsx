import { Maybe } from '@album/common';
import type { FormEvent } from 'react';
import { useId, useState } from 'react';
import { SignInBranding } from './components/SignInBranding/SignInBranding.js';
import { RESET_PASSWORD_SUBTITLE } from './authViews.js';
import { supabase } from '../supabaseClient.js';
import styles from './SignInForm.module.css';

interface ResetPasswordFormProps {
  onComplete: () => void;
}

interface ResetPasswordState {
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: Maybe<string>;
}

const initialState: ResetPasswordState = {
  password: '',
  confirmPassword: '',
  loading: false,
  error: Maybe.none(),
};

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  const [state, setState] = useState<ResetPasswordState>(initialState);
  const titleId = useId();

  const setPassword = (password: string) => {
    setState((prev) => ({ ...prev, password, error: Maybe.none() }));
  };

  const setConfirmPassword = (confirmPassword: string) => {
    setState((prev) => ({ ...prev, confirmPassword, error: Maybe.none() }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (state.password !== state.confirmPassword) {
      setState((prev) => ({
        ...prev,
        error: Maybe.some('Passwords do not match.'),
      }));
      return;
    }

    if (!supabase) {
      setState((prev) => ({
        ...prev,
        error: Maybe.some(
          'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
        ),
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: Maybe.none() }));

    const { error } = await supabase.auth.updateUser({ password: state.password });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: Maybe.some(error.message) }));
      return;
    }

    props.onComplete();
  };

  return (
    <main className={styles.container} aria-labelledby={titleId}>
      <div className={styles.card} data-testid="sign-in-card">
        <SignInBranding titleId={titleId} subtitle={RESET_PASSWORD_SUBTITLE} />

        <form
          className={styles.form}
          aria-label="Reset password"
          aria-busy={state.loading}
          onSubmit={handleSubmit}
        >
          <label className={styles.label} htmlFor="reset-password">
            New password
          </label>
          <input
            id="reset-password"
            className={styles.input}
            type="password"
            autoComplete="new-password"
            required
            value={state.password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <label className={styles.label} htmlFor="reset-password-confirm">
            Confirm password
          </label>
          <input
            id="reset-password-confirm"
            className={styles.input}
            type="password"
            autoComplete="new-password"
            required
            value={state.confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          {state.error.isSome() && (
            <p className={styles.error} role="alert">
              {state.error.getOrThrow()}
            </p>
          )}

          {state.loading && (
            <p className={styles.loadingStatus} role="status" aria-live="polite">
              Updating password, please wait.
            </p>
          )}

          <button className={styles.submitButton} type="submit" disabled={state.loading}>
            {state.loading ? 'Please wait…' : 'Save new password'}
          </button>
        </form>
      </div>
    </main>
  );
}
