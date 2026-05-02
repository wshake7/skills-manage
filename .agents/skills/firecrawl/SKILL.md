# Firecrawl

Enable AI coding agents to integrate Firecrawl web scraping, search, and browser interaction APIs into applications.

## Runtime Adapter

This skill uses a runtime-first approach. The preferred runtimes are **MCP** (Firecrawl server) or direct **API** (SDK + API key).

### When a Firecrawl MCP server is available
- Use the provided MCP tools (`scrape`, `search`, `map`, `crawl`, etc.) directly.
- No additional setup is required beyond server connection.

### When only an API key is available
- Use the Firecrawl SDK (`@mendable/firecrawl-js` for Node.js or `firecrawl-py` for Python).
- Ensure the `FIRECRAWL_API_KEY` environment variable is set before calling any API.

### Fallback – runtime not configured
If neither MCP nor a configured API key is detected:
1. Instruct the user to obtain an API key via the [Firecrawl dashboard](https://firecrawl.dev) or use the `firecrawl-build-onboarding` skill for guided setup.
2. Ask the user to install the appropriate SDK:
   ```bash
   npm install @mendable/firecrawl-js   # Node.js
   pip install firecrawl-py             # Python
   ```
3. Guide the user to set the environment variable:
   ```bash
   echo "FIRECRAWL_API_KEY=fc-your-key" >> .env
   ```
4. Once configured, re-run the integration command.

The agent must **not** proceed with Firecrawl actions until the runtime is ready.

## Usage

### Scraping a URL (MCP)
```
Tool: scrape
Parameters: url (required), formats (optional, e.g., ["markdown", "html"])
```

### Scraping via SDK (Node.js example)
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(result.markdown);
```

### Searching the web (MCP)
```
Tool: search
Parameters: query (required), limit (optional), sources (optional)
```

### Crawling multiple pages (MCP)
```
Tool: crawl
Parameters: url, limit, allowBackwardLinks, scrapeOptions
```

### Mapping a site (MCP)
```
Tool: map
Parameters: url, search, sitemap (optional)
```

## Choosing the Right Method
- **Static content**: Use `scrape` with `formats: ['markdown']`.
- **JavaScript-rendered pages**: Set `formats: ['markdown']` and enable `actions` or use a browser interaction.
- **Discovery and research**: Use `search` to find pages, then `scrape` or `map` as needed.
- **URL listing**: Use `map` to extract all links from a domain.

## Notes
- This skill is intended for **building integrations** into a project, not for one-off web research.
- For ad-hoc crawling or terminal commands, use the Firecrawl CLI skills.
- Always confirm the user has set `FIRECRAWL_API_KEY` before making API calls.
- If the user does not have an API key, direct them to the onboarding skill or the web dashboard.