---
name: trpc
description: Skill for working with the tRPC monorepo (trpc/trpc). Provides guidance on development setup, testing, and contributing.
---

# tRPC Development Skill

This skill helps an AI coding agent contribute to the tRPC monorepo, a TypeScript library for building typesafe APIs.

## Prerequisites
- Node.js (v18+ recommended)
- pnpm (v8+)
- Git

## Setup
1. Clone the repo: `git clone https://github.com/trpc/trpc.git && cd trpc`
2. Install dependencies: `pnpm install`

## Monorepo Structure
- `packages/server` - Core server library (`@trpc/server`)
- `packages/client` - Vanilla client library (`@trpc/client`)
- `packages/react` - React bindings (`@trpc/react`)
- `packages/react-query` - React Query integration (`@trpc/react-query`)
- `packages/next` - Next.js Pages Router integration (`@trpc/next`)
- `packages/next/app-dir` - Next.js App Router integration (`@trpc/next/app-dir`)
- `packages/tests` - Integration and e2e tests
- `www` - Documentation website (Nextra-based)

## Common Development Commands (run at root)
- Build all packages: `pnpm build`
- Run tests across all packages: `pnpm test` (vitest)
- Run linting: `pnpm lint` (ESLint)
- Format code: `pnpm format` (Prettier)
- Start development mode: `pnpm dev` (starts Turbo with watch mode for all packages)
- Run tests for a specific package: `pnpm test --filter @trpc/server`
- Create a changeset: `pnpm changeset`

## Testing
- Tests use Vitest. Use `pnpm test` to run unit and integration tests.
- For package-specific tests: `pnpm test --filter <package-name>`
- e2e tests in `packages/tests` may require building first.
- Test files are co-located with source (`*.test.ts`) or in `__tests__` directories.

## Code Conventions
- TypeScript strict mode.
- Use functional components and hooks (no classes).
- Follow existing patterns for router definitions, procedure middlewares, etc.
- When implementing new features, update relevant packages and add tests accordingly.
- All exports should be properly re-exported.

## Typical Contribution Workflow
1. Create a branch.
2. Make changes (add/modify source code).
3. Add or update tests.
4. Run `pnpm lint` and `pnpm format`.
5. Run `pnpm test` to ensure all tests pass.
6. Create a changeset: `pnpm changeset` (if needed).
7. Commit and open a PR.

## Common Pitfalls
- Avoid breaking existing public APIs without proper handling (might require major version bump).
- Ensure cross-package references use workspace protocol (e.g., `"@trpc/server": "workspace:*"`) in package.json files.
- For React-related changes, test with both React 18 and 19 if relevant (though tRPC likely tests with a specific React version).
- Be mindful of bundle size concerns; avoid unnecessary dependencies.

## How to Run Documentation Website
- Navigate to `www`: `cd www`
- Install: `pnpm install` (if not already from root)
- Start dev server: `pnpm dev`
- The site runs on Next.js (Nextra).
