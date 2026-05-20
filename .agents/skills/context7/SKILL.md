---
skill: context7
description: Fetch up‑to‑date documentation and code context using Context7 (MCP/CLI). Always prefer the MCP runtime when available; fall back to the CLI.
activation:
  - user asks for current/accurate documentation for a library or framework
  - user mentions "context7" or "ctx7"
  - user wants to generate or refresh a Context7 skill
  - user requests a Codex skill for a library (trigger skill generation flow)
runtime: mcp (preferred), cli
env: CONTEXT7_API_KEY (required for CLI)
commands: npx ctx7@latest
---

# Context7 Skill

Context7 gives your coding agent instant access to live, version‑selected documentation. Use **MCP** as the primary runtime; fall back to the **CLI** (`ctx7`) when MCP is not configured.

## 1. Prerequisites

- A Context7 API key (stored in `CONTEXT7_API_KEY` env variable).
- For MCP mode, the agent must have a configured MCP server entry pointing to Context7.
- CLI fallback requires Node.js and `npx` available.

> If the runtime is not configured, **guide the user** through `npx ctx7 setup` (see [Setup](#setup)).

## 2. How to Use Context7 (Runtime Adapter)

### MCP Mode (Preferred)

When a Context7 MCP server is present, use the provided MCP tools:

- **Search / Query** – retrieve relevant documentation snippets by library name and query.
- **Get Library Details** – list available versions, source URLs, etc.
- **Resolve Library ID** – convert a library name (e.g., `/websites/context7`) to a stable ID.

**Workflow**:
1. Identify the library (user provides name or GitHub repo path, e.g., `upstash/context7`).
2. If needed, resolve the library ID via the `resolve-library-id` tool (input: `libraryName`).
3. Call `get-library-docs` with `context7CompatibleLibraryID` and a natural language `topic` or `query`.
4. Integrate the returned Markdown/HTML snippets directly into your response.

### CLI Fallback (`ctx7`)

If MCP is not available, use the `ctx7` CLI after ensuring the environment is set up:

```bash
# Ensure login and key
export CONTEXT7_API_KEY=<your-key>

# Search for documentation
npx ctx7 query "<libraryId>" "<topic or question>"

# Get only specific section or version (if supported)
npx ctx7 query "/react" "useEffect cleanup" --version 18.0.0

# List available libraries (optional)
npx ctx7 library list
```

**CLI result notes**: Output is plain text/Markdown. Parse it as you would any command output.

## 3. Setup & Onboarding

If the user has never set up Context7, run:

```bash
npx ctx7 setup
```

This command:
- Authenticates via OAuth.
- Generates an API key and saves it to the agent’s environment.
- Writes the appropriate MCP server entry (e.g., `.mcp.json`) or the `docs` skill, depending on agent support flags (`--cursor`, `--claude`, `--opencode`).

**Agent‑specific install examples**:
```bash
npx ctx7 setup --cursor       # For Cursor
npx ctx7 setup --claude       # For Claude Code
npx ctx7 setup --opencode     # For OpenCode
```

To remove the integration, use `npx ctx7 remove`.

## 4. Generating Custom Skills

Context7 can create Codex skills for any library through an interactive AI‑powered flow:

```bash
npx ctx7 login                # only needed once
npx ctx7 skills generate
```

Follow the prompts to specify the target library, the agent, and skill preferences. The generated skill file is placed in the appropriate skills directory.

## 5. GitHub Actions Integration

To keep your Context7 documentation always fresh, add a workflow file (e.g., `.github/workflows/context7-refresh.yml`):

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

Replace `master` with your default branch. This triggers a re‑sync of the library documentation on every push.

## 6. Troubleshooting & Common Patterns

- **API key missing**: Check `CONTEXT7_API_KEY` env var. Generate it from [context7.com/dashboard](https://context7.com/dashboard).
- **Library not found**: Use the exact repository path (e.g., `/upstash/context7`). Verify the library is added in your Context7 dashboard.
- **MCP tool not available**: The agent may not have the MCP server configured. Run `npx ctx7 setup` or add the MCP entry manually.
- **Stale docs**: Trigger a manual refresh via the Context7 dashboard or the GitHub Action above.

## 7. Codex Workflow Summary

1. **Detect** user intent for up‑to‑date docs.
2. **If MCP exists** → call MCP tools with library ID and query.
3. **Else if CLI is set up** → run `npx ctx7 query ...`.
4. **Else** → prompt user to run `npx ctx7 setup` and offer to assist afterwards.
5. **When done**, integrate the returned content, citing the Context7 source and version.
