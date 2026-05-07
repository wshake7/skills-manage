# Firecrawl Skill

## Purpose
Enable AI coding agents to scrape, crawl, search, and interact with web content via Firecrawl.

## Runtime Options
1. **MCP** (Mode contexts provider) – prefer if available
2. **Hosted API** – requires `FIRECRAWL_API_KEY`
3. **Firecrawl CLI** – local installation, can bootstrap skills

## Setup
```bash
# Install SDK (optional; nodes/agents may use API directly)
npm install @mendable/firecrawl-js   # or pip install firecrawl-py

# Set API key in environment
export FIRECRAWL_API_KEY=fc-your-key   # or put in .env
```

## MCP Integration
If an MCP server for Firecrawl is connected, use its tools directly. The agent should first check for MCP availability and prefer that runtime.

## API Integration (Hosted)
Base URL: `https://api.firecrawl.dev/v1`
Header: `Authorization: Bearer $FIRECRAWL_API_KEY`

### Common Endpoints
- **Scrape (single page)**: `POST /v1/scrape`  
- **Crawl (multiple pages)**: `POST /v1/crawl`  
- **Search**: `POST /v1/search`  
- **Interact (dynamic content)**: `POST /v1/interact`

### Example: Interact with a page
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

## CLI Installation (for local building)
```bash
npx -y firecrawl-cli@latest init --all --browser
```
This installs the CLI and opens browser authentication. Use the CLI when building or testing Firecrawl skills locally.

## Fallback Behaviour
If no runtime is configured (no MCP, no API key set):
- Prompt the user to obtain an API key from https://firecrawl.dev and set `FIRECRAWL_API_KEY`.
- Or instruct how to install the Firecrawl CLI.
- The agent can still provide guidance on how the integration works and document next steps.

## Workflow Guidance
1. **Check runtime**: MCP > API > CLI. Use the most integrated option.
2. **For simple extraction**: POST to `/v1/scrape` with `url` and `formats=["markdown"]`.
3. **For multi-page structured data**: use `/v1/crawl` with a sitemap or start URL.
4. **For dynamic interactions**: use `/v1/interact` with action sequences.
5. **For searches**: use `/v1/search` with query and sources.

## References
- Firecrawl Skills repository: https://github.com/firecrawl/skills
- API documentation: https://docs.firecrawl.dev
- Context7 library: /firecrawl/skills