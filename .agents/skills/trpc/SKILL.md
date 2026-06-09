# tRPC Skill

This skill provides guidance for working with the [tRPC](https://github.com/trpc/trpc) repository and technology. tRPC is a TypeScript-first RPC framework enabling end-to-end type safety without code generation.

## Repository Structure

The monorepo uses Yarn workspaces and is managed with Turborepo.

- `packages/` – core packages:
  - `packages/server` – `@trpc/server` – server-side router, procedure definitions, middleware, context.
  - `packages/client` – `@trpc/client` – HTTP/WebSocket links, transformer support.
  - `packages/react` – `@trpc/react` – React hooks and utilities.
  - `packages/next` – `@trpc/next` – Next.js integrations.
  - `packages/tests` – integration tests.
  - Adapters: `packages/*` may include Express, Fastify, etc.
- `examples/` – minimal working apps.
- `www/` – documentation website (Docusaurus).
- `scripts/` – build and release tooling.

## Key Concepts

- **Router**: a tree of procedures (queries, mutations, subscriptions).
- **Procedure**: an endpoint defined with `.input()`, `.query()`, `.mutation()`, or `.subscription()`. Uses Zod or other validators.
- **Context**: per-request state (e.g., user authentication) created by a user-provided `createContext()` function.
- **Middleware**: reusable logic that can modify context, validate input, or short-circuit.
- **Transformer**: serialization layer (e.g., `superjson`) for preserving types like Date/Map across the wire.
- **Links**: composable client transport layers (HTTP, WebSocket, logger).

## Development Workflow

### Setup
```bash
git clone https://github.com/trpc/trpc.git
cd trpc
yarn
yarn build
```

Common commands:

- `yarn lint` – run ESLint across the monorepo.
- `yarn test` – run all tests (vitest).
- `yarn build` – build all packages.
- `yarn dev` – watch mode for development.
- `yarn typecheck` – TypeScript compilation check.
- Run a single package’s tests with `yarn workspace @trpc/<package> test`.

### Adding a New Feature or Fix
1. Branch from `main`.
2. Implement changes in the relevant package(s).
3. Add/update unit tests and integration tests in `packages/tests` if needed.
4. Validate with `yarn lint`, `yarn typecheck`, and `yarn test`.
5. Update documentation (website) if the change affects public API.
6. Create a changeset by running `yarn changeset` (uses Changesets for versioning).

### Testing Philosophy
- Unit tests in each package under `packages/<pkg>/tests`.
- Integration tests in `packages/tests` run against reference servers.
- Use `@trpc/client` and `@trpc/server` together to simulate full round-trips.
- Test middlewares, context creation, error handling, subscription lifecycles.

### Code Conventions
- Strict TypeScript with no `any` unless absolutely necessary.
- Use `zod` for input validation in tests unless testing custom validators.
- Export public API from package `index.ts` files; internal utilities go under `src`.
- For React: follow hooks patterns, use `useMemo` for stable references.

## PR Checklist for Agent
- TypeScript compiles strictly (`tsc --noEmit` passes).
- Linting passes (`eslint`).
- Unit and integration tests pass.
- API changes have updated website documentation (in `www/`).
- If introducing a new package, ensure it’s added to the Turborepo pipeline and workspace config.
- Include a changeset via `yarn changeset` for version tracking.

## Useful Patterns

When debugging client-server interaction:
- Enable the `loggerLink` on the client to see all requests/responses.
- Set the `-s` flag on the server for subscription debugging.
- Use `trpc-playground` for interactive API exploration (if added).

When extending the framework:
- Refer to the middleware implementation in `packages/server/src/middleware.ts`.
- Look at how adapters (Fastify, Express) integrate with the core HTTP handler.

## Example: Creating a New Procedure Type (e.g., a `file` upload)
1. Define a new procedure method in `packages/server/src/internals/procedureBuilder.ts`.
2. Implement a custom link in `packages/client/src` to handle the upload.
3. Add integration tests in `packages/tests` that spin up a server and test the upload flow.
4. Expose the API from `packages/server` and `packages/client` entry points.

## Notes
- The repository uses Changesets for versioning and publishes to npm on merges to `main`.
- The project adheres to Semantic Versioning.
- For any public API change, update the documentation website located in `www/`.
- The CI runs on GitHub Actions; configurations are in `.github/workflows/`.

Use this skill to efficiently navigate, understand, and contribute to the tRPC codebase.