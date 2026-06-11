# tRPC Monorepo Skill

tRPC is a full-stack TypeScript framework for building end-to-end typesafe APIs. This skill helps navigate and contribute to the [trpc/trpc](https://github.com/trpc/trpc) monorepo.

## Quick Start

```bash
git clone https://github.com/trpc/trpc.git
cd trpc
pnpm install
pnpm build
```

## Repository Structure

The monorepo uses **pnpm workspaces** and **Turborepo**.

- **`/packages`** – Main packages:
  - `server` – Core tRPC server implementation
  - `client` – Vanilla JS client
  - `next` – Next.js integration (`app` and `pages`)
  - `react` – React hooks (`@trpc/react-query`)
  - `react-query` – React Query wrapper
  - `next` – Next.js adapter
  - `express`, `fastify`, etc. – Server adapters
- **`/examples`** – Runnable examples demonstrating different setups
- **`/www`** – Documentation site (Docusaurus)
- **`/scripts`** – Shared build and utility scripts

Key configuration:
- `pnpm-workspace.yaml` – workspace definition
- `turbo.json` – pipeline tasks
- `tsconfig.json` – shared TypeScript base config

## Development Workflow

- **Package manager:** pnpm only (no npm/yarn).
- **Build all packages:** `pnpm build` (uses Turbo)
- **Start development:** `pnpm dev` (watches and rebuilds on changes)
- **Lint:** `pnpm lint` (ESLint + Prettier)
- **Type check:** `pnpm type-check` (or `turbo type-check`)
- **Test:** `pnpm test` (runs Vitest across packages)
- **Run single package tests:** `pnpm --filter @trpc/server test`
- **Generate types:** `pnpm codegen` (where applicable, e.g., for protobuf?)
- **Clean:** `pnpm clean`

All tasks are scripted in `turbo.json` and `package.json` scripts. Use `turbo <task>` to run across packages.

## Testing

- Framework: **Vitest** (with `@testing-library/react` for React packages)
- Tests live beside source files with `*.test.ts` or `*.test.tsx`.
- Use `vitest` directives and mocks; coverage via `c8` or `istanbul`.
- Run all tests: `pnpm test`; watch mode: `pnpm test -- --watch`

## Contributing

- **Branching:** Create feature branches from `main`.
- **Commits:** Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- **Changesets:** Use `pnpm changeset` to document changes; PRs without a changeset may be rejected if they affect packages.
- **Versioning:** Packages follow semantic versioning; the release workflow is managed by Changesets bot.
- **PR checks:** CI runs linting, type checking, tests, and builds on every PR.

## Adding a New Feature or Package

1. Familiarize yourself with the existing architecture.
2. If adding a new adapter (e.g., `@trpc/koa`), create a new package under `/packages` with the following structure:
   - `src/` – source code
   - `package.json` – name, dependencies, scripts
   - `tsconfig.json` – extending base config
   - `README.md` – minimal docs
3. Add the package to `pnpm-workspace.yaml` and `turbo.json` build pipeline.
4. Write tests following existing patterns.
5. Add a changeset with `pnpm changeset`.
6. Ensure the example in `/examples` uses or demonstrates the new feature.

## Common Patterns

- **Type inference:** tRPC heavily uses generics and conditional types. Keep the `Router` definitions clean; use `t.procedure` chaining.
- **Middlewares:** Use `.use()` for context enrichment, logging, etc.
- **Server adapters:** They all implement a similar interface (`resolveHTTPResponse`). Look at `@trpc/server/src/http` for base utilities.
- **Testing procedures:** Use `createCallerFactory` to test procedures without HTTP.
- **React hooks:** Wrapped in `createTRPCReact`; context must be provided via `TRPCProvider`.

## Useful Commands

```bash
# Run examples
cd examples/next-prisma-starter
pnpm dev

# Build and serve docs
pnpm --filter www dev

# Lint a specific package
pnpm --filter @trpc/server lint

# Format all code
pnpm format

# Run CI steps locally (lint + type-check + test + build)
pnpm ci
```

## Notes

- The repo uses **TypeScript strict mode**.
- All packages are **ESM** (type: module) with `exports` map.
- Git hooks via `simple-git-hooks`; pre-commit runs lint-staged.
- CI is GitHub Actions (`.github/workflows`).
- Documentation is powered by Docusaurus with MDX; edit docs in `/www/docs`.
