# UI/UX Pro Max Skill

This skill enables AI coding agents to apply UI/UX best practices using the Next Level Builder design system. It uses the `uipro` CLI and a knowledge base search to generate context-aware design rules.

## Prerequisites

- Node.js and npm installed globally
- `uipro-cli` installed globally:
  ```bash
  npm install -g uipro-cli
  ```

## Initialization

In the project root, initialize the skill for Codex:
```bash
uipro init --ai codex
```
This sets up the necessary files and directory structure for the agent to use.

## Usage

### 1. Persist Design System for Hierarchical Retrieval
When tasked with UI/UX work (building a form, dashboard, page, etc.), first fetch the relevant design system rules. Use the search script provided by the skill:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```
- Replace `<query>` with a short description of the UI element or page (e.g., "SaaS dashboard", "login form").
- `-p` sets the project name, used for file organization.
- This creates `design-system/MASTER.md` containing global rules.

### 2. Generate Page‑Specific Overrides (optional)
For a specific page, use `--page` to create a dedicated file:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "page-name"
```
This produces `design-system/pages/page-name.md`, which overrides the master for that page.

### 3. Apply the Design System
After running the script, read the generated Markdown files:
- Start with `design-system/MASTER.md` for universal rules.
- If a page file exists (`design-system/pages/<your-page>.md`), consult it for page‑specific overrides.

Apply the retrieved rules when writing or modifying UI code. These rules cover:
- Component patterns (buttons, cards, inputs)
- Layout guidelines
- Typography and spacing scales
- Color and accessibility standards
- Interaction patterns

### 4. Offline Mode
If network access is unavailable or undesired, use the `--offline` flag with `uipro init` or when running the search script. Bundled assets will be used instead of fetching fresh data.

## Example Workflow

1. **Initialize**: `uipro init --ai codex`
2. **User request**: "Create a SaaS billing settings page"
3. **Agent fetches rules**:
   ```bash
   python3 skills/ui-ux-pro-max/scripts/search.py "billing settings page" --design-system --persist -p "MyApp" --page "billing"
   ```
4. **Agent reads `design-system/MASTER.md` and `design-system/pages/billing.md`.**
5. **Agent generates code** that strictly follows the design system’s patterns and constraints.

## Notes

- The `uipro` CLI is the gatekeeper for all assets; always ensure it’s initialized before using the search script.
- The design system is optimized for modern SaaS and product interfaces.
- If the skill directory differs (e.g., `.claude/skills/ui-ux-pro-max`), adjust the script path accordingly. Typically after `uipro init --ai codex`, the script resides under `skills/ui-ux-pro-max/scripts/search.py`.
- Do **not** alter the generated design-system files; they are the source of truth for the project’s UI rules.