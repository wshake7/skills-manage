# tRPC Skill

This skill helps you work with [tRPC](https://trpc.io) — end-to-end typesafe APIs for TypeScript.

## Overview

tRPC enables you to define API procedures (queries, mutations, subscriptions) on the server and call them directly from the client with full TypeScript autocompletion and type safety, without code generation or REST/GraphQL schemas. It’s usually paired with Zod for runtime input validation.

## When to Use This Skill

- Setting up a new tRPC project (Next.js, Express, standalone, etc.)
- Adding new endpoints (procedures) to an existing tRPC router
- Integrating tRPC with a frontend framework (React, Next.js, Vue, etc.)
- Troubleshooting type errors, DX issues, or runtime errors
- Implementing authentication, context, or middleware
- Understanding the tRPC monorepo structure (if contributing)

## Core Concepts

### Router

A router bundles procedures. Build it with `t.router()`:

```ts
import { t } from '../trpc';
import { z } from 'zod';

export const userRouter = t.router({
  getById: t.procedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return { id: input.id, name: 'John' };
  }),
  create: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      // create user
    }),
});
```

- `.query()` – for reading data (GET-like)
- `.mutation()` – for writing data (POST/PUT/DELETE-like)
- `.subscription()` – for realtime data (WebSocket)

### Context

Context is data shared across all procedures (e.g., database client, session). Defined during server creation, accessed via `ctx` in procedures.

```ts
// server/context.ts
export const createContext = async ({ req }) => {
  const session = await getSession(req);
  return { session, prisma };
};
```

### Middleware

Wrap procedures or routers with logic like authentication, logging, input transformations.

```ts
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { session: ctx.session } });
});

// protectedProcedure
const authedProcedure = t.procedure.use(isAuthed);
```

### Input Validation with Zod

Always validate input with Zod (or other validators). This generates types automatically:

```ts
.input(z.object({ email: z.string().email() }))
```

### Type Inference & Sharing

Export the router type for the client:

```ts
export type AppRouter = typeof appRouter;
```

The client uses this to infer all procedure names, inputs, and outputs.

## Project Setup (Quick Reference)

### Using create-t3-app (Next.js + tRPC + Prisma + Tailwind)

```bash
npm create t3-app@latest
```

Select tRPC, Next.js, Prisma, etc. It generates a fully working project.

### Manual Setup (Next.js App Router)

1. Install dependencies:
```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query zod
```

2. Create `server/trpc.ts` (initialization with context):
```ts
import { initTRPC } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  // ctx logic
};

const t = initTRPC.context<typeof createTRPCContext>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
```

3. Define routers in `server/routers/`
4. Create the app router in `server/api/root.ts`:
```ts
import { router } from '../trpc';
import { userRouter } from './routers/user';

export const appRouter = router({
  user: userRouter,
});
export type AppRouter = typeof appRouter;
```

5. Expose via API handler in `app/api/trpc/[trpc]/route.ts` (App Router) or `pages/api/trpc/[trpc].ts` (Pages Router).

6. Set up the client in a React wrapper component (`trpc/react.tsx`):
```tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '@/server/api/root';

export const api = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const trpcClient = api.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
      }),
    ],
  });
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
```

## Workflow Guidance

### Adding a New Procedure

1. Identify if it’s a query, mutation, or subscription.
2. Add the procedure to the appropriate router in `server/routers/`.
3. Define input schema with Zod (if any).
4. Write the resolver (query/mutation/subscription). Use `ctx` for dependencies.
5. If the procedure is protected, attach auth middleware.
6. On the client, use the typed hook from `api`:
   - `api.user.getById.useQuery({ id })`
   - `api.user.create.useMutation()`
   - Data, status, and errors are fully typed.

### Consuming an Existing Procedure from the Client

- In a component, import the `api` object.
- Use hooks directly. For queries:
```tsx
const { data, isLoading } = api.user.getById.useQuery({ id: '1' });
```
- For mutations:
```tsx
const mutation = api.user.create.useMutation();
const handleClick = () => mutation.mutate({ name: 'Alice' });
```

### Debugging Type Errors

- Ensure the `AppRouter` type is imported correctly in the client (`createTRPCReact<AppRouter>()`).
- Verify that input/output types are inferable; use explicit output types only when necessary.
- If a procedure input isn't recognized, check that Zod schema is correct and that `.input()` is chained.
- Use `tRPCError` for error handling in procedures; on the client catch with `mutation.error.message`.

### Authentication

- Store session/access token in `ctx` via context creation.
- Create a protected procedure with `t.procedure.use(isAuthed)` that enforces the session.
- On the client, pass auth tokens via headers (if needed) in the link configuration.

## Common Patterns

### Nested Routers

Organize routers hierarchically:
```ts
const appRouter = router({
  user: userRouter,   // userRouter may contain sub-routers
  post: postRouter,
});
```

### Sharing Code Between Servers

Use `createCallerFactory` to call procedures server-side (e.g., in getServerSideProps):
```ts
const caller = appRouter.createCaller(await createContext());
const user = await caller.user.getById({ id });
```

### File Structure (Recommended)

```
src/
├── server/
│   ├── api/
│   │   └── root.ts
│   ├── routers/
│   │   ├── user.ts
│   │   └── post.ts
│   ├── trpc.ts          # initTRPC & context creator
│   └── context.ts       # context function
├── app/                 # Next.js App Router pages
├── trpc/
│   ├── client.ts        # browser client
│   └── react.tsx        # provider + hooks
```

## Pitfalls & Debugging

- **CORS**: When the client is on a different origin, configure the server adapter to allow CORS.
- **Serialization**: Ensure returned data is serializable (no Dates, functions). Use `superjson` transformer if needed.
- **Batch Mode**: By default `httpBatchLink` batches requests. If it causes issues, switch to `httpLink`.
- **Errors Not Propagating**: tRPC wraps errors in `TRPCClientError`. Catch them in mutations/queries with `.error`.
- **Missing Context Properties**: Extend the context type via `initTRPC.context<...>().create()` if you add new context fields.
- **Subscription Issues**: Use `wsLink` for WebSocket connections and ensure the server supports it.

## Working with the tRPC Monorepo

If contributing to `trpc/trpc`:
- Use pnpm as the package manager.
- Run tests with `pnpm test`.
- Build with `pnpm build`.
- Lint with `pnpm lint`.
- The packages are in `packages/`: `server`, `client`, `react-query`, `next`, etc.
- Most issues are discussed in Discord; follow the CONTRIBUTING.md.

## References

- Official docs: https://trpc.io/docs
- GitHub: https://github.com/trpc/trpc
- create-t3-app: https://create.t3.gg
- Starter templates: https://trpc.io/docs/main/example-apps
