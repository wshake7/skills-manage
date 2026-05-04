# UI/UX Pro Max Skill

## Purpose

Provides AI coding agents with deterministic, retrieval-augmented guidance for generating and applying professional design systems to any project. Standardizes UI patterns, color, typography, spacing, effects, and anti-patterns using a hierarchical rules engine.

## Setup (One-Time per Project)

```bash
npm install -g uipro-cli          # Install CLI globally
uipro init --ai codex             # Initialize for OpenAI Codex (Skills)
```

Use `--offline` to skip GitHub downloads, and `--force` to overwrite existing files.

## Core Workflow

### 1. Generate a Design System

Run the reasoning engine to research best practices and produce a comprehensive design guide. Always include the `--design-system` flag.

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

Example:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

### 2. Persist for Hierarchical Retrieval

Save the design system so rules can be reused across sessions. This creates `MASTER.md` (global rules) and a `pages/` directory for page‑specific overrides.

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

Add optional `--page "pagename"` to generate/update a page‑specific override file.

### 3. Apply the Design System

#### Hierarchical Retrieval Logic

- If a page override file exists (e.g., `design-system/pages/checkout.md`), its rules **override** any conflicting rules in `design-system/MASTER.md`.
- If no page file exists, use only `design-system/MASTER.md`.
- Always check for a page override first before falling back to the global master.

#### Prompt Engineering

When the user asks to build a UI component/page, the agent must:

1. Determine the page name (e.g., `dashboard`, `checkout`, `profile`).
2. Check for `design-system/pages/<page>.md`. If it exists, load and apply those rules.
   - If not, load `design-system/MASTER.md`.
3. Combine the retrieved rules with the user request. Adhere strictly to the specified patterns, colors, typography, spacing, and avoid listed anti‑patterns.
4. If no design system has been generated yet, prompt the user to provide product type/industry/keywords and run the generation command first.

## Commands Reference

### Initialization

```bash
uipro init --ai codex        # Skill installation
uipro init --ai codex --force # Overwrite existing
uipro init --offline         # Use bundled assets only
```

### Design System Generation

```bash
# Full generation with reasoning
python3 skills/ui-ux-pro-max/scripts/search.py "product industry keywords" --design-system -p "Project Name"

# Persist for hierarchical retrieval
python3 skills/ui-ux-pro-max/scripts/search.py "query" --design-system --persist -p "Project Name"

# Persist with page override
python3 skills/ui-ux-pro-max/scripts/search.py "query" --design-system --persist -p "Project Name" --page "checkout"
```

## Anti‑Patterns

- Do not generate UI without first checking for a design system.
- Do not ignore hierarchical retrieval rules.
- Do not mix global and page rules without ensuring page overrides take precedence.

## Notes

- The skill expects the `uipro-cli` to be installed globally.
- The `search.py` script resides at `skills/ui-ux-pro-max/scripts/search.py` relative to the project root; adjust if the skill was installed at a different location.
- All generated design files live under a `design-system/` directory in the project root.
