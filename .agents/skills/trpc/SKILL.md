# tRPC Skill

## Overview

tRPC is a library for building fully typesafe APIs without code generation. It allows you to define API endpoints as server-side functions with input validation, and then call them from the client with full TypeScript type inference. It integrates seamlessly with React, Next.js, Express, and other frameworks.

## Key Concepts

- **Router**: Collection of procedures (queries, mutations, subscriptions).
- **Procedure**: A single API endpoint that can be a query (GET), mutation (POST), or subscription (real-time).
- **Input validation**: Use Zod (or other validators) to define and validate incoming data.
- **Context**: Per-request data (e.g., authentication, database connections) passed to procedures.
- **Middleware**: Functions that run before/after procedures, enabling logging, authentication, etc.
- **Client**: A typesafe client (`@trpc/client`) that uses the router type for autocompletion and type safety.

## General Workflow

1. **Define a router** with `t.router`:
   ```ts
   import { initTRPC } from '@trpc/server';
   import { z } from 'zod';

   const t = initTRPC.context<Context>().create();

   export const appRouter = t.router({
     greeting: t.procedure
       .input(z.object({ name: z.string() }))
       .query(({ input }) => `Hello, ${input.name}!`),
   });

   export type AppRouter = typeof appRouter;
   ```

2. **Create a server handler** (example for Express):
   ```ts
   import { createExpressMiddleware } from '@trpc/server/adapters/express';

   app.use('/trpc', createExpressMiddleware({
     router: appRouter,
     createContext,
   }));
   ```

3. **Build the client**:
   ```ts
   import { createTRPCReact } from '@trpc/react-query';
   import type { AppRouter } from '../server';

   export const trpc = createTRPCReact<AppRouter>();
   ```

4. **Use in components**:
   ```tsx
   const { data } = trpc.greeting.useQuery({ name: 'world' });
   ```

## Repository Layout

- `packages/server` – Core server library (`@trpc/server`).
- `packages/client` – Generic HTTP client (`@trpc/client`).
- `packages/react-query` – React hooks based on React Query (`@trpc/react-query`).
- `packages/next` – Next.js adapter (`@trpc/next`).
- `packages/express` – Express adapter.
- `packages/zod` – Zod utilities.
- `packages/playground` – Interactive API explorer.
- `packages/tests` – Integration tests.
- `examples` – Full-stack example apps (Next.js, Express, standalone).
- `www` – Documentation site (Vitepress).

## Common Patterns / Best Practices

- **Type-safe client calls**: Use `useQuery` for GET, `useMutation` for POST. Error handling is built-in via React Query.
- **Input validation with Zod**: Always define `.input()` to ensure runtime safety and get proper types.
- **Context creation**: Middleware like `t.middleware` can enrich context, e.g., authenticate user.
- **Router organization**: Split large routers with `t.router` and merge using `.merge()`.
- **Error handling**: Throw `TRPCError` from procedures to return structured errors to the client.
- **Caching**: React Query manages caching; configure `staleTime`, `cacheTime` on queries/mutations.

## Common Pitfalls & Troubleshooting

- **Types not updating**: After adding/removing procedures, restart the TypeScript server. Ensure the `AppRouter` type is re-exported correctly.
- **Context inference**: Use `initTRPC.context<Context>()` to get typed context everywhere; failing to pass context in middleware can cause `any` fallback.
- **Client-side access**: The client needs the `AppRouter` type, not the runtime implementation. Use `import type` to avoid bundling server code.
- **Middleware order**: Middlewares execute in the order they are added; the first to throw/reject stops the chain.
- **Next.js app directory**: For App Router, use `@trpc/next` with `createTRPCNextAppDirServer` or `createTRPCNext` for Pages Router.

## Example Walkthrough: Adding a New Mutation

1. Define the mutation in an existing router file:
   ```ts
   createUser: t.procedure
     .input(z.object({ email: z.string().email(), name: z.string() }))
     .mutation(async ({ input, ctx }) => {
       // ctx.db is from context
       const user = await ctx.db.user.create({ data: input });
       return user;
     })
   ```
2. If using a merged router, ensure the parent router includes it.
3. In the client, call:
   ```ts
   const mutation = trpc.createUser.useMutation();
   mutation.mutate({ email: 'test@example.com', name: 'Alice' });
   ```
4. Refetch related queries if needed, using `onSuccess` in `useMutation`.

## Additional Notes

- The official documentation is in `www/docs`. Use `pnpm docs:dev` to run locally.
- The repository uses pnpm as the package manager and TurboRepo for monorepo orchestration.
- For subscription support, enable WebSocket transport with `@trpc/server/adapters/ws`.
