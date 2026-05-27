---
name: ui-ux-pro-max
description: AI-powered design system generator for building stunning, cohesive web interfaces. Use this skill to generate production-ready design systems, component taxonomies, and page-specific layout overrides.
---

# UI/UX Pro Max — Codex Skill

This skill equips the AI coding agent to work with the **UI/UX Pro Max** design system generator. It provides concrete commands and patterns to create, persist, and leverage design rules directly in your project.

## Setup

Ensure the global CLI is available. If not, install it:

```bash
npm install -g uipro-cli
```

Activate the skill in your project (appends to `AGENTS.md`):

```bash
npx uipro-cli init --ai codex
```

After installation, restart your assistant. You can now issue design prompts directly.

## Core Workflow

### 1. Generate a Design System

Use the `generate_design_system` function to create a complete UI kit from a natural language description. The function returns a structured design token set (colors, typography, spacing, shadows, border radii, component patterns, etc.) and can optionally persist the rules to disk.

**Basic call:**
```javascript
generate_design_system(
  "SaaS landing page for a developer tool",
  project_name="DevTool"
)
```

**Persist globally (creates `design-system/MASTER.md`):**
```javascript
generate_design_system(
  "SaaS landing page for a developer tool",
  project_name="DevTool",
  persist=true
)
```

### 2. Page‑Specific Overrides

When a design should differ for a particular page, supply the `page` parameter. The generator creates a `pages/[page].md` file that overrides global rules:

```javascript
generate_design_system(
  "Analytics dashboard with dark sidebar",
  project_name="DevTool",
  persist=true,
  page="dashboard"
)
```

**File structure after persist:**
```
design-system/
├── MASTER.md          ← global design rules
└── pages/
    └── dashboard.md   ← dashboard-specific overrides
```

### 3. Apply the Design

After generation, instruct the AI to build UI components using the design tokens. The assistant will read `design-system/MASTER.md` automatically (if the project is configured for hierarchical retrieval). Always **reference the master file** for consistency:

> *Build a hero section using the DevTool design system. Follow the typography and spacing rules in design-system/MASTER.md.*

When page-specific rules are present, prioritize `pages/[page].md` for that page’s components.

## CLI Reference

| Command | Purpose |
|---------|---------|
| `npx uipro-cli init --ai codex` | Install/update the AGENTS.md skill for Codex |
| `npx uipro-cli init --ai codex --global` | Install globally (all projects) |
| `npx uipro-cli init --ai codex --offline` | Use bundled assets only, no network |
| `uipro versions` | List available design system versions |
| `uipro update` | Update the CLI to the latest release |
| `npx uipro-cli uninstall --ai codex` | Remove the skill from the current project |

## Design Token Usage

When the AI generates code, adhere to the tokens defined in the persisted design system. For example:

- **Colors:** `var(--color-primary)`, `var(--color-neutral-100)`
- **Typography:** `font-family: <MASTER.md font stack>`; sizes from `step-0`, `step-1`, …
- **Spacing:** `var(--space-xs)`, `var(--space-m)`, `var(--space-xl)`
- **Shadows:** `var(--shadow-card)`, `var(--shadow-dropdown)`

If the user requests a custom element, pull its styling from the closest pre‑defined token rather than inventing new values.

## Example Session

**User:** "Build a pricing page for my SaaS, DevTool."
**Agent:** (internally pings the skill) → calls `generate_design_system("SaaS pricing page", "DevTool", persist=true, page="pricing")` → reads `design-system/pages/pricing.md` → produces a responsive, token‑compliant pricing layout.

Proceed with the exact workflow above whenever the user asks for a new page, component, or full redesign.