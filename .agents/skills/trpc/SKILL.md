# tRPC Repository Skill

This skill provides guidance for working within the trpc monorepo (https://github.com/trpc/trpc).

## Overview
tRPC is a TypeScript framework for building typesafe APIs. The repository contains the core packages, adapters, and examples. It uses a monorepo structure with Turborepo for task orchestration, TypeScript extensively, and various testing frameworks.

## Repository Structure
- `packages/` – Core and integration packages (e.g., `server`, `client`, `react-query`, `next`, `openapi`).
- `examples/` – Minimal example projects demonstrating usage with different frameworks.
- `www/` – Documentation website.
- `scripts/` – Build and utility scripts.
- `turbo.json` – Turborepo configuration for pipelines.
- `package.json` – Root workspace configuration.

## Development Workflow
1. **Install dependencies:** Use the package manager indicated by the lock file (`pnpm` with `pnpm-lock.yaml`, `yarn` with `yarn.lock`, or `npm`). Usually `pnpm install`.
2. **Build all packages:** `pnpm build` (or equivalent) uses Turborepo to build packages in dependency order.
3. **Run tests:** `pnpm test` executes unit and integration tests across packages.
4. **Linting:** `pnpm lint` enforces code quality (ESLint).
5. **Type checking:** Run `tsc -b` from root or individual packages.
6. **Start an example:** Navigate to an example directory and follow its README; often `pnpm dev`.

## Testing
- Unit tests live alongside source files (e.g., `*.test.ts`). Framework: likely Vitest or Jest – check config.
- E2E tests may exist in `examples/` using Playwright or Cypress.
- Use `pnpm test:watch` for watch mode.
- For a specific package: `cd packages/server && pnpm test`.

## Branching and Pull Requests
- Base your work on `main` branch.
- Follow conventional commits (e.g., `fix:`, `feat:`). The repo uses changesets for versioning and changelogs.
- When making public API changes, run `pnpm changeset` to record a changeset.
- Ensure all checks (lint, build, test) pass before pushing.

## Adding a New Feature or Fix
1. Identify the package(s) to modify.
2. Create a feature branch.
3. Implement code and tests.
4. Ensure build works and tests pass locally.
5. Commit using conventional format.
6. Open a PR, fill in the template.

## Important Patterns
- **Procedures:** Use `.query()`, `.mutation()`, `.subscription()` builders. Always define input validation with a library like Zod.
- **Middleware:** Create reusable middleware for logging, auth, etc. via `t.middleware()`.
- **Context:** Extend the request context with dependencies (e.g., database connections) in `createContext`.
- **Adapters:** Framework-specific adapters (e.g., Next.js, Express) wrap the tRPC router and handle requests.

## Troubleshooting Common Issues

### Type errors across monorepo
- Run `pnpm build` to generate type declarations for dependent packages.

### Dependency hoisting problems
- Use workspace protocol (`workspace:*`) to link internal packages.
- If module resolution fails, try `pnpm install --force` or clean cache.

### Tests failing in CI
- Check that your changes don’t break E2E examples.
- Use `pnpm test:e2e` if available.
- Confirm GitHub Actions workflow (`/.github/workflows/`) for additional checks.

## Documentation and Resources
- **CONTRIBUTING.md** – Detailed contribution guide.
- **packages/*/README.md** – Package-specific docs.
- **tRPC official documentation** – linked in the repo’s README.