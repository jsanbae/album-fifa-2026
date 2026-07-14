## MODIFIED Requirements

### Requirement: Sticker list rows

Each sticker row SHALL display the sticker id, sticker name, count controls, country information when applicable, and a duplicate badge next to the country or group name when the user owns more than one copy (count `>= 2`).

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

#### Scenario: Duplicate badge visible

- **WHEN** a sticker row is rendered and the user's count for that sticker is `>= 2`
- **THEN** a **Duplicate** badge is displayed immediately after the country or group name

#### Scenario: Duplicate badge hidden for single copy

- **WHEN** a sticker row is rendered and the user's count is `0` or `1`
- **THEN** no duplicate badge is displayed

#### Scenario: Duplicate badge accessibility

- **WHEN** a duplicate badge is displayed
- **THEN** it exposes accessible text that identifies the sticker as a duplicate (e.g. visible label **Duplicate** or equivalent `aria-label`)
