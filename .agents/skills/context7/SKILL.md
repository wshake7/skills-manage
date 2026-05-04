# Context7 Skill

Context7 fetches real-time documentation for libraries and tools.

## Runtime Adapters

### Preferred: MCP Server
When the Context7 MCP server is configured and running, use its tools (e.g., `context7_query`) to fetch documentation. The MCP server already handles authentication via your API key.

### Fallback: CLI
If MCP is not available, use the `ctx7` CLI. Ensure the environment variable `CONTEXT7_API_KEY` is set.

Install CLI globally:
```bash
npm install -g ctx7@latest
```

Or use via npx:
```bash
npx ctx7@latest <command>
```

### API Key Setup
If `CONTEXT7_API_KEY` is not set, run:
```bash
npx ctx7 setup
```
This opens a browser to authenticate and creates the key automatically. Alternatively, get a key from https://context7.com and export it:
```bash
export CONTEXT7_API_KEY=your_key
```

## Usage Workflow

1. **Check runtime**: Prefer MCP if tools are available. If not, fallback to CLI.
2. **Query documentation**:
   - MCP: Call `context7_query` with the library identifier (e.g., `/websites/context7`).
   - CLI: Run `npx ctx7@latest query --id <library-id>`.
3. **Install skills** (if needed):
   - CLI: `npx ctx7@latest skills install <repo> [skillname]` or `--all`.
   - MCP: Not available; use CLI fallback for skill installation.
4. **Generate custom skills**:
   - CLI: `npx ctx7@latest login` then `npx ctx7@latest skills generate`.
   - MCP: Not available; use CLI.

## Examples

### Fetching React documentation
MCP: `context7_query({ library: "/websites/react" })`
CLI: `npx ctx7@latest query --id /websites/react`

### Installing a skill from GitHub
`npx ctx7@latest skills install /anthropics/skills pdf`

### Refreshing docs via API (without runtime)
```bash
curl -X POST https://context7.com/api/v1/refresh \
  -H "Authorization: Bearer $CONTEXT7_API_KEY" \
  -d '{"libraryName": "/owner/repo"}'
```

## Detection Logic for Agent
- Check for MCP server availability.
- If not, check if `ctx7` command exists and `CONTEXT7_API_KEY` is set.
- If neither, prompt user to run `npx ctx7 setup`.
