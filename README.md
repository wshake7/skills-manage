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

## Fork-first 使用流程

这个仓库本身就是云端级自管理仓库模板。最理想的入口不是先在本机安装 CLI 再执行 `init-cloud`，而是：

```txt
Fork 本仓库 -> 编辑云端配置 -> 启用 GitHub Actions/Pages -> 本地系统级和项目级按需关联这个 fork
```

fork 后天然拥有：

- 根目录 `skills-cloud.config.json`
- 可被 GitHub 直接识别的 `.github/workflows/*`
- 云端 skills 目录约定 `.agents/skills/`
- GitHub Pages 静态数据目录 `public/data/`
- 本地可选 CLI、system layer、project layer 联动能力

### 1. 云端级：直接 Fork 后启用

1. Fork 本仓库到自己的 GitHub 账号或组织，例如 `owner/skills-cloud`。
2. 在 fork 后的仓库中编辑根目录 `skills-cloud.config.json`，添加 sources 和 Pages 输出配置。云端默认使用 `"provider": "deepseek"`。
3. 在 GitHub 仓库设置中启用 Actions，并在 `Settings -> Secrets and variables -> Actions` 中添加仓库 secret：`DEEPSEEK_API_KEY`。
4. 可选：在同一页面添加 repository variables：`DEEPSEEK_MODEL` 和 `DEEPSEEK_BASE_URL`。默认分别是 `deepseek-v4-pro` 和 `https://api.deepseek.com`。
5. 在 GitHub Pages 设置中选择 Actions 或发布分支策略。
6. 手动运行或等待以下 workflows：

```txt
.github/workflows/resolve-sources.yml
.github/workflows/update-skills.yml
.github/workflows/validate-skills.yml
.github/workflows/release-skills.yml
```

#### 云端 Actions 说明

| Workflow | 什么时候用 | 做什么 | 需要配置 | 主要产物 |
| --- | --- | --- | --- | --- |
| `resolve-sources.yml` | 配置 sources 后，想检查它们能否解析为 GitHub 仓库；也会每天定时运行 | 执行 `node packages/cli/dist/index.js sync --layer cloud --dir .`，解析 `skills-cloud.config.json` 中的 sources | 不需要 AI key；只需要仓库代码和 cloud config | 当前版本输出解析结果到 Actions 日志，后续会写入云端 repo 清单数据 |
| `update-skills.yml` | 想让云端根据 sources 自动生成或更新 skills；也会每天定时运行 | 执行 `node packages/cli/dist/index.js ai-update --layer cloud --dir .`，检查 provider，解析 sources，并调用 DeepSeek 生成 skill 文件 | 必需 secret：`DEEPSEEK_API_KEY`；可选 variables：`DEEPSEEK_MODEL`、`DEEPSEEK_BASE_URL` | 生成更新分支并打开 PR，不直接写入主分支；更新 `.agents/skills/<source-id>/`，旧版本归档到 `.agents/skill-archives/<source-id>/` |

`update-skills.yml` 不会直接把 AI 结果合入主分支。它会创建 `skills-manage/update-<run-id>` 分支并打开 PR；PR 本身也是 GitHub issue，可在 PR 里讨论、review、要求修改或关闭。每次更新已有 skill 前，当前版本会先复制到 `.agents/skill-archives/<source-id>/recent/<timestamp>/`；`recent` 只保留最近 10 个版本，超过 10 个后更早版本会移动到 `.agents/skill-archives/<source-id>/older/`。
| `validate-skills.yml` | 每次 push 或 PR 自动运行；手动改配置、skill 或 workflow 后用于验收 | 执行 `pnpm check` 和 `node packages/cli/dist/index.js doctor --layer cloud --dir .`，检查 TypeScript、schema、provider 配置和层级图 | 如果 cloud provider 是 DeepSeek，缺少 `DEEPSEEK_API_KEY` 会提示需要配置；本地开发时这是预期提示 | Actions 通过或失败的检查结果 |
| `release-skills.yml` | 打 tag 或手动发布云端只读 UI 时运行 | 执行 `node packages/cli/dist/index.js publish-cloud-ui --dir .`，生成 `dist/cloud-ui` 静态页面并部署到 GitHub Pages | 需要 GitHub Pages 相关权限；workflow 已声明 `contents: write`、`pages: write`、`id-token: write` | GitHub Pages 站点，以及 `public/data/skills-manage.json`、`dist/cloud-ui/index.html`、`dist/cloud-ui/data/skills-manage.json` |

