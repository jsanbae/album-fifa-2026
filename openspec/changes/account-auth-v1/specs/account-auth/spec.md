## ADDED Requirements

### Requirement: Email and password sign up

The system SHALL allow unauthenticated users to create an account with email and password via Supabase Auth.

#### Scenario: Successful sign up

- **WHEN** a user submits a valid email and password on the sign-up form
- **THEN** Supabase `signUp` is called and the user sees a confirmation message (check email or signed in, per Supabase project settings)

#### Scenario: Sign up validation error

- **WHEN** a user submits sign-up with an invalid email or weak password rejected by Supabase
- **THEN** the error message from Supabase is displayed and the user remains on the sign-up form

#### Scenario: Sign up unavailable without Supabase

- **WHEN** Supabase is not configured and a user attempts sign up
- **THEN** an error explains that Supabase environment variables are required

### Requirement: Password reset request

The system SHALL allow users to request a password reset email for a registered address.

#### Scenario: Reset email sent

- **WHEN** a user submits their email on the forgot-password form
- **THEN** Supabase `resetPasswordForEmail` is called with redirect to the app origin and a success message is shown

#### Scenario: Reset request error

- **WHEN** Supabase rejects the reset request
- **THEN** the error message is displayed on the forgot-password form

### Requirement: Password recovery completion

The system SHALL allow users arriving from a Supabase recovery link to set a new password.

#### Scenario: Recovery session detected

- **WHEN** the app loads with a Supabase recovery session (`PASSWORD_RECOVERY` auth event or equivalent)
- **THEN** the reset-password form is shown instead of the sign-in screen or dashboard

#### Scenario: New password saved

- **WHEN** a user submits a valid new password on the reset-password form
- **THEN** Supabase `updateUser({ password })` is called and the user proceeds to the authenticated dashboard

### Requirement: Change password when authenticated

The system SHALL allow authenticated password users to change their password from account settings.

#### Scenario: Password updated

- **WHEN** an authenticated user submits a valid new password in account settings
- **THEN** Supabase `updateUser({ password })` is called and a success confirmation is shown

#### Scenario: Change password error

- **WHEN** Supabase rejects the password update
- **THEN** the error message is displayed in account settings without signing the user out

### Requirement: Dev mode auth bypass preserved

Local development without Supabase configuration SHALL continue to skip auth flows.

#### Scenario: Dev mode skips auth screens

- **WHEN** Supabase client is not configured (`supabase === null`)
- **THEN** the app does not show sign-in, sign-up, or account settings and collection editing works via `DEV_USER_ID` as today
