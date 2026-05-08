# tRPC Skill

## Overview
tRPC enables typesafe remote procedure calls between a TypeScript server and client without code generation. All types are inferred from the server routers and automatically shared with the client.

## Core Concepts
- **Router**: collection of procedures.
- **Procedure**: endpoint defined with `.query()` (read) or `.mutation()` (write). Always use input validation via Zod (or other validators).
- **Context**: shared object passed to every procedure, typically used for authentication, database connections, etc.
- **Middleware**: reusable logic run before procedures (e.g., auth checks).

## Server Setup (Node.js example)
```typescript
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello, ${input.name}!`),
  createUser: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      // mutate data
      return { id: '1', ...input };
    }),
});

export type AppRouter = typeof appRouter;
```

For Next.js or other frameworks, use the corresponding adapter (e.g., `@trpc/next`).

## Client Setup
### Create a client
```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server';

export const trpc = createTRPCReact<AppRouter>();
```

### Wrap with provider
```tsx
import { trpc } from '../utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc',
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <YourComponent />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### Use in components
```tsx
import { trpc } from '../utils/trpc';

export function Greeting() {
  const greeting = trpc.greeting.useQuery({ name: 'World' });
  const createUser = trpc.createUser.useMutation();

  return (
    <div>
      <p>{greeting.data}</p>
      <button onClick={() => createUser.mutate({ name: 'Alice' })}>
        Create user
      </button>
    </div>
  );
}
```

## Workflow Guidance
1. **Define Zod schemas** for inputs.
2. **Create routers** with `.query()` and `.mutation()` using those schemas.
3. **Expose the router** via a server adapter (Express, Next.js, etc.). Export the `AppRouter` type.
4. **Generate the client** with `createTRPCReact` passing the `AppRouter` type.
5. **Consume in components** with full autocomplete and type safety.

## Middleware & Context
- Set up context in `create` method:
  ```typescript
  const t = initTRPC.context<{ user?: { id: string } }>().create();
  ```
- Middleware example:
  ```typescript
  const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next({ ctx: { user: ctx.user } });
  });
  const authedProcedure = t.procedure.use(isAuthed);
  ```

## Error Handling
Throw `TRPCError` from procedures. Client can catch errors with `.onError` or handle via React Query error states.

## File Organization (recommended)
```
server/
  trpc.ts          # initTRPC, context, middleware
  routers/
    user.ts        # user-related procedures
    post.ts
    index.ts       # merge routers
  index.ts         # appRouter
client/
  trpc.ts          # client setup
pages/api/trpc/[trpc].ts  # Next.js API route handler
```

## Important Notes
- Always use `input` validation. Unvalidated inputs break type safety.
- Use `httpBatchLink` for batching requests in production.
- tRPC works with any HTTP server, but Next.js is most common.
- For subscriptions, tRPC uses WebSockets (via `@trpc/server/adapters/ws`).

## Resources
- Official docs: https://trpc.io
- GitHub: https://github.com/trpc/trpc
