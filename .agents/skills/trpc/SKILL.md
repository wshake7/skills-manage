# tRPC Skill

## Overview
tRPC is a TypeScript-first framework for building end-to-end typesafe APIs. It allows you to define server procedures and call them from the client with full type safety, without code generation. This skill provides guidance for working with a tRPC project.

## Quick Start
1. Install dependencies: `@trpc/server`, `@trpc/client`, and an adapter (e.g., `@trpc/next` for Next.js).
2. Create a tRPC router with procedures.
3. Expose the router via an HTTP server / framework adapter.
4. Create a tRPC client and use typed React hooks or vanilla client.

## Core Concepts
- **Router**: A collection of procedures.
- **Procedure**: A function that takes input, context, and returns output; can be `query` (GET-like), `mutation` (POST/PUT/DELETE), or `subscription`.
- **Context**: Per-request data (e.g., authentication, database) passed to all procedures.
- **Middleware**: Functions that wrap procedure execution (auth, logging).
- **Input validation**: Uses Zod (or other validators) to ensure type safety at runtime.

## Project Structure
A typical tRPC project separates concerns:
```
server/
  trpc.ts          # tRPC instance creation
  routers/
    user.ts        # User-related procedures
    post.ts
  context.ts       # Context creation
client/
  trpc.ts          # Client setup
```

## Defining Procedures
```typescript
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findUnique({ where: { id: input.id } });
    }),
  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.user.create({ data: input });
    }),
});
```
- Use `publicProcedure` for unauthenticated access; create protected procedures via middleware.
- Define input schemas with Zod for runtime validation; TypeScript infers types.
- Use `ctx` for database clients, session, etc.

## Middlewares & Context
Create a tRPC instance with middlewares:
```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const router = t.router;
```

Context is created per request. For Next.js:
```typescript
// server/context.ts
import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession({ req: opts.req });
  return { session, db: prisma };
}
export type Context = inferAsyncReturnType<typeof createContext>;
```

## Client Setup
### React Client
```typescript
// utils/trpc.ts
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../server/routers/_app';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({ url: '/api/trpc' }),
      ],
    };
  },
});
```
### Usage in components
```tsx
const { data, isLoading } = trpc.user.getById.useQuery({ id: 'user1' });
const mutation = trpc.user.create.useMutation();
```

### Vanilla Client
```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: '/api/trpc' })],
});
await client.user.getById.query({ id: '1' });
```

## Error Handling
Throw `TRPCError` in procedures; the client receives typed errors:
```typescript
throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
```
On the client, errors are accessible via `error` from hooks. Use `error.shape` for custom data.

## Framework Integration
### Next.js
- Use `createNextApiHandler` to serve the router under `/api/trpc`.
- Wrap `_app.tsx` with `trpc.withTRPC` HOC.
- Server calls get context from `req`/`res`.

### Express / Standalone
- Use `createExpressMiddleware` from `@trpc/server/adapters/express`.
- Or use `nodeHTTPRequestHandler` for vanilla Node.

## Testing
- Test procedures directly using the router and a mock context:
```typescript
const caller = router.createCaller({ db: mockDb, session: null });
const result = await caller.user.getById({ id: '1' });
```
- For integration tests, run the server and use a tRPC client pointing to it.

## Common Patterns
- **Nested Routers**: Organize by domain, merge in the root router.
- **Subscription**: Use WebSockets; install `@trpc/server/adapters/ws`.
- **Caching & Batching**: `httpBatchLink` batches requests; use React Query for client-side caching (tRPC uses React Query internally).
- **File Uploads**: Not built-in; pass file URLs or use dedicated routes.

## References
- Official docs: https://trpc.io/docs
- GitHub: https://github.com/trpc/trpc
- Examples: https://github.com/trpc/trpc/tree/main/examples
