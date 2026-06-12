# Firecrawl Skill

## Purpose
Firecrawl provides web scraping, crawling, search, and interaction tools for extracting structured content from websites. Use this skill when tasks require fetching, searching, or crawling web pages, or when interacting with pages that need JavaScript rendering or user actions (click, fill, wait).

## Setup
Before using, you need one of the following runtimes:

- **MCP Server**: Run the Firecrawl MCP server (local or remote). This gives you tools like `firecrawl_scrape`, `firecrawl_search`, `firecrawl_map`, `firecrawl_crawl`, and `firecrawl_interact`. Ensure the server is configured in your Codex environment.
- **API Key**: Set environment variable `FIRECRAWL_API_KEY` with a valid Firecrawl API key. You can then use the SDK or the REST API directly. Get a key from https://firecrawl.dev or via the onboarding skill.

If neither is available, ask the user to set up. They can:
1. Run `npx -y firecrawl-cli@latest init --all --browser` to install CLI, skills, and authenticate via browser to get a key.
2. Or manually create an API key at https://firecrawl.dev and set `FIRECRAWL_API_KEY`.

## Runtime Usage

### MCP Mode (Preferred when server is running)
- `firecrawl_scrape`: scrape a single URL with formats (markdown, html, etc.) and optional `onlyMainContent`, `waitFor`, `actions`.
- `firecrawl_search`: search for websites and news. Returns URLs and metadata.
- `firecrawl_map`: discover links on a domain.
- `firecrawl_crawl`: deep crawl a site with controlled depth, limit, path matching.
- `firecrawl_interact`: interact with a web page (fill forms, click, wait) and return content after actions.

Always use `formats: ["markdown"]` to get clean text, unless HTML is specifically needed. For pages that require JavaScript, use `waitFor` (ms) or `actions` for interactivity.

Example: Scrape a URL for markdown content.
```
tool: firecrawl_scrape
params:
  url: "https://example.com"
  formats: ["markdown"]
  onlyMainContent: true
```

### API Mode (when `FIRECRAWL_API_KEY` is set)
Use the Firecrawl SDK (Python or Node) or raw HTTPS requests.

**Node.js example**: 
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(result.markdown);
```

**Python example**:
```python
from firecrawl import FirecrawlApp
import os
app = FirecrawlApp(api_key=os.environ['FIRECRAWL_API_KEY'])
result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
print(result['markdown'])
```

**Crawl multiple pages**:
```python
crawl_result = app.crawl_url('https://example.com/docs', params={
  'limit': 10,
  'scrapeOptions': {'formats': ['markdown']}
}, idempotency_key='unique-key')
job_id = crawl_result['id']
# Then check status and get results...
```

**Search and then scrape top results** (research workflow):
```python
search = app.search("topic", params={'limit': 3})
for item in search['data']:
    content = app.scrape_url(item['url'], params={'formats': ['markdown']})
    # process content...
```

**Interact with dynamic pages** (API):
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/form", "actions":[{"type":"fill","selector":"#name","value":"AI"},{"type":"click","selector":"#submit"}],"formats":["markdown"]}'
```

## Fallback Behavior (Runtime Not Configured)
If neither MCP nor API key is available, you must:
1. Inform the user that Firecrawl requires setup.
2. Provide setup instructions:
   - **Option A (Recommended)**: Run `npx -y firecrawl-cli@latest init --all --browser` to install tools, authenticate via browser, and get a key automatically.
   - **Option B**: Guide them to sign up at https://firecrawl.dev, get an API key, and set `FIRECRAWL_API_KEY` in the current environment.
3. Once setup is complete, you can proceed with the task using the configured runtime.

Until configured, you cannot fulfill requests that require web extraction. Suggest alternative like manual browsing if possible, but avoid making up data.

## Tips
- For sensitive or gated pages (login-required), use `firecrawl_interact` or the API `/interact` endpoint to perform actions before scraping.
- When crawling large sites, respect `limit` and concurrency to avoid hitting rate limits.
- Prefer `onlyMainContent: true` to reduce noise.
- Always handle possible errors (e.g., 4xx, 5xx) gracefully.