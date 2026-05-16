# tRPC Skill

## Overview
tRPC is a framework for building fully type-safe APIs using TypeScript. It eliminates the need for a separate schema or code generation by directly inferring types from your server code. The core flow: define procedures (queries, mutations) on a server router, export the router type, and use it to create a type-safe client.

## When to Use
- Building full-stack TypeScript applications (Next.js, Express, etc.)
- Need seamless type sharing between backend and frontend
- Prefer a code-first API approach over OpenAPI or GraphQL

## Repository Structure (Typical Monorepo)
```
server/
  api/
    routers/
      user.ts
      post.ts
    root.ts          # Merge all sub-routers
    context.ts       # Request context (DB, auth, etc.)
  index.ts          # HTTP server setup (Express, Next.js API route, etc.)
client/
  utils/
    trpc.ts         # Client creation and exported hooks
pages/              # Frontend pages using the client
shared/
  types             # Optional shared types (but often inferred from server)
```

## Core Concepts

### 1. Create a Router
Define public procedures using `t.procedure`:

```ts
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;
```

Add sub-routers:
```ts
const userRouter = router({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.user.findUnique({ where: { id: input.id } });
    }),
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.user.create({ data: input });
    }),
});

export const appRouter = router({
  user: userRouter,
});
```

### 2. Context
Define a per-request context factory:
```ts
import { inferAsyncReturnType } from '@trpc/server';

export const createContext = async (opts) => {
  return { db: prisma };
};

export type Context = inferAsyncReturnType<typeof createContext>;
```
Pass it to `initTRPC`:
```ts
const t = initTRPC.context<Context>().create();
```

### 3. Middleware
Use `t.middleware` to add reusable logic (auth, logging):
```ts
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } });
});
const protectedProcedure = publicProcedure.use(isAuthed);
```

### 4. Client Setup
Export type for frontend:
```ts
export type AppRouter = typeof appRouter;
```

**React Client (with @trpc/react-query):**
```ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/api/root';

export const trpc = createTRPCReact<AppRouter>();
```
Then use hooks:
```ts
const { data } = trpc.user.getUser.useQuery({ id: '123' });
const mutation = trpc.user.createUser.useMutation();
```

**Next.js Integration:** Wrap `<TrpcProvider>` around the app, creating a `trpc` client (see `@trpc/next`).

**Vanilla Client:**
```ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

export const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: '/api/trpc' })],
});
// Then call like: client.user.getUser.query({ id: '123' })
```

### 5. Error Handling
Throw `TRPCError` in procedures; client gets structured error:
```ts
throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
```

## Workflow Guidance for Copilot

When asked to implement a tRPC endpoint or feature, follow this order:

1. **Identify the operation** (query, mutation, subscription).
2. **Define input schema** using Zod inside `.input()`. Prefer exact validation.
3. **Implement the procedure** in the appropriate router file. Access `ctx` for DB/Auth.
4. **Register the procedure** in the router (or sub-router) and merge into the root router (`appRouter`).
5. **If needed, update context** to include new dependencies (e.g., new DB model).
6. **Client usage**: Import the `trpc` utility and use the corresponding hook/ method.
7. **For form submissions**, use `mutation` with `.mutate()`, handle loading/error states.

## Common Patterns

- **Input with validation**: Always use `.input(zodSchema)`. The inferred input type is automatically available on the client.
- **Output typing**: Use `zodSchema.output` for complex returns or infer with `inferRouterOutputs`:
  ```ts
  export type User = RouterOutput['user']['getUser'];
  ```
- **Middleware composition**: Chain `.use()` to stack auth, logging, context enrichment.
- **Batching**: Use `httpBatchLink` for combining multiple requests into one.
- **SSR (Next.js)**: Use `createProxySSGHelpers` to prefetch data on the server.

## Node.js / Non-Browser Clients
If you need a client in Node (e.g., CLI, server-to-server), use the vanilla `createTRPCClient` with a Node-compatible link (like `httpLink`).

## Testing
- Mock `ctx` to test procedures directly: `caller = appRouter.createCaller({ db: mockDb })`.
- Test clients with mock service workers or by wrapping in a test context.

## Version Notes
This skill targets tRPC v10.x, but concepts apply to v11 with minor adjustments (e.g., `initTRPC.create` is stable). Always check the version used in the project.
