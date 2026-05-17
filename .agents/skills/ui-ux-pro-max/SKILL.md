# UI/UX Pro Max Design Intelligence Skill

This skill equips you with tools and workflows to generate, persist, and apply professional design systems directly in your projects. It bridges the gap between design intent and coded implementation, ensuring every page you build follows a coherent visual language.

## Directory Structure (when installed via `uipro init --ai codex`)

When you run `uipro init --ai codex` (or the skill is otherwise present), the following structure is created or appended to your project:

- `AGENTS.md` — Augmented with global instructions that activate this skill.
- `.codex/skills/ui-ux-pro-max/SKILL.md` — This file (the skill's reference).
- `skills/ui-ux-pro-max/scripts/` — Core Python scripts:
  - `search.py` – CLI entry point for design system generation and searching.
  - `design_system.py` – The `DesignSystemGenerator` and `persist_design_system` utilities.
- `skills/ui-ux-pro-max/data/` — Templates and assets for the design system.
- `design-system/` — Output directory for persisted design systems:
  - `MASTER.md` — Global design rules (colors, typography, spacing, shadows, components).
  - `pages/` — Page-specific overrides (e.g., `checkout.md`).

## How to Use This Skill

### Step 1: Initialize the Skill in Your Project

If the skill is not yet set up, install it with the CLI (requires Node.js and npm):

```bash
npx uipro-cli init --ai codex   # appends to AGENTS.md and downloads skill files
```

You only need to do this once per project.

### Step 2: Core Workflows

#### 2a: Generate a Design System On-the-Fly

When starting a new UI task (e.g., "Build a landing page for a SaaS product"), you can generate a fresh design system using the installed scripts. This is optional—you can also work from an existing persisted design system.

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "SaaS landing page" --design-system -p "My SaaS"
```

- `--design-system` flag tells the script to output a complete design system.
- `-p` specifies the project name (used for naming the output directory).

The script will print a design system dictionary. To save it, use the `--persist` flag (see below).

#### 2b: Persist the Design System (Master + Page Overrides)

The recommended pattern is hierarchical: a global `MASTER.md` that applies everywhere, and optional page‑specific overrides in `pages/`. This allows you to lock down a consistent foundation while accommodating per‑page exceptions.

To persist the design system:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "e-commerce luxury fashion" --design-system --persist -p "LuxStore"
```

This will create:

- `design-system/luxstore/MASTER.md` — global rules.
- (Optionally) `design-system/luxstore/pages/checkout.md` if a page argument is provided (see below).

**With a page override:**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "e-commerce luxury fashion" --design-system --persist --page checkout -p "LuxStore"
```

Now, whenever I am working on the “checkout” page, I will:

1. Read `design-system/luxstore/MASTER.md` first.
2. Check if `design-system/luxstore/pages/checkout.md` exists.
3. **Prioritize the page-specific rules if present**; otherwise, fall back to the master rules.

#### 2c: Retrieve Design Rules in Your Code Generation

**Before generating any front‑end code**, always check for a persisted design system. The hierarchy is:

1. `design-system/<project>/MASTER.md` — always required if it exists.
2. `design-system/<project>/pages/<pagename>.md` — applies only to that specific page.

If neither exists, you can generate a new system on‑the‑fly with `python3 skills/ui-ux-pro-max/scripts/search.py "keyword" --design-system -p "project"` (without `--persist`) and use its output without saving, but persistence is recommended for consistency across sessions.

**Example retrieval prompt I can execute internally:**

- Read `design-system/luxstore/MASTER.md` to obtain colors, fonts, spacing, shadows, and base component CSS.
- Then look for `design-system/luxstore/pages/checkout.md`. If found, its rules override the master where applicable.
- Use the extracted CSS variables and component specs directly in my code. For example, I would write `background: var(--color-surface);` and use the pre‑defined button classes/shadows.

### Step 3: Applying the Design System to Code

A generated `MASTER.md` contains:

- **CSS variables** for the color palette (example: `--color-primary: #111111; --color-surface: #ffffff;`).
- **Typography table** with Google Fonts import URL and `@import` statement.
- **Spacing scale** (tokens like `--space-xs` through `--space-3xl`).
- **Shadow depths** (`--shadow-sm` to `--shadow-xl`).
- **Component specifications** with ready‑to‑use CSS blocks for buttons, cards, inputs, modals, etc.
- **Anti‑patterns list** (e.g., avoid mixing multiple font families, don't use raw hex when a token exists).
- **Pre‑delivery checklist** (contrast ratios, responsive sizing, consistent interactions).

When implementing a component, I will:

1. Copy the relevant component CSS from the master file.
2. Replace placeholder values (if any) with the design‑system tokens.
3. Ensure I adhere to the anti‑patterns and checklist before considering the task done.

#### Example Component Implementation

If a button spec says:

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: 0.5rem;
  font-size: var(--text-base);
  box-shadow: var(--shadow-sm);
}
```

I will mirror that exactly, only modifying content or numbers if a page override demands it.

### Step 4: Maintaining the Design System

- Use `uipro update` (CLI) to fetch any upstream improvements to the skill.
- To remove the skill, run `uipro uninstall --ai codex`.

## Reference: CLI Commands

```bash
npx uipro-cli init --ai codex          # install skill into current project
npx uipro-cli update                    # update to latest version
npx uipro-cli uninstall --ai codex     # remove skill
```

## Internal Script Usage

From the project root (after installation):

```bash
# Generate and print a design system
python3 skills/ui-ux-pro-max/scripts/search.py "modern SaaS dashboard" --design-system -p "DashPro"

# Persist globally
python3 skills/ui-ux-pro-max/scripts/search.py "modern SaaS dashboard" --design-system --persist -p "DashPro"

# Persist with page override
python3 skills/ui-ux-pro-max/scripts/search.py "modern SaaS dashboard" --design-system --persist --page settings -p "DashPro"
```

The Python module can also be used programmatically, but the CLI covers all typical needs.

## Design System File Structure (Reminder)

```
design-system/
  <project-name>/
    MASTER.md                  ← Global rules (colors, typography, spacing, components)
    pages/
      <pagename>.md            ← Page overrides (higher priority than MASTER.md)
```

**Priority rule:** When a `pages/<pagename>.md` exists for the page you are building, use its rules; otherwise, follow `MASTER.md`.

## Anti‑patterns (summary from MASTER.md)

- Do not hardcode colors when a CSS variable exists.
- Do not mix multiple font families beyond what is specified.
- Avoid duplicating component styles inline – always use the base component CSS from the design system.
- Never skip contrast checks on text and interactive elements.

## Pre‑delivery Checklist (before marking a UI task complete, verify)

- All colors are used via CSS variables (or fallbacks defined).
- Spacing follows the design system tokens.
- Typography is loaded from the specified Google Fonts URL and applied.
- Interactive components (buttons, inputs) have focused, hover, and disabled states.
- Responsive behaviour is tested (using design system breakpoints if present).

---

When a user asks to build or refactor any UI, immediately run through the hierarchical retrieval process and use the persisted design system. If none exists, generate one first.
