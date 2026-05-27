# Firecrawl Skill

Firecrawl is a web scraping, search, and interaction API. This runtime‑adapter skill helps an AI coding agent integrate Firecrawl into a project. It **prefers** using the local Firecrawl MCP server or CLI skills; when those are not available, it falls back to the direct API via the official SDK.

## Prerequisites

The FIRECRAWL_API_KEY environment variable must be set. Get a key at [firecrawl.dev](https://firecrawl.dev).

```bash
echo "FIRECRAWL_API_KEY=fc-your-key" >> .env
```

## Preferred Runtime: MCP / CLI

Firecrawl provides an MCP server and a set of CLI skills that AI agents can use directly.

### Check Availability
- Look for `mcp__firecrawl_*` tools in your agent’s environment.
- If none are found, prompt the user to install them with:
  ```bash
  npx -y firecrawl-cli@latest init --all --browser
  ```
  This command installs the CLI, MCP server configuration, and browser authentication.

### Using MCP Tools
Once the MCP server is running, you have access to tools like `scrape`, `search`, `map`, `crawl`, and `interact`. Prefer these tools for web data operations because they handle authentication and session management automatically.

Examples:
- `mcp__firecrawl_scrape({ url: "https://example.com" })`
- `mcp__firecrawl_search({ query: "latest AI news" })`

If the user already has the CLI installed (e.g., `npx firecrawl` works), you can also call CLI commands directly – but MCP integration is smoother for code generation.

## Fallback: Direct API via Firecrawl SDK

When the MCP/CLI runtime is not configured, use the Firecrawl SDK. Install it according to the project’s language:

**Node.js**
```bash
npm install @mendable/firecrawl-js
```
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape a single URL
const scrapeResult = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });

// Search the web
const searchResult = await app.search('latest tech news');

// Crawl a website
const crawlResult = await app.crawlUrl('https://example.com', { limit: 10 });
```

**Python**
```bash
pip install firecrawl-py
```
```python
from firecrawl import FirecrawlApp
import os

app = FirecrawlApp(api_key=os.environ['FIRECRAWL_API_KEY'])

# Scrape
scrape_data = app.scrape_url('https://example.com', params={'formats': ['markdown']})

# Search
search_data = app.search('latest tech news')

# Crawl
crawl_data = app.crawl_url('https://example.com', params={'limit': 10})
```

### Error Handling
- If the API key is missing, guide the user to add it to `.env`.
- For network or rate‑limit errors, suggest retrying with exponential backoff.
- The SDK throws descriptive errors; log them and present actionable messages.

## When to Use This Skill
- When you are writing code that **integrates** Firecrawl into an application (e.g., a chatbot that scrapes pages).
- When deciding which Firecrawl capability (scrape, search, crawl, map, interact) fits the task.
- When you need to set up authentication and environment variables.

For **one‑off ad‑hoc scraping or terminal commands**, rely on the CLI or MCP tools directly instead of generating SDK code.

## Resources
- [Firecrawl Skills Repository](https://github.com/firecrawl/skills) – official agent skills.
- [Firecrawl Docs](https://docs.firecrawl.dev) – API reference and guides.
- [Firecrawl CLI](https://github.com/firecrawl/cli) – command‑line interface.
