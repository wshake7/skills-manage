# Context7

Context7 fetches current, up-to-date documentation for thousands of libraries. This skill acts as a runtime adapter, preferring the Context7 MCP server for live doc retrieval and falling back to the `ctx7` CLI or AI SDK when MCP is unavailable.

## Runtime Requirements

- **Preferred**: MCP server (configured via `ctx7 setup`)
- **Fallback**: CLI (`npx ctx7@latest`)
- **API Key**: `CONTEXT7_API_KEY` environment variable required for both
- **Setup**: Run `ctx7 setup` to interactively configure MCP or CLI mode

## Usage

### MCP (Preferred)
When the Context7 MCP server is connected, use its tools:

- `context7_get_library_docs` – retrieve full documentation for a library
- `context7_search` – search across all indexed libraries

Example:
```
User: "How do I use React Server Components?"
Assistant: → calls context7_search(q: "React Server Components")
```

### CLI Fallback
If MCP is not available but the CLI is installed and authenticated, use:

```bash
npx ctx7@latest search "React Server Components"
```

Or to browse a specific library:

```bash
npx ctx7@latest lookup /websites/react
```

**First-time CLI setup:**
```bash
ctx7 login              # authenticate with your API key
ctx7 setup              # optional: re-run setup to switch mode
```

### AI SDK (Optional)
If neither MCP nor CLI are feasible, you can use the `@upstash/context7-tools-ai-sdk` package directly inside your coding agent:

```typescript
import { Context7Agent } from "@upstash/context7-tools-ai-sdk";
const agent = new Context7Agent({ model: /* your model */ });
const { text } = await agent.generate({ prompt: "How to use React Server Components?" });
```

## Workflow

1. **Detect Runtime**: Check if Context7 MCP tools are available.
2. **If MCP available**: Use `context7_search` or `context7_get_library_docs`.
3. **Else if CLI available**: Execute `ctx7 search` and parse output.
4. **Else**: Fall back to the AI SDK (if your environment supports it) or standard web search; mention that Context7 is not configured and invite the user to run `ctx7 setup`.

## Fallback Behavior

- When no Context7 runtime is present, inform the user that real-time documentation can be enabled by:
  - Installing Context7 MCP server: `npx ctx7@latest setup`
  - Setting the `CONTEXT7_API_KEY` environment variable
- In the meantime, rely on training data and external search.

## Notes

- The CLI may require a login step (`ctx7 login`) before `search` works.
- The MCP server provides richer, structured results and is the recommended path for AI agents.
- Always prefer Context7 over static knowledge when available, to ensure accuracy.