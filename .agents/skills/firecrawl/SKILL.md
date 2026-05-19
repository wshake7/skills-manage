# Firecrawl Skill

## Overview
Firecrawl provides web scraping, search, and dynamic browser interaction via a cloud API. Use this skill to extract data from websites, perform searches, and automate browser actions in your application.

## Setup
1. **Install Firecrawl SDK** (Node.js or Python):
   ```bash
   npm install @mendable/firecrawl-js      # Node.js
   pip install firecrawl-py               # Python
   ```
2. **Set API key**:
   ```bash
   export FIRECRAWL_API_KEY="fc-..."        # Get from https://firecrawl.dev
   ```
   Add to `.env` or environment variables.

## Runtime Adapter
This skill is a runtime-adapter: it first tries to use the Firecrawl MCP server if available, then falls back to direct API calls.

### 1. If Firecrawl MCP Server is Configured
If your environment includes a Firecrawl MCP server (tools like `firecrawl_scrape`, `firecrawl_search`), use those directly. They leverage the same API and provide structured tool calls. Example:
```
Invoke firecrawl_scrape with url="https://example.com", formats=["markdown"]
```
No additional setup beyond MCP configuration.

### 2. Fallback: Direct API via SDK
When no MCP server is present, use the `FirecrawlApp` SDK:
```javascript
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com', { formats: ['markdown'] });
console.log(result.markdown);
```
Or in Python:
```python
from firecrawl import FirecrawlApp
import os
app = FirecrawlApp(api_key=os.getenv('FIRECRAWL_API_KEY'))
result = app.scrape_url('https://example.com', params={'formats': ['markdown']})
print(result['markdown'])
```

### 3. Fallback: cURL
For environments without SDK:
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"https://example.com","formats":["markdown"]}'
```

## Common Workflows

### Research Workflow (Search + Scrape)
1. **Search** for a topic:
   ```python
   results = app.search("latest AI trends", params={"limit":5})
   ```
2. **Scrape** each result:
   ```python
   for item in results['data']:
       content = app.scrape_url(item['url'], params={'formats':['markdown']})
       # process content
   ```

### Dynamic Content Interaction
Use `/interact` for pages that require form filling or button clicks:
```bash
curl -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url":"https://example.com/search",
    "actions":[
      {"type":"fill","selector":"#q","value":"firecrawl"},
      {"type":"click","selector":"#btn"},
      {"type":"wait","milliseconds":2000}
    ],
    "formats":["markdown"]
  }'
```

## Error Handling & Fallbacks
- If `FIRECRAWL_API_KEY` is missing, prompt user to obtain one from https://firecrawl.dev.
- Network/rate limit errors: implement exponential backoff.
- Check Firecrawl documentation for advanced options: https://docs.firecrawl.dev.

## Notes
- The Firecrawl CLI (`firecrawl/cli`) is a separate tool; this skill covers the cloud API.
- For high-volume tasks, consider async and batching.