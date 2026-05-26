# tRPC Skill

## Overview
tRPC is a TypeScript-first RPC framework that lets you build fully typesafe APIs without code generation. The server defines procedures (queries/mutations) in routers, and the client gets inferred types for those procedures, enabling end-to-end type safety.

## Key Concepts
- **Router**: Collection of procedures under a namespace. Nested routers allowed.
- **Procedure**: A resolver that receives a context, optional input, and returns data. Built using `publicProcedure` (or `.middleware()`).
- **Context**: Created per request; carries auth data, database connections, etc.
- **Middleware**: Functions that wrap procedures, can transform context or reject requests.
- **Input Validation**: Usually done with Zod, input schema attached via `.input(zodObject)`.

## Project Structure (Typical)
```
src/
├── server/
│   ├── api/
│   │   ├── routers/
│   │   │   ├── post.ts          # router + procedures
│   │   │   └── ...
│   │   ├── root.ts              # tRPC root router
│   │   ├── trpc.ts              # createTRPCContext, router, publicProcedure
│   │   └── index.ts             # tRPC server adapter
export (app router, callbacks)
│   └── ...
├── lib/
│   ├── trpc/                 # optional shared helpers
│   └── ...
├── components/
├── app/                      # Next.js App Router example
│   ├── api/
│   │   └── trpc/[trpc]/
│   │       └── route.ts      # adapter handler
│   └── ...
└── trpc/                     # for mono-repo React client setup
    └── client.ts
```

## Common Workflows

### 1. Define a Router and Procedures
```ts
// server/api/routers/post.ts
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const postRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({ where: { id: input.id } });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),
  create: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({ data: input });
    }),
});
```

### 2. Merge Routers into Root Router
```ts
// server/api/root.ts
import { postRouter } from "./routers/post";
import { router } from "../trpc";

export const appRouter = router({
  post: postRouter,
});

export type AppRouter = typeof appRouter; // for client type inference
```

### 3. Create Context and Adapter (Next.js App Router Example)
```ts
// server/api/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

const t = initTRPC.context<typeof createTRPCContext>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  // get session, db, etc. from request headers/cookies
  return { db: /* prisma client */ };
}

// server/api/router.ts
import { appRouter } from "./routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
}
```

### 4. Setting Up the Client
```ts
// lib/trpc/client.ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/api/root";

export const trpc = createTRPCReact<AppRouter>();
```
Then in React, wrap with Provider and use `trpc.post.getById.useQuery({ id })`.

### 5. Server-Side Calling (e.g., getServerSideProps, RSC)
```ts
// Using caller (no adapter) – ideal for server-side fetching
import { createCallerFactory } from "@trpc/server";
import { appRouter } from "@/server/api/root";

const createCaller = createCallerFactory(appRouter);
const caller = createCaller(await createTRPCContext());
const post = await caller.post.getById({ id: "1" });
```

## Middleware
- Use t.middleware to create reusable logic (auth, logging).
- Chain with `.use()` before defining procedures.
- Common pattern: `protectedProcedure` that verifies context.session.

```ts
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});
export const protectedProcedure = t.procedure.use(isAuthed);
```

## Input/Output Validation
- Zod is the standard; use `.input()` for input validation, `.output()` for output.
- The framework can also infer types without explicit `.output()` if the return type is declared.

## Error Handling
- Throw `TRPCError` with codes: BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, etc.
- Global error formatting via `initTRPC` options `errorFormatter`.

## Testing
- Use `createCallerFactory` to test procedures directly without HTTP.
- Example with Vitest:
```ts
import { createCallerFactory } from "@trpc/server";
import { appRouter } from "@/server/api/root";

const createCaller = createCallerFactory(appRouter);
const caller = createCaller({ db: mockDb });
const result = await caller.post.getById({ id: "1" });
expect(result.title).toBe("...");
```

## Integration Adapters
- **Next.js**: `@trpc/server/adapters/next` or `@trpc/server/adapters/fetch`
- **Express**: `@trpc/server/adapters/express`
- **Standalone**: `@trpc/server/adapters/standalone`
- **Fastify**, AWS Lambda, etc.

## Code Generation and Monorepos
- For large schemas, use `trpc-panel` or `create-t3-app` stack.
- Use `@trpc/client` with `httpBatchLink` for batching requests.
- In monorepos, share the `AppRouter` type via a shared package.

## Best Practices
- Keep routers focused; use sub-routers for domain separation.
- Use `ctx` for dependency injection (db, auth, logger).
- Always validate inputs with Zod for runtime safety.
- Use `TRPCError` for proper error codes.
- For Next.js, leverage tRPC with React Query for caching and optimistic updates.

## Troubleshooting
- **Type errors on client**: Ensure `AppRouter` type is exported and imported correctly.
- **CORS issues**: Set headers in fetch adapter or use `next.config.js` for Next.js.
- **SSR/SSG**: Use `ssr: true` in `createTRPCNext` and prefetch queries server-side.
- **Batching**: Default `httpBatchLink` batches requests; turn off if needed per-call.
- **Context creation**: Must be synchronous or return a promise; use async if DB queries needed.

## Using the tRPC Repo (Contributing)
- Repository: `trpc/trpc`
- Monorepo with packages: `@trpc/server`, `@trpc/client`, etc., under `/packages`.
- Build: `pnpm` and turborepo; check `pnpm install && pnpm build`.
- Tests: per-package with `vitest`; run `pnpm test`.
- For adding a new adapter, follow existing patterns in `/packages/server/src/adapters`.
- Doc site: `/www` (Nextra).
