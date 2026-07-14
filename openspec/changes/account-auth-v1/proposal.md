## Why

The app already gates collection editing behind Supabase Auth, but users cannot self-register, recover a forgotten password, or manage their account from the UI. Sign-in exists; a complete account flow does not. This change closes that gap so collectors can create accounts and manage credentials without manual Supabase admin steps.

## What Changes

- Add **sign up** (email + password) on the auth screen, alongside existing sign-in modes
- Add **forgot password** flow: request reset email, then set a new password via Supabase recovery redirect
- Extend the authenticated **account toolbar** with an account menu linking to **account settings**
- Add **account settings** page/modal: view email, change password (when signed in with password auth), sign out (existing), and request account deletion guidance if Supabase self-service delete is not enabled
- Keep Supabase as the identity provider; no new backend auth endpoints or profile table in v1
- Preserve **dev mode** (`DEV_USER_ID` / missing Supabase config) unchanged

## Capabilities

### New Capabilities

- `account-auth`: Sign-up, password recovery, and account settings requirements for Supabase-backed identity

### Modified Capabilities

- `album-ui`: Auth screen modes (sign-up, forgot-password), account toolbar → settings entry, account settings UI

## Impact

- **Frontend**: `SignInForm` (or split auth components), new account settings UI, `App.tsx` toolbar
- **Backend**: No new routes; existing `authMiddleware` unchanged
- **Supabase**: Email templates and redirect URLs for sign-up confirmation and password recovery (project config, not app code)
- **Tests**: Component tests for auth modes and account settings; existing authenticated shell tests extended
