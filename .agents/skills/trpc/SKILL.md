# tRPC Skill

End-to-end type-safe remote procedure calls for TypeScript. Use this skill when building APIs with tRPC or contributing to the tRPC monorepo.

## Core Concepts

- **Router**: groups procedures (queries, mutations, subscriptions).
- **Procedure**: a function with validated input and typed output.
- **Query**: reads data (GET).
- **Mutation**: modifies data (POST).
- **Subscription**: real-time event stream (WebSocket).
- **Context**: per-request data (user, session).
- **Middleware**: reusable logic applied to procedures.

## Using tRPC in a Project

### 1. Server Setup
Choose an adapter: Express, Fastify, Next.js, standalone HTTP.
```ts
// server/index.ts
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

export const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  greeting: publicProcedure
    .input(z.string())
    .query(({ input }) => `Hello ${input}`),
});

export type AppRouter = typeof appRouter;

createHTTPServer({ router: appRouter }).listen(3000);
```

### 2. Client Setup
```ts
// client/index.ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';

const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000' })],
});

const greeting = await trpc.greeting.query('World');
```

### 3. React Integration (@trpc/react-query)
```tsx
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const trpc = createTRPCReact<AppRouter>();

const client = trpc.createClient({
  links: [httpBatchLink({ url: '/api/trpc' })],
});

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Greeting />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Greeting() {
  const { data } = trpc.greeting.useQuery('World');
  return <div>{data}</div>;
}
```

### 4. Middleware & Authentication
```ts
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } });
});

const protectedProcedure = t.procedure.use(isAuthed);
```

### 5. Input Validation
Use Zod, Yup, or any validator with a `.parse()` method.
```ts
import { z } from 'zod';

const userRouter = router({
  getById: publicProcedure.input(z.object({ id: z.string() })).query(() => {}),
});
```

### 6. Subscriptions
```ts
import { observable } from '@trpc/server';

const subRouter = router({
  onData: publicProcedure.subscription(() =>
    observable<number>((emit) => {
      const timer = setInterval(() => emit.next(Date.now()), 1000);
      return () => clearInterval(timer);
    })
  ),
});
```

## Contributing to the tRPC Repository

### Monorepo Layout
- **packages/server**: core server runtime.
- **packages/client**: HTTP client (links, batching).
- **packages/react-query**: React bindings.
- **packages/next**: Next.js adapter.
- **packages/tests**: integration tests across adapters.
- **www**: documentation site.
- **examples**: minimal reproduction setups.

### Development Workflow
1. **Clone & Install**:
   ```bash
   git clone https://github.com/trpc/trpc.git
   cd trpc
   pnpm install
   ```
2. **Build All Packages**:
   ```bash
   pnpm build
   ```
3. **Run Tests**:
   - Unit: `pnpm test`
   - Integration (multiple adapters): `pnpm test:integration`
   - E2E: `pnpm test:e2e`
4. **Lint & Typecheck**:
   ```bash
   pnpm lint
   pnpm typecheck
   ```
5. **Developing a Package**:
   - Navigate to the package directory (e.g., `cd packages/server`).
   - Start watching: `pnpm dev`.
   - Use the `examples` folder to validate changes.

### Adding a Feature
- Ensure TypeScript strictness is maintained.
- Add tests in the appropriate package’s `__tests__` directory.
- If a new adapter, follow the pattern in existing adapters (e.g., `packages/fastify`).
- Documentation updates go into `www/docs`.

### Testing Across Adapters
The integration test suite uses test matrices to run the same test logic against different server/client combinations. Look at `packages/tests/server` for patterns.

### Common Build Commands
- `pnpm turbo run build` – builds all packages with caching.
- `pnpm changeset` – generate a changelog entry (if applicable).

## Common Patterns

- **Error Handling**: throw `TRPCError` with appropriate codes (`NOT_FOUND`, `BAD_REQUEST`, etc.).
- **File Uploads**: use `createUploadthing` or `trpc-openapi` plus multipart.
- **Subscriptions with WebSockets**: combine with `@trpc/server/adapters/ws`.
- **Sharing types with monorepos**: export `AppRouter` from a shared package.
- **Code Generation / OpenAPI**: consider `trpc-openapi` for REST compatibility.

## Resources
- Official Docs: https://trpc.io
- GitHub: https://github.com/trpc/trpc
- Discord: https://trpc.io/discord
