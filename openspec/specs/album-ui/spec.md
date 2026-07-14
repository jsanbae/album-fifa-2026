## Purpose

Mobile-first React UI for browsing the FIFA 2026 sticker album, tracking per-sticker counts, and filtering by section or search.
## Requirements
### Requirement: Mobile-first layout

The sticker list UI SHALL be optimized for mobile viewports with a single-column list layout.

#### Scenario: Mobile viewport

- **WHEN** the app is viewed on a viewport width of 375px
- **THEN** the sticker list renders as a full-width scrollable list without horizontal overflow

### Requirement: Progress display

The UI SHALL display album progress as `owned / total (percentage%)` with a visual progress indicator at the top of the list.

#### Scenario: Progress updates on count change

- **WHEN** a user increments a sticker from 0 to 1
- **THEN** the progress owned count and displayed percentage increase accordingly

#### Scenario: Overall progress shows percentage

- **WHEN** collection progress is loaded (e.g. owned `142`, total `990`, percentage `14`)
- **THEN** the progress stats line displays `142 / 990 (14%)`

#### Scenario: Overall progress unavailable

- **WHEN** collection progress is not yet loaded or unavailable
- **THEN** the progress stats line displays `— / 990 (—%)` and the progress bar shows zero fill

### Requirement: Sticker list rows

Each sticker row SHALL display the sticker id, sticker name, count controls, and country information when applicable.

#### Scenario: Team sticker row

- **WHEN** a sticker has `countryId` `MEX`
- **THEN** the row displays the country flag (SVG), Spanish country name, sticker id, sticker name, and count controls

#### Scenario: FIFA World Cup sticker row

- **WHEN** a sticker belongs to group `FIFA World Cup` and has no `countryId`
- **THEN** the row displays the FIFA SVG icon, group name, sticker id, sticker name, and count controls

#### Scenario: Coca-Cola sticker row

- **WHEN** a sticker belongs to group `Coca-Cola` and has no `countryId`
- **THEN** the row displays the Coca-Cola SVG icon, group name, sticker id, sticker name, and count controls

#### Scenario: Other special section sticker row

- **WHEN** a sticker has no `countryId` and group is not `FIFA World Cup` or `Coca-Cola` (e.g. `00` intro)
- **THEN** the row displays sticker id and name without a country flag, group icon, or country name

### Requirement: Country flag rendering

The UI SHALL render country flags as SVG images using the `isoCode` from catalog data.

#### Scenario: England flag

- **WHEN** a sticker belongs to country `ENG`
- **THEN** the England flag SVG is displayed (not the generic UK flag)

#### Scenario: Scotland flag

- **WHEN** a sticker belongs to country `SCO`
- **THEN** the Scotland flag SVG is displayed

### Requirement: Count controls

Each row SHALL provide increment and decrement controls to change the sticker count.

#### Scenario: Increment button

- **WHEN** a user taps the increment control on a row
- **THEN** the displayed count increases by 1 and the API increment endpoint is called

#### Scenario: Decrement button

- **WHEN** a user taps the decrement control on a row with count 1
- **THEN** the displayed count becomes 0 and the API decrement endpoint is called

### Requirement: Section headers

The list SHALL group stickers under section headers matching the `group` field, in order: FIFA World Cup, Grupo A–L, Coca-Cola. Each section header SHALL be collapsible and SHALL display per-group collection progress for the stickers currently visible in that section.

#### Scenario: Section header visible

- **WHEN** the user scrolls through the list
- **THEN** section headers appear before the first sticker of each group

#### Scenario: FIFA World Cup section header icon

- **WHEN** a section header is rendered for group `FIFA World Cup`
- **THEN** the FIFA SVG icon is displayed alongside the section title

#### Scenario: Coca-Cola section header icon

- **WHEN** a section header is rendered for group `Coca-Cola`
- **THEN** the Coca-Cola SVG icon is displayed alongside the section title

#### Scenario: Section header shows group progress

- **WHEN** a section contains stickers and the user owns some of them (count > 0)
- **THEN** the section header displays progress as `owned / total (percentage%)` for stickers in that section (e.g. `8 / 10 (80%)`)

#### Scenario: Section header progress when none owned

- **WHEN** a section contains stickers and the user owns none of them
- **THEN** the section header displays `0 / total (0%)`

