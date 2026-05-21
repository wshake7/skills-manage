# UI/UX Pro Max Skill

Use UI/UX Pro Max to infuse every interface with design intelligence that is aesthetic, accessible, and industry-appropriate. The skill works by referencing a **design system** saved in your project, giving your AI coding agent concrete rules for color, typography, spacing, shadows, component specs, anti-patterns to avoid, and a pre-delivery checklist.

## Installation

Run the CLI installer in your project:

```bash
# From your project root (after global install: npm install -g uipro-cli)
uipro init --ai codex
```

Or directly with npx:

```bash
npx uipro-cli init --ai codex
```

This appends the necessary instructions to your `AGENTS.md` file. Restart your coding assistant afterward.

- `uipro versions` – list available design system versions.
- `uipro update` – update to the latest version.
- `uipro uninstall` or `uipro uninstall --ai codex` – remove the skill.

## How to Use the Design System

### 1. Load the design system

When a UI/UX task begins, look for existing design system files:

- `design-system/<brand>/MASTER.md` – global design tokens and rules.
- `design-system/<brand>/pages/<page-name>.md` – page-specific overrides.

**Prioritize page overrides.** If a page file exists, its rules override the MASTER.md for that page. If no file is found, fall back only to MASTER.md.

Read both files when they exist. They contain CSS custom properties, component specs, and explicit anti-patterns.

### 2. Apply the tokens

Use the **exact values** from the design system files:

- **Colors** – reference CSS variables (e.g., `var(--color-primary)`). Do not invent new shades.
- **Typography** – load the specified Google Font and use the `@import` rule if provided; match heading and body font stacks.
- **Spacing** – use the `--space-*` tokens (`--space-xs` through `--space-3xl`).
- **Shadows** – apply `--shadow-sm` through `--shadow-xl` as defined.
- **Components** – follow the given CSS snippets for buttons, cards, inputs, modals, etc.

### 3. Avoid anti-patterns

Every MASTER.md includes a list of things **not** to do. Read it and stay consistent.

### 4. Run the pre-delivery checklist

When you finish a UI, go through the checklist printed in MASTER.md (if present) to catch common issues.

## Generating a New Design System (Persist Pattern)

If no design system exists yet, you can generate and persist one using the Python library included with UI/UX Pro Max.

```python
from design_system import persist_design_system, DesignSystemGenerator

# Generate a design system dict
generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")

# Persist MASTER.md only
result = persist_design_system(ds, output_dir="/path/to/project")

# Or persist MASTER.md + a page override for "checkout"
result = persist_design_system(ds, page="checkout", output_dir="/path/to/project")
```

After persisting, inform the user and immediately read the created files to guide further UI coding.

## Always-On Guidance

UI/UX Pro Max runs in the background. When you receive a request like “Build a landing page for a SaaS product”, automatically:

1. Check for `design-system/*/MASTER.md`.
2. Read it and any page override.
3. Derive every visual decision from that data.
4. If no system exists, ask if the user wants to generate one, or apply sound generic design principles while suggesting persisting.

## Reference

- CLI: `uipro init --ai codex` (install), `uipro versions`, `uipro update`, `uipro uninstall`.
- Python API: `DesignSystemGenerator().generate()`, `persist_design_system()`.
- Design files: `design-system/[brand]/MASTER.md`, `design-system/[brand]/pages/[page].md`.

Keep the output always grounded in the defined design system. When in doubt, re-read the MASTER.md and page files.
