# Firecrawl Skill

Use Firecrawl for web scraping, searching, crawling, and browser interaction. This skill provides patterns for both MCP-based tools (preferred) and direct API/SDK calls.

## Setup

1. **Install SDKs (optional)** – only needed for the fallback SDK path.
   ```bash
   npm install @mendable/firecrawl-js   # Node.js
   pip install firecrawl-py            # Python
   ```

2. **Set API key** – required for all paths. Add to your `.env` or environment:
   ```
   FIRECRAWL_API_KEY=fc-your-key
   ```
   The agent must never hardcode the key; always read from the environment.

3. **MCP server (preferred)** – if a Firecrawl MCP server is configured (e.g., in `~/.cursor/config/mcp.json` or Claude desktop config), tools like `firecrawl_scrape`, `firecrawl_search`, `firecrawl_crawl`, `firecrawl_map` become available. Use those tools directly. See the [MCP section](#mcp-patterns) below.

## Runtime Selection

- **Check for MCP availability** – if the agent’s tool list includes Firecrawl MCP tools, use them preferentially.
- **Fallback to SDK** – when MCP is missing, use `FirecrawlApp` (Python/Node) or the REST API directly with the `FIRECRAWL_API_KEY`.

## MCP Patterns (Preferred)

When MCP tools are available, the agent invokes them with natural parameters.

- **Scrape a single URL**
  ```
  tool: firecrawl_scrape
  arguments: {"url": "https://example.com", "formats": ["markdown"]}
  ```
- **Search for pages**
  ```
  tool: firecrawl_search
  arguments: {"query": "latest AI agents", "limit": 5}
  ```
- **Crawl a site**
  ```
  tool: firecrawl_crawl
  arguments: {"url": "https://docs.example.com", "maxPages": 10}
  ```

Tool names may vary slightly per server implementation; check the MCP server’s documentation.

## SDK Fallback Patterns

When MCP is not configured, use the SDK or REST API.

### Node.js (TypeScript) Examples

```typescript
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape
const scraped = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(scraped.markdown);

// Search then scrape
const results = await app.search('your query', { limit: 3 });
for (const item of results.data) {
  const page = await app.scrapeUrl(item.url, { formats: ['markdown'] });
  console.log(page.markdown);
}
```

### Python Examples

```python
from firecrawl import FirecrawlApp
import os

app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))

# Scrape
scraped = app.scrape_url('https://example.com', params={'formats': ['markdown']})
print(scraped['markdown'])

# Search + scrape
results = app.search("latest AI agents", params={'limit': 3})
for item in results['data']:
    detail = app.scrape_url(item['url'], params={'formats': ['markdown']})
    print(item['url'], len(detail.get('markdown', '')))

# Interactive session (fill forms, click, wait)
interaction = app.interact(
    'https://example.com/search',
    actions=[
        {'type': 'fill', 'selector': '#search-input', 'value': 'firecrawl'},
        {'type': 'click', 'selector': '#search-button'},
        {'type': 'wait', 'milliseconds': 2000}
    ],
    formats=['markdown']
)
```

### Direct REST API (curl) Fallback

When no SDK is available, use the REST endpoint as a last resort:

```bash
# Scrape
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'

# Interact
curl -s -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"https://example.com","actions":[...]}'
```

## Tips for AI Agents

- Always check for `FIRECRAWL_API_KEY` before any request; if missing, ask the user to provide it.
- Respect `robots.txt` and rate limits (Firecrawl handles many automatically).
- For large crawls, use `crawl_url` with `maxPages` and handle pagination through the SDK.
- Prefer `markdown` format for LLM-friendly output.
