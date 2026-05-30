# Firecrawl Skill

Firecrawl is a web scraping, crawling, and data extraction API. Use it to turn websites into clean, LLM-ready markdown or structured data. This skill helps you integrate Firecrawl into your project, whether you're using the direct API or an MCP runtime.

## Runtime Options (in order of preference)

### 1. MCP Runtime (Preferred)
Firecrawl can be exposed as an MCP server. If your environment has a `firecrawl` MCP server connected, use its tools directly:

- **`scrape_url`** — fetch a single page and return content (markdown, HTML, etc.)
- **`crawl_website`** — crawl multiple pages from a domain with options for depth, path filtering, and output format
- **`map_urls`** — discover all URLs from a starting point

Example usage (pseudo-code for an MCP-aware agent):
```
Use tool "scrape_url" with arguments: { url: "https://example.com", formats: ["markdown"] }
```

If you encounter issues, verify the MCP server configuration and that `FIRECRAWL_API_KEY` is set correctly (the server reads it).

### 2. API Runtime (when MCP is absent)
If no MCP server is connected, fall back to the Firecrawl SDK (Node.js or Python). You must have `FIRECRAWL_API_KEY` set in your environment.

#### Node.js
```bash
npm install @mendable/firecrawl-js dotenv
```
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';
import 'dotenv/config';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape a single page
const { markdown } = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(markdown);

// Crawl a website
const crawl = await app.crawlUrl('https://example.com', { limit: 10, scrapeOptions: { formats: ['markdown'] } });
```

#### Python
```bash
pip install firecrawl-py python-dotenv
```
```python
import os
from firecrawl import FirecrawlApp
from dotenv import load_dotenv

load_dotenv()
app = FirecrawlApp(api_key=os.getenv('FIRECRAWL_API_KEY'))

# Scrape
result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
print(result['markdown'])

# Crawl
crawl = app.crawl_url('https://example.com', params={'limit': 10, 'scrapeOptions': {'formats': ['markdown']}})
```

## Prerequisites & Setup

**API Key Requirement:** All methods require a Firecrawl API key (`FIRECRAWL_API_KEY`). If you don't have one:

- **Option A – Automated onboarding (recommended)**  
  Use the `firecrawl-build-onboarding` skill. It will launch a browser-based authorization flow and retrieve a key automatically. After that, the key will be available in your environment.

- **Option B – Manual**  
  Visit [firecrawl.com](https://firecrawl.com) to sign up and obtain your key. Then add it to your project:
  ```bash
  echo "FIRECRAWL_API_KEY=fc-your-key" >> .env
  ```

**Verify the key works:**
```bash
curl -H "Authorization: Bearer $FIRECRAWL_API_KEY" https://api.firecrawl.dev/v1/scrape \
  -d '{"url":"https://example.com"}'
```

## Fallback Workflow Without Any Runtime

1. Check if `FIRECRAWL_API_KEY` is set. If not, guide the user through setup (Option A or B above).
2. Once the key is available, decide between:
   - **MCP** – if the environment provides it, prefer this (no extra code required).
   - **API** – otherwise, install the SDK and use the code snippets above.
3. If the project already includes Firecrawl as a dependency, reuse existing code patterns.

## Building Custom Firecrawl Skills (Advanced)

If you need to create reusable mini-apps (skills) that use Firecrawl, you can use the Firecrawl CLI:
```bash
npx -y firecrawl-cli@latest init --all --browser
```
This installs CLI tooling, build tools, and starts the browser auth flow. Use it only when the agent is explicitly building Firecrawl-based skills, not for simple scraping tasks.

## Tips

- Use `formats: ['markdown']` to get clean markdown; add `'html'` or `'rawHtml'` if you need the original structure.
- For large crawls, adjust `limit` and `maxDepth` to control scope.
- Respect websites' `robots.txt`; the API does this by default.
