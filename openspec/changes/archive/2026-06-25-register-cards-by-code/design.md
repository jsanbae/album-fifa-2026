## Context

Collection tracking already supports per-sticker increment via `IncrementStickerCountUseCase` and `POST /api/collection/stickers/:id/increment`. New entries start at count `1`; existing entries increment by `1`. The catalog is a static JSON-backed list (~990 stickers) keyed by sticker id (e.g. `MEX1`, `FWC1`).

Users want to register multiple stickers at once by typing or pasting codes separated by commas — a common workflow when opening a pack.

## Goals / Non-Goals

**Goals:**

- Accept comma-separated sticker codes in a single UI submission
- For each valid code, increment that sticker's count by 1 (same semantics as existing increment)
- Preserve duplicate codes in input (e.g. `MEX1, MEX1` increments `MEX1` twice)
- Normalize codes: trim whitespace, ignore empty segments, match catalog ids case-insensitively
- Return which codes were applied and which were unrecognized
- Update UI counts and progress after registration
- TDD: failing tests first per project workflow

**Non-Goals:**

- Barcode/QR scanning
- Registering by player name (search already covers discovery; registration is by code only)
- Decrement or set-count via bulk form
- Transactional all-or-nothing failure when one code is invalid (partial success is preferred)

## Decisions

### 1. New use case: `RegisterStickersByCodeUseCase`

Application-layer use case in the `collection` module accepting `userId` and a raw comma-separated `codes` string.

**Processing:**

1. Split on `,`, trim each segment, drop empty segments
2. Build a case-insensitive lookup map from `CatalogRepository.findAllStickers()` (id lowercased → canonical id)
3. For each parsed segment in order:
   - If not in catalog → append to `unknownCodes`
   - Else → run increment logic (same as `IncrementStickerCountUseCase`: create at `1` or `increment()`)
4. Return DTO: `{ updated: CollectionEntryDTO[], unknownCodes: string[] }`

**Rationale:** Reuses existing domain increment semantics without a new entity operation. Catalog lookup validates codes against the album.

**Alternative:** Loop calling `IncrementStickerCountUseCase` from controller — rejected; parsing, validation, and batch response belong in one use case.

### 2. Catalog validation via lookup map

Load stickers once per request and resolve codes case-insensitively (`mex1` → `MEX1`).

**Alternative:** Add `findStickerById` to `CatalogRepository` — acceptable follow-up; map from `findAllStickers()` is sufficient for static catalog size.

### 3. HTTP API

`POST /api/collection/register` (authenticated)

Request body:

```json
{ "codes": "MEX1, MEX2, mex1" }
```

Response `200`:

```json
{
  "updated": [
    { "stickerId": "MEX1", "count": 2 },
    { "stickerId": "MEX2", "count": 1 }
  ],
  "unknownCodes": []
}
```

- Empty or whitespace-only `codes` → `422` validation error
- Unknown codes do not block valid codes; they appear in `unknownCodes`
- Unauthenticated → `401`

Add route to `common/src/infrastructure/api-routes.ts`.

### 4. Frontend UI placement

Add a `RegisterByCodeForm` component on `StickerListPage`, placed below the progress bar and above search/filters. Visible only when authenticated.

- Single-line or multi-line text input with label e.g. "Register by code"
- Placeholder: `e.g. MEX1, FWC3, CC1`
- Submit button; disabled while loading or when input is empty
- On success: show summary (e.g. "Registered 3 stickers" or list unknown codes if any)
- Clear input after successful submit
- Call new adapter method; merge returned counts into `useCollection` and `useCatalog` state (same pattern as row increment)

### 5. Hook extension

Add `registerByCode(codes: string)` to `useCollection` hook:

- Optimistically apply count updates from response
- On error, surface message via existing error state

No new global store; extend existing collection hook.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Large paste (hundreds of codes) causes many DB writes | Acceptable for MVP; catalog users unlikely to paste >50 at once; document limit if needed later |
| Case mismatch (`mex1` vs `MEX1`) | Case-insensitive resolution to canonical id |
| User expects name-based registration | UI label and placeholder clarify codes only |
| Partial unknown codes confuse user | Show `unknownCodes` in inline feedback after submit |

## Migration Plan

1. Backend use case + route (TDD)
2. Frontend adapter, hook, component (TDD)
3. Wire into `StickerListPage`
4. E2e test for register endpoint

No database migration — uses existing `collection_entries` table.

## Open Questions

- None
