# tRPC Skill

## Purpose
Use this skill when building typesafe APIs with tRPC. tRPC eliminates the need for code generation by sharing TypeScript types between client and server, providing first-class autocompletion and compile-time safety for your entire API.

## Setup
Install the required packages:
```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next zod
```
- `@trpc/server` – core server-side framework.
- `@trpc/client` – vanilla client.
- `@trpc/react-query` – React hooks powered by TanStack Query.
- `@trpc/next` – Next.js integration (if using Next.js).
- `zod` – input validation (recommended).

## Core Concepts
- **Router**: A collection of procedures. Create using `t.router()`.
- **Procedure**: An API endpoint (query, mutation, subscription). Built with `t.procedure` chaining `.query()`, `.mutation()`, or `.subscription()`.
- **Context**: Per-request data (e.g., auth, database). Defined with `createContext` and passed to procedures.
- **Middleware**: Reusable logic that runs before/after procedures (e.g., authentication, logging).
- **Type inference**: Export `AppRouter` type from server; client uses it for automatic type safety.

## Router Definition
Create a tRPC instance and your backend router:
```typescript
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello ${input.name}`),
  createUser: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // ctx.db available
      return await ctx.db.user.create({ data: input });
    }),
});

export type AppRouter = typeof appRouter;
```
- Merge nested routers with `t.mergeRouters`.
- Use `t.middleware` for reusable logic (e.g., auth guards).

## Client Configuration
### Vanilla Client
```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({ url: 'http://localhost:3000/api/trpc' }),
  ],
});

const greeting = await client.greeting.query({ name: 'World' });
```
### React (with TanStack Query)
```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server';

export const trpc = createTRPCReact<AppRouter>();

// In your app, provide queryClient and trpcClient via <QueryClientProvider> and <trpc.Provider>.
// Then use hooks:
const { data } = trpc.greeting.useQuery({ name: 'World' });
```

## Error Handling
Throw `TRPCError` inside procedures for structured HTTP errors:
```typescript
import { TRPCError } from '@trpc/server';

t.mutation(async ({ input }) => {
  if (!input.name) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Name required' });
});
```
- Common codes: `'BAD_REQUEST'`, `'UNAUTHORIZED'`, `'FORBIDDEN'`, `'NOT_FOUND'`, `'INTERNAL_SERVER_ERROR'`.
- Catch errors on client with `.useQuery({})`’s `onError` or `error` state.

## Middleware
```typescript
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } }); // enriches context
});

const authedProcedure = t.procedure.use(isAuthed);

// Use authedProcedure instead of t.procedure for protected routes.
```

## Context
Pass request-specific data like database connections or user sessions:
```typescript
const createContext = async ({ req, res }) => {
  const user = await getUserFromHeaders(req.headers);
  return { db, user, req, res };
};

type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();
```
- Attach context to your server adapter (e.g., `createNextApiHandler` for Next.js).

## Directory Structure (Example)
```
server/
  trpc.ts          # init tRPC, context, middlewares, base procedures
  routers/
    user.ts        # user procedures
    post.ts        # post procedures
  index.ts         # merge all routers, export AppRouter
client/
  trpc.ts          # create TRPC client for frontend
```

## Common Recipes
- **Path aliasing**: Use `tsconfig` `paths` to share `AppRouter` type cleanly.
- **React Server Components (Next.js 13+)**: Use `createCaller` for server-side data fetching.
- **SSR with Next.js**: Use `createProxySSGHelpers` then `dehydrate` to preload queries.
- **Real-time subscriptions**: Use `t.procedure.subscription()` with WebSocket link.

## Agent Workflow
1. Initialize tRPC backend in your project’s API entry (e.g., `pages/api/trpc/[trpc].ts` for Next.js).
2. Create the tRPC instance with context and middlewares.
3. Define routers grouped by domain; merge into a single `appRouter`.
4. Export `AppRouter` type so client can infer everything.
5. Set up the client (vanilla or React) with the correct API URL.
6. Use autocompletion to write fully typed queries and mutations.
7. For errors, throw `TRPCError` in procedures; handle on frontend with React Query’s error states.

Remember: tRPC’s strength is end-to-end typesafety—never use `any` when defining inputs or outputs; let inference do the work.