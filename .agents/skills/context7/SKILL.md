# Context7 - Real-Time Library Documentation

Context7 provides up-to-date documentation for any open-source library or framework by resolving library identifiers and fetching curated, latest docs.

## Setup

To configure Context7 for your AI agent, run the interactive setup:

```bash
npx ctx7@latest setup
```

This will guide you through choosing between:
- **MCP server mode** (recommended): integrates Context7 tools directly into your agent's configuration.
- **CLI + Skills mode**: installs a skill that relies on the `ctx7` CLI for document retrieval.

If you already have an API key, set it as an environment variable:

```bash
export CONTEXT7_API_KEY=your_api_key_here
```

## Runtime Modes

### 1. MCP Server Mode (Preferred)

When the Context7 MCP server is configured, the agent can call its tools directly (no CLI needed).

- Tool identifiers are typically prefixed with `mcp__context7` (e.g., `mcp__context7_resolve-library-id`, `mcp__context7_get-library-docs`).
- **Actions**:
  - Resolve a library name: use `resolve-library-id` to get the correct Context7 library ID.
  - Fetch documentation: use `get-library-docs` with the resolved ID, a topic/query, and optional version.

### 2. CLI Mode (Fallback)

If MCP is not available, use the `ctx7` CLI. Ensure the CLI is installed (`npx ctx7@latest`) and your API key is set.

- **Login** (optional but recommended for skill generation):
  ```bash
  npx ctx7@latest login
  ```
- **Resolve a library name**:
  ```bash
  npx ctx7@latest resolve <library-name>
  ```
- **Query documentation**:
  ```bash
  npx ctx7@latest query <library-id> [--query "topic"] [--version "version"]
  ```
- **Generate custom skills** for specific libraries:
  ```bash
  npx ctx7@latest skills generate
  ```

## Fallback Behavior (No Runtime Configured)

If neither MCP nor CLI is available, the agent should:

1. **Request user setup**: instruct the user to run `npx ctx7@latest setup` and provide their `CONTEXT7_API_KEY` if needed.
2. **Guide the user to get an API key**: https://context7.com/dashboard
3. **Suggest temporary alternatives**: use the Context7 website (context7.com) to manually look up library docs, or fall back to static GitHub documentation if the user approves.

## Library Identifiers

Context7 uses library IDs in the format `/org/repo` (e.g., `/openai/openai-python`) or `/websites/domain` (e.g., `/websites/context7`). Always resolve the full name before querying.

## Example Workflow (CLI)

```bash
# Resolve the library
ID=$(npx ctx7@latest resolve openai/openai-python)
# Fetch docs for chat completions
npx ctx7@latest query $ID --query "chat completions"
```

## GitHub Actions Refresh

To keep documentation current, consider adding a refresh workflow:

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
            -H "Authorization: Bearer ${{ secrets.CONTEXT7_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"libraryName": "/${{ github.repository }}"}'
```

This skill enables on-the-fly access to trusted, always-current library information directly inside your coding agent.