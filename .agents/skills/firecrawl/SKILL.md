# Firecrawl Skill

**Runtime adapter** for Firecrawl web data extraction API.

## When to Use This Skill

- Extract clean markdown/HTML from any URL.
- Search the web and scrape top results.
- Interact with dynamic pages (fill forms, click buttons, wait for content).
- Crawl multiple pages or entire websites.
- Convert docs, PDFs, or images to text/markdown.

## Setup

### 1. Install Dependencies & Configure Runtime

**MCP (Preferred)**
Install the Firecrawl MCP server with browser auth flow:

```bash
npx -y firecrawl-cli@latest init --all --browser
```

This installs CLI skills, builds the MCP server, and registers tools like `firecrawl_scrape`, `firecrawl_search`, `firecrawl_interact`. Ensure the MCP server is running (configured in your agent’s MCP settings).

**API Key**
Set your Firecrawl API key environment variable:

```bash
export FIRECRAWL_API_KEY=fc-xxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Verify

If MCP is available, the agent should discover and use its tools automatically.  
Otherwise, fall back to direct API calls using cURL or the official SDKs.

## Primary Runtime: MCP Server Tools

When a Firecrawl MCP server is connected, use the provided tools:

- `firecrawl_scrape` – scrape a single URL.
- `firecrawl_search` – search the web.
- `firecrawl_interact` – perform actions on a page (fill, click, wait).
- `firecrawl_crawl` – crawl multiple pages.

Example usage: Provide the tool with parameters matching the API schema. For instance:

```json
{
  "tool": "firecrawl_scrape",
  "parameters": {
    "url": "https://example.com",
    "formats": ["markdown"]
  }
}
```

The MCP tools handle authentication automatically using the `FIRECRAWL_API_KEY` from the environment.

## Fallback: Direct API Calls

If no MCP server is connected, use the REST API directly.

### Using cURL

**Scrape a page**
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```

**Search**
```bash
curl -X POST https://api.firecrawl.dev/v1/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"query": "latest AI agents", "limit": 5}'
```

**Interact**
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
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

### Using SDKs (Node.js / Python)

Install the SDK: `npm install @mendable/firecrawl-js` or `pip install firecrawl-py`.

**Python example (search + scrape)**
```python
import os
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
results = app.search("recent news about climate change", params={"limit": 3})
for item in results.get("data", []):
    content = app.scrape_url(item["url"], params={"formats": ["markdown"]})
    print(content.get("markdown")[:200])
```

## Common Workflows

### 1. Retrieve Clean Content from a URL

Use `scrape` (MCP tool or API) with `formats: ["markdown"]`.  
For structured extraction, pass an `extract` schema.

### 2. Research a Topic

Search first, then scrape the top URLs:
- MCP: `firecrawl_search` → for each result, `firecrawl_scrape`.
- Fallback: `/v1/search` endpoint → `/v1/scrape`.

### 3. Automate a Web Task (form submission, dynamic content)

Use `interact` tool/endpoint to simulate user actions. Provide a list of `actions`.

### 4. Crawl a Documentation Site

Use `crawl` with `maxDepth` and `limit` to collect all pages. Convert to markdown.

## Notes

- Always set `FIRECRAWL_API_KEY` as environment variable.
- MCP approach is preferred for agents with MCP integration; it simplifies auth and tool discovery.
- When falling back to API, handle rate limits and API errors gracefully; check response status codes.
- The Firecrawl CLI (`npx firecrawl-cli`) can also build local “skills” but those are separate from the Codex skill.
