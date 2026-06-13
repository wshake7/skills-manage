# tRPC Monorepo Skill

## Overview
tRPC is an end-to-end typesafe RPC framework for TypeScript. This skill helps navigate and contribute to the official trpc/trpc GitHub monorepo, which contains the core packages, adapters, examples, and documentation site.

## Repository Structure
The monorepo is managed with pnpm workspaces and Turborepo.
- **`packages/`** – Core packages:
  - `server` – `@trpc/server`: router, procedure definitions, middleware.
  - `client` – `@trpc/client`: bare client with links (httpLink, wsLink, etc.).
  - `react-query` – `@trpc/react-query`: React bindings.
  - `next` – `@trpc/next`: Next.js integration.
  - `openapi` – `@trpc/openapi`: REST / OpenAPI compatibility.
  - `playground` – `@trpc/playground`: GraphiQL-style API explorer.
  - `observable` – shared Observable utility (used for subscriptions).
- **`examples/`** – Runable example apps (e.g., `.minimal`, `.next-prisma-starter`, `.fastify`).
- **`www/`** – Documentation site built with Docusaurus.
- **`scripts/`** – Internal build/release helpers.
- Root config files: `pnpm-workspace.yaml`, `turbo.json`, `.changeset/config.json`.

## Setup & Development
- **Prerequisites**: Node.js (LTS), pnpm (install via `npm i -g pnpm`).
- **Install dependencies**: `pnpm install`
- **Build all packages**: `pnpm build` (uses Turborepo).
- **Develop with watch mode**: `pnpm dev` (runs `turbo dev`).
- **Run all tests**: `pnpm test`
- **Lint**: `pnpm lint`; **Format**: `pnpm format` (often a pre-commit hook handles it).

## Common Workflows
- **Working on a single package**:
  ```bash
  cd packages/server
  pnpm test          # run tests for server package
  pnpm dev           # build in watch mode (if configured)
  ```
- **Run a specific test file**: `pnpm vitest run path/to/test` (vitest is the test runner).
- **View docs locally**: `cd www && pnpm dev` → opens Docusaurus site.
- **Start an example**: Navigate to an example folder and follow its README (usually `pnpm dev`).

## Contributing
- All code contributions must follow the [Contributing Guide](CONTRIBUTING.md).
- Use **conventional commits** (e.g., `feat(server): add new procedure`).
- Create a **changeset** before pushing: `pnpm changeset` (in root). This generates a markdown file in `.changeset/` that drives the release process.
- CI runs lint, type checks, tests, and build on each PR.
- Ensure new functions/classes have proper TSDoc comments for auto-generated docs.

## Key Architectural Concepts
- **Router** – collection of procedures; builds the API surface.
- **Procedure** – a query, mutation, or subscription defined with `.input()` and `.query()/.mutation()/.subscription()`.
- **Middleware** – reusable logic that runs before a procedure (e.g., auth, logging).
- **Context** – per-request metadata (e.g., user session, db connection) created by `createContext`.
- **Links** – client-side pipeline for request handling (httpLink, wsLink, loggerLink, etc.).

## Testing Tips
- Vitest is used throughout; mocks can be created with `vi.mock()`.
- For server procedures, use `createCallerFactory` to invoke them without HTTP.
- Common test patterns: use `@trpc/server` internals like `callProcedure` or snapshot testing with Zod schemas.

## Useful Files
- Root `package.json` – top-level scripts.
- `turbo.json` – pipeline definitions.
- `packages/server/src/core` – core router/procedure logic.
- `packages/server/src/adapters` – HTTP adapters (standalone, fetch, fastify, express, etc.).
- `packages/client/src/links` – built-in links.

## Notes
- The repo actively moves to ESM; be mindful of import/export conditions.
- Extensive use of generics and type inference; keep types strict.
- When adding a new adapter, follow patterns in existing adapter packages.

For detailed API usage, refer to the official documentation at https://trpc.io.