这样 fork 出来的仓库就是你的 cloud layer。云端 UI 只读，不提供修改 sources、触发 AI 更新或编辑 skills 的入口；写操作通过仓库提交、CLI 或 GitHub Actions 完成。

### 2. 本地可选：安装 CLI 连接你的云端 fork

当前项目仍处于 v1 骨架阶段。如果需要在本机管理 system/project layer，再从源码安装 CLI：


```bash
pnpm install
pnpm global:install
```

安装后可以直接运行：

```bash
sm --help
```

该安装命令会在 pnpm 全局 bin 目录中创建指向当前源码仓库的 `sm` 和 `skills-manage` 命令，因此后续修改源码后重新执行 `pnpm global:install` 即可刷新全局命令。

如果需要移除全局命令：

```bash
pnpm global:uninstall
```

`init-cloud` 仍然保留，但它现在主要用于在其他空仓库里生成同样的 cloud layer 文件；常规路径优先 fork 本仓库。

如果你在本地 clone 了自己的 cloud fork，可以检查云端配置：

```bash
sm doctor --layer cloud --dir .
```

也可以本地生成云端只读数据：

```bash
sm publish-cloud-ui --dir .
```

### 3. 系统级：初始化本机全局 skills 管理目录

系统级用于管理用户电脑上的全局 skills，并可读取已关联的云端仓库状态。

1. 初始化系统级配置。默认目录为 `~/.skills-manage`，因此可以在任意工作目录执行：

```bash
sm init-system
```

2. 编辑 `~/.skills-manage/skills-system.config.json`，按需配置 `linkedCloud`：

```json
{
  "linkedCloud": {
    "repo": "owner/skills-cloud",
    "pagesUrl": "https://owner.github.io/skills-cloud",
    "enabled": true
  }
}
```

3. 检查系统级配置、provider 与云端关联：

```bash
sm doctor --layer system --dir ~/.skills-manage
```

4. 同步系统级 sources：

```bash
sm sync --layer system --dir ~/.skills-manage
```

5. 启动系统级本地 UI。默认层级为系统级，默认目录为 `~/.skills-manage`，因此可以在任意工作目录执行：

```bash
sm ui
```

命令启动后会保持运行，并输出本地地址，例如 `http://localhost:4173`。在浏览器打开该地址即可访问系统级 UI；按 `Ctrl+C` 停止服务。

系统级 UI 可以修改系统级配置和 skills，但不直接改写云端仓库。需要修改云端时，应切换到云端仓库流程。

### 4. 项目级：初始化当前项目 skills 管理

项目级用于管理某个项目自己的 skills，并可读取系统级与间接云端状态。

1. 进入目标项目目录。
2. 初始化项目级配置：

```bash
sm init-project --dir .
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
sm doctor --layer project --dir .
```

5. 同步项目级 sources：

```bash
sm sync --layer project --dir .
```

6. 启动项目级本地 UI：

```bash
sm ui --project --dir .
```

项目级 UI 可以修改当前项目的配置和 skills，但不直接改写系统级或云端配置。需要修改系统级配置时，应切换到系统级 UI。

## CLI 命令

当前 CLI 已具备首版骨架：

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

`sm` 是推荐短命令；`skills-manage` 仍作为兼容命令保留。

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
- Codex provider 占位实现，DeepSeek provider 已接入 Chat Completions API
- CLI 首版命令入口
- local-ui/cloud-ui 权限边界占位包
- cloud/system/project 初始化模板和云端 Actions 模板

下一步：

- 让 CLI 初始化命令复制模板文件
- 实现本地 Fastify 服务
- 实现 React 本地 UI 首屏
- 实现 cloud-ui 静态只读页面和数据输出
