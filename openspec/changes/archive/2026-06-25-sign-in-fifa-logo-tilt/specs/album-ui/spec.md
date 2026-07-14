## MODIFIED Requirements

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
