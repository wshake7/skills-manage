# UI/UX Pro Max Skill

This skill helps you generate and apply a design system for UI/UX tasks using the [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) toolkit.

## Setup

If the CLI is not installed, run:
```bash
npm install -g uipro-cli
```

Initialize the skill for Codex in your project directory:
```bash
uipro init --ai codex
```

## Design System Workflow

1. **Generate a design system** using natural language search. The tool persists the result to Markdown files for hierarchical retrieval.

   ```bash
   python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
   ```

   This creates `design-system/MASTER.md` with global design rules. Optionally add `--page "page-name"` to create a page-specific override (e.g., `--page dashboard`).

2. **Retrieve the design system** when generating UI code. Always load `design-system/MASTER.md` first, then any relevant page-specific overrides from `design-system/pages/*.md`.

3. **Apply the rules** from the loaded design system to all UI generation tasks.

## Usage

Invoke the skill directly with the `$ui-ux-pro-max` command, for example:

```
$ui-ux-pro-max Build a landing page for my SaaS product
```

When you receive a UI/UX request, automatically generate or update the design system as needed before producing code.
