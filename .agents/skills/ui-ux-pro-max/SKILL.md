# UI/UX Pro Max Skill

## Overview

UI/UX Pro Max is a design system generator for AI coding assistants. It provides a CLI tool (`uipro`) to install skill files and a Python library to generate and persist complete design systems (colors, typography, spacing, shadows, component specs) directly into your project. The system uses a hierarchical **MASTER.md + page overrides** pattern: global design rules in `MASTER.md`, with optional page-specific overrides in `pages/[page-name].md`.

## Setup (one-time)

Use the CLI to install the UI/UX Pro Max skill into your project.

```bash
npm install -g uipro-cli
cd /path/to/your/project
uipro init --ai codex        # Appends instructions to AGENTS.md
uipro update                 # Keep the skill up-to-date
```

After installation, your AI assistant will have access to the workflows described here.

## Workflow

### 1. Generate and Persist a Design System

When a user needs a consistent UI (e.g., "Build a SaaS dashboard"), generate and save the design system using the Python library.

```python
from design_system import DesignSystemGenerator, persist_design_system

# Generate a design system (based on project description and name)
generator = DesignSystemGenerator()
ds = generator.generate("SaaS dashboard analytics", project_name="MyApp")

# Persist as MASTER.md (global rules)
persist_design_system(ds, output_dir=".")

# Or persist with a page-specific override for added specificity
persist_design_system(ds, page="dashboard", output_dir=".")
```

This creates:
- `design-system/myapp/MASTER.md`
- Optionally: `design-system/myapp/pages/dashboard.md` (if `page` is provided)

### 2. Retrieve the Design System for a Page

When you start building a specific page, **always**:

1. Read `design-system/<project_name>/MASTER.md` first.
2. Check if a page-specific file exists at `design-system/<project_name>/pages/<page_name>.md`.
3. If the page file exists, **its rules take priority** over the master rules. Otherwise, rely solely on the master rules.

Example retrieval statement:
> "I am building the Checkout page. Reading design-system/luxstore/MASTER.md and checking for design-system/luxstore/pages/checkout.md."

### 3. Apply Design Rules to UI Code

**Strictly adhere** to the design system when writing HTML/CSS/React components. The `MASTER.md` (and overrides) contains:

- **CSS Variables**: Use the provided `--color-*, --font-*, --space-*, --shadow-*` variables exactly.
- **Typography**: Import the specified Google Fonts and apply the heading/body font families.
- **Spacing & Shadows**: Use the token scale (e.g., `var(--space-md)`) for margins/padding.
- **Component Specs**: Implement buttons, cards, inputs, modals, etc., following the exact CSS rules (colors, hover states, border-radii, shadows).
- **Anti-Patterns**: Avoid actions listed in the anti-patterns section.

Never invent colors, sizes, or styling that conflict with the design system. If a requirement demands a variation, first check if it can be met with existing tokens; if not, propose a consistent extension based on the existing scale.

### 4. Pre-Delivery Checklist

After building the page, run through the checklist in `MASTER.md` to ensure:

- All interactive elements match the component specs.
- Colors and spacing are consistent.
- Typography is correctly applied.
- No anti-patterns are present.

## Important Notes

- The design system directory is under `design-system/<project_name>/`.
- If a design system already exists, reuse it; do not regenerate unless the user explicitly requests a new design or changes the project name.
- Use the exact variable names and tokens from the generated files. The system is the single source of truth for UI styling.
- The CLI `uipro` commands are for maintenance (update, versions, uninstall) and are not required during routine coding.
