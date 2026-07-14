## MODIFIED Requirements

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
