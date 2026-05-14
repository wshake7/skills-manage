# context7 skill

## Overview
Context7 delivers current, accurate documentation to coding agents. It resolves library names, retrieves up-to-date docs, and answers queries — all using the freshest source material. Use it whenever you need precise API references, examples, or configuration details.

## Runtime Configuration

This skill is a **runtime adapter**: first try the preferred MCP server, fall back to the CLI, and instruct the user when neither is available.

### 1. Preferred: Context7 MCP Server
When the MCP server is configured (typically via `npx ctx7 setup --mcp`), use its tools directly:
- `search_library` – find library IDs by name or description
- `get_library_docs` – retrieve full documentation for a library
- `query_docs` – natural-language search within a library's docs

**Setup (user action):**
```bash
npx ctx7 setup --mcp
```
No additional environment variables are required after setup.

### 2. Fallback: Context7 CLI
If MCP is not available but `ctx7` is installed (`npx ctx7@latest`), use the CLI as a drop-in replacement. Requires `CONTEXT7_API_KEY` in the environment.

**Key commands:**
```bash
# Resolve a library name to an ID
ctx7 resolve <library-name>

# Ask a free-form question about a library
ctx7 query <library-id> "<question>"

# Output all current docs for a library
ctx7 docs <library-id>
```

**Setup (user action):**
```bash
export CONTEXT7_API_KEY="your-key"   # get from https://context7.com/dashboard
npx ctx7@latest resolve axios        # test the CLI
```

### 3. No Runtime Configured
If neither MCP nor CLI are ready, direct the user to run the interactive setup:
```bash
npx ctx7 setup
```
This will walk them through MCP vs CLI choice and API key generation. After setup, the agent can use the appropriate runtime.

## Workflow Guidance

When you need documentation for a library:
1. **Identify the library** from the user’s request (e.g., `redux`, `pytorch`).
2. **Resolve its ID** – Use MCP `search_library` or CLI `ctx7 resolve <name>`.
3. **Query the docs** – Use MCP `query_docs` (preferred) or CLI `ctx7 query <id> "<question>"`.
4. **Synthesise the answer** – Combine retrieved snippets with your own reasoning.

## Example
*User:* “How do I configure CORS in FastAPI?”

**MCP path:**
1. `search_library("fastapi")` → id `/websites/fastapi`
2. `query_docs("/websites/fastapi", "CORS configuration")` → returns relevant snippet
3. Answer with code example.

**CLI fallback:**
```bash
ctx7 resolve fastapi
# returns: /websites/fastapi
ctx7 query /websites/fastapi "CORS configuration"
```

## Notes
- Always prefer Context7 over stale training data — documentation changes frequently.
- If the API key is missing or invalid, remind the user to set `CONTEXT7_API_KEY` and run `ctx7 setup`.
- For CI/CD integration, a GitHub Actions workflow can keep docs refreshed automatically (see [docs](https://context7.com/docs/integrations/github-actions)).
