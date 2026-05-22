# UI/UX Pro Max Skill

## Overview
UI/UX Pro Max is a design intelligence skill that provides AI assistants with access to a searchable database of 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types, and 161 reasoning rules. It automatically activates on UI/UX work requests, offering direct design recommendations.

## Installation
To install UI/UX Pro Max in a Codex project, run:
```
npx uipro-cli@latest init --ai codex
```
This appends the skill instructions to the existing `AGENTS.md` file.

Alternatively, install globally:
```
npm install -g uipro-cli
uipro init --ai codex --global
```

## Workflow Mode
Use the slash command to invoke the skill:
```
/ui-ux-pro-max Build a landing page for my SaaS product
```
This triggers the skill to provide design system recommendations.

## Persisting Design System
Use the Python function `persist_design_system` to save a design system as `MASTER.md` and page-specific overrides. This creates a hierarchical retrieval pattern:
- Global rules: `design-system/<project-name>/MASTER.md`
- Page rules: `design-system/<project-name>/pages/<page>.md`

The AI should:
1. Generate a design system using `DesignSystemGenerator`.
2. Call `persist_design_system(ds, output_dir=project_dir)` to create MASTER.md.
3. For specific pages, also call `persist_design_system(ds, page="page-name", output_dir=project_dir)`.

When asked about a specific page, the AI must check for a page override file first; if present, prioritize its rules over MASTER.md.

## Key Commands
- `uipro versions` – list available versions
- `uipro update` – update to latest
- `uipro uninstall` – remove from current platform

## Design System Data
The skill provides:
- Full color palette table with CSS variables
- Typography (Google Fonts @import)
- Spacing tokens (--space-xs to --space-3xl)
- Shadow depths
- Component specs (buttons, cards, inputs, modals) with CSS
- Anti-patterns and pre-delivery checklist

The AI should use these tokens and patterns when building UI components.

## Example Usage
1. User: "Create a checkout page for an e-commerce luxury fashion brand."
2. AI installs the skill (if not present) or ensures `uipro init --ai codex` has been run.
3. AI uses the skill's data to generate a design system using `DesignSystemGenerator` and persists it.
4. AI builds the page using the design system tokens, following the page override if exists.
5. AI applies UX guidelines and anti-pattern checks from the skill.