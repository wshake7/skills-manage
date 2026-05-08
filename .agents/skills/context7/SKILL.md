# Context7 Skill

Context7 provides up-to-date library documentation fetched directly from official sources. Use it to get accurate API references, configuration details, and code examples without manual searching.

## When Context7 Runtime Is Available (Preferred)

Context7 can be used via an MCP server (recommended) or the CLI. Both require a `CONTEXT7_API_KEY`.

### Using MCP (Recommended)

If the `context7` MCP server is running, use its tools:

- **`resolve-library-id`**: Search for a library by name and get its canonical ID.
- **`get-library-docs`**: Fetch documentation for a library ID, optionally scoped to a topic.

**Workflow**:
1. Identify the library you need (e.g., "nextjs", "prisma")
2. Call `resolve-library-id` with a query string → returns the library ID (e.g., `/websites/nextjs`)
3. Call `get-library-docs` with the library ID and an optional topic (e.g., `getServerSideProps`) → returns relevant Markdown docs

### Using CLI (Fallback When MCP Unavailable)

If MCP is not configured but the `ctx7` CLI is installed, use these commands:

```bash
# Resolve a library name to an ID
npx ctx7@latest resolve react

# Get documentation for a library ID, optionally with a topic
npx ctx7@latest docs /react/react useState

# Search across libraries
npx ctx7@latest search "websocket"
```

Ensure the environment variable `CONTEXT7_API_KEY` is set before running commands. You can obtain a key with `npx ctx7 setup`.

## Fallback Behavior (No Runtime Configured)

If neither MCP nor CLI is available, instruct the user to install Context7:

```bash
npx ctx7 setup
```

This authenticates, creates an API key, and installs the appropriate skill (MCP or CLI). For specific agents:

- **Claude Code**: `npx ctx7 setup --claude`
- **Cursor**: `npx ctx7 setup --cursor`
- **OpenCode**: `npx ctx7 setup --opencode`

Alternatively, the user can manually set `CONTEXT7_API_KEY` and use `npx ctx7` commands directly.

If setup is not possible, you can guide the user to browse docs at https://context7.com/docs, but this provides only static information about Context7 itself, not live library docs.

## Common Workflows

- **Look up a specific API**: Resolve the library first, then fetch docs for a function/class/hook.
  - CLI: `npx ctx7@latest docs /react/react useRef`
  - MCP: `resolve-library-id` → `get-library-docs` with topic `useRef`
- **Get started with a library**: Fetch docs without a topic to get an overview.
  - CLI: `npx ctx7@latest docs /express/express`
- **Refreshing documentation**: Context7 auto-updates, but you can trigger a manual refresh via the API or a GitHub Action (see below).

## Configuration & Setup

- **API Key**: Set `CONTEXT7_API_KEY` in your environment. Generated during `npx ctx7 setup`.
- **CLI**: Available as `npx ctx7@latest` (no permanent install required).
- **MCP Server**: Configured automatically for supported agents via `npx ctx7 setup --agent <name>`, or manually by adding the `context7` MCP server to your agent’s config.

## GitHub Actions Integration

To automatically refresh Context7 docs on push, add this workflow to `.github/workflows/context7-refresh.yml`:

```yaml
name: Refresh Context7 Docs

on:
  push:
    branches:
      - master # change to your default branch if different

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Context7 Refresh
        run: |
          curl -s -X POST https://context7.com/api/v1/refresh \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.CONTEXT7_API_KEY }}" \
            -d '{"libraryName": "/${{ github.repository }}"}'
```

## Notes

- Always prefer the MCP runtime when available; it provides a richer interaction model.
- CLI output is plain Markdown; you can include it directly in your context.
- If a library is not found, ask the user to add it at https://context7.com.
- For headless/CI environments, use `npx ctx7 setup --api-key YOUR_KEY` to bypass OAuth.