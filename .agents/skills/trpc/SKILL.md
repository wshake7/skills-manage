# tRPC Skill

## Overview
tRPC enables you to define and consume fully type-safe APIs without code generation. Use this skill when building or maintaining any project using tRPC (v10+).

## Key Project Conventions
- `server/` directory for routers and procedures.
- `client/` or `app/` for frontend code.
- Uses `zod` for input validation.
- Context (`ctx`) carries request-scoped data (e.g., session, DB).
- File names typically end in `.router.ts`, `.procedure.ts`.

## Core Concepts

### Routers
- Combine multiple procedures into a single router.
- Export type `AppRouter` for client inference.
```ts
// server/routers/user.ts
import { router, publicProcedure } from '../trpc';

export const userRouter = router({
  list: publicProcedure.query(() => []),
});

export type AppRouter = typeof userRouter; // for client
```

### Procedures
- `query`: read data.
- `mutation`: create/update/delete data.
- `subscription`: stream data.
```ts
import { z } from 'zod';

const createUser = publicProcedure
  .input(z.object({ name: z.string() }))
  .mutation(async ({ input, ctx }) => {
    return await ctx.db.user.create({ data: input });
  });
```

### Context & Middleware
- Define context shape in `trpc.ts`.
- Middleware can augment context or guard routes.
```ts
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } });
});
const protectedProcedure = publicProcedure.use(isAuthed);
```

## Common Workflows

### Creating a New API Endpoint
1. Define a procedure in a router file under `server/routers/`.
2. Add it to the app root router (`server/routers/_app.ts` or `server/api/root.ts` with Next.js).
3. Use it on the client:
```ts
const { data } = trpc.user.list.useQuery();
```

### Adding Validation
- Always define an `.input()` schema using `zod`.
- Reuse schemas across procedures.
```ts
const UserCreateInput = z.object({ name: z.string().min(1), email: z.string().email() });
```

### Authentication & Authorization
- Set user in context (e.g., from JWT/session in Next.js API route).
- Create `protectedProcedure` with middleware that asserts user exists.
- For role-based access, add checks in procedure body.

### Error Handling
- Throw `TRPCError` with appropriate code.
- Client handles errors via `onError` callback in `trpc` configuration or in individual queries.

### Subscriptions (WebSockets)
- Requires `ws` package and a custom HTTP server (or adapters like `@trpc/server/adapters/ws`).
- Subscription procedures return an `observable`.
```ts
const onPost = t.procedure.subscription(async function* () {
  while (true) {
    yield { ... };
    await sleep(1000);
  }
});
```

### Testing
- Use `createCallerFactory` to create a typed caller without a server.
```ts
const caller = appRouter.createCaller({ db, session: null });
const result = await caller.user.list();
expect(result).toEqual([]);
```

## Client Usage Patterns

### React / Next.js
- Wrap app with `TrpcProvider` using `trpc.createTRPCReact<AppRouter>()`.
- Use hooks: `useQuery`, `useMutation`, `useSubscription`.
- For Next.js App Router, use `trpc` from `@trpc/next` and `createTRPCContext` in route handlers.

### Vanilla Client
```ts
const client = createTRPCClient<AppRouter>({ links: [httpLink({ url: '/api/trpc' })] });
const users = await client.user.list.query();
```

## Code Organization & Best Practices
- Split routers by domain: `auth`, `user`, `post`.
- Keep `trpc.ts` as a singleton that exports `t` and `router`.
- Avoid circular imports: place `trpc.ts` in a shared location, export `t` and all router types from it.
- Use `inferRouterInputs` and `inferRouterOutputs` for type inference.
- For large projects, consider multiple smaller routers merged using `t.mergeRouters`.

## Common Pitfalls
- Not validating input – always use `.input()`.
- Passing `undefined` in input when optional fields are expected.
- SSR in Next.js: prevent client-side water-falling by using `ssr: true` and prefetch on server.
- Forgetting to export `AppRouter` type.
- Using relative imports crossing server/client boundaries: keep server code separate.

## Upgrading from v9 to v10
If working with legacy code, note that `createRouter` and `*Middleware` are replaced by `t.router` and `t.middleware`. Use the `trpc migrate` command for automatic migration.