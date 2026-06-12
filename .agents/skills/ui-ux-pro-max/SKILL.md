# UI/UX Pro Max Skill

This skill enforces a consistent design system across the project. It provides design tokens, component specs, and anti-patterns to ensure high-quality UI/UX.

## When to Use
- Building or modifying any UI component (pages, components, layouts).
- Styling with CSS, Tailwind, or any CSS-in-JS solution.
- Reviewing UI code for visual consistency.

## Design System Structure
The design system is defined in a **MASTER.md** file and optional **page-specific overrides** stored in `design-system/<project-name>/`. For example:
- `design-system/myapp/MASTER.md` — the single source of truth for all design tokens and global rules.
- `design-system/myapp/pages/<page-name>.md` — overrides or exceptions for a specific page (e.g., `checkout.md`). When a page file exists, its rules take precedence over MASTER.md.

## Required Reading
Before generating any UI code, **always**:
1. Locate the project’s design system directory (look for `design-system/` at the project root; if using Claude, check `.claude/skills/ui-ux-pro-max/` as well).
2. Read the **MASTER.md** (e.g., `design-system/<project>/MASTER.md`).
3. Determine the page or component context (e.g., "checkout page", "settings modal").
4. Check if a page-specific override exists: `design-system/<project>/pages/<context>.md`. If it exists, read and **prioritize** its rules over MASTER.md.

## Applying Design Tokens
The MASTER.md defines CSS custom properties (variables) for:
- Color palette (backgrounds, text, accent, semantic colors)
- Typography (heading and body fonts, sizes, weights, line heights)
- Spacing scale (`--space-xs` to `--space-3xl`)
- Shadow depths (`--shadow-sm` to `--shadow-xl`)
- Border radius
- Transitions

**Always** use these variables directly in your CSS or as Tailwind theme extensions. Do not hardcode colors, spacings, or fonts.

## Component Specifications
The MASTER.md includes concrete specs for common components (buttons, cards, inputs, modals, etc.). Follow the specs exactly:
- Sizes, variants, states (hover, focus, disabled, active)
- Layout and spacing
- Accessibility requirements (focus rings, color contrast)
- Content guidelines (button text, placeholders)

When a needed component isn’t defined, use the existing tokens to design a consistent component and consider suggesting an addition to MASTER.md.

## Anti-Patterns & Pre-Delivery Checklist
The MASTER.md lists common anti-patterns and a pre-delivery checklist. **After** generating UI code, run through the checklist:
- Verify all colors are from the palette (no custom hexes).
- Ensure typography uses the system font stack.
- Check spacing tokens are used correctly.
- Validate shadow and border radius consistency.
- Confirm responsive design and accessibility (focus states, contrast).

If the checklist fails, fix the violations before delivering.

## CLI & Project Integration
The UI/UX Pro Max skill is installed via `uipro-cli` (run `npx uipro-cli init --ai <platform>`). This creates the skill file (like this AGENTS.md) and may include pre-built design system templates in `design-system/`. Use the provided design system if available; otherwise, you can generate a new one using the `design_system.py` script bundled with the skill (see `scripts/design_system.py`). Example:
```bash
python scripts/design_system.py generate --brand "mybrand" --output design-system/myapp
```

## Codex-specific Instructions
This skill is injected into AGENTS.md. Always follow these rules when generating or reviewing UI code. When in doubt, consult the design-system files first.

## Version Management
To update the skill or manage design system versions, use:
```bash
npx uipro-cli versions
npx uipro-cli update
npx uipro-cli uninstall
```