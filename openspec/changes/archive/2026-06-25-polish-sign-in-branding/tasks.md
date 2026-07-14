## 1. Tests (TDD)

- [x] 1.1 Add failing test: sign-in branding shows FIFA emblem above the app title
- [x] 1.2 Add failing test: Panini logo appears after the subtitle in document order
- [x] 1.3 Add failing test: branding region includes a separator before sign-in controls
- [x] 1.4 Update `SignInForm` tests to assert branding via `SignInBranding` without catalog imports

## 2. SignInBranding component

- [x] 2.1 Create `SignInBranding` with emblem, title, subtitle, Panini mark, and divider
- [x] 2.2 Style hierarchy, spacing, and Panini publisher credit in `SignInBranding.module.css`

## 3. SignInForm integration

- [x] 3.1 Replace inline branding markup with `SignInBranding`; remove catalog module imports
- [x] 3.2 Remove obsolete branding styles from `SignInForm.module.css`
- [x] 3.3 Verify card tilt and auth behavior unchanged

## 4. Validation

- [x] 4.1 Run frontend unit tests (`npm run test` in `frontend`)
- [x] 4.2 Run lint and build for frontend
