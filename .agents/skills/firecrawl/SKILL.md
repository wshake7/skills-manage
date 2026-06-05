# Firecrawl Runtime‑Adapter Skill

This skill lets an AI coding agent work with Firecrawl to scrape, search, and interact with web pages. It follows the **runtime‑adapter pattern**: prefere a local MCP/API runtime when available, then fall back to the Firecrawl REST API.

## Pre‑flight Check: MCP Server or Skill Tools

- If the environment provides **Firecrawl MCP tools** (e.g., tools named `scrape_url`, `search`, `interact`), use them directly. They are preferred over raw API calls.
- Often these tools are made available by installing the [Firecrawl skills](https://github.com/firecrawl/skills) package or running a local Firecrawl MCP server.

**Fallback behaviour** – when MCP tools are not available, use the Firecrawl API with the `FIRECRAWL_API_KEY` environment variable. This skill provides concrete workflow examples for both paths.

## API Key Setup (required for API fallback)

1. **Obtain an API key** from [firecrawl.dev](https://firecrawl.dev).
2. **Set it as an env variable**:
   ```bash
   export FIRECRAWL_API_KEY=fc-your-key
   ```
   Or add `FIRECRAWL_API_KEY=fc-your-key` to a `.env` file and load it in your project.

> **No key yet?** Run the built‑in onboarding browser flow:
> ```bash
> npx -y firecrawl-cli@latest init --all --browser
> ```
> This installs the CLI, skills, and opens a browser for quick authorization (does not require a pre‑existing key).

## Using MCP Tools (Preferred)

When Firecrawl MCP tools are present, describe the desired action in natural language. The underlying tools accept parameters like:
- `url` – the target URL
- `formats` – desired output formats (`markdown`, `html`, `screenshot`, etc.)
- `actions` – for the `/interact` endpoint (fill, click, wait)
- `query` and `limit` – for search

**Examples:**
- *“Scrape https://example.com and return markdown.”*
- *“Search for ‘latest AI frameworks’ and return the top 3 results.”*
- *“Interact with https://example.com/search: fill `#q` with ‘firecrawl’, click `#search`, wait 2 seconds, then return markdown.”*

## API Fallback Workflows

When no MCP tools are available, use the Firecrawl REST API. Install the SDK for your language:

```bash
npm install @mendable/firecrawl-js    # Node.js
pip install firecrawl-py             # Python
```

Then code your workflow. **Remember to load `FIRECRAWL_API_KEY` from the environment.**

### 1. Basic Scrape

**Node.js**
```js
const { FirecrawlApp } = require('@mendable/firecrawl-js');

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const scrape = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(scrape.markdown);
```

**Python**
```python
from firecrawl import FirecrawlApp
import os

app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
result = app.scrape_url("https://example.com", params={"formats": ["markdown"]})
print(result["markdown"])
```

### 2. Search + Scrape Research Workflow

```python
from firecrawl import FirecrawlApp
import os

app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))

# Discover URLs
search = app.search("latest AI agent frameworks 2024", params={"limit": 3})

# Scrape each result
for item in search.get("data", []):
    url = item["url"]
    content = app.scrape_url(url, params={"formats": ["markdown"]})
    print(f"{url}: {len(content.get('markdown', ''))} chars")
```

### 3. Interact with Dynamic Pages

Use the `/interact` endpoint when you need to click, fill forms, or wait for content.

```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://example.com/search",
    "actions": [
      {"type": "fill", "selector": "#search-input", "value": "firecrawl"},
      {"type": "click", "selector": "#search-button"},
      {"type": "wait", "milliseconds": 2000}
    ],
    "formats": ["markdown"]
  }'
```

**SDK equivalents** also exist (`app.interactUrl` or `app.interact`) – check the official docs.

## Error Handling

- **Authentication (401)**: Ensure `FIRECRAWL_API_KEY` is set and valid.
- **Rate limits (429)**: Respect retry‑after headers. The SDKs provide built‑in retry logic.
- **Invalid URL/parameters**: Check the response `success` field; errors contain a `message` property.

## Further Setup / Onboarding

If the environment lacks any Firecrawl tools and you need a one‑time setup, you can run the CLI initialiser:
```bash
npx -y firecrawl-cli@latest init --all
```
This can install auxiliary skills and configure the MCP server for future sessions.

---

**Always prefer the MCP/API tooling first.** Use the API fallback only when the runtime adapter signals that MCP tools are absent.