# Firecrawl Runtime Adapter

## Overview
Firecrawl provides web scraping, crawling, search, and browser interaction. This skill prioritizes MCP or direct API usage, with fallback guidance when not configured.

## Preferred: MCP Server
If the `firecrawl` MCP server is available, use its tools:
- `scrape`, `search`, `map`, `crawl`, `extract`, `screenshot`

Example:
```
mcp__firecrawl__scrape({ url: "https://example.com" })
```

## Fallback: Direct API via SDK
When MCP is not available, use the Firecrawl API with an API key.

### Prerequisites
- `FIRECRAWL_API_KEY` environment variable (can be set in `.env`)
- Install SDK:
  - Node: `npm install @mendable/firecrawl-js`
  - Python: `pip install firecrawl-py`

### Usage
Instantiate client and call methods:

**JavaScript/TypeScript**
```javascript
import FireCrawl from '@mendable/firecrawl-js';
const app = new FireCrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com');
```

**Python**
```python
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.environ['FIRECRAWL_API_KEY'])
result = app.scrape_url('https://example.com')
```

### Key Methods
- `scrapeUrl` / `scrape_url` – single page scraping
- `crawlUrl` / `crawl_url` – multi-page crawling
- `search` / `search` – web search with discovery
- `map` / `map` – URL discovery
- `extract` / `extract` – structured data extraction with schema

## Onboarding / Setup (If Key Missing)
If no API key is available:
1. Run the CLI installer and authenticate via browser:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```
2. Or obtain a key from [firecrawl.dev](https://firecrawl.dev) and set `FIRECRAWL_API_KEY`.
3. If the `firecrawl-build-onboarding` skill is installed, invoke it for guided browser authentication.

## Environment Detection
- Check for `FIRECRAWL_API_KEY` before using API.
- If MCP server is not present and API key missing, prompt the user with the onboarding steps above before retrying.

## Best Practices
- For large crawls, use `crawlUrl` with `limit` and `includes` to scope.
- For structured data, always define a `jsonSchema` for `extract`.
- Cache results when possible to avoid redundant requests.
