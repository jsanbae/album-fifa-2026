## Context

After `polish-sign-in-branding`, the sign-in screen has a clear hierarchy: FIFA emblem → title → subtitle → Panini → divider → form. Card-level 3D tilt (`useTilt3D`, 8° max) still wraps the entire glass card in `SignInForm`, including inputs and buttons. PRODUCT.md calls for restraint — decoration supports trust, not hype. Tilting credentials and submit buttons undermines the calm, premium auth experience.

The shared `useTilt3D` hook and `tilt3d.ts` utilities already live in `shared/infrastructure/ui/hooks/`. `SignInBranding` renders a plain `<img>` for the emblem. Dashboard `WorldCupLogoTilt` remains static and is out of scope.

## Goals / Non-Goals

**Goals:**

- Move pointer-driven 3D tilt from the sign-in card to the FIFA emblem only
- Preserve existing tilt parameters (8° max, CSS custom properties, smooth reset on pointer leave)
- Honor `prefers-reduced-motion: reduce` — static emblem, no pointer listeners
- Keep form controls, mode toggle, and card chrome stable during interaction
- Maintain hexagonal boundaries: no catalog imports in shared auth shell
- TDD: failing tests first for emblem tilt and static card

**Non-Goals:**

- Adding tilt to the dashboard `WorldCupLogoTilt` (separate future change if desired)
- Changing branding hierarchy, copy, Panini placement, or auth flows
- New animation libraries or angle tuning beyond existing 8° cap
- Extracting a cross-surface shared tilt component (optional follow-up)

## Decisions

### 1. Tilt target: emblem wrapper inside `SignInBranding`

Wrap the FIFA `<img>` in a perspective container within `SignInBranding`. Wire `useTilt3D` there — not in `SignInForm`.

**Rationale:** Branding owns the emblem; the form shell should not manage decorative motion. Keeps `SignInForm` focused on auth state and layout.

**Alternative:** Shared `TiltableWorldCupEmblem` component — deferred; only one consumer today.

### 2. Remove all tilt from `SignInForm`

Delete `useTilt3D`, `prefersReducedMotion` effect (if only used for card tilt), `tiltRoot` wrapper, card transform classes (`cardStatic`, `cardResetting`), and `data-testid="sign-in-card-tilt"`.

**Rationale:** Single source of motion on the emblem avoids nested transforms and clarifies product intent.

### 3. Reuse existing `useTilt3D` hook unchanged

Apply the same hook API (`ref`, `onPointerMove`, `onPointerLeave`, `style`, `isResetting`) to the emblem tilt surface.

**Rationale:** Hook is already tested in `WorldCupLogoTilt.test.tsx`. No new interaction logic.

### 4. CSS structure in `SignInBranding.module.css`

```css
.emblemTiltRoot { perspective: 600px; }
.emblemTiltSurface {
  transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}
.emblemTiltSurfaceResetting { transition-duration: 0.3s; }
.emblemTiltStatic { transform: none; }
```

Move perspective off the card; apply only around the emblem. Emblem image sizing stays as today (~8.5–9rem hero).

**Alternative:** Tilt the `<img>` directly — rejected; wrapper preserves border-radius clipping and isolates transform from layout siblings.

### 5. Reduced motion in `SignInBranding`

Mirror the `SignInForm` pattern: `matchMedia('(prefers-reduced-motion: reduce)')` with change listener. When active, skip pointer handlers and use static surface class.

Expose `data-testid="sign-in-emblem-tilt"` and `data-reduced-motion` on the tilt surface for tests.

### 6. Test migration

| Before | After |
|--------|-------|
| `SignInForm` tests card `--tilt-x/y` | `SignInBranding` tests emblem `--tilt-x/y` |
| Card `data-reduced-motion` | Emblem surface `data-reduced-motion` |
| Card tilt test id | Emblem tilt test id |

Add `SignInForm` test asserting card has no tilt custom properties after pointer move.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Emblem tilt feels gimmicky on auth | 8° cap already conservative; only emblem moves, not form |
| Small hit target on mobile | Emblem is ~9rem — large enough for touch; Pointer Events API |
| Duplicate reduced-motion logic in `SignInBranding` | Acceptable for now; extract shared hook wrapper later if a third surface needs it |
| Main spec still implies dashboard logo tilts | Delta spec scopes tilt to sign-in emblem; dashboard static behavior unchanged |

## Migration Plan

1. TDD: update/add failing tests (`SignInBranding`, `SignInForm`)
2. Implement emblem tilt in `SignInBranding`
3. Strip card tilt from `SignInForm` + CSS
4. Run frontend tests, lint, build

## Open Questions

- None
