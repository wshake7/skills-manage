# UI/UX Pro Max Skill

This skill gives you design intelligence to generate production-ready UI/UX systems and apply consistent styling to any web project.

## Installation

To enable the design toolkit in a project, run:

```bash
npx uipro-cli init --ai codex
```

This installs the skill’s assets locally and prepares the environment for design system generation.

## Core Workflow

### 1. Generate a Design System

When the user requests a design (e.g., “Build a landing page for a SaaS product”), generate a design system dictionary using the provided Python tooling, then persist it.

```python
from design_system import DesignSystemGenerator, persist_design_system

generator = DesignSystemGenerator()
ds = generator.generate("modern SaaS", "AcmeCloud")

# Persist the global design system
persist_design_system(ds, output_dir="/path/to/project")
# → creates design-system/acmecloud/MASTER.md
```

### 2. Apply the Master + Override Pattern

Design rules are hierarchical:

1. Always read `design-system/<name>/MASTER.md` first. It contains:
   - Full color palette (CSS variables)
   - Typography (Google Fonts URL, `@import`, heading/body rules)
   - Spacing tokens (`--space-xs` … `--space-3xl`)
   - Shadow depths (`--shadow-sm` … `--shadow-xl`)
   - Component specifications (buttons, cards, inputs, modals) with actual CSS
   - Anti-patterns list
   - Pre-delivery checklist

2. For page-specific rules, check `design-system/<name>/pages/<page-name>.md`.
   - If it exists, **its rules override the Master rules** for that page.
   - The retrieval pattern:
     > “I am building the Checkout page. Please read `design-system/luxstore/MASTER.md`. Also check if `design-system/luxstore/pages/checkout.md` exists. If it exists, prioritize its rules. Otherwise, use the Master rules.”

### 3. Use Design Tokens in Code

Translate the token values from MASTER.md directly into HTML/CSS. For example:

```css
:root {
  --color-primary: # … ;   /* from MASTER.md palette */
  --font-heading: 'Inter', sans-serif;
  --space-md: 1rem;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
}
```

Implement components using the specifications provided—never invent new styles unless no rule exists and the change is justified.

### 4. Follow Anti‑patterns and Checklist

Before finishing any UI work, review the **Anti-patterns** list in MASTER.md. Then run through the **Pre-delivery checklist** to ensure accessibility, responsiveness, and consistency.

## Advanced Usage

- Generate a page-specific override by passing `page="<name>"`:
  ```python
  persist_design_system(ds, page="checkout", output_dir="/path/to/project")
  ```
  This creates `design-system/<name>/pages/checkout.md` alongside MASTER.md.

- Update the skill with `npx uipro-cli update`.
- Uninstall via `npx uipro-cli uninstall`.

## Workflow Mode

In supported assistants, you can trigger the skill with `/ui-ux-pro-max` followed by a natural-language request. In Codex, just describe the UI/UX task normally—the skill’s guidance takes over.

---

Remember: every design decision must be justified by the persisted design system. Never guess colors, fonts, or spacing; always pull them from the active MASTER.md.