# skills-manage

三层 UI 联动的 AI Skills 自管理系统。项目目标是让 AI skills 可以在云端、自有电脑的系统级目录、以及单个项目目录之间被显式关联、同步、覆盖和管理。

[English](#english)

## 中文

### 项目愿景

`skills-manage` 是一个可自托管、可本地管理、可项目联动的 AI skills 管理系统。它面向长期使用 AI 助手的人：把 skills 当作可维护资产，而不是散落在不同对话和目录里的临时文件。

系统默认采用显式配置关联，不自动扫描用户电脑上的所有目录。

### 三层模型

| 层级 | 标识 | 位置 | UI | 操作能力 | 默认优先级 |
| --- | --- | --- | --- | --- | --- |
| 云端级 | `cloud` | GitHub 自管理仓库 | GitHub Pages | 只读 | 最低 |
| 系统级 | `system` | 用户电脑全局目录 | 本地 Web UI | 可操作 | 中间 |
| 项目级 | `project` | 单个项目目录 | 本地 Web UI | 可操作 | 最高 |

默认覆盖顺序：

```txt
项目级 skills > 系统级 skills > 云端级 skills
```

当同名 skill 同时存在于多个层级时，系统优先使用更高层级的版本，并在 UI 中展示覆盖关系。

### 当前技术栈

- Node.js + TypeScript
- pnpm workspace monorepo
- Zod schema 校验
- Commander CLI
- React + Vite 作为首版 UI 方向
- Fastify 作为首版本地服务方向
- GitHub Actions + GitHub Pages 支持云端自管理仓库

### 仓库结构

```txt
skills-manage/
  packages/
    core/                # 三层联动、LayerGraph、resolver、fetcher、manifest
    cli/                 # skills-manage 命令入口
    local-ui/            # 系统级和项目级共用的本地可操作 UI 边界
    cloud-ui/            # GitHub Pages 只读 UI 边界
    providers/           # Codex、DeepSeek provider 接口
    schemas/             # config、manifest、source schema
  templates/
    cloud-repo/          # 云端自管理仓库配置模板
    project-init/        # 项目级初始化配置模板
    system-init/         # 系统级初始化配置模板
    actions/             # GitHub Actions workflow 模板
  memory/                # 项目记忆、任务与工作日志
  requirement.md         # 需求文档
```

### 配置文件

三层各自拥有独立配置文件：

| 文件 | 层级 | 职责 |
| --- | --- | --- |
| `skills-cloud.config.json` | `cloud` | 配置云端 sources、AI provider、Actions、GitHub Pages 输出 |
| `skills-system.config.json` | `system` | 配置系统级 skills、关联云端仓库、本地 UI 权限 |
| `skills-project.config.json` | `project` | 配置项目级 skills、关联系统级自管理库、项目专属 sources |

所有由本项目自动管理的 skill 都应包含 `skill.manifest.json`，并使用 `managedBy: "skills-manage"` 标识。系统只应自动覆盖或删除由 manifest 标记为本项目管理的 skills。

### CLI 命令

当前 CLI 已具备首版骨架：

```bash
skills-manage init-cloud
skills-manage init-system
skills-manage init-project
skills-manage doctor --layer project
skills-manage sync --layer project
skills-manage ai-update --layer project
skills-manage publish-cloud-ui
skills-manage ui --system
skills-manage ui --project
```

本地开发时可以直接运行编译后的入口：

```bash
node packages/cli/dist/index.js init-project --dir ./demo-project
node packages/cli/dist/index.js doctor --layer project --dir ./demo-project
```

### 开发

安装依赖：

```bash
pnpm install
```

类型检查：

```bash
pnpm check
```

构建：

```bash
pnpm build
```

### 当前进度

已完成：

- pnpm + TypeScript monorepo 根配置
- 三层 config 与 skill manifest schema
- core 包首版配置读写、LayerGraph、resolver、git fetcher、manifest 工具
- Codex/DeepSeek provider 接口与基础占位实现
- CLI 首版命令入口
- local-ui/cloud-ui 权限边界占位包
- cloud/system/project 初始化模板和云端 Actions 模板

下一步：

- 让 CLI 初始化命令复制模板文件
- 实现本地 Fastify 服务
- 实现 React 本地 UI 首屏
- 实现 cloud-ui 静态只读页面和数据输出

---

## English

### Vision

`skills-manage` is a self-hostable AI skills management system for cloud, system-level, and project-level workflows. It treats skills as durable assets that can be synced, reviewed, overridden, and reused across projects.

The system uses explicit configuration links by default. It does not scan every directory on the user's machine automatically.

### Three-Layer Model

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

### Current Stack

- Node.js + TypeScript
- pnpm workspace monorepo
- Zod for schema validation
- Commander for the CLI
- React + Vite as the planned v1 UI stack
- Fastify as the planned v1 local service
- GitHub Actions + GitHub Pages for cloud self-management

### Repository Layout

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

### Configuration Files

Each layer has its own config file:

| File | Layer | Purpose |
| --- | --- | --- |
| `skills-cloud.config.json` | `cloud` | Cloud sources, AI provider, Actions, and GitHub Pages output |
| `skills-system.config.json` | `system` | System skills, linked cloud repository, and local UI permissions |
| `skills-project.config.json` | `project` | Project skills, linked system workspace, and project-specific sources |

Every skill managed by this project should include `skill.manifest.json` with `managedBy: "skills-manage"`. Automated overwrite and delete operations should only affect skills marked as managed by this project.

### CLI

The first CLI skeleton includes:

```bash
skills-manage init-cloud
skills-manage init-system
skills-manage init-project
skills-manage doctor --layer project
skills-manage sync --layer project
skills-manage ai-update --layer project
skills-manage publish-cloud-ui
skills-manage ui --system
skills-manage ui --project
```

During local development, run the built CLI entry directly:

```bash
node packages/cli/dist/index.js init-project --dir ./demo-project
node packages/cli/dist/index.js doctor --layer project --dir ./demo-project
```

### Development

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

### Current Progress

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
