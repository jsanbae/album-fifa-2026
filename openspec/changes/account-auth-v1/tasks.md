## 1. Auth view model and branding (TDD)

- [x] 1.1 Add failing tests: auth screen navigates between sign-in, sign-up, and forgot-password views
- [x] 1.2 Add failing test: `SignInBranding` renders contextual subtitle per auth view
- [x] 1.3 Implement auth view state in `SignInForm` (or extracted auth container) with navigation links between views
- [x] 1.4 Extend `SignInBranding` to accept optional subtitle prop; wire subtitles per view

## 2. Sign up (TDD)

- [x] 2.1 Add failing test: sign-up form calls `supabase.auth.signUp` and shows success message
- [x] 2.2 Add failing test: sign-up displays Supabase validation errors
- [x] 2.3 Implement sign-up form with email, password, confirm password, and submit handler

## 3. Forgot password and recovery (TDD)

- [x] 3.1 Add failing test: forgot-password form calls `resetPasswordForEmail` and shows success message
- [x] 3.2 Add failing test: recovery session shows reset-password form instead of dashboard
- [x] 3.3 Add failing test: reset-password form calls `updateUser({ password })` and proceeds to dashboard
- [x] 3.4 Implement forgot-password and reset-password forms; handle `PASSWORD_RECOVERY` in `App.tsx` auth init

## 4. Account settings (TDD)

- [x] 4.1 Add failing test: toolbar **Account** control opens settings dialog with user email
- [x] 4.2 Add failing test: change-password section visible for password users, hidden for magic-link-only users
- [x] 4.3 Add failing test: successful password change shows confirmation
- [x] 4.4 Implement `AccountSettingsDialog` component and wire toolbar in `App.tsx`

## 5. Dev mode and documentation

- [x] 5.1 Verify dev mode (`supabase === null`) still skips auth and account UI; extend tests if needed
- [x] 5.2 Document Supabase redirect URLs in `.env.example` comments for sign-up confirm and password recovery

## 6. Validation

- [x] 6.1 Run frontend tests, lint, and build (`npm run test`, `npm run lint`, `npm run build`)
