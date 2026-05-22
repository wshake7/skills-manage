# Context7 Skill

Get up-to-date library documentation using Context7. This skill supports two runtimes:

- **MCP (preferred)**: When the Context7 MCP server is available, use its tools.
- **CLI (fallback)**: When MCP is not configured, fall back to the `ctx7` CLI with `npx ctx7@latest`.

## Configuration

Context7 requires user setup. Run the interactive setup to configure your environment:

```bash
npx ctx7 setup
```

This will let you choose between MCP server or CLI mode and handle authentication.

### Required Environment Variable

For direct CLI usage (or when MCP is not auto-configured), set:

```bash
export CONTEXT7_API_KEY=<your-key>
```

## Runtime Selection

1. **Check for MCP tools**: If `context7_get_library_docs` and `context7_resolve_library_id` are available in the agent’s tool list, use MCP.
2. **Fallback to CLI**: Otherwise, use `npx ctx7@latest` commands. Verify the CLI is installed by running `npx ctx7@latest --version`. If missing, prompt the user to run `ctx7 setup` or install manually.

## MCP Usage

| Tool | Purpose |
|------|---------|
| `context7_resolve_library_id` | Convert a library name (e.g. `/websites/context7`) to a Context7 library ID. |
| `context7_get_library_docs` | Retrieve documentation for a library ID, optionally filtered by topic. |

**Example**  
```
1. Resolve: context7_resolve_library_id({ libraryName: "/upstash/context7" })
2. Fetch docs: context7_get_library_docs({ context7LibraryId: "...", topic: "installation" })
```

## CLI Fallback

When MCP is unavailable, use the CLI:

```bash
# Resolve library ID
npx ctx7@latest resolve-library <libraryName>

# Get documentation
npx ctx7@latest get-library-docs <libraryId> [--topic <topic>]
```

**Example**  
```bash
ID=$(npx ctx7@latest resolve-library /upstash/context7)
npx ctx7@latest get-library-docs $ID --topic "installation"
```

If the CLI not authenticated, run `npx ctx7 login` and provide the API key.

## Workflow Guidance

- When asked about a library’s API or setup, **first resolve its library ID**, then fetch relevant docs.
- Use the `topic` parameter (e.g., "installation", "usage", "api-reference") to narrow results.
- For missing libraries, suggest the user add them via the [Context7 dashboard](https://context7.com) or generate a custom skill with `ctx7 skills generate`.

## Agent Rule

Add this rule to your coding agent’s settings to automatically use Context7:

```text
Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
```