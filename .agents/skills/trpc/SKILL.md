# tRPC Development Skill

## Overview
tRPC is a library for building end-to-end typesafe APIs in TypeScript. It allows you to define procedures on a server and call them from a client with full type safety, without code generation. This skill helps you work effectively on the tRPC monorepo and with tRPC-based projects.

## Repository
- **Monorepo**: Uses pnpm workspaces and Turborepo for orchestration.
- **Package manager**: pnpm (enforced via `packageManager` in `package.json`).
- **Node version**: Use the version specified in `.nvmrc` (currently 18+).

## Key Packages
| Package | Path | Description |
|---------|------|-------------|
| `@trpc/server` | `packages/server` | Core server-side router, procedure definitions, middleware, and context. |
| `@trpc/client` | `packages/client` | Client-side proxy for calling procedures over HTTP/WS. |
| `@trpc/react-query` | `packages/react-query` | React Query bindings for tRPC. |
| `@trpc/next` | `packages/next` | Next.js integration (app & pages router). |
| `@trpc/playground` | `packages/playground` | GraphiQL-like playground for tRPC endpoints. |
| `@trpc/next-13` | (deprecated) | Old Next.js 13 (pages) integration. |

## Development Setup
```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm dev              # Watch mode for all packages (useful for development)
pnpm test             # Run all unit and integration tests
pnpm lint             # Lint project
pnpm typecheck        # Run TypeScript type checks across packages
pnpm format           # Format code with Prettier
```

## Common Workflows

### Adding a New Procedure
1. In a `@trpc/server` router file, define a new procedure using `.query()`, `.mutation()`, or `.subscription()`.
   ```ts
   import { z } from 'zod';
   export const userRouter = router({
     getById: publicProcedure
       .input(z.object({ id: z.string() }))
       .query(async ({ input, ctx }) => {
         // logic
       }),
   });
   ```
2. Ensure types propagate: the client can import the router type via `inferRouterInputs`, `inferRouterOutputs`, etc.
3. If middleware is needed, create a reusable middleware with `.use()`.

### Writing Middleware
```ts
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const user = await authenticate(ctx.req);
  return next({
    ctx: { user },
  });
});
const protectedProcedure = t.procedure.use(authMiddleware);
```

### Testing
- Tests are located alongside source files as `*.test.ts` (vitest).
- Use `pnpm test` to run all tests; use `pnpm test <pattern>` for targeted runs.
- E2E tests (playwright) are in `examples/` and triggered via CI.

### Client Setup
- Import the router type from your API:
  ```ts
  import type { AppRouter } from '../server/router';
  import { createTRPCClient, httpBatchLink } from '@trpc/client';
  const client = createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: '/api/trpc' })],
  });
  const user = await client.user.getById.query({ id: '1' });
  ```
- For React, use `trpc.createClient` with `@tanstack/react-query` and provide via `TRPCProvider`.

## Code Style & Conventions
- **TypeScript** strict mode; prefer explicit generics, avoid `any`.
- **ESLint** with @typescript-eslint rules; lint staged commits.
- **Prettier** for formatting; configuration in root.
- **File naming**: `kebab-case` for modules, `*.test.ts` for tests.
- **Exports**: Use named exports; avoid default exports except in specific integrations.

## Changelog & Versioning
- The project uses [changesets](https://github.com/changesets/changesets) for versioning and changelog generation.
- Run `pnpm changeset` to create a changeset entry for your changes.

## Contributing
- PRs must have a clear description, link to an issue, and changeset if applicable.
- Ensure tests pass (`pnpm test`) and types are correct (`pnpm typecheck`).
- New features should include documentation in `www/` and examples in `examples/`.

## Useful Resources
- [tRPC Docs](https://trpc.io)
- [Discord](https://trpc.io/discord)
- [GitHub Issues](https://github.com/trpc/trpc/issues)
- [Maintainers Guide](https://github.com/trpc/trpc/blob/main/CONTRIBUTING.md)
