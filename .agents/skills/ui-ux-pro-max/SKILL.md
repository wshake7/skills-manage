# UI/UX Pro Max – Design System Generator

## Overview

This skill provides tools and workflows to generate, persist, and enforce consistent design systems across projects. It creates a **MASTER.md** with global design tokens (colors, typography, spacing, shadows, component specs) and optional **page‑specific overrides** stored in `design-system/pages/`.

## When to Use This Skill

- Starting a new UI project or feature
- Asked to "make it look professional" or "consistent"
- Refactoring existing UI to match a design system
- Before delivering UI code: always run the checklist

## Initialization (Project Setup)

The skill is installed into the project via the `uipro` CLI. If it is not yet present, instruct the user to run:

```bash
npx uipro-cli init --ai codex
```

This appends the core instructions to `AGENTS.md`. **Do not regenerate if already present.**

## Design System Files (Hierarchical Retrieval)

When working on UI for a specific page, **always** follow this priority:

1. **Page override file** (if exists): `design-system/<project-slug>/pages/<page-name>.md`
2. **Master design system**: `design-system/<project-slug>/MASTER.md`

Example prompt: "Read `design-system/luxstore/MASTER.md`. Also check if `design-system/luxstore/pages/checkout.md` exists; if so, prioritize its rules."

## Generating a Design System

If a design system does not yet exist for the project, generate it using the included Python scripts.

### Option 1 – CLI via `search.py` (from skill directory)

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<description>" --design-system --persist -p "Project Name"
```

This creates:

- `design-system/<project-slug>/MASTER.md`
- `design-system/<project-slug>/pages/` directory (empty initially)

### Option 2 – Python module (recommended when page overrides are known upfront)

```python
from design_system import persist_design_system, DesignSystemGenerator

# 1. Generate design system dictionary
generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")

# 2. Persist MASTER.md only
persist_design_system(ds, output_dir="/path/to/project")

# 3. Persist MASTER.md + page override
persist_design_system(ds, page="checkout", output_dir="/path/to/project")
```

For direct generation with persistence use:

```python
generate_design_system(
    "SaaS dashboard analytics",
    project_name="MyApp",
    persist=True,
    page="dashboard"
)
```

## What the Design System Contains

Every `MASTER.md` includes:

- Full color palette with CSS variables
- Typography (heading + body fonts, Google Fonts URL, CSS `@import`)
- Spacing tokens (`--space-xs` through `--space-3xl`)
- Shadow depths (`--shadow-sm` through `--shadow-xl`)
- Component specs (buttons, cards, inputs, modals) with concrete CSS
- Anti-patterns list (what **not** to do)
- Pre‑delivery checklist

## Using the Design System in Code

1. **Import the CSS variables** into your stylesheet (copy from `MASTER.md`).
2. **Reference tokens** for colors, spacing, shadows.
3. **Apply the component classes** (or utility classes) as specified.
4. **Avoid hard‑coded values** – use `var(--color-primary)` not `#3b82f6`.

## Project Structure Example

```
project-root/
├── AGENTS.md                         # (appended skill instructions)
├── skills/ui-ux-pro-max/             # skill installation
│   ├── SKILL.md
│   ├── scripts/
│   │   └── search.py
│   └── ...
├── design-system/
│   └── luxstore/
│       ├── MASTER.md
│       └── pages/
│           └── checkout.md
└── ...
```

## Pre‑Delivery Checklist (always run)

Before marking UI work as done, verify:

- [ ] All colors match the design system tokens
- [ ] Typography uses the correct font families and sizes
- [ ] Spacing uses the defined spacing scale
- [ ] Shadows come from the design system
- [ ] No hard‑coded values (unless a deliberate override)
- [ ] Page‑specific rules (if any) are respected
- [ ] Component interactions (hover, focus, disabled) are consistent

## Anti‑patterns (avoid)

- Using raw hex codes or arbitrary `px` values
- Mixing multiple font families
- Inconsistent border radii
- Skipping the checklist
