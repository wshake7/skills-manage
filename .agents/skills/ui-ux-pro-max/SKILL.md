# UI/UX Pro Max – Design System Skill for Codex

## Overview
UI/UX Pro Max provides design intelligence for building consistent, polished UIs. It generates and persists design systems with CSS custom properties (tokens for colors, typography, spacing, shadows) and page-specific overrides. The skill integrates via the `uipro-cli` and bundled Python tools.

## Installation
Install the skill into your Codex workspace:
```bash
npx uipro-cli init --ai codex
```
This appends the skill instructions to your `AGENTS.md` file and, if needed, creates a `.codex/skills/ui-ux-pro-max/` directory containing the Python scripts and data.

## Core Capabilities
- **Design System Generation** – Creates a comprehensive set of tokens from a domain description.
- **Token Consistency** – Ensures every color, font, spacing, and shadow is used via CSS variables.
- **Master + Overrides Pattern** – A global `MASTER.md` stores default rules; page-specific files in `pages/` override when present.
- **Codex‑Friendly Commands** – Python scripts can be run from the terminal to generate and persist design systems.

## Workflow for the AI Agent

### 1. Detect Existing Design System
Before starting any UI work, check the project for a `design-system/` directory or a `.codex/skills/ui-ux-pro-max/` installed skill. If found, look for `design-system/<company>/MASTER.md` (or any `MASTER.md`). Also check for page‑level overrides at `design-system/<company>/pages/<page-name>.md`.

### 2. Read and Apply Tokens
Read the `MASTER.md` file. It contains:
- CSS custom properties for colors, typography, spacing, shadows.
- Component specs (buttons, cards, inputs, modals) with example CSS.
- Anti‑patterns and a pre‑delivery checklist.

When building a component, use the exact CSS variables declared in the design system. Example:
```css
.btn-primary {
  background: var(--color-primary);
  padding: var(--space-md) var(--space-lg);
  font-family: var(--font-heading);
  box-shadow: var(--shadow-sm);
}
```

If a page override file exists for the current route/page, **its rules take precedence** over `MASTER.md`. For instance, the checkout page might override the primary color or button style.

### 3. No Design System Found
If no design system exists, prompt the user: “Would you like me to generate a UI/UX Pro Max design system? I’ll need a short description of the product (e.g., ‘e-commerce luxury fashion’) and a project name (e.g., ‘LuxStore’).” With consent, run the bundled Python script.

## Generating a New Design System
Use the script installed by the skill:
```bash
python .codex/skills/ui-ux-pro-max/scripts/generate_design_system.py \
  --prompt "e-commerce luxury fashion" \
  --project-name "LuxStore" \
  --output-dir design-system
```
If the skill is installed globally or elsewhere, adapt the path. The script creates a `design-system/luxstore/MASTER.md` file.

Alternatively, you can use the Python module programmatically (if your environment supports it):
```python
from ui_ux_pro_max.design_system import DesignSystemGenerator, persist_design_system

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")
persist_design_system(ds, output_dir="design-system")
```

## Persisting Design Systems
After generating, the `MASTER.md` is automatically created. To also create a page override (e.g., for the checkout page):
```bash
python .codex/skills/ui-ux-pro-max/scripts/persist_design_system.py \
  --design-system-json /tmp/design_system.json \
  --page checkout \
  --output-dir design-system
```
(Adjust based on actual script name.)

## Page Overrides
When a page-specific file exists (`design-system/<company>/pages/<page>.md`), prioritize its rules. The override file can:
- Change color tokens: `--color-primary: #123456;`
- Adjust spacing or typography.
- Override component specs with page‑unique variants.

## Installation Cleanup
To remove the skill from Codex:
```bash
npx uipro-cli uninstall --ai codex
```

## Troubleshooting
- Ensure Python 3.8+ and `pip install -r .codex/skills/ui-ux-pro-max/requirements.txt` if needed.
- The skill directory contains all required assets—no internet connection required after initial install.
