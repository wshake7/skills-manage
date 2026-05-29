# Context7 Skill

Use Context7 to fetch current library documentation via MCP server or CLI fallback.

## Prerequisites

- Node.js and `npx` available.
- `CONTEXT7_API_KEY` environment variable set (get yours at [context7.com](https://context7.com)).
- Preferably the Context7 MCP server is configured (see Setup).

## Runtime Detection

1. **Check for MCP** – if the agent has access to a `context7` MCP server (e.g., configured in `.mcp.json` or through the agent’s MCP integration), use the tools directly.
2. **Fallback to CLI** – if no MCP server is available, use `npx ctx7@latest library get <libraryId>`.

## MCP Workflow (Preferred)

When the Context7 MCP server is active, retrieve documentation with the `get-library-docs` tool:

```
Tool: get-library-docs
Argument: libraryName (string) – a library ID like "/langchain-ai/langgraphjs" or "/websites/nextjs"
```

Example: `get-library-docs({ libraryName: "/langchain-ai/langgraphjs" })`

Return the tool’s output directly or summarize as needed.

## CLI Fallback

Use the CLI when MCP is not available. The command returns the latest documentation for a library.

```bash
npx ctx7@latest library get <libraryId>
```

Library IDs follow the pattern:
- GitHub: `/owner/repo`
- Websites: `/websites/site-name`

Example:
```bash
npx ctx7@latest library get /langchain-ai/langgraphjs
```

To get machine‑readable output, use `--json`:
```bash
npx ctx7@latest library get /langchain-ai/langgraphjs --json
```

Capture the output and incorporate the documentation into your response.

## Setup

If neither MCP nor the `CONTEXT7_API_KEY` is present, prompt the user to run:
```bash
npx ctx7@latest setup
```
This interactive wizard configures either MCP server mode or CLI + Skills mode.

## Skills & Document Management

- **Install a skill from GitHub** (interactive):
  ```bash
  npx ctx7@latest skills install /anthropics/skills
  ```
- **Install a specific skill**:
  ```bash
  npx ctx7@latest skills install /anthropics/skills pdf
  ```
- **Generate custom skills** with AI guidance:
  ```bash
  npx ctx7@latest skills generate
  ```
- **Refresh docs manually** via GitHub Actions (add this to `.github/workflows/context7-refresh.yml`):
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

## Important Notes

- Always prefer the Context7 MCP server when available; it provides the best integration.
- The CLI is a reliable fallback for current documentation.
- `CONTEXT7_API_KEY` must be present in the environment for either runtime to work.