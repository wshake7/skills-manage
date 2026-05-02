# UI/UX Pro Max Skill

**Purpose:** Generate and persist a searchable design system for any project, enabling hierarchical retrieval of design rules (global master + per-page overrides) to guide the AI in creating pixel-perfect, production-ready UIs consistent with the project's brand.

**When to Use:**  
- Before starting any UI work on a new project that lacks design guidelines.  
- When you need to align component design with a project's brand identity.  
- When building a specific page that may have overrides from the master design system.

---

## Setup

Ensure the CLI is installed and the skill is initialized for your environment:

```bash
npm install -g uipro-cli       # Install CLI globally
uipro init --ai codex           # Initialize for Codex (this skill)
```

> Use `uipro init --offline --force` to use bundled assets and overwrite existing files if needed.

---

## Generate a Design System

Run the search script with the `--design-system` flag, a descriptive query, and the `--persist` flag to save to `design-system/MASTER.md`. Include `-p "Project Name"` for branding.

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

**Example:**  
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "modern SaaS dashboard, dark mode, data-heavy" --design-system --persist -p "AnalyticsPro"
```

This creates `design-system/MASTER.md` with the global design rules.

---

## Page‑Specific Overrides

For a page that needs custom rules (like a checkout or settings page), append `--page "page-name"`:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "checkout"
```

This generates `design-system/pages/checkout.md` with rules that override the master.

---

## Hierarchical Retrieval Workflow

When the AI builds a component for a particular page:

1. Check if a page‑specific file exists: `design-system/pages/<page>.md`.  
2. If it does, **use that file’s rules exclusively** – they override the master.  
3. If not, fall back to `design-system/MASTER.md`.

This ensures a consistent global baseline with targeted, contextual adjustments.

---

## Important Guidance

- **No design system?** Initialize it first before generating any UI code.  
- **Always run the search** with a query that captures the visual style, tone, and key UX patterns of the product.  
- **Use `--persist`** to keep the design system across sessions.  
- **For a new page**, create an override file early to avoid design drift.
