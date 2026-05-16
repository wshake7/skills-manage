# Context7 Skill

Context7 provides real-time, up-to-date library documentation for AI coding agents. It fetches docs directly from repositories and websites, ensuring accuracy and freshness.

## Runtime Configuration

Context7 supports two modes: **MCP (preferred)** and **CLI (fallback)**. Use MCP if available; otherwise, fall back to the CLI.

### MCP (Recommended)

When the Context7 MCP server is configured (via `npx ctx7 setup --claude` / `--cursor` / `--opencode`), use these tools:

- `library_get(libraryId)` – retrieve full documentation for a library.
- `library_search(libraryId, query)` – search within a library’s docs.
- `list_libraries()` – list all loaded libraries.

Example:

```
tool: library_get
arguments: { "libraryId": "/upstash/context7" }
```

### CLI (Fallback)

If MCP is unavailable, use `npx ctx7@latest` commands.

**Prerequisite:** `CONTEXT7_API_KEY` must be set. If missing, guide the user to run `npx ctx7 setup` or set it manually.

| Command | Purpose |
|---------|---------|
| `ctx7 get <libraryId>` | Download latest docs |
| `ctx7 search <libraryId> "query"` | Search docs |
| `ctx7 skills install <repo>` | Install Codex skills |

Example:

```bash
npx ctx7@latest get /upstash/context7
```

If `CONTEXT7_API_KEY` is not set, inform the user: *"Context7 runtime is not fully configured. Run `npx ctx7 setup` or set your CONTEXT7_API_KEY."*

## Setup

For first-time configuration:

```bash
npx ctx7 setup
```

This authenticates, generates an API key, and installs the skill or MCP server. Use flags like `--claude`, `--cursor`, or `--opencode` to target your agent.

## Workflow Guidance

1. **Always fetch current docs** before using a library.
   - MCP: `library_get`
   - CLI: `ctx7 get <libraryId>`
2. **Search for specifics** (methods, classes) when needed.
   - MCP: `library_search`
   - CLI: `ctx7 search <libraryId> "query"`
3. **Keep docs fresh** – re-fetch after significant changes, or trigger a refresh via the GitHub Actions workflow (see Context7 docs).
4. **Library IDs** follow the format `/org/repo` or `/websites/domain`.

With Context7, you’re always working with the latest, most accurate documentation.