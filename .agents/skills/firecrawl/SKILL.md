# Firecrawl Skill

Firecrawl is a web crawling and scraping API. This runtime‑adapter skill enables an AI agent to use Firecrawl through the preferred local MCP server, the official API, or a fallback CLI/SDK, depending on what is available.

## Runtime Detection & Decision Flow

1. **MCP tools available** – if the agent detects `firecrawl_scrape`, `firecrawl_crawl`, or similar tools, use them directly (see [MCP Usage](#mcp-usage)).
2. **API key present** – if `FIRECRAWL_API_KEY` is set (or can be read from `.env`), use the SDK (JavaScript/TypeScript or Python) (see [API/SDK Usage](#apisdk-usage)).
3. **Neither** – offer to install the Firecrawl CLI and set up the API key, or guide the user through manual configuration (see [Setup & Fallback](#setup--fallback)).

## MCP Usage

When the Firecrawl MCP server is running and connected, the agent has access to tools like:

- `firecrawl_scrape` – extract content from a single URL.
- `firecrawl_crawl` – crawl a website with depth control.
- `firecrawl_search` – web search via Firecrawl.

**Example tool call (conceptual):**
```
mcp__firecrawl__firecrawl_scrape({ url: "https://example.com" })
```

If the exact tool names differ, match by prefix (`firecrawl_`). Always prefer MCP because it avoids managing SDK code and is faster.

## API/SDK Usage

Fallback when MCP is unavailable but `FIRECRAWL_API_KEY` is set.

### JavaScript / TypeScript

```ts
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape a page
const scrapeResult = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });

// Crawl a site
const crawlResult = await app.crawlUrl('https://example.com', { maxDepth: 2 });

// Search
const searchResult = await app.search('latest AI news');
```

### Python

```python
from firecrawl import FirecrawlApp
import os

app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])

# Scrape
scrape_result = app.scrape_url("https://example.com", params={"formats": ["markdown"]})

# Crawl
crawl_result = app.crawl_url("https://example.com", params={"maxDepth": 2})

# Search
search_result = app.search("latest AI news")
```

**Important:** Always load the API key from the environment – never hardcode it. If the `.env` file needs to be created, assist the user.

## Setup & Fallback

If neither MCP nor API key is available, guide the user through one‑time setup:

### Option 1: Firecrawl CLI (quick, includes MCP + skills)

```bash
npx -y firecrawl-cli@latest init --all --browser
```
This command installs the CLI, sets up MCP server configurations, and opens the browser to authenticate and retrieve an API key automatically.

### Option 2: Manual API Key + SDK

1. Obtain an API key from [https://firecrawl.dev](https://firecrawl.dev).
2. Add it to the project’s `.env` file:
   ```
   FIRECRAWL_API_KEY=fc-your-key
   ```
3. Install the SDK:
   - Node.js: `npm install @mendable/firecrawl-js`
   - Python: `pip install firecrawl-py`

### Fallback Behavior

When the runtime is not configured, the agent should:
- Notify the user that Firecrawl needs setup.
- Offer to run the CLI command or walk through manual setup.
- Once configured, resume the original task using the appropriate runtime.

## Common Workflows

1. **Scrape a single page** → `firecrawl_scrape` (MCP) or `app.scrapeUrl()` (SDK).
2. **Crawl a website** → `firecrawl_crawl` (MCP) or `app.crawlUrl()` (SDK).
3. **Search the web** → `firecrawl_search` (MCP) or `app.search()` (SDK).

Always prefer structured output (e.g., Markdown, JSON) when available to ease downstream processing.