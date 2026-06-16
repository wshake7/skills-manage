# Firecrawl Runtime Adapter Skill

## Overview
This skill equips an AI coding agent to use Firecrawl's web scraping, search, and dynamic interaction capabilities. It adapts to the available runtime: preferred [MCP](https://github.com/firecrawl/firecrawl-mcp) or direct [API](https://docs.firecrawl.dev). When those aren't configured, fallback prompts guide the user through setup.

## Setup
All runtimes require `FIRECRAWL_API_KEY` in the environment. Obtain a key at [firecrawl.dev](https://firecrawl.dev).

```bash
export FIRECRAWL_API_KEY="fc-your-key"
```

## Preferred Runtime: MCP (Firecrawl MCP Server)
If the agent detects MCP tools for Firecrawl, use them directly. Typical tool names:
- `firecrawl_scrape` – extract clean markdown/content from a URL.
- `firecrawl_search` – perform a web search with configurable parameters.
- `firecrawl_interact` – interact with dynamic pages (click, fill, wait).
- `firecrawl_map` – discover URLs on a domain.
- `firecrawl_crawl` – crawl multiple pages following links.

**Example MCP tool use** (pseudocode, actual call syntax depends on the agent’s MCP integration):
```json
{
  "tool": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"]
  }
}
```

When MCP tools are available, prefer them over raw HTTP calls.

## Alternative Runtime: Firecrawl API
If MCP is not available but `FIRECRAWL_API_KEY` is set, use the REST API directly. A simple scrape request:

```bash
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"https://example.com","formats":["markdown"]}'
```

**Other endpoints (use the same base and auth):**
- **Search:** `POST /v1/search` with `{"query":"...","limit":5}`
- **Interact:** `POST /v1/interact` with `{"url":"...","actions":[...]}`
- **Crawl:** `POST /v0/crawl` (async, see docs)
- **Map:** `POST /v1/map` with `{"url":"..."}`

All responses return JSON with a `data` field (or `success`, etc.). Extract the needed content.

### Using SDKs (optional)
If the project already includes `@mendable/firecrawl-js` or `firecrawl-py`, you may use the SDK pattern:
```js
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
```

## Fallback: No Runtime Configured
When neither MCP tools nor a valid API key are detected, guide the user:
1. Sign up at https://firecrawl.dev and obtain an API key.
2. Set the `FIRECRAWL_API_KEY` environment variable in their shell/workspace.
3. (Optional) For MCP, install the server: `npx @anthropic-ai/mcp-server-firecrawl` or refer to [firecrawl-mcp](https://github.com/firecrawl/firecrawl-mcp).
4. If they prefer a local skill-based runtime, run:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```
   This installs Firecrawl CLI skills and opens a browser authentication flow.

Without the key, the agent cannot perform web scraping or search. Ask for the key or offer to proceed once it is provided.

## Workflow Summary
- **Check environment**: Is `FIRECRAWL_API_KEY` set?
- **Detect runtime**: Are MCP tools present? If yes → use them.
- **Else**: Use the API directly via curl/SDK.
- **If no key**: Fall back to user setup guidance.

This adaptor ensures seamless Firecrawl usage regardless of the agent’s configuration, while keeping setup instructions clear and actionable.