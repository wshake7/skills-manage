# Firecrawl Skill

Web scraping, crawling, and interaction via Firecrawl's MCP server, CLI, or hosted API.

## Setup

1. **Install SDK** (if using API directly):  
   ```bash
   npm install @mendable/firecrawl-js     # Node.js
   # or
   pip install firecrawl-py              # Python
   ```
2. **Set API key** in `.env` or environment:
   ```bash
   export FIRECRAWL_API_KEY=fc-your-key
   ```
   (Get your key at [firecrawl.dev](https://firecrawl.dev))

3. **Optional – install CLI/MCP tools** for advanced local usage:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```

## Runtime Detection

Before executing, check what's available:

- Check for MCP server (`firecrawl-mcp` or `@firecrawl/mcp` server running)
- Check for CLI (`firecrawl` command)
- Check `FIRECRAWL_API_KEY` environment variable

**Priority order:** MCP server → CLI → Hosted API (if key is set).

## Usage with MCP Server

If a Firecrawl MCP server is configured (e.g., via Claude Desktop or your AI tool), use its tools directly:

- **Scrape** – single-page extraction (Markdown, HTML, structured data)
- **Crawl** – multi-page recursive crawl with depth control
- **Map** – discover URLs on a domain
- **Interact** – click, fill, wait on dynamic pages

Example tool calls depend on your MCP client; typical parameters include `url`, `formats`, `options`. Consult the MCP server documentation.

## Usage with CLI

If `firecrawl` CLI is installed, run commands directly:

```bash
# Scrape a page
firecrawl scrape https://example.com --formats markdown

# Crawl a site
firecrawl crawl https://example.com --maxDepth 2

# Interact with a page
firecrawl interact https://example.com/form \
  --actions '[{"type":"fill","selector":"#name","value":"John"},{"type":"click","selector":"#submit"}]'
```

Output is returned as JSON or files; pipe to other tools as needed.

## Fallback: Using Hosted API

When no local runtime is available, use the hosted API with `FIRECRAWL_API_KEY`.

### Scrape

```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```

### Crawl

```bash
curl -X POST https://api.firecrawl.dev/v1/crawl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com",
    "maxDepth": 2,
    "limit": 50,
    "formats": ["markdown"]
  }'
```

### Interact

For pages requiring clicks/forms:

```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com/search",
    "actions": [
      {"type": "fill", "selector": "#search", "value": "firecrawl"},
      {"type": "click", "selector": "#go"},
      {"type": "wait", "milliseconds": 2000}
    ],
    "formats": ["markdown"]
  }'
```

### Using SDKs

**Node.js:**
```js
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape
const scrapeResult = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });

// Crawl
const crawlResult = await app.crawlUrl('https://example.com', { maxDepth: 2, limit: 50 });
```

**Python:**
```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))

# Scrape
result = app.scrape_url('https://example.com', params={'formats': ['markdown']})

# Crawl
crawl_status = app.crawl_url('https://example.com', params={'max_depth': 2, 'limit': 50})
```

## Troubleshooting

- **API key missing**: Ensure `FIRECRAWL_API_KEY` is set in the environment or `.env` file.
- **Rate limits**: Hosted API has rate limits; for heavy usage consider local MCP/CLI.
- **Dynamic pages**: Use `/interact` or the `interact` command for pages that need JavaScript rendering.
- **CLI not found**: Run `npx firecrawl-cli@latest` or install globally with `@firecrawl/cli`.

## Additional Notes

If pre-installed Firecrawl Codex skills exist (e.g., from `npx skills add firecrawl/skills`), those may wrap the MCP or CLI interaction and offer richer integration. Prefer those when available.
