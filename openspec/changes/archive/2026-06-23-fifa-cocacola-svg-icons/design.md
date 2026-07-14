## Context

The sticker list renders country flags via `CountryFlag` for team stickers (`isoCode` present). Special-section stickers (`FIFA World Cup`, `Coca-Cola`, and `00` intro) have no `countryId`; `StickerListRow` shows an empty flag placeholder and falls back to the group name as the row label.

Section headers (`StickerListSection`) and filter chips (`FilterChips`) display group names as plain text for all 14 catalog sections. The user provided reference images for the official FIFA wordmark (blue `#326295`) and Coca-Cola script logo (red `#F40009`).

## Goals / Non-Goals

**Goals:**

- Two reusable React SVG icon components: `FifaIcon` and `CocaColaIcon`
- Icons appear in sticker rows, section headers, and filter chips for their respective groups only
- Consistent dimensions with `CountryFlag` (3:2 aspect slot in list rows; proportional scaling in headers/chips)
- Accessible labels (`role="img"`, `aria-label`) matching group names
- TDD: failing component tests before implementation

**Non-Goals:**

- Icons for tournament groups (`Grupo A`–`L`) or the `00` intro sticker
- Backend or catalog data changes
- External icon libraries or raster assets (PNG/WebP)
- Animated or multi-color variants beyond brand colors

## Decisions

### 1. Inline SVG React components

Create `FifaIcon.tsx` and `CocaColaIcon.tsx` as inline `<svg>` components with hand-traced paths from the reference images.

**Rationale:** Matches the SVG approach used for country flags; no extra HTTP requests; full CSS control.

**Alternative:** Import `.svg` files via Vite — rejected; project uses React components for flags, not raw SVG imports.

### 2. Shared `GroupIcon` resolver

Add `GroupIcon.tsx` that maps group name to the correct icon component (or `null` for other groups), mirroring `CountryFlag`'s resolver pattern.

```ts
function getGroupIcon(groupName: string): ComponentType<IconProps> | null
  'FIFA World Cup' → FifaIcon
  'Coca-Cola'      → CocaColaIcon
  else             → null
```

**Rationale:** Single integration point for `StickerListRow`, `StickerListSection`, and `FilterChips`.

### 3. Row layout: group icon replaces flag placeholder

For stickers without `isoCode`, if the sticker `group` is `FIFA World Cup` or `Coca-Cola`, render `GroupIcon` in the flag slot instead of the empty placeholder.

Stickers in group `00` (intro) keep the current placeholder behavior.

### 4. Section headers and filter chips

- `StickerListSection`: prepend `GroupIcon` before the `<h2>` text when applicable
- `FilterChips`: prepend icon inside the chip button before the label for FIFA World Cup and Coca-Cola filters

Chip/header icons use a smaller `size` prop (e.g. `sm` vs `md`) via a shared `IconSize` type.

### 5. Styling

- Shared `GroupIcon.module.css` with size variants aligned to `CountryFlag.module.css` dimensions
- FIFA fill: `#326295`; Coca-Cola fill: `#F40009`
- `currentColor` not used — brand colors are fixed per logo guidelines

### 6. File location

`frontend/src/catalog/infrastructure/ui/components/icons/`

Keeps icons colocated with catalog UI; not shared across modules yet.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Trademark / brand guideline compliance | Use only in album-tracking context; simplified SVG paths; no modification of logo proportions |
| SVG path fidelity vs. file size | Trace simplified but recognizable paths; review visually against reference images |
| Layout shift in filter chips | Fixed icon width/height in CSS; test on 375px viewport |
| `00` intro stickers still show placeholder | Documented non-goal; group name fallback unchanged |

## Migration Plan

1. Add icon component tests (render, aria-label, brand color)
2. Implement SVG components and `GroupIcon` resolver
3. Wire into `StickerListRow`, `StickerListSection`, `FilterChips`
4. Update album-ui component/integration tests

No deployment or data migration required.

## Open Questions

- None
