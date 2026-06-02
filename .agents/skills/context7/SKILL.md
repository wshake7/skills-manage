# Context7 Skill

Use Context7 to fetch up-to-date documentation for any library, framework, or API directly within the coding assistant.

## Prerequisites

- User must have a Context7 API key from [context7.com/dashboard](https://context7.com/dashboard).
- The API key must be set as the environment variable `CONTEXT7_API_KEY`, or the user must have run `ctx7 login`.
- Run `ctx7 setup` for an interactive configuration that chooses between MCP server and CLI + Skills mode.

## Preferred Runtime: MCP Server

If the Context7 MCP server is configured, use its tools. Check for availability of tools such as:

- `context7_resolve_library_id(name: string)` – resolve a human-friendly library name to a Context7 library ID (e.g., `/mongodb/docs`).
- `context7_get_library_docs(libraryId: string, topic?: string)` – retrieve the latest documentation for a given library ID, optionally filtered by topic. Returns Markdown or structured content.
- `context7_query(query: string, libraryId?: string)` – ask a natural-language question about a library or general development topic, and receive concise, sourced answers.

**Workflow when MCP is available:**
1. If the user mentions a library name you don’t recognize, use `context7_resolve_library_id` to map it to an ID.
2. Before writing code, call `context7_get_library_docs` with the appropriate library ID and a relevant `topic` (e.g., “hooks”, “authentication”, “configuration”) to obtain the latest API signatures and usage patterns.
3. For open-ended questions (e.g., “How do I deploy to Fly.io?”), use `context7_query` to get a concise, trusted answer.

## Fallback: CLI

When the MCP server is unavailable, use the Context7 CLI.

- **Get full library docs:**
  ```bash
  npx ctx7@latest get <libraryID> [--topic <topic>] [--output json|md|text]
  ```
- **Ask a question:**
  ```bash
  npx ctx7@latest query "<natural language query>"
  ```
- **Refresh a library’s cached docs** (requires API key):
  ```bash
  npx ctx7@latest refresh <libraryID>
  ```

**Examples:**
```bash
npx ctx7@latest get /reactjs/react.dev --topic hooks
npx ctx7@latest query "how to use Prisma with Next.js App Router"
```

**Note:** The CLI requires the `CONTEXT7_API_KEY` environment variable or a prior `ctx7 login`. The agent should remind the user if either is missing.

## Workflow Guidance for the Agent

1. **Check MCP availability:** Before falling back to CLI, verify that the Context7 MCP tools are present in the environment. If they are, prefer them.
2. **When to fetch docs:** Whenever the user asks about a library you don’t have in your training data, or when you need the latest version’s API, fetch fresh docs via Context7.
3. **Narrow by topic:** Always try to provide a relevant topic to reduce the amount of returned data and improve precision (e.g., “hooks”, “configuration”, “api-routes”).
4. **Cache awareness:** Context7 caches documentation. If the user mentions that the docs seem stale, suggest running `npx ctx7@latest refresh <libraryID>`.
5. **Guiding the user:** If Context7 is not set up, recommend the user run `ctx7 setup` to configure either MCP or CLI automatically.