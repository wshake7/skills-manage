# Context7 Skill

Context7 delivers up‑to‑date, AI‑friendly documentation for thousands of libraries. When available, use it to fetch precise, version‑checked answers.

## Runtime Detection & Fallback

This skill follows a **runtime‑adapter** pattern:

### 1. MCP Server (Preferred)

If the Context7 MCP server is active (check your agent’s MCP configuration), use these tools:
- `resolve_library_id` – converts a library name/URL to its Context7 ID (e.g., `upstash/context7` → `/websites/context7`).
- `get_library_docs` – retrieves documentation for a library ID, optionally scoped to a topic (e.g., “installation”, “API reference”).

**Example:**
```
Tool: resolve_library_id
Arguments: { "libraryName": "upstash/context7" }
→ libraryId: "/websites/context7"

Tool: get_library_docs
Arguments: { "libraryId": "/websites/context7", "topic": "cli" }
→ returns CLI documentation as plain text/markdown
```

### 2. CLI (Fallback)

When MCP is unavailable but the Context7 CLI is installed (`ctx7` or `npx ctx7@latest` command) and the `CONTEXT7_API_KEY` environment variable is set, use the CLI to fetch docs. The exact syntax may vary; run `npx ctx7@latest --help` to discover documentation‑retrieval commands.

**Common pattern:**
```bash
npx ctx7@latest docs /websites/context7 --topic installation
```

If the `docs` subcommand is not present, try:
```bash
npx ctx7@latest query "/websites/context7" "installation"
```

### 3. No Runtime

When neither MCP nor CLI is configured, **do not** attempt ad‑hoc web scraping. Instead:
- Guide the user to run `npx ctx7 setup`. This command auto‑detects your agent (Cursor, Claude, etc.), authenticates, and installs the appropriate MCP/CLI setup.
- If immediate answer is needed, consult the public Context7 web interface (`https://context7.com`) and note that the information might be less current.
- Suggest manual installation: set `CONTEXT7_API_KEY` and install the MCP server or CLI.

## Installation & Setup

**Automatic (recommended):**
```bash
npx ctx7 setup
```
Supports `--cursor`, `--claude`, `--opencode` to target a specific agent.

**Manual CLI setup:**
1. Obtain a Context7 API key from https://context7.com.
2. Set `CONTEXT7_API_KEY` in your environment.
3. Use `npx ctx7@latest` for on‑demand documentation fetches.

## Workflow Guidance

1. **Identify the library** – if a library name or GitHub URL is mentioned, resolve it to a Context7 ID (using MCP or the `ctx7` resolve command if available).
2. **Retrieve the docs** – use MCP or CLI to get the relevant documentation snippet.
3. **Incorporate the answer** – base your response strictly on the returned content, mentioning the Context7 source.

## Example Session

**User:** “How do I install Context7?”
**Agent (MCP available):**
  1. Call `resolve_library_id("context7")` → `/websites/context7`
  2. Call `get_library_docs("/websites/context7", topic="installation")`
  3. Answer using the returned instructions.

**User:** “What’s the latest Context7 API?” (no MCP, CLI installed)
**Agent:**
  ```bash
  npx ctx7@latest docs /websites/context7 --topic api
  ```
  Parse output and reply.

## Important Notes

- Context7 library IDs often follow the pattern `/websites/<domain>` or `/github/<org>/<repo>`.
- If a topic returns too much content, narrow it with a more specific sub‑topic.
- The MCP server is the most reliable path; fall back to CLI only when necessary.
- When `CONTEXT7_API_KEY` is missing, remind the user that the key is free and can be obtained at context7.com.
