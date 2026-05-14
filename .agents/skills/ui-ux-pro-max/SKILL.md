# UI/UX Pro Max Skill

## Purpose
Enforce a consistent, production‑ready design system using generated tokens and hierarchical rules. Use this skill whenever you build or refine UI for a project.

---

## Setup
```bash
npx uipro-cli@latest init --ai codex
```
After running this command, the skill is appended to `AGENTS.md` and ready to use.

---

## Workflow

### 1. Generate a Design System
Create a project‑specific design system with a single command:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<brief description>" --design-system --persist -p "ProjectName"
```
- **Output**: `design-system/projectname/MASTER.md` (global rules) and (optionally) page overrides.
- **Example**: `python3 skills/ui-ux-pro-max/scripts/search.py "modern SaaS dashboard" --design-system --persist -p "Acme"`

### 2. Retrieve Design Rules
Before styling any page:
- Always read `design-system/projectname/MASTER.md` for tokens and component specs.
- Check for a page‑specific override: `design-system/projectname/pages/[page-name].md`.
- **Priority**: If the override exists, apply those rules **instead of** the master rules.

### 3. Apply Tokens
Use CSS variables from the generated system in all code:
- Colors: `var(--color-primary)`, `var(--color-bg)`, …
- Spacing: `var(--space-xs)` → `var(--space-3xl)`
- Shadows: `var(--shadow-sm)` → `var(--shadow-xl)`
- Typography: `var(--font-heading)`, `var(--font-body)`

### 4. Build Components
Follow the specifications inside `MASTER.md` for buttons, cards, inputs, modals, etc. Use the provided CSS snippets as a starting point.

### 5. Pre‑delivery Checklist
Confirm that the final UI:
- Uses only defined tokens (no hardcoded values)
- Respects all component specs
- Avoids the anti‑patterns listed in `MASTER.md`

---

## Python API (Optional)
For integration into build pipelines or scripts:
```python
from design_system import persist_design_system, DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")
result = persist_design_system(ds, output_dir="/path/to/project")
# Creates MASTER.md

# Add a page‑specific override
result = persist_design_system(ds, page="checkout", output_dir="/path/to/project")
# Creates pages/checkout.md
```

---

## Notes
- The design system persists on disk – refer to it in any session without re‑generating.
- Always re‑read `MASTER.md` after a skill update (`uipro update`).
- Use `uipro versions` to list available versions and `uipro uninstall` to remove the skill.