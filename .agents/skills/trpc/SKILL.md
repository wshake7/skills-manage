# tRPC Repository Skill

## Overview
tRPC is a framework for building end-to-end typesafe APIs in TypeScript. It enables automatic type inference between server and client, no code generation required. This repository is a monorepo containing the core packages, examples, website, and tooling.

## Repository Structure
- `/packages` - Contains all tRPC npm packages (`@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@trpc/next`, etc.)
- `/examples` - Example projects demonstrating integration with various frameworks and patterns
- `/www` - Documentation website (Docusaurus-based)
- `/scripts` - Build and maintenance scripts
- `/.github` - CI workflows, issue templates
- `/.vscode` - VS Code settings and recommended extensions
- `turbo.json` - Turborepo pipeline configuration
- `pnpm-workspace.yaml` - Workspace definition

## Development Workflow

### Prerequisites
- Node.js (version specified in `.nvmrc`)
- pnpm (preferred package manager, installed via corepack)

### Setup
```bash
corepack enable
pnpm install
```

### Building
All packages are built concurrently using Turborepo:
```bash
pnpm build
```
To build a specific package:
```bash
pnpm --filter @trpc/server build
```

### Testing
Tests use Vitest (some legacy packages may use Jest). Run all tests:
```bash
pnpm test
```
Run tests for a single package:
```bash
pnpm --filter @trpc/server test
```
Linting and type-checking:
```bash
pnpm lint      # ESLint across workspaces
pnpm typecheck # TypeScript compilation check
```

### Code Conventions
- Strict TypeScript with `strict: true` in `tsconfig.base.json`
- Conventional Commits for PR titles (e.g., `feat: add new middleware`, `fix: client batch link`)
- Linting enforced by ESLint with `@typescript-eslint` and Prettier
- Tests written alongside source files (`*.test.ts`)
- Each package has its own `tsconfig.json` extending the base

### Typical Contribution Flow
1. Fork and clone the repo
2. Create a feature branch
3. Make changes in relevant package(s)
4. Add tests covering the changes
5. Run `pnpm lint` and `pnpm test`
6. Open a PR with a descriptive title and link to an existing issue if applicable

## Key Technical Areas

### Core `@trpc/server`
- `router` builder and `procedure` definitions
- Middleware system (`trpc.use()`, `procedure.use()`)
- Context creation and inference
- Input validation via Zod or other libraries
- Error handling with `TRPCError`

### `@trpc/client`
- Links system (HTTP, WebSocket, batch, etc.)
- `createTRPCProxyClient` for typesafe access
- Request batching, caching, and retry logic

### React Integration (`@trpc/react-query`)
- `createTRPCReact` for hooks (`trpc.<path>.useQuery`, `.useMutation`)
- SSR/SSG support via React Query and Next.js

### Middleware and Procedures
- Middleware can modify context, add metadata, or intercept requests
- Procedure chaining: `publicProcedure`, `protectedProcedure`, `adminProcedure`
- Generic helpers for common patterns

## Common Pitfalls
- **Type inference** – When using generics, ensure that the router type is correctly propagated to the client. Use `inferRouterInputs`/`inferRouterOutputs` if needed.
- **Context threading** – Middleware must return the updated context, otherwise types may break.
- **Server/client boundary** – Input/output serialization is based on what the procedure returns; avoid using non-serializable objects like `Date` without custom transformers.
- **Monorepo linking** – When linking packages locally, always run `pnpm install` in the root after changing dependencies.
- **Build cache** – Clear Turborepo cache if you encounter stale builds: `pnpm turbo run clean` or delete `.turbo`.

## Useful Commands
```bash
# Create a new changeset (for versioning)
pnpm changeset

# Format code
pnpm format

# Watch mode for a package
pnpm --filter @trpc/server dev

# Run the documentation site locally
cd www && pnpm start
```

## Resources
- Main documentation: https://trpc.io
- GitHub issues for bug reports & feature requests
- Discord community for discussions (not in repo, but linked in README)

This skill provides the foundational knowledge to contribute effectively to the tRPC monorepo.