# UI/UX Pro Max

**Purpose:** Generate and enforce a consistent, token‑driven design system for any project. The skill provides a CLI installer (`uipro init`) for project integration and a Python API (`design_system`) to create, persist, and retrieve design tokens and component specs.

## When to Use
Activate this skill **automatically** whenever the user asks to:
- Build a UI component, page, or full app (landing page, SaaS dashboard, e‑commerce, etc.)
- Create or update a design system
- Ensure visual consistency across an existing codebase

## Core Workflow (AI Agent Steps)

1. **Generate a design system** – Use the Python `design_system` module to produce a complete set of tokens based on a product description and project name.

2. **Persist the design system** – Save the output as a `MASTER.md` (global rules) and optionally as page‑specific overrides. This creates a retrievable, hierarchical design source.

3. **Retrieve the appropriate rules** – Before writing code for a specific page, read `design-system/<project>/MASTER.md` and check for `design-system/<project>/pages/<page>.md`.  If the page file exists, **its rules override the MASTER rules**.

4. **Apply tokens and component specs** – Use the CSS variables and component definitions from the retrieved file(s) to generate consistent markup and styles.

## Design System Generation

Use the `DesignSystemGenerator` class to create a design dictionary:

```python
from design_system import DesignSystemGenerator, persist_design_system

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", project_name="LuxStore")
```

## Persisting and Retrieving Tokens

Save the design system with `persist_design_system`. This creates a `MASTER.md` and optional page‑level overrides:

```python
# MASTER.md only
result = persist_design_system(ds, output_dir="/path/to/project")

# MASTER.md + page override for "checkout"
result = persist_design_system(ds, page="checkout", output_dir="/path/to/project")
```

**File structure after persist:**  
`design-system/luxstore/MASTER.md`  
`design-system/luxstore/pages/checkout.md` (when `page` is given)

**Retrieval pattern** – Always execute these steps in your agent logic:

1. Read `design-system/<project>/MASTER.md`.
2. Check if `design-system/<project>/pages/<page>.md` exists.
3. If the page file exists, prioritize its rules over MASTER.
4. Apply the tokens (colors, spacing, shadows, fonts) and component specs (buttons, cards, inputs, modals) from the chosen file.

## Design Token Reference

The generated `MASTER.md` includes:

- **Colors:** Full palette table with CSS variables (`--color-primary`, `--color-background`, etc.)
- **Typography:** Heading & body fonts, Google Fonts URL, CSS `@import`
- **Spacing:** `--space-xs` … `--space-3xl`
- **Shadows:** `--shadow-sm` … `--shadow-xl`
- **Component specs (CSS snippets):** Buttons, cards, inputs, modals
- **Anti‑patterns list:** (e.g., never use raw hex values; rely on the token variables)
- **Pre‑delivery checklist:** (e.g., verify all spacing uses token, all interactive states defined)

## Anti‑Patterns to Avoid

- Hard‑coding colors, font sizes, or spacing outside the design tokens
- Ignoring page‑specific overrides when they exist
- Using inline styles instead of CSS variables from the design system
- Failing to check for `MASTER.md` before writing any front‑end code

## Pre‑Delivery Checklist

Before handing off the generated UI, verify:

- [ ] All colors, spacing, and shadows reference the design‑system CSS variables
- [ ] Typography uses the specified font stack and @import
- [ ] Page overrides have been applied if present
- [ ] Interactive elements (hover, focus, disabled) are styled
- [ ] No raw hex/rgb values appear in the final code

## Installation (User Facing)

The user can install the skill automatically via CLI. For Codex integration:

```bash
npm install -g uipro-cli
uipro init --ai codex   # appends this skill content to AGENTS.md
```

After installation the AI agent will have access to the full design‑system toolchain.