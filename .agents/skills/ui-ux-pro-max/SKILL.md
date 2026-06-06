# UI/UX Pro Max

## Description

UI/UX Pro Max is a design‑system enforcement skill that ensures every piece of UI code respects a consistent, production‑grade visual language. It generates a full design system (colors, typography, spacing, shadows, component specs, validation rules) from a project brief, persists it as a `MASTER.md` file, and supports page‑level overrides for granular control. The AI must consult these design rules before writing any markup or styles, and must strictly follow the hierarchical retrieval pattern.

## Installation

The skill is distributed via the `uipro-cli` npm package.

```bash
npm install -g uipro-cli
cd /path/to/your/project
uipro init --ai codex      # → AGENTS.md (appended)
```

For a global installation (available to all projects):
```bash
uipro init --ai codex --global
```

After installation, restart the AI coding assistant. The skill is now active and will guide all UI‑related requests.

## Instructions for the AI

### 1. Recognising when to activate

The skill applies whenever the user asks to:
- Build a page, a component, or an entire UI.
- Create a design system from a brand brief.
- Update or enforce design consistency.
- “Make it look professional” / “Follow our design system”.

### 2. Core workflow

#### Step 1 – Generate the design system

Use the python helpers (already available in the skill environment) to produce a design system dictionary.

```python
from design_system import DesignSystemGenerator, persist_design_system

generator = DesignSystemGenerator()
ds = generator.generate(project_brief="e-commerce luxury fashion", project_name="LuxStore")
```

#### Step 2 – Persist the design system

Save the design system as a `MASTER.md` file. Optionally, create page‑specific override files.

```python
# Global rules only
persist_design_system(ds, output_dir=project_root)
# → design-system/luxstore/MASTER.md

# With a page override
persist_design_system(ds, page="checkout", output_dir=project_root)
# → design-system/luxstore/MASTER.md
# → design-system/luxstore/pages/checkout.md
```

#### Step 3 – Retrieve the rules before writing code

When the user asks to build a page:
1. Read `design-system/<project_slug>/MASTER.md`.
2. Check if `design-system/<project_slug>/pages/<page_name>.md` exists.
3. If the page override exists, **its rules take precedence**. Any property not overridden inherits the master rule.
4. If no override exists, use only the master rules.

#### Step 4 – Apply the design tokens

The `MASTER.md` contains the definitive visual language for the project:
- **Color palette**: CSS variables (e.g., `--color-primary`, `--color-surface`).
- **Typography**: Heading & body font families, Google Fonts import URL, `--font-size-*` and `--line-height-*` variables.
- **Spacing**: Tokens from `--space-xs` to `--space-3xl`.
- **Shadows**: `--shadow-sm` through `--shadow-xl`.
- **Component specs**: Buttons, cards, inputs, modals – each with exact CSS (border-radius, padding, hover effects, etc.).
- **Anti‑patterns**: A list of explicitly forbidden styles (e.g., “Never use pure black `#000`, use `--color-text`”).
- **Pre‑delivery checklist**: Validation steps to run before finishing (contrast ratios, responsive fallbacks, etc.).

Every CSS class or inline style **must** map to a token defined in the design system. Never invent new values.

### 3. Post‑generation validation

After writing frontend code, silently verify against the checklist from `MASTER.md`. If any rule is violated, correct it immediately without asking.

### 4. Handling missing design systems

If the user asks for UI code but no design system exists for the project:
- **Do not** guess or hard‑code arbitrary styles.
- Instead, ask: “I don’t see a design system for this project yet. Would you like me to generate one? Just give me a short description of the brand or product.”

## Example interaction

**User**: “Build a checkout page for LuxStore.”

**AI (thinking)**:
1. Look for `design-system/luxstore/MASTER.md` → exists.
2. Look for `design-system/luxstore/pages/checkout.md` → exists.
3. Read both. Override says checkout cards use `border-radius: var(--radius-lg)` while master says `var(--radius-md)` → use large radius.
4. Apply all tokens and component specs, write HTML + CSS.
5. Run checklist: contrast ok, no forbidden hex colors, spacing tokens used.

**AI (response)**: Produces the page code, fully compliant.

## Notes

- The design system files are human‑readable Markdown; the AI must read them as plain text.
- `project_slug` is the lowercased, kebab‑cased version of the project name used in `DesignSystemGenerator`.
- The CLI command `uipro init --ai codex` only needs to run once per project; the skill then persists across sessions.
- Global install (`--global`) makes the skill available even when no local installation exists.