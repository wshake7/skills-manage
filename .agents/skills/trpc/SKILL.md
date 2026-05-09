# tRPC Repository Skill

## Overview
[tRPC](https://github.com/trpc/trpc) is a TypeScript RPC framework enabling end-to-end typesafe APIs. The monorepo includes core packages, adapters, and plugins.

## Project Structure
- `packages/server` – Core server-side logic, middleware, context.
- `packages/client` – Proxy‑based client for type‑safe calls.
- `packages/react-query` – React Query integration.
- `packages/next` – Next.js adapter.
- `packages/*` – Other adapters (Express, Fastify, etc.) and utilities.
- `www/` – Documentation website.
- `examples/` – Example projects.
- `scripts/` – Build and CI helpers.

## Development Setup
- Use `pnpm` as package manager.
- Install dependencies: `pnpm install`
- Build all packages: `pnpm build` (uses TurboRepo).
- Run all tests: `pnpm test` (likely vitest).
- Lint: `pnpm lint` (ESLint + Prettier).
- Start docs dev: `cd www && pnpm dev`

## Common Workflows
### Adding a New Feature or Fixing a Bug
1. Create a branch from `main`.
2. Make changes in relevant packages.
3. Add tests: unit tests go in `__tests__/` folders or co‑located. Use vitest.
4. Run `pnpm build` to verify types and build.
5. Run `pnpm test` to ensure nothing breaks.
6. Update docs if necessary: edit `www/docs/` and run `pnpm docs` to check.
7. Open a PR following the template.

### Testing Focus
- Core server/client tests are in `packages/server` and `packages/client`.
- Integration tests are in `packages/tests` (if present).
- To run a single package’s tests: `cd packages/<name> && pnpm test`.
- End‑to‑end tests may exist in `examples/`.

## Key Concepts
- **Router**: Defines API endpoints (procedures) with `.query()`, `.mutation()`, `.subscription()`.
- **Procedure**: Single endpoint with validated input (via Zod/Yup) and output.
- **Context**: Per‑request data (e.g., auth) created by a function and passed to each procedure.
- **Middleware**: Functions that wrap procedure execution for logging, auth, etc.
- **Type Safety**: The client infers types from the server router type.

## Contribution Tips
- Maintain type safety across packages – any router change must still produce correct client types.
- Adapters must conform to the HTTP‑agnostic core: use the `@trpc/server` request handler interface.
- When modifying core packages, check all adapters (e.g., Express, Fastify) to verify they still work.
- Re‑export types carefully; use `export type` for type‑only imports.
- Ensure backwards compatibility or explain breaking changes in PR description.

## Documentation
- Primary docs: https://trpc.io/docs
- Edit docs in `www/docs/`. The website is a Next.js project with MDX content.
- After editing docs, run `pnpm run www:dev` to preview.

## Resources
- GitHub Issues: https://github.com/trpc/trpc/issues
- Discord community for discussions.
