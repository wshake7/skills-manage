# UI/UX Pro Max

A comprehensive design system skill for building consistent, production-ready user interfaces.

## Activation

Activate this skill when USER requests building UI components, pages, or full web applications. Also activate for any design-related tasks such as creating style guides, token systems, or layout patterns.

## Core Workflow

1. **Generate Design System**: Use the built-in design system generator to create a token-based design system tailored to the brand/product. You can either run the Python script from the installed ui-ux-pro-max scripts (if available) or manually generate the system following the specifications below.

2. **Persist Design System**: Save the generated design system to `design-system/<project-name>/MASTER.md`. If generating for a specific page, also create `design-system/<project-name>/pages/<page-name>.md` with overrides. Use the hierarchical retrieval pattern described next.

3. **Hierarchical Retrieval**: Before building any page, read `design-system/<project-name>/MASTER.md`. Then check if a corresponding page override file exists in `design-system/<project-name>/pages/<page-name>.md`. If the page file exists, its rules take precedence over the master rules.

4. **Build UI**: Use the design tokens, component specs, and patterns from the design system to implement the UI. Always reference the CSS variables defined in the system, and follow the anti-pattern avoidance and pre-delivery checklist.

## Design System Specification

### Token Categories

- **Color Palette**: Primary, secondary, accent, neutral, semantic (error, success, warning). Generate CSS custom properties on `:root`.
- **Typography**: Heading and body font families, font weights, line heights. Include Google Fonts @import or link.
- **Spacing**: Base unit (e.g., 4px) → scale: `--space-xs` to `--space-3xl`.
- **Shadows**: `--shadow-sm` to `--shadow-xl`.
- **Border Radius**: `--radius-sm`, `--radius-md`, `--radius-lg`.

### Component Specs

For each component (buttons, cards, inputs, modals, etc.), define:
- **Structure**: HTML element sequence with appropriate attributes.
- **Styling**: CSS that uses only the design tokens.
- **States**: Hover, active, disabled, focus.
- **Variants**: Primary, secondary, outline, etc.

### Anti-Patterns

- Never use hardcoded pixel/hex values after design system is established.
- Don't skip reading MASTER.md before building a page.
- Avoid inconsistent spacing; use the spacing scale.
- Never omit accessibility attributes (aria-labels, roles, etc.).

### Pre-Delivery Checklist

- [ ] Design system files (MASTER.md and optionally page files) exist.
- [ ] All components use tokens exclusively.
- [ ] Responsive breakpoints handled.
- [ ] Accessible (contrast, focus outlines, ARIA).
- [ ] No console errors or warnings.
- [ ] Pixel-perfect against the generated specs.

## Example: Persisting a Design System

```python
# If the ui-ux-pro-max scripts are installed (via uipro init), run:
python scripts/persist_design_system.py --project "my-app" --output-dir .
# Or use the provided function in your own Python code:
from design_system import persist_design_system
persist_design_system(design_system_dict, page="checkout", output_dir=".")
```

If the scripts are unavailable, manually create `design-system/my-app/MASTER.md` using the template:

```markdown
# My App Design System

## Color Palette
--color-primary: #3B82F6;
...

## Typography
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
--font-heading: 'Inter', sans-serif;
--font-body: 'Inter', sans-serif;
...

## Spacing
--space-xs: 4px;
...
```

## Additional Notes

- After installing this skill via `uipro init --ai codex`, the `AGENTS.md` file in your project will be updated with this content.
- For first-time setup, run `npx uipro init --ai codex` to auto-append.
- If working with an existing project that already has a design system, rely on the hierarchical retrieval to decide which rules apply.
