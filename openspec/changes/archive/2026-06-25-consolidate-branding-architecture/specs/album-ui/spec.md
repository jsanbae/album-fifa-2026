## ADDED Requirements

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
