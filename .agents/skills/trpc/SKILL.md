# tRPC Monorepo Skill

This skill helps an AI coding agent navigate, develop, and contribute to the [tRPC](https://github.com/trpc/trpc) repository.

## Overview

tRPC is a TypeScript library for building end-to-end type-safe APIs. The repository is a monorepo managed with pnpm workspaces and Turborepo. Packages are published under the `@trpc` scope.

## Development Setup

- **Prerequisites:** Node.js >= 18, pnpm.
- **Install:** `pnpm install`
- **Build all packages:** `pnpm build`
- **Watch mode:** `pnpm dev` (rebuilds on change)

## Essential Commands

| Command              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `pnpm test`          | Run all tests (unit + e2e)                     |
| `pnpm test:unit`     | Unit tests only (vitest)                       |
| `pnpm test:e2e`      | End-to-end tests (Playwright)                  |
| `pnpm lint`          | Lint all packages (ESLint)                     |
| `pnpm typecheck`     | TypeScript type checking across packages       |
| `pnpm format`        | Format code with Prettier                      |
| `pnpm clean`         | Remove build artifacts                         |
| `pnpm changeset`     | Create a changeset for versioning              |

## Repository Structure

```
packages/
  server/          # Core server: initTRPC, router, procedure builders
  client/          # Vanilla fetch-based client
  react-query/     # React Query bindings (hooks, provider)
  next/            # Next.js adapter & app-dir support
  express/         # Express.js adapter
  fastify/         # Fastify adapter
  aws-lambda/      # AWS Lambda adapter
  tests/           # Shared e2e test infrastructure & common test utils
www/               # Documentation website (Nextra)
examples/          # Example projects (kitchen sink, minimal, etc.)
tooling/           # Code generators, internal scripts
```

## Key Concepts (Library Use)

- **Procedure:** Endpoint defined with `.query()`, `.mutation()`, or `.subscription()`. Input validation typically uses Zod.
- **Router:** Groups procedures and allows merging of sub-routers.
- **Context:** Per-request state passed to all procedures (e.g., user session, DB).
- **Transformer:** Superjson by default for serialization, customizable.
- **Middleware:** Functions that wrap procedures for auth, logging, etc.

## Contribution Workflow

1. **Fork & branch:** Create a branch from `main` (`feat/my-feature`).
2. **Develop:** Implement changes, add/update tests.
3. **Verify:** Run `pnpm test`, `pnpm lint`, `pnpm typecheck`.
4. **Changeset:** If publishing a package update, run `pnpm changeset` and follow prompts.
5. **Commit:** Use conventional commits (e.g., `feat(server): add ...`).
6. **PR:** Open a pull request with a clear description.

## Writing Tests

- **Unit tests:** Place `.test.ts` files next to source code; use vitest (`describe`, `it`, `expect`).
- **E2E tests:** Located in `packages/tests/`. Use Playwright for full-stack integration scenarios. Ensure the test app starts before running.
- **Common test utilities:** Shared mocks and helpers available in `packages/tests/src/shared/`.

## Adding a New Package

1. Create folder under `packages/` with its own `package.json`, `tsconfig.json`.
2. Add it to the workspace in root `pnpm-workspace.yaml`.
3. If it’s an adapter, reference existing adapters (e.g., `express`) as patterns.
4. Add relevant scripts (build, test) consistent with other packages.
5. Ensure it is built and tested via Turbo pipeline.

## Tips for AI Agents

- When modifying a core package, check for cross-package impacts (e.g., changes to `@trpc/server` may require updates in client and adapters).
- Run `pnpm dev` in the background for fast feedback during development.
- Use `pnpm --filter <package-name> <command>` to scope operations to a single package.
- The `www` folder is the documentation site; changes there require a separate review for docs.
- Search existing issues/PRs before implementing large features.