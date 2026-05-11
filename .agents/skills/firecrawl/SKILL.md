# Firecrawl Skill

Firecrawl is a web scraping and crawling API that delivers clean, structured content from any website. This skill helps an AI coding agent work with Firecrawl effectively, whether through an MCP server, the official SDKs, or a CLI-based fallback.

## Prerequisites

- **API Key**: Required for all operations. Get one at [firecrawl.dev](https://firecrawl.dev) or use the CLI onboarding flow:
  ```bash
  npx -y firecrawl-cli@latest init --all --browser
  ```
  The CLI will guide you through browser authentication and store the key locally.

- **Environment variable**: Set `FIRECRAWL_API_KEY` to your key. If you used the CLI flow, it will be configured automatically.

## Primary Runtime: MCP Server (Preferred)

If `firecrawl-mcp` is installed and configured, prefer using its tools directly. It exposes `scrape_url`, `crawl_url`, `search`, and `extract` with all Firecrawl capabilities.

**Typical configuration (for Claude Desktop, Codex, etc.)**
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-your-key"
      }
    }
  }
}
```

When available, call the MCP tools with parameters like `url`, `formats` (markdown, html, etc.), `limit`, `includePaths`, etc. Check the tool schemas for details.

## Primary Runtime: Firecrawl API (SDK)

If MCP is not available but the API key is present, use the official SDK.

**Install**
- Node.js: `npm install @mendable/firecrawl-js`
- Python: `pip install firecrawl-py`

**Initialize**
- JavaScript/TypeScript:
  ```js
  import FirecrawlApp from '@mendable/firecrawl-js';
  const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  ```
- Python:
  ```python
  from firecrawl import FirecrawlApp
  app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
  ```

## Common Operations

### Scrape a single URL
- **SDK (JS)**
  ```js
  const result = await app.scrapeUrl('https://example.com', { formats: ['markdown', 'html'] });
  ```
- **SDK (Python)**
  ```python
  result = app.scrape_url('https://example.com', params={'formats': ['markdown', 'html']})
  ```
- **MCP**: invoke `scrape_url` with `{"url": "...", "formats": ["markdown"]}`.

### Crawl a website
- **SDK (JS)**
  ```js
  const crawl = await app.crawlUrl('https://docs.example.com', {
    limit: 50,
    excludePaths: ['/blog/*'],
    scrapeOptions: { formats: ['markdown'] }
  });
  ```
- **MCP**: `crawl_url` with appropriate parameters.

### Search the web
- **SDK (JS)**
  ```js
  const result = await app.search('latest AI news', { limit: 5 });
  ```
- **MCP**: `search` with `{"query": "...", "limit": 5}`.

### Structured data extraction
- **SDK (JS)**
  ```js
  const result = await app.extract(['https://example.com'], {
    prompt: "Extract the product name and price as JSON",
    schema: { type: "object", properties: { name: { type: "string" }, price: { type: "string" } } }
  });
  ```
- **MCP**: `extract` with `urls`, `prompt`, and optional `schema`.

## Fallback: No API Key / No MCP

If the user hasn't provided `FIRECRAWL_API_KEY` and no MCP server is detected:

1. **Prompt the user** to obtain a key. Offer the automated CLI flow:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```
   This installs the CLI, builds skills, and authenticates via browser. After completion, the key is set in the environment.

2. For manual setup: direct the user to [firecrawl.dev](https://firecrawl.dev) to sign up and get a key. Then instruct them to set `FIRECRAWL_API_KEY`.

3. Once the key is available, the agent can use the SDK directly (as shown above) or configure the MCP server and restart.

## Notes

- Firecrawl has a free tier with limitations. Check [pricing](https://firecrawl.dev/pricing).
- For full API documentation, see [docs.firecrawl.dev](https://docs.firecrawl.dev).
- The CLI `init --all` command also installs agent skills that provide deeper integration with various AI coding agents.
- Always respect `robots.txt` and website terms of service when using Firecrawl.