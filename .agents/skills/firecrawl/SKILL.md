# Firecrawl Skill

Firecrawl is a web scraping and data extraction platform. Use this skill to integrate Firecrawl APIs into projects for crawling, searching, interacting with dynamic pages, and extracting structured data. Prefer MCP-based tooling when available; fall back to direct API/SDK calls otherwise.

## Setup

1. **API Key**: Sign up at [firecrawl.dev](https://firecrawl.dev) and set the environment variable:
   ```bash
   export FIRECRAWL_API_KEY=fc-xxxxxxx
   ```
   For self-hosted instances, also set `FIRECRAWL_API_URL` to your instance URL.

2. **Choose your integration method**:
   - **MCP (preferred)**: Install the Firecrawl MCP server.
   - **Direct API**: Install the SDK (`@mendable/firecrawl-js` for Node.js or `firecrawl-py` for Python).

## MCP Server Integration (Preferred)

1. **Install the MCP server** (e.g., via npx):
   ```bash
   npx @anthropic/firecrawl-mcp
   ```
   Configure it in your MCP client with the `FIRECRAWL_API_KEY` env. The server exposes tools:
   - `firecrawl_scrape`
   - `firecrawl_crawl`
   - `firecrawl_search`
   - `firecrawl_map`
   - `firecrawl_interact`

2. **Workflow examples**:
   - **Scrape a page for markdown**:
     ```
     tool: firecrawl_scrape
     params: { "url": "https://example.com", "formats": ["markdown"] }
     ```
   - **Crawl a site with limits**:
     ```
     tool: firecrawl_crawl
     params: { "url": "https://docs.example.com", "maxPages": 20, "crawlerOptions": { "limit": 20 } }
     ```
   - **Search for documentation**:
     ```
     tool: firecrawl_search
     params: { "query": "Firecrawl API authentication", "limit": 5 }
     ```
   - **Interact with a page (fill forms, click)**:
     ```
     tool: firecrawl_interact
     params: {
       "url": "https://example.com/search",
       "actions": [
         { "type": "fill", "selector": "#search", "value": "query" },
         { "type": "click", "selector": "#submit" }
       ]
     }
     ```

   All tools return structured data. For extraction, specify `formats: ["markdown", "html"]` or use custom `extract` with a schema.

## Direct API Integration (Fallback)

If MCP is not available, use the Firecrawl SDK or REST API directly.

### Node.js

```bash
npm install @mendable/firecrawl-js
```

```javascript
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape
const scrape = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
// Crawl
const crawl = await app.crawlUrl('https://example.com', { limit: 10 });
// Search
const search = await app.search('firecrawl docs', { limit: 5 });
// Map (sitemap discovery)
const map = await app.mapUrl('https://example.com');
// Interact
const interact = await app.interactUrl('https://example.com', {
  actions: [{ type: 'click', selector: '#load-more' }]
});
```

### Python

```bash
pip install firecrawl-py
```

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))

# Scrape
scrape = app.scrape_url("https://example.com", params={"formats": ["markdown"]})
# Crawl
crawl = app.crawl_url("https://example.com", params={"limit": 10})
# Search
search = app.search("firecrawl", params={"limit": 5})
# Map
map_result = app.map_url("https://example.com")
```

### REST API (curl)

Endpoints:

- **Scrape**: `POST https://api.firecrawl.dev/v1/scrape`
- **Crawl**: `POST https://api.firecrawl.dev/v1/crawl`
- **Search**: `POST https://api.firecrawl.dev/v1/search`
- **Map**: `POST https://api.firecrawl.dev/v1/map`
- **Interact**: `POST https://api.firecrawl.dev/v1/interact`

All require `Authorization: Bearer $FIRECRAWL_API_KEY` header and JSON body. Example:

```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown"]
  }'
```

## Common Use Cases and API Selection

- **Extract content from a known URL**: Use `scrape` with `formats: ["markdown"]`.
- **Crawl an entire documentation site**: Use `crawl` with `limit` and optional `crawlerOptions.excludePaths`.
- **Search web for documentation or information**: Use `search`.
- **Discover URLs on a website**: Use `map` (returns all discovered links).
- **Handle dynamic pages (SPAs, forms)**: Use `interact` with actions like `fill`, `click`, `wait`.
- **Extract structured data**: Pass `extract` with a JSON schema or use natural language extraction (e.g., `extract: { prompt: "extract title and authors" }`).

## Troubleshooting

- **No API key**: Provide a key from [firecrawl.dev](https://firecrawl.dev); self-hosted users must match the instance's configured key.
- **Rate limits**: Cloud API has rate limits; check response headers or use sleep/retry logic.
- **Dynamic content not loading**: Ensure you use `interact` with proper `wait` actions (e.g., `milliseconds: 2000`) for JavaScript rendering.
- **MCP server not found**: Fall back to direct SDK/API; the MCP server name may vary (e.g., `@anthropic/firecrawl-mcp`). Install globally or run via npx.

Always prefer the most specific endpoint for your task to minimize bandwidth and quota usage.