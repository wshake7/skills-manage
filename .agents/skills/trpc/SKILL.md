# tRPC Skill

## Overview
tRPC (TypeScript Remote Procedure Call) provides end-to-end type safety between your client and server without code generation. It leverages TypeScript to infer request/response types across the network, enabling a seamless developer experience.

**When to use this skill:** You are working in a codebase that uses tRPC (package `@trpc/server`, `@trpc/client`) or when you need to implement type-safe API communication between a TypeScript server and client (React, Next.js, Node.js, etc.).

## Core Concepts
- **Procedures:** The server endpoints, defined as **queries** (GET), **mutations** (POST/PUT/DELETE), or **subscriptions** (WebSocket).
- **Router:** A collection of procedures, organized hierarchically.
- **Middleware:** Functions that run before a procedure (e.g., authentication, logging).
- **Context:** Request-scoped data (e.g., user, database connection) passed to all procedures and middleware.
- **Client:** The typed API client that mirrors the server router structure, enabling autocompletion and type-checking for inputs and outputs.

## Project Structure (Typical)
```
project/
├── server/
│   ├── trpc.ts          # tRPC instance creation
│   ├── context.ts       # Context factory
│   ├── routers/
│   │   ├── index.ts     # App router (merges sub-routers)
│   │   └── user.ts      # Sub-router for user operations
│   └── index.ts         # Entry, export appRouter type
├── client/
│   ├── trpc.ts          # tRPC client setup
│   └── components/      # React components using tRPC hooks
└── shared/              # Alternatively, import types directly from server
```

## Workflow for AI Agent

### 1. Set up tRPC Server Instance
In `server/trpc.ts`:
```typescript
import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;
// Later: auth middleware, protected procedures
```

### 2. Define Procedures in Routers
In `server/routers/user.ts`:
```typescript
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

### 3. Build the App Router
In `server/routers/index.ts`:
```typescript
import { router } from '../trpc';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
```

### 4. Create Context
In `server/context.ts`:
```typescript
import { CreateNextContextOptions } from '@trpc/server/adapters/next'; // if Next.js
export const createContext = async (opts: CreateNextContextOptions) => {
  return { db: /* your db client */ };
};
```

### 5. Set up tRPC Client
In `client/trpc.ts`:
```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/routers'; // import type only

export const trpc = createTRPCReact<AppRouter>();
```

### 6. Use in React Component
```typescript
import { trpc } from './trpc';

function UserProfile({ id }: { id: string }) {
  const { data, isLoading } = trpc.user.getById.useQuery({ id });
  const mutation = trpc.user.create.useMutation();
  // ...
}
```

## Common Tasks and Guidance

### Adding Authentication Middleware
```typescript
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } }); // user is now non-nullable
});
// protectedProcedure = t.procedure.use(isAuthed);
```

### Error Handling
- Use `TRPCError` to throw typed errors with codes (e.g., NOT_FOUND, BAD_REQUEST, FORBIDDEN).
- On client, query/mutation hooks return `error` property; you can check `error.data.code`.
- Global error formatting: `t.errorFormatter`.

### Input Validation
Always use `zod` for procedure inputs. Define schemas alongside procedures.

### Debugging Type Issues
- If types aren't inferred, ensure the client imports `AppRouter` type correctly.
- For monorepos, ensure proper TypeScript project references.
- Use `trpc.useUtils()` to invalidate queries after mutations.

### Transforming Responses / Payloads
Use `superjson` as a transformer for Date, Map, Set etc.:
```typescript
import superjson from 'superjson';
const t = initTRPC.create({ transformer: superjson });
```

### Next.js App Router Integration
- Use `@trpc/next` with `createNextApiHandler` for pages router.
- For app router: use `fetch request handler` and `createTRPCNext` is not needed; use `createTRPCReact` and `trpcProvider`.

### Testing tRPC
- Call procedures directly on the server without HTTP: `const caller = appRouter.createCaller(mockCtx);` then `caller.user.create(...)`.

## Quick Reference Commands
- Define router: `export const appRouter = router({ ... });`
- Query procedure: `.query(...)`
- Mutation procedure: `.mutation(...)`
- Subscription: `.subscription(...)`
- Create context: `async (opts) => ({ ... })`
- Client setup: `createTRPCReact<AppRouter>()`
- React hook: `trpc.<route>.<procedure>.useQuery(input?)`
- Invalidating: `utils.<route>.<procedure>.invalidate()`

## Pitfalls
- Always import types from server using `import type` to avoid bundling server code on client.
- Middleware order matters: `publicProcedure.use(m1).use(m2)` executes m1 then m2.
- Context is not shared between subscriptions; use wssContext differently.
- Large inputs/outputs: avoid unnecessary data, use selects/picks.

This skill helps you navigate tRPC codebases, implement type-safe APIs quickly, and debug common issues.