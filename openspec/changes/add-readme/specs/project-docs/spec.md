## ADDED Requirements

### Requirement: Root README documents the project
The repository SHALL include a root `README.md` that describes the Album FIFA 2026 application purpose and tech stack (TypeScript, Bun, React frontend, Bun/Express backend, Supabase).

#### Scenario: Visitor opens the repository
- **WHEN** a visitor opens the repository on GitHub or clones it
- **THEN** they can read a root `README.md` that states what the app does and which technologies it uses

### Requirement: Root README enables local setup
The root `README.md` SHALL document prerequisites, copying `.env.example` to `.env`, installing dependencies with Bun, and starting local development with `bun run dev`.

#### Scenario: Developer sets up locally
- **WHEN** a developer follows the README setup section
- **THEN** they know how to create `.env`, install packages, and run the local frontend and backend together

### Requirement: Root README lists primary scripts
The root `README.md` SHALL list the primary workspace scripts used for development and quality: at least `dev`, `test`, `lint`, and `build`.

#### Scenario: Developer looks up how to run tests
- **WHEN** a developer needs to run tests or checks
- **THEN** the README lists the relevant `bun run` scripts without inventing commands that do not exist in `package.json`

### Requirement: Root README links to deeper documentation
The root `README.md` SHALL link to `docs/deploy.md` for production deployment and to `AGENTS.md` for agent/XP development workflow, without duplicating those documents in full.

#### Scenario: Operator needs production deploy steps
- **WHEN** an operator needs Railway/Vercel deployment instructions
- **THEN** the README points them to `docs/deploy.md`
