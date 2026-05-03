## UI/UX Pro Max Skill for Codex

This skill enables AI coding assistance with the UI/UX Pro Max design system toolkit.

### Initialization

Run the CLI to set up the skill directory for Codex:

```bash
uipro init --ai codex
```

Options:
- `--offline` – use bundled assets without GitHub download
- `--force` – overwrite existing files

### Persist a Design System

Generate and persist a full design system into Markdown for hierarchical retrieval:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

- `--design-system` – generates a complete design system
- `--persist` – saves to `design-system/MASTER.md`
- `-p` – project name

#### Page‑specific Overrides

Add `--page "page-slug"` to create a page‑specific file in `design-system/pages/`:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp" --page "dashboard"
```

### Using the Design System

1. **Check for persisted files**:
   - Look for `design-system/MASTER.md` (global rules).
   - If building a specific page, check for `design-system/pages/<page>.md`.

2. **Apply hierarchical rules**:
   - If a page‑specific file exists, its rules **override** conflicting entries in `MASTER.md`.
   - If no page file exists, use only `MASTER.md`.

3. **Generate UI code** following the design system's tokens, patterns, and constraints.

### Workflow Example

After initializing the skill:

```bash
# Persist the design system for a "SaaS dashboard"
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "AcmeApp"

# Later, override for a checkout page
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard checkout" --design-system --persist -p "AcmeApp" --page "checkout"
```

Now, when building the checkout page, the AI should read `design-system/pages/checkout.md` first, falling back to `MASTER.md` for un‑overridden rules.