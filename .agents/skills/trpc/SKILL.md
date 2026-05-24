# tRPC Skill

## Overview
tRPC is a TypeScript RPC framework for building end-to-end typesafe APIs. This monorepo contains the core packages: `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@trpc/next`, and utilities.

## Repository Structure
- `packages/server` – Core server logic: routers, procedures, middleware, context, error handling.
- `packages/client` – Client proxy for invoking procedures.
- `packages/react-query` – React bindings using TanStack Query.
- `packages/next` – Next.js integration (app and pages routers).
- `packages/observable` – Observable implementation for subscriptions.
- `packages/tests` – Integration and E2E tests.
- `scripts/` – Build and release tooling.

## Core Concepts
- **Router**: Tree of procedures (query, mutation, subscription) defined via `t.router({...})`.
- **Procedure**: Built with `.input(validator)` (zod, etc.) and `.query/.mutation/.subscription(resolver)`.
- **Context**: Per-request data (session, db) created in the adapter and accessible in resolvers.
- **Middleware**: Chainable logic that wraps procedure execution.
- **Transformer**: Serialization layer (e.g., superjson) that preserves data types like `Date`.
- **Caller**: Direct server-side invocation for testing or inter-procedure calls.

## Development Workflow
- Install pnpm, clone repo, run `pnpm install`.
- Build all packages with `pnpm build` (Turborepo).
- Run tests: `pnpm test` (Vitest units), `pnpm test-e2e` (Playwright).
- Watch mode: `pnpm dev`.

**Typical feature/bugfix steps:**
1. Determine which package(s) are affected.
2. For server changes, edit `@trpc/server` first; update client/react packages to match.
3. Add tests in `packages/tests/server` or the relevant package’s test directory.
4. Verify that client type inference works end-to-end: the client must infer input/output types from the server router.
5. Create a changeset with `pnpm changeset` to describe the change.

## Important Patterns & Conventions
- Use Zod for input/output validation; avoid manual type casts.
- Middleware types extend `MiddlewareFunction`.
- Custom errors use `TRPCError`.
- Unstable features carry the `experimental_` prefix.
- Versioning is handled with changesets (`pnpm changeset`).
- Strict TypeScript and flat ESLint config are enforced.

## Testing
- Unit tests: Vitest, co-located or in `__tests__`.
- Integration tests: `packages/tests/server` (combined server/client workflows).
- E2E tests: `packages/tests/next/playwright` (Next.js integration).
- Run a single package’s tests: `pnpm -F <package> test` or direct Vitest invocation.

## Common Pitfalls
- Circular type references can break inference; keep procedure types modular.
- Transformer (e.g., superjson) must be configured on both server and client (`createTRPCClient`, `createTRPCServer`).
- New packages require updates to `pnpm-workspace.yaml` and `turbo.json`.
- Avoid `any` – tRPC’s value lies in full type safety; leaking `any` erodes inference.

## External References
- Docs: https://trpc.io/docs
- tRPC CLI (external): https://github.com/trpc/trpc/tree/main/packages/cli (but handled as a separate package; check if available in this repo).