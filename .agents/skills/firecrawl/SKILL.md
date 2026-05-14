# Firecrawl Skill

Help AI coding agents integrate Firecrawl's web scraping, search, and interaction APIs into applications.

This skill is for **project integration**—adding Firecrawl to a codebase, selecting the right extraction method, and configuring credentials. For one-off web research or ad-hoc scraping during a coding session, use the `firecrawl/cli` skill instead.

## Prerequisites

- A Firecrawl API key (`FIRECRAWL_API_KEY`).
- (Recommended) The Firecrawl MCP server for the coding agent to use directly.

## Runtime Adapter

### Preferred Runtimes

1. **MCP (Model Context Protocol)** – Configure the Firecrawl MCP server; the agent then accesses scraping, search, and extraction tools directly.
2. **Direct API** – Use the Firecrawl REST API with your key when MCP is unavailable.

### Fallback

If neither MCP nor API is configured:
- Guide the user to install the SDK (`@mendable/firecrawl-js` for Node.js or `firecrawl-py` for Python).
- Help set `FIRECRAWL_API_KEY` in the `.env` file.
- Use the SDK to perform the required operations.

## Setup

### 1. Obtain API Key

If no key exists, run the `firecrawl-build-onboarding` skill (it includes a browser authorization flow).

### 2. Configure MCP Server (Preferred)

```bash
npx -y @firecrawl/mcp-server
```

Ensure the environment variable is set:

```bash
export FIRECRAWL_API_KEY=fc-your-key
```

### 3. Alternative: Direct API / SDK

```bash
npm install @mendable/firecrawl-js   # Node.js
pip install firecrawl-py            # Python
echo "FIRECRAWL_API_KEY=fc-your-key" >> .env
```

## Usage

### When MCP is Active

The agent can use tools like:

- `firecrawl_scrape` – Extract structured content from a URL.
- `firecrawl_search` – Search the web and optionally scrape results.
- `firecrawl_map` – Discover all URLs on a website.
- `firecrawl_extract` – Extract structured data using an LLM.

Example:

```text
Scrape https://example.com with only main content.
```

The agent will invoke the appropriate MCP tool automatically.

### When Using API Directly

If the agent has access to execute HTTP requests (e.g., via `curl` or an HTTP client):

```bash
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $FIRECRAWL_API_KEY' \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```

### When Using SDK (Fallback)

Node.js example:

```js
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com');
```

Python example:

```python
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
result = app.scrape_url("https://example.com")
```

## Notes

- Prefer installed Firecrawl skills or MCP/API tooling when available.
- This skill is cloud‑aware: always check for and respect the `FIRECRAWL_API_KEY` environment variable.
- If the agent cannot resolve an API key, the `firecrawl-build-onboarding` skill can help the user obtain one.
- Fallback should always guide the user to install the correct SDK if MCP and direct API are not possible.

## Decision Guidance

- **Scraping a single page** → `firecrawl_scrape`
- **Searching the web for information** → `firecrawl_search`
- **Discovering all pages on a site** → `firecrawl_map`
- **Extracting structured data from many pages** → `firecrawl_extract`

These map to MCP tools and API endpoints identically.