# Firecrawl Skill

## Description
This runtime-adapter skill helps you integrate Firecrawl’s web scraping, search, and crawling APIs into your application.

## When to Use
- Building a feature that extracts data from websites
- Searching the web programmatically
- Crawling and converting websites to LLM‑ready formats

## Runtime Adapter
This skill checks for a running Firecrawl runtime (MCP server or API key) and uses the best available option. When nothing is configured, it guides you through setup.

### Preferred Runtime: MCP Server
If a Firecrawl MCP server is active, use its tools directly.

Example (conceptual):
```
mcp_call_tool('firecrawl', 'scrape', { url: 'https://example.com' })
```

### Preferred Runtime: API via SDK
When `FIRECRAWL_API_KEY` is set, use the official Firecrawl SDK.

**Node.js**
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com');
```

**Python**
```python
from firecrawl import FirecrawlApp
import os

app = FirecrawlApp(api_key=os.environ['FIRECRAWL_API_KEY'])
result = app.scrape_url('https://example.com')
```

### Fallback: Setup Instructions
If no runtime is available:
1. Ask the user to provide their `FIRECRAWL_API_KEY` (set it in `.env` or the environment).
2. Install the SDK:
   - Node.js: `npm install @mendable/firecrawl-js`
   - Python: `pip install firecrawl-py`
3. Alternatively, configure the Firecrawl MCP server by following the [official docs](https://docs.firecrawl.dev).

## Common Workflows

### Scraping a Single URL
```javascript
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(result.markdown);
```

### Searching the Web
```javascript
const searchResult = await app.search('latest AI news', { limit: 5 });
console.log(searchResult);
```

### Crawling a Website
```javascript
const crawlStatus = await app.crawlUrl('https://docs.firecrawl.dev', { limit: 100 });
console.log(crawlStatus);
```

## Environment Variables
- `FIRECRAWL_API_KEY` (required for SDK usage)

## Notes
- This skill is designed for **building integrations** that call Firecrawl APIs. For one‑off research, prefer Firecrawl CLI skills.
- Always try the configured runtime first; fallback to guided setup only when necessary.