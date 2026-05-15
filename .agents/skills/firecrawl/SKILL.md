---
name: firecrawl
description: Skill for web scraping, crawling, searching, and dynamic interactions using Firecrawl. Prefers local MCP/CLI runtime, falls back to direct API with FIRECRAWL_API_KEY.
sync: runtime-adapter
runtime: mcp, api
---

# Firecrawl Skill

Firecrawl enables web data extraction, crawling, search, and interaction with dynamic pages. This skill guides the agent to use Firecrawl effectively, prioritizing installed MCP server or CLI skills, falling back to direct API calls.

## Runtime Detection & Priority

1. **MCP (preferred)**: Check if a Firecrawl MCP server is available (e.g., via `mcp__firecrawl__scrape` tools). Use MCP tools for all operations when connected.
2. **CLI / Installed Skills**: If the user has run `npx firecrawl-cli@latest init --all --browser`, they may have project-specific skills. Prefer those if detected.
3. **Direct API**: If no local runtime found, use the Firecrawl REST API with the `FIRECRAWL_API_KEY` environment variable. Ensure the key is set (instruct user if missing).

## Setup

### Obtain an API Key
- Sign up at [firecrawl.dev](https://firecrawl.dev) and get an API key.
- Set environment variable:
  ```bash
  export FIRECRAWL_API_KEY=fc-your-key
  ```

### Install SDK (for API fallback)
- Node.js: `npm install @mendable/firecrawl-js`
- Python: `pip install firecrawl-py`

### Optional: Install CLI & Build Skills
```bash
npx -y firecrawl-cli@latest init --all --browser
```
This sets up local skill files and authenticates your browser for reuse.

## Core Workflows

### 1. Scrape a URL
Fetch clean content from a page.

**MCP (preferred):**
Use tool `mcp__firecrawl__scrape` with `url` and `formats: ["markdown"]`.

**API fallback:**
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```
Python (with `firecrawl`):
```python
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
result = app.scrape_url("https://example.com", params={"formats": ["markdown"]})
print(result["markdown"])
```

### 2. Search the Web
Find relevant URLs via Firecrawl’s search engine integration.

**MCP:** Use `mcp__firecrawl__search` with `query` and optional `limit`.

**API fallback:**
```bash
curl -X POST https://api.firecrawl.dev/v1/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"query": "latest AI frameworks", "limit": 5}'
```
Python:
```python
results = app.search("latest AI frameworks", params={"limit": 5})
for item in results["data"]:
    print(item["url"])
```

### 3. Crawl a Site
Recursively extract pages from a domain.

**MCP:** Use `mcp__firecrawl__crawl` with `url`, `maxPages`, and optional `includes`/`excludes` patterns.

**API fallback:**
```bash
curl -X POST https://api.firecrawl.dev/v1/crawl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com/docs", "maxPages": 20}'
```
Check status and get results using the crawl job ID.

### 4. Interact with Dynamic Pages (Fill forms, click, wait)
When content requires user actions.

**MCP:** Not all MCP servers expose interact; fallback to API.

**API fallback:**
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com/search",
    "actions": [
      {"type": "fill", "selector": "#q", "value": "firecrawl"},
      {"type": "click", "selector": "#submit"},
      {"type": "wait", "milliseconds": 2000}
    ],
    "formats": ["markdown"]
  }'
```

### 5. Research Workflow (Search + Scrape)
Combine search and scrape for deep dives.

Python example:
```python
search_results = app.search("topic", params={"limit": 3})
for result in search_results["data"]:
    scraped = app.scrape_url(result["url"], params={"formats": ["markdown"]})
    print(scraped["markdown"][:200])
```

## Fallback Behavior

- If `FIRECRAWL_API_KEY` is not set and no MCP tool available, instruct the user to obtain a key and set the environment variable. Offer to guide them to https://firecrawl.dev.
- If the user lacks the SDK, you can still call the API directly via `curl` commands shown above. For Python/Node, suggest installing the SDK.
- If a scrape returns blocked by JavaScript, suggest using the `/interact` endpoint or enabling `render: true` in scrape parameters (for SPAs).

## Important Notes

- Always respect `robots.txt` and website terms of service.
- Results can be large; prefer streaming or paginating when possible.
- For heavy crawling, monitor API credits.
- When using the MCP, tools may be named `firecrawl_scrape`, `firecrawl_search` etc. Inspect available tools first.
