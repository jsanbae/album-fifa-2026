## Why

The sign-in card now shows the FIFA World Cup 2026 emblem, the Panini mark, and the app title, but they were added incrementally without a unified hierarchy. The title, tournament logo, and publisher mark compete for attention, spacing is uneven, and branding logic lives inline in `SignInForm` with a cross-module dependency on the catalog module. A focused polish pass will make the first screen feel intentional, calm, and premium — aligned with PRODUCT.md restraint.

## What Changes

- Introduce a dedicated `SignInBranding` block with a clear visual order: tournament emblem → app title → subtitle → Panini publisher mark
- Demote the text title below the emblem (smaller type) so the FIFA WC 2026 logo is the primary visual anchor
- Reposition Panini as a subtle publisher credit (smaller, secondary color) below the subtitle, separated from the form by spacing
- Tighten vertical rhythm and add a soft divider between the brand header and the sign-in controls
- Extract branding markup and styles from `SignInForm` into a shared UI component (remove catalog import from auth shell)
- Keep the existing card-level 3D tilt (8°) and `prefers-reduced-motion` behavior unchanged
- Add frontend tests for branding hierarchy, logo presence, and Panini placement

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `album-ui`: Sign-in screen SHALL present a polished branded header with FIFA WC 2026 emblem, app title, subtitle, and Panini publisher mark in a defined hierarchy

## Impact

- **Frontend**: New `SignInBranding` component + CSS Module in `shared/`; refactor `SignInForm.tsx` / `SignInForm.module.css`; update `SignInForm.test.tsx`
- **Backend**: No changes
- **API**: No changes
