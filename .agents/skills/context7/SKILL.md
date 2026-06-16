# Context7 Skill

Context7 delivers real‑time, version‑aware documentation snippets for libraries and frameworks.

## Runtime Requirements

- **Preferred**: Context7 MCP server  
- **Fallback CLI**: `npx ctx7@latest`  
- **Environment**: `CONTEXT7_API_KEY` (required for CLI, optional for MCP if key already supplied)

## Setup

1. Run the interactive setup:
   ```bash
   npx ctx7 setup
   ```
   It will guide you to install the MCP server or configure the CLI + API key.

2. For headless environments, provide the key directly:
   ```bash
   npx ctx7 setup --api-key YOUR_API_KEY
   ```

## Workflow

### 1. Check Available Runtime

- **If an MCP server named `context7` is running**: use its tools.
- **Otherwise, check for CLI**: `npx ctx7 --version`. If present and `CONTEXT7_API_KEY` is set, use CLI commands.
- **If neither is available**: instruct the user to run `npx ctx7 setup` or set the API key manually.

### 2. Query Documentation

#### Using MCP (Preferred)

Typical tools (names may vary):

- `context7_search`: search libraries or topics
- `context7_get_docs`: retrieve specific documentation snippet

Example:
```json
{
  "tool": "context7_search",
  "arguments": {"query": "react useEffect"}
}
```

#### Using CLI (Fallback)

```bash
npx ctx7 search "react useEffect"
```

To fetch a specific page:
```bash
npx ctx7 get /websites/react/reference/useEffect
```

To list available libraries for a query:
```bash
npx ctx7 list react
```

#### Handling Results

Snippets include version info (e.g., library version at retrieval time). Respect that version in your answers. If the user needs a different version, re‑query with a version qualifier (if supported) or note the discrepancy.

### 3. Updating Documentation

To force a refresh of a library’s docs (e.g., after a release), trigger the webhook:

```bash
curl -s -X POST https://context7.com/api/v1/refresh \
  -H "Authorization: Bearer $CONTEXT7_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"libraryName": "/owner/repo"}'
```

Alternatively, include a GitHub Actions workflow (see [GitHub Actions](#github-actions)).

## Fallback Behavior

- **No MCP / No CLI with API key**: Prompt the user to install and configure Context7. Offer the setup command and explain that it enables accurate, real‑time documentation.
- **CLI installed but `CONTEXT7_API_KEY` missing**: Remind the user to export their key or run `ctx7 login`.

## Integration Tips

- Prefer MCP for lowest latency and seamless integration into your tool‑call loop.
- When using the CLI, cache results for a short time (e.g., session) to reduce repeated calls.
- If the user works with multiple libraries, prepopulate commonly used snippets by calling `ctx7 get` for each.

## GitHub Actions

Add `.github/workflows/context7-refresh.yml`:
```yaml
name: Refresh Context7 Docs

on:
  push:
    branches:
      - master

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

## Advanced: Generating Custom Skills

Use `ctx7 skills generate` to create new Context7‑powered skills for your own libraries. You must be logged in (`ctx7 login`) first.
