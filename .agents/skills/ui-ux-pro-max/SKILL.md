# UI/UX Pro Max

UI/UX Pro Max is an AI-powered design intelligence skill that integrates with over 14 AI coding assistants (including Codex). It provides a searchable database of 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types, and 161 reasoning rules. The skill automatically activates during UI/UX work and gives the agent direct access to design recommendations without manual lookup.

## Installation (Codex)

Install globally, then initialize for your project:

```bash
npm install -g uipro-cli
cd your-project
uipro init --ai codex
```

This appends the skill instructions to `AGENTS.md`. Restart your AI coding assistant to pick up the skill.

To remove:
```bash
uipro uninstall --ai codex
```

## How It Works

- The skill is triggered when you request UI/UX work (e.g., "Build a landing page", "Redesign the dashboard").
- The agent uses the bundled design database and the `design_system` Python module to generate project-specific design systems.
- Design rules are persisted as Markdown files — a global `MASTER.md` and optional page‑level overrides (`pages/<page>.md`).
- When building a page, the agent **must** check for a page override first; if it exists, its rules take precedence over the master.

## Core Capabilities

### Generate & Persist a Design System

Use the Python utilities to create a design system for any project/theme.

```python
from design_system import persist_design_system, DesignSystemGenerator

# 1. Generate the design system
generator = DesignSystemGenerator()
ds = generator.generate("SaaS analytics dashboard", project_name="MyApp")

# 2. Persist master rules only
persist_design_system(ds, output_dir="/path/to/project")
# → design-system/myapp/MASTER.md

# 3. Persist master + page override (e.g., for dashboard)
result = persist_design_system(ds, page="dashboard", output_dir="/path/to/project")
# → design-system/myapp/MASTER.md
# → design-system/myapp/pages/dashboard.md
```

**Shortcut:** `generate_design_system()` can persist in one call:

```python
generate_design_system(
    "e-commerce fashion",
    project_name="LuxStore",
    persist=True,
    page="checkout"   # optional
)
```

### Read & Apply Design Rules

When coding a specific page, always look up the design system files:

1. Read `design-system/<project>/MASTER.md` for global tokens (colors, typography, spacing, shadows, component specs).
2. Check if `design-system/<project>/pages/<page>.md` exists.  
   - If yes, **prioritise its rules** (they override the master).
   - If no, use the master rules.

The master file includes:
- CSS variable definitions
- Typography (Google Fonts imports)
- Spacing tokens
- Shadow depths
- Pre‑built component examples (buttons, cards, modals, inputs)
- Anti‑patterns to avoid
- A pre‑delivery checklist

## Workflow for an AI Agent

1. **Understand the request** – Identify the project type, theme, and pages required.
2. **Generate the design system** – Use `generate_design_system()` or the two‑step `Generator → persist` approach with a `project_name` and an optional `page`.
3. **Persist the rules** – Save to the project directory using `persist_design_system()`.
4. **Retrieve applicable rules** – Read the appropriate Markdown file(s) as described above.
5. **Implement** – Use the CSS variables, component specs, and UX guidelines directly in your code. Follow the checklist before marking work as complete.

## Keeping the Skill Up‑to‑date

To update the skill to the latest version:

```bash
uipro update
```

List available versions:

```bash
uipro versions
```

## Offline Usage

If the GitHub repository is unavailable, install offline using bundled assets:

```bash
uipro init --ai codex --offline
```

## Notes

- The skill’s design data is embedded in the CLI; no external API calls are needed.
- The generated `MASTER.md` and page files are human‑readable and can be committed to version control for team consistency.
- The agent should **never** guess design tokens when the skill is active — always refer to the persisted files.