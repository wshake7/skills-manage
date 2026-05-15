# UI/UX Pro Max

Expert UI/UX design system skill that generates production‑ready design tokens, components, and page‑level rules.

## Installation

Use the `uipro` CLI to install the skill into any project:

```bash
npm install -g uipro-cli
uipro init --ai codex
```

For offline or global installs see `uipro --help`.

## Usage

Once installed, the skill activates on every prompt. You can also invoke it explicitly in supported assistants:

```
/ui-ux-pro-max Build a checkout page for a fintech app
```

## Design System Persistence

Generate and persist a design system to disk for context‑aware retrieval across sessions:

```python
from design_system import persist_design_system, DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("luxury fashion", "LuxStore")

# Global rules
persist_design_system(ds, output_dir="/path/to/project")
# → /project/design-system/luxstore/MASTER.md

# Page‑specific override
persist_design_system(ds, page="checkout", output_dir="/path/to/project")
# → /project/design-system/luxstore/pages/checkout.md
```

### Hierarchical Design Retrieval

When building a specific page:
1. Read `design-system/project-name/MASTER.md` for global rules.
2. Check if a corresponding page override exists at `design-system/project-name/pages/<page-name>.md`.
3. If the override exists, prioritise its rules; otherwise, use the global rules from `MASTER.md`.

## Design System Contents

The generated MASTER.md includes:
- Full colour palette with CSS variables
- Typography (heading + body fonts, Google Fonts URL, @import)
- Spacing tokens (`--space-xs` … `--space-3xl`)
- Shadow depths (`--shadow-sm` … `--shadow-xl`)
- Component specs (buttons, cards, inputs, modals) with real CSS
- Anti‑patterns list
- Pre‑delivery checklist

## Workflow Example

1. Run `uipro init --ai codex` in the project root.
2. Prompt: “Design a SaaS landing page with a hero, features grid, and pricing tier.”
3. The skill generates a full design system and page‑specific overrides as needed.
4. Use `persist_design_system` to save the output for later retrieval.
5. For a new page (e.g., “Pricing”), the skill checks `pages/pricing.md` and falls back to `MASTER.md`.