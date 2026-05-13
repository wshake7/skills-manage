# Firecrawl Runtime Skill

Firecrawl converts websites into LLM-ready data (clean markdown, extracted JSON, screenshots).  
This skill helps you use Firecrawl through MCP tools, REST API, or CLI—and establishes a clear fallback when no runtime is configured.

---

## Preferred Runtime: MCP (Model Context Protocol)

If your agent environment already includes a Firecrawl MCP server, use its tools directly:
- `firecrawl_scrape` – extract clean content from a single URL
- `firecrawl_crawl` – crawl multiple pages with depth control
- `firecrawl_map` – discover all links on a site

### Setting up the MCP server

```bash
npx @firecrawl/mcp@latest
```

Add the server to your MCP configuration (e.g., `claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "@firecrawl/mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-your-key"
      }
    }
  }
}
```

If no MCP server is available, proceed to the API fallback.

---

## Fallback Runtime: API (with `FIRECRAWL_API_KEY`)

When MCP tools are absent, fall back to the REST API or SDK.

### 1. Ensure API key is set
get an API key from [firecrawl.dev](https://firecrawl.dev) or run the browser-based auth flow:
```bash
npx -y firecrawl-cli@latest auth --browser
```
Then export it:
```bash
export FIRECRAWL_API_KEY="fc-your-key"
```

### 2. Install SDK (optional but recommended)
```bash
npm install @mendable/firecrawl-js   # Node.js
pip install firecrawl-py            # Python
```

### 3. Direct HTTP requests
Scrape a single page:
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```

Crawl multiple pages:
```bash
curl -X POST https://api.firecrawl.dev/v1/crawl \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "maxDepth": 2, "limit": 10}'
```

Interact with dynamic content:
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://dynamic-site.com/search",
    "actions": [
      {"type": "fill", "selector": "#query", "value": "Hello"},
      {"type": "click", "selector": "#submit"},
      {"type": "wait", "milliseconds": 2000}
    ],
    "formats": ["markdown"]
  }'
```

### 4. SDK usage (Node.js example)
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const scraped = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(scraped.markdown);
```

---

## CLI Runtime (for building Firecrawl skills)

If you need to author or install Firecrawl skills (e.g., for the agent itself), use the CLI:
```bash
npx -y firecrawl-cli@latest init --all --browser
```

---

## Workflow Guidance

1. **Check for MCP availability** – If a Firecrawl MCP server is registered, prefer its tools (they handle authentication and error handling automatically).
2. **Fall back to API** – If no MCP tool is found, check `FIRECRAWL_API_KEY`. If missing, prompt the user to set it using the browser auth flow. Then use direct HTTP calls or the SDK.
3. **Handle errors** – For 402/401, re-prompt for a valid key; for rate limits, add exponential backoff.
4. **Choose the right endpoint**:
   - Single page → `scrape`
   - Full site → `crawl` or `map`
   - Dynamic pages (forms, clicks) → `interact`

---

## Configuration Summary

- **Environment variable**: `FIRECRAWL_API_KEY`
- **Preferred runtime**: MCP (tool-driven), then API
- **Setup**: run `npx firecrawl-cli auth --browser` or visit [firecrawl.dev](https://firecrawl.dev)

Always respect rate limits and website terms of service.