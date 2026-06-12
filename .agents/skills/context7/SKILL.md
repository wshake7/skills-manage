# Context7 Skill

Context7 provides up-to-date documentation for libraries and frameworks. This skill explains how an AI coding agent can retrieve documentation using Context7, prioritizing the local MCP or CLI runtime when available, and falling back to web-based retrieval otherwise.

## Runtime-Adopted Path (MCP/CLI Available)

If Context7 is configured via MCP or CLI, use these tools directly.

### Using Context7 MCP Server

- Resolve library name/id: Use the `resolve-library-id` tool with a query (e.g., "react").
- Get documentation: Use the `get-library-docs` tool with the resolved library ID, topic, and optional context.
- The MCP server name is typically `context7`. Verify with available tools list.

### Using Context7 CLI

```bash
# Resolve a library name to its ID
npx ctx7 resolve --query "library name"

# Get documentation
npx ctx7 docs <libraryID> --topic "hooks" --max results 5
```

For a full command reference, run `npx ctx7 --help`.

## Fallback When Runtime Is Not Configured

When neither the MCP server nor CLI is installed/configured:

- You can still fetch documentation directly from the Context7 web API (requires a `CONTEXT7_API_KEY`).
- **Resolve a library**: `POST https://context7.com/api/v1/resolve` with JSON body `{"name":"library name"}`.
- **Get docs**: `GET https://context7.com/api/v1/libraries/<libraryID>/docs?topic=...` (needs `Authorization: Bearer <api_key>` header).
- If no API key is available, fall back to browsing the human-readable documentation at `https://context7.com` and performing web searches with `site:context7.com`.

## User Setup

To configure Context7 for the AI agent, run the interactive setup:

```bash
npx ctx7 setup
```

This command allows selection between MCP server or CLI + Skills mode. For headless/remote environments, set the `CONTEXT7_API_KEY` environment variable manually, and ensure the MCP server or CLI is available.

## Common Tasks

1. **Look up a library’s documentation**  
   Resolve library → get docs for a specific topic (e.g., component APIs, hooks).

2. **Check if Context7 is available**  
   Verify MCP tool list includes `resolve-library-id` or run `npx ctx7 --version`.

3. **Refresh stale documentation** (CI/CD integration)  
   Add a GitHub Actions workflow (see example below) to trigger a refresh on push.

```yaml
name: Refresh Context7 Docs
on:
  push:
    branches: [master]
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -s -X POST https://context7.com/api/v1/refresh \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.CONTEXT7_API_KEY }}" \
            -d '{"libraryName": "/${{ github.repository }}"}'
```

## Notes

- The `CONTEXT7_API_KEY` is required for headless API and CLI usage. Store it securely.
- Prefer the MCP server when available for seamless tool integration; use the CLI as a fallback for current documentation retrieval.
- Context7 library IDs follow the format `/username/repo` or custom slugs (e.g., `/websites/context7`).