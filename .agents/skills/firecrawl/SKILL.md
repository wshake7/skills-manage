# Firecrawl Runtime Adapter

## Overview
Firecrawl provides web scraping, crawling, search, and browser interaction APIs. This skill enables an AI coding agent to incorporate Firecrawl endpoints into projects for data extraction, indexing, or monitoring tasks. Use it when building features that require structured web data.

**Important:** This skill is for *integrating Firecrawl into a product*. For ad‑hoc research or one‑off scraping during a coding session, use the Firecrawl CLI skills or MCP tools directly.

## Preferred Runtimes

### 1. Firecrawl MCP Server
If the environment includes a configured Firecrawl MCP server (e.g., `firecrawl-mcp`), use its tools directly. Typical tools:
- `firecrawl_scrape` – extract content from a single URL.
- `firecrawl_search` – web search with Firecrawl’s discovery engine.
- `firecrawl_crawl` – recursively crawl a domain.
- `firecrawl_map` – discover URLs on a site.

All authentication is handled by the server; just call the tools with the required parameters.

### 2. Direct API with SDK
When no MCP server is present but the `FIRECRAWL_API_KEY` environment variable is set, use the official SDK (`@mendable/firecrawl-js` for Node, `firecrawl-py` for Python) or raw HTTP requests to `https://api.firecrawl.dev/v1/`.

**Prefer the SDK** – it simplifies rate limiting, error handling, and response parsing.

## Setup

### Required Environment Variable
- `FIRECRAWL_API_KEY` – Your Firecrawl API key.

If the key is missing, instruct the user to:
1. Obtain a key from [firecrawl.dev](https://firecrawl.dev).
2. Add it to `.env`: `FIRECRAWL_API_KEY=fc-...`.
3. (Optional) Install the MCP server for richer agent tooling: `npx -y firecrawl-cli@latest init --all --browser`.

### Project Installation
- **Node.js**: `npm install @mendable/firecrawl-js`
- **Python**: `pip install firecrawl-py`

## Workflows

### Scraping a URL
**MCP:**
```
firecrawl_scrape(url="https://example.com", format="markdown")
```
**API/SDK (Node):**
```js
import Firecrawl from '@mendable/firecrawl-js';

const client = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await client.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(result.markdown);
```

### Searching the Web
**MCP:**
```
firecrawl_search(query="latest AI trends", limit=5)
```
**API/SDK:**
```js
const results = await client.search('latest AI trends', { limit: 5 });
```

### Crawling a Website
**MCP:**
```
firecrawl_crawl(url="https://docs.example.com", maxPages=50)
```
**API/SDK:**
```js
const job = await client.crawlUrl('https://docs.example.com', { maxPages: 50 });
const complete = await client.checkCrawlStatus(job.id);
```

### Dynamic Browser Interactions
For pages requiring JavaScript rendering, logins, or button clicks, use the `actions` parameter.

**MCP:**
```
firecrawl_scrape(url="https://spa.example.com", actions=[{type: "click", selector: ".load-more"}])
```
**API/SDK:**
```js
const result = await client.scrapeUrl('https://spa.example.com', {
  formats: ['markdown'],
  actions: [{ type: 'click', selector: '.load-more' }],
});
```

## Fallback Behaviour

### When MCP is not configured and API key is missing
1. Tell the user: *“I need a Firecrawl API key to proceed. Please get one from firecrawl.dev and set FIRECRAWL_API_KEY in your environment. Then I can use the Firecrawl API directly.”*
2. Optionally suggest installing the MCP server for faster, more capable tooling: `npx -y firecrawl-cli@latest init --all --browser`.
3. Wait for the user to provide the key or confirm the setup before attempting any Firecrawl calls.

### When MCP is available but lacks a required feature
Fall back to the SDK/API for advanced options not exposed by the MCP server (e.g., custom action sequences, specific output formats). Re‑use the same `FIRECRAWL_API_KEY`.

## Notes
- Always respect `robots.txt` and Firecrawl’s usage limits.
- For larger crawls, use asynchronous crawl jobs and poll the status endpoint.
- Firecrawl Skills repository (`/firecrawl/skills`) contains additional skill definitions for agent integration and product building.
