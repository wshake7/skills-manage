# tRPC Skill

## Overview
tRPC is a TypeScript-first framework for building end‑to‑end typesafe APIs without schema declarations or code generation. This repository is a monorepo containing the core libraries, adapters for React/Next.js, and examples.

## Project Structure
- `packages/` – core libraries:
  - `@trpc/server` – server‑side router and procedure builder
  - `@trpc/client` – type‑safe client
  - `@trpc/react-query` / `@trpc/react` – React bindings
  - `@trpc/next` – Next.js integration
  - `@trpc/playground` – built‑in API playground
- `examples/` – real‑world applications (e.g., `next-prisma-starter`, `express-server`)
- `www/` – documentation website (built with Nextra)
- `scripts/` – build, release, and maintenance scripts
- `playground/` – interactive sandbox
- `turbo.json` – Turborepo pipeline configuration
- Root configs: `package.json`, `tsconfig.json`, `.eslintrc`, `.prettierrc`

## Development Workflow
- Package manager: Yarn (classic v1)
- Build orchestration: Turborepo
- Setup: `yarn install` → `yarn build` (builds all packages simultaneously)
- Watch mode: `yarn dev` (starts TypeScript watch for all packages)
- Lint: `yarn lint`
- Test: `yarn test` (unit tests with Vitest; run `yarn test:e2e` for end‑to‑end tests)
- Run a single package test: `yarn workspace @trpc/server test`
- Adding a new package: create folder in `packages/`, update root `workspaces`, add `turbo.json` task if needed.

## Common Tasks
- **Test changes in an example**
  1. Run `yarn dev` in repo root to rebuild packages on change.
  2. In the example folder (e.g., `examples/next-prisma-starter`), run `yarn dev`. Local packages are linked via workspaces, so changes are reflected immediately after rebuild.

- **Run a specific test file**
  ```bash
  yarn workspace @trpc/server test path/to/test.test.ts
  ```

- **Lint & auto‑fix**
  ```bash
  yarn lint --fix
  ```

- **Prepare a new release** – use the `scripts/release` script after bumping versions.

## Testing Patterns
- Server unit tests often use `createCaller` or `createTRPCProxyClient` against a minimal test router, avoiding full HTTP setup.
- Middleware and procedure tests use `runProcedureMiddlewareTest` (from `@trpc/server` utils) for isolated testing.
- End‑to‑end tests spin up a real HTTP server and client with `fetch`.

## Key Concepts (for code navigation)
- **Router** – a collection of procedures, created with `t.router({...})`.
- **Procedure** – can be a `.query()`, `.mutation()`, or `.subscription()`; built using `publicProcedure` (or `protectedProcedure` after middleware).
- **Context** – typed object passed to every procedure, holding request info (e.g., session, database pool).
- **Input validation** – typically done with Zod schemas via `.input(z.object({...}))`.
- **Middlewares** – functions that wrap a procedure, can modify context or throw errors; composition via `.use()`.
- **Client‑side**
  - Proxy client: `createTRPCProxyClient<AppRouter>` returns a type‑safe object with routes as keys.
  - React: `trpc.useQuery(['route.procedure', input])` with `@trpc/react-query`.

## Contribution Guidelines
- Follow the code of conduct and contributing guide in `CONTRIBUTING.md`.
- Use conventional commits (e.g., `feat:`, `fix:`, `chore:`) – enforced via commitlint.
- All PRs require passing CI (lint, typecheck, tests, and potentially e2e).
- Changes to public API must be reflected in the `www` documentation.

## Useful Resources
- Official documentation: https://trpc.io
- Discord community: https://trpc.io/discord
- GitHub issues: https://github.com/trpc/trpc/issues
- Release process: `scripts/RELEASE.md`