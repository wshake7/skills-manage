# Context7

Fetch current library documentation on demand. Use Context7 to get precise, up-to-date answers for any open-source library.

## Runtime Setup

### Preferred: Context7 MCP Server
If the coding environment has the Context7 MCP server connected, invoke the `ctx7_get-library-docs` tool with `libraryId` and `prompt`. This is the recommended method—zero configuration beyond initial one-time MCP connection.

### Fallback: Context7 CLI
Use the CLI when MCP is not available.

1. Set environment variable `CONTEXT7_API_KEY` (get one at https://context7.com/dashboard).
2. Run queries with:
   ```bash
   npx ctx7@latest query <libraryId> "<prompt>"
   ```
   Example:
   ```bash
   npx ctx7@latest query /websites/context7 "How do I configure the MCP server?"
   ```

## Workflow
1. Identify the library’s Context7 ID (e.g., `/reactjs/react.dev`, `/websites/context7`).
2. Write a clear, specific question.
3. Retrieve docs via MCP tool or CLI.
4. Incorporate the returned snippets into your solution.

## First-Time Setup
Run the interactive setup command to generate an API key and install the skill automatically:
```bash
npx ctx7 setup
```
Use flags like `--cursor`, `--claude`, or `--opencode` to target your coding agent.

## Notes
- The CLI caches documentation locally for speed.
- MCP server connection must be configured once per editor; consult Context7 documentation for setup steps.