# tRPC Repository Skill

## Overview
tRPC is an end-to-end typesafe RPC framework for TypeScript. This skill provides concise, actionable guidance for AI coding agents working with the [tRPC monorepo](https://github.com/trpc/trpc).

## Repository Structure
- **Monorepo**: pnpm workspaces with Turborepo orchestration.
- **Key packages**:
  - `packages/server`: Core server implementation, including routers, procedures, middleware, and context.
  - `packages/client`: Type-safe client for browser/Node.js.
  - `packages/react-query`: React hooks integration.
  - `packages/next`: Next.js adapter.
  - `packages/adapters/*`: Standalone adapters (e.g., standalone, fetch, fastify, express, lambda).
  - `packages/tests`: End-to-end integration tests.
- **Examples**: `examples/` directory, each a standalone project demonstrating specific integrations (Next.js, Express, Fastify, etc.).
- **Website/documentation**: `www/` contains the Docusaurus site.

## Development Prerequisites
- Node.js 18+
- pnpm 9+ (see `.npmrc` and `packageManager` field in root `package.json`)

## Common Commands
| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Build all packages | `pnpm build` |
| Build and watch (development) | `pnpm dev` |
| Run all tests | `pnpm test` |
| Run tests for a specific package | `pnpm test --filter @trpc/server` |
| Run type checking | `pnpm typecheck` (uses Turborepo) |
| Lint code | `pnpm lint` |
| Format code | `pnpm format` |
| Run a single package’s dev mode | `pnpm --filter @trpc/server dev` |

## Adding a New Package or Example
- Use the built-in generator script: `pnpm generatePackage` (if available) or copy the structure from an existing package under `packages/`.
- Ensure the new package is listed in `pnpm-workspace.yaml` and has proper `tsconfig.json` and build scripts (usually `tsup`).
- For examples, follow the pattern in `examples/` and add a test in `packages/tests` if needed.

## Key Files for Common Modifications
- **Add a new middleware**: see `packages/server/src/middleware.ts` and existing tests in `packages/server/src/__tests__/middleware.test.ts`.
- **Modify router or procedure logic**: `packages/server/src/router.ts`, `packages/server/src/procedure.ts`.
- **Add an adapter**: create a new package under `packages/adapters/` implementing the adapter interface (`packages/server/src/adapters/`).
- **Client changes**: look at `packages/client/src/`.
- **React hooks**: `packages/react-query/src/`.
- **Type definitions**: central types reside in `packages/server/src/shared.ts` or individual package types.

## Testing
- Framework: [Vitest](https://vitest.dev). Config usually at package level (`vitest.config.ts`).
- Root-level test orchestration via Turborepo: `turbo run test`.
- E2E tests: `packages/tests/` runs integration tests against various adapters and examples.
- For debugging, use `pnpm test -- <pattern>` after `--filter` or add `-- --reporter=verbose`.

## Linting & Formatting
- ESLint: config in `.eslintrc.cjs`. Run `pnpm lint` to check, `pnpm lint --fix` to auto-fix.
- Prettier: config in `.prettierrc`. Run `pnpm format` to format.

## Contributing Workflow
1. Fork the repository and create a feature branch.
2. Make changes and add tests.
3. Run `pnpm typecheck`, `pnpm lint`, `pnpm test` to verify.
4. If you modified a public API, consider updating documentation in `www/` or inline TSDoc comments.
5. Commit using conventional commits (e.g., `feat(server): add new middleware`).
6. Open a pull request; CI will run all checks automatically.

## Important Notes
- Do not commit the `pnpm-lock.yaml` unless you intentionally updated dependencies.
- When changing core packages, build them before running tests in dependent packages.
- Use `changeset` for versioning if preparing a release (but typical contributions don’t require it).
- For large refactors, consult the `CONTRIBUTING.md` in the repository root.