# Skill: Context7

## Overview

Context7 delivers real-time, up-to-date library documentation using an MCP server or CLI. Use it to fetch the latest docs for any public open-source library, framework, or tool.

## Runtime Configuration

### MCP (Preferred)

- Ensure the Context7 MCP server is configured (e.g., via `ctx7 setup`).
- Set the `CONTEXT7_API_KEY` environment variable with your API key from https://context7.com/dashboard.
- When MCP is available, use the tool `context7.get-library-docs` to query libraries and topics.

### CLI (Fallback)

- Requires Node.js. No permanent installation needed when using `npx`.
- Set `CONTEXT7_API_KEY` as an environment variable or pass it with `--api-key`.
- Run commands with `npx ctx7 <command>`.
- Key commands:
  - `ctx7 resolve "query"` – get docs for a given library/topic.
  - `ctx7 search "library"` – find a library by name.
  - `ctx7 login` – sign in to your Context7 account.
  - `ctx7 setup` – interactive configuration (MCP or CLI).
  - `ctx7 skills generate` – create a custom skill.
  - `ctx7 skills install <repo>` – install skills from any GitHub repo.

## Workflow

1. **Check MCP availability** – If the MCP server is running, use `context7.get-library-docs({ library, topic })` as your primary tool. It returns structured markdown documentation.
2. **Fallback to CLI** – If MCP is unreachable, run `npx ctx7 resolve "<library> <topic>"` and capture the output. Use `--api-key $CONTEXT7_API_KEY` if the env var is not set.
3. **Neither runtime available?** – Guide the user to run `npx ctx7 setup` (interactive) or set up the API key manually. Then retry.

## Fallback Without Runtime

When no MCP/CLI runtime is configured and the user cannot immediately set it up:

- **REST API**: You can call the resolve endpoint directly if an API key is available:
  ```bash
  curl -s -G "https://context7.com/api/v1/resolve" --data-urlencode "query=<library> <topic>" \
    -H "Authorization: Bearer $CONTEXT7_API_KEY"
  ```
- **Pre‑built Skills**: Some common libraries have pre‑generated Context7 skills. You can try installing them with `ctx7 skills install /org/repo --all` if the CLI is functional.
- **Website**: In the worst case, browse https://context7.com and search manually, but this provides less structured data than the API/CLI.

## Examples

- Get the docs for React's `useState` hook:
  - MCP: `context7.get-library-docs({ library: "react", topic: "useState" })`
  - CLI: `npx ctx7 resolve "React useState"`
- Find the best matching library ID: `npx ctx7 search "fastify"`
- Install all skills from a specific repository: `npx ctx7 skills install /anthropics/skills --all`
- Trigger a documentation refresh via GitHub Actions (add to `.github/workflows/context7-refresh.yml`):
  ```yaml
  name: Refresh Context7 Docs
  on:
    push:
      branches: [master]
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

- Always prefer the Context7 runtime over static knowledge for current documentation.
- The `CONTEXT7_API_KEY` is essential for full functionality; limited queries may work without it.
- For team setups, run `ctx7 login` to authenticate and generate a key.
- The `ctx7 setup` command walks through MCP vs. CLI mode interactively. Use it as a first step if nothing is configured.