# tRPC Monorepo Skill

This skill helps an AI coding agent work effectively in the [tRPC monorepo](https://github.com/trpc/trpc).

## Overview

tRPC is a TypeScript Remote Procedure Call framework. The repository is a monorepo managed with **Turborepo**, **Yarn workspaces**, and **Changesets** for versioning.

## Common Workflows

### Setup
```bash
yarn install
```

### Build
All packages:
```bash
yarn turbo build
```

Single package:
```bash
yarn workspace @trpc/server build
```

### Test
All tests (unit, integration):
```bash
yarn turbo test
```

Single package tests:
```bash
yarn workspace @trpc/react-query test
```

Run a filtered test file:
```bash
yarn workspace @trpc/server test -- path/to/test.test.ts
```

### Lint & Format
```bash
yarn lint
yarn format-check   # or yarn format to auto-fix
```

### Adding Changesets
After functional changes, generate a changeset:
```bash
yarn changeset
```
Select affected packages and describe the change (semver level).

## Repository Structure

- **`packages/`** – All npm packages (server, client, react-query, next, etc.)
- **`www/`** – Documentation website (Next.js)
- **`examples/`** – Runnable example apps
- **`scripts/`** – Build and utility scripts
- **`turbo.json`** – Turborepo pipeline definition
- **`package.json`** – Root workspace config with Yarn workspaces

## Key Packages

| Package | Role |
|---------|------|
| `@trpc/server` | Routers, procedures, middleware |
| `@trpc/client` | Client invoker, links (http, ws, etc.) |
| `@trpc/react-query` | React integration using TanStack Query |
| `@trpc/next` | Pages Router integration |
| `@trpc/next-13` | App Router integration (experimental) |
| `@trpc/playground` | GraphiQL-like tool |

## Code Conventions

- **TypeScript** in strict mode, ESM modules.
- **Vitest** for testing; tests live in `__tests__` folders and use `.test.ts` extension.
- Formatting: **Prettier**, linting: **ESLint**.
- Public API is defined via `exports` in `package.json`; be deliberate about exported symbols.
- Use `TypeDoc` annotations for public APIs.

## Build System Notes

- The monorepo uses **Turborepo** pipelines defined in `turbo.json`. Most tasks (build, test, lint) are run through `turbo` for caching and dependency ordering.
- Inter-package dependencies managed by Yarn workspaces with `references` in `tsconfig.json` for incremental builds.

## Testing & CI

- CI runs `turbo build test lint` and enforces prettier/ESLint.
- Changeset action automates versioning PRs.
- Use `vitest` interactive mode or `vitest --reporter=verbose` for detailed output.

## Quick Reference for Contributing Commands

```bash
# Start fresh
yarn install
# Make sure everything compiles
yarn turbo build
# Run all checks
yarn turbo test lint format-check
# Add a changeset for your PR
yarn changeset
```

When in doubt, look at how existing packages structure their tests and exports.