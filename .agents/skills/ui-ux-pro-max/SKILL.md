# UI/UX Pro Max

## Overview
UI/UX Pro Max is a design system enforcement engine that guides AI coding assistants to produce stunning, production-ready user interfaces. It generates comprehensive design systems from project descriptions, enforces design rules, and uses a hierarchical override pattern (MASTER.md + page overrides) to ensure consistency across all pages.

## Installation (for Codex)
The skill is installed via the `uipro-cli` npm package. Run:
```bash
npm install -g uipro-cli
uipro init --ai codex
```
This appends the core instructions to your `AGENTS.md`. After restarting the AI coding assistant, the skill is active.

To update: `uipro update`
To uninstall: `uipro uninstall --ai codex`

## Core Workflow

### 1. Generate a Design System
When starting a project or building a new feature, generate a design system using Python:
```python
from design_system import generate_design_system

# Generate and save as MASTER.md (Markdown format)
design_system_md = generate_design_system(
    "luxury e-commerce fashion brand",
    project_name="StyleHub",
    output_format="markdown",
    persist=True
)
```
This creates `design-system/stylehub/MASTER.md` with full design tokens.

### 2. (Optional) Create Page-Specific Overrides
For pages that need unique styling, persist an override:
```python
from design_system import persist_design_system, DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce fashion", "StyleHub")
persist_design_system(ds, page="checkout", output_dir=".")
```
This creates `design-system/stylehub/pages/checkout.md` which overrides MASTER.md rules.

### 3. Hierarchical Retrieval (When Coding a Page)
Before writing any UI code for a page (e.g., "Checkout"), the AI assistant should:
- Check if `design-system/<project>/pages/checkout.md` exists.
  - If YES, **prioritize** its rules over `MASTER.md`. Merge any missing tokens from MASTER.md.
  - If NO, use only `design-system/<project>/MASTER.md`.

### 4. Apply Design System Rules
The design system provides:
- **Color palette**: CSS custom properties (e.g., `--color-primary`, `--color-surface`).
- **Typography**: font family, weights, Google Fonts URL, CSS `@import`.
- **Spacing tokens**: `--space-xs` to `--space-3xl`.
- **Shadow depths**: `--shadow-sm` through `--shadow-xl`.
- **Component specs**: buttons, cards, inputs, modals with exact CSS.
- **Anti-patterns list**: things to avoid (e.g., low contrast, inconsistent padding).
- **Pre-delivery checklist**: final validation before handoff.

Always follow these rules literally. Use the provided CSS variables; do not invent new ones.

### 5. Anti‑Patterns & Checklist
Before considering a UI task complete, verify against the anti‑patterns and delivery checklist in the design system. Common issues:
- Colors outside the defined palette.
- Spacing not using design tokens.
- Inconsistent shadows or border radii.
- Accessibility contrast failures.

## Example Session
```
User: "Build a landing page for my SaaS startup."
Assistant:
  1. Checks if a design system exists (e.g., `design-system/mysaas/MASTER.md`). If not, generates one with `generate_design_system("SaaS startup", "MySaaS", persist=True)`.
  2. Reads `design-system/mysaas/MASTER.md` (and checks for page override if exists).
  3. Builds the landing page HTML/CSS using exactly the colors, fonts, spacing, shadows, and component specs from the design system.
  4. Validates against anti‑patterns and checklist before presenting the code.
```

## Reference
- GitHub: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- CLI: `uipro init`, `uipro update`, `uipro versions`.
- Python API: `generate_design_system()`, `persist_design_system()`.
