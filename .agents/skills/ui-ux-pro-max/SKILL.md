# UI/UX Pro Max

Generate professional, production-ready UI/UX designs using a systematic design system approach with automatic persistence and hierarchical overrides.

## How to Use

When a user requests a UI design or a page build (e.g., "Build a landing page for my SaaS"), follow this guided workflow:

### 1. Generate a Design System

Use the `DesignSystemGenerator` from the included `design_system` package to create a comprehensive design system tailored to the project's domain and brand name.

```python
from design_system import DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")
```

This produces a dictionary containing:
- Color palette (with CSS variables)
- Typography (heading + body fonts, Google Fonts URL)
- Spacing tokens (`--space-xs` through `--space-3xl`)
- Shadow depths (`--shadow-sm` through `--shadow-xl`)
- Component specs (buttons, cards, inputs, modals) with CSS

### 2. Persist the Design System

Save the design system to disk so it becomes part of the project files. Use `persist_design_system` to create a `MASTER.md` and optional page-specific overrides.

```python
from design_system import persist_design_system

# Save global rules
persist_design_system(ds, output_dir="/path/to/project")
# → design-system/luxstore/MASTER.md

# Save page-specific override (e.g., checkout)
persist_design_system(ds, page="checkout", output_dir="/path/to/project")
# → design-system/luxstore/pages/checkout.md
```

### 3. Retrieve Design Rules Contextually

When building a specific page, always check for the existence of a page-specific override file first. Use the hierarchical pattern:

```
I am building the Checkout page.
Please read design-system/luxstore/MASTER.md.
Also check if design-system/luxstore/pages/checkout.md exists.
If the page file exists, prioritize its rules. Otherwise, use the Master rules.
```

The `MASTER.md` contains the full design system specification, while page files contain variations or additional constraints.

### 4. Implement the Design

Generate HTML/CSS/JS code that strictly follows the design system. Use the CSS variables and class names defined in the `MASTER.md`. Ensure adherence to component specs, spacing, and typography.

## Anti-patterns

- **Don't invent random colors or spacing** — always pull from the design system.
- **Don't ignore page overrides** — if a `pages/*.md` exists, it takes precedence.
- **Don't skip persistence** — design systems must be saved as files to be reused.
- **Don't hardcode design tokens** — use the generated CSS variables.

## Pre-delivery Checklist

Before delivering final code, verify:
- [ ] The design system `MASTER.md` exists in `design-system/[project-name]/`.
- [ ] All CSS classes and variables match the design system.
- [ ] Page-specific overrides are respected.
- [ ] No inline styles override system tokens unnecessarily.
- [ ] Typography and spacing scale consistently.
