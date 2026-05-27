# Context7 – Real‑time Library Documentation

Context7 resolves up‑to‑date technical documentation for any library directly inside your coding agent.

## Setup

Run this interactive command to configure Context7 for your environment:

```bash
npx ctx7@latest setup
```

The setup offers two modes:
- **MCP Server** – adds Context7 tools to your agent’s configuration (preferred).
- **CLI + Skills** – falls back to `ctx7` CLI commands when MCP isn’t available.

A `CONTEXT7_API_KEY` environment variable is required ([obtain one here](https://context7.com)).

## Usage

### When MCP is available (preferred)
Call the MCP tools directly:
- `search_library_docs` – search documentation by query.
- `get_library_docs` – fetch a specific section.

Example:  
`search_library_docs(libraryId="/websites/context7", query="CLI setup")`

### When only CLI is available
Use `npx ctx7@latest` commands as a fallback:

```bash
npx ctx7@latest search <libraryId> <query>
# e.g.
npx ctx7@latest search /websites/context7 "CLI setup"

npx ctx7@latest get <libraryId> <sectionPath>
```

Library IDs follow the format `/<source>` (e.g., `/npm/react`, `/github/owner/repo`).

## Fallback behavior

If neither MCP nor CLI is configured:
1. Prompt the user to run `npx ctx7@latest setup`.
2. While the user sets it up, you can fall back to generic web searches, but note that Context7 delivers cleaner, version‑pinned documentation.

## Notes

- To generate custom skills for a project, log in (`ctx7 login`) and run `ctx7 skills generate`.
- Library docs are auto‑refreshed; a GitHub Actions workflow can be added to trigger refreshes on push.