# UI/UX Pro Max Skill

Generate and persist complete design systems from natural language descriptions, enabling hierarchical retrieval of design rules across AI sessions via `MASTER.md` and page-specific overrides.

## Installation

The `uipro-cli` npm package installs the skill into your project and generates platform-specific files. For Codex, run:

```bash
npm install -g uipro-cli
cd /path/to/your/project
uipro init --ai codex
```

This appends instructions to `AGENTS.md` and sets up the necessary assets.

## Core Workflow

1. **Describe your product** – Provide a brief description and optional project name, e.g., "e-commerce luxury fashion app named LuxStore".
2. **Generate the design system** – Use the Python API or CLI search to create a full design system.
3. **Persist the design system** – Save `MASTER.md` (global rules) and optional page overrides.
4. **Build UI components** – With the design system loaded, generate code that respects the tokens and component specs.

## Design System Generation

### Using the Python API

```python
from design_system import DesignSystemGenerator, persist_design_system

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")

# Persist global rules
persist_design_system(ds, output_dir="./")

# Persist with a page-specific override
persist_design_system(ds, page="checkout", output_dir="./")
```

### Using the CLI search script

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<description>" --design-system --persist -p "Project Name"
```

## Design System Output Structure

All design tokens are stored under `design-system/<project-name>/`.

- `MASTER.md` – Global CSS variables, typography, spacing, shadow, component specs, anti-patterns, and pre-delivery checklist.
- `pages/<page-name>.md` – Overrides for a specific page. **When building a page, check for its override file first; fall back to `MASTER.md`.**

## Retrieval Pattern for AI Assistants

When you receive a request to build a UI page:

1. Read `design-system/<project>/MASTER.md`.
2. Check if `design-system/<project>/pages/<page>.md` exists.
3. If it exists, prioritize its rules over the master. Otherwise, use the master rules.
4. Generate HTML/CSS/React components using the defined CSS variables and component templates.

## Workflow Mode (Select Assistants)

Some assistants support a direct slash command:

```
/ui-ux-pro-max Build a landing page for my SaaS product
```

For Codex, use the standard generation workflow described above.

## Additional Commands

- `uipro versions` – List available skill versions.
- `uipro update` – Update to the latest version.
- `uipro uninstall` – Remove the skill.
