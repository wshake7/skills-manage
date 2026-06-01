# Context7 Skill

Context7 keeps your AI coding agent up-to-date with live documentation for any library. It fetches current API references, guides, and examples, reducing the risk of using outdated or hallucinated code.

## Runtime Overview

- **Preferred**: MCP server (configured via `ctx7 setup` and your editor).  
- **Fallback**: CLI (`npx ctx7@latest`).  
- **Required**: `CONTEXT7_API_KEY` environment variable (obtain from [context7.com](https://context7.com)).

## Using Context7 Runtime (MCP / CLI)

Once the runtime is configured, the agent can either call the MCP tools directly or execute CLI commands.

### When MCP Is Available
Use the provided MCP tools to resolve library IDs, retrieve full documentation, or search across texts:

- `resolve-library-id`: convert a library name to a Context7 identifier.  
- `get-library-docs`: return the latest markdown documentation for a library.  
- `search-docs`: search documentation for specific keywords or signatures.

### When CLI Is Available (No MCP)
Run commands with `npx ctx7`:

```bash
# Authenticate (one-time)
npx ctx7 login
```

```bash
# Fetch latest docs for a library
npx ctx7 docs react            # by name
npx ctx7 docs /websites/react  # by Context7 ID
```

```bash
# Search within a library's docs
npx ctx7 search "useEffect cleanup" --library react
```

```bash
# Generate a custom skill for a specific library
npx ctx7 skills generate
```

### Initial Setup (If Not Yet Configured)
Run the interactive setup to configure MCP or CLI + Skills:

```bash
npx ctx7 setup
```

For editors like Claude Code or OpenCode, use the appropriate flag:

```bash
npx ctx7 setup --claude          # for Claude Code
npx ctx7 setup --opencode        # for OpenCode
```

## Fallback Behavior (Runtime Not Configured)

- If `CONTEXT7_API_KEY` is missing or the CLI/MCP tools are unavailable, the agent **cannot** fetch live docs.
- **What the agent should do**: inform the user that Context7 is not set up and suggest running `ctx7 setup` with a valid API key.
- **Alternatives**:  
  - Set up a [GitHub Actions workflow](#auto-refresh-docs) to keep a local snapshot of docs.  
  - Manually download docs from the Context7 web dashboard.

## Workflow Guidance

1. **Before writing code**: fetch the latest documentation for every library in scope (e.g., `react`, `axios`, `prisma`).  
2. **When you encounter an unfamiliar API**: use `search-docs` (or `ctx7 search`) with the function or component name.  
3. **Error diagnosis**: search the library’s docs for error messages or deprecated signatures.  
4. **Code generation**: always provide documentation-backed examples to avoid hallucinations.  
5. **Updating stale knowledge**: if you suspect the docs are outdated, trigger a manual refresh via CLI or the GitHub Action.

## Commands Quick Reference

| Command | Purpose |
|---------|---------|
| `ctx7 setup` | Interactive MCP / CLI configuration |
| `ctx7 login` | Store API key locally |
| `ctx7 docs <lib>` | Output latest full docs |
| `ctx7 search <query> --library <lib>` | Search within a library |
| `ctx7 skills generate` | Generate a custom skill for a library |

## Environment Variables

- `CONTEXT7_API_KEY` — Your Context7 API key. Required for both CLI and MCP authentication.

## Auto‑Refresh Docs (GitHub Actions)

Add this workflow (`.github/workflows/context7-refresh.yml`) to keep a project’s documentation snapshot up to date on push:

```yaml
name: Refresh Context7 Docs

on:
  push:
    branches:
      - master  # adjust to your default branch

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Context7 Refresh
        run: |
          curl -s -X POST https://context7.com/api/v1/refresh \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.CONTEXT7_API_KEY }}" \
            -d '{"libraryName": "/${{ github.repository }}"}'
```

## Notes

- Prefer the MCP server whenever possible — it provides a tighter integration with AI editors.  
- If a library is not publicly available, create it via the Context7 dashboard and use its custom ID.  
- Keep the API key secure; do not commit it to repositories.