# tRPC Repository Skill

## Overview
tRPC is a TypeScript-based RPC framework enabling end-to-end typesafe APIs without code generation or schemas. This monorepo contains packages for server, client, React integrations, and more, along with examples and documentation.

## Repository Layout
```
.
├── packages/          # Core and integration packages
│   ├── server         # @trpc/server
│   ├── client         # @trpc/client
│   ├── react-query    # @trpc/react-query
│   ├── next           # @trpc/next
│   ├── openapi        # @trpc/openapi
│   └── ...
├── examples/          # Full-stack example apps
├── www/               # Documentation website (nextra)
├── .changeset/        # Changeset files for versioning
├── scripts/           # Build and release scripts
├── package.json       # Root workspace config
├── turbo.json         # TurboRepo pipeline
├── pnpm-workspace.yaml
└── tsconfig.base.json # Shared TypeScript config
```

## Prerequisites
- Node.js LTS (≥18)
- pnpm (package manager)

## Setup
```bash
# Clone and install
pnpm install

# Build all packages (need built packages for development)
pnpm build
```

## Common Development Commands

### Build
- `pnpm build` – Builds all packages using TurboRepo.
- `pnpm dev` – Starts watch mode for all packages, recompiling on changes.
- `pnpm clean` – Removes build artifacts (`dist`, `.tsbuildinfo`).

### Test
- `pnpm test` – Runs all tests with Vitest (or Jest for older packages).
- `pnpm test -- --coverage` – Runs tests with coverage.
- `pnpm test:watch` – Watch mode (if available at root; otherwise per‑package).

### Lint & Format
- `pnpm lint` – Lints TypeScript/JavaScript/other files.
- `pnpm format` – Formats code with Prettier (use `--check` to verify).
- `pnpm type-check` – Runs TypeScript type checking across the project.

### Run an Example
```bash
cd examples/next-prisma-starter  # or any example
pnpm dev
```

## Development Workflow
1. **Create a branch** from `main` (or `next` for next‑major features).
2. **Make changes** in the relevant package(s).
   - Modify source in `packages/<name>/src/`.
   - Add or update tests in `packages/<name>/__tests__/` (or `tests/` folder).
3. **Start dev mode** (`pnpm dev` in the root) to watch for changes and rebuild automatically.
4. **Test & lint**:
   ```bash
   pnpm test
   pnpm lint
   pnpm format --check
   pnpm type-check
   ```
5. **Create a changeset** for versioning (required for all user‑facing changes):
   ```bash
   npx changeset
   ```
   Follow the CLI prompts to describe the changes and choose semver bump.
6. **Commit** with a conventional commit message (e.g., `feat(server): add X`).
7. **Push** and open a pull request.

## Testing
- Tests are written using Vitest (or Jest in legacy packages).
- For end‑to‑end tests, see `packages/tests/` – they spin up real servers.
- Mocking: Use `vi.fn()` / `vi.mock()` for unit tests; integration tests often bootstrap a full router.
- Run specific tests: `pnpm test -- --project <package-name> -- test/file.test.ts`.

## Code Conventions
- **TypeScript**: Strict mode enabled; avoid `any`, prefer `unknown` and type narrowing.
- **Linting**: ESLint with shared config; fix issues with `pnpm lint --fix`.
- **Formatting**: Prettier; run `pnpm format` before final commit.
- **Package structure**: Public APIs are exported from `src/index.ts` (or `src/<submodule>.ts` re‑exported in `index.ts`).
- **Peer dependencies**: When adding a dependency to a package, ensure it is also listed as a `peerDependency` if it must be provided by the consumer.

## Key Packages and Their Files
| Package | Key Files |
|--------|-----------|
| `@trpc/server` | `src/router.ts`, `src/procedure.ts`, `src/context.ts` |
| `@trpc/client` | `src/links/`, `src/createTRPCClient.ts` |
| `@trpc/react-query` | `src/createHooksInternal.tsx`, `src/shared.ts` |
| `@trpc/next` | `src/createTRPCNext.ts`, `src/withTRPC.tsx` |

When making changes, understand the current public API and avoid accidental breaking changes unless a changeset marks it as major.

## Debugging & Troubleshooting
- **Build failures**: Often due to missing `build` output from another package. Run `pnpm clean && pnpm build` to reset.
- **Type errors after pulling**: Run `pnpm install` to ensure linked packages are up‑to‑date. `tsc -b -w` can help detect where types are out of sync.
- **Tests failing locally**: Clear Vitest cache with `pnpm test -- --clearCache`. Check `vitest.config.ts` for configuration mismatches.
- **Server‑side debugging**: Use `console.log` or attach a Node inspector (`--inspect-brk`).
- **Example apps not building**: Ensure you have run `pnpm build` in the root first; some examples depend on built packages.

## Useful Resources
- [CONTRIBUTING.md](https://github.com/trpc/trpc/blob/main/CONTRIBUTING.md)
- [Documentation](https://trpc.io) (source in `www/`)
- [Changeset documentation](https://github.com/changesets/changesets)

## Quick Reference
```bash
# Install & build
pnpm install && pnpm build

# Start dev mode
pnpm dev

# Run all checks (lint, format, type, test)
pnpm lint && pnpm format --check && pnpm type-check && pnpm test

# Create changeset
npx changeset

# Commit with conventional format
git commit -m "feat(server): add new utility type"
```