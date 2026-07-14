import { Maybe } from '@album/common';
import type { Session } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';
import { CatalogApiAdapter } from '../../catalog/infrastructure/adapters/CatalogApiAdapter.js';
import { StickerListPage } from '../../catalog/infrastructure/ui/pages/StickerListPage.js';
import { useCatalog } from '../../catalog/infrastructure/ui/store/useCatalog.hook.js';
import { CollectionApiAdapter } from '../../collection/infrastructure/adapters/CollectionApiAdapter.js';
import { useCollection } from '../../collection/infrastructure/ui/store/useCollection.hook.js';
import { createHttpClient } from './HttpClient.js';
import { getAccessToken, supabase } from './supabaseClient.js';
import { AccountSettingsDialog } from './ui/AccountSettingsDialog.js';
import { ResetPasswordForm } from './ui/ResetPasswordForm.js';
import { SignInForm } from './ui/SignInForm.js';
import styles from './App.module.css';

interface AuthState {
  session: Maybe<Session>;
  loading: boolean;
  pendingPasswordRecovery: boolean;
}

export function App() {
  const [authState, setAuthState] = useState<AuthState>({
    session: Maybe.none(),
    loading: true,
    pendingPasswordRecovery: false,
  });
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);

  const httpClient = useMemo(() => createHttpClient(getAccessToken), []);
  const catalogAdapter = useMemo(() => new CatalogApiAdapter(httpClient), [httpClient]);
  const collectionAdapter = useMemo(
    () => new CollectionApiAdapter(httpClient),
    [httpClient],
  );
  const catalogHook = useCatalog(catalogAdapter);
  const collectionHook = useCollection(collectionAdapter);

  const refreshSession = async () => {
    if (!supabase) {
      setAuthState({ session: Maybe.none(), loading: false, pendingPasswordRecovery: false });
      return;
    }
    const { data } = await supabase.auth.getSession();
    setAuthState((prev) => ({
      session: data.session ? Maybe.some(data.session) : Maybe.none(),
      loading: false,
      pendingPasswordRecovery: prev.pendingPasswordRecovery,
    }));
  };

  const isDevMode = supabase === null;

  useEffect(() => {
    refreshSession();

    if (!supabase) {
      return;
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthState({
        session: session ? Maybe.some(session) : Maybe.none(),
        loading: false,
        pendingPasswordRecovery: event === 'PASSWORD_RECOVERY',
      });
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    collectionHook.reset();
    setAccountSettingsOpen(false);
    await refreshSession();
  };

  const handlePasswordRecoveryComplete = () => {
    setAuthState((prev) => ({ ...prev, pendingPasswordRecovery: false }));
    refreshSession();
  };

  if (authState.loading) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        Loading session…
      </div>
    );
  }

  if (authState.pendingPasswordRecovery) {
    return <ResetPasswordForm onComplete={handlePasswordRecoveryComplete} />;
  }

  const isAuthenticated = isDevMode || authState.session.isSome();

  if (!isAuthenticated) {
    return <SignInForm onSignedIn={refreshSession} />;
  }

  const sessionUser = authState.session.fold(
    () => null,
    (session) => session.user,
  );

  return (
    <div className={styles.app}>
      {!isDevMode && sessionUser && (
        <header className={styles.toolbar} aria-label="Account">
          <span className={styles.userEmail}>{sessionUser.email ?? 'Signed in'}</span>
          <div className={styles.toolbarActions}>
            <button
              type="button"
              className={styles.accountButton}
              onClick={() => setAccountSettingsOpen(true)}
            >
              Account
            </button>
            <button type="button" className={styles.signOutButton} onClick={handleSignOut}>
              Sign out
            </button>
          </div>
          <AccountSettingsDialog
            open={accountSettingsOpen}
            user={sessionUser}
            onClose={() => setAccountSettingsOpen(false)}
            onSignOut={handleSignOut}
          />
        </header>
      )}
      <StickerListPage
        catalogHook={catalogHook}
        collectionHook={collectionHook}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
