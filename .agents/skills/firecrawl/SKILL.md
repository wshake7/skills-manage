# Firecrawl Skill

Prefer installed Firecrawl MCP server, then API with `FIRECRAWL_API_KEY`. This skill enables web scraping, searching, crawling, and interactive page content extraction.

## Runtime Options

### 1. MCP Server (Preferred)
If a `firecrawl` MCP server is configured, use its tools directly via MCP protocol calls.

- **Check availability**: Look for a running MCP server or configuration listing `firecrawl`.
- **Available tools**: `scrape`, `search`, `crawl`, `map`, `interact`.
- **Usage**:
  - Scrape: call `scrape` with `url`, `formats` (e.g., `["markdown"]`).
  - Search: call `search` with `query` and optional `limit`.
  - Crawl/Map: use `crawl` or `map` for site-wide operations.

When the MCP server is present, prefer it over SDK/API calls.

### 2. API Runtime (Fallback)
If MCP is unavailable, use the Firecrawl API via SDK or raw HTTP.

**Prerequisites**:
- Set environment variable: `FIRECRAWL_API_KEY=fc-your-key`
- Install SDK:
  - Python: `pip install firecrawl-py`
  - Node.js: `npm install @mendable/firecrawl-js`

**Examples**:
```python
from firecrawl import FirecrawlApp
import os

app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))

# Scrape
result = app.scrape_url("https://example.com", params={"formats": ["markdown"]})

# Search
search_result = app.search("latest AI trends", params={"limit": 3})

# Research workflow: search then scrape
for item in search_result.get("data", []):
    content = app.scrape_url(item["url"], params={"formats": ["markdown"]})
    print(len(content.get("markdown", "")))
```

**Interactive pages** require the `/interact` endpoint:
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com/form",
    "actions": [
      {"type": "fill", "selector": "#name", "value": "test"},
      {"type": "click", "selector": "#submit"},
      {"type": "wait", "milliseconds": 2000}
    ],
    "formats": ["markdown"]
  }'
```

### 3. API Key Onboarding (if missing)
If `FIRECRAWL_API_KEY` is not set, instruct the user to run:
```bash
npx -y firecrawl-cli@latest init --all --browser
```
This launches a browser-based authentication flow. Alternatively, use the installed `firecrawl-build-onboarding` skill.

## Workflow Guidance
- **Extract single page**: try MCP `scrape` → fallback to `app.scrape_url` (API).
- **Research multiple sources**: MCP `search` → iterate results with `scrape`.
- **Pages requiring JS/forms**: use MCP `interact` or the `/interact` endpoint.
- Always respect rate limits and use the appropriate runtime context.