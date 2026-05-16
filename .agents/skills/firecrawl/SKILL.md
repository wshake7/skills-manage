# Firecrawl Skill

Firecrawl is a web scraping and crawling API that turns websites into clean, LLM-ready markdown or structured data. It handles dynamic content, browser interactions, search, and extraction.

## When the Runtime Is Available (MCP or API)

Prefer the installed MCP server or direct API calls when `FIRECRAWL_API_KEY` is set and the corresponding tooling is present.

- **MCP mode:** If an MCP server (e.g., `mcp-server-firecrawl`) is connected, use the provided tools (`firecrawl_scrape`, `firecrawl_search`, `firecrawl_interact`, etc.) directly.
- **Direct API:** If only the API key is set, use HTTP requests to `https://api.firecrawl.dev/v1/...` with the `Authorization: Bearer $FIRECRAWL_API_KEY` header.

### Typical Workflow (API Example)

1.  **Scrape a single URL:**
    ```bash
    curl -s -X POST https://api.firecrawl.dev/v1/scrape \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
      -d '{"url": "https://example.com", "formats": ["markdown"]}'
    ```

2.  **Search and then scrape results:**
    ```python
    # Python with firecrawl-py (if available locally)
    from firecrawl import FirecrawlApp
    import os

    app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])

    results = app.search("latest AI agent frameworks 2024", params={"limit": 3})
    for r in results.get("data", []):
        content = app.scrape_url(r["url"], params={"formats": ["markdown"]})
        print(f"Scraped {r['url']}: {len(content.get('markdown', ''))} chars")
    ```

3.  **Interact with a dynamic page:**
    Use the `/interact` endpoint to perform actions like filling forms, clicking, and waiting before scraping.

## When the Runtime Is Not Available

If `FIRECRAWL_API_KEY` is missing or no MCP/API tool access is detected, fall back to guiding the user through setup and providing runnable code snippets they can execute themselves.

### User Setup Steps

1.  **Get an API key:** Sign up at [firecrawl.dev](https://firecrawl.dev) and obtain a key.
2.  **Set environment variable:** Add `FIRECRAWL_API_KEY=fc-...` to `.env` or system environment.
3.  **Install an SDK (optional):**
    - Node.js: `npm install @mendable/firecrawl-js`
    - Python: `pip install firecrawl-py`
4.  **For CLI usage:** Run `npx firecrawl-cli@latest init --all --browser` (requires browser auth).

### Fallback Code Snippets

Provide the user with code that they can copy, paste, and run after completing the setup.

#### Node.js Example

```javascript
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape a page
const scrapeResult = await app.scrapeUrl('https://example.com', {
  formats: ['markdown'],
});
console.log(scrapeResult.markdown);

// Search and scrape
const searchResult = await app.search('AI news', { limit: 2 });
for (const item of searchResult.data) {
  const page = await app.scrapeUrl(item.url, { formats: ['markdown'] });
  console.log(page.markdown.substring(0, 200));
}
```

#### Python Example

```python
import os
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])

# Scrape
scrape_result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
print(scrape_result.get('markdown', ''))

# Crawl (multiple pages)
crawl_result = app.crawl_url('https://example.com', {
    'crawlerOptions': {'limit': 5}
})
for page in crawl_result:
    print(page['markdown'][:100])
```

### Best Practices

- Always set `formats` to `['markdown']` unless you need raw HTML or screenshots.
- Use `robots: true` (default) to respect websites' crawl rules.
- For dynamic content, use `/interact` with explicit actions rather than relying on `wait_for` alone.
- Rate limits: 10 requests/minute on free tier; batch throttle accordingly.

This skill empowers the agent to either directly use a configured Firecrawl runtime or coach the user into working effectively with the API/SDK when no runtime is present.