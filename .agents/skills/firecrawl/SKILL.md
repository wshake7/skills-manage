# Firecrawl Skill

**Purpose:** Empower AI coding agents to integrate Firecrawl’s web scraping, crawling, and search into applications using the preferred local MCP/API runtime, with clear fallbacks when the runtime is not configured.

## Prerequisites

- A Firecrawl API key (obtain from [firecrawl.dev](https://firecrawl.dev))
- Environment variable **`FIRECRAWL_API_KEY`** set to your key
- (Preferred) Firecrawl MCP server installed (provides `scrape_url`, `crawl_website`, etc.)
- Node.js or Python environment if using the SDK directly

## Runtime Options (in priority order)

### 1. Firecrawl MCP (recommended when available)

If the **Firecrawl MCP server** is running and available to the agent, use its tools:

- `scrape_url` – extract content from a single URL
- `crawl_website` – start an asynchronous crawl and return results
- `search_google` – run a live Google search

MCP tools already handle authentication, formats, and pagination. **Skip manual SDK/curl calls** when MCP is accessible.

### 2. Firecrawl API (via SDK or direct HTTP)

When MCP is **not** available, rely on the Firecrawl REST API. This works with the SDK or simple `curl` calls.

#### Install the SDK (optional)

```bash
# Node.js
npm install @mendable/firecrawl-js

# Python
pip install firecrawl-py
```

#### Quick verification

```bash
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```

### 3. Fallback – No runtime configured

If `FIRECRAWL_API_KEY` is **not** set and neither MCP nor SDK are present:

1. Instruct the user to create an API key at [firecrawl.dev](https://firecrawl.dev)
2. Add the key to the environment: `export FIRECRAWL_API_KEY=fc-...`
3. Choose one of the runtime options above
4. Proceed with the workflow

## Common Workflows

### Scrape a single URL

**MCP**
```
use tool: scrape_url with url and formats ["markdown", "html"]
```

**API (curl)**
```bash
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"<TARGET_URL>","formats":["markdown"]}'
```

**API (Node.js)**
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const { data } = await app.scrapeUrl({ url: '<TARGET_URL>', formats: ['markdown'] });
console.log(data.markdown);
```

### Crawl a website (multiple pages)

**MCP**
```
use tool: crawl_website with url, maxDepth, maxPages
```

**API (curl)**
```bash
# start crawl
JOB=$(curl -s -X POST https://api.firecrawl.dev/v1/crawl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"<TARGET_URL>","maxDepth":2,"maxPages":5}')
ID=$(echo $JOB | jq -r '.id')
# poll for results
curl -s "https://api.firecrawl.dev/v1/crawl/$ID" -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

### Search the web

**MCP**
```
use tool: search_google with query
```

**API (curl)**
```bash
curl -s -X POST https://api.firecrawl.dev/v1/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"query":"latest AI news"}'
```

## Best Practices

- Always prefer MCP when present – it’s simpler and more robust.
- Use `formats: ["markdown"]` for clean text suitable for LLMs.
- For crawling, be mindful of `maxPages` and rate limits.
- Rotate API keys if you hit rate limits; multiple keys can be used concurrently.
- Store the API key securely; never hardcode it in the source.

## Further Help

- [Firecrawl Skills Repository](https://github.com/firecrawl/skills) – additional agent‑specific patterns
- [Firecrawl API Documentation](https://docs.firecrawl.dev)
- [Firecrawl CLI & MCP Server](https://github.com/firecrawl/cli)
