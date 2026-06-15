# Firecrawl Skill

Web scraping, crawling, and structured data extraction using Firecrawl. Prefers existing MCP/API/CLI runtimes; falls back to direct SDK or HTTP API with user‑provided `FIRECRAWL_API_KEY`.

## When to Use

- Scrape static or JavaScript‑heavy pages into clean Markdown/HTML.
- Crawl multiple pages under a domain.
- Interact with pages (click, fill forms, wait) before scraping.
- Extract structured data from pages using JSON schemas.

## Prerequisites

- Firecrawl API key (sign up at [firecrawl.dev](https://firecrawl.dev)).
- Export key as environment variable:
  ```bash
  export FIRECRAWL_API_KEY=fc-xxxxxxxxxxxx
  ```

## Runtime Selection (prefer the first available)

1. **MCP (Firecrawl MCP Server)** – Check if tool functions like `mcp__firecrawl__scrape`, `mcp__firecrawl__crawl`, etc. are available. Use them directly; they handle authentication and concurrency.
2. **Firecrawl SDK** – If `@mendable/firecrawl-js` (Node) or `firecrawl-py` (Python) is installed and `FIRECRAWL_API_KEY` is set, instantiate the client and call its methods.
3. **Firecrawl CLI** – If `firecrawl` or `npx firecrawl-cli` is available, use sub‑commands (e.g., `scrape`, `crawl`, `map`).
4. **Direct HTTP API** – Use `curl` or language HTTP client with the REST endpoints below (requires `FIRECRAWL_API_KEY`).
5. **Fallback Setup** – If nothing is available, guide the user to install the SDK and set the API key:
   ```bash
   npm install @mendable/firecrawl-js   # or pip install firecrawl-py
   echo "FIRECRAWL_API_KEY=fc-..." >> .env
   ```

## Core Workflows (use the best available runtime)

### 1. Smoke Test / Health Check

Verify connectivity and authentication.

**MCP**: `mcp__firecrawl__scrape({ url: "https://example.com", formats: ["markdown"] })`
**SDK (JS)**: `const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY }); await firecrawl.scrapeUrl("https://example.com", { formats: ["markdown"] })`
**CLI**: `firecrawl scrape https://example.com --formats markdown`
**HTTP (curl)**:
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```

### 2. Scrape a Static Page

Retrieve clean Markdown/HTML from a page that does not require JavaScript rendering.

Use the same tool/signature as the smoke test; customize `formats`, `onlyMainContent`, `includeHtml`, `waitFor` as needed.

### 3. Scrape a Dynamic / JavaScript‑Heavy Page

For pages that require interactions (click, fill, wait) or JavaScript rendering.

**MCP**: use `mcp__firecrawl__interact` if available; otherwise fall back to `mcp__firecrawl__scrape` with `actions` parameter.
**SDK**: call `scrapeUrl` with an `actions` array:
```js
await firecrawl.scrapeUrl(url, {
  formats: ["markdown"],
  actions: [
    { type: "fill", selector: "#search", value: "term" },
    { type: "click", selector: "#submit" },
    { type: "wait", milliseconds: 2000 }
  ]
});
```
**HTTP (curl)**: use the `/interact` endpoint:
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
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

### 4. Crawl Multiple Pages

Discover and scrape all pages under a domain or URL pattern.

**MCP**: `mcp__firecrawl__crawl({ url, maxPages, ... })`
**SDK**: `await firecrawl.crawlUrl(url, { maxPages: 50, ... })`
**CLI**: `firecrawl crawl https://docs.example.com --max-pages 50`
**HTTP**: `POST /v1/crawl`

### 5. Extract Structured Data

Use a JSON schema to extract specific fields from a page (e.g., product name, price).

**MCP**: `mcp__firecrawl__extract({ url, prompt, schema, ... })`
**SDK**: `await firecrawl.extract({ urls: [url], prompt: "Extract product details", schema })`
**HTTP**: `POST /v1/extract`

## Fallback When No Runtime is Available

1. **Check for API key**: `echo $FIRECRAWL_API_KEY` – if empty, instruct the user to get one and export it.
2. **Offer to install SDK**: `npm install @mendable/firecrawl-js` (or pip) and add `FIRECRAWL_API_KEY` to `.env`.
3. **Use direct HTTP calls** as shown above – works in any environment with `curl`.
4. **Rate limits**: Free tier allows 500 credits/month; larger jobs may need a paid plan.

## Error Handling

- **401/403** – Invalid or missing API key. Re‑check `FIRECRAWL_API_KEY`.
- **429** – Rate limited. Wait and retry after `Retry-After` header.
- **Timeout** – Increase `timeout` option or break large crawls into smaller batches.
- **MCP tool not found** – Silently fall through to SDK or HTTP; do not stop the agent.

## References

- [Firecrawl API Docs](https://docs.firecrawl.dev)
- [Firecrawl MCP Server](https://github.com/firecrawl/firecrawl-mcp-server)
- [SDK Documentation](https://docs.firecrawl.dev/sdks/overview)