#### Scenario: Section header progress updates on count change

- **WHEN** a user increments a sticker in a section from 0 to 1
- **THEN** that section header owned count and percentage increase accordingly

#### Scenario: Section defaults to expanded

- **WHEN** a section header is first rendered
- **THEN** its sticker rows are visible

#### Scenario: Collapse section

- **WHEN** a user activates the section header control
- **THEN** the sticker rows for that section are hidden and the header indicates collapsed state

#### Scenario: Expand collapsed section

- **WHEN** a user activates a collapsed section header
- **THEN** the sticker rows for that section become visible again

#### Scenario: Collapsible header accessibility

- **WHEN** a section header is rendered
- **THEN** the collapse control exposes `aria-expanded` reflecting the current state

### Requirement: Collapse all sections

The sticker list SHALL provide a control to collapse or expand all visible section headers at once.

#### Scenario: Collapse all control visible

- **WHEN** the sticker list shows at least one section with stickers
- **THEN** a collapse-all control is available above the section list

#### Scenario: Collapse all sections

- **WHEN** a user activates **Collapse all** while one or more sections are expanded
- **THEN** every visible section with stickers collapses and hides its sticker rows

#### Scenario: Expand all sections

- **WHEN** all visible sections are collapsed and the user activates **Expand all**
- **THEN** every visible section expands and shows its sticker rows

#### Scenario: Collapse all ignores empty sections

- **WHEN** a group has no visible stickers after filtering
- **THEN** collapse-all does not affect that group (no empty header is shown)

### Requirement: Filter chips

The UI SHALL provide filter chips for All, Missing, Collected, Duplicates, and each catalog group/section.

#### Scenario: Missing filter

- **WHEN** a user selects the Missing filter
- **THEN** only stickers with count `0` are shown

#### Scenario: Collected filter

- **WHEN** a user selects the Collected filter
- **THEN** only stickers with count `>= 1` are shown

#### Scenario: Collected filter with search

- **WHEN** a user selects the Collected filter and enters a search query
- **THEN** only collected stickers matching the search are shown

#### Scenario: Duplicates filter

- **WHEN** a user selects the Duplicates filter
- **THEN** only stickers with count `>= 2` are shown

#### Scenario: Duplicates filter with search

- **WHEN** a user selects the Duplicates filter and enters a search query
- **THEN** only duplicate stickers matching the search are shown

#### Scenario: Group filter

- **WHEN** a user selects filter `Grupo A`
- **THEN** only stickers in `Grupo A` are shown

#### Scenario: FIFA World Cup filter chip icon

- **WHEN** the filter chips are rendered
- **THEN** the `FIFA World Cup` chip displays the FIFA SVG icon alongside its label

#### Scenario: Coca-Cola filter chip icon

- **WHEN** the filter chips are rendered
- **THEN** the `Coca-Cola` chip displays the Coca-Cola SVG icon alongside its label

### Requirement: Search by sticker id or name

The UI SHALL provide a search input to filter stickers by id prefix or name substring, case-insensitively.

#### Scenario: Search by id

- **WHEN** a user types `MEX` in the search field
- **THEN** only stickers whose id starts with `MEX` are shown

#### Scenario: Search by id case-insensitive

- **WHEN** a user types `mex` in the search field
- **THEN** only stickers whose id starts with `MEX` are shown

#### Scenario: Search by name

- **WHEN** a user types `Yamal` in the search field
- **THEN** stickers whose name contains `Yamal` are shown

#### Scenario: Search by name case-insensitive

- **WHEN** a user types `yamal` in the search field
- **THEN** stickers whose name contains `Yamal` are shown

### Requirement: Authentication gate for collection

The UI SHALL require user authentication before allowing count changes.

#### Scenario: Unauthenticated user views list

- **WHEN** a user is not authenticated
- **THEN** the sticker list and catalog data are visible but count controls are disabled or prompt login

#### Scenario: Authenticated user edits counts

- **WHEN** a user is authenticated
- **THEN** count controls are enabled and persist changes via the API

### Requirement: CSS Modules styling

UI components SHALL use CSS Modules for component-scoped styles per project frontend guidelines.

#### Scenario: Component styles scoped

- **WHEN** a sticker list component is rendered
- **THEN** its styles are imported from a `.module.css` file

