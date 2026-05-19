# Context7 Runtime Adapter

Use Context7 to fetch up-to-date documentation and code examples for libraries and APIs. This skill supports multiple runtimes: prefer MCP when available, fall back to the `ctx7` CLI, then to the HTTP API.

## Configuration

- **API Key**: Required for CLI and direct API usage. Store as environment variable `CONTEXT7_API_KEY`.
- **MCP Server**: No API key needed once the server is configured (handles auth internally).
- **CLI**: Install/update via `npm install -g ctx7@latest` or run with `npx ctx7@latest ...`.

## Runtime Selection

Check for runtimes in this order:

1. **MCP Server** (if available via the agent’s MCP configuration)
2. **CLI** (`ctx7` or `npx ctx7@latest`)
3. **HTTP API** (direct `curl` calls)

### 1. MCP (Preferred)

When the Context7 MCP server is configured, use its tools:
- `lookup-resolve-library-id` – convert a library name to a Context7 ID.
- `query-docs` – retrieve documentation snippets for a given library ID and query.
- `resolve-library-id` – similar, returns an ID.

**Workflow**:
- Call `lookup-resolve-library-id(libraryName: <library>)` to get the ID.
- Use `query-docs(libraryId: <id>, query: <question>)` to fetch relevant docs.
- Integrate returned `snippets` directly into your answer, citing the source URL if provided.

### 2. CLI

Use this when MCP is unavailable but the CLI can be executed. Authentication is handled via `CONTEXT7_API_KEY` (see setup below).

**Essential commands**:
- `npx ctx7@latest query --library <libraryName> "<query>"` – fetch documentation.
- `npx ctx7@latest setup` – interactive setup (OAuth, API key, agent rule injection).
- `npx ctx7@latest login` – authenticate via browser.
- `npx ctx7@latest skills generate` – generate custom skill files interactively.

**Workflow**:
- Run `npx ctx7@latest query --library <name> "<user question>"` to get JSON output.
- Parse the response; use the `result` field with code examples and explanations.
- If the library name is unknown, run `npx ctx7@latest resolve <name>` first (if available) or try common names.

### 3. HTTP API (Fallback)

When neither MCP nor CLI works, use the REST API directly. Requires `CONTEXT7_API_KEY`.

```bash
curl -s -X POST "https://context7.com/api/v1/query" \
  -H "Authorization: Bearer $CONTEXT7_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"libraryName": "/owner/repo", "query": "how to set up"}'
```

**Setup tip**: If `CONTEXT7_API_KEY` is missing, guide the user to run `npx ctx7@latest setup` or log in at context7.com to create a key.

## User Setup

- Run `npx ctx7@latest setup` for a fully automated installation (auth, API key, agent rule).
- For manual setup: obtain an API key from context7.com/dashboard, export it as `CONTEXT7_API_KEY`, and install the CLI globally.

## Common Issues

- **No API key**: Prompt the user to run `npx ctx7@latest setup` or set `CONTEXT7_API_KEY`.
- **Library ID unknown**: Use MCP’s `lookup-resolve-library-id` or CLI’s `resolve` command. Common patterns: `/owner/repo` for GitHub repositories, `/websites/domain` for websites.
- **CLI not installed**: Use `npx ctx7@latest` to run temporary, or suggest `npm i -g ctx7@latest`.

## Agent Rule

For agents that support persistent rules, include:  
"Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask."

## Refresh Workflow (GitHub Actions)

To keep library docs updated, add a workflow that pings Context7’s refresh endpoint on push:

```yaml
name: Refresh Context7 Docs
on:
  push:
    branches: [ master ]
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

*Note: The token must be a Context7 API key, stored as a GitHub secret.*