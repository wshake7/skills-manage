# Firecrawl – AI Agent Integration Guide

Firecrawl converts websites into clean, LLM‑ready data (Markdown, structured extracts, screenshots, search results, and sitemaps). This skill teaches you how to use Firecrawl in your coding environment.

## Runtime detection order

Always prefer the best available runtime:
1. **MCP tools** (firecrawl_scrape, firecrawl_search, …)
2. **Direct API** (when `FIRECRAWL_API_KEY` is set)
3. **Firecrawl CLI** (when `npx firecrawl` is installed and authenticated)
4. **Fallback** – guide the user to set up Firecrawl

---

## 1. MCP runtime (preferred)

If a Firecrawl MCP server is connected, use the provided tools directly.

### Available MCP tools (typical)
- `firecrawl_scrape` – extract page content
- `firecrawl_crawl` – multi‑page crawl with navigation
- `firecrawl_search` – web search with Firecrawl’s index
- `firecrawl_map` – discover URLs from a sitemap or crawling
- `firecrawl_extract` – structured data extraction
- `firecrawl_screenshot` – capture page screenshots
- `firecrawl_interact` – browser interaction (click, fill, wait)

### Example: Scrape a page
```json
{
  "tool": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"],
    "onlyMainContent": true
  }
}
```

When the MCP runtime is detected, always prefer these tools – they are the easiest and most reliable way to work.

---

## 2. API runtime

If MCP is not available but `FIRECRAWL_API_KEY` is defined in the environment, use the REST API endpoints directly.

**Base URL:** `https://api.firecrawl.dev/v1`

### Common endpoints
- `POST /scrape` – single page
- `POST /crawl` – start a crawl (returns a job ID)
- `GET /crawl/{id}` – check crawl status
- `POST /search` – search the web
- `POST /map` – discover URLs
- `POST /interact` – browser actions (forms, clicks)
- `POST /extract` – structured data
- `POST /screenshot` – screenshot

### Quick example: Scrape a page
```bash
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown"],
    "onlyMainContent": true
  }'
```

### Using an SDK
If your project already includes `@mendable/firecrawl-js` or `firecrawl-py`, you can generate the equivalent code:
```javascript
// Node.js
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
```

### Long‑running operations (crawl)
A crawl returns a `id`. Poll `GET /v1/crawl/{id}` until `status` is `completed`. The response body will contain paginated results.

---

## 3. CLI runtime

If the `firecrawl` CLI is installed and you have an API key, you can use it for quick operations.

```bash
# Scrape
npx firecrawl scrape https://example.com --formats markdown --onlyMainContent

# Crawl
npx firecrawl crawl https://example.com --maxPages 10

# Search
npx firecrawl search "firecrawl" --limit 5
```

This is useful for one‑off tasks or when you want to interact with the agent through your terminal.

---

## 4. Fallback – User setup required

If **no** runtime is available (MCP not connected, `FIRECRAWL_API_KEY` not set, CLI not installed), guide the user to complete the setup:

### Option A – Quick CLI setup (recommended)
```bash
npx -y firecrawl-cli@latest init --all --browser
```
This installs the CLI, adds MCP skills, and opens a browser for authentication.

### Option B – Manual API key setup
1. Sign up at [firecrawl.dev](https://firecrawl.dev) and copy your API key.
2. Add it to your project’s `.env` file:
   ```
   FIRECRAWL_API_KEY=fc-your-key-here
   ```
3. Install an SDK if needed:
   ```bash
   npm install @mendable/firecrawl-js   # or pip install firecrawl-py
   ```
4. Restart your IDE or run `source .env` to pick up the variable.

### Option C – MCP configuration
Add this to your AI editor’s MCP settings (e.g., `.cursor/mcp.json` or Claude’s config):
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"
      }
    }
  }
}
```
Then restart the editor – the Firecrawl MCP tools will become available.

---

## Workflow guidance for the agent

1. **Before any Firecrawl action**, check in this order:
   - Are MCP tools (like `firecrawl_scrape`) present? → use them.
   - Is `FIRECRAWL_API_KEY` set? → use the REST API or CLI.
   - Is neither present? → ask the user to run the setup (see Fallback).

2. **When handling a crawl task**, remember:
   - Use MCP’s `firecrawl_crawl` or start an API crawl, then poll until completion.
   - For API, use `POST /crawl` with `waitUntilCompleted: true` or handle polling manually.
   - Always stream or display progress feedback.

3. **For search or sitemap** tasks, `firecrawl_search` and `firecrawl_map` are usually the fastest routes.

4. **Avoid exposing API keys** – never write them into repository code; always read from environment.

5. **Respect robots.txt** – Firecrawl respects it by default, but you can override it only when necessary and with user permission.

---

## Common patterns

- **Extract main content from a blog post** → scrape with `onlyMainContent: true` and format `markdown`.
- **Competitor pricing research** → crawl a product category, then extract structured JSON with `extract`.
- **Technical documentation indexing** → map the docs site, then scrape each relevant page.
- **JavaScript‑heavy page** → use `interact` with `actions` (click, wait, fill) before scraping.

Always adapt to the runtime at hand and fall back gracefully if nothing is configured.