# UI/UX Pro Max Skill for AI Coding Assistants

This skill enables you to generate and apply professional, production-ready design systems directly within your coding workflow. It provides a CLI-based toolchain for design system generation, persistence, and hierarchical retrieval.

## Overview

UI/UX Pro Max installs a set of scripts and assets into your project that help you:
- Quickly generate a comprehensive design system (colors, typography, spacing, shadows, components) based on a natural language description.
- Persist design systems as MASTER.md files and page-specific overrides.
- Retrieve design rules hierarchically (page overrides take precedence over global rules).

## Installation (for human users)

The skill is typically installed via the `uipro` CLI:

```bash
# Global install
npm install -g uipro-cli

# Install into current project for a specific AI platform
uipro init --ai codex   # Appends skill content to AGENTS.md
```

As an AI agent, you don't need to install it; assume the skill is already set up in the project's `skills/` directory or integrated into the agent's workspace.

## Core Workflow

### 1. Generating a Design System

Use the bundled Python script to generate a design system from a query.

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "<Project Name>" [--page "<page-name>"]
```

- `<query>`: natural language description of the desired design (e.g., "minimalist SaaS dashboard")
- `--design-system`: enables design system generation mode
- `--persist`: saves the output as files
- `-p`: project name (used for directory naming)
- `--page` (optional): generate a page-specific override file in addition to the master

Example:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "e-commerce luxury fashion brand" --design-system --persist -p "LuxStore" --page "checkout"
```

This creates:
- `design-system/luxstore/MASTER.md`
- `design-system/luxstore/pages/checkout.md`

### 2. Retrieving Design Rules

When building a specific page or component, always check for the existence of:

1. `design-system/<project>/pages/<page-name>.md` — if present, **prioritize** the rules in this file over the master.
2. If no page override exists, fall back to `design-system/<project>/MASTER.md`.

The MASTER.md contains:
- Full color palette table with CSS variables
- Typography (heading and body fonts, Google Fonts URL, CSS @import)
- Spacing tokens (`--space-xs` through `--space-3xl`)
- Shadow depths (`--shadow-sm` through `--shadow-xl`)
- Component specs (buttons, cards, inputs, modals) with actual CSS
- Anti-patterns list
- Pre-delivery checklist

### 3. Applying the Design System

When writing code (HTML/CSS/JSX, etc.):

- Use the CSS variables defined in the design system (e.g., `var(--color-primary)`, `var(--space-md)`, `var(--shadow-lg)`).
- Follow component specifications exactly (border-radius, padding, hover states, etc.).
- Adhere to the anti-patterns and checklist from the MASTER.md before delivering code.

## Hierarchical Override Pattern

The design system supports a master + overrides model:

- **MASTER.md**: Global rules applicable to the entire project.
- **pages/<page>.md**: Rules that override the master for a specific page. If a page file exists, you **must** use its rules instead of the master's default for that page. This allows for page-specific branding or layout exceptions.

When instructed to work on a page, always check for a page-level design file first.

## Python API (if needed)

In some environments, you might use the Python API directly:

```python
from design_system import persist_design_system, DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")
result = persist_design_system(ds, output_dir="/path/to/project")
# For page override:
result = persist_design_system(ds, page="checkout", output_dir="/path/to/project")
```

Prefer the CLI approach unless you are running from within a Python environment where you need programmatic control.

## Important Notes for AI Agents

- Always verify that the design system files exist before using them. If not, ask the user to run the generation command or run it on their behalf.
- When generating new design systems, explain the command you are about to run and confirm with the user if they want to persist the result.
- The `--page` flag is optional; use it only when the user explicitly requests a page-specific design or when you detect that the current task is building a distinct page that warrants an override.
- If you encounter a script execution error, verify that Python is available and the required dependencies are installed.

## References

- CLI repository: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- Design system format: based on Context7 standard.

This skill is designed to be vendor-agnostic and works across Codex, Claude, and other AI-assisted coding environments.