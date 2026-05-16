# UI/UX Pro Max

## Overview
- AI-powered design intelligence skill that integrates with 14+ AI coding assistants.
- Database: 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types, 161 reasoning rules.
- Automatically activates when UI/UX design work is requested.

## Installation (for Codex, via `uipro` CLI)
```bash
npm install -g uipro-cli
cd /path/to/your/project
uipro init --ai codex   # Appends UI/UX Pro Max rules to AGENTS.md
```
After installation, restart your AI coding assistant.

## How to Use This Skill

When UI/UX tasks are requested, follow these steps:

1. **Generate a Design System**: Use the skill's design generation capabilities. The skill can produce a comprehensive design system dict including colors, typography, spacing, shadows, component specs, etc.
2. **Persist Design System (Master + Overrides Pattern)**:
   - Use `persist_design_system()` from the provided `design_system` Python module to save the design system into the project's file structure.
   - This creates a `MASTER.md` file containing global design rules and optionally page-specific override files in a `pages/` directory.
   - Hierarchical retrieval: When working on a specific page (e.g., "checkout"), first check if `design-system/pages/checkout.md` exists. If it does, prioritize its rules. Otherwise, fall back to `design-system/MASTER.md`.
3. **Generate UI/UX Components**: Based on the design system, produce high-quality, consistent UI code. Apply the design tokens (CSS variables), typography, spacing, and component specs from the master or override file.
4. **Pre-Delivery Checklist**: Before finalizing, verify adherence to the design system's anti-patterns list and checklist.

## Python API: `persist_design_system`

```python
from design_system import persist_design_system

# Persist MASTER.md only
result = persist_design_system(ds, output_dir="/path/to/project")
# Creates: /path/to/project/design-system/<project-name>/MASTER.md

# Persist MASTER.md + page override
result = persist_design_system(ds, page="checkout", output_dir="/path/to/project")
# Creates: /path/to/project/design-system/<project-name>/MASTER.md
#          /path/to/project/design-system/<project-name>/pages/checkout.md
```

## Context-Aware Retrieval Pattern

When building a page, instruct the AI to read the appropriate design system files:

```text
"I am building the Checkout page. Please read design-system/<project-name>/MASTER.md.
Also check if design-system/<project-name>/pages/checkout.md exists.
If the page file exists, prioritize its rules. Otherwise, use the Master rules."
```

## CLI Reference

- `uipro init --ai codex` — Install for Codex (appends to AGENTS.md)
- `uipro versions` — List available skill versions
- `uipro update` — Update to latest version
- `uipro uninstall` — Remove the skill
- `uipro init --ai all` — Install for all supported assistants

## Important Notes

- The skill's assets (design data) are embedded or fetched; the `--offline` flag uses bundled assets.
- When generating code, always reference the design system files; never hardcode arbitrary styles.
- This skill is designed to be used in conjunction with the `uipro-cli` tool. If `uipro init` hasn't been run, the skill may lack full context; in that case, prompt the user to install it.