# Firecrawl Skill

Firecrawl handles web scraping, crawling, searching, and dynamic interactions. Use it to extract clean markdown or structured data from any website.

## Preferred Runtime: Firecrawl MCP Server

If the Firecrawl MCP server is installed and configured (check with `which firecrawl-mcp` or by seeing if MCP tools are available), use the provided MCP tools. The tools include:

- `firecrawl_scrape`: scrape a single URL, supports markdown, HTML, screenshots, etc.
- `firecrawl_crawl`: start a crawl job, get results.
- `firecrawl_search`: web search with optional scraping of results.
- `firecrawl_map`: discover URLs from a domain.
- `firecrawl_batch_scrape`: scrape multiple URLs.

### Setup MCP Server

1. Ensure Node.js >=18 is installed.
2. Install the MCP server globally or run via npx:

```bash
npm install -g firecrawl-mcp
```

Or use `npx firecrawl-mcp` directly.

3. Set the API key environment variable:

```bash
export FIRECRAWL_API_KEY="fc-your-api-key"
```

4. Configure the MCP server in your agent’s MCP settings (e.g., Claude Desktop config). Example:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-your-api-key"
      }
    }
  }
}
```

5. Restart the agent to load the tools.

Once configured, you can call tools directly.

### Using MCP Tools

- **Scrape a page**: `firecrawl_scrape` with `url`, `formats` (e.g., `["markdown"]`), `onlyMainContent` (optional).
- **Crawl a site**: `firecrawl_crawl` with `url`, `maxPages`, `scrapeOptions`.
- **Search the web**: `firecrawl_search` with `query`, `limit`, and optionally `scrapeOptions` to fetch content.

Examples:

```
Scrape https://example.com for markdown:
firecrawl_scrape(url="https://example.com", formats=["markdown"])

Search for "latest AI news" and scrape first 3 results:
firecrawl_search(query="latest AI news", limit=3, scrapeOptions={formats: ["markdown"]})
```

## Fallback: Use the Firecrawl API directly

If the MCP server is not available but the `FIRECRAWL_API_KEY` environment variable is set, use the REST API.

### Authentication

All requests need the `Authorization: Bearer $FIRECRAWL_API_KEY` header. If the environment variable is missing, ask the user to set it.

### Common Endpoints

- **Scrape**: `POST https://api.firecrawl.dev/v1/scrape`
  Body: `{"url": "...", "formats": ["markdown"]}`
- **Crawl**: `POST https://api.firecrawl.dev/v1/crawl`
  Body: `{"url": "...", "maxPages": 10, "scrapeOptions": {"formats": ["markdown"]}}`
  Returns a job ID; then poll `GET https://api.firecrawl.dev/v1/crawl/{jobId}` for status.
- **Search**: `POST https://api.firecrawl.dev/v1/search`
  Body: `{"query": "...", "limit": 5, "scrapeOptions": {"formats": ["markdown"]}}`
- **Map**: `POST https://api.firecrawl.dev/v1/map`
  Body: `{"url": "..."}`
- **Interact** (advanced): `POST https://api.firecrawl.dev/v1/interact`
  Used for pages requiring clicks/waits.

Use `curl` or an SDK (Node: `@mendable/firecrawl-js`, Python: `firecrawl-py`). Example:

```bash
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"https://example.com","formats":["markdown"]}'
```

Response JSON includes `data.markdown`, `data.html`, etc.

When using the SDK (Node):

```javascript
const FirecrawlApp = require('@mendable/firecrawl-js');
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(result.markdown);
```

## No Runtime Configured

If you cannot find the MCP server and the `FIRECRAWL_API_KEY` is not set:

1. Guide the user to sign up at [firecrawl.dev](https://firecrawl.dev) and obtain an API key.
2. Have them set the environment variable: `export FIRECRAWL_API_KEY="fc-..."` (or add to `.env` file).
3. Optionally, to get the best experience, install the Firecrawl MCP server as described above.
4. Once the API key is available, proceed with the API fallback.

## Error Handling

- **401 Unauthorized**: API key missing or invalid. Check the variable.
- **402 Payment Required**: Upgrade plan. Guide user to billing.
- **429 Rate Limit**: Backoff and retry with exponential delay.
- **Job polling**: For crawl jobs, poll every 5–10 seconds until status is `completed`; catch `timeout`/`failed` statuses.