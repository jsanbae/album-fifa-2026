## ADDED Requirements

### Requirement: Auth screen views

The unauthenticated auth screen SHALL support navigable views: sign-in (password and magic link), sign-up, forgot password, and reset password (when triggered by recovery redirect).

#### Scenario: Switch to sign up

- **WHEN** an unauthenticated user activates **Create account** (or equivalent) from the sign-in view
- **THEN** the sign-up form is displayed with email and password fields

#### Scenario: Switch to forgot password

- **WHEN** an unauthenticated user activates **Forgot password** from the password sign-in view
- **THEN** the forgot-password form is displayed with an email field

#### Scenario: Return to sign in

- **WHEN** a user activates **Back to sign in** from sign-up or forgot-password
- **THEN** the sign-in view is restored

#### Scenario: Sign-in modes preserved

- **WHEN** the sign-in view is displayed
- **THEN** the user can still choose email/password or magic link as today

### Requirement: Contextual auth branding subtitle

The sign-in branding region SHALL display a subtitle appropriate to the current auth view.

#### Scenario: Sign-in subtitle

- **WHEN** the sign-in view is displayed
- **THEN** the subtitle is `Sign in to track your sticker collection`

#### Scenario: Sign-up subtitle

- **WHEN** the sign-up view is displayed
- **THEN** the subtitle indicates account creation (e.g. `Create an account to save your collection`)

#### Scenario: Forgot-password subtitle

- **WHEN** the forgot-password view is displayed
- **THEN** the subtitle indicates a reset link will be emailed

### Requirement: Account settings access

The authenticated app shell SHALL provide access to account settings from the account toolbar.

#### Scenario: Open account settings

- **WHEN** an authenticated user activates **Account** (or equivalent) in the toolbar
- **THEN** an account settings dialog opens with the user's email visible

#### Scenario: Account settings hidden in dev mode

- **WHEN** Supabase is not configured (dev mode)
- **THEN** the account toolbar and settings are not shown (unchanged from current dev behavior)

#### Scenario: Sign out from settings

- **WHEN** a user activates sign out from account settings or the toolbar
- **THEN** the Supabase session ends and the auth screen is shown

### Requirement: Account settings change password section

Account settings SHALL include a change-password section for users authenticated with email and password.

#### Scenario: Change password form visible

- **WHEN** account settings is opened for a password-authenticated user
- **THEN** fields to enter and confirm a new password are shown

#### Scenario: Change password hidden for magic-link-only users

- **WHEN** account settings is opened for a user without a password identity
- **THEN** the change-password section is omitted or disabled with explanatory text

## MODIFIED Requirements

### Requirement: Sign-in branding hierarchy

The sign-in screen SHALL display a branded header region above the auth controls with a defined visual hierarchy: FIFA World Cup 2026 emblem, app title, contextual subtitle, and Panini publisher mark.

#### Scenario: Tournament emblem is the primary visual

- **WHEN** an unauthenticated user views any auth screen (sign-in, sign-up, forgot password, reset password)
- **THEN** the FIFA World Cup 2026 emblem is displayed above the app title and is visually larger than the title text

#### Scenario: App title and subtitle visible

- **WHEN** the sign-in branding region is rendered
- **THEN** the title `Album FIFA 2026` and a contextual subtitle for the current auth view are displayed below the emblem in that order

#### Scenario: Panini publisher mark placement

- **WHEN** the sign-in branding region is rendered
- **THEN** the Panini logo appears below the subtitle as a publisher mark, not above the app title

#### Scenario: Branding separated from form controls

- **WHEN** the sign-in card is rendered
- **THEN** a visual separator appears between the branding region and the auth method toggle / form

#### Scenario: Branding accessibility

- **WHEN** the sign-in branding region is rendered
- **THEN** the FIFA World Cup 2026 image has accessible name `FIFA World Cup 2026` and the Panini image has accessible name `Panini`
