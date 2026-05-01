# UI/UX Pro Max

Provides a UI/UX design system based on a description or project type. Generates tailored design tokens, component guidelines, and layout patterns, with support for persisting and hierarchical overrides.

## When to use

- User asks for a design system, style guide, or UI/UX guidance for a project or specific page.
- User wants to ensure consistent design across pages with global rules and per-page overrides.
- User starts a new project and needs a design foundation.

## Setup (for users)

Ensure the skill is initialized:

```
uipro init --ai codex
```

This places the search script and templates in `.codex/skills/ui-ux-pro-max/`.

## Core commands

All commands are run from the project root.

### Generate and output design system (ephemeral)

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<description>" --design-system -p "<Project Name>"
```

### Generate, persist, and retrieve hierarchically

**Persist master design system:**

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<description>" --design-system --persist -p "<Project Name>"
```

This creates/updates `design-system/MASTER.md` with global design rules.

**Persist a page-specific override:**

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<description>" --design-system --persist -p "<Project Name>" --page "<page-name>"
```

Creates/updates `design-system/pages/<page-name>.md` with overrides for that page.

### Hierarchical retrieval when building a page

When constructing a page, first check if a page-specific override file exists in `design-system/pages/`. If so, its rules take precedence and **override** any conflicting rules in `design-system/MASTER.md`. If no page-specific file exists, use only `design-system/MASTER.md`.

## Workflow

1. **Initial design**: Use `search.py` with `--design-system` to generate a design system based on the user’s description (e.g., "SaaS dashboard with dark theme").
2. **Persist** with `--persist` to save the global design to `MASTER.md`.
3. **Create overrides** when a particular page requires differences (e.g., a checkout page with a lighter theme). Provide the `--page` flag.
4. **When writing frontend code**, always load the relevant design system files. If the user specifies a page, load its override; otherwise, load MASTER.md.
5. **Search for UI patterns**: For queries like "auth modal" or "data table", use the search script to get layout and component suggestions that align with the generated design system.

## Example

User: "I'm building a blog, generate a design system."

AI runs:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "modern blog with clean typography" --design-system --persist -p "MyBlog"
```

The script outputs design tokens, typography scales, color palette, spacing, etc. The AI then reads `design-system/MASTER.md` and uses those rules when generating code.

If user later says "Now build the article page", AI first checks for `design-system/pages/article.md`. If absent, uses MASTER.md. To create an override, AI can run:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "modern blog with clean typography" --design-system --persist -p "MyBlog" --page "article"
```

Now the article page can have slight modifications (e.g., wider content width).