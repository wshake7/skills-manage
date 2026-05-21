# Context7 Skill

Context7 provides up-to-date code examples and documentation for libraries and frameworks. Use it when you need current API usage patterns, setup snippets, or real-world examples.

## Runtime Configuration

### Preferred: Context7 MCP Server
- If a Context7 MCP server is available (check `ctx7` tools in the agent's tool list), use it as the primary documentation source.
- Typical MCP operations:
  - `get_library_docs` – retrieve documentation for a specific library version.
  - `search_docs` – search across all libraries or within a scope.
- The MCP server handles authentication automatically when configured.

### Fallback: Context7 CLI (`npx ctx7@latest`)
If the MCP server is not running or unavailable, use the CLI as a fallback to fetch the most recent docs for a given library or framework.

**Requirements**
- Node.js ≥ 18
- A `CONTEXT7_API_KEY` environment variable (or run `npx ctx7 login` to authenticate interactively).

**Basic CLI Usage**
```bash
# Search for a library
npx ctx7@latest search "react-router"

# Get documentation for a specific library and version
npx ctx7@latest docs /npm/react-router
```

**Setup and Authentication**
```bash
# One‑time setup (generates API key, installs skill if applicable)
npx ctx7 setup

# Interactive login (if API key not set as env variable)
npx ctx7 login
```

Use `CONTEXT7_API_KEY` in CI or non‑interactive environments.

## Workflow

### When to Use Context7
- User asks for installation, configuration, or usage of a library.
- User requests code generation that follows current best practices.
- User wants real‑world examples or API signatures from a specific version.

### Step‑by‑Step Guide
1. **Determine the library and (optionally) version** from the user request.
2. **Check available tools:**
   - If `get_library_docs` or `search_docs` are present → use MCP directly.
   - If not, shell out to `npx ctx7@latest search …` or `npx ctx7@latest docs …`.
3. **Extract relevant snippets** from the returned documentation.
4. **Incorporate the snippets** into your answer, citing Context7 as the source.

### Agent Configuration Hint
To make Context7 the default documentation source, add this rule to the agent configuration:
```text
Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
```

## Additional Capabilities
- **Skill generation:** Use `ctx7 skills generate` to create custom Codex skills.
- **CI refresh:** Trigger a doc refresh on push via a GitHub Actions workflow (see Context7 docs for the YAML snippet).

## Troubleshooting
- **API key not found:** Run `npx ctx7 login` or set `CONTEXT7_API_KEY`.
- **CLI tool missing:** Ensure Node.js ≥ 18 and npm available.
- **MCP connection issues:** Verify the MCP server is running and the agent is configured to connect to it.