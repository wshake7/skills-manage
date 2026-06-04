# Context7 Skill

Context7 provides up-to-date documentation for thousands of libraries via a fast, local runtime. This skill covers the preferred MCP-based integration and the CLI fallback path.

## Configuration

### Option 1: Context7 MCP Server (Preferred)

1. Run the interactive setup to install the MCP server:
   ```bash
   npx ctx7@latest setup
   ```
2. During setup, select **MCP server** mode.
3. Ensure the `CONTEXT7_API_KEY` environment variable is set (from [Context7 dashboard](https://context7.com/dashboard)).

**MCP Tools Available:**
- `context7_search_library` – search for a library by name
- `context7_get_library_docs` – retrieve documentation for a specific library

### Option 2: CLI Fallback

If the MCP server is not configured, use the CLI directly:

```bash
# Install globally or use npx
npm install -g ctx7@latest
# or
npx ctx7@latest <command>
```

Set the API key:
```bash
export CONTEXT7_API_KEY=your_api_key_here
```

## Usage Workflow

### 1. Check for MCP availability

If an MCP client is already connected, the agent should attempt to use the Context7 MCP tools. Otherwise, fall back to CLI.

### 2. Retrieve documentation

**When MCP is available:**

- Use `context7_search_library` to find the correct library ID.
- Use `context7_get_library_docs` with the library ID to get full documentation.

**When using CLI:**

```bash
# Search for a library
npx ctx7 search "react"

# Get latest docs
npx ctx7 docs /websites/react
```

Replace `/websites/react` with the actual library ID.

### 3. Integrate fetched documentation

Use the returned content (markdown, code snippets, etc.) directly in your assistance or code generation.

## Example: Fetching React documentation

**With MCP:**
```
Call: context7_search_library(query="react", exact=false)
      → returns [{ library: "/websites/react", name: "React", ... }]
Call: context7_get_library_docs(libraryId="/websites/react", topic="")
      → returns full markdown docs
```

**With CLI:**
```bash
npx ctx7 docs /websites/react
```

## Skills & Custom Libraries

Context7 supports custom skill installation:

```bash
# Install skills from a GitHub repo
npx ctx7 skills install /anthropics/skills

# Generate a custom skill for your project
npx ctx7 login
npx ctx7 skills generate
```

## Automated Refresh (CI)

To keep your Context7 documentation index up-to-date on push:

```yaml
name: Refresh Context7 Docs
on:
  push:
    branches: [main]

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Context7 Refresh
        run: |
          curl -s -X POST https://context7.com/api/v1/refresh \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.CONTEXT7_API_KEY }}" \
            -d '{"libraryName": "/${{ github.repository }}"}'
```

## Troubleshooting

- **"Context7 MCP not available"**: Run `npx ctx7 setup` and select the MCP server option. Restart your MCP client.
- **Missing API key**: Set `CONTEXT7_API_KEY` in your environment or CI secrets.
- **CLI command not found**: Use `npx ctx7@latest` to always get the latest version without global install.
