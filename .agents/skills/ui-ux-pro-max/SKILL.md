# UI/UX Pro Max Skill

AI-accelerated UI/UX design with hierarchical design system persistence. This skill equips you to generate production‑grade interfaces by searching a vast design knowledge base and remembering project‑specific rules across sessions.

## Setup

Ensure the skill is initialized for Codex:
```bash
uipro init --ai codex
```
If you already have the skill files, no further setup is needed.

## When to Use

Activate this skill automatically whenever the user requests UI/UX work (pages, components, layouts, style guides) or explicitly with:
```
$ui-ux-pro-max Build a landing page for my SaaS product
```

## Core Workflow

1. **Interpret the user’s request** – extract design keywords, target platform (web/mobile), and framework preferences.
2. **Search for design patterns** – run the search script to get relevant UI/UX rules and examples.
3. **Persist the design system** (optional) – save the generated rules to a hierarchical Markdown store for future tasks.
4. **Read existing design system** – if `design-system/MASTER.md` (and any page‑specific overrides) exist, load them first to ensure consistency.
5. **Generate the final code** – produce HTML, Tailwind, React, Vue, or any other output while strictly adhering to the design system rules.

## Commands

All commands are relative to the workspace root; adjust paths as needed.

### Search and Output Design System
```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -f markdown
```

### Persist Global Rules (creates `design-system/MASTER.md`)
```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

### Persist Page‑specific Override
```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

### Offline Mode (use bundled assets only)
```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --offline
```

## Hierarchical Retrieval

When a design system has been persisted:
- `design-system/MASTER.md` contains **global** rules for the entire project.
- `design-system/pages/<page>.md` files contain **overrides** for specific pages/views.

**Before generating any UI, you must:**
1. Check for `MASTER.md` and read it.
2. If the user mentions a page name, load the corresponding page file.
3. Apply global rules first, then override with page‑specific ones.
4. Respect all design tokens, spacing, color, typography, and interaction rules.

## Example

User: *“Design a SaaS dashboard with a dark theme, remember the system for my project ‘Apollo’.”*

Agent steps:
```bash
# Generate and persist a global design system
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard dark theme" --design-system --persist -p "Apollo"
# Generate and persist a page override for the dashboard
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard dark theme" --design-system --persist -p "Apollo" --page "dashboard"
```
Then the agent reads `design-system/MASTER.md` and `design-system/pages/dashboard.md`, builds the dashboard UI components, and delivers the final code.

## Notes

- Always respect the user’s chosen framework (default to Tailwind CSS + React if unspecified).
- Use the search script’s output as your primary design authority.
- Offline mode (`--offline`) is ideal when internet access is limited and bundled assets suffice.
- If the user asks to *update* the design system, re‑run the search with `--persist`; existing files will be updated.
