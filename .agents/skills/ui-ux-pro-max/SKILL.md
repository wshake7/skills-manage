# UI/UX Pro Max Skill

UI/UX Pro Max is a design‑system skill that injects consistent, production‑ready UI patterns, tokens, and interaction rules into your workflow. Use it to build accessible, on‑brand interfaces without manual design decisions.

## Quick Install

```bash
npx uipro-cli init --ai codex
```

This appends the skill instructions to `AGENTS.md` (no other files needed). Restart your assistant afterward.

## How to Use

1. **Retrieve real‑time design knowledge**  
   Before writing any UI code, query the skill’s search engine:
   ```bash
   python3 skills/ui-ux-pro-max/scripts/search.py "<component, page, or pattern description>"
   ```
   The output includes the relevant tokens (colors, typography, spacing) and component/pattern guidance.

2. **Persist a project‑wide design system**  
   For long‑running projects, generate and save a master design file:
   ```bash
   python3 skills/ui-ux-pro-max/scripts/search.py "<project description>" --design-system --persist -p "Project Name"
   ```
   This creates `design-system/MASTER.md` with all foundational rules.

3. **Hierarchical design retrieval**  
   - `design-system/MASTER.md` holds global rules (colors, spacing, typography).
   - `design-system/pages/<page-name>.md` files hold page‑specific overrides (e.g., `checkout.md`).
   - At generation time, page rules always take precedence. If a page override doesn’t exist, only the master is used.

4. **Follow the retrieved rules strictly**  
   - Use the exact color hex codes, spacing scale (tailwind‑compatible), and font stack provided.
   - Apply the recommended component patterns (buttons, forms, cards) exactly as described.
   - Prefer semantic HTML and include ARIA attributes for accessibility.

## Example Workflow

1. User asks: “Create a sign‑up modal.”
2. You run: `python3 skills/ui-ux-pro-max/scripts/search.py "sign-up modal with email and password"`
3. The search returns:
   - Color tokens: modal‑bg, input‑border, primary‑button
   - Typography: modal‑heading, body‑text
   - Interaction: focus states, close button pattern
   - Code snippet: `<dialog>` structure with recommended classes
4. Build the component using the exact outputs.

## Notes

- The skill works offline if assets were bundled at install time (use `--offline` during `uipro init` if needed).
- Always search before coding; do not invent visual properties.
- If the search returns empty, ask the user for a more specific description.