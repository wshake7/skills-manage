# UI/UX Pro Max Skill

UI/UX Pro Max provides a persistent design system for your project. Use this skill whenever you are asked to build or style UI pages or components.

## Design system location
After installation, the design system files are stored in:

```
design-system/<slug>/
├── MASTER.md          # Global design rules
└── pages/
    └── <page>.md      # Page-specific overrides (optional)
```

## How to use the design system
1. Identify the project's design system slug (the folder name inside `design-system/`).
2. Read `design-system/<slug>/MASTER.md`. It contains:
   - CSS custom properties for colors, typography, spacing, and shadows
   - Component specifications (buttons, cards, inputs, modals) with exact CSS
   - Anti-patterns and a pre-delivery checklist
3. Check if a page-specific file exists at `design-system/<slug>/pages/<current-page>.md`.
   - If it exists, its rules take precedence over `MASTER.md` for that page.
4. Apply the design tokens and component styles from the relevant file(s).

## Generating a new design system or page override
If the project does not yet have a design system, or you need to create a page override, use the Python utility:

```python
from design_system import persist_design_system, DesignSystemGenerator

generator = DesignSystemGenerator()
# Replace arguments with the project's description and a slug
ds = generator.generate("e-commerce luxury fashion", "LuxStore")

# Save MASTER.md only
persist_design_system(ds, output_dir="<project_root>")

# Save MASTER.md + a page override for the "checkout" page
persist_design_system(ds, page="checkout", output_dir="<project_root>")
```

Files will be created under `design-system/<slug>/`.

## Context‑aware retrieval pattern
When building a specific page, always:
- Read `design-system/<slug>/MASTER.md`.
- Look for `design-system/<slug>/pages/<page>.md`.
- If the page file exists, prioritize its rules; otherwise stick to the Master rules.

## Typical workflow for a new UI task
1. Verify that a design system exists. If not, ask the user for a description (e.g., “e-commerce fashion store”) and generate it.
2. Read the master design system.
3. Check for a page-specific override for the page you are building.
4. Style all elements using the CSS variables and component specifications from the design system.
5. After implementation, review the pre-delivery checklist in `MASTER.md`.

## CLI management (for users only)
The project may have been initialized with the `uipro` CLI. If you (the AI) are asked to reinstall, update, or uninstall the skill, guide the user to run:

```bash
npm install -g uipro-cli            # install the CLI
nuipro init --ai codex              # re‑install for Codex
nuipro update                       # update to the latest version
nuipro uninstall --ai codex --global # uninstall
```

---
**Remember:** The design system is the single source of truth for UI styling. Always consult it before writing any CSS or JSX styles.