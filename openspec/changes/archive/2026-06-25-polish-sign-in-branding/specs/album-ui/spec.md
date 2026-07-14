## ADDED Requirements

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
