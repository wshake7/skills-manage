# UI/UX Pro Max Skill

A design system generator that searches multiple sources, applies reasoning, and produces consistent UI patterns, styles, colors, typography, and effects. This skill is invoked automatically for UI/UX requests in Codex CLI, or explicitly with `$ui-ux-pro-max <task>`.

## Prerequisites

Initialize the skill for Codex:
```bash
uipro init --ai codex
```
Additional options:
- `--offline` : use bundled assets only, skip network calls.
- `--force`   : overwrite existing files if already installed.

After initialization, the skill scripts reside in `skills/ui-ux-pro-max/scripts/`.

## Workflow

When a user requests UI/UX design, interface creation, or brand styling:

1. **Extract context** – identify the product type, industry, and keywords from the request (e.g., "saas dashboard", "beauty spa", "fintech crypto").
2. **Generate a design system** by running the search script:
   ```bash
   python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
   ```
   This outputs a comprehensive design system including layout patterns, color schemes, typography, spacing, effects, and anti-patterns.
3. **Persist the design system** (optional) for reuse across sessions:
   ```bash
   python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" [--page "page_name"]
   ```
   - Master rules go to `design-system/MASTER.md`.
   - Page‑specific overrides go to `design-system/<page_name>.md`.
4. **Format output as documentation** (optional) with `-f markdown`.
5. **Apply the generated system** to build UI components. Use the returned colors, typography, spacing tokens, and visual patterns consistently. Avoid the listed anti‑patterns.

## Examples

- Generate a design system for a SaaS dashboard named “MyApp”:
  ```bash
  python3 skills/ui-ux-pro-max/scripts/search.py "saas dashboard analytics" --design-system -p "MyApp"
  ```
- Persist the design system and also create a dashboard‑specific override:
  ```bash
  python3 skills/ui-ux-pro-max/scripts/search.py "saas dashboard" --design-system --persist -p "MyApp" --page "dashboard"
  ```
- Output in markdown for documentation:
  ```bash
  python3 skills/ui-ux-pro-max/scripts/search.py "ecommerce fashion" --design-system -f markdown
  ```

## Notes

- Use `--offline` when building without internet access to rely on bundled assets.
- Page overrides are hierarchical: specific page files take precedence over `MASTER.md` for that page.
- The skill’s output is only as good as the query – choose descriptive, concise keywords.
