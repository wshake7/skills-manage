# Context7 Skill

## Overview
Context7 provides real‑time, up‑to‑date library documentation. This skill guides you on using the Context7 runtime—preferring MCP, then CLI—to answer questions with the latest docs. If no runtime is configured, fall back to built‑in knowledge with a staleness warning and guide the user to set up Context7.

## Setup (for users)
- Interactive installer: `npx ctx7 setup` (choose MCP or CLI + Skills mode).
- Headless / CI: `npx ctx7 setup --api-key YOUR_API_KEY`.
- Add to Codex MCP: `codex mcp add context7 -- npx -y @upstash/context7-mcp --api-key YOUR_API_KEY`.

## Runtime Detection & Behavior
When a user asks about a library, framework, or tool, check which Context7 runtime is available:

1. **Context7 MCP server is available**  
   → Use MCP tools (e.g., `search_documentation`, `get_documentation`) with the library’s Context7 ID. Include the fetched documentation in your answer and cite the source.

2. **Context7 CLI is available** (environment has `CONTEXT7_API_KEY` and `npx ctx7` works)  
   → Run CLI commands to retrieve documentation. Use `npx ctx7 --help` to discover subcommands. Typical usage: searching by library ID or keyword. Provide answers based on CLI output.

3. **Neither MCP nor CLI is configured**  
   → Tell the user that Context7 isn’t set up. Offer to assist with `npx ctx7 setup` or the Codex MCP integration. In the meantime, answer from your internal knowledge but explicitly state that the information may be outdated and recommend Context7 for accuracy.

## Concrete Workflow
1. Identify the library → map it to a Context7 library ID (e.g., `/react/router`). If unknown, use the MCP or CLI search to find it.
2. Retrieve the latest documentation:
   - MCP: call the relevant tool with the library ID.
   - CLI: `npx ctx7 <command> --library <id>` (check `--help` for exact syntax).
3. Synthesize an answer based on the returned docs.
4. If retrieval fails or the library isn’t found, suggest the user verify the library ID or index it via Context7.

## References
- Context7 own docs: library ID `/websites/context7`
- GitHub Actions integration (optional CI): see snippets in the Context7 docs.
- Custom skill generation: `ctx7 login && ctx7 skills generate` (interactive AI‑powered flow).
