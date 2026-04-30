# tRPC Skills

This skill provides guidance for working with **tRPC** – a type-safe, composable API layer that enables building end-to-end typesafe APIs without code generation or schemas.

## Core Concept

tRPC allows you to define server-side procedures (queries, mutations, subscriptions) and call them directly from the client with full TypeScript type inference. No REST endpoints, no GraphQL schema, no code generation – just pure TypeScript.

## Repository Structure (Monorepo)

The [tRPC monorepo](https://github.com/trpc/trpc) contains multiple packages:

- `packages/server` – Core server (`@trpc/server`)
- `packages/client` – Core client (`@trpc/client`)
- `packages/react` / `packages/next` / `packages/react-query` – Framework adapters
- `packages/zod` – Zod integration for input validation
- `examples/` – Working examples (Next.js, Express, Fastify, etc.)

## Setting Up tRPC

1. Install core packages:
   ```bash
   npm install @trpc/server @trpc/client zod
   ```
2. Initialize tRPC and create a router on the server:
   ```typescript
   import { initTRPC } from '@trpc/server';
   import { z } from 'zod';

   const t = initTRPC.create();

   export const router = t.router;
   export const publicProcedure = t.procedure;
   ```
3. Define procedures and compose routers:
   ```typescript
   const userRouter = router({
     getUser: publicProcedure
       .input(z.object({ id: z.string() }))
       .query(({ input }) => ({ id: input.id, name: 'Alice' })),
     createUser: publicProcedure
       .input(z.object({ name: z.string() }))
       .mutation(({ input }) => ({ id: 'new-id', name: input.name })),
   });

   const appRouter = router({
     user: userRouter,
   });

   export type AppRouter = typeof appRouter;
   ```
4. Create the server (e.g., Next.js API route, Express, standalone):
   ```typescript
   import { createHTTPServer } from '@trpc/server/adapters/standalone';
   const server = createHTTPServer({ router: appRouter });
   server.listen(3001);
   ```
5. Create the typed client:
   ```typescript
   import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
   import type { AppRouter } from './server';

   const trpc = createTRPCProxyClient<AppRouter>({
     links: [httpBatchLink({ url: 'http://localhost:3001' })],
   });

   const user = await trpc.user.getUser.query({ id: '1' });
   ```

For Next.js, use `@trpc/next` and `@trpc/react-query` for full RSC/SSR support.

## Procedure Types

- **`query`** – Read data (GET). Cached and safe for repeated calls.
- **`mutation`** – Side effects (POST/PUT/DELETE). Not cached.
- **`subscription`** – Real-time updates (WebSocket/SSE).

## Input Validation

Strongly recommend Zod for runtime type safety:
```typescript
publicProcedure
  .input(z.object({ email: z.string().email() }))
  .query(({ input }) => { ... });
```
Input type is inferred automatically on the client.

## Context & Middleware

Context is passed to every procedure; typically contains database clients, auth info, etc.
```typescript
interface Context {
  user?: { id: string; role: string };
  db: Database;
}

const t = initTRPC.context<Context>().create();
```

Middleware can modify/enrich context or halt requests:
```typescript
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, user: ctx.user } });
});

const protectedProcedure = t.procedure.use(isAuthed);
```

## Error Handling

Use `TRPCError` to throw typed errors:
```typescript
throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
```
Common codes: `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `TIMEOUT`, `INTERNAL_SERVER_ERROR`.

## React Integration

Use `@trpc/react-query` to get hooks:
```typescript
import { trpc } from '../utils/trpc';

const Component = () => {
  const { data, isLoading } = trpc.user.getUser.useQuery({ id: '1' });
  const utils = trpc.useContext();
  const mutation = trpc.user.createUser.useMutation({
    onSuccess: () => utils.user.getUser.invalidate(),
  });
};
```

## Testing

- Test pure server logic by calling `t.createCaller`:
  ```typescript
  const caller = t.createCaller({ ctx: mockCtx, router: appRouter });
  const result = await caller.user.getUser({ id: 'test' });
  ```
- Integration test with HTTP client using `trpc.createCaller` or `fetch`.

## Common Patterns & Pitfalls

- **Nested routers**: Organize by domain (`user`, `post`, `admin`).
- **Reusing input validators**: Extract Zod schemas and reuse with `.merge`, `.extend`, etc.
- **Type inference on client**: Always export `AppRouter` type; it powers the end-to-end type safety.
- **Batching**: Use `httpBatchLink` to combine multiple queries into one HTTP request.
- **SSR Helpers**: `createServerSideHelpers` in Next.js for server-side prefetching.

## Example Workflow (Adding a New Feature)

1. Define the procedure in the appropriate router (server).
2. Add input validation if needed.
3. Write the query/mutation logic (database call, validation, etc.).
4. Update `AppRouter` type (automatically inferred from router definition).
5. On the client: import the new procedure’s hook (`trpc.feature.useQuery`) and use it.
6. For mutations, set up optimistic updates or invalidation as needed.

## Repository Development

If you are contributing to the tRPC monorepo itself:
- Use `pnpm` (workspace).
- Tests are written with Vitest.
- Examples are in `examples/`; run them to verify changes.
- Core packages are in `packages/server`, `packages/client`; changes often need cross-package updates.
- Always ensure type tests pass (`pnpm typecheck`).

## Resources

- Official docs: [trpc.io/docs](https://trpc.io/docs)
- GitHub examples: [trpc/examples](https://github.com/trpc/trpc/tree/main/examples)
- Discord: [trpc.io/discord](https://trpc.io/discord)

This skill guides the AI to create routers, procedures, clients, and integrate with frameworks, following tRPC’s type-safe and composable patterns.