# Firecrawl Runtime-Adapter Skill

You are an AI coding agent. This skill guides you on integrating Firecrawl's web scraping, mapping, and crawling capabilities into a project. Prefer installed Firecrawl skills or MCP/API tooling; fallback only when necessary.

## Preferred Runtimes

Your action depends on which runtime is available in the environment.

### 1. MCP Server (When firecrawl-mcp is installed)

- Invoke MCP tools directly (e.g., `firecrawl_scrape`, `firecrawl_map`, `firecrawl_crawl`).
- The MCP server handles authentication if configured.
- No additional code changes needed if tools are available.

### 2. API Key + SDK (When `FIRECRAWL_API_KEY` env var is set)

- Use the appropriate Firecrawl SDK (Node.js or Python).
- Reference methods: `scrapeUrl()`, `mapSite()`, `crawlSite()`.
- Always read the key from environment (`process.env.FIRECRAWL_API_KEY` or `os.environ.get('FIRECRAWL_API_KEY')`).

## Detection Logic (for you as agent)

Before generating any code, check the environment:

1. **Check for MCP tools**: list available MCP tools. If `firecrawl_scrape` exists, use MCP.
2. **Check for API key**: inspect `FIRECRAWL_API_KEY` env var. If set and MCP not available, generate SDK code.
3. **Fallback**: if neither is present, instruct the user to set up auth using one of these methods:
   - **Quickest**: `npx -y firecrawl-cli@latest init --all --browser` (opens browser auth, no key required). This also installs CLI skills.
   - **Direct instruction**: Ask user to sign up at firecrawl.dev, obtain an API key, and set it as `FIRECRAWL_API_KEY` in their `.env` file.
   - Mention the `firecrawl-build-onboarding` skill (from `firecrawl/skills`) can automate browser auth if the user prefers that skill.

## Setup Commands (Only if needed)

After confirming the user's intention to integrate Firecrawl and if runtime is missing, guide them through one-time setup:

```bash
# Install SDK (optional, often already present)
npm install @mendable/firecrawl-js   # or pip install firecrawl-py

# Set API key (if they have it)
echo "FIRECRAWL_API_KEY=fc-your-key" >> .env

# OR use CLI onboarding (no key needed upfront)
npx -y firecrawl-cli@latest init --all --browser
```

## Workflow Examples

### Scraping a URL (API Key Runtime)

```javascript
const Firecrawl = require('@mendable/firecrawl-js');
const app = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await app.scrapeUrl('https://example.com');
console.log(result.data);
```

### Scraping a URL (MCP Runtime)

No code generation needed—just call the MCP tool `firecrawl_scrape` with the target URL.

### Crawling a Site

MCP: `firecrawl_crawl` (check tool schema).
API: `app.crawlSite('https://example.com', { maxPages: 5 })`.

## Important Notes

- The API key is mandatory for SDK usage; guide the user to set it securely.
- If the project already includes Firecrawl SDK imports, assume API runtime unless MCP tools are detected.
- For advanced features (e.g., pagination, selectors), refer to the SDK documentation; encapsulate in helper functions when generating code.
- **Fallback scripts**: if a user can't install anything right away, suggest a temporary `curl`-based approach using `https://api.firecrawl.dev/v1/scrape` with the API key in headers.