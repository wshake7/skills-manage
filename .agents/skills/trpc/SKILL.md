# tRPC Monorepo Skill

## Overview
This skill helps an AI coding agent work effectively with the [tRPC](https://github.com/trpc/trpc) repository—a TypeScript-first RPC framework. The codebase is a pnpm monorepo with Turborepo orchestration, using Changesets for versioning and release.

## Repository Structure
- `packages/` – Core packages (`server`, `client`, `react-query`, `next`, `next`, `playground`, etc.)
- `www/` – Documentation site (Docusaurus)
- `examples/` – Full-stack example projects
- `scripts/` – Build and maintenance scripts
- `tooling/` – Shared configurations (ESLint, Prettier, TypeScript)
- Root config files: `turbo.json`, `pnpm-workspace.yaml`, `.changeset/`

## Development Environment Setup
1. Clone and install: `git clone https://github.com/trpc/trpc.git && cd trpc && pnpm install`
2. Build all packages: `pnpm build` (or `turbo run build`)
3. Run tests (watch mode): `pnpm test` (uses Vitest)
4. Start docs locally: `pnpm docs:dev` (serves at localhost:3000)

## Common Agent Workflows

### Modifying a Package
1. Navigate: `cd packages/<target>`
2. Make code changes
3. Run package-specific tests: `pnpm test --filter @trpc/server`
4. Lint: `pnpm lint` (from root or package)
5. Ensure build passes: `pnpm build --filter @trpc/server`
6. If introducing a user-facing change, add a changeset: `pnpm changeset` (follow prompts)

### Running Tests Across Packages
- All tests: `pnpm test`
- Test a single file: `vitest run path/to/test` (from package directory)
- Tests with coverage: `pnpm test:coverage`
- Integration tests often live in `examples/` – check each example’s README.

### Linting and Formatting
- Lint entire project: `pnpm lint`
- Format with Prettier: `pnpm format`
- Fix auto-fixable issues: `pnpm lint:fix`

### Contributing to Documentation
- Documentation is in `www/`
- Add/update `.mdx` files under `www/docs/`
- Ensure internal links work: run `pnpm docs:dev` and visually verify.

## Key Packages and Responsibilities
- `@trpc/server` – Core server-side router, procedure definitions, middleware.
- `@trpc/client` – Type-safe client for consuming tRPC APIs.
- `@trpc/react-query` – React bindings with React Query integration.
- `@trpc/next` – Next.js integration (server-side helpers, app router support).
- `@trpc/playground` – Built-in API playground.
- `@trpc/tests` – End-to-end and internal testing utilities.

## Build System & Toolchain
- **Package manager:** pnpm (workspaces)
- **Task runner:** Turborepo (see `turbo.json`)
- **Test runner:** Vitest (configured per package via `vitest.config.ts`)
- **Typescript:** Strict mode, composite projects (builds generate `.d.ts`)
- **Versioning:** Changesets (add a changeset with `pnpm changeset`; CI bumps versions and publishes)

## Typical Developer Workflow for a Bug Fix
1. Check existing issues/PRs.
2. Create a branch: `git checkout -b fix/description`.
3. Identify affected package(s).
4. Write a failing test (if possible).
5. Implement the fix.
6. Run `pnpm test --filter <package>` and ensure all pass.
7. Run `pnpm lint` to catch style violations.
8. Add a changeset: `pnpm changeset` (patch/minor according to semver).
9. Commit and push.

## Environment Variables
- None required for basic development, but some examples may need a `.env` file (copy from `.env.example`).

## Troubleshooting
- **Missing dependencies after pull:** Run `pnpm install` and `pnpm build`.
- **Type errors in dependent packages after a change:** Rebuild the modified package first (`pnpm build --filter @trpc/server`), then rebuild downstream packages or root `pnpm build`.
- **Playground not working locally:** Start the playground example: `cd examples/standalone-server && pnpm dev`.

## Additional Resources
- Official documentation: https://trpc.io
- Contributing guide: `CONTRIBUTING.md` at repository root.
- CI configuration: `.github/workflows/`