# UI/UX Pro Max

AI-powered design system generator for consistent, beautiful UIs with hierarchical overrides.

## Installation

Install the skill for your AI coding assistant:

```bash
npx uipro-cli init --ai codex   # Appends to AGENTS.md
```

## Design System Generation

Generate a design system using the `generate_design_system` function or the `DesignSystemGenerator` class.

```python
from design_system import DesignSystemGenerator, persist_design_system

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")
```

## Persisting Design Systems

Use `persist_design_system` to save design rules to disk. This creates a `MASTER.md` global file and optional page-specific overrides.

```python
# Save MASTER.md only
result = persist_design_system(ds, output_dir="/path/to/project")

# Save MASTER.md + page override for "checkout"
result = persist_design_system(ds, page="checkout", output_dir="/path/to/project")
```

## Hierarchical Retrieval Pattern

When implementing a page, read the design system files in this priority:

1. Check if `design-system/{project}/pages/{page}.md` exists — use its rules if present.
2. Fall back to `design-system/{project}/MASTER.md` for all other rules.

Example: "I am building the Checkout page. Please read `design-system/luxstore/MASTER.md`. Also check if `design-system/luxstore/pages/checkout.md` exists. If the page file exists, prioritize its rules. Otherwise, use the Master rules."

## MASTER.md Contents

The MASTER.md includes:
- Full color palette with CSS variables
- Typography (fonts, sizes, weights) with Google Fonts imports
- Spacing tokens (--space-xs through --space-3xl)
- Shadow depths (--shadow-sm through --shadow-xl)
- Component specs (buttons, cards, inputs, modals) with CSS
- Anti-patterns to avoid
- Pre-delivery checklist

## Pre-delivery Checklist

Before finalizing any UI, verify:
- [ ] Colors use only the defined palette variables
- [ ] Fonts match the design system
- [ ] Spacing follows the token scale
- [ ] Shadows use the defined depths
- [ ] Components follow the specs
- [ ] No anti-patterns are present

## Additional Commands

```bash
uipro versions       # List available versions
uipro update         # Update to latest version
uipro uninstall --ai codex   # Remove from this project
```