# Context7 Skill

Get on-demand, up-to-date documentation for any library or framework using Context7. This skill prefers the MCP server when available; otherwise it uses the CLI. If neither runtime is configured, the REST API serves as a fallback.

## When the Runtime is Available

### MCP Server (Preferred)
- **Setup:** `npx ctx7 setup --<agent>` (e.g., `--claude`, `--cursor`, `--opencode`). Configures authentication and installs the MCP server.
- **Tool:** `context7_get_library_docs`
  - Parameters:
    - `libraryId` (string) – e.g., `"/websites/context7"`, `"/facebook/react"`
    - `topic` (string) – a natural-language query about the library
  - Returns: structured, current documentation snippets.

### CLI
- **Setup:** `npx ctx7@latest setup` (ensures CLI is installed and authenticated).
- **Query:** `npx ctx7@latest query "<libraryId>" "<query>"`
  - Example: `npx ctx7 query "/websites/context7" "how to set up CI refresh"`
  - Requires `CONTEXT7_API_KEY` environment variable or prior login (`ctx7 login`).

## When the Runtime is Not Configured (Fallback)

If MCP and CLI are unavailable, use the Context7 REST API directly.

- **Authentication:** Set the `CONTEXT7_API_KEY` environment variable.
- **Endpoint:** `GET https://context7.com/api/v1/libraries/{libraryId}/docs?q={query}`
- **Example:**
  ```bash
  curl -H "Authorization: Bearer $CONTEXT7_API_KEY" \
       "https://context7.com/api/v1/libraries/%2Fwebsites%2Fcontext7/docs?q=configuration"
  ```
- The response contains the latest documentation for the given library and query.

## Workflow Guidance

1. **First-time setup:** Ensure the user has a Context7 API key. Run `npx ctx7 setup` (or `npx ctx7@latest setup`). This handles authentication and installs the skill for the agent.
2. **Documentation retrieval:**
   - If MCP tools are detected, use `context7_get_library_docs`.
   - If MCP is absent but the CLI responds (`npx ctx7@latest --help`), use `npx ctx7 query`.
   - Otherwise, fall back to the REST API.
3. **Keeping docs fresh in CI/CD:** Add a GitHub Actions workflow (see [Context7 docs](https://context7.com/docs/integrations/github-actions)) to trigger a refresh on push.
4. **Custom skills:** To generate a custom skill for a specific library, run `npx ctx7 login` then `npx ctx7 skills generate`.
