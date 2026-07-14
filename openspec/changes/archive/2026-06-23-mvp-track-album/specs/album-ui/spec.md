## ADDED Requirements

### Requirement: Mobile-first layout

The sticker list UI SHALL be optimized for mobile viewports with a single-column list layout.

#### Scenario: Mobile viewport

- **WHEN** the app is viewed on a viewport width of 375px
- **THEN** the sticker list renders as a full-width scrollable list without horizontal overflow

### Requirement: Progress display

The UI SHALL display album progress as `owned / 990` with a visual progress indicator at the top of the list.

#### Scenario: Progress updates on count change

- **WHEN** a user increments a sticker from 0 to 1
- **THEN** the progress owned count increases by 1

### Requirement: Sticker list rows

Each sticker row SHALL display the sticker id, sticker name, count controls, and country information when applicable.

#### Scenario: Team sticker row

- **WHEN** a sticker has `countryId` `MEX`
- **THEN** the row displays the country flag (SVG), Spanish country name, sticker id, sticker name, and count controls

#### Scenario: Special section sticker row

- **WHEN** a sticker has no `countryId` (FWC, CC, or `00`)
- **THEN** the row displays sticker id and name without a country flag or country name

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

The list SHALL group stickers under section headers matching the `group` field, in order: FIFA World Cup, Grupo A–L, Coca-Cola.

#### Scenario: Section header visible

- **WHEN** the user scrolls through the list
- **THEN** section headers appear before the first sticker of each group

### Requirement: Filter chips

The UI SHALL provide filter chips for All, Missing, and each catalog group/section.

#### Scenario: Missing filter

- **WHEN** a user selects the Missing filter
- **THEN** only stickers with count `0` are shown

#### Scenario: Group filter

- **WHEN** a user selects filter `Grupo A`
- **THEN** only stickers in `Grupo A` are shown

### Requirement: Search by sticker id

The UI SHALL provide a search input to filter stickers by id prefix.

#### Scenario: Search MEX

- **WHEN** a user types `MEX` in the search field
- **THEN** only stickers whose id starts with `MEX` are shown

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

#### Scenario: API error

- **WHEN** the API returns an error
- **THEN** an error message is displayed to the user
