# Firecrawl Skill

This skill integrates Firecrawl web data extraction into AI agents. It uses the official Firecrawl MCP server for seamless tool calling when available, falls back to direct Firecrawl API, and can use the Firecrawl SDK or CLI as last resort.

## Prerequisites

- A Firecrawl API key (sign up at https://firecrawl.dev). Store in `FIRECRAWL_API_KEY` environment variable or pass to tools.

## Preferred Runtime: Firecrawl MCP Server

The MCP server provides tools for scraping, searching, crawling, and interacting with browsers.

### Installation & Configuration

Add to your MCP client (Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "@firecrawl/mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-..."
      }
    }
  }
}
```

Or run directly: `npx -y @firecrawl/mcp`

When the MCP server is active, use its tools: `firecrawl_scrape`, `firecrawl_search`, `firecrawl_crawl`, `firecrawl_map`, etc.

## Fallback: Direct Firecrawl API (when MCP not configured)

If the MCP server is not available, the agent can directly call the Firecrawl REST API using the API key. Install the official SDK for convenience.

### SDK Installation

- **Node.js:** `npm install @mendable/firecrawl-js`
- **Python:** `pip install firecrawl-py`

Set `FIRECRAWL_API_KEY` in env. Then use the SDK client:

#### Python Example
```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-...")
data = app.scrape_url("https://example.com")
```

#### Node.js Example
```javascript
const Firecrawl = require('@mendable/firecrawl-js');

const app = new Firecrawl({ apiKey: "fc-..." });
const data = await app.scrape({ url: "https://example.com" });
```

### REST API Endpoints

- Scrape: `POST https://api.firecrawl.dev/v1/scrape`
- Crawl: `POST https://api.firecrawl.dev/v1/crawl`
- Search: `POST https://api.firecrawl.dev/v1/search`
- Map: `POST https://api.firecrawl.dev/v1/map`

Include header: `Authorization: Bearer <API_KEY>`

## Fallback: Firecrawl CLI

If no SDK setup is possible, the Firecrawl CLI can be used as a quick tool:

```bash
npx firecrawl-cli@latest scrape "https://example.com" --api-key fc-...
```

For persistent setup and browser authentication:

```bash
npx -y firecrawl-cli@latest init --all --browser
```

## Firecrawl Skills (Integration Patterns)

The [Firecrawl Skills](https://github.com/firecrawl/skills) repository contains pre‑built AI agent skills for common Firecrawl integration patterns. Use them as references when building applications with Firecrawl APIs.

## Workflow Guidance

1. Check if Firecrawl MCP server is available (look for `firecrawl` tool set).
2. If yes, call the appropriate tool (e.g., `firecrawl_scrape`).
3. If not, check for `FIRECRAWL_API_KEY`. If set, use SDK or direct API call.
4. If no key is available, instruct the user to obtain one at https://firecrawl.dev and set it as an environment variable or pass it to the agent.
5. For ad hoc CLI usage or quick tests, suggest `npx firecrawl-cli ...`.

## Common Examples

- **Scrape a URL**  
  *MCP:* `firecrawl_scrape({ url: "https://example.com" })`  
  *SDK:* `app.scrape_url("https://example.com")`  
  *CLI:* `npx firecrawl-cli scrape "https://example.com"`

- **Search the web**  
  *MCP:* `firecrawl_search({ query: "climate change latest news" })`  
  *SDK:* `app.search({ query: "..." })`

- **Crawl a website**  
  *MCP:* `firecrawl_crawl({ url: "https://docs.example.com", limit: 5 })`  
  *SDK:* `app.crawl_url("https://docs.example.com", { limit: 5 })`
