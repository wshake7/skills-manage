# Firecrawl Runtime Adapter

## Overview
Integrate Firecrawl's web scraping, search, and crawling APIs into your project. This skill prefers the Firecrawl MCP server when available, falls back to the official SDK with your API key, and assists with credential setup.

## Quick Start
1. **Check for MCP server**  
   Look for an active `firecrawl-mcp` tool in your environment. If present, use it directly (see MCP Section).
2. **Fallback to SDK**  
   If MCP is missing but `FIRECRAWL_API_KEY` is set, install the SDK and start coding (see SDK Section).
3. **Setup API Key**  
   If neither MCP nor API key is available, guide the user to obtain one (see Setup Section).

## MCP Runtime
When the Firecrawl MCP server is connected, prefer these methods:
- `scrape_url(url, formats?, options?)` – Extract content from a URL.
- `search(query, options?)` – Search the web with advanced filters.
- `crawl_url(url, options?)` – Crawl multiple pages from a site.
- `map_url(url, options?)` – Discover URLs on a domain.

### Example
```
// AI agent executes MCP tool call
const result = await mcp.firecrawl.scrape_url({
  url: "https://example.com",
  formats: ["markdown"],
  onlyMainContent: true
});
return result.data.markdown;
```

## SDK Fallback (Node.js / Python)
When MCP is unavailable but `FIRECRAWL_API_KEY` is set:
1. Install the appropriate package:
   - Node.js: `npm install @mendable/firecrawl-js`
   - Python: `pip install firecrawl-py`
2. Import and initialize:
   ```js
   import FirecrawlApp from '@mendable/firecrawl-js';
   const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
   ```
   ```python
   from firecrawl import FirecrawlApp
   app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])
   ```
3. Use the client:
   - **Scrape**: `app.scrapeUrl(url, { formats: ['markdown'] })`
   - **Search**: `app.search('your query', { limit: 5 })`
   - **Crawl**: `app.crawlUrl(startUrl, { limit: 10 })`
   - **Map**: `app.mapUrl('https://docs.example.com')`

### Example (Node.js)
```js
const result = await app.scrapeUrl('https://example.com', {
  formats: ['markdown'],
  onlyMainContent: true
});
console.log(result.data.markdown);
```

## Setup API Key
If no API key is found:
1. **Obtain a key** from [firecrawl.dev](https://firecrawl.dev) (free tier available).
2. **Set environment variable**: `echo "FIRECRAWL_API_KEY=fc-..." >> .env`
3. **Alternative**: Use the `firecrawl-build-onboarding` skill (if available) for a browser‑based auth flow.

## Common Workflows
### Scrape a Webpage for Content
- **MCP**: Use `scrape_url` with `formats: ["markdown"]` and `onlyMainContent: true`.
- **SDK Fallback**: `app.scrapeUrl(url, { formats: ['markdown'], onlyMainContent: true })`

### Search for Information
- **MCP**: `search(query, { limit: 5, scrapeOptions: { formats: ['markdown'] } })`
- **SDK Fallback**: `app.search(query, { limit: 5, scrapeOptions: { formats: ['markdown'] } })`

### Extract Structured Data with LLM
Use `extract` parameter with a schema:
- **MCP**: `scrape_url(url, { formats: ['extract'], extract: { schema: z.object({ title: z.string() }) } })`
- **SDK Fallback**: `app.scrapeUrl(url, { formats: ['extract'], extract: { schema: zodSchema } })`

## Error Handling
- **401 Unauthorized** → Check `FIRECRAWL_API_KEY` validity.
- **429 Rate Limit** → Implement backoff or upgrade plan.
- **Dependencies missing** → Ensure `@mendable/firecrawl-js` or `firecrawl-py` is installed.
- **MCP disconnected** → Fall back to SDK; if SDK also fails, guide user to verify MCP server and API key.

## Additional Resources
- Official docs: https://docs.firecrawl.dev
- CLI skill: Use `firecrawl-cli` for ad‑hoc terminal commands (separate skill).