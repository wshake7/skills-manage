# tRPC Skill

This skill provides guidance for working with tRPC – end‑to‑end typesafe APIs for TypeScript, whether you are writing an application or contributing to the `trpc/trpc` monorepo.

## Overview

- **What it solves**: Define API endpoints as TypeScript functions on the server; call them from the client with full autocompletion and type safety, no code generation needed.
- **Core packages**:
  - `@trpc/server` – router, procedures, middleware, context.
  - `@trpc/client` – client proxy, links (HTTP, WebSocket, batching).
  - `@trpc/react-query` – React hooks (useQuery, useMutation, etc.) powered by TanStack React‑Query.
  - `@trpc/next` – helper for Next.js (app or pages router).
  - Adapters for Express, Fastify, Fetch (standalone), AWS Lambda, etc.

## Quick Workflow (Application)

1. **Install**: `npm install @trpc/server @trpc/client zod` (and additional packages if needed).
2. **Create context** (a function that returns the context object, often async):
   ```ts
   // server/context.ts
   export const createContext = async (opts: { req: Request }) => ({
     user: await getUserFromReq(opts.req),
   });
   ```
3. **Init tRPC** with context type:
   ```ts
   // server/trpc.ts
   import { initTRPC, TRPCError } from '@trpc/server';
   import { Context } from './context';
   const t = initTRPC.context<Context>().create();
   export const router = t.router;
   export const publicProcedure = t.procedure;
   export const middleware = t.middleware;
   ```
4. **Define procedures** (queries, mutations, subscriptions) with optional input validation (Zod):
   ```ts
   // server/routers/user.ts
   import { z } from 'zod';
   import { router, publicProcedure } from '../trpc';
   export const userRouter = router({
     byId: publicProcedure.input(z.string()).query(({ input, ctx }) => {
       return db.user.findUnique({ where: { id: input } });
     }),
     create: publicProcedure.input(z.object({ name: z.string() })).mutation(({ input, ctx }) => {
       return db.user.create({ data: { name: input.name } });
     }),
   });
   ```
5. **Merge routers** and export the `AppRouter` type:
   ```ts
   // server/_app.ts
   import { router } from './trpc';
   import { userRouter } from './routers/user';
   export const appRouter = router({ user: userRouter });
   export type AppRouter = typeof appRouter;
   ```
6. **Serve** using an adapter (example with Express):
   ```ts
   import { createExpressMiddleware } from '@trpc/server/adapters/express';
   app.use('/trpc', createExpressMiddleware({ router: appRouter, createContext }));
   ```
7. **Client setup**:
   ```ts
   import { createTRPCProxyClient, httpLink } from '@trpc/client';
   import type { AppRouter } from './server/_app';
   const client = createTRPCProxyClient<AppRouter>({
     links: [httpLink({ url: '/api/trpc' })],
   });
   // Usage: client.user.byId.query('123').then(...)
   ```

## React Integration

```ts
import { createTRPCReact } from '@trpc/react-query';
export const trpc = createTRPCReact<AppRouter>();
```
Wrap your app with `trpc.Provider` and `QueryClientProvider`. Then use hooks:
```tsx
const { data } = trpc.user.byId.useQuery('123');
const mutation = trpc.user.create.useMutation();
```

## Middleware & Authentication

- Create middleware: `const auth = t.middleware(({ ctx, next }) => { if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' }); return next({ ctx: { user: ctx.user } }); });`
- Protected procedures: `export const protectedProcedure = publicProcedure.use(auth);`
- Reuse context: group multiple middlewares with `.unstable_concat()` or compose them.

## Error Handling

- Throw `TRPCError` in procedures: `new TRPCError({ code: 'NOT_FOUND', message: '...' })`.
- Catch with `onError` option in `initTRPC` or per procedure.
- Client errors are typed: `if (error?.data?.code === 'NOT_FOUND')`.

## Data Transformers

- Use `superjson` to preserve Date, Map, Set, etc. Install `superjson` and add transformer to both initTRPC and client links.
- Server: `initTRPC.create({ transformer: superjson })`.
- Client link: `httpLink({ url, transformer: superjson })`.

## Batching

- Replace `httpLink` with `httpBatchLink` to combine requests into one HTTP call.
- Requires a batch-enabled endpoint on the server (all adapters support it).

## Subscriptions (WebSocket)

- Install `@trpc/server/adapters/ws` and set up a WebSocket server.
- On client, use `createWSClient` and `wsLink`.
- Define subscription procedures with `.subscription()` that return an async iterable.

## Testing

- Server‑side: `createCallerFactory` from `@trpc/server` allows calling procedures without HTTP.
  ```ts
  const caller = t.createCallerFactory(appRouter)(ctx);
  const user = await caller.user.byId('123');
  ```
- Unit‑test procedures and middleware in isolation.

## Contributing to `trpc/trpc` Repository

- **Monorepo** with pnpm, Turborepo. Packages live in `/packages`, examples in `/examples`.
- **Setup**: `pnpm install && pnpm build`.
- **Tests**: `pnpm test` (Vitest + Playwright for e2e).
- **Linting**: `pnpm lint` (ESLint + Prettier).
- **Documentation**: website in `/www`, powered by Docusaurus.
- **Release**: Changesets manage versioning (`pnpm changeset`).

## Common Pitfalls & Tips

- Always export `AppRouter` type; clients depend on it.
- Zod schemas can infer types with `z.infer<typeof schema>`.
- Context is recalculated per request – keep it thin.
- Use `skipBatch` option on client links for file uploads or very large payloads that shouldn’t be bundled.
- For Next.js App Router, prefer the fetch‑based adapter with a route handler.

## Further Reading

- Official docs: https://trpc.io
- GitHub: https://github.com/trpc/trpc