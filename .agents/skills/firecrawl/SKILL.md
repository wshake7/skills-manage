# Firecrawl

Firecrawl extracts clean, structured content from any website. This skill helps you scrape, search, and interact with web pages using Firecrawl’s API or, when available, its MCP tools.

---

## Setup

Set your Firecrawl API key. The skill will use this for direct API calls and may require it for MCP authentication.

```bash
export FIRECRAWL_API_KEY="fc-your-key"
```

### Install client SDKs (optional, for fallback scripts)

```bash
# Node.js
npm install @mendable/firecrawl-js

# Python
pip install firecrawl-py
```

For advanced crawling or local execution, install the Firecrawl CLI:
```bash
npx -y firecrawl-cli@latest init --all --browser
```

---

## Runtime Selection

### 1. Preferred: MCP (Firecrawl MCP server)

If a Firecrawl MCP server is connected and provides `firecrawl_scrape` / `firecrawl_search` tools, use those directly. They are the most reliable and fastest method.

**Examples**
- **Scrape a single page**  
  Call `firecrawl_scrape` with `url` and `formats: ["markdown"]`.
- **Search and scrape**  
  Call `firecrawl_search` with `query` and `limit`, then iterate results with `firecrawl_scrape`.
- **Interact with dynamic pages**  
  Use `firecrawl_interact` with `url` and `actions` (click, fill, wait).

When MCP tools are present, **do not fall back to API** unless the MCP call fails with an unrecoverable error.

### 2. Fallback: Direct API (REST / SDK)

When no MCP server is available, use the Firecrawl REST API with your `FIRECRAWL_API_KEY` environment variable.

#### Smoke test
```bash
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","formats":["markdown"]}'
```

#### Scrape (Node.js)
```javascript
const app = new FirecrawlApp();  // reads FIRECRAWL_API_KEY from env
const { markdown } = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
```

#### Research workflow (Python)
```python
from firecrawl import FirecrawlApp
import os

app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))

results = app.search("latest AI frameworks", params={"limit": 3})
for item in results.get("data", []):
    page = app.scrape_url(item["url"], params={"formats": ["markdown"]})
    print(f"Scraped {item['url']}: {len(page.get('markdown', ''))} chars")
```

#### Dynamic content (interact)
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/search",
    "actions": [
      {"type": "fill", "selector": "#q", "value": "firecrawl"},
      {"type": "click", "selector": "button[type=submit]"},
      {"type": "wait", "milliseconds": 1500}
    ],
    "formats": ["markdown"]
  }'
```

---

## Common Options

- `formats`: `["markdown"]` is usually sufficient; add `"html"` or `"screenshot"` if needed.  
- `actions`: for `/interact` – array of `{type, selector? value? milliseconds?}`.  
- `waitFor`: milliseconds to wait after page load.  
- `limit`: integer for search results.

---

## Error Handling

- **401 Unauthorized** – `FIRECRAWL_API_KEY` is missing or invalid. Remind the user to set it.  
- **Rate limiting** – implement exponential backoff.  
- **MCP tool not found** – fall back to API with the same parameters.  
- **Content blocked** – page may require JavaScript; try `/interact` with `wait` actions.
