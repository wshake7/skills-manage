# tRPC Skill

## Overview
tRPC enables end-to-end typesafe APIs in TypeScript without code generation. It uses a single source of truth — your procedure definitions — to infer types shared between server and client.

**Repository**: https://github.com/trpc/trpc (monorepo: `packages/server`, `packages/client`, `packages/react`, `packages/next`, etc.)

## Core Concepts

### 1. Routers and Procedures
- **Router**: typed grouping of procedures.
- **Procedure types**: `query`, `mutation`, `subscription`.
- Procedures are defined using a builder (e.g., `t.procedure`).

### 2. Context
Context is created per request and can hold database clients, user sessions, etc. Defined via `createContext` and `createInnerTRPCContext` patterns.

### 3. Middleware
Reusable logic that runs before/after procedures. Used for authentication, logging, etc. Chained via `.use()`.

### 4. Input Validation
Use Zod (or other validators) to define and validate input schemas. The schema types are automatically available on the client.

### 5. Error Handling
Throw `TRPCError` with a code like `NOT_FOUND`, `UNAUTHORIZED`, etc. Wrap procedures with middleware for custom error formatting.

## Quick Setup

### Server
```ts
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello, ${input.name}`),
  secret: t.procedure
    .use(isAuthed) // middleware
    .query(() => 'secret data'),
});

export type AppRouter = typeof appRouter;
```

### Client
```ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000/trpc' })],
});

const greeting = await client.greeting.query({ name: 'World' });
```

## Workflow Guidance

### Adding a New Procedure
1. Define a router or use existing.
2. Add `t.procedure`.
3. (Optional) Chain `.input()` with Zod schema.
4. Chain `.query()` or `.mutation()` with resolver logic.
5. (Optional) Chain `.use()` for middleware.
6. Export router type for client inference.

### Adding Middleware
1. Create middleware with `t.middleware(async ({ ctx, next, input, path }) => { ... })`.
2. Access `ctx` to modify or validate, call `next()` to continue.
3. Use `.use(middleware)` on a procedure or router.

### Context Creation
- Implement `createContext` for each request (e.g., from HTTP headers).
- Use a factory pattern to accept parameters (server, req, res).
- In Next.js, export `createTRPCContext` in `@/trpc/init`.

### Error Handling
```ts
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'User not found',
  cause: originalError,
});
```
Common codes: `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `TIMEOUT`, `INTERNAL_SERVER_ERROR`.

### Testing
- Test procedures directly without HTTP by calling `caller(appRouter)(ctx)`.
- Use `createCallerFactory` to create a caller with mocked context.

### Client Integration
- For React: use `@trpc/react-query` with `trpc.{providerName}.useQuery`.
- For Next.js: use `@trpc/next` for API routes and SSR helpers.
- Use `inferRouterInputs` and `inferRouterOutputs` to extract input/output types.

## AI Agent Guidelines
- Always use TypeScript strict mode; no `any`.
- When modifying procedures, ensure input/output types remain consistent across the client.
- For new features, add Zod validation before mutations.
- Middleware should be composable and not mutate `ctx` destructively.
- Look at `packages/server/src` for core implementation, `packages/client/src` for client links, and `packages/react-query` for hooks.
- Refer to the `examples` directory for common patterns (minimal, next-prisma-starter, etc.).
- When unsure about a type, use `tRPC`'s built-in type helpers (`inferRouterInputs`, `inferRouterOutputs`).
- For async work, prefer `async` resolvers; tRPC handles promises natively.

## Repository Navigation (for contributing)
- **Core server**: `packages/server/src` — `initTRPC`, router, procedure, middleware, error handling.
- **Client**: `packages/client/src` — `createTRPCClient`, links (httpBatch, ws, etc.).
- **React**: `packages/react-query/src` — hooks and provider.
- **Next.js**: `packages/next/src` — API route adapters, SSR helpers.
- **OpenAPI**: `packages/openapi` — OpenAPI generation from tRPC routers.
- Tests for each package help understand expected behavior.
- Run `pnpm install` and `pnpm build` to set up the monorepo; see `CONTRIBUTING.md` for details.