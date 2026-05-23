# Firecrawl Runtime Adapter

This skill enables AI coding agents to use Firecrawl for web scraping, searching, and crawling. It prefers the MCP (Model Context Protocol) server or direct API access; when neither is configured, it falls back to guiding the user through setup.

## Runtime Detection

Check these in order:

1. **MCP Server** – If a Firecrawl MCP server is running (e.g., `firecrawl-mcp` tool available), use it exclusively.
2. **API Key** – If `FIRECRAWL_API_KEY` environment variable is set and a Firecrawl SDK is installed (`@mendable/firecrawl-js` or `firecrawl-py`), use the SDK.
3. **No Runtime** – None of the above → fallback to setup instructions.

## Preferred Workflow (MCP or API)

### Using MCP (If Available)

- Call the MCP tool `firecrawl_scrape` (or `firecrawl_search`, `firecrawl_crawl`) with appropriate parameters.
- Example: scrape a URL in markdown
  ```json
  {
    "tool": "firecrawl_scrape",
    "arguments": {
      "url": "https://example.com",
      "formats": ["markdown"]
    }
  }
  ```
- Parse the returned content.

### Using the API Directly (If API Key Set)

- **JavaScript**
  ```javascript
  import FirecrawlApp from '@mendable/firecrawl-js';
  const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
  console.log(result.markdown);
  ```

- **Python**
  ```python
  from firecrawl import FirecrawlApp
  app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])
  result = app.scrape_url("https://example.com", {"formats": ["markdown"]})
  print(result["markdown"])
  ```

**Common operations:**
- **Scrape single page:** `scrapeUrl(url, options)`
- **Search the web:** `search(query, options)`  
- **Crawl multiple pages:** `crawlUrl(url, options)` then monitor status.

## Fallback: No Runtime Configured

When no MCP server or API key is available, assist the user with one-off setup:

1. Recommend installing Firecrawl CLI for a complete environment:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```
   This sets up CLI, skills, and API key authentication via browser.

2. **Minimal installation** (if user only wants SDK):
   ```bash
   npm install @mendable/firecrawl-js      # or pip install firecrawl-py
   ```
   Then set the key:
   ```bash
   export FIRECRAWL_API_KEY=fc-your-key   # get from https://firecrawl.dev
   ```

3. After setup, re-run the agent’s request. If the environment variable is now present, use the API path.

## Workflow Guidance

- **When asked to extract data from a URL:**
  - If MCP available, call `firecrawl_scrape` with the URL and `formats: ["markdown"]`.
  - Else if API key set, use SDK `scrapeUrl`.
  - Else tell user to set up `FIRECRAWL_API_KEY`.

- **When asked to search the web:**
  - Use `firecrawl_search` (MCP) or `app.search(query)` (SDK).
  - Provide the search results (usually a list of items with title, url, snippet).

- **When asked to crawl a site:**
  - Initiate a crawl via `firecrawl_crawl` (MCP) or `app.crawlUrl(url)` (SDK).
  - Poll the job status if necessary; SDK methods return a job ID.

## Additional Notes

- Firecrawl supports structured extraction (JSON with schema) and screenshots – add `formats: ["extract", "screenshot"]` if needed.
- Always respect `robots.txt` and website terms of service.
- For large crawls, be mindful of API credits and rate limits.
