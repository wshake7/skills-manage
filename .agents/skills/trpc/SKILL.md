# tRPC Skill

## What is tRPC?
tRPC is a TypeScript RPC framework that provides end‑to‑end type safety without code generation. You define your API procedures (queries, mutations, subscriptions) on the server using `@trpc/server`, and the client (`@trpc/client`) automatically infers the types. tRPC integrates with React via `@trpc/react-query`, Next.js via `@trpc/next`, and many other adapters.

## Key Concepts
- **Router / Procedure**: A router holds procedures. A procedure is a query, mutation, or subscription.
- **Context**: A function that runs on every request, typically used for authentication, database clients, etc.
- **Middleware**: Functions that wrap procedures (e.g., auth middleware, logging).
- **Links**: The client‑side abstraction over the transport layer (HTTP, WebSocket, etc.). Custom links can add headers, logging, etc.
- **Input validation**: Use Zod, Yup, or any validation library. The input type is inferred and shared with the client.
- **Transformers**: Serialize/deserialize data (e.g., superjson for Dates, Maps).
- **TRPCError**: Standard error handling with codes (UNAUTHORIZED, BAD_REQUEST, etc.).

## Repository Structure (trpc/trpc)
```
trpc/
├── packages/
│   ├── server/          # @trpc/server
│   ├── client/          # @trpc/client
│   ├── react-query/     # @trpc/react-query
│   ├── next/            # @trpc/next
│   ├── ...
├── examples/            # Example projects
├── www/                 # Documentation site
└── scripts/             # Build and release scripts
```
- **Monorepo managed with `pnpm workspaces` and `turborepo`**.
- **Build tool**: `tsup` (fast TypeScript bundler).
- **Testing**: Vitest for unit tests, Playwright (or Cypress) for e2e.

## Development Workflow
1. **Clone and install**:
   ```bash
   git clone https://github.com/trpc/trpc.git
   cd trpc
   corepack enable
   pnpm install
   ```
2. **Build all packages** (required before testing):
   ```bash
   pnpm build
   ```
3. **Run tests**:
   ```bash
   pnpm test          # all packages
   pnpm test --filter @trpc/server   # specific package
   ```
4. **Linting and formatting**:
   ```bash
   pnpm lint
   pnpm format
   ```
5. **Type checking**:
   ```bash
   pnpm typecheck
   ```
6. **Start a dev environment** (often examples):
   ```bash
   cd examples/next-prisma-starter
   pnpm dev
   ```

## Contributing
- Use **changesets** (`pnpm changeset`) to describe changes (affects versioning).
- Commit messages follow conventional commits (e.g., `feat:`, `fix:`, `chore:`).
- All PRs require tests and pass CI.

## Common Tasks for AI Agents

### Adding a new middleware
1. Create the middleware function in `packages/server/src/middlewares` (or appropriate location).
2. Middleware receives `opts` with `{ ctx, input, next, ... }`. It must call `next()`. Optionally mutate `ctx` or throw `TRPCError`.
3. Export through the main `@trpc/server` barrel file.
4. Add tests and documentation.

Example:
```ts
import { middleware, TRPCError } from '@trpc/server';

const authMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

### Adding a new adapter (e.g., Fastify, Express)
1. Create a new package under `packages/` (e.g., `packages/fastify`).
2. Implement a request handler that adapts the incoming request to the tRPC internal resolver (`resolveHTTPRequest` from `@trpc/server/http`).
3. Follow the pattern of existing adapters (`packages/server/src/adapters`).
4. Add tests and ensure it passes the tRPC standard test suite.

### Implementing a data transformer
1. Create a transformer object with `serialize` and `deserialize` methods.
2. Export it; users provide it to `initTRPC` via `transformer` option.
3. Examples: `superjson`, `devalue`.

### Debugging
- **tRPC panel**: Enable in dev mode to inspect requests/responses at `http://localhost:<port>/api/trpc-panel`.
- **Logging middleware**: A simple middleware that logs input and output.
- **Client link inspector**: Create a custom link that logs requests and responses.

## Client‑Side Patterns
- Create a typed `trpc` client:
  ```ts
  import { createTRPCReact } from '@trpc/react-query';
  import type { AppRouter } from '../server';
  export const trpc = createTRPCReact<AppRouter>();
  ```
- Use links to modify requests (e.g., attach auth headers via `httpLink` with headers option).
- Splitting routers: Use `t.mergeRouters` to combine routers, keeping type inference intact.

## Important Notes
- The repository uses `@internal` import paths; do not import non‑public APIs.
- Always run `pnpm build` after changes to packages, otherwise dependent packages won’t pick them up.
- The CI pipeline runs a comprehensive test matrix (Node versions, OS).

## References
- Official documentation: [trpc.io](https://trpc.io) (derived from `www/` in the repo).
- Community examples: `examples/` folder.
