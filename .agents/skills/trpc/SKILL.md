# tRPC Monorepo Skill

This skill helps an AI coding agent work effectively with the [trpc/trpc](https://github.com/trpc/trpc) repository. tRPC is a TypeScript framework for building end-to-end typesafe APIs.

## Repository Structure

```
trpc/
├── packages/           # All publishable packages (server, client, next, react-query, core, etc.)
├── examples/           # Standalone example projects (not part of the monorepo workspaces)
├── www/                # Documentation website (Docusaurus)
├── scripts/            # Build and utility scripts
├── .github/            # CI workflows and issue templates
└── code-of-conduct.md, CONTRIBUTING.md, etc.
```

Key packages:
- `packages/server` – `@trpc/server`: router, procedure, middleware, adapters.
- `packages/client` – `@trpc/client`: browser client, links, and transport.
- `packages/core` – `@trpc/core`: shared types and utilities.
- `packages/observable` – `@trpc/observable`: observable helpers.
- `packages/next` – `@trpc/next`: Next.js integration (pages & app router).
- `packages/react-query` – `@trpc/react-query`: React Query hooks.

## Development Setup

- **Prerequisites:** Node.js ≥ 18, pnpm ≥ 8, Turbo (installed globally)
- **Install:** `pnpm install`
- **Build all packages:** `pnpm build` (compiles TypeScript, generates types)
- **Watch a single package:** `cd packages/<pkg> && pnpm dev`

## Key Commands

| Task                 | Command                     |
|----------------------|-----------------------------|
| Full test suite      | `pnpm test`                 |
| Single package tests | `cd packages/server && pnpm test` |
| Lint                 | `pnpm lint`                 |
| Format check         | `pnpm format`               |
| Type check           | `pnpm typecheck`            |
| Create changeset     | `pnpm changeset`            |

Turborepo caches tasks – use `--force` to skip cache if needed.

## Understanding the Codebase

### Request Lifecycle
`client.query()` → HTTP/WebSocket → server adapter → middleware chain → procedure resolver → serialization/transformer → response.

### Core Types
- `AnyRouter` – the merged router type.
- `ProcedureBuilder` – builder pattern for `.input()`, `.query()`, `.mutation()`.
- `MiddlewareFunction<Context>` – middleware that can extend context.
- `TRPCContext` – inferred context from `createContext()`.

### Creating Routers and Procedures
```ts
// Using the initialized tRPC object
const t = initTRPC.context<Context>().create();
const publicProcedure = t.procedure;
const router = t.router;

// A query with input validation (zod)
publicProcedure.input(z.object({ id: z.string() }))
  .query(({ input }) => { /* ... */ });
```

### Middleware
```ts
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { user: ctx.user } });
});
const protectedProcedure = t.procedure.use(isAuthed);
```

### Client Inference
```ts
import type { AppRouter } from '../server';
const trpc = createTRPCProxyClient<AppRouter>({ ... });
// Full type safety on .query/.mutate
```

## Contributing Workflow

1. Fork and clone the repo.
2. Create a branch from `main`.
3. Run `pnpm install && pnpm build`.
4. Make changes, add/update tests in the affected package's `__tests__` folder.
5. Run `pnpm test` and `pnpm lint` from the repo root (or scoped to package).
6. If adding a new feature, consider documentation updates in `www/docs`.
7. Generate a changeset: `pnpm changeset` (follow the prompts).
8. Submit a PR against `main`.

## Where to Find Things
- **Server core:** `packages/server/src` (router, procedure, middleware, error handling).
- **HTTP adapters:** `packages/server/src/adapters` (node-http, express, fetch, etc.).
- **Client transport:** `packages/client/src/links` (httpLink, httpBatchLink, wsLink).
- **Monorepo tooling:** `turbo.json`, `pnpm-workspace.yaml`.
- **Examples:** `examples/` (each uses `file:` protocol to reference local tRPC packages).

## Code Conventions
- TypeScript strict mode, no `any` (prefer `unknown`).
- Generics heavily used for type propagation.
- Tests with Vitest, co-located in `__tests__`.
- ESLint + Prettier configured at root; run `pnpm format` before committing.
- Internal dependencies are linked via `workspace:*` in package.json.

## Common Patterns & Tips
- To add a new tRPC package: create under `packages/`, set up `tsconfig.json`, `package.json` with `workspace:*` deps, add to `pnpm-workspace.yaml` if needed.
- Adapters are implemented as functions that return an HTTP handler: `(opts: ...) => (req, res) => ...`.
- Context creation is user‑defined; see examples for patterns with session, database, etc.
- For runtime type safety ensure `tsc` passes – no runtime type checks beyond Zod parsers.

Use this guide to quickly orient yourself in the monorepo and accelerate development.