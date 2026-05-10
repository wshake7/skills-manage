# Firecrawl Integration Skill

## Overview
Firecrawl provides web scraping, search, and dynamic interaction APIs. This skill helps AI-powered coding agents integrate Firecrawl into applications that require structured web data extraction, discovery, or browser-based interaction.

## Setup
1. Install the SDK for your language:
   - **Node.js**: `npm install @mendable/firecrawl-js`
   - **Python**: `pip install firecrawl-py`
2. Set your Firecrawl API key as an environment variable:
   ```bash
   echo "FIRECRAWL_API_KEY=fc-your-key" >> .env
   ```
3. (Optional) Enable MCP/local runtime:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```
   This installs the CLI and configures local skills for enhanced agent interaction.

## Preferred Runtimes

### 1. MCP (Model Context Protocol)
- If a Firecrawl MCP server is registered (e.g., `firecrawl-mcp` skill is installed), prefer it. It exposes a clean, agent-friendly interface for scraping, crawling, and searching.
- Check your environment for MCP configuration or ask the user if it’s available. Use MCP’s tool calls to perform tasks.

### 2. Direct API (SDK)
- Fallback when MCP is missing. Use the installed SDK (`@mendable/firecrawl-js` or `firecrawl-py`) with `FIRECRAWL_API_KEY`.
- Example usage (Node.js):
  ```javascript
  const { FirecrawlApp } = require('@mendable/firecrawl-js');
  const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
  ```
- Equivalent Python:
  ```python
  from firecrawl import FirecrawlApp
  app = FirecrawlApp(api_key=os.getenv('FIRECRAWL_API_KEY'))
  result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
  ```

## Fallback Behavior
When neither MCP runtime nor `FIRECRAWL_API_KEY` is detected:
- Notify the user that Firecrawl integration requires an API key.
- Guide them to obtain a key at [firecrawl.dev](https://firecrawl.dev) and add it to their environment.
- Offer to create a `.env` file with the key placeholder.
- For one-off ad‑hoc scraping, suggest using the Firecrawl CLI directly (if installed) or visiting the web interface.

## Choosing the Right Endpoint
- `scrapeUrl` / `scrape_url` – Fast extraction from a single static or lightly dynamic page. Ideal for content reading.
- `crawlUrl` – Recursively follow links from a start URL. Best for bulk extraction.
- `search` – Perform a web search and retrieve structured results with optional discovery.
- `interact` / `browser` – Use browser automation to interact with complex, JS‑heavy pages (e.g., fill forms, click).
- `map` – Discover URLs from a domain.

Always prefer `markdown` output format for LLM consumption.

## Additional Resources
- [Firecrawl Skills Repository](https://github.com/firecrawl/skills) – Agent‑oriented integration patterns and examples.
- [Firecrawl API Docs](https://docs.firecrawl.dev) – Full reference and rate limits.
- [MCP Server Docs](https://github.com/firecrawl/firecrawl-mcp-server) (if available) – Setup instructions for MCP integration.

## Best Practices
- Respect rate limits stated in the API documentation.
- Handle 4xx/5xx errors gracefully, implementing retries with exponential backoff where appropriate.
- Validate the `FIRECRAWL_API_KEY` presence early and provide clear setup prompts.