# Firecrawl Skill

## Overview
Firecrawl is a web scraping and crawling API that converts websites into clean markdown, handles dynamic JavaScript content, and supports deep crawling, search, and interactions. This skill enables an AI coding agent to use Firecrawl via its MCP server or direct API.

## Prerequisites & Setup
- Obtain a Firecrawl API key from [firecrawl.dev](https://firecrawl.dev) or via the `firecrawl-build-onboarding` skill.
- Set the environment variable: `FIRECRAWL_API_KEY=fc-your-key`
- (Optional but recommended) Install Node.js for MCP or SDK usage.

## Preferred Runtime: MCP (Model Context Protocol)
The recommended way to use Firecrawl is through its MCP server, which provides tools like `firecrawl_scrape`, `firecrawl_crawl`, `firecrawl_search`, and `firecrawl_map`.

**Setup:**
```bash
npx -y @firesearch/mcp-server-firecrawl
```
Or configure in your Claude Desktop / MCP client with:
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "@firesearch/mcp-server-firecrawl"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-your-key"
      }
    }
  }
}
```

**Usage:** Once connected, you can instruct the agent to use these tools directly. For example:
- "Scrape this URL using Firecrawl MCP."
- "Crawl the site starting from /docs and return markdown."

## API Runtime (Fallback)
If the MCP server is not configured, fall back to direct HTTP API calls or the official SDK.

### Using curl (quick one-off)
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $FIRECRAWL_API_KEY' \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown"]
  }'
```

### Using SDK (better for programmatic use)
**Node.js:**
```bash
npm install @mendable/firecrawl-js
```
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const scrapeResult = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
```

**Python:**
```bash
pip install firecrawl-py
```
```python
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key='fc-your-key')
scrape_result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
```

## Workflow Patterns
- **Scraping a page:** Use `firecrawl_scrape` (MCP) or `/v1/scrape` (API). Specify output formats (`markdown`, `html`, `screenshot`, etc.).
- **Crawling multiple pages:** Use `firecrawl_crawl` (MCP) or `/v1/crawl`. Pass a base URL and optional path regex.
- **Searching the web:** Use `firecrawl_search` (MCP) or `/v1/search` for Google-like search results.
- **Dynamic content:** For JavaScript-heavy sites or interactions, use `firecrawl_interact` (MCP may not have this yet; fallback to API `/v1/interact`) with actions like fill, click, wait.
- **Mapping a site:** Use `firecrawl_map` (MCP) or `/v1/map` to discover URLs.

## Error Handling & Fallbacks
- If API key is missing, prompt the user to set `FIRECRAWL_API_KEY` or run the onboarding.
- If MCP is not available, the agent should automatically fall back to API calls using `curl` or SDK, provided the API key is set.
- For large crawls, use the `waitUntilDone: true` parameter in the API or check status endpoint.

## Resource Links
- Firecrawl Docs: https://docs.firecrawl.dev
- MCP Server: https://github.com/firecrawl/mcp-server-firecrawl
- Skills Repo: https://github.com/firecrawl/skills