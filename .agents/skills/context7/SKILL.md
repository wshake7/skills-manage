# Context7 Skill

## Description
Context7 provides live, up-to-date documentation for any library. This skill enables you to fetch current docs via the Context7 MCP server or CLI, ensuring accurate and timely information.

## Setup
Run the interactive setup to configure your environment:
```bash
npx ctx7@latest setup
```
This will walk you through choosing MCP or CLI mode and save your API key. The API key can be generated at [context7.com](https://context7.com) or obtained via `ctx7 login`. The key must be available as the environment variable `CONTEXT7_API_KEY`.

## Usage

### Preferred: MCP Server
If Context7 is configured as an MCP server (check for a tool named `context7_get-library-docs`), use it directly:
- **Tool**: `context7_get-library-docs`
- **Parameters**:
  - `library` — library ID (e.g., `/websites/upstash_ratelimit`) or a GitHub URL
  - `topic` (optional) — a natural language topic or query
- **Example**: Ask the AI agent to invoke `context7_get-library-docs` with `library: "/websites/react"` and `topic: "useEffect cleanup"`. The server returns freshly scraped documentation.

### Fallback: CLI
When the MCP server is unavailable, use the CLI with the environment variable `CONTEXT7_API_KEY` set:
```bash
npx ctx7@latest search <library> <query>
```
- `<library>` — library ID or GitHub URL
- `<query>` — a natural language topic or question

**Examples:**
```bash
npx ctx7@latest search /websites/react useEffect dependencies
npx ctx7@latest search https://github.com/upstash/ratelimit-js basic usage
```

## Keeping Documentation Fresh (Optional)
Add a GitHub Actions workflow to auto-refresh documentation on pushes:
```yaml
name: Refresh Context7 Docs
on:
  push:
    branches: [main]
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -s -X POST https://context7.com/api/v1/refresh \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.CONTEXT7_API_KEY }}" \
            -d '{"libraryName": "/${{ github.repository }}"}'
```

## Notes
- Always prefer the MCP path when available; it is faster and more integrated.
- If you encounter authentication errors, re-run `ctx7 login` or verify the `CONTEXT7_API_KEY` environment variable.
- Use exact library identifiers (e.g., `/websites/react` or a full repository URL) to avoid ambiguous results.
