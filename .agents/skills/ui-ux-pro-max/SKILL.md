# UI/UX Pro Max Skill

This skill equips the AI with a comprehensive UI/UX design engine and tooling for generating, searching, and persisting design systems. It enables the assistant to provide in-depth, context-aware design recommendations, generate consistent UI components, and adapt to specific stack requirements.

**Skill Triggers:** Automatically invoked for UI/UX requests, design system generation, or when the user mentions design keywords. Can also be invoked explicitly with `$ui-ux-pro-max <prompt>`.

---

## Initialization

Before using the skill, ensure the tooling is installed. Run the setup command tailored for Codex:

```bash
uipro init --ai codex
```

Options:
- `--offline` – use bundled assets without GitHub download.
- `--force` – overwrite existing files.

---

## Core Capabilities

### 1. Domain‑Specific & Stack‑Specific Search

Search for design elements, patterns, and guidelines by domain and technology stack.

```bash
# Search by domain (style, typography, chart, etc.)
python3 skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
python3 skills/ui-ux-pro-max/scripts/search.py "elegant serif" --domain typography
python3 skills/ui-ux-pro-max/scripts/search.py "dashboard" --domain chart

# Search by stack (react, html-tailwind, vue, etc.)
python3 skills/ui-ux-pro-max/scripts/search.py "form validation" --stack react
python3 skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind
```

### 2. Design System Generation & Persistence

Generate a hierarchical design system and save it to disk for multi‑session retrieval. The system uses a **master file** for global rules and **page‑specific** overrides for targeted contexts.

```bash
# Generate and persist a master design system
python3 skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "ProjectName"

# Create a page‑specific override
python3 skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "ProjectName" --page "dashboard"
```

Files created:
- `design-system/MASTER.md` – global design tokens, rules, and guidelines.
- `design-system/pages/<page>.md` – overrides and specifics for that page.

### 3. Retrieval & Application

When handling a UI/UX request:

1. Load the appropriate design system files (`MASTER.md` and the relevant page override if available).
2. Apply the rules consistently across components, layout, typography, color, motion, and interaction patterns.
3. Use domain/stack‑specific results to complement the design system.

### 4. Offline Mode

If no network is available, use the bundled assets (installed via `uipro init --offline`) as a static reference library.

---

## Workflow Summary

1. **Setup** – Run `uipro init --ai codex` once.
2. **Receive a request** – e.g., “Build a landing page for my SaaS product.”
3. **Search/Generate** – Use domain/stack queries to find relevant patterns. Optionally generate/persist a design system.
4. **Retrieve Design System** – Load `MASTER.md` and any page overrides.
5. **Implement** – Combine the retrieved knowledge to produce the UI, ensuring consistency and adherence to the design system.

---

## Examples

### Quick Design Inspiration
```
User: "Show me examples of glassmorphism cards for a React app."
Assistant:
  - Runs: python3 skills/ui-ux-pro-max/scripts/search.py "glassmorphism cards" --domain style --stack react
  - Returns visual references and code snippets.
```

### Full Page Generation with Persistence
```
User: "Design a dark‑mode SaaS dashboard with charts."
Assistant:
  - Runs search for relevant patterns.
  - Generates design system: python3 skills/ui-ux-pro-max/scripts/search.py "dark SaaS dashboard charts" --design-system --persist -p "MySaaS" --page "dashboard"
  - Reads MASTER.md and pages/dashboard.md.
  - Builds the dashboard using the extracted rules.
```

---

**Note:** This skill is a vendor‑provided asset; preserve its core scripts and structure. Modifications should extend its search indexes or design guidance without breaking the retrieval logic.