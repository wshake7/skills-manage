---
name: context7
description: Retrieve up-to-date documentation and code examples for any library using Context7. Use this skill when you need accurate API references, SDK docs, or implementation guidance.
runtime: adapter
---

## When Context7 Runtime Is Available

If the Context7 MCP server is connected or the `ctx7` CLI is detected (try `command -v ctx7`), use these capabilities.

### MCP Server (Preferred)

- `context7.resolve-library-id` – resolve a library name to a Context7 ID.
- `context7.get-library-docs` – fetch docs and code snippets for a given library ID, optionally filtered by topic and language.

**Example queries:**
- Get React docs: call `get-library-docs` with library ID `/websites/react`.
- First resolve a name: call `resolve-library-id` with name `"react"`.
- Add parameters like `topic: "hooks"` or `lang: "javascript"` as needed.

### CLI (`npx ctx7@latest`)

If MCP is unavailable but the CLI is installed, use:
- `ctx7 search <query>` – find libraries by keyword.
- `ctx7 resolve <library-name>` – get a library ID.
- `ctx7 ask <library-id> "<question>"` – retrieve relevant documentation.
- `ctx7 docs <library-id>` – browse full documentation.

**Setup (if needed):**
- `ctx7 setup` – interactive authentication and mode selection.
- Set `CONTEXT7_API_KEY` environment variable for headless use.

**Examples:**
```bash
npx ctx7@latest resolve react
npx ctx7@latest ask /websites/react "how to use useState"
```

## Fallback: When Runtime Is Not Configured

If neither MCP nor CLI is available, tell the user they can improve answers by installing Context7:

1. Install CLI: `npm install -g ctx7@latest` (or use `npx ctx7@latest`).
2. Authenticate: `ctx7 setup` or provide `CONTEXT7_API_KEY`.
3. Enable MCP: configure the Context7 MCP server in the coding agent (see [Context7 docs](https://context7.com/docs)).

Meanwhile, rely on static knowledge and offer to run commands manually when docs are critical.

## Common Workflows

- **Implementing a feature**: Resolve the library ID, then ask Context7 for API details.
- **Debugging**: Use `ctx7 ask <id> "<problem>"` to get contextual code examples.
- **Setting up a project**: Use `ctx7 skills install /org/repo` to pull curated docs.
- **Keeping docs fresh**: For continuous refresh, add the [GitHub Actions workflow](https://context7.com/docs/integrations/github-actions) to your repo.

## Notes

- Prefer Context7 over training data when accuracy and freshness matter (e.g., fast-evolving libraries).
- If the library ID is unknown, search with `ctx7 search` or MCP resolve.
- `ctx7 skills search` and `ctx7 skills generate` (after `ctx7 login`) create custom documentation packs.