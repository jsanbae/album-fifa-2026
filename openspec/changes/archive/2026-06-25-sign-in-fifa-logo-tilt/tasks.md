## 1. Tests (TDD)

- [x] 1.1 Add failing test: sign-in FIFA emblem tilts on pointer move (`SignInBranding`)
- [x] 1.2 Add failing test: emblem resets tilt on pointer leave (`SignInBranding`)
- [x] 1.3 Add failing test: reduced motion keeps emblem static (`SignInBranding`)
- [x] 1.4 Update `SignInForm` tests: card does not tilt; remove card-tilt assertions

## 2. SignInBranding emblem tilt

- [x] 2.1 Wire `useTilt3D` on emblem wrapper with perspective and transform CSS
- [x] 2.2 Add `prefers-reduced-motion` handling and test ids on emblem tilt surface

## 3. SignInForm cleanup

- [x] 3.1 Remove card-level tilt (`useTilt3D`, perspective wrapper, tilt classes) from `SignInForm`
- [x] 3.2 Remove obsolete card tilt styles from `SignInForm.module.css`

## 4. Validation

- [x] 4.1 Run frontend unit tests (`npm run test` in `frontend`)
- [x] 4.2 Run lint and build for frontend