### Requirement: Loading and error states

The UI SHALL display loading indicators while fetching data and error messages when API calls fail.

#### Scenario: Loading state

- **WHEN** sticker data is being fetched
- **THEN** a loading indicator is shown

#### Scenario: Loading state during filter or search refetch

- **WHEN** a user changes a filter chip or search query and sticker data is being refetched
- **THEN** a loading indicator is shown inside the search input

#### Scenario: API error

- **WHEN** the API returns an error
- **THEN** an error message is displayed to the user

### Requirement: Branded group SVG icons

The UI SHALL provide inline SVG React components for the FIFA wordmark and Coca-Cola script logo, used wherever `FIFA World Cup` or `Coca-Cola` groups are displayed with an icon.

#### Scenario: FIFA icon accessibility

- **WHEN** the FIFA SVG icon is rendered
- **THEN** it has `role="img"` and an accessible label of `FIFA World Cup`

#### Scenario: Coca-Cola icon accessibility

- **WHEN** the Coca-Cola SVG icon is rendered
- **THEN** it has `role="img"` and an accessible label of `Coca-Cola`

#### Scenario: Icon brand colors

- **WHEN** the FIFA SVG icon is rendered
- **THEN** the logo fill color is FIFA blue (`#326295`)

#### Scenario: Coca-Cola brand color

- **WHEN** the Coca-Cola SVG icon is rendered
- **THEN** the logo fill color is Coca-Cola red (`#F40009`)

### Requirement: Brand group icon legibility

Brand group icons for `FIFA World Cup` and `Coca-Cola` SHALL be legible in sticker list rows at a 375px viewport width, using height-aligned sizing that matches the country flag slot.

#### Scenario: Coca-Cola icon height in list row

- **WHEN** a Coca-Cola sticker row is rendered
- **THEN** the Coca-Cola icon height is at least `1rem` and preserves its aspect ratio

#### Scenario: Coca-Cola icon not stretched

- **WHEN** a Coca-Cola sticker row is rendered
- **THEN** the icon width scales automatically from height without horizontal or vertical distortion

#### Scenario: FIFA icon consistent sizing

- **WHEN** a FIFA World Cup sticker row is rendered
- **THEN** the FIFA icon uses the same height-aligned sizing as the Coca-Cola icon

#### Scenario: Icon does not overflow row

- **WHEN** a brand icon is rendered in a list row on a 375px viewport
- **THEN** the icon respects a maximum width so sticker text remains visible

### Requirement: World Cup logo in dashboard header

The collection dashboard header SHALL display the FIFA World Cup 2026 tournament logo alongside the page title.

#### Scenario: Logo visible on dashboard

- **WHEN** the user views the collection dashboard
- **THEN** the FIFA World Cup 2026 logo image is displayed in the page header

#### Scenario: Logo accessible label

- **WHEN** the tournament logo is rendered
- **THEN** the image has an accessible name of `FIFA World Cup 2026`

### Requirement: Interactive 3D tilt on tournament logo

The FIFA World Cup 2026 emblem on the sign-in screen SHALL respond to pointer movement with a 3D tilt effect that follows the cursor or touch position within the emblem bounds. The sign-in card, form fields, and mode toggle SHALL remain visually static (no card-level tilt transform).

#### Scenario: Emblem tilts on pointer move

- **WHEN** a user moves the pointer over the sign-in FIFA emblem while motion is not reduced
- **THEN** the emblem rotates in 3D proportionally to the pointer position relative to the emblem center

#### Scenario: Emblem resets on pointer leave

- **WHEN** the pointer leaves the emblem area while motion is not reduced
- **THEN** the emblem returns smoothly to its neutral (un-tilted) orientation

#### Scenario: Reduced motion disables emblem tilt

- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** the sign-in emblem is displayed statically with no tilt transform or pointer-driven animation

#### Scenario: Sign-in card stays static

- **WHEN** a user moves the pointer over the sign-in card outside the emblem or over form controls
- **THEN** the card container and form controls do not receive a 3D tilt transform

### Requirement: Sign-in branding hierarchy

The sign-in screen SHALL display a branded header region above the sign-in controls with a defined visual hierarchy: FIFA World Cup 2026 emblem, app title, subtitle, and Panini publisher mark.

#### Scenario: Tournament emblem is the primary visual

