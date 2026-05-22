# Firecrawl Skill

## Overview
This skill equips an AI coding agent to use Firecrawl APIs for web scraping, crawling, search, and dynamic browsing. It adapts to available runtimes—MCP server, API key—and falls back to guided setup when none is configured.

## Prerequisites
- **Node.js** (for CLI/JS SDK) or **Python** (for Python SDK) installed.
- `FIRECRAWL_API_KEY` environment variable set (for direct API usage) **or** a running Firecrawl MCP server (for tool-based access).
- If no key is present, the skill will guide the user through obtaining one (via `firecrawl-cli init` or the Firebase console).

## Runtime Detection & Execution Strategy
The agent must check for runtimes in this order and use the best available:

### 1. Firecrawl MCP Server (Preferred)
If an MCP server is running (e.g., via `npx @anthropic/firecrawl-mcp` or a dedicated process), the agent uses MCP tools (`scrape`, `crawl`, `search`, `map`, etc.) directly. No code snippets needed; just invoke the tool.

**Verify MCP availability:**
- Look for `firecrawl` tools in the agent’s toolset.
- If present, use them for all Firecrawl operations.

### 2. Firecrawl API Key (Direct SDK)
When an MCP server is not available but `FIRECRAWL_API_KEY` is set, the agent should:
- Install the Firecrawl SDK for the user’s language (Node.js or Python) if not already present (check `package.json` or `requirements.txt`).
- Use the SDK to perform operations.

**Example (JavaScript):**
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape a URL
const scrapeResult = await app.scrapeUrl('https://example.com', { formats: ['markdown', 'html'] });

// Crawl a site
const crawlJob = await app.crawlUrl('https://example.com', { limit: 5 });
const crawlResult = await app.monitorJob(crawlJob.id);

// Search
const searchResult = await app.search('latest AI news', { limit: 5 });
```

**Example (Python):**
```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key=os.getenv('FIRECRAWL_API_KEY'))

# Scrape
scrape_result = app.scrape_url('https://example.com', params={'formats': ['markdown', 'html']})

# Crawl
crawl_job = app.crawl_url('https://example.com', params={'limit': 5})
crawl_result = app.monitor_job(crawl_job['id'])

# Search
search_result = app.search('latest AI news', params={'limit': 5})
```

### 3. Fallback: Guided Setup
If neither MCP nor API key is present, the agent must help the user set up Firecrawl:

1. **Use the CLI onboarding flow:** Suggest running `npx -y firecrawl-cli@latest init --all --browser` to install the CLI, skills, and authenticate via browser.
2. **Manual API key:** Direct user to the [Firecrawl Dashboard](https://www.firecrawl.dev/app/api-keys) to obtain a key, then set it:
   ```bash
   export FIRECRAWL_API_KEY='fc-your-key'
   ```
3. **MCP setup:** Offer to install an MCP server (e.g., `npx @anthropic/firecrawl-mcp`) and restart the agent session.

Once credentials are set, retry the intended operation automatically.

## Common Workflows
- **Scrape a single page:** Use `scrapeUrl` / `scrape_url` with desired formats (markdown, html, screenshot, etc.).
- **Crawl multiple pages:** Initiate a crawl job, poll/monitor until complete, then process results.
- **Search and extract:** Use `search` to find pages matching a query, then optionally scrape each result.
- **Map a website:** `mapUrl` / `map_url` returns a list of URLs from a domain.
- **Dynamic content:** Enable `actions` (e.g., click, wait, scroll) in the call for JavaScript-heavy pages.

## Error Handling
- If the SDK throws `AuthenticationError`, instruct the user to verify their `FIRECRAWL_API_KEY`.
- For rate limits (HTTP 429), implement exponential backoff in agent logic.
- If an MCP tool fails due to network issues, fall back to direct SDK after confirming the API key is set.

## Environment Variables
| Variable | Required | Purpose |
|----------|----------|---------|
| `FIRECRAWL_API_KEY` | For direct API usage | Authenticates requests to Firecrawl |

## Notes
- Always respect `robots.txt` and website terms of service when scraping.
- Firecrawl provides built‑in proxy rotation and retries; no custom handling needed for basic use.
- Agent should reuse the same `FirecrawlApp` instance across operations for connection reuse.
