# Context7 Skill

Context7 provides up-to-date, AI-friendly documentation for thousands of libraries. This skill helps you fetch and use that documentation in your coding workflow.

## Preferred Runtime: Context7 MCP Server

When your environment has the Context7 MCP server configured, use its tools directly:

- `get-library-docs` – Fetch documentation for a library using its Context7 ID (e.g., `/websites/context7`).
- `resolve-library-id` – Convert a library name to its ID.

Example:
```
Tool: get-library-docs
Arguments: { "id": "/upstash/redis" }
```
The MCP server injects your `CONTEXT7_API_KEY` automatically.

## Fallback: Context7 CLI or REST API

If the MCP server is not available, fall back to the CLI or direct API calls.

### CLI (via `npx ctx7@latest`)

Ensure `CONTEXT7_API_KEY` is set in your environment.

Common commands:
```bash
# Query Context7 knowledge base
npx ctx7 query "How to use upstash/redis pipeline?"

# Fetch raw library docs (if command exists; check --help)
npx ctx7 docs --library /upstash/redis

# Manage skills
npx ctx7 skills install /anthropics/skills --all
npx ctx7 skills generate
```

If the CLI `docs` command is unavailable, use the REST API.

### REST API (with `CONTEXT7_API_KEY`)

```bash
curl -s -H "Authorization: Bearer $CONTEXT7_API_KEY" \
  "https://context7.com/api/v1/libraries/$(echo /upstash/redis | sed 's|/|%2F|g')/docs"
```

## Setup & Configuration

If no runtime is configured, prompt the user to run:

```bash
npx ctx7 setup
```

This interactive flow handles authentication, API key generation, and installs the appropriate MCP or CLI connector.

## Workflow Guidance for Coding Agents

1. **Identify the library** – Find its Context7 ID (e.g., `/websites/context7`).
2. **Prefer MCP** – If the Context7 MCP server is active, call `get-library-docs` with the ID.
3. **Fallback to CLI** – If MCP is not present, run `npx ctx7 query "<your question>"` or fetch docs via API.
4. **Freshness** – For project-level automation, consider adding a GitHub Actions workflow to refresh documentation on push (see Context7 docs).

## Additional Capabilities

- **Skill installation** from any GitHub repo: `npx ctx7 skills install /owner/repo`
- **Custom skill generation**: `ctx7 login && ctx7 skills generate`
- **Coding agent rule**: Add the following rule to ensure Context7 is always used for library documentation:
  ```
  Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
  ```