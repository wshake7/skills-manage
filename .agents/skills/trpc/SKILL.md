# tRPC Skill

## Overview

**tRPC** is a TypeScript RPC framework for end-to-end typesafe APIs. It eliminates the need for code generation, enabling full-stack type safety with minimal boilerplate. The repository is a monorepo managed with `pnpm` and `turbo`, containing packages for the server, client, React, Next.js, a CLI, and more.

## Project Structure

- `packages/server` – Core server logic: router, procedure builders, middleware, context.
- `packages/client` – Vanilla JavaScript/TypeScript client.
- `packages/react-query` / `packages/react` – React bindings (React Query integration).
- `packages/next` – Next.js app directory integration (App Router & Pages Router).
- `packages/tests` – End-to-end tests and integration tests.
- `www/` – Documentation site (Docusaurus).
- `examples/` – Example projects.

## Core Concepts

- **Router**: A collection of procedures. Created via `t.router()`.
- **Procedure**: An API endpoint defined with `t.procedure` chained with input validation (`.input()`) and a resolver (`.query()` or `.mutation()`).
- **Context**: Per-request data (e.g., session, database) passed to all resolvers. Created via `t.createContext()`.
- **Middleware**: Reusable logic that wraps procedures (authentication, logging). Applied via `.use()`.
- **Transformer**: Serialization/deserialization layer (e.g., superjson) for handling Dates, Maps, etc.
- **Client**: Auto-generated proxy that calls procedures with full type safety (`trpc.procedure.input`).

## Workflow Guidance

### Setting Up a New tRPC Server
1. Install `@trpc/server`, `zod` (or your validator), and a HTTP adapter (e.g., `@trpc/server/adapters/standalone`).
2. Define your context: `const createContext = () => ({ db });`
3. Create a `t` object: `import { initTRPC } from '@trpc/server'; const t = initTRPC.create();`
4. Build a router:
   ```ts
   export const appRouter = t.router({
     greeting: t.procedure
       .input(z.object({ name: z.string() }))
       .query(({ input }) => `Hello ${input.name}`),
   });
   export type AppRouter = typeof appRouter;
   ```
5. Create the server with an adapter (express, standalone, etc.) and listen.

### Using the Client
- Install `@trpc/client` and the corresponding React/Next.js bindings if needed.
- Create the client: `const client = createTRPCClient<AppRouter>({ url: '...' });`
- Call procedures: `const greeting = await client.greeting.query({ name: 'World' });`
- For React, wrap your app with `<TRPCProvider client={trpcClient} queryClient={queryClient}>` and use hooks like `trpc.greeting.useQuery(...)`.

### Common Tasks for AI Agent
- **Generate a new procedure**: Add a new entry in the router, define input with Zod, implement resolver, ensure types are exported.
- **Add middleware** (e.g., auth): Use `t.middleware`, modify context, chain with `.use(...)` on protected procedures.
- **Extend context**: Update context factory and possibly the `initTRPC` generic.
- **Write tests**: Use `@trpc/tests` patterns; mock context, call procedures directly via `t.createCaller` without starting a server.
- **Update documentation**: Edit `.mdx` files in `www/`; build with `pnpm --filter www dev`.

## Repository Commands
- Install dependencies: `pnpm install` (from root)
- Build all packages: `pnpm build`
- Run tests: `pnpm test` (or `pnpm turbo test`)
- Lint: `pnpm lint`
- Start docs site: `pnpm --filter www dev`
- Run a specific example: navigate to `examples/<name>` and run `pnpm dev`.

## Important Notes for AI Agent
- The monorepo uses **pnpm** workspaces; always add/remove dependencies with `pnpm` in the relevant package directory.
- TypeScript strictness is high; ensure all types align (context, input, output).
- Breaking changes often involve adapter packages (`@trpc/next`, `@trpc/react-query`). Check migration guides in `www/docs`.
- The `@trpc/server` package exports `inferRouterInputs` and `inferRouterOutputs` for type extraction.
- When modifying core server or client code, run `pnpm build` to ensure types propagate.
- For React 18/Next.js App Router, use `createTRPCNext` or `createTRPCReact` helpers.

## References
- [GitHub Repository](https://github.com/trpc/trpc)
- [Official Documentation](https://trpc.io) (built from `www/`).
