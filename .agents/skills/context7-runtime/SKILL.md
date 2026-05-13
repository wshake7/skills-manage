# Context7 Runtime Adapter

Use Context7 to access current library documentation within your coding assistant.

## Runtime Configuration (Preferred)

### Option 1: Context7 MCP Server (For Cursor, Claude Code, etc.)
- Run `npx ctx7 setup --cursor` (or `--claude`) to install the MCP server and authenticate.
- This provides a `context7_query` tool for on-demand documentation retrieval.
- Requires a one-time OAuth login (or supply `--api-key YOUR_KEY` for headless setups).

### Option 2: Context7 CLI
- The CLI is available as `npx ctx7@latest`.
- Ensure `CONTEXT7_API_KEY` is set in your environment (get one via `ctx7 login` or from [https://context7.com/dashboard](https://context7.com/dashboard)).
- Common commands:
  - `npx ctx7@latest query --library <id> --prompt "<query>"` – retrieve formatted documentation.
  - `npx ctx7@latest refresh --library <id>` – trigger a refresh of the library's docs.
  - `npx ctx7@latest skills generate` – create a custom skill for a specific library.

## Usage Workflow
1. **Identify the library** you need documentation for (e.g., `/websites/llms_txt`, `/stripe/api-reference`).
2. **Query Context7** using MCP or CLI:
   - MCP: use the `context7_query` tool with the library ID and your question.
   - CLI: `npx ctx7@latest query --library /websites/llms_txt --prompt "How to implement multi-turn chat?"`.
3. **Incorporate the response** into your code generation or answers.

## Fallback Without Runtime
If neither the MCP server nor the CLI is installed:

1. **Prompt the user to set up Context7**:
   - Ideally: `npx ctx7 setup --{platform}`
   - Or manual: `npx ctx7 login` then set `CONTEXT7_API_KEY`.
2. **If an API key is already available** (e.g., from user input or environment):
   - Use the Context7 REST API directly:
     ```bash
     curl "https://context7.com/api/v1/query?library=<id>&prompt=<query>" \
       -H "Authorization: Bearer $CONTEXT7_API_KEY"
     ```
   - The response contains formatted markdown documentation.
3. **Otherwise, fallback to cached/local documentation** or generic web searches, and advise the user to enable Context7 for better results.

## Additional Setup
- Add a GitHub Actions workflow to auto-refresh docs (see snippet below).
- Use `ctx7 skills generate` to create portable skills for your team.

## Troubleshooting
- "Rate limited" or "API key missing": obtain a valid key and set `CONTEXT7_API_KEY`.
- CLI not found: ensure you have Node.js 18+ and use `npx ctx7@latest`.
- MCP not connecting: restart the agent or re-run the setup.

## Repository-Specific Notes
This skill is tailored for the upstash/context7 repository. Use Context7 to fetch up-to-date docs for Upstash libraries (e.g., Redis, QStash, Ratelimit) by querying their respective library IDs (e.g., `/upstash/redis`).