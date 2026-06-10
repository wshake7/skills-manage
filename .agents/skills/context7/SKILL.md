# Context7 Runtime Adapter

Context7 provides up-to-date documentation for any library via MCP or CLI. This skill covers how to fetch current docs at runtime before providing code references.

## Runtime Requirements

- **Preferred:** Context7 MCP server. Set up via `ctx7 setup` (select MCP server mode).
- **Fallback:** Context7 CLI (`npx ctx7@latest`) with `CONTEXT7_API_KEY` environment variable.
- **User Setup:** The user must configure Context7 at least once. If not configured, guide the user to run `ctx7 setup` or set the API key.

## Workflow

1. **Resolve Library:** If the user mentions a library (e.g., “React Server Components”), resolve its library ID:
   - MCP: use `context7_resolve-library-id` tool
   - CLI: `npx ctx7 resolve "library name"`

2. **Fetch Docs:** Retrieve current documentation for the resolved ID:
   - MCP: use `context7_get-library-docs` with the library ID, topic, etc.
   - CLI: `npx ctx7 docs <library-id> --query "specific topic"` (or omit query for overview)

3. **Search:** For ad‑hoc questions:
   - CLI: `npx ctx7 search "how to do X in library Y"`

4. **Generate Skill (optional):** To create or update a Codex skill for a library, run:
   ```bash
   ctx7 login
   ctx7 skills generate
   ```

## Environment

- Set `CONTEXT7_API_KEY` as an environment variable (obtain from <https://context7.com/dashboard>).
- Alternatively, run `ctx7 login` to store credentials locally (interactive).

## CLI Quick Reference

| Command | Purpose |
|---------|---------|
| `npx ctx7 setup` | Interactive setup (choose MCP or CLI) |
| `npx ctx7 login` | Authenticate with Context7 |
| `npx ctx7 resolve "name"` | Find the library ID |
| `npx ctx7 docs <id> [--query "..."]` | Get documentation (optionally filtered) |
| `npx ctx7 search "query"` | Search across all libraries |
| `npx ctx7 skills generate` | Interactive skill generation |

## Fallback Behavior

- **If MCP is not configured:** Fall back to CLI with `CONTEXT7_API_KEY`. If API key also missing, instruct the user to run `ctx7 setup` or set the key.
- **If neither MCP nor CLI is working:** The agent cannot use Context7. In that case, rely on the underlying model’s built-in knowledge or inform the user that current docs are unavailable. Suggest setting up Context7 for future queries.

## Notes

- Prefer MCP for lower latency and automatic context injection. Use CLI only when MCP is not available.
- The CLI fetches live docs each time; caching is minimal. For heavy usage, consider MCP.
- Never hardcode API keys inside the skill.