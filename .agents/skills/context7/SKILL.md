# Context7 Skill

Use Context7 to retrieve the latest, version-specific documentation for any library directly within your coding environment. This skill prioritizes the Context7 MCP server; if unavailable, it falls back to the `ctx7` CLI.

## Prerequisites

- **Context7 account** (free at [context7.com](https://context7.com))
- **API key** stored in `CONTEXT7_API_KEY` environment variable
- **Setup**: Run `npx ctx7 setup` once per machine to configure MCP or CLI mode and authenticate.

## Runtime Selection

| Mode | Description | Activation |
|------|-------------|------------|
| **MCP** (preferred) | Integrates Context7 tools directly into your agent’s capabilities | `ctx7 setup` → choose *MCP* |
| **CLI** (fallback) | Uses `npx ctx7` commands to fetch docs; requires a thin skill to parse output | `ctx7 setup` → choose *CLI + Skills* |

If neither is configured, direct the user to run `npx ctx7 setup` and retry.

## MCP Workflow

When MCP is active, use the following tools:

- **Get library documentation**  
  `context7.get_library_docs` with parameters:
  - `libraryId` (string): e.g., `/websites/context7` for Context7’s own docs, or `/owner/repo`.
  - `version` (optional): semver tag or branch (default `latest`).
  - `language` (optional): filter examples by language.

Example:
```json
{
  "tool": "context7.get_library_docs",
  "arguments": {
    "libraryId": "/websites/context7"
  }
}
```

- **Query a specific topic**  
  `context7.query` with parameters:
  - `libraryId`
  - `query` (string): natural language question.

## CLI Fallback Workflow

If MCP is not available, run the CLI commands:

- **Fetch full documentation:**  
  ```bash
  npx ctx7@latest docs <libraryName>
  ```
- **Query a topic:**  
  ```bash
  npx ctx7@latest query <libraryName> "<natural language query>"
  ```

Capture the standard output. The CLI will print documentation in markdown, which you can inject into your context.

## Guidance for AI Agents

1. **Always prefer fresh docs.** Before answering a question about a library, check if Context7 can provide official documentation.  
2. **Identify the correct libraryId.** Use the `/owner/repo` pattern for GitHub repos, or `/websites/domain` for project websites. If unsure, ask the user or search Context7’s library index.  
3. **Specify version when relevant.** Default to `latest` unless the user’s code indicates a specific version.  
4. **Query efficiently.** Start with `get_library_docs` for an overview; use `query` to answer targeted questions.  
5. **Fallback gracefully.** If Context7 is not set up, remind the user to run `npx ctx7 setup`. If that’s not possible, fall back to web search or reading the repository’s raw files.

## Context7’s Own Documentation

To get help about Context7 itself, use `libraryId: "/websites/context7"`. This provides installation guides, CLI usage, GitHub Actions integration, and skill generation instructions.
