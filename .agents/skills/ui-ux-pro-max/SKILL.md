---
name: ui-ux-pro-max
description: Professional UI/UX toolkit with design tokens, component specs, and generation rules for beautiful, consistent interfaces.
---

# UI/UX Pro Max

**Activation**  
You are in UI/UX Pro Max mode automatically whenever the user asks to build, design, or generate any user interface. No special command is needed.

**Design System**  
Your primary source of truth is a design system stored in `<project>/design-system/<project-name>/MASTER.md`.  
Optionally, page-specific overrides live in `<project>/design-system/<project-name>/pages/<page>.md`.  
Always check for a page override file first; if it doesn't exist, fall back to `MASTER.md`.

**Setting Up the Design System**  
If the design system files are missing, generate them using the provided `DesignSystemGenerator` class and persist with `persist_design_system`.  
Example:
```python
from design_system import DesignSystemGenerator, persist_design_system
gen = DesignSystemGenerator()
ds = gen.generate(description="modern saas", name="ProjectName")
persist_design_system(ds, output_dir="/path/to/project")
# Optionally, create a page override:
persist_design_system(ds, page="checkout", output_dir="/path/to/project")
```
> **Note**: The `uipro-cli` installs the necessary scripts to your project. Run `npx uipro init --ai codex` if they are not already present.

**What the Design System Defines**  
- **Color Palette**: CSS variables for primary, secondary, neutral, success, warning, error scales.  
- **Typography**: Heading and body fonts (with Google Fonts URL and CSS import), font sizes, weights, line heights.  
- **Spacing**: Tokens like `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`, `--space-3xl`.  
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`.  
- **Component Specs**: Detailed guidelines for buttons, cards, inputs, modals, and more — including sizes, states (hover, active, disabled), and actual CSS snippets.  
- **Anti-Patterns**: A list of design mistakes to avoid (e.g., low contrast, overuse of borders, inconsistent spacing).  
- **Pre-Delivery Checklist**: Items like “Responsive at 320px”, “Focus styles visible”, “Alt text for images”, etc.

**Workflow for Every UI/UX Request**  
1. **Check Design System Existence**  
   Look for `design-system/*/MASTER.md`. If not found, ask the user for a project name and brief description, then generate it using the Python script (or instruct the user to run `uipro init`).  

2. **Load the Design System**  
   Read MASTER.md and the relevant page override (if any). Override rules take priority.  

3. **Apply Design Tokens**  
   When writing HTML/CSS (or Tailwind/component props), always reference the actual token values.  
   - Use the CSS variables defined in MASTER.md (e.g., `var(--color-primary-500)`, `var(--space-md)`).  
   - If using Tailwind, map tokens to a custom Tailwind config or use arbitrary values (e.g., `bg-[var(--color-primary-500)] p-[var(--space-md)]`).  

4. **Follow Component Specs**  
   Do not improvise visual styles. Every button, card, input must match the specification in the design system (sizes, rounded corners, shadows, hover effects).  

5. **Avoid Anti-Patterns**  
   Refer to the anti-patterns list in the design system and ensure your output does not violate any.  

6. **Run the Pre-Delivery Checklist**  
   Before presenting the final code, go through every item in the checklist. Fix any violations.  

**Examples**  
User: “Build a landing page for my SaaS product.”  
You: Automatically activates UI/UX Pro Max mode. You ensure `MASTER.md` exists for “SaaS product”, load it, then generate a responsive landing page using the tokens and component specs, checking the checklist at the end.  

User: “Create a checkout form.”  
You: Load `MASTER.md` and check `pages/checkout.md`. Design the form inputs, buttons, and layout per the specs.  

**Installation (One-Time)**  
```bash
npm install -g uipro-cli
npx uipro init --ai codex
```
This appends this skill to `AGENTS.md` and copies supporting data/scripts to your project. After that, the skill is always active.
