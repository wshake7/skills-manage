# tRPC Monorepo Skill

This skill provides a working knowledge of the [tRPC](https://github.com/trpc/trpc) monorepo to help an AI coding agent navigate, understand, and contribute effectively.

## Project Overview

tRPC is an end-to-end typesafe API layer for TypeScript. This monorepo contains the core `@trpc/server`, `@trpc/client`, adapters, plugins, and auxiliary packages.

- **Package Manager**: pnpm (workspaces)
- **Language**: TypeScript (strict)
- **Build Tool**: tsup primarily, with some packages using custom bundling
- **Testing**: Vitest (with React Testing Library where needed)
- **Linting/Formatting**: ESLint + Prettier (via `@trpc/config` shared config)

## Repository Structure

```
packages/
  server/          # @trpc/server – core router, procedure, middleware
  client/          # @trpc/client – typesafe client & links
  next/            # @trpc/next – Next.js integration (app router, pages router)
  react-query/     # @trpc/react-query – React hooks on top of @tanstack/react-query
  tests/           # integration/e2e tests across adapters
  config/          # shared ESLint, Prettier, tsconfig (used by all packages)
  ... (adapters, plugins, etc.)
www/               # documentation website (Docusaurus)
examples/          # minimal reproductions & starter templates
scripts/           # build/CI utility scripts
```

## Key Concepts

### Router & Procedures
- `t.router(...)` creates a collection of **procedures** (queries, mutations, subscriptions).
- A procedure is defined with `.input(...)` (optional Zod schema) and `.query()`, `.mutation()`, or `.subscription()`.
- **Context** is injected via `createContext()` and passed to every procedure.

### Middleware
- Middleware wraps a procedure (or router) and can modify context, validate input, handle errors, or short-circuit.
- Commonly used: `trpcMiddleware`, `authMiddleware`, logging, timing.

### Client-side
- `createTRPCClient<AppRouter>()` or `createTRPCReact<AppRouter>()` generates a typed proxy.
- **Links** are composable transport layers: `httpLink`, `httpBatchLink`, `wsLink`, custom links.
- Client uses an internal "transformer" for serialization (e.g., `superjson`).

### Adapters
- Adapt servers to different runtimes/frameworks: standalone Node HTTP, Express, Fastify, Next.js, AWS Lambda, etc.
- Adapters are published as separate `@trpc/...` packages (e.g., `@trpc/express`, `@trpc/fastify`).

## Development Workflow

### Setup & Commands
```bash
pnpm install          # install all workspace dependencies
pnpm build            # build all packages (usually with `pnpm -r build`)
pnpm dev              # run dev mode for all packages (watch mode)
pnpm lint             # lint all packages
pnpm test             # run all unit & integration tests
pnpm test -- --coverage  # with coverage
```

### Running Individual Packages
From the root, you can run scripts for a specific package using pnpm filtering, e.g.:
```bash
pnpm --filter @trpc/server test
pnpm --filter @trpc/client build
```
Or enter the package directory: `cd packages/server` then `pnpm test`.

### Adding a New Package
1. Create folder under `packages/`
2. `package.json` must have "name" scoped to `@trpc/<name>`
3. Inherit TypeScript config: `"@trpc/config/tsconfig.json"` (or use project references)
4. Add `tsup.config.ts` if building with tsup
5. Update root `pnpm-workspace.yaml` (it uses globs, usually auto-included) and add to release workflow if necessary.

### Common Tasks
- **Add a new adapter**: Copy structure from existing adapter (e.g., `packages/express`), implement `createHTTPHandler` or equivalent, export types, add tests.
- **Fix a server bug**: Navigate to `packages/server/src`, understand router/procedure execution model. Core logic lives in `router.ts`, `procedure.ts`, `middleware.ts`, `internals/`.
- **Update client behavior**: Look at `packages/client/src`, especially link chain, `TRPCClientError`, and runtime proxy generation.
- **Documentation updates**: The `www/` folder contains Docusaurus markdown. Run `pnpm docs:dev` to preview.

### Important Files
- `packages/server/src/core/internals/` – core runtime logic (execution, procedure callstack).
- `packages/server/src/router.ts` – Router class implementation.
- `packages/client/src/internals/links.ts` – Link composition and execution.
- `packages/client/src/createTRPCUntypedClient.ts` – base untyped client creation.
- `packages/tests/` – end-to-end test suites that exercise combinations of adapters, links, and middleware.

## Testing

- Unit tests: co-located with source files as `*.test.ts`.
- Integration tests: `packages/tests/server/`, `packages/tests/client/`, etc. Run with `pnpm test`.
- Use `vitest` globals (`describe`, `it`, `expect`).
- Many server tests spin up an HTTP server on a random port (using `node:net`/`get-port`) and create a tRPC client to test end-to-end.
- Mocking is minimal; prefer actual server instances.

## Scripts & Automation

- `scripts/update-versions.ts` – bumps versions across all packages.
- `scripts/codegen.ts` – (if exists) used for generating client types from server.
- CI runs on GitHub Actions: lint, typecheck, build, test over multiple Node versions.

## Useful Commands (Quick Reference)

| Goal                          | Command                                                   |
|-------------------------------|-----------------------------------------------------------|
| Install dependencies           | `pnpm install`                                            |
| Build all packages            | `pnpm build` (or `pnpm -r build`)                         |
| Test a specific package       | `pnpm --filter @trpc/server test`                         |
| Run linter                    | `pnpm lint`                                               |
| Start docs locally            | `cd www && pnpm dev`                                      |
| Create new package            | copy existing adapter, update names, implement handler    |
| Bump versions                 | `pnpm run bump-all` (if available) or update manually     |

## Note for AI Agents

When working on changes:
- Use `pnpm` for all operations; do not use `npm` or `yarn`.
- Always run lint and tests after modifications.
- If adding new exports, update the package's `package.json` `exports` map and main entry.
- For runtime errors, examine the procedure execution trace (errors include `.cause` – often a `TRPCError`).
- Use `superjson` for Date/Map/Set serialization; transformers are standard across server and client.
- Adapters follow a consistent pattern: export a way to create a request handler (e.g., `createExpressMiddleware`), often by calling `resolveHTTPResponse` from `@trpc/server/http`.
