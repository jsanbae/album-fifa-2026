## ADDED Requirements

### Requirement: Monorepo workspace structure

The project SHALL provide an npm workspaces monorepo with packages `common`, `backend`, and `frontend` at the repository root.

#### Scenario: Workspace packages resolve each other

- **WHEN** a developer runs install at the repository root
- **THEN** `common`, `backend`, and `frontend` packages are linked as workspace dependencies

### Requirement: TypeScript compilation

Each package SHALL compile TypeScript with strict mode enabled and expose build scripts.

#### Scenario: Build succeeds on clean checkout

- **WHEN** a developer runs the root build script
- **THEN** all packages compile without type errors

### Requirement: Test runner

Each package SHALL have a test runner configured (e.g. Vitest or Jest) with a `test` script.

#### Scenario: Tests run from root

- **WHEN** a developer runs the root test script
- **THEN** tests in `common`, `backend`, and `frontend` execute

### Requirement: Lint and format

The repository SHALL enforce ESLint and Prettier with shared configuration across packages.

#### Scenario: Lint passes on scaffold

- **WHEN** a developer runs the lint script
- **THEN** no lint errors are reported on scaffolded code

### Requirement: Development scripts

The repository SHALL provide scripts to run the backend server and frontend dev server concurrently or independently.

#### Scenario: Start backend locally

- **WHEN** a developer runs the backend dev script
- **THEN** the HTTP server starts and listens on a documented port

#### Scenario: Start frontend locally

- **WHEN** a developer runs the frontend dev script
- **THEN** the React app starts and proxies or points to the backend API

### Requirement: Environment configuration

The repository SHALL document required environment variables (including Supabase URL and keys) via `.env.example` without committing secrets.

#### Scenario: Example env file exists

- **WHEN** a developer copies `.env.example` to `.env`
- **THEN** all required variable names are present with placeholder values
