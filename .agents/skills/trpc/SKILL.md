# tRPC Codex Skill

## Overview
tRPC is a TypeScript framework for building end-to-end typesafe APIs. It eliminates the need for code generation by inferring types directly from your server code, giving you full autocompletion and error detection on the client.

## Repository Structure (trpc/trpc monorepo)
The main tRPC repository is a monorepo with the following key packages:

- `packages/server` – Core server-side tRPC (procedures, routers, context, middleware).
- `packages/client` – Core client-side tRPC (links, client creation, error handling).
- `packages/next` – Integration for Next.js (pages and app router, `createTRPCNext`).
- `packages/react-query` – React Query bindings (`trpc.xxx.useQuery`, etc.).
- `packages/tests` – Integration and end-to-end tests.
- `www/` – Documentation website (Docusaurus).
- `examples/` – Example projects for various setups.

## Core Concepts

### Procedures
Procedures are the building blocks of a tRPC API. They can be queries (read), mutations (write), or subscriptions (real-time).

```ts
import { initTRPC } from '@trpc/server';
const t = initTRPC.create();

export const appRouter = t.router({
  greet: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello ${input.name}`),
  createUser: t.procedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(({ input }) => { /* ... */ })
});
```

### Routers
Group related procedures using `t.router`. Routers can be nested.

### Context
Context is created per-request and is accessible inside all procedures. Use it for authentication, database connections, etc.

```ts
const t = initTRPC.context<{ user?: User }>().create();
// In procedure: ({ ctx }) => { ctx.user }
```

### Middleware
Middleware runs before a procedure, perfect for authentication, logging, or input enrichment.

```ts
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } }); // pass augmented ctx
});
const authedProcedure = t.procedure.use(isAuthed);
```

### Error Handling
Use `TRPCError` class to throw typed errors that the client can catch.

```ts
throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
```

On the client, errors are wrapped in `TRPCClientError`.

## Client Setup

```ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({ url: 'http://localhost:3000/api/trpc' }),
  ],
});

// Usage
const greeting = await trpc.greet.query({ name: 'World' });
```

For React, use `@trpc/react-query` with its hooks (`trpc.greet.useQuery`).

## Working with the Repository

### Setup
- The monorepo uses **pnpm** workspaces. Install pnpm if needed.
- Clone and install: `pnpm install`
- Build all packages: `pnpm build`
- Run tests: `pnpm test` (or `pnpm test -r` for specific packages)
- Lint: `pnpm lint`

### Development Workflow
1. Make changes in relevant packages.
2. Use `pnpm dev` (if available) for watch mode.
3. Add/update tests in the `packages/*/test` folders.
4. Check examples in `examples/` – they serve as integration tests.
5. Submit a PR following the project’s CONTRIBUTING.md.

### Common Patterns
- Input validation is almost always done with **Zod** (import from `zod`).
- In Next.js, use `createTRPCNext` to set up the provider with `httpBatchLink` and React Query.
- For server-side calls (e.g., in `getServerSideProps`), use `createCallerFactory` from `@trpc/server`.
- Middleware can be composed: `t.procedure.use(auth).use(logger)`.

## Troubleshooting
- **Types not working on client**: Ensure the `AppRouter` type is exported and imported correctly; restart the TypeScript server if needed.
- **CORS errors**: Configure your server to allow the client’s origin.
- **Batching not working**: Verify the client is using `httpBatchLink` and the server supports batching (enabled by default).
- **Slow types**: In some cases splitting routers and using `inferRouterInputs`/`inferRouterOutputs` helps.

## Further Reading
- Official docs: https://trpc.io
- GitHub: https://github.com/trpc/trpc
- Discord community for real-time help.