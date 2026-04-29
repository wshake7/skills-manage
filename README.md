# skills-manage

三层 UI 联动的 AI Skills 自管理系统。项目目标是让 AI skills 可以在云端、自有电脑的系统级目录、以及单个项目目录之间被显式关联、同步、覆盖和管理。

[English](./README.en.md)

## 项目愿景

`skills-manage` 是一个可自托管、可本地管理、可项目联动的 AI skills 管理系统。它面向长期使用 AI 助手的人：把 skills 当作可维护资产，而不是散落在不同对话和目录里的临时文件。

系统默认采用显式配置关联，不自动扫描用户电脑上的所有目录。

## 三层模型

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

## 当前技术栈

- Node.js + TypeScript
- pnpm workspace monorepo
- Zod schema 校验
- Commander CLI
- React + Vite 作为首版 UI 方向
- Fastify 作为首版本地服务方向
- GitHub Actions + GitHub Pages 支持云端自管理仓库

## 仓库结构

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

## 配置文件

三层各自拥有独立配置文件：

| 文件 | 层级 | 职责 |
| --- | --- | --- |
| `skills-cloud.config.json` | `cloud` | 配置云端 sources、AI provider、Actions、GitHub Pages 输出 |
| `skills-system.config.json` | `system` | 配置系统级 skills、关联云端仓库、本地 UI 权限 |
| `skills-project.config.json` | `project` | 配置项目级 skills、关联系统级自管理库、项目专属 sources |

所有由本项目自动管理的 skill 都应包含 `skill.manifest.json`，并使用 `managedBy: "skills-manage"` 标识。系统只应自动覆盖或删除由 manifest 标记为本项目管理的 skills。

## 安装与使用流程

### 0. 本地开发安装

当前仓库仍处于 v1 骨架阶段，推荐先用源码方式运行：

```bash
pnpm install
pnpm build
```

本地开发时可以直接运行编译后的 CLI：

```bash
node packages/cli/dist/index.js --help
```

后续发布到 npm 后，可使用：

```bash
npx skills-manage --help
```

### 1. 云端级：初始化 GitHub 自管理仓库

云端级用于集中维护 cloud skills，并通过 GitHub Actions 自动解析、更新、校验和发布只读 GitHub Pages。

1. 创建一个新的 GitHub 仓库，例如 `owner/skills-cloud`。
2. 在该仓库工作区初始化云端配置：

```bash
node packages/cli/dist/index.js init-cloud --dir /path/to/skills-cloud
```

3. 将模板 workflow 放入云端仓库的 `.github/workflows/`：

```txt
templates/actions/resolve-sources.yml
templates/actions/update-skills.yml
templates/actions/validate-skills.yml
templates/actions/release-skills.yml
```

4. 编辑 `skills-cloud.config.json`，配置 sources、provider 和 GitHub Pages 输出目录。
5. 运行云端检查：

```bash
node packages/cli/dist/index.js doctor --layer cloud --dir /path/to/skills-cloud
```

6. 发布云端只读数据：

```bash
node packages/cli/dist/index.js publish-cloud-ui --dir /path/to/skills-cloud
```

7. 推送到 GitHub，启用 Actions 与 Pages。

云端 UI 只读，不提供修改 sources、触发 AI 更新或编辑 skills 的入口。写操作应通过仓库、CLI 或 GitHub Actions 流程完成。

### 2. 系统级：初始化本机全局 skills 管理目录

系统级用于管理用户电脑上的全局 skills，并可读取已关联的云端仓库状态。

1. 创建系统级目录，例如 `~/.skills-manage`。
2. 初始化系统级配置：

```bash
node packages/cli/dist/index.js init-system --dir ~/.skills-manage
```

3. 编辑 `~/.skills-manage/skills-system.config.json`，按需配置 `linkedCloud`：

```json
{
  "linkedCloud": {
    "repo": "owner/skills-cloud",
    "pagesUrl": "https://owner.github.io/skills-cloud",
    "enabled": true
  }
}
```

4. 检查系统级配置、provider 与云端关联：

```bash
node packages/cli/dist/index.js doctor --layer system --dir ~/.skills-manage
```

5. 同步系统级 sources：

```bash
node packages/cli/dist/index.js sync --layer system --dir ~/.skills-manage
```

6. 启动系统级本地 UI：

```bash
node packages/cli/dist/index.js ui --system --dir ~/.skills-manage
```

系统级 UI 可以修改系统级配置和 skills，但不直接改写云端仓库。需要修改云端时，应切换到云端仓库流程。

### 3. 项目级：初始化当前项目 skills 管理

项目级用于管理某个项目自己的 skills，并可读取系统级与间接云端状态。

1. 进入目标项目目录。
2. 初始化项目级配置：

```bash
node /path/to/skills-manage/packages/cli/dist/index.js init-project --dir .
```

3. 编辑 `skills-project.config.json`，按需配置 `linkedSystem`：

```json
{
  "linkedSystem": {
    "path": "~/.skills-manage",
    "enabled": true
  }
}
```

4. 检查项目级配置和上游关联：

```bash
node /path/to/skills-manage/packages/cli/dist/index.js doctor --layer project --dir .
```

5. 同步项目级 sources：

```bash
node /path/to/skills-manage/packages/cli/dist/index.js sync --layer project --dir .
```

6. 启动项目级本地 UI：

```bash
node /path/to/skills-manage/packages/cli/dist/index.js ui --project --dir .
```

项目级 UI 可以修改当前项目的配置和 skills，但不直接改写系统级或云端配置。需要修改系统级配置时，应切换到系统级 UI。

## CLI 命令

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

## 开发

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

## 当前进度

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
