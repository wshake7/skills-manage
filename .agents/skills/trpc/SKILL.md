# tRPC Skill

## Overview
tRPC is an end-to-end typesafe RPC framework for TypeScript. This skill covers working with the `trpc/trpc` monorepo, its packages, and development workflows.

## Repository Layout
- `packages/` – All npm packages (server, client, React, Next.js, etc.)
- `www/` – Official documentation website (Next.js)
- `examples/` – Example projects (minimal, Next.js, Express, etc.)
- `scripts/` – Build and CI scripts
- `.github/` – CI workflows, issue templates

## Core Packages
| Package | Purpose |
|---------|---------|
| `@trpc/server` | Core server-side router and procedure mechanics |
| `@trpc/client` | Type-safe client to call tRPC endpoints |
| `@trpc/react` | Legacy React bindings; prefer `@trpc/react-query` |
| `@trpc/react-query` | React hooks integrated with TanStack Query |
| `@trpc/next` | Adapter for Next.js API routes and `app` directory |
| `@trpc/express` | Adapter for Express |
| `@trpc/fastify` | Adapter for Fastify |
| `@trpc/...` | Other adapters (Cloudflare Workers, AWS Lambda, etc.) |

## Key Concepts
- **Procedure**: A single API endpoint (`.query()`, `.mutation()`, `.subscription()`)
- **Router**: Collection of procedures; can be nested
- **Context**: Request-scoped data (e.g., session, database) passed to resolvers
- **Middleware**: Functions that wrap procedures (auth, logging, timing). Use `.use()`.
- **Input validation**: Use `.input(z.object({...}))` or any zod schema
- **Transformer**: Serialize/deserialize data on the wire (e.g., `superjson`)
- **Links**: Client-side pipeline for request/response handling (httpLink, httpBatchLink, loggerLink)

## Common Workflows

### Adding a New Procedure to an Existing Router
1. Open the relevant router file (e.g., `src/server/routers/user.ts`).
2. Add procedure:
   ```typescript
   import { z } from 'zod';
   const userRouter = t.router({
     byId: t.procedure
       .input(z.object({ id: z.string() }))
       .query(({ input, ctx }) => {
         return ctx.db.user.findUnique({ where: { id: input.id } });
       }),
   });
   ```
3. Update the app router to include the change if needed.
4. Run `pnpm test --filter @trpc/server` (or relevant package tests).

### Creating Middleware
```typescript
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { user: ctx.user } // pass enhanced context
  });
});
const authedProcedure = t.procedure.use(isAuthed);
```

### Setting Up a New tRPC Project
- Install core packages: `npm install @trpc/server @trpc/client zod`
- Create `server/trpc.ts` with `initTRPC`
- Define routers and export `appRouter` type
- Create client with `createTRPCProxyClient` or `createTRPCReact`
- Use `httpBatchLink` with correct URL

### Contributing to trpc/trpc
- Fork and clone the repo
- Ensure Node v18+ and pnpm 8+
- Install dependencies: `pnpm install`
- Build all packages: `pnpm build`
- Work on your feature/fix with a feature branch
- Run tests for affected package: `pnpm --filter @trpc/server test`
- Lint: `pnpm lint`; format: `pnpm format`
- Commit with conventional commits, push, open PR
- Review CI: all checks must pass

### Testing
- Unit tests per package use Vitest. E2E tests in `www/` or `examples/`.
- Run all tests: `pnpm test` (uses turbo)
- Watch mode: `pnpm --filter @trpc/server test --watch`
- Testing utilities: `@trpc/server` exports `createCallerFactory` to test procedures without HTTP.

### Development Environment
- The monorepo uses pnpm workspaces with `pnpm-workspace.yaml`.
- Tasks are orchestrated by Turborepo (`turbo.json`).
- Dev command (starts all packages in watch mode): `pnpm dev`
- Building docs: `cd www && pnpm dev` (Next.js dev server)

## Important Files
- `turbo.json`: pipeline definitions
- `pnpm-workspace.yaml`: workspace packages
- `.eslintrc*`: ESLint config
- `vitest.config.ts` (per package) or root `vitest.workspace.ts`
- `tsconfig.json` hierarchy

## Troubleshooting Common Issues
- **Type inference not working on client**: Ensure `AppRouter` type is exported and used as generic. Check transformer consistency.
- **Build errors with superjson**: Verify `@trpc/client` and `@trpc/server` use the same superjson version (peer dep).
- **Context not passing to nested routers**: Make sure middleware returns `next` with merged context.
- **Tests failing due to new dependencies**: Run `pnpm install` and maybe `pnpm build` after pulling changes.

Use this skill to navigate the tRPC codebase, understand patterns, and contribute effectively.