# tRPC (trpc/trpc) Developer Skill

## Overview

tRPC is a TypeScript framework for building end-to-end typesafe APIs. The repository is a **pnpm monorepo** using **Turborepo** for task orchestration. It contains the core packages (`@trpc/server`, `@trpc/client`), integrations (Next.js, React Query, React, etc.), documentation, and examples.

## Repository Structure

```text
.
├── packages/           # Core and integration packages
│   ├── server          # @trpc/server
│   ├── client          # @trpc/client
│   ├── next            # Next.js adapter
│   ├── react-query     # @trpc/react-query
│   ├── react           # @trpc/react
│   └── ...             # Other adapters/plugins
├── examples/           # Working example projects
├── www/                # Documentation site (Docusaurus) 
├── tests/              # End-to-end integration tests
├── .changeset/         # Changeset configuration for versioning
├── turbo.json          # Turborepo pipeline configuration
└── package.json        # Root workspace definition
```

## Common Commands

All commands are run from the repository root unless specified.

- **Install dependencies**: `pnpm install`
- **Build all packages**: `pnpm build` (runs `turbo run build`)
- **Run all tests**: `pnpm test` (runs `turbo run test` – mostly vitest)
- **Lint code**: `pnpm lint` (ESLint across the workspace)
- **Type-check**: `pnpm lint:types` (runs `tsc --noEmit` for all packages)
- **Generate a changeset**: `pnpm changeset` (interactive wizard)
- **Start the docs website**: `cd www && pnpm start`
- **Run a single package's tests**: `pnpm test --filter @trpc/server` (or any package name)

## Key Development Concepts

### Procedure Definition
Procedures (queries, mutations, subscriptions) are the building blocks. They are defined on a router using `.input()` for validation and `.query()` / `.mutation()`:

```typescript
// packages/server/src/router.ts (example structure)
import { t } from './trpc';
import { z } from 'zod';

export const appRouter = t.router({
  greet: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello ${input.name}`),
});
```

### End-to-End Type Safety
The full router type is exported (`AppRouter`) and used on the client side, providing auto-completion and type checking on every procedure call without code generation.

### Testing
- **Unit/Integration tests**: Use `createCallerFactory` from `@trpc/server` to test procedures without an HTTP server.
- **Client-side tests**: For React Query hooks, mock the tRPC client using `createTRPCReact` helpers and `createTRPCProxyClient`.
- Test files follow the convention `*.test.ts` and use **vitest** (global `describe`, `it`).
- Mocking context: Create a test context with mocked databases or services.

### Workspace Internals
- Packages reference each other via TypeScript path aliases configured in root `tsconfig.json`. Ensure you run `pnpm build` after making cross-package changes to generate updated `dist` outputs.
- The docs site in `www/` is built with Docusaurus. Changes to the documentation are versioned as well (usually via changesets for `@trpc/www`).

## Contributing

1. **Create a feature branch** from `main`.
2. Make your changes and add **tests** if applicable.
3. Run the full validation suite: `pnpm lint && pnpm lint:types && pnpm test && pnpm build`.
4. Generate a changeset: `pnpm changeset` – describe your changes following semver (major/minor/patch).
5. Push and open a pull request. Follow any PR templates.
6. Use **conventional commits** (e.g., `fix:`, `feat:`, `docs:`) to keep history clean.

**Note:** The repository uses automatic releases via GitHub Actions when changesets are merged.

Use this skill to navigate the monorepo efficiently, understand the build process, and contribute effectively to the tRPC ecosystem.