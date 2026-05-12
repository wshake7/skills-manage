# UI/UX Pro Max Skill

The UI/UX Pro Max skill helps AI coding agents generate and apply consistent, high-quality user interfaces and user experiences by leveraging a design system with hierarchical rules. This skill integrates with the `uipro` CLI and the UI/UX Pro Max library to persist design tokens, rules, and patterns across projects.

## Installation

For Codex (Skills), run:

```bash
uipro init --ai codex
```

This copies the necessary skill files and dependencies to your project. Use `--offline` to skip GitHub download (uses bundled assets) or `--force` to overwrite existing files.

## Key Usage Patterns

- **Automatic invocation**: The skill can be triggered automatically when the AI detects a UI/UX request, or explicitly via the `$ui-ux-pro-max` command in Codex.
- **Design system persistence**: Use the master + overrides pattern to store global and page-specific rules.

## Workflow Guidance

### Generating and Persisting a Design System

1. **Create the master design system file**:
   ```bash
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "your search query" --design-system --persist -p "AppName"
   ```
   This generates `design-system/MASTER.md` with global design rules.

2. **Create page-specific overrides** (optional):
   ```bash
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "your search query" --design-system --persist -p "AppName" --page "pageName"
   ```
   This creates `design-system/pages/pageName.md` with rules that override the master for that page.

3. **Apply rules during UI generation**: When building a specific page, first check for a corresponding override file in `design-system/pages/`. If found, its rules take precedence over `design-system/MASTER.md`. Otherwise, use the master file exclusively.

### Keeping the Kit Synchronized

If you modify files within the Antigravity Kit, maintain consistency by:

- Copying changes from `data/` and `scripts/` into `.shared/ui-ux-pro-max/` and `cli/assets/.shared/ui-ux-pro-max/`.
- Reflecting updates to `SKILL.md` across agent-specific directories (e.g., `.agent/`, `.cursor/`, `.windsurf/`), and then copying all skill folders to `cli/assets/`.

These steps ensure the toolkit works identically across all supported AI environments.

## Commands Reference

| Command | Description |
|---------|-------------|
| `uipro init --ai codex` | Initialize the skill for Codex |
| `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "query" --design-system --persist -p "AppName"` | Generate and persist global design system |
| `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "query" --design-system --persist -p "AppName" --page "page"` | Generate page override |
