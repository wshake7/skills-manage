# Codex Skill: UI/UX Pro Max

This skill equips you to design and implement beautiful, consistent UIs using the **UI/UX Pro Max** design system generator. It provides a systematic workflow for creating design tokens, component specs, and page-specific visual rules—all persisted as hierarchical markdown references.

## When to use this skill

Activate this skill when the user asks you to:

- "Build a landing page for my SaaS product"
- "Create a healthcare dashboard with dark theme"
- "Design a portfolio website with glassmorphism style"
- "Design the checkout page following our brand guidelines"
- "Generate a consistent UI for my e-commerce app"
- Any request involving front‑end UI design, styling, or component implementation

## How this skill works

UI/UX Pro Max generates a *design system* as structured data (colors, typography, spacing, shadows, component specs) and persists it to markdown files. You then read those files when implementing UI code to ensure visual consistency and adherence to the generated rules.

### Installation (for users)

If the skill is not yet installed, the user can add it with:

```bash
# Install globally (recommended for initial setup)
npm install -g uipro-cli
cd /path/to/project
uipro init --ai codex
```

This appends the skill instructions to `AGENTS.md` in the project root. You should remind the user to restart the AI coding assistant afterwards.

Alternative (no CLI): inside a Claude Code session run `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` and then `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill`.

## The design system workflow

Always follow this sequence when the user requests a new UI design or a component overhaul.

### 1. Generate a design system

Use the Python SDK (bundled with the skill) to create a design system dictionary that captures the visual direction.

```python
from design_system import generate_design_system  # convenience wrapper

# Describe the project and brand
ds = generate_design_system(
    description="e-commerce luxury fashion",
    brand_name="LuxStore",
    output_dir="/workspace/design-system/luxstore"
)
```

Alternatively, use the lower‑level generator:

```python
from design_system import DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")
```

### 2. Persist the design system to file(s)

Persist the generated system so that it becomes your reference for every subsequent UI decision.

#### a) Master file (global rules)

```python
from design_system import persist_design_system

result = persist_design_system(ds, output_dir="/workspace/design-system/luxstore")
# Creates: /workspace/design-system/luxstore/MASTER.md
```

**`MASTER.md` contains:**
- Full colour palette with CSS custom properties
- Typography (heading + body fonts, Google Fonts URL, `@import` statement)
- Spacing tokens (`--space-xs` through `--space-3xl`)
- Shadow depths (`--shadow-sm` through `--shadow-xl`)
- Component specs (buttons, cards, inputs, modals) with complete CSS
- Anti‑patterns list (what to avoid)
- Pre‑delivery checklist

#### b) Page‑specific override file

When a particular page needs visual rules that deviate from the global master, persist an override file:

```python
result = persist_design_system(ds, page="checkout", output_dir="/workspace/design-system/luxstore")
# Creates:
#   /workspace/design-system/luxstore/MASTER.md
#   /workspace/design-system/luxstore/pages/checkout.md
```

### 3. Retrieve rules when implementing a page (hierarchical pattern)

Before writing any UI code, **always** retrieve the applicable design rules using this hierarchical lookup:

1. Check if a page‑specific file exists:  
   `design-system/<project>/pages/<page‑name>.md`
2. If it exists → **prioritise its rules** over the global master.
3. If it does **not** exist → use the rules from `design-system/<project>/MASTER.md` exclusively.

*Example retrieval sequence when building the Login page:*

```
I am building the Login page.
Please read design-system/luxstore/MASTER.md.
Also check if design-system/luxstore/pages/login.md exists.
If the page file exists, prioritise its rules. Otherwise, use the Master rules.
```

### 4. Apply the design system in code

When writing HTML/CSS, components, or any styled output:

- Use the CSS custom properties exactly as defined in the design system file.
- Apply the font imports from the `@import` statement and font-family stack.
- Follow component specs literally (button sizing, border-radius, hover effects).
- Adhere to the spacing scale; never use arbitrary px/rem values.
- Respect the anti‑patterns section—it lists common mistakes that break consistency.
- Run through the pre‑delivery checklist before declaring the UI complete.

## Important commands (for your reference)

You may need to remind the user about these CLI operations if they ask about managing the skill:

```bash
uipro versions              # List available design system versions
uipro update                # Update to latest design system
uipro uninstall --ai codex  # Remove the skill from this project
uipro init --ai all         # Install for all supported assistants
```

## Design token examples

These are illustrative; the actual tokens come from the persisted `MASTER.md`:

| Token | Purpose | Example value |
|-------|---------|---------------|
| `--color-primary` | Brand base colour | `#1A1A2E` |
| `--color-primary-hover` | Hover state | `#16162A` |
| `--font-heading` | Heading font stack | `'Playfair Display', serif` |
| `--font-body` | Body font stack | `'Inter', sans-serif` |
| `--space-md` | Medium spacing unit | `1rem` |
| `--shadow-lg` | Large card shadow | `0 10px 30px rgba(0,0,0,0.1)` |

## Anti‑patterns (NEVER do these)

- Never use inline style values that conflict with the design system tokens.
- Never create a page without checking for a page‑specific override file first.
- Never ignore the font imports—they are required for the intended typography.
- Never invent new spacing values outside the `--space-xs` … `--space-3xl` scale.
- Never skip the pre‑delivery checklist; it catches layout, contrast, and accessibility issues.

## Summary

1. When the user wants a UI, generate a design system with `generate_design_system` (or `DesignSystemGenerator`).
2. Persist it to `MASTER.md` (and optionally page overrides).
3. Before coding any page, read the relevant design system file(s) using hierarchical lookup.
4. Apply every token, component spec, and rule from those files.
5. Follow the anti‑patterns and run the checklist before finishing.

This skill turns every UI request into a systematic, brand‑consistent output.