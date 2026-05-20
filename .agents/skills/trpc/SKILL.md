# tRPC Skill

## Overview
[tRPC](https://github.com/trpc/trpc) provides end-to-end typesafe APIs for TypeScript applications. It eliminates manual type definitions between server and client by inferring types directly from your backend code. Use it to build fast, typesafe APIs with queries, mutations, and subscriptions.

## Core Concepts
- **Router**: Collection of procedures (endpoints) organized hierarchically.
- **Procedure**: A single API endpoint, defined as a query (read), mutation (write), or subscription (real-time).
- **Context**: Per-request state, typically used for authentication, database connections, etc.
- **Middleware**: Reusable logic that runs before/after procedure handlers, e.g., auth checks, logging.

## Project Setup
Install tRPC along with its peer dependencies:
```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query zod
```
The official template uses Next.js, but tRPC works with any framework.

## Typical Workflow
### 1. Define a Backend Router
Create procedures using the builder pattern or the newer **experimental standaline API** (preferred for new projects).

```typescript
// server/_app.ts (Next.js example)
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context<{ user?: { id: string } }>().create();

export const router = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello, ${input.name}!`),
  createUser: t.procedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(({ input, ctx }) => {
      // save to DB
      return { id: '1', ...input };
    }),
});

export type AppRouter = typeof router;
```

### 2. Expose via HTTP Server
Use the tRPC adapter for your framework (e.g., Next.js API route).

```typescript
// pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/_app';

export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
```

### 3. Create a Typesafe Client
Generate the client from the `AppRouter` type.

```typescript
// utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/_app';

export const trpc = createTRPCReact<AppRouter>();
```

### 4. Use in React Components
Wrap your app with the tRPC provider and use hooks.

```tsx
// pages/_app.tsx
import { trpc } from '../utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

```tsx
// components/Greeting.tsx
import { trpc } from '../utils/trpc';

export function Greeting() {
  const { data, isLoading } = trpc.greeting.useQuery({ name: 'World' });
  if (isLoading) return <div>Loading...</div>;
  return <div>{data}</div>;
}
```

## Key Patterns
- **Input Validation**: Use Zod schemas with `.input()` to validate and parse procedure inputs.
- **Authentication Middleware**: Protect procedures by adding middleware that checks `ctx.user`.
  ```typescript
  const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next({ ctx: { ...ctx, user: ctx.user } });
  });
  const protectedProcedure = t.procedure.use(isAuthed);
  ```
- **Error Handling**: Throw `TRPCError` with appropriate codes (BAD_REQUEST, NOT_FOUND, etc.) for controlled errors.
- **Subscriptions**: For real-time features, use the WebSocket transport. Create subscription procedures with `.subscription()` and emit events on the server.
- **Context**: Populate context with request-specific data (user session, DB pool) in `createContext`. Use `async context` for per-request setup.
- **Middleware Chaining**: Stack middleware for logging, validation, rate-limiting, etc.

## Best Practices
- Organize routers by feature domain (e.g., `user.router.ts`, `post.router.ts`).
- Co-locate related procedures within the same router and use nested routers for clarity.
- Use `createTRPCNext` with Next.js for automatic type inference and integration.
- Reuse the `AppRouter` type across your application for consistent types.
- For complex inputs, prefer Zod’s `.transform()` and `.refine()` over manual validation.
- Keep context initialization lightweight; use lazy loading for heavy dependencies.

## References
- Official repository: [trpc/trpc](https://github.com/trpc/trpc)
- Examples: `/examples` folder in the repository
- Documentation site: https://trpc.io (refer to repo for latest versions)