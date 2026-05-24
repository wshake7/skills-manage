# UI/UX Pro Max

A powerful design system generator that helps you create stunning, production‑ready UIs consistently across any project.

## Installation

Install the CLI globally and initialize for Codex:

```bash
npm install -g uipro-cli
uipro init --ai codex
```

This appends the skill instructions to your project’s `AGENTS.md`, where Codex will automatically load them.

## Usage Workflow

### 1. Determine the design needs
Ask the user for the project’s aesthetic style (e.g., `"luxury e‑commerce"`, `"SaaS dashboard"`, `"minimalist blog"`) and brand name.

### 2. Generate and persist the design system
Run the included search script with your query to generate a design system and persist it into the project directory:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "luxury e-commerce fashion" --design-system --persist -p "LuxStore"
```

Alternatively, use the Python API:

```python
from design_system import persist_design_system, DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("luxury e-commerce fashion", "LuxStore")
result = persist_design_system(ds, output_dir="/path/to/project")
```

This creates:
- `design-system/<brand>/MASTER.md` – the full design system with tokens, component specs, and guidelines.
- Optionally `design-system/<brand>/pages/<page>.md` when the `--page` argument or the API’s `page` parameter is used.

### 3. Retrieve the design rules (Hierarchical Pattern)
When building a specific page component, follow this order:
1. Check for a page‑specific override file: `design-system/<brand>/pages/<page>.md`
2. If present, its rules **override** the master rules.
3. Otherwise, fall back to `design-system/<brand>/MASTER.md`.

**Always** read the master file first, then check for a page override.

### 4. Build UI components using the design tokens
Use the CSS variables defined in the design system (`--primary`, `--space-md`, `--shadow-sm`, etc.) when writing component markup and styles. The design system `MASTER.md` already provides full CSS examples for buttons, cards, inputs, and modals – reuse them as starting points.

### 5. Apply anti‑patterns and pre‑delivery checklist
Before delivering code, verify that you’re **not** violating any anti‑patterns listed in the design system (e.g., inconsistent spacing, hard‑coded colors). Then run through the pre‑delivery checklist included in the design system to ensure production readiness.

## Design System Contents (MASTER.md)

- Full color palette with CSS custom properties
- Typography specs (Google Fonts URL, `@import` statement, heading/body font stacks)
- Spacing scale tokens (`--space-xs` … `--space-3xl`)
- Shadow depths (`--shadow-sm` … `--shadow-xl`)
- Component reference implementations:
  - Buttons (primary, secondary, sizes)
  - Cards (with image, text, actions)
  - Input fields (text, textarea, select)
  - Modals (overlay, dialog, animations)
- Anti‑patterns to avoid
- Pre‑delivery checklist

## Maintenance Commands

| Command | Description |
|---------|-------------|
| `uipro versions` | List available skill versions |
| `uipro update`   | Update to the latest version  |
| `uipro uninstall`| Remove the skill from the current project |

## Notes for AI Agents

- Always persist the design system **before** starting any UI work.
- Prefer the `search.py` script for quick generation; use the Python API for programmatic control.
- The generated CSS variables are project‑scoped – you can override them later by editing the design system files.
- The skill is offline‑capable (use `uipro init --offline`) but defaults to fetching the latest assets from GitHub.
