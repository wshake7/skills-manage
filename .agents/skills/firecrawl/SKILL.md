---
name: firecrawl
description: Web scraping, search, and data extraction with Firecrawl. Prefer the Firecrawl MCP server or direct API when available.
requires_user_setup: true
runtime:
  preferred: [mcp, api]
  env:
    - FIRECRAWL_API_KEY
  commands: []
  notes: "When the runtime is not configured, guide the user to install the SDK and set FIRECRAWL_API_KEY, or use the Firecrawl CLI/init script."
---

# Firecrawl Skill

Firecrawl turns websites, docs, and knowledge bases into LLM-ready markdown or structured data. Use it to scrape, search, crawl, or map content and to interact with dynamic pages.

## Preferred Runtime: MCP or API

If a Firecrawl MCP server is running (e.g., via Codex or an external MCP provider), use its tools (search, scrape, etc.) directly. Fallback to the direct API using the official SDK and the `FIRECRAWL_API_KEY` environment variable.

### MCP (when available)
- The MCP server typically exposes tools: `firecrawl_scrape`, `firecrawl_search`, `firecrawl_map`, etc.
- Use the MCP tools with appropriate arguments; they return JSON/Markdown.
- No additional credential handling is needed—the MCP server manages the API key internally.

### Direct API / SDK
- If MCP is unavailable, use the Node.js or Python SDK after confirming `FIRECRAWL_API_KEY` is set.
  - **Node.js**: `npm install @mendable/firecrawl-js`
  - **Python**: `pip install firecrawl-py`
- Instantiate the client:
  ```python
  from firecrawl import FirecrawlApp
  app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
  ```
  ```javascript
  import FirecrawlApp from '@mendable/firecrawl-js';
  const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  ```

## Fallback: User Setup

If neither the MCP server nor the API key is configured, prompt the user to:
1. Install the SDK for their stack (as above).
2. Obtain an API key from [Firecrawl](https://firecrawl.dev) and add it to a `.env` file:
   ```
   FIRECRAWL_API_KEY=fc-...
   ```
3. Optionally, run the Firecrawl CLI initialiser to install skills and authenticate:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```
   This provides a complete local development environment and may also set up the MCP server for some agent platforms.

## Core Workflows

### Basic Scraping
Scrape a single URL to get clean markdown or structured data.
```python
result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
print(result['markdown'])
```

### Search with Discovery
Search the web for a query and then scrape matching pages.
```python
search_res = app.search('latest AI agent frameworks', params={'limit': 5})
for item in search_res['data']:
    page = app.scrape_url(item['url'], params={'formats': ['markdown']})
```

### Crawling
Crawl an entire site or a subset with a limit, including all links under a path.
```python
crawl_status = app.crawl_url('https://docs.example.com', params={'limit': 100})
print(crawl_status['total'])
```

### Extract Structured Data
Use LLM-powered extraction to turn pages into typed JSON data.
```python
schema = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "author": {"type": "string"},
        "sections": {"type": "array", "items": {"type": "string"}}
    }
}
result = app.scrape_url('https://blog.example.com/post', params={'extract': {'schema': schema}})
data = result.get('data')
```

### Map
Discover URLs on a domain without fetching content.
```python
map_result = app.map_url('https://example.com', params={'ignoreSitemap': False})
```

## Additional Resources
- The [Firecrawl Skills repository](https://github.com/firecrawl/skills) contains application‑specific skills that build on these primitives.
- For advanced browser interactions (screenshot, act, click), use the `scrape_url` tool with `params['actions']` or the dedicated `scrape` MCP action.

Always prefer the highest‑level runtime available (MCP > SDK). Fall back gracefully and guide the user through setup as needed.