# Context7 Skill

Context7 provides real‑time, up‑to‑date documentation for thousands of libraries via MCP server or CLI. Use it to answer questions about library APIs, functions, and code examples with authoritative sources.

## Setup

### Preferred: MCP Server (for AI Agents)

Add the Context7 MCP server to your Codex configuration:

```sh
codex mcp add context7 -- npx -y @upstash/context7-mcp --api-key YOUR_CONTEXT7_API_KEY
```

Alternatively, manually configure an MCP server in your client’s `mcp.json` with the command:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "${CONTEXT7_API_KEY}"]
    }
  }
}
```

### Alternative: CLI

1. Ensure Node.js ≥ 18 is available.
2. Install or run via `npx ctx7@latest`.
3. Set the environment variable:
   ```bash
   export CONTEXT7_API_KEY=your_api_key
   ```
4. Optionally run the interactive setup:
   ```bash
   npx ctx7 setup
   ```

## Usage

When you need precise documentation for a library:

1. **Identify the library slug** (e.g., `/expressjs/express` for Express, `/mongodb/bson`).
2. **MCP** (preferred):
   - Invoke the MCP tool `context7_getLibraryDocs` with the library slug and your query.
   - Example: `context7_getLibraryDocs({ library: "/expressjs/express", query: "set response header" })`
   - The result contains current code snippets and API details.
3. **CLI** (fallback):
   ```bash
   npx ctx7 query "set response header" --library /expressjs/express
   ```
   - To browse a library’s full documentation tree:
     ```bash
     npx ctx7 get-library /expressjs/express
     ```

## Fallback Behavior

If neither the MCP server nor the CLI is configured (missing API key or tool unavailable):

- **Inform the user** that Context7 is not available and suggest setup:
  > Context7 is not configured. Run `npx ctx7 setup` or add the MCP server to enable instant, up‑to‑date library documentation.
- **Temporary fallback**: Perform a web search for the library’s documentation. Results may be outdated or inaccurate. Prefer prompting the user to provide an API key or run the setup for best results.
