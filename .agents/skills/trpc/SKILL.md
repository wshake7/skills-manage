# tRPC Skill

tRPC lets you build end-to-end typesafe APIs without code generation. This skill helps you effectively work with the tRPC repository and integrate it into applications.

## Overview

- **tRPC** stands for TypeScript Remote Procedure Call.
- It shares types between server and client automatically, eliminating the need for REST or GraphQL schemas.
- Works with React, Next.js, Express, Fastify, and standalone Node.js servers.
- Uses **procedures** (`query`, `mutation`, `subscription`) with built-in input validation (commonly Zod).

## Installation

```bash
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod
```

## Core Concepts

### 1. Create the tRPC instance (`t`)

```typescript
import { initTRPC } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
// later add middleware for protected procedures
```

### 2. Define Context

Context provides shared data (e.g., database, session) to all procedures.

```typescript
// context.ts
import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next'; // for Next.js

export async function createContext(opts?: CreateNextContextOptions) {
  const session = await getSession(); // example
  return { session, db: prisma };
}

export type Context = inferAsyncReturnType<typeof createContext>;
```

### 3. Define a Router

Use `t.router` to group procedures. Nest routers for organization.

```typescript
// routers/user.ts
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.user.findUnique({ where: { id: input.id } });
    }),
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.user.create({ data: input });
    }),
});
```

### 4. Merge Routers into an App Router

```typescript
// _app.ts (or appRouter.ts)
import { router } from './trpc';
import { userRouter } from './routers/user';
import { postRouter } from './routers/post';

export const appRouter = router({
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
```

### 5. Middleware and Protected Procedures

```typescript
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

export const protectedProcedure = t.procedure.use(isAuthed);
```

### 6. Error Handling

Throw `TRPCError` for expected errors. Use `onError` in `initTRPC` for global logging.

```typescript
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return { ...shape, data: { ...shape.data, zodError: error.cause?.issues } };
  },
});
```

## Server Integration

### Next.js App Router

```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
```

### Express

```typescript
import * as trpcExpress from '@trpc/server/adapters/express';
app.use('/trpc', trpcExpress.createExpressMiddleware({ router: appRouter, createContext }));
```

## Client Setup (React)

```typescript
// utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/_app';

export const trpc = createTRPCReact<AppRouter>();
```

Then in `_app.tsx` or a provider:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/utils/trpc';

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: '/api/trpc' })],
});

export function App({ Component, pageProps }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

## Usage in Components

```tsx
const { data, isLoading } = trpc.user.getById.useQuery({ id: '1' });
const mutation = trpc.user.create.useMutation();
```

## Common Patterns

- **Input Validation**: Always use `zod` to parse `input`.
- **Output Types**: Infer with `inferProcedureOutput` for client-side types.
- **Monorepo Structure**: Keep server code in `/server`, export `AppRouter` type for client use.
- **SSR with Next.js**: Use `ssr: true` on queries and `trpc.{procedure}.useQuery()` inside `getServerSideProps` via `createServerSideHelpers`.
- **Subscriptions**: Use WebSocket link or SSE. Example: `createWSClient` from `@trpc/client`.

## Workflow for Adding a New Endpoint

1. Define a Zod schema for input (if any).
2. Add a new procedure to the appropriate router (e.g., `routers/post.ts`): query, mutation, or subscription.
3. Export the `AppRouter` type if new routes affect the shape.
4. On the client, call `trpc.post.yourProcedure.useQuery(input)` or `useMutation()`.

## Additional Tips

- Use `@trpc/next` for Next.js Pages Router helpers (`createTRPCNext`).
- Leverage `trpc.useUtils()` to invalidate queries after mutations.
- For file uploads, consider `trpc-openapi` or custom middleware.
- The official tRPC v10+ API uses a builders pattern; avoid deprecated `@trpc/server@9.x` syntax.

## References

- [GitHub: trpc/trpc](https://github.com/trpc/trpc)
- [Official Docs](https://trpc.io)

Use this skill to scaffold routers, configure middleware, and integrate tRPC with popular frameworks seamlessly.
