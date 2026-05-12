# Context7 Documentation Skill

Context7 delivers live, up-to-date developer documentation directly inside your coding environment. Use this skill to retrieve docs for any library without leaving the chat.

## Setup

1. Run `npx ctx7 setup --cursor` (or `--claude`, `--opencode`, `--codex`).
2. This installs the Context7 MCP server and creates an API key.
3. For headless/CI environments, set the `CONTEXT7_API_KEY` environment variable.

## Runtime Usage

### Preferred: MCP Server (automatically configured by setup)

When the Context7 MCP server is active, use the MCP tool to fetch documentation. The exact tool name may vary; run `list_tools` on the `context7` server to discover available tools. Typical usage:

- Resolve library ID: `context7.resolve({ name: "react" })` → returns library ID like `/websites/react`
- Get full docs: `context7.get_docs({ libraryId: "/websites/react" })`
- Search within docs: `context7.search({ libraryId: "/websites/react", query: "useState hook" })`

Always prefer MCP for speed and reliability.

### Fallback: CLI (`npx ctx7@latest`)

If the MCP server isn't available, use the Context7 CLI. Requires `CONTEXT7_API_KEY` in environment.

```bash
# Ensure library is up-to-date
npx ctx7 resolve /websites/react

# Fetch all documentation
npx ctx7 get /websites/react

# Search within a library
npx ctx7 search /websites/react useRef
```

Command reference:
- `npx ctx7 resolve <name>` – creates/refreshes documentation for a library.
- `npx ctx7 get <library-id>` – retrieves full docs.
- `npx ctx7 search <library-id> <query>` – searches inside a library.
- `npx ctx7 --help` – full help.

## GitHub Actions Integration

Add a workflow to keep docs fresh on every push:

```yaml
name: Refresh Context7 Docs

on:
  push:
    branches:
      - main

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

(See context7.com/docs/integrations/github-actions for details.)

## Notes

- The CLI caches docs locally after first fetch; subsequent queries are instant.
- Always replace placeholder `<library-id>` with an actual Context7 library ID (e.g., `/websites/react`, `/npm/langchain`).
- For a full list of supported libraries, visit https://context7.com/browse.
