---
name: context7
description: Retrieve up-to-date library documentation using Context7.
runtime: adapter
preferred: [mcp, cli]
commands: [npx ctx7@latest]
env: [CONTEXT7_API_KEY]
requiresUserSetup: true
---

# Context7 Skill

## Overview
Context7 fetches current documentation for any library, ensuring your answers are based on the latest APIs. The runtime adapter prefers the **Context7 MCP server** when configured; otherwise, it falls back to the `ctx7` CLI.

## When to Use
- When a user asks about a specific library, framework, or API, and you need exact, version-appropriate documentation.
- When training data cutoff might yield outdated information.

## Setup & Authentication
1. Run `npx ctx7 setup` and follow the interactive prompts to authenticate and generate an API key. For specific agents, use flags:
   - Cursor: `npx ctx7 setup --cursor`
   - Claude Code: `npx ctx7 setup --claude`
   - OpenCode: `npx ctx7 setup --opencode`
2. Set the `CONTEXT7_API_KEY` environment variable if running in headless mode or using the CLI directly.
3. For GitHub Actions use the provided workflow (see official docs).

## Runtime Modes

### MCP (Preferred)
If your tooling supports Model Context Protocol (MCP) and the Context7 MCP server is configured, use the following tools:
- `list_libraries` – Lists available libraries and their IDs.
- `resolve_library_id` – Resolves a name to a library ID.
- `get_library_docs` – Retrieves markdown documentation for a library, optionally filtered by topic and selectors.
- `get_library_snippets` – Retrieves short code snippets filtered by intent (e.g., “install”, “quickstart”).

Workflow:
1. Call `resolve_library_id` with the library name to obtain its ID.
2. Use `get_library_docs` to fetch the relevant documentation pages.

### CLI (Fallback)
If MCP is unavailable, use the `ctx7` CLI installed via `npx ctx7@latest`. Common commands:
- **Search docs:** `npx ctx7@latest search <libraryId> <query>`  
  *Example:* `npx ctx7@latest search /react/ useContext`
- **List libraries:** `npx ctx7@latest libraries [query]`  
  *Example:* `npx ctx7@latest libraries react`
- **Retrieve full docs:** `npx ctx7@latest docs <libraryId> [--topic <topic>]`  
  *Example:* `npx ctx7@latest docs /tailwindcss/latest --topic flexbox`
- **Generate custom skills:** `npx ctx7@latest skills generate`

Always use `npx ctx7@latest` to ensure the newest capabilities.

## Workflow Guidance
1. Identify the library and the specific information needed.
2. If MCP is active, use the MCP tools; otherwise, craft a CLI command.
3. Example: “How do I use `useQuery` in React Query?”  
   - MCP: `resolve_library_id "react-query"` → library ID `/tanstack/react-query`. Then `get_library_docs` with topic `useQuery`.  
   - CLI: `npx ctx7@latest search /tanstack/react-query useQuery`
4. Integrate the returned documentation into your answer.

## Optional: Auto-Refresh Docs
Add a GitHub Actions workflow to keep documentation up-to-date (see official docs).

## Notes
- The CLI requires a `CONTEXT7_API_KEY` environment variable or prior `ctx7 login`.
- For headless environments, install the API key and skip interactive setup.
