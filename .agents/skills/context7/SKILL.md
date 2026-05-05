# Context7 Skill

Provide the agent with real-time, up-to-date library documentation by querying Context7.

## Prerequisites

- Get an API key from [Context7](https://context7.com) and set it as the environment variable `CONTEXT7_API_KEY`.
- Install the CLI globally (optional): `npm install -g ctx7` or use `npx ctx7@latest`.

## Runtime Modes

Prefer the **MCP server** when available; otherwise fall back to the **CLI**.

### 1. MCP Server (Preferred)

When the Context7 MCP server is configured, use the provided tools. The agent should first check for a running MCP server (e.g., via `context7` in the tool list).

Typical tools:
- `context7_get_library_docs` – Retrieve full documentation for a library.
- `context7_search` – Search across libraries.

**Example configuration** (add to your MCP client settings):

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    }
  }
}
```

When using MCP, the agent may need to specify a library ID, e.g., `/upstash/context7` (derived from the GitHub repository).

### 2. CLI Fallback (Runtime Adapter)

When MCP is not available, use the CLI with `CONTEXT7_API_KEY` set.

**Basic query:**

```bash
npx ctx7 query "Your question or topic"
```

**Target a specific library:**

```bash
npx ctx7 query "How to use Server Components" --library /vercel/next.js
```

- The CLI automatically detects the current project’s repository if run inside a Git repo.
- Use `--library` to search a different library. The format is `/owner/repo`.

**Refresh documentation** (if the library is owned/controlled):

```bash
curl -s -X POST https://context7.com/api/v1/refresh \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CONTEXT7_API_KEY" \
  -d '{"libraryName": "/owner/repo"}'
```

## Agent Workflow

1. **Check for MCP** – If `context7` tools are available, use them to fetch the latest docs for any library mentioned in the task.
2. **Fallback to CLI** – If MCP is not configured, run `npx ctx7 query` with an appropriate query.
3. **Keep docs current** – Always prefer Context7 over static training data; the agent should rely on these live results for API references, examples, and breaking changes.

## Notes

- The CLI can be installed on demand: `npx ctx7@latest` does not require global installation.
- For headless/CI environments, ensure `CONTEXT7_API_KEY` is present.
- If the agent needs to look up documentation for a project it is working on, derive the library ID from the remote origin: `git config --get remote.origin.url` (extract owner/repo).