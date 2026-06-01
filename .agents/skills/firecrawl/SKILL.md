# Firecrawl Skill

## Overview
Firecrawl provides web scraping, search, and dynamic browser interaction APIs. This skill enables an AI coding agent to leverage Firecrawl capabilities via MCP (preferred), direct API, or CLI onboarding when no runtime is configured.

## Quick Start
1. **Check runtime**: Prefer MCP if a Firecrawl MCP server is connected; otherwise fall back to API.
2. **No runtime?** Automatically guide user through one-time setup using browser OAuth.

## Runtime Detection
- **MCP available**: The agent sees tools like `firecrawl_scrape`, `firecrawl_search`, `firecrawl_map`, `firecrawl_crawl` in the tool list.
- **API available**: Environment variable `FIRECRAWL_API_KEY` is set.
- **Neither available**: Fall back to the CLI init flow below.

## Workflows

### 1. MCP Mode (Preferred)
When the MCP server is active, use its tools directly:

```python
# Example: scrape a URL (call via MCP)
mcp_call_tool("firecrawl_scrape", {
  "url": "https://example.com",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

- **Scrape**: `firecrawl_scrape` — get page content in markdown/HTML/etc.
- **Search**: `firecrawl_search` — search the web and return results with optional scraping.
- **Crawl**: `firecrawl_crawl` — deep crawl a site with configurable depth.
- **Map**: `firecrawl_map` — discover URLs from a starting point.
- **Actions**: `firecrawl_click`, `firecrawl_input`, `firecrawl_screenshot` — interact with pages.

Always check the tool descriptions for exact parameters.

### 2. API Mode (Fallback)
If MCP is absent but `FIRECRAWL_API_KEY` is present, use the Firecrawl SDK.

**Install if needed** (once per project):
```bash
npm install @mendable/firecrawl-js   # Node.js
# or
pip install firecrawl-py            # Python
```

**Usage examples:**
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape a page
const scrapeResult = await app.scrapeUrl('https://example.com', {
  formats: ['markdown'],
  onlyMainContent: true
});

// Search
const searchResult = await app.search('your query', {
  limit: 5,
  lang: 'en'
});

// Crawl
const crawlResult = await app.crawlUrl('https://example.com', {
  limit: 50,
  scrapeOptions: { formats: ['markdown'] }
});
```

### 3. Setup (Neither MCP nor API key)
When the user hasn't configured any runtime, run the onboarding CLI:

```bash
npx -y firecrawl-cli@latest init --all --browser
```

This launches a browser-based authentication flow to obtain an API key and installs CLI skills. After completion, the user must restart the agent session (or reload environment) to pick up the new key. 

Alternatively, guide the user to sign up at [firecrawl.dev](https://firecrawl.dev), get an API key, and set `FIRECRAWL_API_KEY` in their environment.

## Important Notes
- **Rate limits**: Free tier has limited requests; production usage needs a paid plan.
- **Scrape options**: Always prefer `onlyMainContent: true` to reduce noise.
- **Cache**: Use `cache` parameter (if allowed) to avoid re-scraping.
- **Tools over SDK**: When MCP is available, use its tools instead of managing SDK clients manually.
- **Error handling**: Wrap API calls in try-catch and suggest the user check their quota if 429 errors occur.

## Example Tasks
- *“Find the latest docs on X topic”* → Use `firecrawl_search` (MCP) or `app.search()` (API).
- *“Extract content from this list of URLs”* → Iterate with `firecrawl_scrape` or `app.scrapeUrl()`.
- *“Crawl the entire docs site”* → Use `firecrawl_crawl` or `app.crawlUrl()` with a reasonable limit.

If the agent lacks the runtime, initiate the setup flow and retry after the user confirms the key is set.
