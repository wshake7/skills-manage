# Firecrawl Skill

Firecrawl is a web scraping and crawling API that returns clean, LLM-ready data. Use it for extracting content, searching the web, or interacting with dynamic pages.

## Preferred Runtime: MCP or API

When available, prefer the built‑in MCP tools or a configured API client. The fallback below covers when neither is accessible.

### MCP Server

If a Firecrawl MCP server is installed and running, the agent will have direct access to tools like `firecrawl_scrape`, `firecrawl_search`, `firecrawl_map`, and `firecrawl_crawl`.

- Start the server: `npx -y firecrawl-mcp` (requires `FIRECRAWL_API_KEY` in environment).
- Configure in your agent’s MCP settings:
  ```json
  "firecrawl": {
    "command": "npx",
    "args": ["-y", "firecrawl-mcp"],
    "env": { "FIRECRAWL_API_KEY": "fc-..." }
  }
  ```
- Then simply call the MCP tools with natural language prompts.

### Hosted API (Direct)

For environments with direct HTTP access and an API key:

1. **Set the key:**
   ```bash
   export FIRECRAWL_API_KEY=fc-your-key-here
   ```
2. **Basic scrape:**
   ```bash
   curl -X POST https://api.firecrawl.dev/v1/scrape \
     -H 'Content-Type: application/json' \
     -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
     -d '{"url":"https://example.com","formats":["markdown"]}'
   ```

## Setup

- **Get an API key** from [firecrawl.dev](https://firecrawl.dev) (free tier available).
- **Install SDK** (optional, for fallback):
  - Node.js: `npm install @mendable/firecrawl-js`
  - Python: `pip install firecrawl-py`
- **Install CLI/Skills** (optional):
  ```bash
  npx -y firecrawl-cli@latest init --all --browser
  ```
  This adds OAuth-based auth and prebuilt skills.

## Common Workflows

### Scrape a Single URL
**MCP:** “Scrape https://example.com and return markdown.”
**API:**
```python
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])
result = app.scrape_url("https://example.com", params={"formats": ["markdown"]})
```

### Search the Web
**MCP:** “Search for ‘top AI frameworks 2024’ and return top 3 results.”
**API:**
```python
results = app.search("top AI frameworks 2024", params={"limit": 3})
```

### Interact with Dynamic Content
For pages requiring clicks, form fills, or waits:
**MCP:** Use `firecrawl_interact` tool with actions array.
**API:**
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url":"https://example.com/search",
    "actions":[
      {"type":"fill","selector":"#q","value":"firecrawl"},
      {"type":"click","selector":"#search"},
      {"type":"wait","milliseconds":2000}
    ]
  }'
```

### Crawl a Site
**MCP:** Provide a URL and optional limit. The tool returns structured data for all discovered pages.
**API:** Use `crawl_url` endpoint or `app.crawl_url()` with a `maxPages` limit.

## Error Handling & Rate Limits

- 429 → back off or check plan limits.
- 401/403 → check `FIRECRAWL_API_KEY` and permissions.
- Timeouts → use `wait` actions or increase `waitFor` parameter.

## Fallback (No MCP or API Client Configured)

If MCP tools are unavailable and no SDK is installed, the agent can still use Firecrawl via **direct HTTP calls** with `curl` or `fetch`, provided the `FIRECRAWL_API_KEY` environment variable is set. Example fallback for a basic scrape:

```bash
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"https://example.com","formats":["markdown"]}'
```

If the key is not set, guide the user to obtain one at firecrawl.dev and export it.
