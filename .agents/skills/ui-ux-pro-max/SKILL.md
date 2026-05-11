# UI/UX Pro Max

Generate comprehensive design systems by searching real-world patterns across multiple domains. The skill produces styles, colors, typography, effects, and anti-patterns, then persists them for hierarchical retrieval across sessions.

## When to Use

Invoke this skill whenever the user asks you to:
- Create a UI/UX design, design system, or component library
- Build a landing page, dashboard, SaaS product, e‑commerce site, or any interface
- Improve or redesign an existing interface
- Generate a style guide or brand guidelines

You can trigger the skill explicitly by typing `$ui-ux-pro-max` followed by a request (e.g., `$ui-ux-pro-max design a luxury spa landing page`).

## Setup

If the skill has not been initialized in the project, run:

```bash
uipro init --ai codex --force
```

This installs the necessary scripts and assets into `.codex/skills/ui-ux-pro-max/`.

## Workflow

### 1. Run the Design System Search

Build a query from the user’s request: **product type, industry, and relevant keywords**. Always add the `--design-system` flag. Optionally persist results with `--persist` and name the project.

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py \
  "<product_type> <industry> <keywords>" \
  --design-system \
  --persist \
  -p "Project Name"
```

Examples:

- `python3 .codex/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system --persist -p "Serenity Spa"`
- `python3 .codex/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard data analytics" --design-system --persist -p "GrowthLytics"`

### 2. Generate Page-Specific Overrides (Optional)

If the user asks for a specific page (dashboard, settings, profile, etc.), add the `--page` flag to create a page-level override file.

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py \
  "<query>" \
  --design-system \
  --persist \
  -p "Project Name" \
  --page "<page_name>"
```

### 3. Read the Generated Design Files

The script creates a `design-system/` folder containing:

- `MASTER.md` – Global design rules (colors, typography, spacing, patterns, anti-patterns)
- `pages/<page_name>.md` – Page-specific overrides (if `--page` was used)

Read both files to understand the full design intent.

### 4. Apply the Design System

When writing code (HTML, CSS, React, Vue, etc.):

- Use the **colors, typography scales, spacing units, and effects** from `MASTER.md`.
- Follow **patterns** exactly as described (layouts, component variants, micro-interactions).
- **Never deviate** from the identified anti-patterns.
- For a specific page, incorporate any overrides from the page file.

## Tips

- Use `--persist` in every invocation so future sessions can retrieve the same system contextually.
- If you need to update or extend a persisted system, run the script again with the same `-p` name.
- The search script downloads live references from Context7; an offline fallback is available within the bundled assets.
