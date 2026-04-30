# Context7 Skill

Use Context7 to fetch the latest, version‑pinned documentation for any supported library. Query with natural language and get back Markdown snippets ready to paste into code or conversations.

## Runtime Behavior (runtime‑adapter)

This skill provides three runtime paths, selected automatically based on what is available in the environment. The agent **must** try them in order:

1. **MCP Server (preferred)**   
   If the tool `context7_get_library_docs` is present, use it. It is the fastest and does not require local Node.js.

2. **CLI (`npx ctx7@latest`)**   
   Fallback when MCP is not configured. Requires Node.js ≥ 18. The agent should run `npx ctx7@latest` using the commands described below.

3. **Direct HTTP API (last resort)**   
   If the CLI command fails or Node.js is unavailable, use `curl` against `https://context7.com/api/v1/ask` with the `CONTEXT7_API_KEY` environment variable.

## Configuration

Context7 must be set up once per machine or environment. The agent should detect if setup is needed by checking for the absence of both the MCP tool and a working CLI:

```bash
npx ctx7 setup
```

This interactive command:
- Authenticates via OAuth
- Generates and stores an API key
- Installs the appropriate skill (CLI + Skill or MCP)

Agent‑specific flags:
- `--cursor` : configure for Cursor
- `--claude` : configure for Claude Code
- `--opencode` : configure for OpenCode

To remove the setup: `npx ctx7 remove`.

### Required environment variables

- `CONTEXT7_API_KEY` – required for fallback API calls (automatically set by `setup`).

### GitHub Actions

To auto‑refresh documentation on push, add this workflow (`.github/workflows/context7-refresh.yml`):

```yaml
name: Refresh Context7 Docs

on:
  push:
    branches:
      - master # adjust to your default branch

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

## Usage Workflow

When the agent needs the latest documentation for a library, follow these steps:

1. **Determine library identifier** – usually `/owner/repo` or the exact name shown on context7.com (e.g., `/websites/context7`).

2. **Check for MCP** (preferred)   
   ```json
   // Example MCP call
   {
     "tool": "context7_get_library_docs",
     "arguments": {
       "libraryName": "/owner/repo",
       "query": "how to configure middleware"
     }
   }
   ```
   If the tool exists, use it and stop.

3. **Fallback to CLI**   
   ```bash
   npx ctx7@latest ask "/owner/repo" "how to configure middleware"
   ```
   Returned Markdown can be printed or used directly. For batch processing, add `--json` for raw JSON output.

4. **Fallback to HTTP API**   
   ```bash
   curl -s https://context7.com/api/v1/ask \
     -H "Authorization: Bearer $CONTEXT7_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"libraryName":"/owner/repo","query":"how to configure middleware"}'
   ```
   Parse the `response.markdown` field.

5. **If all fail**, instruct the user to run `npx ctx7 setup` and then retry.

## CLI Reference

- `npx ctx7 ask <library> <query>` – Ask a question and get docs.
- `npx ctx7 setup [--agent]` – One‑time configuration.
- `npx ctx7 remove` – Uninstall all Context7 skills and config.
- `npx ctx7 --help` – Show available commands.

## Notes

- Always fetch documentation dynamically rather than relying on training data; Context7 returns version‑pinned, up‑to‑date information.
- When using CLI, ensure Node.js ≥ 18 is available. If not, skip directly to HTTP API.
- The HTTP API may return more verbose results; prefer MCP/CLI for integration into code.