# tRPC Skill

tRPC enables building end-to-end typesafe APIs in TypeScript without code generation. This skill covers the core patterns and workflows for working with the tRPC monorepo (`trpc/trpc`) and integrating tRPC into full-stack TypeScript projects.

## Overview

- **Server:** Define routers with queries, mutations, and subscriptions. Procedures use input parsers (Zod) and return typed responses.
- **Client:** Import the `AppRouter` type and call procedures with full auto-completion and type inference.
- **No code gen** – types flow automatically between server and client.
- **Common integrations:** Next.js App Router, Express, standalone Node, React Query.

## Project Setup (Monorepo Recommended)

```
my-project/
├── packages/
│   ├── api/          # Server-side tRPC router definitions
│   └── client/       # Client-side tRPC hooks (React) or Vanilla client
├── apps/
│   └── web/          # Next.js app consuming the tRPC client
```

### Install Core Packages

```bash
# Server
npm install @trpc/server zod

# Client (React + React Query integration)
npm install @trpc/client @trpc/react @tanstack/react-query

# Optional: Next.js adapter
npm install @trpc/next
```

## Defining a tRPC Router (Server)

### 1. Initialize tRPC and Create Context

```ts
// packages/api/src/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import superjson from 'superjson';

// Define context type
export const createContext = async (opts: CreateHTTPContextOptions) => {
  // Add auth, database connections, etc.
  const user = getUserFromRequest(opts.req);
  return { user, db: getDatabase() };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson, // Optional: for Date, Map, Set serialization
});

// Export reusable middleware helpers
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const router = t.router;
export const middleware = t.middleware;
```

### 2. Define a Feature Router

```ts
// packages/api/src/routers/user.ts
import { publicProcedure, protectedProcedure, router } from '../trpc';
import { z } from 'zod';

export const userRouter = router({
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const user = await ctx.db.user.findUnique({ where: { id: input.id } });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    return user;
  }),

  updateProfile: protectedProcedure
    .input(z.object({ name: z.string().min(2) }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: { name: input.name },
      });
    }),
});
```

### 3. Combine Routers and Export AppRouter Type

```ts
// packages/api/src/root.ts
import { router } from './trpc';
import { userRouter } from './routers/user';

export const appRouter = router({
  user: userRouter,
  // other routers...
});

export type AppRouter = typeof appRouter;
```

### 4. Create HTTP Server (Standalone) or Connect to Next.js App Router

**Standalone (Node/Express):**

```ts
// server.ts
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './packages/api/src/root';
import { createContext } from './packages/api/src/trpc';

const server = createHTTPServer({
  router: appRouter,
  createContext,
});
server.listen(3001);
```

**Next.js App Router (Recommended Pattern):**
- Define a tRPC client/provider for client components, and use `createCaller` for server components.

See full guide in tRPC docs: [Next.js App Directory](https://trpc.io/docs/client/nextjs/app-dir).

## Setting Up the Client

### React Client with React Query Hooks

```ts
// packages/client/src/trpc.ts
import { createTRPCReact } from '@trpc/react';
import type { AppRouter } from '../../api/src/root'; // Import type only

export const trpc = createTRPCReact<AppRouter>();
```

Then create a provider component:

```tsx
// packages/client/src/Provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';
import { useState } from 'react';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc', // API endpoint
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### Using Procedures in Components

**Client Component (with hooks):**

```tsx
'use client';
import { trpc } from '@/client/trpc';

export function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = trpc.user.getById.useQuery({ id: userId });
  const mutation = trpc.user.updateProfile.useMutation();

  const handleUpdate = async () => {
    await mutation.mutateAsync({ name: 'New Name' });
    // Invalidate query to refresh data
    queryClient.invalidateQueries(['user.getById', { id: userId }]);
  };

  return <div>...</div>;
}
```

**Server Component (Next.js App Router):**
Use `createCaller` to execute procedures server-side without HTTP.

```tsx
// app/page.tsx
import { appRouter } from '@/api/root';
import { createContext } from '@/api/trpc';

async function HomePage() {
  const caller = appRouter.createCaller(await createContext(/* mock headers */));
  const user = await caller.user.getById({ id: '1' });
  return <div>{user.name}</div>;
}
```

## Common Patterns & Best Practices

### Input Validation
Always use Zod schemas with `.input()`. tRPC auto-generates types from schemas.

```ts
.input(z.object({
  page: z.number().min(1).default(1),
  limit: z.number().max(100).default(20),
}))
```

### Middleware for Auth
```ts
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const protectedProcedure = t.procedure.use(isAuthed);
```

### Error Handling
Throw `TRPCError` with appropriate HTTP-like codes (`BAD_REQUEST`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `INTERNAL_SERVER_ERROR`).

### Reusable Routers (Merging)
```ts
const appRouter = router({
  user: userRouter,
  admin: adminRouter,
  ...anotherRouter, // spread object router
});
```

### Data Transformation (superjson)
Use `superjson` as transformer for Date, Map, Set, etc. Install and set in `initTRPC`: `transformer: superjson`, and on client link: `transformer: superjson`.

### Testing
Use `createCallerFactory` for isolated unit testing of procedures:

```ts
import { createCallerFactory } from '@trpc/server';
const createCaller = createCallerFactory()(appRouter);
const caller = createCaller(mockContext);
await caller.user.create({ name: 'Test' });
```

## Reference Links
- [tRPC Documentation](https://trpc.io)
- [GitHub Repository](https://github.com/trpc/trpc)
- [Examples (with Next.js, Express, etc.)](https://github.com/trpc/trpc/tree/main/examples)
