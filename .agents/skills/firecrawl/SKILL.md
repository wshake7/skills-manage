## Firecrawl

**Purpose:** Enable web scraping, crawling, structured data extraction, and interactive browsing via the Firecrawl API.

**Runtime Adapter:** This skill operates in a runtime-adapter mode. First, check if the Firecrawl MCP server or CLI is installed and the API key is configured. If yes, use those tools directly. Otherwise, fallback to direct HTTP API calls using the `FIRECRAWL_API_KEY` environment variable. If the key is missing, guide the user through setup.

**Capabilities:**
- Scrape a URL (markdown, HTML, structured data)
- Crawl multiple pages with depth and limit
- Search the web
- Interact with pages (click, fill, wait)
- Extract structured data using LLM extraction with a custom schema
- Map a website (list all accessible links)

**Preferred Runtime (MCP/CLI):**
If the `firecrawl` CLI or an MCP connection is available, use them directly.
Examples:
```bash
firecrawl scrape https://example.com
firecrawl crawl https://example.com --maxPages 5
```

**Fallback Runtime (API):**
If no CLI/MCP, use the REST API with `curl` or the official SDK (`@mendable/firecrawl-js` for Node.js, `firecrawl-py` for Python). Ensure `FIRECRAWL_API_KEY` is set. If not set, instruct the user to obtain a key from https://firecrawl.dev and set the variable.

**Quick Setup:**
```bash
npx -y firecrawl-cli@latest init --all --browser
```
This installs the CLI, registers skills, and authenticates via browser. Alternatively, manually set the environment variable after signup.

**Workflow Examples:**
- **Scrape a page**
  ```bash
  curl -X POST https://api.firecrawl.dev/v1/scrape \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com", "formats": ["markdown"]}'
  ```

- **Crawl a site**
  ```bash
  curl -X POST https://api.firecrawl.dev/v1/crawl \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com", "maxPages": 5, "limit": 5}'
  ```

- **Extract structured data (LLM)**
  ```bash
  curl -X POST https://api.firecrawl.dev/v1/scrape \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "url": "https://example.com",
      "formats": ["extract"],
      "extract": {
        "schema": { "title": {"type": "string"}, "description": {"type": "string"} },
        "prompt": "Extract the page title and description"
      }
    }'
  ```

- **Interact with a page**
  ```bash
  curl -X POST https://api.firecrawl.dev/v1/interact \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "url": "https://example.com",
      "actions": [
        {"type": "fill", "selector": "#search", "value": "query"},
        {"type": "click", "selector": "#submit"},
        {"type": "wait", "milliseconds": 2000}
      ],
      "formats": ["markdown"]
    }'
  ```

- **Search the web**
  ```bash
  curl -X POST https://api.firecrawl.dev/v1/search \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"query": "latest AI news", "limit": 3}'
  ```

**Error Handling:**
- 401: Invalid or missing API key → verify `FIRECRAWL_API_KEY`.
- 402: Insufficient credits → upgrade account at firecrawl.dev.
- Network issues → check connectivity.
- If API key is missing and no runtime is available, guide the user: run the quick setup command or manually set the key after signing up at https://firecrawl.dev.

**Fallback Guidance:**
When no runtime is configured, inform the user that Firecrawl requires an API key. Provide the signup link and ask them to set the `FIRECRAWL_API_KEY` environment variable or run `npx -y firecrawl-cli@latest init --all --browser`. Once the key is available, resume the operation.