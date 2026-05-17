---
name: context7
description: Retrieve up-to-date documentation and code examples from Context7 for any library or framework.
runtime: mcp
---

# context7

Use Context7 to fetch current, context-aware documentation directly in your coding environment.

## When Context7 MCP is configured (primary)

If the Context7 MCP server is running, use these tools:

- `resolve-library-id(libraryName)` — resolves a library name to a Context7 library ID.
- `get-library-docs(libraryId, context)` — retrieves documentation for that library.

**Example workflow:**
1. User asks: "How do I use the `useQuery` hook from @tanstack/react-query?"
2. Agent: `resolve-library-id('@tanstack/react-query')` → returns `/tanstack/react-query`
3. Agent: `get-library-docs('/tanstack/react-query', 'useQuery')` → returns relevant docs and code snippets.
4. Provide answer based on returned docs.

## When Context7 is NOT configured (fallback)

If the MCP server is not running, fall back to the Context7 CLI. Environment variable `CONTEXT7_API_KEY` is required (obtain from context7.com or via `npx ctx7 setup`).

- Check for API key: `echo $CONTEXT7_API_KEY`
- Set key if missing: `export CONTEXT7_API_KEY="your_key"` (or instruct user to run `npx ctx7 setup` to generate one)

**Query using CLI:**
```bash
npx ctx7@latest ask "Your query here"
```

**Example:**
```bash
npx ctx7@latest ask "How to use useQuery from @tanstack/react-query"
```

The CLI will return relevant docs and code snippets. Use the output to answer the user.

## Setup (if needed)

If the user hasn't installed Context7, guide them to run:

```bash
npx ctx7 setup
```

This will handle authentication, API key creation, and skill installation. Use `--api-key YOUR_KEY` for headless environments.

## Additional commands

- `npx ctx7 login` — re-authenticate
- `npx ctx7 skills generate` — generate custom skills interactively
- `npx ctx7 remove` — clean up Context7 setup

## Notes

- Always prefer MCP when available for lower latency and better integration.
- If API key is missing, prompt the user to set it up via `npx ctx7 setup`.
- When using CLI, note that `npx ctx7@latest` ensures you use the latest version; you can also install globally with `npm install -g ctx7`.