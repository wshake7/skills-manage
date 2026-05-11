# Context7 Skill

Context7 provides live, up‑to‑date library documentation by querying official sources. Use it to answer API questions with the latest versions, avoiding stale training data.

## Runtime Configuration

**Preferred:** Context7 MCP server (provides `get_docs` tool).
**Fallback:** Context7 CLI (`npx ctx7@latest`).

Both require a `CONTEXT7_API_KEY` environment variable or prior authentication.

---

## Setup

Run the interactive setup (handles authentication, API key, and agent integration):

```bash
npx ctx7 setup
```

Or manually set your API key:

```bash
export CONTEXT7_API_KEY=<your-key>
```

---

## Using Context7

### Via MCP Server (Preferred)

When the Context7 MCP server is configured, use its `get_docs` tool:

```text
// Example: retrieve documentation for a specific library and query
await mcp.tools.get_docs({ library: "react", query: "useEffect cleanup" })
```

Check if the MCP server is active by verifying the agent’s MCP configuration or attempting a tool call.

### Via CLI (Fallback)

If MCP is unavailable, use the CLI:

```bash
npx ctx7@latest docs "react useEffect cleanup"
```

The CLI automatically respects the `CONTEXT7_API_KEY` environment variable. If missing, the command will prompt you to authenticate.

---

## Fallback When Runtime Is Not Configured

If neither MCP nor CLI is available, inform the user:

```text
Context7 is not configured. I can provide documentation from my training data, but it may be outdated.
To get live docs, please run `npx ctx7 setup` or set your CONTEXT7_API_KEY.
```

Do **not** attempt to work around the missing runtime; always guide the user to set up Context7.

---

## Workflow Guidance

1. **Detect** – Determine if Context7 MCP server or CLI is available.
2. **Query** – When the user asks a documentation question (e.g., “How do I use X in Y?”), formulate a precise query.
3. **Fetch** – Use MCP if available; otherwise fall back to the CLI.
4. **Present** – Combine Context7 results with your own knowledge if needed, clearly referencing the live docs as the source.
5. **Fallback** – If the runtime is missing, guide the user to setup and temporarily offer training‑data answers with a disclaimer.

---

## Additional Commands

- **Install skills from external repos:** `npx ctx7 skills install /owner/repo`
- **Generate custom skills:** `ctx7 login && ctx7 skills generate`
- **Trigger refresh via GitHub Actions:** Add a workflow calling `https://context7.com/api/v1/refresh` (see [Context7 GitHub Actions](https://context7.com/docs/integrations/github-actions)).