---
name: firecrawl
description: >-
  Use Firecrawl APIs (web scraping, search, browser) via MCP server or direct API.
  Covers setup, common workflows, and fallbacks when runtime is not configured.
---

# Firecrawl Skill

Firecrawl provides APIs and tools for scraping web pages, searching the web with discovery, and performing browser-based interactions. This skill helps AI coding agents integrate Firecrawl into applications.

## Preferred Runtime

- **MCP (Model Context Protocol)**: Connect to a Firecrawl MCP server for tool calls.
- **API (Direct)**: Use the Firecrawl SDK (`@mendable/firecrawl-js` or `firecrawl-py`) with an API key.

An environment variable `FIRECRAWL_API_KEY` must be set for API usage.

## Setup

### 1. Install the SDK

Choose based on your project:

```bash
npm install @mendable/firecrawl-js   # Node.js
pip install firecrawl-py             # Python
```

### 2. Configure API Key

Set the key in a `.env` file:

```env
FIRECRAWL_API_KEY=fc-your-secret-key
```

Load it in your code (example with dotenv):

```javascript
require('dotenv').config();
const apiKey = process.env.FIRECRAWL_API_KEY;
```

### 3. (Optional) Connect via MCP

If your agent can access an MCP server, connect to the Firecrawl MCP server to call Firecrawl tools. Refer to the MCP server documentation for connection details. When connected, the server exposes `firecrawl_scrape`, `firecrawl_search`, etc.

## Usage Patterns

### a. Scrape a URL

```javascript
const FirecrawlApp = require('@mendable/firecrawl-js');

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const url = 'https://example.com';
const params = {
  formats: ['markdown'],
};

const result = await app.scrapeUrl(url, params);
console.log(result.markdown);
```

```python
from firecrawl import FirecrawlApp
import os

app = FirecrawlApp(api_key=os.environ['FIRECRAWL_API_KEY'])
result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
print(result['markdown'])
```

### b. Search the Web

```javascript
const searchResult = await app.search('latest AI news');
console.log(searchResult);
```

### c. Browser Actions (e.g., click, type, screenshot)

```javascript
const actions = [
  { type: 'navigate', url: 'https://example.com' },
  { type: 'click', selector: '#submit' },
  { type: 'screenshot' }
];
const result = await app.action({ actions });
```

> Replace `app` with MCP tool calls if using MCP runtime.

## Fallback Behavior

When `FIRECRAWL_API_KEY` is not set or the runtime isn’t configured:

1. **Prompt the user** for the API key or ask them to run the interactive setup:
   ```bash
   npx -y firecrawl-cli@latest init --all --browser
   ```
   This command installs the CLI, registers skills, and authenticates via the browser.

2. **If the user cannot provide a key**: Explain that Firecrawl requires an account and API key. Suggest they sign up at [firecrawl.dev](https://firecrawl.dev) to obtain one.

3. **If the user wants to avoid API keys**: Mention that the MCP server (if available) can be connected without a key in some local setups. Otherwise, the fallback is to use the CLI’s auth flow.

4. **During coding**: If Firecrawl is essential but inaccessible, the agent should advise the user to complete the setup before proceeding.

## Best Practices

- Always load the API key from environment variables; never hardcode it.
- Reuse a single `FirecrawlApp` instance across calls.
- Use `formats: ['markdown']` for content extraction suitable for LLM processing.
- For search tasks, prefer `search` over scrape when discovering URLs.
- Handle errors gracefully (e.g., rate limits) and retry with exponential backoff.

## Additional Resources

- [Firecrawl Docs](https://docs.firecrawl.dev)
- [Firecrawl Skills Repo](https://github.com/firecrawl/skills)
- [MCP Integration Guide](https://docs.firecrawl.dev/mcp)
