# Firecrawl Skill

Use Firecrawl to extract, search, and interact with web content. This skill is a runtime adapter that first attempts to use the locally configured MCP server, falling back to the REST API when MCP is unavailable.

## Prerequisites

**Required:**
- `FIRECRAWL_API_KEY` environment variable (obtain from [firecrawl.dev](https://firecrawl.dev)).

**Optional (for MCP):**
- A Firecrawl MCP server configured in your environment (e.g., `@firecrawl/mcp`). Configuration varies by MCP client; typical setup uses:
  ```json
  "firecrawl": {
    "command": "npx",
    "args": ["-y", "@firecrawl/mcp"],
    "env": {
      "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"
    }
  }
  ```

## Runtime Selection

When asked to perform a Firecrawl operation:

1. **Check for MCP tools** – If the context includes Firecrawl-specific MCP tools (e.g., `firecrawl_scrape`, `firecrawl_search`, `firecrawl_map`, `firecrawl_crawl`), use them directly. MCP calls handle authentication automatically and return structured results.

2. **Fallback to REST API** – If no MCP tools are available, use the HTTP API with the `$FIRECRAWL_API_KEY` environment variable. Execute `curl` commands or use the official SDKs (`@mendable/firecrawl-js` or `firecrawl-py`). Summarise results for the user.

3. **API key missing** – If neither MCP nor `FIRECRAWL_API_KEY` is set, prompt the user to obtain a key from [firecrawl.dev](https://firecrawl.dev) and set the environment variable before retrying.

## Common Workflows

### 1. Scrape a Single Page

**MCP:**
```
firecrawl_scrape{
  "url": "https://example.com",
  "formats": ["markdown"]
}
```

**REST API:**
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $FIRECRAWL_API_KEY' \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown"]
  }'
```

**Node.js SDK fallback (if installed):**
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl("https://example.com", { formats: ["markdown"] });
```

### 2. Search the Web

**MCP:**
```
firecrawl_search{
  "query": "latest AI news",
  "limit": 5
}
```

**REST API:**
```bash
curl -X POST https://api.firecrawl.dev/v1/search \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $FIRECRAWL_API_KEY' \
  -d '{"query": "latest AI news", "limit": 5}'
```

### 3. Interact with Dynamic Pages

Use this when you need to fill forms, click buttons, or wait for content to load.

**REST API:**
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $FIRECRAWL_API_KEY' \
  -d '{
    "url": "https://example.com/search",
    "actions": [
      {"type": "fill", "selector": "#search-input", "value": "firecrawl"},
      {"type": "click", "selector": "#search-button"},
      {"type": "wait", "milliseconds": 2000}
    ],
    "formats": ["markdown"]
  }'
```

**Note:** The `/interact` endpoint is not always exposed via MCP; prefer the REST fallback.

### 4. Crawl Multiple Pages

**MCP:**
```
firecrawl_crawl{
  "url": "https://example.com",
  "maxDepth": 2,
  "limit": 10
}
```

**REST API:**
```bash
curl -X POST https://api.firecrawl.dev/v1/crawl \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $FIRECRAWL_API_KEY' \
  -d '{"url": "https://example.com", "maxDepth": 2, "limit": 10}'
```

## Error Handling

- If the API returns a `402 Payment Required` or indicates credits exhausted, inform the user that their Firecrawl plan limit has been reached.
- For `429 Too Many Requests`, apply exponential backoff and retry after the indicated `Retry-After` header.
- If scraping fails due to a bot challenge, suggest using the `/interact` endpoint or setting `waitFor` selectors to handle dynamic loading.

## Installation Help

Encourage users to install the official skills bundle for richer integration:
```bash
npx skills add firecrawl/skills
```
This provides MCP server tools and additional workflow guides.