# Firecrawl Skill

Use Firecrawl to scrape, search, and interact with web content. This skill adapts to the available runtime—prefer the MCP server, then direct API with SDK, and finally guide the user to configure credentials.

## Runtime Detection (Adapter)

### 1. Preferred Runtime: MCP (Firecrawl MCP Server)
If a Firecrawl MCP server is available (e.g., `firecrawl-mcp` is connected), use its tools directly. Common tools:
- `firecrawl_scrape`: Extract clean content from a single URL.
- `firecrawl_search`: Perform web searches with structured results.
- `firecrawl_crawl`: Crawl a site for multiple pages.
- `firecrawl_map`: Discover URLs on a site.

Example usage (conceptual MCP call):
```text
<mcp_tool_call>
<tool>firecrawl_scrape</tool>
<args>{"url":"https://example.com"}</args>
</mcp_tool_call>
```

### 2. Alternative Runtime: Direct API with SDK
If MCP is not configured, but the user has set `FIRECRAWL_API_KEY`, use the Firecrawl SDK:

**Node.js**
```ts
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

Key environment variable: `FIRECRAWL_API_KEY` (obtain at https://firecrawl.dev).

### 3. Fallback: No Runtime Configured
When neither MCP nor `FIRECRAWL_API_KEY` is set, the agent must:
1. Prompt the user: *"I need your Firecrawl API key to proceed. Get one at https://firecrawl.dev and set it as `FIRECRAWL_API_KEY` in your environment or `.env` file."*
2. Offer to run the Firecrawl init command to install MCP skills automatically:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```
3. Once the key is provided, use the SDK or restart the agent to connect via MCP.

## Quick Start for Integration
- **Scrape**: `app.scrapeUrl(url, { formats: ['markdown'] })` returns clean text.
- **Search**: `app.search('query')` returns top results.
- **Crawl**: `app.crawlUrl(url, { limit: 10 })` returns paginated extracts.
- **Map**: `app.mapUrl(url)` returns links structure.

## Notes
- This skill focuses on runtime operations. For building agent-integrated apps that call Firecrawl APIs, see the [Firecrawl Skills repository](https://github.com/firecrawl/skills).
- Always prefer the MCP interface when possible—it provides a natural language tool bridge.
- Use the `@mendable/firecrawl-js` or `firecrawl-py` packages for direct API access; they are well-documented for all features.