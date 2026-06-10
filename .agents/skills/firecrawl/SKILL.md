# Firecrawl Skill

Firecrawl provides APIs and tools to scrape, crawl, search, and extract structured data from websites, delivering clean markdown or JSON for AI pipelines.

## Runtime Adapter

This skill implements a runtime-adaptive approach, preferring local MCP tools when available, falling back to CLI, and finally the API/SDK with an API key.

### Check runtime availability

1. **MCP Tools**: If the environment has `mcp__firecrawl_*` tools (e.g., `mcp__firecrawl_scrape`), use them directly. These are provided by a Firecrawl MCP server (e.g., `@anthropic/firecrawl-mcp`).
2. **Firecrawl CLI**: If `npx firecrawl-cli` is installed, use shell commands.
3. **API / SDK**: Otherwise, use the Firecrawl API via Node.js or Python SDK. Requires `FIRECRAWL_API_KEY` environment variable.

### Setup (API/SDK path)

When MCP or CLI are not available, set up the SDK:

```bash
# Node.js
npm install @mendable/firecrawl-js
# Python
pip install firecrawl-py

# Set your API key (get one at https://firecrawl.dev)
export FIRECRAWL_API_KEY=fc-your-key
```

Verify the key works with a smoke test:

```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```

## Usage Patterns

### 1. Scrape a single URL

- **MCP**: `mcp__firecrawl_scrape` tool call with `url` and `formats: ["markdown"]`
- **CLI**: `npx firecrawl-cli scrape <url> --format markdown`
- **SDK** (Node.js example):
  ```javascript
  import FirecrawlApp from '@mendable/firecrawl-js';
  const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const { markdown } = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
  ```
- **SDK** (Python):
  ```python
  from firecrawl import FirecrawlApp
  app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
  result = app.scrape_url('https://example.com', params={"formats": ["markdown"]})
  ```

### 2. Search and then scrape

Use `search` to find relevant URLs, then scrape selected ones.

- **MCP**: Use `mcp__firecrawl_search` then scrape each URL.
- **CLI**: `npx firecrawl-cli search "query"` then scrape.
- **SDK** (Python):
  ```python
  search_results = app.search("AI agent frameworks 2024", params={"limit": 3})
  for item in search_results.get("data", []):
      page = app.scrape_url(item["url"], params={"formats": ["markdown"]})
      # process page
  ```

### 3. Crawl a website

Crawl multiple pages with depth control.

- **MCP**: `mcp__firecrawl_crawl`
- **CLI**: `npx firecrawl-cli crawl <start_url> --depth 2`
- **SDK**:
  ```javascript
  const crawl = await app.crawlUrl('https://docs.example.com', { maxDepth: 2 });
  ```

### 4. Extract structured data

Use the `extract` endpoint to get structured JSON from a page or crawler result.

- **MCP**: `mcp__firecrawl_extract`
- **SDK**:
  ```python
  extracted = app.extract({'url': '...', 'schema': {...}})
  ```

## Environment & Credentials

- Required: `FIRECRAWL_API_KEY` (api.firecrawl.dev).
- For MCP, ensure the server is configured (often via Claude Desktop or similar).
- For CLI, ensure Node.js is installed so `npx` can run `firecrawl-cli`.

## References

- [Firecrawl Docs](https://docs.firecrawl.dev)
- [Context7 Firecrawl Skills Library](https://context7.com/firecrawl/skills)
- [GitHub Repository](https://github.com/firecrawl/firecrawl)
