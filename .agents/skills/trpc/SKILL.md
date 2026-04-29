# tRPC Skill for AI Coding Agents

## Overview
tRPC is a TypeScript framework for building end-to-end typesafe APIs. It uses a single source of truth for types via Zod or custom validation, enabling automatic type inference on the client. The repository is a monorepo managed with pnpm and Turborepo.

## Key Packages
- `packages/server` - Core server library (`@trpc/server`). Contains router creation, procedure builders, middleware system.
- `packages/client` - Vanilla client (`@trpc/client`). Links, transformers, subscription support.
- `packages/next` - Next.js integration (`@trpc/next`). App Router and Pages Router adapters.
- `packages/react-query` - React Query bindings (`@trpc/react-query`). Hooks for queries, mutations, subscriptions.
- `packages/playground` - A visual API explorer (`@trpc/playground`).
- `packages/tests` - E2E test suites across adapters.

## Repository Structure
- Root is a pnpm workspace. `pnpm-workspace.yaml` defines packages.
- `scripts` - Code generation, release scripts.
- `examples` - Various integration examples (Express, Next.js, standalone, etc.).
- `www` - Documentation website (Docusaurus).

## Development Workflow
1. **Setup**: `pnpm install` at root.
2. **Build**: `pnpm build` compiles all packages. Use `pnpm dev` for watch mode.
3. **Testing**: 
   - Unit tests: `pnpm test` (Jest).
   - E2E tests: `cd packages/tests && pnpm test:e2e` (may require building).
4. **Linting**: `pnpm lint` (ESLint + Prettier).
5. **Adding a new package**: Create folder under `packages/`, add `package.json`, ensure `tsconfig.json` extends root, update `pnpm-workspace.yaml` if needed.
6. **Making changes**: Always run `pnpm build` before submitting PRs. The CI checks build, lint, and test.

## Core Concepts
- **Router**: Defines a set of procedures. Use `initTRPC` to create a router builder.
- **Procedure**: A function with an input parser (e.g., Zod schema) and a resolver. Created via `t.procedure.input(...).query/mutation/subscription(...)`.
- **Context**: Request-scoped data (e.g., user session). Created per request via a function passed to `createContext` in adapters.
- **Middleware**: Reusable logic that runs before resolver. Used for authentication, logging, etc.
- **Client**: Created with `createTRPCClient` or `createTRPCReact` for React. Links handle serialization and transport.

## Common Patterns
- **Protecting procedures**: Use a middleware that checks `ctx.user` and throws `TRPCError` if unauthorized.
- **Transformers**: Use `superjson` for preserving Date, Map, Set, etc. Wire via `transformer` option in both server and client.
- **Adapters**: Each platform (Express, Fastify, Next.js, etc.) has a dedicated adapter in `@trpc/server/adapters/*`.
- **SSR with Next.js**: Use `createServerSideHelpers` to prefetch queries on the server.

## Contribution Guidelines
- All new features should have tests.
- Breaking changes must be discussed in an issue first.
- Doc updates in `www` should accompany API changes.
- Use `changeset` to document changes: `pnpm changeset`.
- PRs are merged via squash.

## Useful Commands
- `pnpm build` - build all packages
- `pnpm --filter @trpc/server test` - test a specific package
- `pnpm lint --fix` - auto-fix lint errors
- `pnpm changeset` - create a changeset

When working with this repo, always consider the inter-package dependencies and ensure type consistency across client and server.