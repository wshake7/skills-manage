# Context7 Skill

Use Context7 to fetch up-to-date, AI-optimized documentation for any library. This skill tells you how to retrieve docs for a given repository via the Context7 MCP server or CLI.

## Runtime Options (in order of preference)

1. **Context7 MCP server** – If the agent has access to `context7_*` tools, use MCP.
2. **Context7 CLI** (`npx ctx7@latest`) – Fallback when MCP is unavailable.
3. **No runtime** – Ask the user to set up Context7 (see [Fallback](#no-runtime-fallback)).

## Setup

Context7 requires a free API key and Node.js ≥18.

```bash
npx ctx7@latest setup
```

Follow the interactive prompts to choose MCP mode or CLI + Skills mode. The API key is stored in the environment variable `CONTEXT7_API_KEY` (you can also pass it via `--api-key` in headless environments).

## Fetching Documentation

### Using MCP Server

Call the `context7_get_library_docs` tool with the library ID:

```
context7_get_library_docs({ libraryId: "/owner/repo" })
```

Example for the Context7 library itself:

```
context7_get_library_docs({ libraryId: "/websites/context7" })
```

The response is a full Markdown document covering the library’s API, configuration, and usage.

### Using CLI (fallback)

Install a Context7 skill for the target library, then read the downloaded documentation.

```bash
npx ctx7@latest skills install /owner/repo
```

For example:

```bash
npx ctx7@latest skills install /upstash/context7
```

Installed skills live in the project (check for a `SKILL.md` file). Alternatively, preview with:

```bash
npx ctx7@latest skills info /owner/repo
```

If the CLI is not authenticated, run `npx ctx7@latest login`.

## No Runtime Fallback

When Context7 MCP or CLI is not available, instruct the user to run the setup once:

```bash
npx ctx7@latest setup
```

After setup, retry the documentation fetch. A free API key can be obtained at https://context7.com.

## Library ID Format

Library IDs follow the pattern `"/owner/repository"`. For GitHub repositories, this matches the GitHub path. Example: `"/upstash/context7"` or `"/websites/context7"`.

## Troubleshooting

- **Authentication errors:** Ensure `CONTEXT7_API_KEY` is set and valid.
- **CLI not found:** Use `npx ctx7@latest` to avoid global installs.
- **Library not found:** Verify the ID is correct; some repositories may need to be onboarded first at https://context7.com.
