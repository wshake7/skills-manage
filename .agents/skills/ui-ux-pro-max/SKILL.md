# UI/UX Pro Max

Design intelligence skill for AI coding agents. Generates and persists design systems with page-level overrides. Installed via `uipro-cli`.

## Quick Start

```bash
npx uipro-cli init --ai codex
```

## Core Workflow

1. **Initialize** the skill in your project (see above).
2. **Generate a design system** using Python (requires `design_system` package from the skill):
   ```python
   from design_system import DesignSystemGenerator
   generator = DesignSystemGenerator()
   ds = generator.generate("e-commerce luxury fashion", "LuxStore")
   ```
3. **Persist** the design system:
   - `persist_design_system(ds, output_dir="/path/to/project")` – creates `design-system/luxstore/MASTER.md`
   - Add a page override: `persist_design_system(ds, page="checkout", output_dir="/path/to/project")` – also creates `design-system/luxstore/pages/checkout.md`
4. **Retrieve rules hierarchically** when building a page:
   - Always read `design-system/<project>/MASTER.md` first.
   - If a **page-specific file** exists (e.g. `design-system/<project>/pages/<page>.md`), **prioritize its rules** over the master.

## What MASTER.md Contains

- Full color palette with CSS variables
- Typography (heading + body fonts, Google Fonts URL)
- Spacing tokens (`--space-xs` to `--space-3xl`)
- Shadow depths (`--shadow-sm` to `--shadow-xl`)
- Component specs (buttons, cards, inputs, modals) with CSS
- Anti-patterns and a pre-delivery checklist

## CLI Commands

| Command | Description |
|---------|-------------|
| `npx uipro-cli init --ai <platform>` | Install the skill for a specific AI assistant (`codex`, `claude`, `cursor`, etc.) |
| `npx uipro-cli init --ai all` | Install for all supported platforms at once |
| `npx uipro-cli init --ai codex --global` | Global install (available to all projects) |
| `npx uipro-cli init --ai codex --offline` | Use bundled assets without network |
| `uipro versions` | List available skill versions |
| `uipro update` | Update to the latest version |
| `uipro uninstall` | Remove the skill (auto-detect platform) |

## Notes

- The skill auto-detects installed AI assistants when `--ai` is omitted.
- For **Codex**, the skill appends guidance to `AGENTS.md`.
- Always restart your AI coding assistant after installation.