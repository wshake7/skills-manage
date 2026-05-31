# tRPC Skill

## Overview

tRPC is a TypeScript RPC framework that enables end-to-end type-safe APIs without code generation. Define procedures on the server and call them from the client with full type inference. This skill helps you set up, extend, and debug tRPC applications.

## Project Structure

A typical tRPC project uses a monorepo, tRPC v10+, and separates server/router from client.

```
/server
  trpc.ts              # tRPC instance (context, middleware)
  routers/
    _app.ts            # main appRouter combining sub-routers
    post.ts            # example sub-router
    ...
  context.ts           # request context (auth, DB)
/client
  trpc.ts              # tRPC client initialisation
  components/
    PostList.tsx
  ...
```

## Key Concepts

- **Procedure**: A type-safe API endpoint (query, mutation, or subscription).
- **Router**: A collection of procedures, can be nested.
- **Context**: Per-request data (e.g., `req`, `res`, database client, user session).
- **Middleware**: Reusable logic that runs before/around procedures (auth, logging, rate limiting).
- **Input Validation**: Enforced via Zod (or other validators) for runtime safety.
- **Client**: Inferred from `AppRouter` type; call procedures like native functions.

## Workflow Guidance

### 1. Initialise tRPC

Create the tRPC backend instance with context and any global middleware.

```ts
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
```

### 2. Define a Router with Procedures

Use `publicProcedure` (or protected variants) and chain `.input()` with a Zod schema.

```ts
// server/routers/post.ts
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const postRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany();
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({ where: { id: input.id } });
      if (!post) throw new TRPCError({ code: 'NOT_FOUND' });
      return post;
    }),
  create: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({ data: input });
    }),
});
```

Combine routers into an app router:

```ts
// server/routers/_app.ts
import { router } from '../trpc';
import { postRouter } from './post';

export const appRouter = router({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
```

### 3. Add Middleware (Auth example)

```ts
// server/trpc.ts (extended)
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const protectedProcedure = t.procedure.use(isAuthed);
```

### 4. Error Handling

Throw `TRPCError` with appropriate codes (`BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`, etc.). Custom errors can be created by extending `TRPCError`. On the client, catch errors and inspect `error.code`.

### 5. Create the tRPC Client

Use `createTRPCReact` (for React), `createTRPCNext` (Next.js), or vanilla client.

```ts
// client/trpc.ts (React example)
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();
```

Provide the client in your app with links (HTTP, WebSocket, etc.):

```tsx
<QueryClientProvider client={queryClient}>
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <App />
  </trpc.Provider>
</QueryClientProvider>
```

### 6. Call Procedures from Client

Procedures are accessed as `trpc.<router>.<procedure>.useQuery()` or `.useMutation()`.

```tsx
const { data: posts } = trpc.post.list.useQuery();
const createPost = trpc.post.create.useMutation({
  onSuccess: () => utils.post.list.invalidate(),
});
```

### 7. Testing

Use `createCallerFactory` to create a server-side caller without HTTP. Pass mocked context.

```ts
const caller = appRouter.createCaller({ db: mockDb, user: null });
const result = await caller.post.byId({ id: '1' });
```

## Common Patterns

- **Reusable input schemas**: Export Zod schemas to share between client and server.
- **Transforming inputs/outputs**: Use `.output()` for response shape or `.transform()` in Zod.
- **Batch requests**: Group queries with `trpc.useUtils().fetch` or use React Query’s `useQueries`.
- **SSR/SSG**: Prefetch queries with `ssr.ts` utilities in Next.js.
- **Error formatting**: Customise `errorFormatter` in `initTRPC` to shape client-facing errors.

## Resources

- tRPC documentation: https://trpc.io
- Repository examples: `examples/` folder in https://github.com/trpc/trpc