- **WHEN** an unauthenticated user views the sign-in screen
- **THEN** the FIFA World Cup 2026 emblem is displayed above the app title and is visually larger than the title text

#### Scenario: App title and subtitle visible

- **WHEN** the sign-in branding region is rendered
- **THEN** the title `Album FIFA 2026` and the subtitle `Sign in to track your sticker collection` are displayed below the emblem in that order

#### Scenario: Panini publisher mark placement

- **WHEN** the sign-in branding region is rendered
- **THEN** the Panini logo appears below the subtitle as a publisher mark, not above the app title

#### Scenario: Branding separated from form controls

- **WHEN** the sign-in card is rendered
- **THEN** a visual separator appears between the branding region and the sign-in method toggle / form

#### Scenario: Branding accessibility

- **WHEN** the sign-in branding region is rendered
- **THEN** the FIFA World Cup 2026 image has accessible name `FIFA World Cup 2026` and the Panini image has accessible name `Panini`

### Requirement: Shared World Cup emblem component

The FIFA World Cup 2026 PNG tournament emblem SHALL be implemented as a single shared UI component in the app shell (`shared` module) and composed by both the sign-in branding region and the collection dashboard header.

#### Scenario: Sign-in composes shared emblem

- **WHEN** the sign-in branding region is rendered
- **THEN** the FIFA World Cup 2026 emblem is displayed via the shared `WorldCupEmblem` component with the `hero` variant

#### Scenario: Dashboard composes shared emblem

- **WHEN** the collection dashboard header is rendered
- **THEN** the FIFA World Cup 2026 emblem is displayed via the shared `WorldCupEmblem` component with the `compact` variant

#### Scenario: No duplicate emblem implementation in catalog

- **WHEN** the frontend codebase is inspected for tournament emblem rendering
- **THEN** the catalog module does not define a separate `WorldCupLogoTilt` (or equivalent duplicate) component for the same PNG asset

### Requirement: Register by code form

The collection dashboard SHALL provide a modal for authenticated users to register multiple stickers by entering comma-separated sticker codes. The main dashboard SHALL NOT show the registration text input until the user opens the modal.

#### Scenario: Register action visible when authenticated

- **WHEN** an authenticated user views the sticker list
- **THEN** an **Add codes** control is visible in the progress card header and the registration text input is not visible on the main screen

#### Scenario: Register action hidden when unauthenticated

- **WHEN** a user is not authenticated
- **THEN** the register stickers control and modal are not available (same gate as count controls)

#### Scenario: Open registration modal

- **WHEN** an authenticated user activates **Add codes**
- **THEN** a modal opens with the register-by-code form, including a dialog title and close control

#### Scenario: Close registration modal

- **WHEN** a user activates the modal close control or presses Escape
- **THEN** the modal closes and the main dashboard shows only the search input among text fields

#### Scenario: Submit registers codes

- **WHEN** a user enters `MEX1, FWC1` in the modal and submits the form
- **THEN** the API register endpoint is called and displayed counts for those stickers increase by 1 each

#### Scenario: Progress updates after register

- **WHEN** a user registers a sticker that was missing (count `0`)
- **THEN** the album progress owned count increases accordingly

#### Scenario: Unknown codes feedback

- **WHEN** a user submits codes including an unrecognized code
- **THEN** the UI shows which codes were not recognized inside the modal while still reflecting updates for valid codes

#### Scenario: Modal closes on full success

- **WHEN** registration completes successfully with at least one valid code and no unknown codes
- **THEN** the input field is cleared and the modal closes

#### Scenario: Submit disabled while loading

- **WHEN** a registration request is in progress
- **THEN** the submit control is disabled until the request completes

#### Scenario: Modal accessibility

- **WHEN** the registration modal is open
- **THEN** the dialog exposes an accessible name via its title and supports keyboard dismissal with Escape

### Requirement: Shared modal component

The UI SHALL provide a reusable modal component in the shared module for focused overlay interactions.

#### Scenario: Modal uses dialog semantics

- **WHEN** a modal is rendered in the open state
- **THEN** it is implemented with `role="dialog"` (via native `<dialog>`) and an accessible title

#### Scenario: Modal backdrop

- **WHEN** a modal is open
- **THEN** a visual backdrop separates the modal content from the page behind it

