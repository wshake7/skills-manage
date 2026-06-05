# trpc Skill

End-to-end typesafe APIs made easy. tRPC allows you to build fully typesafe APIs without schemas or code generation.

## Repository Overview (trpc/trpc on GitHub)

The main tRPC repository is a monorepo managed with pnpm workspaces and TurboRepo. Key directories:

- `packages/` – Core and extension packages:
  - `server` – `@trpc/server` (core server logic)
  - `client` – `@trpc/client` (universal client)
  - `react-query` – `@trpc/react-query` (React bindings with React Query)
  - `next` – `@trpc/next` (Next.js integration)
  - `next/app-dir` – `@trpc/next` app directory support
  - Many other plugins (fastify, express, zod adapter, tanstack-start, etc.)
- `examples/` – Example applications (Next.js, Express, Fastify, React queries, etc.)
- `www/` – Official website and docs
- `scripts/` – Build and utility scripts

## Setup & Common Commands

```bash
# Clone and install
git clone https://github.com/trpc/trpc
cd trpc
pnpm install

# Run all tasks (build, lint, test)
pnpm dev

# Build all packages
pnpm build

# Run tests across all packages
pnpm test

# Lint and format
pnpm lint
pnpm format
```

## Core Concepts

### tRPC Server
- **Procedures**: The building blocks – `query`, `mutation`, or `subscription`.
- **Router**: Groups procedures together.
- **Middleware**: Functions that run before the procedure handler; can modify context or block requests.
- **Context**: Environment data passed to each procedure (e.g., user session, database client).
- **Input validation**: Recommend using Zod schemas via `.input(z.object({...}))`.
- **Output serialization**: Everything is JSON; custom transformers can be used for Dates, Maps, etc.

### Procedure Lifecycle
1. **Input parsing** – Validates raw input (if `.input()` defined).
2. **Middleware chain** – Executes each middleware in order.
3. **Resolver** – Handles the request using the validated input and context.
4. **Response** – The result is serialized and sent to the client.

## Key Packages and Usage Patterns

### `@trpc/server`

Creating a router and procedure:
```ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello ${input.name}!`),
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(({ input, ctx }) => {
      // ctx.db is available from context
      return ctx.db.user.create({ data: input });
    }),
});

export type AppRouter = typeof appRouter;
```

### `@trpc/client`

Consuming the API:
```ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({ url: 'http://localhost:3000/trpc' }),
  ],
});

await trpc.greeting.query({ name: 'World' });
```

### `@trpc/react-query`

Provides React hooks:
```ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './server';

export const trpc = createTRPCReact<AppRouter>();

// In component:
const { data } = trpc.greeting.useQuery({ name: 'World' });
const utils = trpc.useUtils();
```

### `@trpc/next`

For Next.js API routes:
```ts
// pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '~/server/routers/_app';

export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
```

## Common Workflows

### Adding Middleware

```ts
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } }); // pass enriched context
});

// Usage:
const userProfile = protectedProcedure.query(({ ctx }) => ctx.user.profile);
```

### Error Handling

Throw `TRPCError` with a code:
```ts
import { TRPCError } from '@trpc/server';
if (!post) throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
```

### Inferring Types

```ts
type Input = inferRouterInputs<AppRouter>['greeting'];
type Output = inferRouterOutputs<AppRouter>['greeting'];
type Output = inferRouterOutputs<AppRouter>; // full router

export { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
```

## Important TypeScript Utilities

- `inferRouterInputs<R>` – Infers input types for each procedure.
- `inferRouterOutputs<R>` – Infers output types.
- `inferRouterContext<R>` – Infers the context type of a router.
- `ProcedureType` – Enum for query, mutation, subscription.
- `AnyRouter`/`AnyProcedure` – Useful for generic middleware or helpers.

## Testing Procedures

Directly call the resolver via router’s `createCaller`:
```ts
const caller = appRouter.createCaller({ user: null, db: mockDb });
const result = await caller.greeting({ name: 'Test' });
```

For integration tests, spin up a server and use the client.

## Project-Specific Notes

- The repository uses `turbo` for task orchestration; `turbo.json` defines pipelines.
- Packages are versioned with changesets; run `pnpm changeset` to generate version bumps.
- Build outputs are in `dist/` directories; the main entrypoint is `src/index.ts` (or a configured path).
- Example apps are not published; they serve as integration and documentation.

## Contributing

- Always add tests in the same package under `__tests__/`.
- Run `pnpm format` and `pnpm lint` before committing.
- Follow the existing code style (ESLint, Prettier).
- For large features, open an issue first to discuss.

## Resources

- Official docs: https://trpc.io
- Discord: https://trpc.io/discord
- Twitter: https://twitter.com/trpcio
