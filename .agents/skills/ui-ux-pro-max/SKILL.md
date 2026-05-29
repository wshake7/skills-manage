# UI/UX Pro Max Skill

Design system generator and hierarchical design rule manager for production‑ready UI code.

## Purpose

When building any user interface, use this skill to produce consistent, scalable designs backed by a central **design system** (colors, typography, spacing, shadows, component specs) and **page‑specific overrides**.

---

## Workflow

1. **Check for existing design system**  
   Look for `design-system/<project-name>/MASTER.md` inside the project root.

2. **Read MASTER.md**  
   It contains the complete design‑token dictionary as CSS custom properties, component specifications, anti‑patterns, and a pre‑delivery checklist.

3. **Check for page overrides**  
   If the file `design-system/<project-name>/pages/<page-name>.md` exists, its rules **override** the matching MASTER rules for that specific page. Always prefer page overrides when present.

4. **Apply design rules**  
   - Use the CSS variables from the palette and spacing/shadow tokens.  
   - Follow the component specs (buttons, cards, inputs, modals) including hover/focus states.  
   - Avoid listed anti-patterns.  
   - Before delivering any UI, verify against the pre‑delivery checklist.

5. **Generate a new design system** (when none exists or when requested)  
   Invoke the `design_system` module:
   ```python
   from design_system import persist_design_system, DesignSystemGenerator

   generator = DesignSystemGenerator()
   ds = generator.generate("brief description", "ProjectName")

   # Save MASTER.md only
   persist_design_system(ds, output_dir="./")

   # Save page override
   persist_design_system(ds, page="checkout", output_dir="./")
   ```
   This creates `design-system/projectname/MASTER.md` and optionally `design-system/projectname/pages/checkout.md`.

6. **Retrieve context** (typical pattern)  
   > *"I am building the Checkout page. Please read design-system/projectname/MASTER.md.
   > Also check if design-system/projectname/pages/checkout.md exists.
   > If the page file exists, prioritize its rules. Otherwise, use the Master rules."*

---

## MASTER.md Structure Summary

- **Color Palette** – CSS variable table with light/dark variants (`--color-primary`, `--color-bg`, …)  
- **Typography** – heading & body font families, Google Fonts URL + `@import`, scale (`--font-size-*`, `--line-height-*`)  
- **Spacing** – 8‑point grid tokens (`--space-xs` … `--space-3xl`)  
- **Shadows** – 4–5 depths (`--shadow-sm` … `--shadow-xl`)  
- **Component Specs** – Buttons (sizes, shapes, hover, focus), Cards, Inputs, Modals. Each includes actual CSS snippets.  
- **Anti‑Patterns** – concrete pitfalls to avoid (e.g., hardcoded colors, mismatched spacing)  
- **Pre‑Delivery Checklist** – items to validate before final output (accessibility, responsive breakpoints, token usage)

---

## Installation (for project setup)

```bash
# Install the CLI globally
npm install -g uipro-cli

# Add this skill to your AGENTS.md
cd /path/to/project
uipro init --ai codex
```

## Example Invocation

```
Build a landing page for a SaaS product using the existing design-system/saaspro/MASTER.md
```

The agent will read `MASTER.md`, apply its tokens, generate components from the spec, and validate with the checklist.
