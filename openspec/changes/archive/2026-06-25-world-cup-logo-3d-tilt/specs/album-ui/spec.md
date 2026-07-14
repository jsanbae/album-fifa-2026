## ADDED Requirements

### Requirement: World Cup logo in dashboard header

The collection dashboard header SHALL display the FIFA World Cup 2026 tournament logo alongside the page title.

#### Scenario: Logo visible on dashboard

- **WHEN** the user views the collection dashboard
- **THEN** the FIFA World Cup 2026 logo image is displayed in the page header

#### Scenario: Logo accessible label

- **WHEN** the tournament logo is rendered
- **THEN** the image has an accessible name of `FIFA World Cup 2026`

### Requirement: Interactive 3D tilt on tournament logo

The tournament logo SHALL respond to pointer movement with a 3D tilt effect that follows the cursor or touch position within the logo bounds.

#### Scenario: Logo tilts on pointer move

- **WHEN** a user moves the pointer over the logo while motion is not reduced
- **THEN** the logo rotates in 3D proportionally to the pointer position relative to the logo center

#### Scenario: Logo resets on pointer leave

- **WHEN** the pointer leaves the logo area while motion is not reduced
- **THEN** the logo returns smoothly to its neutral (un-tilted) orientation

#### Scenario: Reduced motion disables tilt

- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** the logo is displayed statically with no tilt transform or pointer-driven animation
