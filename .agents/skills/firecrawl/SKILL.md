# Firecrawl Runtime Adapter

Use this skill when you need to scrape, crawl, extract structured data, or interact with web pages using Firecrawl. It guides the AI agent to the correct runtime (MCP server or direct API) and provides fallback instructions when credentials are missing.

## Preferred Runtime

Firecrawl is available as an MCP server or via HTTP/REST API. Set the environment variable `FIRECRAWL_API_KEY` to enable both.

- **MCP server**: Install via `npx -y firecrawl-cli@latest init --all --browser`. This sets up the CLI, MCP skills, and authenticates via browser. The MCP tools are then available in the agent's toolbox.
- **HTTP API**: Use the SDK (`@mendable/firecrawl-js` for Node.js, `firecrawl-py` for Python) or direct `curl` calls.

### Quick SDK Setup

```bash
npm install @mendable/firecrawl-js  # or pip install firecrawl-py
echo "FIRECRAWL_API_KEY=fc-your-key" >> .env
```

```javascript
import FirecrawlApp from '@mendable/firecrawl-js';
import 'dotenv/config';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(result.markdown);
```

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-your-key")
result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
print(result['markdown'])
```

### HTTP API Example

```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown"]
  }'
```

## Core Workflows

- **Scrape a single URL**: Use `scrapeUrl/ scrape` with `formats: ['markdown']` for clean text. Add `actions` for dynamic content.
- **Interact with pages**: Use `/v1/interact` or SDK `scrapeUrl` with `actions` array (e.g., fill, click, wait).
- **Crawl a site**: Use `crawlUrl/ crawl` with `includePaths`, `excludePaths`, `maxDepth`, `limit`. Returns all pages discovered.
- **Extract structured data**: Use `extract` with a `prompt` or `schema` to get JSON from any page.
- **Map URLs**: `mapUrl/ map` generates a sitemap-like list of URLs from a domain.
- **Search**: `webSearch/ web_search` lets you query the web and get structured results (requires PRO plan).

Always specify `formats: ['markdown']` when you need AI‑friendly content.

## Fallback When No API Key

If `FIRECRAWL_API_KEY` is not set, the agent cannot make live calls. Use these fallback strategies:

1. **Onboarding skill**: Guide the user to run the `firecrawl-build-onboarding` skill, which includes a browser‑based authentication flow.
2. **CLI authentication**: Run `npx -y firecrawl-cli@latest init --browser`. This opens a browser to log in and returns an API key.
3. **Code generation only**: Output a complete code snippet that the user can run after setting their key, clearly marking the placeholder.

The agent should never expose or request the user's API key. When the key is missing, output setup instructions and then produce ready‑to‑use code marked with `YOUR_API_KEY`.

## Error Handling

- **401 Unauthorized**: API key missing or invalid. Redirect to fallback.
- **429 Too Many Requests**: Respect rate limits. Retry with exponential backoff.
- **Timeouts**: Use `waitFor` or increase server‑side timeout with the `timeout` parameter.

## Related Resources

- Firecrawl Skills (including onboarding and build helpers): [firecrawl/skills](https://github.com/firecrawl/skills)
- API Reference & live docs: [Context7](https://context7.com/firecrawl/skills/llms.txt)
- MCP server docs: Refer to the installed MCP context or run `firecrawl-cli` for help.

## Best Practices

- Prefer the MCP runtime when available; it requires no extra code imports.
- For extraction tasks, always include an explicit `prompt` or JSON `schema`.
- When crawling, narrow the scope with `includePaths` to avoid huge jobs.
- Cache results during a session to avoid repeated fetches of the same URL.