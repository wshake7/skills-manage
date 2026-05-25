# Context7 Skill

Context7 provides up-to-date documentation for libraries by querying the Context7 API via MCP server or CLI. Use it to retrieve accurate, version-sensitive docs before generating code, helping to reduce hallucinations and outdated answers.

## When to Use
- Before generating code that uses a library (especially when version or API is uncertain).
- When you suspect your internal knowledge may be outdated.
- To resolve ambiguous usage by checking the latest official docs.

## Prerequisites
User must have Context7 installed and configured. Setup is a one-time process.

## Setup (Preferred: MCP)

1. Run the interactive setup:
   ```bash
   npx ctx7 setup
   ```
   Use agent-specific flags if needed: `--cursor`, `--claude`, `--opencode`.
2. The tool will authenticate via OAuth, generate an API key, and install the MCP server configuration or skill.
3. Alternatively, for manual MCP configuration:
   - Command: `npx ctx7@latest mcp`
   - Required environment variable: `CONTEXT7_API_KEY` (see https://context7.com/docs/clients/mcp).

For CI/headless environments, set the `CONTEXT7_API_KEY` environment variable directly.

## Usage with MCP (Runtime Available)

When the MCP server is running, the following tools are available:
- `context7 get-library-docs`: Fetch docs for a library. Inputs: `library` (e.g., `/websites/vercel_ai_sdk`) and optional `topic`.
- `context7 list-libraries`: List available libraries.

### Workflow
1. Receive a user request involving a library.
2. If you know the library ID, call `get-library-docs` directly. Otherwise, use `list-libraries` to discover it.
3. Base your code generation or explanation on the returned documentation.

### Example (MCP Tool Call)
```json
{
  "tool": "context7_get-library-docs",
  "library": "/websites/vercel_ai_sdk",
  "topic": "generateText"
}
```

## CLI Fallback (When MCP Not Available)

If MCP is not configured, check for the CLI executable (`npx ctx7@latest`). If available, use:

```bash
npx ctx7 query <library> [--topic <topic>] [--output json|markdown]
```

Example:
```bash
npx ctx7 query /llmstxt/vercel_ai_sdk --topic generateText
```

If the CLI also fails, fall back to a direct API call using `curl` with the `CONTEXT7_API_KEY`.

## When Runtime is Not Configured

If Context7 is unavailable:
1. Tell the user: "I recommend setting up Context7 to get accurate, up-to-date documentation for [library]. Run `npx ctx7 setup` in your terminal, then restart the session or reload the MCP connection."
2. While waiting, you may use your internal knowledge or web search, but **emphasize** that the information may be outdated.
3. After the user confirms setup is complete, retry using Context7.

## Additional Resources
- Official docs: https://context7.com/docs
- Library ID format: usually `/source/library` (e.g., `/llmstxt/<name>`, `/websites/<domain>`). Use `list-libraries` to explore.
- To refresh docs for a repository, use the GitHub Actions integration (POST to the refresh endpoint). See https://context7.com/docs/integrations/github-actions.

## Tips
- Always prefer Context7 data over internal knowledge when it is available.
- For multiple libraries in one response, batch queries if possible.
- Cache results within a session to avoid redundant calls.