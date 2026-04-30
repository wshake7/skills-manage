# UI/UX Pro Max

Generate comprehensive design systems using domain-specific research and reasoning rules. This skill integrates the `uipro` CLI to produce master and page-specific design documents, ensuring consistent, modern UI/UX across your project.

## Quick Start

Initialize the skill for Codex:

```bash
uipro init --ai codex
```

If you need to skip network downloads or overwrite existing files:

```bash
uipro init --ai codex --offline
uipro init --ai codex --force
```

## Generate a Design System

Use the search script to produce a tailored design system based on your product's domain and keywords.

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

**Example:**

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

The script will output patterns, color palettes, typography, spacing, effects, and anti-patterns.

## Persist for Hierarchical Retrieval

To reuse the design system across sessions and pages, add the `--persist` flag. This creates a `MASTER.md` and an optional page-specific override.

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

The AI will automatically load the appropriate design rules when generating UI code for that page.

## Workflow for AI Agents

When a user requests a new UI component, page, or full application interface:

1. **Check for an existing persisted design system.**  
   If a `.codex/skills/ui-ux-pro-max/design-system/MASTER.md` exists, read it first. If a page-specific file exists under `design-system/pages/`, read that for overrides.

2. **If no design system exists, generate one.**  
   Ask the user for a short product description (product type, industry, target audience) and any visual preferences. Then run the search script with `--design-system --persist`.

3. **Apply the design rules.**  
   Use the design system's tokens (colors, fonts, spacing) and patterns to build the UI. Reference the anti-patterns to avoid common mistakes.

4. **Provide reasoning.**  
   The search script includes **reasoning** behind each recommendation. Inject that rationale when explaining UI choices to the user, fostering trust and education.

## Commands Reference

| Command | Purpose |
|---------|---------|
| `uipro init --ai codex` | Install/configure the skill for Codex |
| `python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<name>"` | Generate a design system on-the-fly |
| `python3 ... --design-system --persist -p "<name>"` | Generate and save a master design system |
| `python3 ... --design-system --persist -p "<name>" --page "<page>"` | Generate and save a page-specific override |

## Invocation as a Command (Codex)

Once initialized, the skill can be triggered with the `$ui-ux-pro-max` text slash command:

```
$ui-ux-pro-max Build a landing page for my SaaS product
```

The AI will then follow the workflow to load or generate the appropriate design system and produce the UI.

## Notes

- Always run commands from the project root.
- Ensure Python 3 is available and that the required dependencies (as bundled or fetched by `uipro init`) are installed.
- The script fetches inspiration from multiple pre‑curated design domains in parallel; an internet connection is required unless `--offline` was used during init.

Build consistent, beautiful UIs effortlessly.