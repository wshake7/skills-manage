# Firecrawl Skill

Firecrawl converts websites into LLM-ready data (markdown, structured extraction, screenshots) through scraping, crawling, and interaction. This skill adapts to the best available runtime—MCP server, direct API, or CLI—to give AI agents deterministic access to web content.

## Runtime Detection & Selection

1. **MCP Runtime** – Check if `firecrawl_scrape` is an available tool. If yes, use the MCP server tools.
2. **Direct API** – If MCP is not available, verify `FIRECRAWL_API_KEY` is set in the environment. Use HTTP requests or SDK calls.
3. **CLI Fallback** – Only if neither MCP nor the API key exists, guide the user to install the Firecrawl CLI (`npx -y firecrawl-cli@latest init --all`).

## Using MCP Tools

When the `firecrawl_scrape` / `firecrawl_crawl` / `firecrawl_interact` / `firecrawl_map` tools are available:

**Scrape a URL**
```json
{"tool": "firecrawl_scrape", "parameters": {"url": "https://example.com", "formats": ["markdown"], "onlyMainContent": true}}
```

**Crawl Multiple Pages**
```json
{"tool": "firecrawl_crawl", "parameters": {"url": "https://example.com", "maxPages": 5, "includePaths": ["/blog/*"], "formats": ["markdown"]}}
```

**Interact with Dynamic Content**
```json
{"tool": "firecrawl_interact", "parameters": {"url": "https://example.com/search", "actions": [{"type": "fill", "selector": "#search-input", "value": "firecrawl"}, {"type": "click", "selector": "#search-button"}, {"type": "wait", "milliseconds": 2000}], "formats": ["markdown"]}}
```

## Using the Direct API

When `FIRECRAWL_API_KEY` is set, call the Firecrawl HTTP API. Base URL: `https://api.firecrawl.dev/v1`.

**Scrape**
```bash
curl -s -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"https://example.com","formats":["markdown"],"onlyMainContent":true}'
```

**Crawl** (asynchronous – returns job ID)
```bash
# Start crawl
JOBID=$(curl -s -X POST https://api.firecrawl.dev/v1/crawl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"https://example.com","maxPages":3}' | jq -r '.id')
# Poll status
curl -s "https://api.firecrawl.dev/v1/crawl/$JOBID" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY"
```

**Interact**
```bash
curl -s -X POST https://api.firecrawl.dev/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{"url":"...", "actions":[...], "formats":["markdown"]}'
```

> The Python (`firecrawl-py`) and JavaScript (`@mendable/firecrawl-js`) SDKs mirror the same endpoints and are ideal for programmatic use. Import and instantiate with the API key.

## Environment / Credentials

- `FIRECRAWL_API_KEY` – required for the API and CLI. Get it from [Firecrawl Dashboard](https://firecrawl.dev/app/api-keys).
- Never hard-code keys; always read from the environment.

## Configuring the Runtime (User Setup)

**Option 1: Firecrawl MCP Server (recommended if your environment supports MCP)**
```bash
npm install -g @firecrawl/mcp
```
Add the server to your MCP configuration, passing `FIRECRAWL_API_KEY` as an environment variable.

**Option 2: Direct API**
```bash
export FIRECRAWL_API_KEY=fc-your-key
```

**Option 3: Firecrawl CLI (for quick testing and built-in authentication flow)**
```bash
npx -y firecrawl-cli@latest init --all --browser
```
This installs CLI skills, configures credentials, and opens a browser for authentication.

## Fallback – When Nothing Is Configured

If the agent cannot detect any runtime, output:
```
Firecrawl is not configured. Please choose one:
1. Set your API key: export FIRECRAWL_API_KEY=fc-...
2. Install the Firecrawl MCP server (if your agent supports MCP).
3. Run `npx -y firecrawl-cli@latest init --all` for one-click CLI setup.
```

## Best Practices

- Set `onlyMainContent: true` to reduce noise and token usage.
- Use `formats: ["markdown"]` for LLM consumption; add `"screenshot"` or `"html"` only when needed.
- Limit `maxPages` during crawls to avoid excessive API calls; combine with `includePaths`/`excludePaths`.
- For dynamic pages, compose action sequences carefully and include `wait` steps.
- Poll crawl jobs until status is `completed`, then retrieve results.