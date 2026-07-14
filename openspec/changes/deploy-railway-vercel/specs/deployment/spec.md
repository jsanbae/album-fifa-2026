## ADDED Requirements

### Requirement: Railway hosts the backend API

The repository SHALL provide Railway-oriented build and start configuration so the Bun Express API can be deployed from the monorepo root and listen on the platform-provided `PORT`.

#### Scenario: Railway start command runs the compiled backend

- **WHEN** an operator configures Railway using the repository deployment config
- **THEN** the service builds workspace package `@album/common` and `@album/backend`
- **AND** the start process runs the backend start script
- **AND** the process listens on `process.env.PORT`

#### Scenario: Health check responds on deployed API

- **WHEN** a client sends `GET /health` to the deployed API origin
- **THEN** the response status is 200
- **AND** the body indicates a healthy status

### Requirement: Vercel hosts the frontend SPA

The repository SHALL provide Vercel-oriented configuration so the Vite React SPA builds from the monorepo and is served as a single-page application.

#### Scenario: Vercel build produces frontend static assets

- **WHEN** an operator deploys with the repository Vercel configuration
- **THEN** `@album/common` and `@album/frontend` are built
- **AND** the deployable output is the frontend production build directory

#### Scenario: SPA client routes fall back to index

- **WHEN** a browser requests a non-asset path on the Vercel origin
- **THEN** the platform serves `index.html` so client-side routing can handle the path

### Requirement: Production environment contract is documented

The repository SHALL document which environment variables belong on Railway, which on Vercel (build-time), and which Supabase dashboard settings must match the Vercel origin.

#### Scenario: Example env documents production hosts

- **WHEN** an operator reads `.env.example` (and deployment docs)
- **THEN** they can identify Railway-only, Vercel-only, and shared Supabase variables
- **AND** they are instructed to set `CORS_ORIGIN` to the Vercel origin
- **AND** they are instructed to set `VITE_API_URL` to the Railway API origin
- **AND** they are instructed not to set `DEV_USER_ID` in production

### Requirement: Cross-origin browser access from Vercel to Railway

When `CORS_ORIGIN` is set to the frontend production origin, the API SHALL allow browser requests from that origin for the existing API routes.

#### Scenario: Configured CORS origin is accepted

- **WHEN** `CORS_ORIGIN` is set to the Vercel production origin
- **AND** a browser from that origin calls an API route
- **THEN** the CORS response headers permit that origin
