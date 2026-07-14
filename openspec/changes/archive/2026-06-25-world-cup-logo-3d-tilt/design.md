## Context

`StickerListPage` renders a text-only header (`Album FIFA 2026`) above the progress bar. The user provided the official FIFA World Cup 2026 logo (trophy over "26" on black). The design system rates motion at 5/10 (fluid CSS micro-interactions) and requires honoring `prefers-reduced-motion` globally (`globals.css` already disables transforms on reduced motion).

The existing `FifaIcon` SVG is a small wordmark for list rows and filter chips — it is not the tournament emblem and must remain separate from this hero logo.

## Goals / Non-Goals

**Goals:**

- Display the tournament logo prominently in the dashboard header
- Tilt the logo in 3D following pointer position within the logo bounds (desktop and touch)
- Smooth return to neutral pose on pointer leave
- Disable tilt entirely when `prefers-reduced-motion: reduce` is active
- Keep implementation dependency-free (no GSAP, no tilt.js library)

**Non-Goals:**

- Replacing `FifaIcon` in sticker rows, section headers, or filter chips
- Page-level parallax, scroll-driven animation, or WebGL
- Persisting tilt state or gamification tied to the logo
- Animating on every page (logo appears on collection dashboard only for now)

## Decisions

### 1. Static PNG asset in `frontend/public/`

Store the user-provided logo at `frontend/public/world-cup-2026-logo.png` and reference it via `/world-cup-2026-logo.png`.

**Rationale:** Official artwork is raster with complex shading; a PNG preserves fidelity. Public assets are simple to serve via Vite without bundler import config.

**Alternative:** Inline SVG — rejected; reproducing the 3D trophy artwork as vector is out of scope.

### 2. `WorldCupLogoTilt` component + `useTilt3D` hook

- **Hook** (`useTilt3D.hook.ts`): listens to `pointermove` / `pointerleave` on a ref'd element; maps cursor offset from center to `rotateX` / `rotateY` (clamped, e.g. ±12°); exposes `{ ref, style, isReducedMotion }`.
- **Component** (`WorldCupLogoTilt.tsx`): wraps an `<img>` in a perspective container; applies transform via inline style or CSS variables.

**Rationale:** Separates interaction logic (testable hook) from presentation (component + CSS Module). Matches frontend-patterns hook convention (`*.hook.ts`).

**Alternative:** CSS-only `:hover` tilt — rejected; does not track pointer position for true 3D follow effect.

### 3. Transform technique

```css
.tiltRoot { perspective: 800px; }
.tiltCard { transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y)); transition: transform 0.1s ease-out; }
```

Hook sets `--tilt-x` and `--tilt-y` as CSS custom properties. On pointer leave, reset to `0deg` with a slightly longer transition (~300ms).

**Rationale:** GPU-accelerated, no layout thrashing; works with existing motion tokens.

### 4. Reduced motion

Use `window.matchMedia('(prefers-reduced-motion: reduce)')` in the hook (with listener for changes). When active: skip pointer listeners, force `transform: none`, keep static logo visible.

**Rationale:** Matches `PRODUCT.md` accessibility baseline and existing `globals.motion.test.ts` policy.

### 5. Header layout

Place logo left of (or above on very narrow widths) the `h1` title in `StickerListPage` header — flex row, vertically centered, logo ~56–72px height on mobile.

**Rationale:** Branded anchor without displacing progress bar as the functional hero. Title remains the page landmark (`aria-labelledby`).

### 6. Accessibility

- `<img alt="FIFA World Cup 2026">` — meaningful label for the tournament emblem
- Tilt container is decorative interaction; no extra button role (logo is not a navigation control)
- Pointer events only on the logo card; keyboard users see static logo (acceptable for decorative tilt)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Motion feels gimmicky vs product restraint | Cap tilt angles (~12°), short transition, only on logo hover area |
| `prefers-reduced-motion` global rule zeros transforms | Scope tilt styles; hook bypasses listeners when reduced motion is on |
| Large PNG hurts LCP | Optimize/compress asset; fixed display dimensions; `width`/`height` attributes to prevent CLS |
| Touch jank on mobile | Use Pointer Events API (unified mouse/touch); `touch-action: none` on tilt surface |
| Trademark / asset licensing | User-provided official artwork for personal album companion app |

## Migration Plan

1. Copy logo PNG to `frontend/public/`
2. TDD: failing tests for logo presence and reduced-motion static behavior
3. Implement hook + component
4. Integrate into `StickerListPage` header
5. Run frontend tests, lint, build

## Open Questions

- None
