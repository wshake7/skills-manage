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
5. Optionally add the `CONTEXT7_API_KEY` Actions secret if you want Context7 to refresh this repository's docs after pushes to the primary branch. Private repositories can also add `CONTEXT7_GIT_TOKEN` so Context7 can read repository content.
6. Configure GitHub Pages using either Actions or your preferred publishing branch.
7. Run manually or wait for these workflows:

```txt
.github/workflows/resolve-sources.yml
.github/workflows/update-skills.yml
.github/workflows/validate-skills.yml
.github/workflows/release-skills.yml
.github/workflows/context7-refresh.yml
```

#### Cloud Actions Reference

| Workflow | When to use it | What it does | Required configuration | Main output |
| --- | --- | --- | --- | --- |
| `resolve-sources.yml` | After editing sources, or on its daily schedule, to check whether sources resolve to GitHub repositories | Runs `node packages/cli/dist/index.js sync --layer cloud --dir .` against `skills-cloud.config.json` | No AI key required; only the repository checkout and cloud config | Current v1 prints resolved results to the Actions log; later iterations will write the cloud repo index |
| `update-skills.yml` | When you want the cloud layer to generate or update skills from configured sources, or on its daily schedule | Runs `node packages/cli/dist/index.js ai-update --layer cloud --dir .`, checks the provider, resolves sources, and asks DeepSeek to generate skill files | Required secret: `DEEPSEEK_API_KEY`; optional variables: `DEEPSEEK_MODEL`, `DEEPSEEK_BASE_URL`; configure `SKILLS_MANAGE_PR_TOKEN` if the repository does not allow Actions to create PRs | Creates an update branch and opens a PR instead of writing directly to the base branch; updates `.agents/skills/<source-id>/` and archives older versions under `.agents/skill-archives/<source-id>/` |
| `validate-skills.yml` | Automatically on push and PR; useful after editing config, skills, or workflows | Runs `pnpm check` and `node packages/cli/dist/index.js doctor --layer cloud --dir .` to validate TypeScript, schema, provider config, and layer graph | If the cloud provider is DeepSeek, missing `DEEPSEEK_API_KEY` is reported as a configuration item to fix | Pass/fail validation result in GitHub Actions |
| `release-skills.yml` | When tagging a release or manually publishing the read-only cloud UI | Runs `node packages/cli/dist/index.js publish-cloud-ui --dir .` to build `dist/cloud-ui` and deploy it to GitHub Pages | Requires GitHub Pages permissions; the workflow declares `contents: write`, `pages: write`, and `id-token: write` | GitHub Pages site plus `public/data/skills-manage.json`, `dist/cloud-ui/index.html`, and `dist/cloud-ui/data/skills-manage.json` |
| `context7-refresh.yml` | After pushes to the primary branch, or when manually dispatched, to refresh this repository on Context7 | Calls the Context7 refresh API with `libraryName` set to the current GitHub repository, `/${{ github.repository }}` | Optional secret: `CONTEXT7_API_KEY`; the workflow skips with a warning when it is missing. Private repositories can also configure `CONTEXT7_GIT_TOKEN` | Context7 re-fetches and updates the documentation index for this repository |

`update-skills.yml` does not merge AI output directly into the base branch. It creates a `skills-manage/update-<run-id>` branch and opens a PR; a PR is also a GitHub issue, so review and discussion happen there before merging. Before replacing an existing skill, the current version is copied to `.agents/skill-archives/<source-id>/recent/<timestamp>/`. `recent` keeps the latest 10 versions; older versions are moved to `.agents/skill-archives/<source-id>/older/`.

If the Actions log says `GitHub Actions is not permitted to create or approve pull requests`, the repository blocks the default `GITHUB_TOKEN` from creating PRs. Use these steps:

1. Handle the current generated update first: the log prints a `Create a pull request for '<branch>'` or `Open the PR manually` link. Open that link and create the PR manually. The update branch has already been pushed, so the generated skill output is not lost.
2. Recommended fix: open repository `Settings` → `Actions` → `General` → `Workflow permissions`, select `Read and write permissions`, enable `Allow GitHub Actions to create and approve pull requests`, save, then rerun the `Update skills` workflow.
3. Alternative fix: if you do not want the default `GITHUB_TOKEN` to create PRs, create a fine-grained personal access token. Set Repository access to this repository and grant at least `Contents: Read and write` and `Pull requests: Read and write`.
4. Add that token under repository `Settings` → `Secrets and variables` → `Actions` → `New repository secret`. The secret name must be `SKILLS_MANAGE_PR_TOKEN`.
5. Rerun the `Update skills` workflow. The workflow prefers `SKILLS_MANAGE_PR_TOKEN` when it exists; otherwise it uses the default `GITHUB_TOKEN`.

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
