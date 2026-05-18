# tRPC Skill

## Overview
tRPC is a TypeScript RPC framework for building end-to-end typesafe APIs. It eliminates the need for schemas or code generation by leveraging TypeScript types directly. The core packages are `@trpc/server` and `@trpc/client`, with adapters for Next.js, React Query, and others.

## Repository Structure (Monorepo)
- `packages/server`: Core server-side implementation, router, procedure definitions, middleware, context, subscriptions.
- `packages/client`: Client-side proxy and links (HTTP, WebSocket, logger).
- `packages/next`: Next.js integration (`createNextApiHandler`, etc.).
- `packages/react-query`: React Query bindings.
- `packages/playground`: Built-in API playground.
- `packages/tests`: Integration and e2e tests.
- `www/`: Documentation site (Nextra).
- `examples/`: Example projects (minimal, next-basic, etc.).
Root configs: `pnpm-workspace.yaml`, `turbo.json`, `eslint`/`prettier`.

## Key Concepts
- **Router**: A collection of procedures. Built with `t.router({...})`.
- **Procedure**: A function for a specific query, mutation, or subscription. Call `t.procedure.input(...).query(...)`.
- **Context**: Per-request information passed to all procedures. Created by `createContext` and accessed via `ctx`.
- **Middleware**: Functions that wrap procedures, can modify context or validate inputs.
- **Input Validation**: Use `zod` (or other libraries) with `.input(zodSchema)`.
- **Output Serialization**: Optional output transformer, e.g., using superjson.

## Common Workflows

### Adding a new procedure to an existing router
1. Locate the router file (e.g., `src/server/routers/user.ts`).
2. Add a new field to the router using the procedure builder.
   ```ts
   userRouter = router({
     list: publicProcedure.query(async ({ ctx }) => { ... }),
     byId: publicProcedure.input(z.string()).query(...),
     create: publicProcedure.input(z.object({...})).mutation(...),
   });
   ```
3. Export the router and merge into the appRouter.

### Creating a new middleware
1. Use `t.middleware(async ({ ctx, next }) => { ... return next({ ctx: {...ctx, extra} }); })`.
2. Apply to a procedure with `.use(middleware)`.

### Adding a new adapter (e.g., for a new framework)
- Follow existing adapters in `/packages/`. Implement server-side request handler that calls `appRouter.createCaller(context)` or uses `resolveHTTPResponse`.
- See `packages/next` for patterns.

### Testing
- Use Vitest. Store unit tests alongside source (`.test.ts`). Run with `pnpm test`.
- For integration tests, check `packages/tests`.

### Development
- Clone repo, run `pnpm install`.
- Build all packages: `pnpm build` (Turborepo).
- Watch mode: `pnpm dev` (runs `turbo run dev`).
- Lint and fix: `pnpm lint:fix` (ESLint + Prettier).
- Run specific package tests: `pnpm test --filter @trpc/server`.
- Code generation (for internal use): `pnpm codegen`.

## Conventions & Style
- Strict TypeScript, no `any`.
- Functions: Prefer arrow functions. Use builder pattern: `t.procedure.input(...).query(...)`.
- Middleware should be reusable, composable.
- Context: type-safe context is templatized in router builder `t = initTRPC.context<Context>().create()`.
- Error handling: throw `TRPCError` with proper code.
- Subscriptions: use `observable` pattern with `t.procedure.subscription(...)`.
- Always export types from routers: `export type AppRouter = typeof appRouter;`.

## References
- For detailed API, check `/packages/server/src/router.ts`, `/packages/server/src/middleware.ts`.
- For client-side, `/packages/client/src/TRPCClient.ts`.
