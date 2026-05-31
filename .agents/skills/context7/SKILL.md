# Context7 Skill

This skill fetches up-to-date library documentation using [Context7](https://context7.com). It helps you answer questions about third‑party libraries with confidence.

## Runtime Adapter

This skill uses the **MCP server** (preferred) or the **Context7 CLI** as a fallback. Choose the mode automatically based on availability.

## MCP Server Mode (Preferred)

When the Context7 MCP server is configured (e.g., via `.mcp.json`), use the provided tools to retrieve documentation.

### How to set up
- Run `ctx7 setup` and select **MCP server** mode.
- For Claude Code, use `npx ctx7 setup --claude` or `npx ctx7 setup --claude --api-key YOUR_API_KEY` for headless/remote environments.

### Tools available
- `context7_get_library_docs` – returns markdown documentation for a library.
- `context7_search_libraries` – finds matching library IDs.

### Usage
```text
Tool: context7_get_library_docs
Library ID: /websites/context7
Topic: (optional)
```

## CLI Fallback

If the MCP server is not configured, fall back to the `ctx7` CLI.

### Prerequisites
- Set `CONTEXT7_API_KEY` environment variable (or run `ctx7 setup` to configure it).
- The CLI must be installed: `npx ctx7@latest` will auto-install.

### Fetch documentation
```bash
npx ctx7@latest docs get <libraryId>
```
Example:
```bash
npx ctx7@latest docs get /websites/context7
```
The output is a JSON object with a `docs` field containing the markdown documentation.

### Search for a library (optional)
```bash
npx ctx7@latest search <query>
```

## Typical Workflow

When a user asks a question about a library:

1. **Identify the library ID** from the user’s request or known IDs. If uncertain, search with the MCP tool or `ctx7 search`.
2. **Fetch the docs**.
   - If MCP is available → call `context7_get_library_docs`.
   - Else → run `npx ctx7@latest docs get <libraryId>` and parse the output.
3. **Use the returned documentation** to provide an informed answer. Cite the source.

## Fallback Behaviour When No Runtime Is Configured

If neither MCP nor the CLI is available, the skill cannot retrieve docs automatically. In that case:
- Tell the user they can set up Context7 quickly with `ctx7 setup`.
- Offer to help them obtain the API key from [context7.com](https://context7.com).
- Use your general knowledge, but note that documentation might be outdated.

## Environment Variables

| Variable            | Required | Description                              |
|---------------------|----------|------------------------------------------|
| `CONTEXT7_API_KEY`  | Yes      | API key for CLI and headless MCP usage.  |
