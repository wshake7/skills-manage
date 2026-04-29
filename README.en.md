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

## Fork-First Usage

This repository is itself the cloud-layer self-management template. The preferred entry point is not installing the CLI first and then running `init-cloud`; it is:

```txt
Fork this repository -> edit cloud config -> enable GitHub Actions/Pages -> optionally link local system/project layers to the fork
```

After forking, the repository already includes:

- Root `skills-cloud.config.json`
- GitHub-native `.github/workflows/*`
- Cloud skills directory convention at `.agents/skills/`
- GitHub Pages static data directory at `public/data/`
- Optional local CLI, system layer, and project layer integration

### 1. Cloud Layer: Fork And Enable

1. Fork this repository into your GitHub account or organization, for example `owner/skills-cloud`.
2. Edit the root `skills-cloud.config.json` in the fork to add sources and Pages output config. The cloud layer defaults to `"provider": "deepseek"`.
3. Enable GitHub Actions in the fork, then add the repository secret `DEEPSEEK_API_KEY` under `Settings -> Secrets and variables -> Actions`.
4. Optionally add repository variables `DEEPSEEK_MODEL` and `DEEPSEEK_BASE_URL`. They default to `deepseek-v4-pro` and `https://api.deepseek.com`.
5. Configure GitHub Pages using either Actions or your preferred publishing branch.
6. Run manually or wait for these workflows:

```txt
.github/workflows/resolve-sources.yml
.github/workflows/update-skills.yml
.github/workflows/validate-skills.yml
.github/workflows/release-skills.yml
```

#### Cloud Actions Reference

| Workflow | When to use it | What it does | Required configuration | Main output |
| --- | --- | --- | --- | --- |
| `resolve-sources.yml` | After editing sources, or on its daily schedule, to check whether sources resolve to GitHub repositories | Runs `skills-manage sync --layer cloud --dir ../..` against `skills-cloud.config.json` | No AI key required; only the repository checkout and cloud config | Current v1 prints resolved results to the Actions log; later iterations will write the cloud repo index |
| `update-skills.yml` | When you want the cloud layer to generate or update skills from configured sources, or on its daily schedule | Runs `skills-manage ai-update --layer cloud --dir ../..`, checks the provider, and enters the DeepSeek update flow | Required secret: `DEEPSEEK_API_KEY`; optional variables: `DEEPSEEK_MODEL`, `DEEPSEEK_BASE_URL` | Updates `skills-manage` managed skills under `.agents/skills/`; full write-back generation is still being completed in v1 |
| `validate-skills.yml` | Automatically on push and PR; useful after editing config, skills, or workflows | Runs `pnpm check` and `skills-manage doctor --layer cloud --dir ../..` to validate TypeScript, schema, provider config, and layer graph | If the cloud provider is DeepSeek, missing `DEEPSEEK_API_KEY` is reported as a configuration item to fix | Pass/fail validation result in GitHub Actions |
| `release-skills.yml` | When tagging a release or manually publishing read-only cloud data | Runs `skills-manage publish-cloud-ui --dir ../..` to produce data consumed by GitHub Pages | Requires GitHub Pages permissions; the workflow declares `contents: write`, `pages: write`, and `id-token: write` | `public/data/skills-manage.json` and future cloud-ui static publishing artifacts |

The fork is now your cloud layer. The cloud UI is read-only: it must not expose entry points for editing sources, triggering AI updates, or modifying skills. Writes go through repository commits, the CLI, or GitHub Actions.

### 2. Optional Local Setup: Install The CLI To Link Your Cloud Fork

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

`init-cloud` is still available, but it is now mainly for generating the same cloud-layer files in another empty repository. The normal path is to fork this repository first.

If you clone your cloud fork locally, you can check the cloud config:

```bash
sm doctor --layer cloud --dir .
```

You can also generate the read-only cloud data locally:

```bash
sm publish-cloud-ui --dir .
```

### 3. System Layer: Initialize A Global Skills Workspace

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

### 4. Project Layer: Initialize Skills Management In A Project

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
- Codex provider placeholder and DeepSeek provider backed by the Chat Completions API
- Initial CLI command surface
- local-ui/cloud-ui permission boundary packages
- cloud/system/project init templates and GitHub Actions templates

Next:

- Make CLI init commands copy template files
- Implement the local Fastify service
- Implement the first React local UI screen
- Implement the cloud-ui static read-only page and data output
