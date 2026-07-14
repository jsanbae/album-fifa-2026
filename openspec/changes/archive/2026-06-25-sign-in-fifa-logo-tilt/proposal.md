## Why

The sign-in screen currently tilts the entire glass auth card on pointer movement. That motion competes with form inputs and mode toggles — functional controls should feel stable and trustworthy per PRODUCT.md restraint. Delight belongs on the FIFA emblem (the brand hero), not on the credential surface. Moving tilt from card to emblem aligns motion with the branding hierarchy established in `polish-sign-in-branding` and corrects the drift between spec and implementation.

## What Changes

- Remove 3D tilt from the sign-in card container (`SignInForm`)
- Apply the existing `useTilt3D` interaction (8° max, reduced-motion fallback) to the FIFA World Cup 2026 emblem inside `SignInBranding`
- Keep the sign-in card, form fields, and mode toggle visually static during pointer movement
- Update tests: card no longer tilts; emblem tilts on pointer move and resets on leave
- Align `album-ui` spec so tilt is scoped to the sign-in emblem, not an ambiguous "tournament logo" or whole-card transform

## Capabilities

### New Capabilities

_None — behavior fits within existing `album-ui`._

### Modified Capabilities

- `album-ui`: Scope interactive 3D tilt to the sign-in FIFA emblem; require the sign-in card and form controls to remain static

## Impact

- `frontend/src/shared/infrastructure/ui/SignInForm.tsx` — remove card tilt wiring (`useTilt3D`, perspective wrapper, tilt CSS classes)
- `frontend/src/shared/infrastructure/ui/SignInForm.module.css` — remove card transform / perspective styles
- `frontend/src/shared/infrastructure/ui/components/SignInBranding/` — add tilt surface around emblem; reduced-motion handling
- `frontend/tests/SignInForm.test.tsx` — replace card-tilt assertions with static-card assertions
- `frontend/tests/SignInBranding.test.tsx` — add emblem tilt and reduced-motion tests
- `frontend/src/shared/infrastructure/ui/hooks/useTilt3D.hook.ts` — reused unchanged (already in shared)
- Dashboard `WorldCupLogoTilt` — unchanged (remains static); out of scope for this change
