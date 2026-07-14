import { Maybe } from '@album/common';
import type { User } from '@supabase/supabase-js';
import type { FormEvent } from 'react';
import { useId, useState } from 'react';
import { canUserChangePassword } from './authViews.js';
import { Modal } from './components/Modal/Modal.js';
import { supabase } from '../supabaseClient.js';
import styles from './AccountSettingsDialog.module.css';

interface AccountSettingsDialogProps {
  open: boolean;
  user: User;
  onClose: () => void;
  onSignOut: () => void;
}

interface ChangePasswordState {
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: Maybe<string>;
  message: Maybe<string>;
}

const initialChangePasswordState: ChangePasswordState = {
  password: '',
  confirmPassword: '',
  loading: false,
  error: Maybe.none(),
  message: Maybe.none(),
};

export function AccountSettingsDialog(props: AccountSettingsDialogProps) {
  const titleId = useId();
  const [changePasswordState, setChangePasswordState] = useState<ChangePasswordState>(
    initialChangePasswordState,
  );
  const showChangePassword = canUserChangePassword(props.user);

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();

    if (changePasswordState.password !== changePasswordState.confirmPassword) {
      setChangePasswordState((prev) => ({
        ...prev,
        error: Maybe.some('Passwords do not match.'),
        message: Maybe.none(),
      }));
      return;
    }

    if (!supabase) {
      return;
    }

    setChangePasswordState((prev) => ({
      ...prev,
      loading: true,
      error: Maybe.none(),
      message: Maybe.none(),
    }));

    const { error } = await supabase.auth.updateUser({ password: changePasswordState.password });

    if (error) {
      setChangePasswordState((prev) => ({
        ...prev,
        loading: false,
        error: Maybe.some(error.message),
      }));
      return;
    }

    setChangePasswordState({
      password: '',
      confirmPassword: '',
      loading: false,
      error: Maybe.none(),
      message: Maybe.some('Password updated successfully.'),
    });
  };

  return (
    <Modal open={props.open} title="Account settings" titleId={titleId} onClose={props.onClose}>
      <div className={styles.section}>
        <p className={styles.emailLabel}>Email</p>
        <p className={styles.emailValue}>{props.user.email ?? 'Signed in'}</p>

        {showChangePassword ? (
          <>
            <hr className={styles.divider} />
            <form aria-label="Change password" onSubmit={handleChangePassword}>
              <div className={styles.section}>
                <label className={styles.label} htmlFor="account-new-password">
                  New password
                </label>
                <input
                  id="account-new-password"
                  className={styles.input}
                  type="password"
                  autoComplete="new-password"
                  required
                  value={changePasswordState.password}
                  onChange={(event) =>
                    setChangePasswordState((prev) => ({
                      ...prev,
                      password: event.target.value,
                      error: Maybe.none(),
                      message: Maybe.none(),
                    }))
                  }
                />

                <label className={styles.label} htmlFor="account-confirm-password">
                  Confirm password
                </label>
                <input
                  id="account-confirm-password"
                  className={styles.input}
                  type="password"
                  autoComplete="new-password"
                  required
                  value={changePasswordState.confirmPassword}
                  onChange={(event) =>
                    setChangePasswordState((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                      error: Maybe.none(),
                      message: Maybe.none(),
                    }))
                  }
                />

                {changePasswordState.error.isSome() && (
                  <p className={styles.error} role="alert">
                    {changePasswordState.error.getOrThrow()}
                  </p>
                )}

                {changePasswordState.message.isSome() && (
                  <p className={styles.message} role="status">
                    {changePasswordState.message.getOrThrow()}
                  </p>
                )}

                <button
                  className={styles.submitButton}
                  type="submit"
                  disabled={changePasswordState.loading}
                >
                  {changePasswordState.loading ? 'Please wait…' : 'Update password'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className={styles.note}>
            Password changes are not available for magic-link-only accounts.
          </p>
        )}

        <hr className={styles.divider} />

        <button type="button" className={styles.signOutButton} onClick={props.onSignOut}>
          Sign out
        </button>

        <p className={styles.note}>
          To delete your account, contact support or use the Supabase dashboard if self-service
          deletion is enabled for this project.
        </p>
      </div>
    </Modal>
  );
}
