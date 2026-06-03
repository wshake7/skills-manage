# Firecrawl Runtime-Adapter Skill

Firecrawl provides APIs and tools for web scraping, search, content interaction, and data extraction. This skill helps an AI agent work effectively with Firecrawl using the available runtime (MCP or API).

## Preferred Runtime

- **MCP**: If a Firecrawl MCP server is available, use its tools (e.g., `mcp__firecrawl_scrape`, `mcp__firecrawl_search`) for all operations. They offer direct integration without managing raw API calls.
- **API**: When MCP is unavailable, fall back to the Firecrawl REST API using the environment variable `FIRECRAWL_API_KEY`.

## Setup & Configuration

1. **API Key**  
   Obtain an API key from [firecrawl.dev](https://firecrawl.dev) and set it as an environment variable:
   ```bash
   export FIRECRAWL_API_KEY="fc-xxxxxxxxxxxxxxxx"
   ```

2. **SDK Installation (optional)**  
   For JavaScript/TypeScript projects:
   ```bash
   npm install @mendable/firecrawl-js
   ```
   For Python projects:
   ```bash
   pip install firecrawl-py
   ```

3. **MCP Server (optional)**  
   If an MCP-compatible Firecrawl server is configured, the agent will automatically discover its tools. Otherwise, the API fallback is used.

## Workflow Guidance

### 1. Scrape a URL

**MCP (preferred)**
```
Call tool: mcp__firecrawl_scrape
Args: { "url": "https://example.com", "formats": ["markdown"] }
```

**API (fallback)**
- Using `curl`:
  ```bash
  curl -s -X POST https://api.firecrawl.dev/v1/scrape \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -d '{"url": "https://example.com", "formats": ["markdown"]}'
  ```
- Using Node.js SDK:
  ```js
  import FirecrawlApp from '@mendable/firecrawl-js';
  const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
  ```

### 2. Search the Web

**MCP**
```
Call tool: mcp__firecrawl_search
Args: { "query": "latest AI news", "limit": 10 }
```

**API**
```bash
curl -s -X POST https://api.firecrawl.dev/v1/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"query": "latest AI news", "pageOptions": {"limit": 10}}'
```

### 3. Interact with Dynamic Pages

Use the `/interact` endpoint for pages requiring clicks, form fills, or waiting.  
Example:
```bash
curl -s -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com/search",
    "actions": [
      {"type": "fill", "selector": "#q", "value": "firecrawl"},
      {"type": "click", "selector": "#search"},
      {"type": "wait", "milliseconds": 2000}
    ],
    "formats": ["markdown"]
  }'
```

## Fallback Behavior When Not Configured

If neither MCP tools nor `FIRECRAWL_API_KEY` are present:
1. **Prompt the user** to obtain an API key from [firecrawl.dev](https://firecrawl.dev) and set the environment variable.
2. Alternatively, suggest installing the Firecrawl CLI and running the onboarding flow:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```
   This sets up both the CLI and browser authentication, after which the API key will be available.

## Checking Availability

- **MCP**: Check if `mcp__firecrawl_scrape` or similar tools are listed.
- **API**: Verify `process.env.FIRECRAWL_API_KEY` (or equivalent) is set and non‑empty.
- **Fallback order**: MCP → API → Prompt user.

## Additional Resources
- Firecrawl API docs: https://docs.firecrawl.dev
- Firecrawl Skills repository: https://github.com/firecrawl/skills
