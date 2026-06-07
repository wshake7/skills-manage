# trpc Contribution and Development Guide

## Overview
tRPC is a framework for building end-to-end typesafe APIs. It provides a developer experience where the TypeScript compiler infers the types of your API endpoints, eliminating the need for code generation or manual type definitions.

## Repository Structure
- `packages/server`: Core server-side library
- `packages/client`: Core client-side library
- `packages/react`: React bindings (hooks)
- `packages/next`: Next.js integration
- `packages/react-query`: TanStack Query integration
- `www`: Documentation website
- `examples`: Various examples of usage

## Setup
```bash
git clone https://github.com/trpc/trpc.git
cd trpc
pnpm install
```
Prerequisites: Node.js >= 18, pnpm (corepack enabled).

## Development Workflow
1. Make changes in relevant package(s).
2. Build the package(s) you changed (e.g., `pnpm --filter @trpc/server build`).
3. Run tests: `pnpm test` (or `pnpm --filter <package> test`).
4. Test locally with an example: `cd examples/next-prisma-starter && pnpm dev` (ensure dependencies built).
5. Lint your code: `pnpm lint`.

## Common Commands
- `pnpm install`: Install all dependencies.
- `pnpm build`: Build all packages.
- `pnpm dev`: Start development mode (watch mode) for all packages.
- `pnpm test`: Run all tests.
- `pnpm lint`: Run ESLint across the project.
- `pnpm format`: Run Prettier to format code.
- `pnpm --filter <package> <cmd>`: Run a command for a specific package (e.g., `pnpm --filter @trpc/server build`).

## Testing
- Tests are located in `packages/*/tests` or `packages/*/__tests__`.
- Use `pnpm --filter <package> test` to run tests for a specific package.
- For end-to-end tests, see `packages/tests` (e2e tests with multiple adapters).
- Integration tests often use `vitest` or `jest`; check package config.

## Code Style
- TypeScript strict mode.
- ESLint with Prettier integration.
- Use `pnpm lint` to check, `pnpm format` to auto-fix.

## Creating a New Adapter (Server or Client)
- Refer to existing adapters in `packages/server/src/adapters` or client adapters pattern.
- Ensure it passes the standard test suite.
- Update documentation in `www`.

## Resources
- [Documentation](https://trpc.io)
- [Discord](https://trpc.io/discord)
- [Issues](https://github.com/trpc/trpc/issues)
