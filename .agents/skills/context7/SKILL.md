# Context7 Skill

## Purpose
Use Context7 to retrieve the latest, official documentation for libraries and frameworks. This skill ensures answers are based on current versions, not outdated data.

## Preferred Runtime: MCP Server
If a Context7 MCP server is available (check agent MCP configuration), use the `context7_query` tool to fetch live documentation. The MCP server provides the most seamless integration.

## CLI Runtime
When MCP is not configured, fall back to the CLI. Verify `ctx7` is installed and the `CONTEXT7_API_KEY` environment variable is set.

### Installation
To install the CLI and generate an API key:
```bash
npx ctx7 setup
```
The interactive setup will prompt for MCP or CLI + Skills mode. For headless environments, pre-configure with:
```bash
npx ctx7 setup --api-key YOUR_API_KEY
```
For specific agents:
- Cursor: `npx ctx7 setup --cursor`
- Claude Code: `npx ctx7 setup --claude`

### Query Documentation
Once configured, query with:
```bash
ctx7 query <library> <your question>
```
Example:
```bash
ctx7 query react how to use useState hook
```
The output is a markdown snippet from official docs. Include it verbatim in your response, citing Context7.

### Refresh Documentation
To update a library’s docs after a new release:
```bash
ctx7 refresh <library>
```

## Fallback Behavior
If neither MCP nor CLI is available (no API key, command not found):
1. Inform the user they can enable Context7 by running `npx ctx7 setup`.
2. Proceed with alternative documentation retrieval: use web search, fetch the official docs URL directly, or rely on built-in training data. Clearly indicate the documentation source and potential staleness.

## Workflow Guidelines
1. **Before answering any library‑specific question**, check if Context7 runtime can be used.
2. If yes, query the relevant library. Use the returned content as the primary source.
3. If the context returned is insufficient, combine with other sources but still cite Context7 for the official parts.
4. If the user explicitly asks to refresh docs, use `ctx7 refresh` (or MCP equivalent).
5. For CI/CD integration, mention the GitHub Actions workflow (optional).

## Notes
- Context7 API key is required for CLI and MCP access. It can be generated via `npx ctx7 setup`.
- The `ctx7` CLI is available as `npx ctx7@latest` without global installation.
- Prefer MCP over CLI for lower latency and richer agent integration.