# UI/UX Pro Max Skill for Codex

## Overview
Use this skill to generate, persist, and apply professional design systems. The upstream tool provides a CLI (`uipro`) for installation and Python scripts for design system generation and file persistence. Your role is to execute the necessary commands, read the generated files, and apply their rules to ensure consistent, high-quality UI/UX.

## Setup (for the user)
Install the skill globally or per project:
```bash
npm install -g uipro-cli    # global
cd /path/to/project
uipro init --ai codex       # appends to AGENTS.md (this file)
```
After installation, restart your session so the skill loads.

## Generating a Design System
When a design system is requested, use the built-in search script:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```
This returns a design system dictionary (colors, typography, spacing, shadows, component specs, anti-patterns). Provide the exact product type, industry, and keywords for best results.

## Persisting the Design System
After generation, store the rules for future sessions:
```python
from design_system import persist_design_system, DesignSystemGenerator

generator = DesignSystemGenerator()
ds = generator.generate("e-commerce luxury fashion", "LuxStore")

# Save master rules only
result = persist_design_system(ds, output_dir="/path/to/project")
# This creates design-system/luxstore/MASTER.md

# Save master + page-specific override
result = persist_design_system(ds, page="checkout", output_dir="/path/to/project")
# Creates design-system/luxstore/pages/checkout.md
```
The generated `MASTER.md` includes:
- Full color palette table with CSS variables
- Typography (heading + body fonts, Google Fonts URL)
- Spacing tokens
- Shadow depths
- Component specs (buttons, cards, inputs, modals) with CSS
- Anti-patterns list
- Pre-delivery checklist

## Applying Design Rules Hierarchically
For any page you build, follow this priority:
1. Read `design-system/<project>/MASTER.md` first to get global styles.
2. Check if `design-system/<project>/pages/<page>.md` exists.
   - If it exists, its rules **override** the MASTER rules for that page. Use them as the authoritative source.
   - If it does not exist, default to the MASTER rules.
3. Use the anti-patterns list to avoid forbidden styles.
4. Before finalizing, run through the pre-delivery checklist (contrast, spacing, responsive behavior).

## CLI Reference
- `uipro init --ai codex` – install skill (appends to AGENTS.md)
- `uipro init --ai codex --global` – global install
- `uipro init --ai codex --offline` – use bundled assets (no GitHub download)
- `uipro update` – update to latest version
- `uipro uninstall --ai codex` – remove skill
- `uipro versions` – list available skill versions

## Notes
- When starting a new project or feature, always check for an existing design system directory before generating a new one.
- The `persist_design_system` function and the `search.py` script are available after the skill is installed.
- Encourage the user to create page-specific overrides early for custom requirements.