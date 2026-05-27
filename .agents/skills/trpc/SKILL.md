# tRPC Skill

## Overview
tRPC is a typed RPC framework for building end-to-end typesafe APIs. This monorepo contains the core client/server, adapters, React integration, and supporting packages.

## Repository Structure
- **`packages/`** – All published npm packages (server, client, react-query, next, openapi, etc.)
- **`examples/`** – Example projects demonstrating various setups (Next.js, Express, standalone, etc.)
- **`www/`** – Documentation website (Docusaurus)
- **`scripts/`** – Build & release tooling
- **`pnpm-workspace.yaml`** – Workspace definition (pnpm + changesets)
- **`turbo.json`** – Turborepo configuration
- **`.github/`** – CI/CD workflows

## Key Packages
| Package | Purpose |
|---------|---------|
| `@trpc/server` | Core server‑side router, procedure definitions, middleware |
| `@trpc/client` | Client‑side proxy to call procedures |
| `@trpc/react-query` | React integration with react-query hooks |
| `@trpc/next` | Next.js adapter (pages and app router) |
| `@trpc/express`, `@trpc/fastify` | Adapters for Express/Fastify |
| `@trpc/openapi` | OpenAPI specification generation and REST fallback |

## Development Setup
- **Package manager:** pnpm
- **Build system:** turborepo
- **Testing framework:** vitest (configured in `vitest.config.ts`)
- **Prerequisites:** Node.js 18+, pnpm

```bash
# Install dependencies and link local packages
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Run tests for a single package (filter)
pnpm --filter @trpc/server test

# Lint & typecheck
pnpm lint
pnpm typecheck
```

## Common Workflows

### Adding a feature to a package
1. Identify the target package (e.g., `packages/server`).
2. Read its `README.md` and source structure (usually `src/` with an `index.ts`).
3. Write implementation + tests (co‑located with source or in `__tests__`).
4. Ensure tests pass: `pnpm --filter <package> test`.
5. If the feature affects public API, use changesets (`pnpm changeset`) to describe the change.

### Debugging a problem across packages
- The repo uses TypeScript project references; **start by building once** (`pnpm build`) to generate references.
- You can rely on the IDE’s ability to navigate from a client call into server types.
- Check the `examples/` directory for a minimal reproduction case.

### Understanding type inference
- Core type magic lives in `@trpc/server` under `/src/shared`, `/src/internals`, and the router builder (`/src/router.ts`).
- Client proxy is in `@trpc/client` (`/src/createTRPCClient.ts`).
- React integration wraps `createTRPCClient` and injects query client – see `packages/react-query/src/createHooksInternal.tsx`.

## Testing Philosophy
- **Unit tests:** Use vitest in each package. Mocking is minimal; favor integration tests.
- **E2E tests:** Some packages (e.g., `next`, `openapi`) have dedicated test apps in `packages/tests` or `examples/`.
- **Type tests:** `expect-type` and `tsd` are used to verify type safety.

## Versioning & Releases
- The repo uses **changesets** to manage version bumps and changelogs.
- Each PR that affects a public package should include a changeset via `pnpm changeset`.
- Releases are orchestrated by CI (`.github/workflows/release.yml`).

## Useful Commands (quick reference)
```bash
pnpm dev --filter @trpc/server       # watch mode + build on change
pnpm test -- --coverage              # run tests with coverage
pnpm lint -- --fix                   # auto‑fix lint issues
pnpm format                          # run prettier
```

## Important Files
- `CONTRIBUTING.md` – guidelines for contributors
- `CODE_OF_CONDUCT.md`
- `pnpm-workspace.yaml` – workspace definition
- `turbo.json` – pipeline definition for build/lint/test
- Each package’s `package.json` contains its own scripts, dependencies, and entry points.

---
*Use this skill to navigate the monorepo, run build/test commands, and contribute effectively.*