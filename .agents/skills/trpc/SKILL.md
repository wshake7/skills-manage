# tRPC Repository Skill

## Overview
This is the monorepo for [tRPC](https://trpc.io), a framework for building fully typesafe APIs in TypeScript. The repository contains the core server, client, React bindings, adapters, and documentation site. The project uses pnpm workspaces, TypeScript strict mode, and Turborepo for task orchestration.

## Repository Layout
```
packages/
  server/         # @trpc/server – core server, router, middleware, procedures
  client/         # @trpc/client – typed client for calling tRPC endpoints
  react-query/    # @trpc/react-query – React hooks using @tanstack/react-query
  next/           # Next.js app directory adapter
  tests/          # Integration & end-to-end tests across adapters
www/              # Documentation site (Next.js + MDX)
scripts/          # Build, CI, and release scripts
turbo.json        # Turborepo pipeline configuration
pnpm-workspace.yaml
CONTRIBUTING.md
```

## Key Architectural Concepts
- **Router**: The entry point that combines procedures. Created via `initTRPC` builder.
- **Procedures**: Exposed API endpoints – `.query()`, `.mutation()`, `.subscription()`.
- **Middleware**: Reusable logic (auth, logging) that can modify context; chained with `.use()`.
- **Context**: Per-request data (session, request object) created by an adapter’s context factory.
- **Adapters**: Mount tRPC onto HTTP frameworks using adapters like `@trpc/server/adapters/express`, `@trpc/server/adapters/fastify`, or the Next.js adapter.
- **Input Validation**: Primarily uses Zod; define with `input(zodSchema)`.
- **Type Inference**: The router’s type (`AppRouter`) is exported and consumed by the client for end-to-end type safety.

## Common Development Workflows
- **Building a package**: `cd packages/<name> && pnpm dev` runs a watch mode build. Root-level `pnpm build` uses Turborepo to build all packages in dependency order.
- **Running tests**: 
  - Single package: `pnpm --filter @trpc/server test` (Vitest)
  - All tests: `pnpm test` at root (runs Turborepo test pipeline).
  - End-to-end tests in `packages/tests`: `cd packages/tests && pnpm test:all`
- **Linting/Type checking**: `pnpm lint` and `pnpm typecheck` (or `pnpm type-check`) at root.
- **Documentation (www)**: `cd www && pnpm dev` for local preview. Content lives in `www/docs/` as MDX.
- **Adding a new package**: Create `packages/<name>` with `package.json` (@trpc/<name>), update `pnpm-workspace.yaml` if necessary, run `pnpm install`, and add build scripts typically using `tsup`.
- **Publishing**: Handled by CI through changesets. Add a changeset with `pnpm changeset`.

## Implementation Patterns & Examples

### Creating a Router
```ts
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context<{ user?: User }>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello ${input.name}!`),
  secret: protectedProcedure.query(() => 'This is confidential'),
});

export type AppRouter = typeof appRouter;
```

### Client Usage
- **createTRPCReact** (React):
  ```ts
  import { createTRPCReact } from '@trpc/react-query';
  import type { AppRouter } from '../server';
  export const trpc = createTRPCReact<AppRouter>();
  ```
- **createTRPCProxyClient** (Vanilla):
  ```ts
  import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
  const client = createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({ url: '/api/trpc' })],
  });
  await client.greeting.query({ name: 'World' });
  ```

### Middleware
```ts
const loggerMiddleware = t.middleware(({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  console.log(`${type} ${path} took ${duration}ms`);
  return result;
});
```

### Subscriptions
```ts
const sub = t.procedure.subscription(() => {
  return observable<{ data: string }>((emit) => {
    emit.next({ data: 'Hello' });
    emit.complete();
  });
});
```

## Testing
- **Unit tests**: Use `@trpc/server`’s `createCallerFactory` to test procedures without HTTP.
```ts
import { createCallerFactory } from '@trpc/server';
const createCaller = createCallerFactory()(appRouter);
const caller = createCaller({ user: null });
const result = await caller.greeting({ name: 'Test' });
expect(result).toBe('Hello Test!');
```
- **E2E tests**: Located in `packages/tests`. These spin up real servers (Express, Fastify, Next.js, etc.) and use fetch/WebSocket calls. See examples in `packages/tests/server/adapters/`.

## Useful Commands
| Action | Command |
|--------|---------|
| Install dependencies | `pnpm install` |
| Build all packages | `pnpm build` |
| Lint | `pnpm lint` |
| Type check | `pnpm typecheck` |
| Run all tests | `pnpm test` |
| Run tests for a package | `pnpm --filter @trpc/server test` |
| Watch mode for a package | `pnpm --filter @trpc/server dev` |
| Add a changeset | `pnpm changeset` |
| Preview documentation | `cd www && pnpm dev` |

## Additional Tips
- Always export `AppRouter` type from the server for client type safety.
- Use `tsup` for bundling: configuration typically lives in the package’s `tsup.config.ts`.
- Many runtime errors are due to mismatched types between server and client; check that the client uses the correct `AppRouter`.
- The monorepo enforces strict TypeScript. Run `pnpm typecheck` to catch type errors before committing.
- When adding a new adapter, follow patterns in existing adapters (e.g., `packages/server/src/adapters/express.ts`). It must implement `incomingMessageToRequest` conversion and expose a request handler.
- For performance improvements, refer to the benchmarks in `benchmarks/` (if present) or the website’s “Performance” section.
