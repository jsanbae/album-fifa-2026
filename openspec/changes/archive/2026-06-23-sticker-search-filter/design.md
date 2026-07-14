## Context

Sticker list search currently filters by `idPrefix` using a case-sensitive `String.startsWith` on sticker id only (`ListStickersUseCase`). The frontend passes the search box value as `idPrefix` and labels the input "Search by sticker number".

Users need to find stickers by player name (Spanish names in `data/stickers.json`) and type queries without worrying about case.

## Goals / Non-Goals

**Goals:**

- Single `search` query parameter matching sticker id (prefix) or name (substring)
- Case-insensitive comparison for both id and name
- Consistent behavior in backend use case and frontend search UI
- TDD: update failing tests first, then implementation

**Non-Goals:**

- Full-text fuzzy search or diacritic-insensitive matching (e.g. `Jose` vs `José`) — defer
- Search by country name — defer
- Changing group or missing filter semantics

## Decisions

### 1. Unified `search` parameter

Replace `ListStickersInput.idPrefix` with `search?: string`.

**Match rule** (when `search` is non-empty after trim):

```
normalized = search.trim().toLowerCase()
match if:
  sticker.id.toLowerCase().startsWith(normalized)
  OR sticker.name.toLowerCase().includes(normalized)
```

**Rationale:** One input field in the UI; id prefix and name lookup share the same box.

**Alternative:** Keep `idPrefix` + add `name` — rejected; duplicates UX.

### 2. HTTP API query param

`GET /api/catalog/stickers?search=yamal`

Remove `idPrefix` support (**breaking**). No clients in production yet; acceptable.

### 3. Domain-level filter function

Extract `matchesStickerSearch(sticker, search: string): boolean` in catalog application layer (or small domain helper) for testability.

### 4. Frontend search input

- Label: "Search by number or name"
- Remove `inputMode="numeric"` — names are valid input
- Placeholder: `e.g. MEX3, Yamal`
- Pass value as `search` to API unchanged (backend normalizes case)

### 5. Empty search

Whitespace-only search treated as no filter (same as omitting `search`).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Short queries return many name matches (e.g. "an") | Acceptable for MVP; users refine query |
| Breaking `idPrefix` API param | Document in proposal; update e2e tests |
| Accented characters | Case-insensitive only; document non-goal |

## Migration Plan

1. Add tests for case-insensitive id and name search
2. Implement `search` in use case and controller
3. Update frontend adapter and hook
4. Remove `idPrefix` references

No data migration required.

## Open Questions

- None
