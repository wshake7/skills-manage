# Firecrawl Skill

Use Firecrawl to scrape, crawl, search, or map websites and extract structured data. The skill adapts to available local runtimes.

## Prerequisites

- **Firecrawl API Key**: Obtain from [firecrawl.dev](https://firecrawl.dev) and set as `FIRECRAWL_API_KEY` environment variable.

## Runtime Detection

1. **Connected MCP Server**: If a Firecrawl MCP server (e.g., `firecrawl`) is connected in your coding environment, prefer its tools.
2. **API Key Available**: If no MCP server but `FIRECRAWL_API_KEY` is set, use direct API calls.
3. **Nothing Set Up**: Prompt the user to install and configure Firecrawl; see [Setup](#setup) below.

## Using the Firecrawl MCP Server (Recommended)

When the MCP server is active, use the following tools:

- `scrape_url` – scrape a single URL with options (format: markdown, html, etc.)
- `crawl_website` – crawl multiple pages starting from a URL
- `search_web` – search the web for information
- `map_website` – get a sitemap of a site
- `extract_data` – extract structured data using LLM schemas

**Tip**: Provide URLs as strings; for scraping, ask for `markdown` format unless raw HTML is needed.

## Fallback: Direct API

If only the API key is present, use `curl` or an SDK.

### Curl

```bash
# Scrape
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'

# Search
curl -X POST https://api.firecrawl.dev/v1/search \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"query": "latest news", "limit": 5}'
```

### SDK

Install one of:

```bash
npm install @mendable/firecrawl-js   # Node.js
pip install firecrawl-py              # Python
```

Then use accordingly:

**Node.js**

```javascript
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
```

**Python**

```python
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.environ['FIRECRAWL_API_KEY'])
result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
```

## Setup

If Firecrawl is not configured, guide the user to run:

```bash
npx -y firecrawl-cli@latest init --all --browser
```

This installs the CLI, MCP skills, and starts browser authentication to set `FIRECRAWL_API_KEY`. Alternatively, the user can manually add the API key to their environment.

## Common Workflows

- **Scrape a page for content**: Use `scrape` with `markdown` format.
- **Extract structured data**: Use `extract` with a prompt or schema.
- **Research via web search**: Use `search` with a query string.
- **Comprehensive site analysis**: Use `crawl` to collect all pages, then optionally `map` for structure.

## Troubleshooting

- **401 Unauthorized**: Check API key; re-run `npx firecrawl-cli init` or verify the env variable.
- **No MCP server found**: Fall back to direct API using the key or install MCP via the init command.
- **Rate limits**: Firecrawl free tier has limits; consider upgrading plan.