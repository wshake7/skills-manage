# Firecrawl

Firecrawl is a web scraping, crawling, and browser automation API that returns clean markdown or structured data from any website. Use it to extract content, perform searches, interact with dynamic pages, and build AI data pipelines.

## Available Runtimes

This skill can operate through multiple runtimes. The agent should check which runtime is available and use the most suitable one:

1. **Firecrawl MCP Server (preferred)** – If the MCP server is configured, you have direct tool calls: `firecrawl_scrape`, `firecrawl_search`, `firecrawl_crawl`, `firecrawl_map`, `firecrawl_interact`, etc. Use these with minimal overhead.
2. **Firecrawl API (fallback)** – If `FIRECRAWL_API_KEY` is set, use the HTTP API directly or via the official SDKs.
3. **CLI / Skills (setup aid)** – If neither MCP nor API key is ready, guide the user to run `npx -y firecrawl-cli@latest init --all --browser` to install the CLI and browser auth. This will also configure skills.

## Setup

### Check Runtime Availability

Before using any Firecrawl operation, detect the runtime:

- **MCP**: Check if tools like `firecrawl_scrape` are in your tool list.
- **API Key**: Check environment variable `FIRECRAWL_API_KEY`.
- **Local CLI**: Only used for initial setup, not for runtime operations.

If no runtime is available, prompt the user to either:
- Set up MCP by configuring the Firecrawl MCP server (e.g., using `firecrawl-mcp` npm package)
- Or set the `FIRECRAWL_API_KEY` environment variable (get one at https://firecrawl.dev)
- Or run `npx -y firecrawl-cli@latest init --all --browser` to bootstrap the CLI and skills.

### Installing SDKs (for API fallback)

If using the API directly, install the appropriate SDK:

```bash
npm install @mendable/firecrawl-js
# or
pip install firecrawl-py
```

Set your API key in `.env`:

```
FIRECRAWL_API_KEY=fc-...
```

## Workflows

### Scrape a Single URL

Extract clean markdown/HTML from a page.

**MCP (if available)**:
```
Call firecrawl_scrape with url: "https://example.com"
Formats: ["markdown", "html"]
```

**API with curl**:
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"https://example.com","formats":["markdown"]}'
```

**Node.js**:
```javascript
const { FirecrawlApp } = require('@mendable/firecrawl-js');
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(result.markdown);
```

**Python**:
```python
from firecrawl import FirecrawlApp
import os
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
result = app.scrape_url("https://example.com", params={"formats": ["markdown"]})
print(result["markdown"])
```

### Search and Research

Discover URLs via search, then scrape selected results.

**MCP**:
1. `firecrawl_search` with query and limit.
2. For each result URL, call `firecrawl_scrape`.

**API (Python example)**:
```python
search_results = app.search("latest AI agent frameworks", params={"limit": 3})
for item in search_results.get("data", []):
    scraped = app.scrape_url(item["url"], params={"formats": ["markdown"]})
    # process scraped content
```

### Browser Interaction (Dynamic Content)

For pages requiring clicks, form fills, or waiting.

**MCP**: Use `firecrawl_interact` tool with actions array.

**API**:
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com/login",
    "actions": [
      {"type": "fill", "selector": "#email", "value": "user@example.com"},
      {"type": "fill", "selector": "#password", "value": "secret"},
      {"type": "click", "selector": "#submit"},
      {"type": "wait", "milliseconds": 3000}
    ],
    "formats": ["markdown"]
  }'
```

### Crawl a Website

Crawl multiple pages from a starting URL, respecting depth limits and path options.

**MCP**: `firecrawl_crawl` with params like `limit`, `maxDepth`, `scrapeOptions`.

**API**:
```javascript
const crawlResult = await app.crawlUrl('https://docs.example.com', {
  limit: 50,
  maxDepth: 2,
  scrapeOptions: { formats: ['markdown'] }
});
console.log(crawlResult);
```

## Credential Management

- Never hardcode API keys in code. Always read from `process.env.FIRECRAWL_API_KEY` or a secure secret store.
- If using MCP, the server handles authentication; the agent does not need to manage the key directly.
- When the API key is missing, instruct the user to set it or configure MCP.

## Fallback Behavior

1. If the MCP server is unreachable, fall back to `FIRECRAWL_API_KEY` using direct HTTP or SDK calls.
2. If no API key is available, the operation cannot be completed. Guide the user to:
   - Run `npx -y firecrawl-cli@latest init --all --browser` to install the CLI and skills, which will also prompt for API key or browser auth.
   - Alternatively, obtain an API key from https://firecrawl.dev and set it in the environment.
3. After setup, retry the operation with the newly available runtime.

## Learn More

- Official documentation: https://docs.firecrawl.dev
- GitHub: https://github.com/firecrawl/firecrawl
- Skills repository: https://github.com/firecrawl/skills
