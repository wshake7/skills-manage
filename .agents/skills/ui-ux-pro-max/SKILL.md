# UI/UX Pro Max Skill

Leverage a pre-built, hierarchical design system to deliver pixel-perfect UI/UX in any project. When this skill is invoked (automatically for UI/UX requests or explicitly with `$ui-ux-pro-max <task>`), follow these steps.

## Prerequisites
If the skill isn't installed yet, run:
```bash
uipro init --ai codex
```
This places the necessary scripts and assets inside your Codex skills folder.

## Core Workflow

1. **Interpret the request** and extract a concise design query (e.g., "SaaS dashboard", "landing page", "form wizard").
2. **Retrieve the matching design system** using the provided `search.py` script:
   ```bash
   python3 scripts/search.py "<your query>" --design-system
   ```
3. **Persist the rules across sessions** (recommended):
   ```bash
   python3 scripts/search.py "<query>" --design-system --persist -p "<ProjectName>"
   ```
   Add `--page "<PageName>"` to create page-specific overrides.
4. **Read the generated markdown** (e.g., `design-system/MASTER.md`, `design-system/<page>.md`). These files contain layout, component, spacing, typography, and interaction rules.
5. **Apply the design rules** while implementing the UI/UX. Refer back to the persisted files for consistency in later sessions.

## Example

User: `$ui-ux-pro-max Build a landing page for my SaaS product`

AI steps:
```bash
python3 scripts/search.py "SaaS landing page" --design-system --persist -p "MySaaS" --page "landing"
# Output saved to design-system/MASTER.md and design-system/landing.md
```
Then use the retrieved guidelines to build the page.

## Notes
- The search script reads from a curated library of modern UI/UX patterns. No internet required after init.
- If the script directory is not found, run `uipro init --ai codex` again or use `--offline` to use bundled assets.
- Modifying design-system files? Keep copies in `.shared/ui-ux-pro-max/` to maintain sync across AI assistants.
- For Trae or other assistants, switch to **SOLO** mode where required.