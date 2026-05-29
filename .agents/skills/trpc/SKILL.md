# tRPC

TypeScript end-to-end typesafe APIs without code generation.

## Overview

tRPC lets you create APIs where the client can infer input/output types directly from the server, ensuring compile‑time safety. It uses TypeScript generics and a well‑defined procedure architecture. The codebase is a pnpm monorepo with packages for server adapters, client, React hooks, Next.js integration, and more.

## Installation

```bash
pnpm add @trpc/server @trpc/client
```

Add `@trpc/react-query` if using React.

## Core Concepts

- **Procedure**: The base unit (query, mutation, subscription). Defined with `.input(validator).query(resolver)`.
- **Router**: A collection of procedures, built with `t.router(...)`.
- **Context**: Shared data passed to every procedure (e.g., database connections, session).
- **Middleware**: Functions that wrap procedures for concerns like authentication, logging.
- **Type Inference**: The client automatically derives typed hooks from the `AppRouter` type.

## Project Structure (monorepo)

- `packages/server` – Core server library.
- `packages/client` – Browser‑side generic client.
- `packages/react` – React bindings (hooks).
- `packages/next` – Next.js integration (API routes).
- `packages/playground` – GraphiQL‑like playground.
- `examples/` – Working setups (Express, Fastify, Next.js, standalone).

## Core Workflows

### 1. Create a tRPC Instance

```ts
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
```

Use `initTRPC.context<YourContext>()` to type the context.

### 2. Define Procedures

```ts
import { z } from 'zod';

export const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello, ${input.name}!`),
  createUser: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      // DB logic
      return { id: '1', name: input.name };
    }),
});

export type AppRouter = typeof appRouter;
```

### 3. Serve the API

**Express adapter:**

```ts
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';

const app = express();
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
app.listen(3001);
```

**Standalone (http):**

```ts
import { createHTTPServer } from '@trpc/server/adapters/standalone';
createHTTPServer({ router: appRouter, createContext }).listen(3001);
```

### 4. Create the Client

```ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({ url: 'http://localhost:3001/trpc' }),
  ],
});

// Type‑safe call
const greeting = await trpc.greeting.query({ name: 'World' });
```

### 5. Use with React

Wrap your app with `TRPCProvider`, then use typed hooks:

```tsx
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './server';

export const trpc = createTRPCReact<AppRouter>();

// In a component
const { data } = trpc.greeting.useQuery({ name: 'World' });
const mutation = trpc.createUser.useMutation();
```

### 6. Adding Middleware / Context

```ts
const t = initTRPC.context<{ user: User | null }>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, user: ctx.user } });
});

const protectedProcedure = t.procedure.use(isAuthed);
```

## Key Files

- `packages/server/src/core/internals/procedure.ts` – Procedure builder implementation.
- `packages/server/src/core/router.ts` – Router building and type merging.
- `packages/client/src/links/httpBatchLink.ts` – HTTP transport layer.
- `packages/react/src/createTRPCReact.tsx` – React integration entry.

## Common Patterns & Troubleshooting

- **Input validation**: Always use `.input(zodSchema)`. Without it the input is `void` and the client will reject extra properties.
- **Path aliases**: In monorepos, ensure `@trpc/server` and `@trpc/client` are on the same major version.
- **Type inference**: Export the `AppRouter` type from the server; import it only as a type on the client (no runtime dependency).
- **Errors**: Throw `TRPCError` for structured client‑friendly errors.
- **batching**: By default, queries are batched; use `httpLink` for single requests.

## Tips for AI Assistance

- When generating code, always prefer `.input(zod)`. Include validators even in examples.
- For new tRPC setups, guide the user to create a shared `appRouter` file.
- If someone asks for a “tRPC server”, clarify which adapter they need (Express, Fastify, Next.js, etc.).
- Check that imports from `@trpc/server` or `@trpc/client` match the installed versions.
- For performance, mention splitting routers and using `t.mergeRouters`.
- The monorepo uses pnpm workspaces; build with `pnpm build` in the root.

## Resources

- Official docs: https://trpc.io
- GitHub repo: https://github.com/trpc/trpc
- Examples directory in the repo for working demos.
