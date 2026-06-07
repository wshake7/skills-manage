# Context7 Skill

Fetch up-to-date documentation for any library using Context7. Use this to resolve library IDs and retrieve precise, current docs that are not in the agent's training data.

## Runtime Requirements

- **Preferred**: Context7 MCP server (`mcp__context7` tools)
- **Fallback**: `ctx7` CLI (`npx ctx7@latest`)
- **Environment Variable**: `CONTEXT7_API_KEY` (required for CLI operations)
- **Setup Command**: Run `npx ctx7 setup` to configure the runtime interactively. It will prompt to choose MCP or CLI mode and generate an API key if needed.

## Setup

The user must configure Context7 once before first use:

```bash
npx ctx7 setup
```

For specific agent environments the setup can be targeted:

- **Claude Code**: `npx ctx7 setup --claude`
- **Cursor**: `npx ctx7 setup --cursor`
- **OpenCode**: `npx ctx7 setup --opencode`

Use `--api-key YOUR_KEY` for headless or CI setups.

## Usage

### Via MCP (Preferred)

When the Context7 MCP server is running, use the provided tools:

1. **Resolve a library ID** – if you only have a name or GitHub URL:
   ```
   mcp__context7__resolve-library-id <name-or-url>
   ```
2. **Get the latest documentation**:
   ```
   mcp__context7__get-library-docs <library-id>
   ```
   Example: `mcp__context7__get-library-docs /mongodb/docs`

These tools require no API key or additional setup once the MCP server is connected.

### Via CLI (Fallback)

If the MCP server is not available but the CLI is installed and `CONTEXT7_API_KEY` is set, use:

```bash
npx ctx7@latest get <library-id>
```

- Omit `@latest` if a specific version is pinned.  
- To explore commands: `npx ctx7 --help`  
- The output includes the most recent documentation for the given library ID.

**Example**:
```bash
export CONTEXT7_API_KEY=…
npx ctx7 get /websites/context7
```

## Fallback When Not Configured

If neither the MCP server nor the CLI is set up (no `ctx7` command, no `CONTEXT7_API_KEY`), the agent **cannot** fetch fresh documentation. In that case:

- Tell the user that setting up Context7 would give more accurate, real-time library docs.
- Provide the setup command: `npx ctx7 setup`
- As a last resort, fall back to the agent’s built-in knowledge or ask the user to paste relevant documentation.

## Example Workflow

1. User asks: "How do I use the latest @upstash/redis API?"
2. Agent resolves the library ID: `/upstash/redis` (or uses `mcp__context7__resolve-library-id` if uncertain).
3. Agent fetches current docs with MCP or CLI.
4. Agent integrates the returned API details into the answer.

---

**Maintenance**: To keep docs refreshed automatically in CI, add a GitHub Actions workflow as described in Context7 documentation.
