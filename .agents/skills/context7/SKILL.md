# Context7 Skill

Context7 delivers up-to-date documentation for libraries directly into your coding session. This skill describes how to use the Context7 runtime (MCP or CLI) to retrieve current docs, and what to do when it’s not configured.

## Setup (One-Time)

Tell the user to run:
```bash
npx ctx7 setup
```
This authenticates, generates an API key, and installs the appropriate integration (MCP server + skill, or CLI-only).

## Runtime Workflow

### 1. Prefer MCP (when available)

If the Context7 MCP server is connected, use its tools directly:
- `resolve_library_id` – Look up the canonical library identifier (e.g., `/npm/react`, `/websites/context7`).
- `get_library_docs` – Retrieve the latest documentation for a library, optionally scoped to a topic.

Example:
```json
{
  "tool": "context7_get_library_docs",
  "params": {
    "libraryId": "/websites/context7",
    "topic": "installation"
  }
}
```

Always fetch docs **right before writing code** to avoid stale information.

### 2. Fallback to CLI (when MCP is absent but CLI is installed)

Check if `npx ctx7@latest --version` works. If yes, and `$CONTEXT7_API_KEY` is set, use the CLI for documentation queries:

```bash
npx ctx7@latest query <libraryId> "your question or topic"
```

Example:
```bash
npx ctx7@latest query /websites/context7 "how to install"
```

If the exact command name differs, inspect available commands with:
```bash
npx ctx7@latest --help
```

If `$CONTEXT7_API_KEY` is missing, ask the user to run `npx ctx7 setup` again.

### 3. No Runtime Available (Fallback)

When neither MCP nor CLI is functional:
- **First,** advise the user to execute `npx ctx7 setup` to enable Context7.
- **If immediate documentation is needed,** fall back to web searches or built-in knowledge. Explicitly mark such information with `date: YYYY-MM-DD` so the user knows it might be out of date.
- **Optionally,** you may fetch docs directly from Context7’s API if the user provides an API key:
  ```bash
  curl -H "Authorization: Bearer <key>" https://context7.com/api/v1/libraries/<owner>/<repo>/docs
  ```
  Only attempt this when the user has explicitly shared the key.

## Tips

- Use Context7 for **any** third‑party library to get the latest APIs and usage patterns.
- If you don’t know a library’s ID, resolve it via `context7_resolve_library_id` (MCP) or `ctx7 library id` (CLI).
- For frequently used libraries, install their skills (e.g., `ctx7 skills install /anthropics/skills`) so the agent always has ready access to current docs.
- Remember: Context7 eliminates the risk of outdated training data – rely on it whenever you write import, install, or configuration instructions.