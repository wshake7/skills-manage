# skills-manage

A three-layer AI Skills self-management system with linked cloud, system-level, and project-level UIs. The goal is to explicitly link, sync, override, and manage AI skills across a cloud repository, a user's global machine-level workspace, and individual project workspaces.

[中文](./README.md)

## Vision

`skills-manage` is a self-hostable AI skills management system for cloud, system-level, and project-level workflows. It treats skills as durable assets that can be synced, reviewed, overridden, and reused across projects.

The system uses explicit configuration links by default. It does not scan every directory on the user's machine automatically.

## Three-Layer Model

| Layer | ID | Location | UI | Write Access | Default Priority |
| --- | --- | --- | --- | --- | --- |
| Cloud | `cloud` | Self-managed GitHub repository | GitHub Pages | Read-only | Lowest |
| System | `system` | Global directory on the user's machine | Local Web UI | Writable | Middle |
| Project | `project` | A single project directory | Local Web UI | Writable | Highest |

Default override order:

```txt
project skills > system skills > cloud skills
```

When the same skill name exists in multiple layers, the higher-priority layer wins. The UI should make the effective source and override relationship visible.

## Current Stack

- Node.js + TypeScript
- pnpm workspace monorepo
- Zod for schema validation
- Commander for the CLI
- React + Vite as the planned v1 UI stack
- Fastify as the planned v1 local service
- GitHub Actions + GitHub Pages for cloud self-management

## Repository Layout

```txt
skills-manage/
  packages/
    core/                # LayerGraph, resolver, fetcher, sync, manifest logic
    cli/                 # skills-manage command entry
    local-ui/            # Writable system/project local UI boundary
    cloud-ui/            # Read-only GitHub Pages UI boundary
    providers/           # Codex and DeepSeek provider interface
    schemas/             # Config, manifest, and source schemas
  templates/
    cloud-repo/          # Cloud repository config template
    project-init/        # Project-level init config template
    system-init/         # System-level init config template
    actions/             # GitHub Actions workflow templates
  memory/                # Project memory, tasks, and work logs
  requirement.md         # Product requirements
```

## Configuration Files

Each layer has its own config file:

| File | Layer | Purpose |
| --- | --- | --- |
| `skills-cloud.config.json` | `cloud` | Cloud sources, AI provider, Actions, and GitHub Pages output |
| `skills-system.config.json` | `system` | System skills, linked cloud repository, and local UI permissions |
| `skills-project.config.json` | `project` | Project skills, linked system workspace, and project-specific sources |

Every skill managed by this project should include `skill.manifest.json` with `managedBy: "skills-manage"`. Automated overwrite and delete operations should only affect skills marked as managed by this project.

## Installation And Usage

### 0. Local Development Setup

The repository is currently in the v1 skeleton stage. For now, install the CLI globally from the source checkout:

```bash
pnpm install
pnpm global:install
```

After installation, run:

```bash
sm --help
```

The install command creates `sm` and `skills-manage` shims in the pnpm global bin directory that point to the current source checkout. Re-run `pnpm global:install` after source changes to refresh the global command.

To remove the global command:

```bash
pnpm global:uninstall
```

### 1. Cloud Layer: Initialize A Self-Managed GitHub Repository

The cloud layer centrally maintains cloud skills and uses GitHub Actions to resolve, update, validate, and publish read-only GitHub Pages data.

1. Create a new GitHub repository, for example `owner/skills-cloud`.
2. Initialize cloud config in that repository workspace:

```bash
sm init-cloud --dir /path/to/skills-cloud
```

3. Copy workflow templates into `.github/workflows/` in the cloud repository:

```txt
templates/actions/resolve-sources.yml
templates/actions/update-skills.yml
templates/actions/validate-skills.yml
templates/actions/release-skills.yml
```

4. Edit `skills-cloud.config.json` to configure sources, provider, and GitHub Pages output.
5. Check cloud config:

```bash
sm doctor --layer cloud --dir /path/to/skills-cloud
```

6. Publish read-only cloud data:

```bash
sm publish-cloud-ui --dir /path/to/skills-cloud
```

7. Push to GitHub and enable Actions and Pages.

The cloud UI is read-only. It must not expose entry points for editing sources, triggering AI updates, or modifying skills. Write operations should go through the repository, CLI, or GitHub Actions flow.

### 2. System Layer: Initialize A Global Skills Workspace

The system layer manages global skills on the user's machine and can read linked cloud repository status.

1. Initialize system config. The default directory is `~/.skills-manage`, so this can be run from any working directory:

```bash
sm init-system
```

2. Edit `~/.skills-manage/skills-system.config.json` and configure `linkedCloud` if needed:

```json
{
  "linkedCloud": {
    "repo": "owner/skills-cloud",
    "pagesUrl": "https://owner.github.io/skills-cloud",
    "enabled": true
  }
}
```

3. Check system config, provider, and cloud link:

```bash
sm doctor --layer system --dir ~/.skills-manage
```

4. Sync system-level sources:

```bash
sm sync --layer system --dir ~/.skills-manage
```

5. Start the system local UI. The default layer is system and the default directory is `~/.skills-manage`, so this can be run from any working directory:

```bash
sm ui
```

The command keeps running and prints a local URL such as `http://localhost:4173`. Open that URL in a browser to access the system UI. Press `Ctrl+C` to stop the server.

The system UI can modify system config and system skills, but it must not directly rewrite the cloud repository. To change cloud data, switch to the cloud repository flow.

### 3. Project Layer: Initialize Skills Management In A Project

The project layer manages skills for one specific project and can read system-level and indirect cloud status.

1. Enter the target project directory.
2. Initialize project config:

```bash
sm init-project --dir .
```

3. Edit `skills-project.config.json` and configure `linkedSystem` if needed:

```json
{
  "linkedSystem": {
    "path": "~/.skills-manage",
    "enabled": true
  }
}
```

4. Check project config and upstream links:

```bash
sm doctor --layer project --dir .
```

5. Sync project-level sources:

```bash
sm sync --layer project --dir .
```

6. Start the project local UI:

```bash
sm ui --project --dir .
```

The project UI can modify the current project's config and skills, but it must not directly rewrite system-level or cloud config. To change system config, switch to the system UI.

## CLI

The first CLI skeleton includes:

```bash
sm init-cloud
sm init-system
sm init-project
sm doctor --layer project
sm sync --layer project
sm ai-update --layer project
sm publish-cloud-ui
sm ui
sm ui --system
sm ui --project
```

`sm` is the recommended short command. `skills-manage` remains available as a compatibility command.

## Development

Install dependencies:

```bash
pnpm install
```

Type-check:

```bash
pnpm check
```

Build:

```bash
pnpm build
```

## Current Progress

Done:

- pnpm + TypeScript monorepo setup
- Three-layer config and skill manifest schemas
- Initial core package for config IO, LayerGraph, resolver, git fetcher, and manifest helpers
- Codex/DeepSeek provider interface with placeholder implementations
- Initial CLI command surface
- local-ui/cloud-ui permission boundary packages
- cloud/system/project init templates and GitHub Actions templates

Next:

- Make CLI init commands copy template files
- Implement the local Fastify service
- Implement the first React local UI screen
- Implement the cloud-ui static read-only page and data output
