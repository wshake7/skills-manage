# tRPC Repository Development Skill

## Overview

tRPC is a TypeScript RPC framework that enables end-to-end typesafe APIs. This repository is a monorepo managed with **pnpm workspaces** and **Turborepo**. It contains the core packages, adapters, and official plugins.

## Repository Structure

- `packages/` – All publishable packages. Core:
  - `server` – `@trpc/server`: core router, procedure, context, middleware, error handling.
  - `client` – `@trpc/client`: links, transformer support, client-side types.
  - `next` – `@trpc/next`: Next.js integration (pages router).
  - `react-query` – `@trpc/react-query`: react hooks.
  - Other adapters: `express`, `fastify`, `fetch`, `aws-lambda`, etc.
- `www/` – Documentation site (Docusaurus).
- `examples/` – Example projects demonstrating integrations.
- `.github/` – CI workflows, issue templates.
- `turbo.json` – Turborepo pipeline configuration.
- `pnpm-workspace.yaml` – Workspace definition.
- `patches/` – Patch files for dependencies.

## Development Setup

1. **Prerequisites**: Node.js (see `.nvmrc`), pnpm (`corepack enable` or install globally).
2. **Install dependencies**: `pnpm install`
3. **Build all packages**: `pnpm build` (runs turbo build pipeline).
4. **Run tests**:
   - All: `pnpm test`
   - Single package: `pnpm --filter @trpc/server test`
   - Watch mode: `pnpm --filter @trpc/server test:watch`
5. **Lint**: `pnpm lint` (ESLint across packages).
6. **Format**: `pnpm format` (Prettier).

## Common Workflows

### Adding a New Middleware / Feature to Core

- Write code in appropriate package (e.g., `packages/server/src/`).
- Export from the package’s `index.ts` if public API.
- Add unit tests next to the source in a `__tests__/` directory or alongside `.test.ts` files (preferred: `*.test.ts`).
- Run `pnpm --filter @trpc/server test` to verify.
- If the change affects types, ensure `tsd` type tests pass.
- Run `pnpm build` to check compilation across dependencies.

### Testing Changes Across Packages

- After building (`pnpm build`), you can link to example projects: `cd examples/next-prisma-starter && pnpm dev`.
- Use `pnpm dev` at the root to start a watch mode for all packages (Turbo `dev` tasks).

### Contributing

- Read `CONTRIBUTING.md` for guidelines.
- Use **changesets** to document package bumps: `pnpm changeset`.
- Commit messages follow conventional commits (optional but helpful).

### Debugging

- Set breakpoints in VS Code. Use the “JavaScript Debug Terminal” to run tests.
- Use `console.log`; server-side logs appear in test output.
- For client-server integration, check network tab or run with `TRPC_LOG=true` to see internal logging.

## Key Concepts & APIs

- **Procedure Builders**: `t.procedure`, `t.router` – chainable `.input(zodSchema)`, `.query()`, `.mutation()`, `.middleware()`.
- **Context**: typed per-request data (e.g., user session). Set via `createContext` passed to `createCallerFactory` / adapters.
- **Middleware**: `t.middleware` – return `{ ctx, next }` to extend context or throw errors.
- **Links** (client): chainable network layer like `httpLink`, `wsLink`, `loggerLink`.
- **Transformers**: serialization layer (e.g., `superjson`). Apply same transformer on both server and client.

## Important Files

- `packages/server/src/core/internals/procedure.ts` – procedure implementation.
- `packages/server/src/core/router.ts` – router creation.
- `packages/client/src/links/httpLink.ts` – default HTTP link.
- `turbo.json` – task dependencies; `build` depends on `^build` to ensure packages are built first.

## Testing Tools

- **Vitest**: primary test runner for most packages.
- **Jest**: used in some legacy packages (check `jest.config.ts`).
- **tsd**: type-level tests in `*.test-d.ts` files.
- **Playwright**: end-to-end tests (e.g., `www/`).

## Pitfalls & Tips

- Circular dependencies are strictly avoided; use barrel exports carefully.
- Always run `pnpm build` before testing examples or dependent packages.
- Use `pnpm --filter` to scope commands and save time.
- If a test fails unexpectedly, ensure the correct Node version is active (`nvm use`).
- The documentation site (`www/`) has its own `pnpm dev`; code snippets must reflect latest changes.
