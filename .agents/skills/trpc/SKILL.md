# tRPC Monorepo Skill

## Overview
tRPC is a TypeScript RPC framework for end-to-end typesafe APIs. This monorepo contains the core server, client, adapters (Next.js, React, Express, etc.), and documentation.

## Repository Structure
- `packages/server` – Core `@trpc/server` package: router, procedure, middleware, context, errors.
- `packages/client` – Vanilla `@trpc/client` for HTTP/WS links.
- `packages/next` – `@trpc/next` Next.js integration (app router, pages router).
- `packages/react` – `@trpc/react` React hooks (`trpc.Provider`, `createTRPCReact`).
- `packages/react-query` – `@trpc/react-query` TanStack Query bindings.
- `packages/express` – `@trpc/express` Express adapter.
- `packages/playground` – GraphiQL-like playground.
- `packages/openapi` – OpenAPI support.
- `packages/tests` – Integration and E2E tests.
- `www` – Documentation site (Docusaurus).
- `examples` – Example apps (minimal, Next.js, Express, etc.).

Workspaces managed by `pnpm`; builds orchestrated with `turbo`.

## Development Setup
1. Install dependencies: `pnpm install`
2. Build all packages: `pnpm build` (or `turbo run build`)
3. Run all tests: `pnpm test` (vitest for unit, custom E2E runner in `packages/tests`)
4. Lint: `pnpm lint`
5. Start docs dev: `cd www && pnpm start`

## Key Concepts for Agents
- **Router / Procedure / Middleware** – Found in `packages/server/src`. Routers define query/mutation procedures using `.input(...)` and `.query(...)`. Middleware compose via `.use(...)`.
- **Generic types** – Heavily used: `TRPCRouter`, `ProcedureBuilder`, `AnyRouter`. The `$types` pattern exposes input/output types without the implementation.
- **Builder pattern** – `initTRPC.create()` returns a reusable `t` object with `t.router`, `t.procedure`, `t.middleware`.
- **Context** – A `createContext` function passed per request. Types flow via `typeof createContext`.

## Common Tasks
### Adding a New Feature to `@trpc/server`
- Implement in `packages/server/src`.
- Write unit tests alongside the source (`*.test.ts`).
- Ensure types propagate: often requires adjustments in `packages/server/src/internals` or type inference helpers.
- Add integration tests in `packages/tests` if needed (under `tests/` with a new e2e test file).
- Update docs in `www/docs` if public API changes.

### Changing an Adapter (e.g., `@trpc/next`)
- The adapter imports from `@trpc/server` and `@trpc/client` (or `@trpc/react`).
- Modifications may require building the server/client first (`pnpm build` inside those packages) or using `turbo` for proper ordering.
- Run adapter-specific tests: `cd packages/next && pnpm test`.

### Fixing a Bug
- Locate the package; write a failing test first.
- Fix the issue ensuring no type regressions (typecheck: `pnpm typecheck` or `turbo run typecheck`).
- Run `pnpm test` at the root to verify all packages still pass.

### Generating / Updating Documentation
- Docs are in `www/docs` (markdown).
- API docs are often generated from TSDoc comments (via `api-documenter`?). Check `www/scripts` for generation scripts.
- For quick preview, run docs site locally.

## Package Interdependencies
- `@trpc/client` depends on `@trpc/server` for types only (peer dependency).
- `@trpc/next` and `@trpc/react` depend on both server and client.
- Many tests in `packages/tests` import from built packages; ensure `pnpm build` completes before running integration tests.

## Useful Commands (root)
- `pnpm test` – Run all unit tests (vitest).
- `pnpm test:e2e` – Run E2E tests (requires built packages).
- `pnpm lint` – ESLint across the monorepo.
- `pnpm format` – Prettier.
- `pnpm typecheck` – TypeScript type checking.
- `ci` workflows in `.github/workflows` give the authoritative list of checks.

## Code Style
- Consistent with the repo’s existing patterns: strict TypeScript, `@trpc/server` uses internal error codes, `TRPCError` for known errors.
- Middleware should be composable and respect `ctx` generics.
- Avoid breaking the `$types` export contract unless coordinated across packages.