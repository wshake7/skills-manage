# UI/UX Pro Max Skill

This skill enables an AI coding agent to leverage the **UI/UX Pro Max** design system generator. It provides an opinionated, search‑driven pipeline to create, persist, and retrieve design systems for any digital product.

## Purpose

Generate complete design systems (colors, typography, spacing, effects, patterns, anti‑patterns) from a natural‑language query. Supports master/override hierarchy for multi‑page apps and allows persisting the system for reuse across coding sessions.

## Prerequisites

- Python 3 installed
- The `ui-ux-pro-max` CLI available (usually after `pip install uipro` or from source)
- For initialization, the target AI assistant must be supported (`--ai` flag)

## When to Use This Skill

Invoke this skill when a user asks to:

- “Build a landing page for…”, “Create a design system for…”, “What styles should I use for…”, etc.
- Generate UX patterns, color palettes, typography scales, or spacing tokens for a project.
- Persist a design system so it can be reused later.

## Workflow

### 1. Initialization (if not already set up)

Run this once per project (or force overwrite with `--force`):

```bash
uipro init --ai codex
```

This installs the skill files for Codex (Skills). Other assistants use different `--ai` values (e.g., `claude`, `cursor`, `windsurf`). See [CLI README](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/README.md).

### 2. Generate a Design System

Use the `search.py` script with the `--design-system` flag. Always provide a concise product/industry description.

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "<Project Name>"
```

Example:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

The command prints the design system to stdout. You must capture and present it to the user, then use it to guide UI/UX decisions.

### 3. Persist the Design System (Optional but Recommended)

To save the design system for multi‑session hierarchical retrieval, add `--persist`:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp"
```

This creates:
- `design-system/MASTER.md` — global rules
- `design-system/pages/` — page‑specific override files (add `--page "dashboard"` to create one)

Later, when the user asks for UI guidance, the AI can read `MASTER.md` and any relevant page files.

## Output Interpretation

- **Patterns**: recommended layout, navigation, interaction patterns.
- **Styles**: visual mood, spacing scale, border radius, shadows.
- **Colors**: primary, secondary, accent, neutral palettes with roles.
- **Typography**: font pairings, sizes, weights, line‑heights.
- **Effects**: glassmorphism, neumorphism, gradients, etc.
- **Anti‑patterns**: what to avoid.

Apply these rules when coding any interface for the project. The design system is the single source of truth for UI/UX decisions.

## Important Flags

| Flag | Purpose |
|------|---------|
| `--design-system` | **Mandatory.** Triggers design system mode. |
| `-p` / `--project-name` | Project name (used in output). |
| `--persist` | Saves to `design-system/MASTER.md` and creates page directory. |
| `--page <name>` | Used with `--persist` to create a page‑specific override. |
| `--offline` | Skips GitHub download during `uipro init`. |
| `--force` | Overwrites existing files during `uipro init`. |

## Explicit Invocation

In Codex, the skill can be invoked by typing:

```
$ui-ux-pro-max Build a landing page for my SaaS product
```

## References

- [Official Repository](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [CLI Documentation](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/README.md)
- [Skill README](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/README.md)

## Notes

- Always run the `search.py` script from the correct path (`.codex/skills/ui-ux-pro-max/scripts/search.py` after initialization).
- If the user only wants a design system and not immediate code, just output the generated system and stop.
- When coding, refer back to the persisted `MASTER.md` and page files to stay consistent.