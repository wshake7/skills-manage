# tRPC Skill

tRPC is a TypeScript library for building end-to-end typesafe APIs. This skill assists an AI coding agent in working with the [tRPC monorepo](https://github.com/trpc/trpc).

## Repository Structure

- Uses **pnpm workspaces** and **Turborepo** for monorepo management.
- Key packages: `server` (core), `client` (vanilla client), `react-query` (React bindings), `next` (Next.js integration), etc.
- Examples: `examples/` directory.
- Website: `www/`.
- Configuration: Turborepo config in `turbo.json`, ESLint, Prettier, TypeScript.

## Setup

1. Clone the repository.
2. Install dependencies: `pnpm install`.
3. Build all packages: `pnpm build` (or `turbo build`).

## Development Workflow

- Run development server (e.g., website): inside a package, `pnpm dev`.
- Lint code: `pnpm lint` from root.
- Format: `pnpm format`.
- Type-check: `pnpm typecheck` (if available).

## Testing

- Framework: **Vitest** with custom utilities.
- Run all tests: `pnpm test` from root.
- Run tests for a specific package: `pnpm test --filter=@trpc/server`.
- Write tests using `test` helpers that simulate a tRPC procedure call.

## Key Concepts

- **Procedures**: input validation with Zod, output typing.
- **Middleware**: reusable pipeline stages.
- **Router**: collection of procedures.
- **Context**: per-request data (database connections, user session).

## Useful Commands

| Command | Description |
| ------- | ----------- |
| `pnpm install` | Install dependencies |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all code |
| `pnpm test` | Run all tests |
| `pnpm clean` | Clean build artifacts |
| `pnpm changeset` | Create a changeset for versioning |

## Contributing

- Before committing, ensure tests pass and lint is clean.
- Create a changeset with `pnpm changeset` if adding new functionality.
- Follow the code style (enforced by Prettier/ESLint).

For more details, see the [Contributing Guide](https://github.com/trpc/trpc/blob/main/CONTRIBUTING.md).