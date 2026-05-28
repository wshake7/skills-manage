# Firecrawl

Turn websites into LLM-ready data. Extract clean markdown, crawl sites, or interact with dynamic pages using Firecrawl's powerful web scraping API.

## Preferred Runtime

The agent should first attempt to use a **Firecrawl MCP server** or **local skills** (installed via `firecrawl-cli`). If those are not available, fall back to direct HTTP calls using the Firecrawl API and the `FIRECRAWL_API_KEY` environment variable.

## Runtime Setup

### 1. MCP Server (recommended)
Install the Firecrawl CLI and its MCP server. This will provide native tooling for scrape, crawl, and interact operations.

```bash
npx -y firecrawl-cli@latest init --all --browser
```

Once installed, the agent can discover available tools (e.g., `scrape_url`, `crawl_site`, `interact`) through the MCP protocol.

### 2. Direct API Access
Required when the MCP server is not running. Set your API key:

```bash
export FIRECRAWL_API_KEY="fc-your-key"
```

Optional: install the official SDK for richer language-native workflows:

```bash
npm install @mendable/firecrawl-js  # Node.js
# or
pip install firecrawl-py           # Python
```

## Usage Workflows

### Scrape a Single Page
**MCP**: call the `scrape` tool with a URL and desired `formats` (e.g., `["markdown"]`).

**API fallback** (curl example):
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```

### Crawl a Full Site
**MCP**: call the `crawl` tool with a starting URL and optional parameters like `limit` and `maxDepth`.

**API fallback**:
```bash
curl -X POST https://api.firecrawl.dev/v1/crawl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "maxPages": 10}'
```

### Interact with Dynamic Content
Use when pages require clicking, typing, or waiting for lazy-loading.

**MCP**: use the `interact` tool with an array of actions.

**API fallback**:
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com/search",
    "actions": [
      {"type": "fill", "selector": "#search-input", "value": "firecrawl"},
      {"type": "click", "selector": "#search-button"},
      {"type": "wait", "milliseconds": 2000}
    ],
    "formats": ["markdown"]
  }'
```

## Fallback Behavior

If the MCP runtime is not detected:
1. Check if `FIRECRAWL_API_KEY` is set. If not, instruct the user to create a key at [firecrawl.dev](https://firecrawl.dev) and export it as `FIRECRAWL_API_KEY`.
2. Perform operations using direct REST calls or the SDK, as shown above.

For repetitive tasks, recommend the user install the MCP server for better latency and built-in tool definitions.

## Additional Capabilities

Firecrawl also provides **build skills** (`npx skills add firecrawl/skills`) that embed application‑integration patterns directly into the agent. Use those when building a product that integrates Firecrawl APIs.
