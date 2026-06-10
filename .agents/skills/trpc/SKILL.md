# tRPC Skill

## Overview
tRPC is a TypeScript RPC framework that enables end-to-end type-safe APIs. Define backend procedures and call them from the frontend with full type inference—no code generation needed.

**When to Use**
- Full-stack TypeScript apps (Next.js, Express, Fastify, etc.)
- Internal tools, admin panels, or any project where client and server share a codebase
- Rapid development with zero API layer maintenance

---

## Core Concepts
- **Router**: hierarchical container for procedures.
- **Procedure**: a single endpoint: `query` (GET), `mutation` (POST/PUT/DELETE), or `subscription` (WebSocket).
- **Context**: request-scoped data (e.g., DB connection, session) provided to all procedures.
- **Middleware**: reusable functions that run before the handler (auth, logging, input transformation).
- **Input Validation**: use Zod/Yup schemas to parse and validate inputs at runtime.
- **Client**: typed caller generated from the server's `AppRouter` type, offering React hooks, direct calls, etc.

---

## Project Setup (Quick steps)

### Server
1. **Initialize tRPC**
```ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

2. **Create a router**
```ts
const userRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),
  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.user.create({ data: input });
    }),
});
```

3. **Combine into root router**
```ts
const appRouter = router({
  user: userRouter,
  // ...other routers
});

export type AppRouter = typeof appRouter;
```

### Client (React example)
1. **Create tRPC React client**
```ts
import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '../server/trpc/routers';

export const trpc = createTRPCReact<AppRouter>();
```

2. **Wrap app with provider**
```tsx
<trpc.Provider client={trpcClient} queryClient={queryClient}>
  <App />
</trpc.Provider>
```

3. **Use hooks**
```tsx
const { data, isLoading } = trpc.user.list.useQuery();
const createUser = trpc.user.create.useMutation();
```

---

## Development Workflow

### Adding a New Backend Procedure
1. **Define input schema** (optional) with Zod inside the appropriate router file.
2. **Write the procedure** – decide if it is a `query`, `mutation`, or `subscription`. Access context via `ctx`.
3. **Export the router** and merge it into the root `appRouter`.
4. **Regenerate types** (if using separate backend) – otherwise TypeScript infers automatically.

### Consuming a Procedure on the Client
- Locate the procedure path: `trpc.<router>.<procedure>.useQuery()` or `.useMutation()`.
- For queries, destructure `{ data, error, isLoading }`.
- For mutations, call `mutate(input)` and attach callbacks:
```tsx
const createUser = trpc.user.create.useMutation({
  onSuccess: () => { /* refetch or redirect */ },
  onError: (err) => { /* handle typed TRPCError */ },
});
createUser.mutate({ name: 'Alice', email: 'alice@example.com' });
```

### Server-Side Calling (Next.js RSC or tests)
- Create a caller using `createCallerFactory`:
```ts
const createCaller = t.createCallerFactory(appRouter);
const caller = createCaller({ db, session });
const users = await caller.user.list();
```

---

## Middleware & Context

### Context
Define a `createContext` function that returns an object with shared dependencies:
```ts
interface Context {
  db: PrismaClient;
  session: Session | null;
}

const createContext = async (opts: CreateNextContextOptions) => {
  return { db, session: await getSession(opts.req) };
};
```

### Middleware
Wrap procedures to enforce authentication, logging, etc.:
```ts
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { user: ctx.session.user } });
});

export const protectedProcedure = t.procedure.use(isAuthed);
```

---

## Error Handling
- Throw `TRPCError` from `@trpc/server` with appropriate code (`BAD_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, etc.) and optional message.
- On the client, errors are automatically typed; catch them via the `error` object from hooks or mutations’ `onError`.

---

## Best Practices & Tips
- **Keep procedures thin** – delegate business logic to services/helpers.
- **Use Zod** for all inputs, even if internal; it provides runtime validation and type inference.
- **Organize by domain** – `routers/user.ts`, `routers/post.ts`, etc. Merge them in `routers/index.ts`.
- **Reuse middlewares** for cross-cutting concerns (auth, logging, performance tracing).
- **Avoid exporting internal types**; leverage `inferRouterInputs` and `inferRouterOutputs` when needed.
- When using **Next.js** with Server Components, prefer the server-side caller instead of React hooks.
- For **subscriptions**, use `ws` transport and `observable` from `@trpc/server`; keep connection lifecycle in mind.

---

## File Structure (Common Patterns)

### Next.js Pages Router
```
/server/trpc/
  context.ts
  routers/
    user.ts
    index.ts          # root router
/pages/api/trpc/[trpc].ts   # handler
```

### Next.js App Router
```
/app/api/trpc/[trpc]/route.ts  # server-side handler
/app/_trpc/
  server.ts          # tRPC server and context
  client.ts          # client setup
  routers/
    user.ts
```

### Express/Fastify
```
/server
  trpc/
    context.ts
    routers/
    index.ts         # root router
  index.ts           # Express setup with *trpcExpress.createExpressMiddleware*
```

---

## Quick Reference: CLI & Tools
- **Testing**: create a mock context and call procedures via `createCaller`.
- **Monorepo**: share the `AppRouter` type between server and client packages.
- **Code generation**: not needed; use TypeScript inference. Some projects use `tsx` to run the server.

Use this skill whenever you need to add, modify, or debug tRPC endpoints in a full-stack TypeScript application. Always ensure type safety across the stack.