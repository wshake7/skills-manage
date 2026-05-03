# tRPC AI Coding Skill

## Overview
tRPC (TypeScript Remote Procedure Call) enables end-to-end typesafe APIs without code generation or schemas. The server defines procedures (queries, mutations, subscriptions) in a router, and the client obtains a fully typed client to call those procedures. This skill covers the `trpc/trpc` repository structure, common patterns, and concrete workflows for AI agents working with tRPC.

## Key Concepts
- **Router** (`t.router`): Defines a collection of procedures that can be nested.
- **Procedure** (`t.procedure`): An endpoint (query, mutation, or subscription) with optional input validation and middleware.
- **Context** (`createContext`): Per-request data (e.g., auth, database) passed to procedures.
- **Middleware** (`t.middleware`): Reusable logic to enrich context or validate before a procedure runs.
- **Client** (`createTRPCReact`, `createTRPCProxyClient`): Type-safe client that calls procedures using links (httpBatchLink, etc.).
- **Input Validation**: Typically uses Zod schemas via `.input()`.

## Repository Structure (`trpc/trpc`)
The monorepo contains packages:
- `packages/server` – Core server: `initTRPC`, routers, context, middleware.
- `packages/client` – Vanilla tRPC client.
- `packages/react-query` – React bindings for tRPC (wraps @tanstack/react-query).
- `packages/next` – Next.js pages router and app router adapters.
- `packages/tests` – Integration and unit tests (Vitest).
- `www` – Documentation website (Docusaurus).

When contributing, look at existing tests for patterns, and follow the CONTRIBUTING.md.

## Common Workflows

### 1. Setting Up a Standalone tRPC Server + Client
```ts
// server.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello, ${input.name}`),
  createUser: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      // store user
      return { id: '123', name: input.name };
    }),
});

export type AppRouter = typeof appRouter;
```
```ts
// client.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({ url: 'http://localhost:3000/api/trpc' }),
  ],
});

const greeting = await trpc.greeting.query({ name: 'World' });
const newUser = await trpc.createUser.mutate({ name: 'Alice' });
```

### 2. Integrating with Next.js App Router
Use `@trpc/next` with app router:
- Create a tRPC client in a file (e.g., `src/trpc/client.ts`).
- In your layout, wrap children with the provider.
- Use the client to call procedures in Server Components via `api` property of router.
- For Client Components, use `trpc.xxx.useQuery()`.

```ts
// src/trpc/server.ts
import { initTRPC } from '@trpc/server';
import { createContext } from './context';

export const t = initTRPC.create({ ... });
```
```ts
// src/trpc/client.ts
import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from './server';
export const trpc = createTRPCReact<AppRouter>();
```
```tsx
// In a Client Component:
import { trpc } from '@/trpc/client';
function MyComponent() {
  const utils = trpc.useUtils();
  const { data } = trpc.greeting.useQuery({ name: 'World' });
  return <div>{data}</div>;
}
```
Server Components can call procedures directly:
```tsx
import { appRouter } from '@/trpc/server';
export default async function Page() {
  const caller = appRouter.createCaller({ /* context */ });
  const greeting = await caller.greeting({ name: 'World' });
  return <div>{greeting}</div>;
}
```

### 3. Creating a Middleware
```ts
const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new Error('Unauthorized');
  return next({ ctx: { ...ctx, user: ctx.user } }); // enrich context
});
const protectedProcedure = t.procedure.use(authMiddleware);
```

### 4. Adding Context
```ts
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
export async function createContext(opts: CreateNextContextOptions) {
  const user = await getUserFromSession(opts.req);
  return { user, db };
}
// Pass to initTRPC or createCaller.
```

## Important Commands
- **Bootstrap a tRPC app**: `npx create-t3-app@latest` (includes tRPC + Next.js).
- **Run local dev**: `pnpm dev` (from root of trpc/trpc for development).
- **Run tests**: `pnpm test` (Vitest) or `pnpm test -- filter <test>`.
- **Build**: `pnpm build` (turborepo builds all packages).
- **Lint**: `pnpm lint`.

## Tips for AI Agents
- **Type Inference**: Always export the `AppRouter` type from the server for the client to consume. Use `typeof appRouter`.
- **Error Handling**: tRPC catches errors thrown in procedures; format them using `TRPCError` for client-visible messages.
- **Nested Routers**: Use `t.router({ sub: subRouter })` to organize.
- **Batch Calls**: Use `httpBatchLink` to reduce HTTP requests.
- **SSR/SSG**: Use `createServerSideHelpers` from `@trpc/react-query/server` to prefetch data.
- **Testing**: Write tests that call procedures directly via `createCaller` with mocked context.
- **When reading source**: Examine `packages/server/src` for core types, `packages/client/src` for client link architecture, and `packages/next/src` for Next.js adapters.
- **Common Pitfalls**: Ensure input validation schemas are exported and match between server and client; proxy object shape may cause infinite type recursion if not careful with generics.

## Further Resources
- Documentation: https://trpc.io
- GitHub: https://github.com/trpc/trpc
- Contributing guide: `CONTRIBUTING.md` in repo.
