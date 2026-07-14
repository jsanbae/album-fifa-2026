## ADDED Requirements

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
