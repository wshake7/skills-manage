# tRPC Skill

## Overview
tRPC is a TypeScript RPC framework that enables end-to-end typesafe APIs without code generation. It shares types between client and server, ensuring compile-time safety. Use it for building full-stack TypeScript applications with a seamless developer experience.

## Key Concepts
- **Router**: Organizes procedures (endpoints) into a tree.
- **Procedure**: An API endpoint (query, mutation, or subscription).
- **Context**: Per-request data (e.g., user session, database connection) passed to procedures.
- **Middleware**: Functions that run before a procedure for auth, logging, etc.
- **Input Validation**: Use Zod (or other libraries) to parse and validate inputs.

## Project Setup
### Starter Template
```bash
npm create t3-app@latest
# or
npx create-trpc-app
```

### Manual Installation
```bash
npm install @trpc/server @trpc/client zod
```

### Basic Server (Express/Node)
```ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  hello: t.procedure
    .input(z.string())
    .query(({ input }) => `Hello, ${input}!`),
});

export type AppRouter = typeof appRouter;
```

### Basic Client
```ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000/trpc' })],
});

const result = await client.hello.query('world');
```

## Core Usage Patterns

### Defining Procedures
- **Query** (`t.procedure.query`) – Fetch data, idempotent.
- **Mutation** (`t.procedure.mutation`) – Create/update/delete data.
- **Subscription** (`t.procedure.subscription`) – Real-time data (over WebSockets).

Always validate input with `.input(zodSchema)`. Parse query parameters on the server, never trust client data.

### Context and Middleware
```ts
const t = initTRPC.context<{ user?: { id: string } }>().create();

// Middleware example: check auth
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } });
});

const authedProcedure = t.procedure.use(isAuthed);
```

### Error Handling
Use `TRPCError` with appropriate codes (`BAD_REQUEST`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `INTERNAL_SERVER_ERROR`). On the client, handle errors with try/catch or `.catch()`.

### Subscriptions
Require WebSocket transport. Example:
```ts
// Server
import { observable } from '@trpc/server/observable';
t.router({
  onUpdate: t.procedure.subscription(() => {
    return observable((emit) => {
      // emit.next(data)
    });
  }),
});

// Client: use @trpc/client with wsLink
```

## Integration with Frameworks
- **Next.js**: Use `@trpc/next` for API routes and React hooks.
- **React Query**: `@trpc/react-query` provides hooks (useQuery, useMutation) with caching.
- **Express/Fastify**: `@trpc/server/adapters/express` or `fetchRequestHandler` for other adapters.

## Data Fetching with React Query
```tsx
// Wrap app with providers
import { trpc } from '../utils/trpc';

function MyComponent() {
  const hello = trpc.hello.useQuery('world');
  const mutation = trpc.createItem.useMutation();
  return <div>{hello.data}</div>;
}
```

## Best Practices
- **Keep routers small** – split into separate files, merge with `t.mergeRouters` or `t.lazy`.
- **Type-safe links** – Use `httpBatchLink` for batching multiple requests.
- **Avoid nested callbacks** – prefer async/await.
- **Error codes** – Specific codes help client-side handling.
- **Context** – Create per-request context for database connections, not singletons.

## Common Workflows
### Adding a New Endpoint
1. Define a Zod schema (if input needed).
2. Add a procedure to the router (`query`, `mutation`, `subscription`).
3. Implement the resolver function.
4. Export the type and use on the client.

### Debugging
- Use `trpc` logger middleware for development.
- Inspect client-side errors with `error.shape`.
- Enable TypeScript strict mode for full type safety.

### Testing
- Use `createCaller` to call procedures without a server.
- Assert types with `expectTypeOf` from `tinyrainbow` or `vitest`.

## Important Notes
- tRPC requires a matching version between `@trpc/server` and `@trpc/client`.
- For v11+, `initTRPC` replaces `t` from `@trpc/server`; middleware API changed.
- The repository is a monorepo, so contributions follow specific guidelines (see CONTRIBUTING.md).
- tRPC doesn’t enforce REST or GraphQL conventions – design APIs around your domain.

## References
- Official docs: https://trpc.io
- GitHub: https://github.com/trpc/trpc
- Example apps: https://github.com/trpc/examples
