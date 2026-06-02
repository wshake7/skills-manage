# UI/UX Pro Max Skill

**A design intelligence layer for AI coding agents.** 
Automatically selects color palettes, typography, spacing, shadows, and component specifications tailored to the project's industry and brand, while filtering out industry-specific anti‑patterns. Persists design rules for reuse across sessions, with hierarchical override support for per‑page customizations.

---

## 1. Installation

Install the CLI globally or per project:

```bash
npm install -g uipro-cli
```

Then initialise the skill files for your AI assistant:

```bash
# Project-local install (e.g., for Claude)
uipro init --ai claude

# Other assistants: cursor, windsurf, copilot, kiro, roocode, gemini, codex
# Install for all detected assistants:
uipro init --ai all

# Global install (available to every project)
uipro init --ai claude --global
```

The command creates the appropriate skill/rules file and supporting assets (`data/`, `scripts/`) in the project (or user home for global). Restart your assistant after installation.

---

## 2. Generating a Design System

Use the provided `design_system` Python module to create a context‑aware design system. The generator accepts an industry description, a brand name, and optional custom instructions.

```python
from design_system import persist_design_system, DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")

# Persist to disk
result = persist_design_system(ds, output_dir="/path/to/project")
```

This creates:
- `design-system/luxstore/MASTER.md` – global design tokens, component specs, anti‑patterns, and checklist.
- Optionally, pass `page="checkout"` to also generate a page‑specific override file.

---

## 3. Hierarchical Retrieval (MASTER.md + Page Overrides)

When building a page, **always** load the design rules in this order:

1. **Read** `design-system/<brand>/MASTER.md` for global rules.
2. **Check** for a page override at `design-system/<brand>/pages/<page-name>.md`.
3. **If the page file exists**, it takes precedence over the master for that page.

Example prompt:
> “I am building the Checkout page. Please read design-system/luxstore/MASTER.md. Also check if design-system/luxstore/pages/checkout.md exists. If the page file exists, prioritize its rules. Otherwise, use the Master rules.”

This ensures contextual consistency while allowing page‑specific deviations.

---

## 4. What’s Inside MASTER.md

Each master design system file includes:
- **Color Palette** – full table with CSS custom properties (`--color-primary`, …)
- **Typography** – heading and body fonts, Google Fonts `@import` URL
- **Spacing Tokens** – `--space-xs` through `--space-3xl`
- **Shadow Depths** – `--shadow-sm` through `--shadow-xl`
- **Component Specs** – buttons, cards, inputs, modals with real CSS examples
- **Anti‑patterns** – exact UI choices to avoid for that industry
- **Pre‑delivery Checklist** – quality gates before finalising the UI

---

## 5. Agent Workflow Summary

When asked to build a UI feature:

1. Confirm the project’s **industry** and **brand name**.
2. Ensure a design system exists (run generator if not).
3. Load the appropriate `MASTER.md` and any page override.
4. Apply the design tokens directly – never invent new colours, shadows, or spacing that conflict with the system.
5. Cross‑reference the **anti‑patterns** list to avoid known bad practices.
6. After implementation, check the **pre‑delivery checklist**.
7. If the user wants to persist changes to the design system, use `persist_design_system` with the same brand name to update the files.

---

## 6. CLI Quick Reference

| Command | Description |
|---------|-------------|
| `uipro init --ai <assistant>` | Install skill for that assistant |
| `uipro init --ai all` | Install for every detected assistant |
| `uipro versions` | List available skill versions |
| `uipro update` | Update to the latest version |
| `uipro uninstall [--ai ...]` | Remove skill files |

For offline installation (no GitHub download), append `--offline`.

---

**Remember:** This skill gives you a pre‑built design system. Always use it; do not fall back to default generic styling unless a design system cannot be generated and the user explicitly accepts raw output. The goal is production‑quality, opinionated UI that matches the industry and brand.