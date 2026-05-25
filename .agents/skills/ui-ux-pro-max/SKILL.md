# UI/UX Pro Max

## Overview
Generate and persist rich UI/UX design systems for web projects. This skill includes a CLI installer, a Python design system generator, and a hierarchical file persistence pattern (master + page-specific overrides) to keep designs consistent across sessions.

## When to Use
- The user asks for landing pages, dashboards, SaaS products, e-commerce, or any web UI
- A color scheme, typography, spacing, shadows, or component specs must be applied consistently
- The design tokens need to survive across multiple prompt invocations

## Installation
Ensure the skill assets are present in the project. Run:
```bash
uipro init --ai codex
```
If `uipro` is not found, install globally first: `npm install -g uipro-cli`.

## Core Workflow
1. **Generate a design system** using the `DesignSystemGenerator` Python class.
2. **Persist the design system** with `persist_design_system` to create `design-system/<project>/MASTER.md` and optional page overrides.
3. **Retrieve the design rules** before writing any front‑end code.
4. **Build the UI** strictly adhering to the retrieved tokens and component specs.

## Commands & Functions

### `DesignSystemGenerator`
```python
from design_system import DesignSystemGenerator
generator = DesignSystemGenerator()
ds = generator.generate("e‑commerce luxury fashion", "LuxStore")
```
Returns a dictionary with color palette, typography, spacing, shadows, and component definitions.

### `persist_design_system`
```python
from design_system import persist_design_system
result = persist_design_system(ds, output_dir="/path/to/project")
# Creates: /path/to/project/design-system/luxstore/MASTER.md

# With page override:
result = persist_design_system(ds, page="checkout", output_dir="/path/to/project")
# Also creates: .../pages/checkout.md
```

## Hierarchical Retrieval Pattern
For every page build:
- Read `design-system/<project>/MASTER.md`
- Check for `design-system/<project>/pages/<pagename>.md`
- If the page file exists, prioritise its rules; otherwise use `MASTER.md` exclusively
- When building multiple pages, after the first page say: *“Design system saved. Ready to build the next page with it.”*

## Example: Landing Page
User: *“Build a SaaS landing page”*
1. Run `uipro init --ai codex` (if not already installed)
2. Generate: `ds = generator.generate("modern SaaS product", "MySaaS")`
3. Persist: `persist_design_system(ds, output_dir="./", page="landing")`
4. Read `./design-system/mysaas/MASTER.md` and `./design-system/mysaas/pages/landing.md` (if exists)
5. Build the HTML/CSS using the provided CSS variables, font imports, spacing, shadow depths, and component specs exactly as described.

## Design System Contents
The generated file(s) include:
- Color palette as CSS custom properties
- Typography (heading + body fonts, Google Fonts URLs)
- Spacing scale (`--space-xs` … `--space-3xl`)
- Shadow depths (`--shadow-sm` … `--shadow-xl`)
- Component specs: buttons, cards, inputs, modals (actual CSS)
- Anti‑patterns list
- Pre‑delivery checklist

## Notes
- Never hard‑code colour or spacing values; use the CSS variables from the design system.
- Refer to the anti‑patterns section if the design looks inconsistent.
- The slash command `/ui-ux-pro-max` is available in certain IDEs to trigger this skill directly.