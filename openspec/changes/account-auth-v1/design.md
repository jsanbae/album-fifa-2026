## Context

Authentication is already integrated: Supabase session on the frontend, JWT verification in `authMiddleware`, collection data scoped by `UserId`. The sign-in screen supports password and magic-link modes via `SignInForm`. There is no sign-up UI, no password recovery, and the authenticated shell only shows email + sign out in a toolbar.

This change is frontend-heavy and uses Supabase Auth client APIs directly — no new backend module or routes. It aligns with the explore-session decision to complete auth UX (Option A) before introducing profiles or social features.

## Goals / Non-Goals

**Goals:**

- Let users self-register with email + password
- Let users recover access via email reset link
- Provide account settings for email display, password change, and sign out
- Reuse existing sign-in branding and dark album UI patterns
- Cover flows with component tests; preserve dev mode (`supabase === null`)

**Non-Goals:**

- OAuth providers (Google, GitHub)
- User profiles table, display names, or avatars
- Backend account endpoints or new hexagonal `account` module
- Row Level Security migration
- Account deletion automation (v1 shows guidance only if Supabase self-delete is unavailable)
- Magic-link sign-up (password sign-up only in v1; magic link remains sign-in)

## Decisions

### 1. Extend auth UI with a mode state machine in shared infrastructure

Replace the binary `password | magic-link` toggle with an auth **view** enum:

```
sign-in-password | sign-in-magic-link | sign-up | forgot-password | reset-password
```

`SignInForm` becomes the container; extract sub-forms (`SignInPasswordForm`, `SignUpForm`, `ForgotPasswordForm`, `ResetPasswordForm`) as needed for clarity and testability.

**Rationale:** Each view has different fields and Supabase calls. A single form with conditional fields becomes hard to test and accessibly label.

**Alternative:** Separate routes/pages — rejected; the app is a SPA with no router today, and auth is a gate before the dashboard.

### 2. Supabase client calls stay in infrastructure UI layer

All auth operations use `@supabase/supabase-js` from `supabaseClient.ts`:

| Action | Supabase API |
|--------|----------------|
| Sign up | `auth.signUp({ email, password, options: { emailRedirectTo } })` |
| Sign in (existing) | `signInWithPassword`, `signInWithOtp` |
| Forgot password | `auth.resetPasswordForEmail(email, { redirectTo })` |
| Set new password | `auth.updateUser({ password })` after recovery session |
| Change password | `auth.updateUser({ password })` when session exists |

**Rationale:** Identity is delegated to Supabase; no domain logic to extract in v1. Matches current `SignInForm` pattern.

### 3. Detect password recovery from URL hash on load

Supabase recovery links redirect with `#access_token=...&type=recovery`. On app init (when Supabase is configured), check for recovery type via `supabase.auth.getSession()` after `onAuthStateChange` fires with `PASSWORD_RECOVERY` event, then show `reset-password` view instead of the dashboard.

**Rationale:** Standard Supabase SPA pattern; no backend callback route needed.

### 4. Account settings as a modal from the toolbar

Add an **Account** button (or menu) in the existing toolbar landmark (`aria-label="Account"`). Settings open in a modal/dialog: email (read-only), change password form, sign out, delete-account note.

**Rationale:** App has no router; modal matches with context.

**Alternative:** Full-page settings — rejected for v1 scope.

### 5. Contextual subtitle on auth branding

Update `SignInBranding` to accept an optional subtitle prop. Defaults per view:

| View | Subtitle |
|------|----------|
| Sign in | `Sign in to track your sticker collection` (existing) |
| Sign up | `Create an account to save your collection` |
| Forgot password | `We'll email you a reset link` |
| Reset password | `Choose a new password` |

**Rationale:** Keeps one branding component; satisfies hierarchy requirement with minimal change.

### 6. Dev mode unchanged

When `supabase === null`, skip all auth screens and behave as today (auto-authenticated via backend `DEV_USER_ID`). No account settings toolbar in dev mode (existing behavior).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Supabase email confirmation blocks sign-in until verified | Show clear post-sign-up message; document Supabase "Confirm email" setting for dev |
| Recovery redirect URL misconfigured in Supabase dashboard | Document required redirect URLs in `.env.example` comment |
| `updateUser` for change-password requires recent login on some Supabase configs | Surface Supabase error message; optional re-auth is out of scope for v1 |
| Auth UI complexity grows in one component tree | Extract sub-forms; cap v1 to four views |
| Magic-link users cannot change password meaningfully | Hide change-password section when user has no password identity (email-only) — detect via `user.app_metadata.provider` or show only when password sign-in was used |

## Migration Plan

1. Configure Supabase Auth redirect URLs: `{origin}`, `{origin}/` for sign-up confirm and password recovery
2. Ship frontend changes; no DB migration
3. Rollback: revert frontend; existing users unaffected

## Open Questions

- Should sign-up require email confirmation before first sign-in, or allow immediate access? (Default: follow Supabase project setting; UI handles both with messaging.)
- Enable self-service account deletion in Supabase later, or keep guidance-only in v1?
