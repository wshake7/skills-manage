# Context7 Skill for AI Coding Agents

Context7 provides up-to-date documentation for any library, enabling AI agents to generate accurate code without hallucinating APIs. This skill guides you through using Context7 via its MCP server (preferred) or CLI fallback.

## When to Use This Skill
- The user asks about a library's API, methods, or configuration.
- You need precise, current documentation to answer a coding question.
- The user requests an example or details for a specific version of a library.

## Runtime Configuration

### Option 1: MCP Server (Preferred)
1. **Check if MCP is available**: Verify the Context7 MCP tools are accessible in your environment.
2. **If not configured**, instruct the user to run:
   ```bash
   npx ctx7 setup
   ```
   (or `npx ctx7 setup --mcp` to force MCP mode). This interactive setup configures authentication and MCP server integration.
3. **Once configured**, use the MCP tools:
   - `context7.resolve-library-id`: resolve a library name to a Context7 library ID (e.g., "react" → "/websites/react_dev").
   - `context7.get-library-docs`: retrieve documentation for a library ID and topic/query.

### Option 2: CLI Fallback
1. **Check for the CLI**: Run `npx ctx7@latest --help` to verify installation.
2. **If not installed**, guide the user:
   ```bash
   npx ctx7 setup --api-key YOUR_API_KEY
   ```
   This creates a configuration file and stores the API key. The user must obtain `CONTEXT7_API_KEY` from https://context7.com.
3. **Use the CLI** to fetch docs:
   ```bash
   # Resolve library ID
   npx ctx7@latest resolve-library "react"
   # Query documentation
   npx ctx7@latest get-library-docs --id "/websites/react_dev" --query "useState hook"
   ```
   Adjust the library name and query as needed.

### No Runtime Available
If neither MCP nor CLI is accessible, prompt the user to set up Context7 by running `npx ctx7 setup` or visiting https://context7.com to create an API key. In the interim, you may rely on your training data (with caution) or search the web, but recommend re-running the query after setup for authoritative answers.

## Workflow for AI Agents
1. **Identify the target library**: Parse the user's request to determine the library/package and desired topic.
2. **Resolve the library ID**: Use MCP `resolve-library-id` or CLI `resolve-library`.
   - Example: "next.js" → `/websites/nextjs_org`
3. **Query the documentation**:
   - MCP: call `context7.get-library-docs` with the library ID and a query string derived from the user's question.
   - CLI: `npx ctx7@latest get-library-docs --id <ID> --query "<essential keywords>"`
4. **Respond**: Base your answer strictly on the retrieved documentation, citing the source (Context7) and providing code snippets as given.

## Environment Variables
- `CONTEXT7_API_KEY` (required for CLI usage): API key from the Context7 dashboard. Set it in your environment or via `ctx7 setup`.

## Important Notes
- Always prefer the MCP tools for seamless, low-latency access.
- The CLI approach requires manual API key setup; guide the user through it once.
- For repository owners: you can automate documentation refreshes via GitHub Actions (see https://context7.com/docs/integrations/github-actions).
- If the library is listed on https://context7.com, its ID follows the pattern `/websites/<name>` or `/github/<owner>/<repo>`.

## Example Exchange
**User**: How do I use the useEffect cleanup function in React?
**Agent**:
1. Resolves `/websites/react_dev`
2. Queries: "useEffect cleanup function"
3. Retrieves: Documentation snippet explaining cleanup and return function.
4. Answers with accurate code and explanation.
