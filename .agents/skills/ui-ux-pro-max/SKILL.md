# UI/UX Pro Max

## Purpose
Generate and apply production-ready design systems instantly. When asked for a new design, UI component, or full page layout, use the built-in design system generator to produce consistent tokens, CSS, and anti-patterns.

## Workflow

### 1. Check for existing design system
Look for `design-system/<project>/MASTER.md` and any page overrides (`design-system/<project>/pages/<page>.md`). If a page override exists, it takes precedence over the master rules.

### 2. Generate a design system (if none exists)
```bash
python3 scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```
This returns a complete design system dictionary (colors, typography, spacing, shadows, component specs, anti-patterns, pre-delivery checklist).

### 3. Persist the design system
```python
from design_system import persist_design_system, DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")

# Save master only
persist_design_system(ds, output_dir="design-system/luxstore")

# Save master + page override
persist_design_system(ds, page="checkout", output_dir="design-system/luxstore")
```

### 4. Apply the design system
- Read the MASTER.md and page override (if present).
- Use CSS variables for colors (e.g., `var(--color-primary)`).
- Apply typography with `@import` of Google Fonts and font-family rules.
- Use spacing tokens (`--space-xs` → `--space-3xl`) and shadow depths (`--shadow-sm` → `--shadow-xl`).
- Copy component CSS (buttons, cards, inputs, modals) directly.
- Before delivering, review the anti-patterns and pre-delivery checklist in the design system.

## Key Rules
- **Always prefer the persisted design system** if it exists.
- **Page overrides beat master** – check for `pages/<page>.md` and apply its rules.
- Generate a fresh design system only when the user explicitly requests a new design/style.
- Use the exact tokens and CSS from the generated files; do not invent new values.

## Commands
- `uipro init --ai codex` – initial installation (appends this skill to AGENTS.md).
- `uipro update` – update to latest version.
- `uipro versions` – list available versions.
- `uipro uninstall` – remove the skill.
