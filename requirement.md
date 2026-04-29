# 三层 UI 联动的 AI Skills 自管理系统需求文档

## 1. 项目愿景

本项目旨在构建一个可自托管、可本地管理、可项目联动的 AI skills 管理系统。系统需要支持云端 GitHub 仓库自动更新 skills，也需要支持用户电脑上的系统级 skills 管理，以及单个项目内的项目级 skills 管理。

最终目标是形成三层联动能力：

- 云端级：仓库本身可作为 fork-first 模板；用户直接 fork 后即拥有配置、Actions、Pages 数据目录和 cloud skills 管理约定，并通过 GitHub Actions 定时自我更新 skills，通过 GitHub Pages 提供只读 UI。
- 系统级：通过本地 CLI 和本地 Web UI 管理用户电脑上的全局 skills。
- 项目级：通过本地 CLI 和本地 Web UI 管理某个项目自己的 skills，并可联动系统级和云端级。

系统默认采用显式配置关联，不自动扫描用户电脑上的所有目录。

## 2. 三层模型

| 层级 | 标识 | 位置 | UI | 操作能力 | 默认优先级 |
| --- | --- | --- | --- | --- | --- |
| 云端级 | `cloud` | GitHub 自管理仓库 | GitHub Pages | 只读 | 最低 |
| 系统级 | `system` | 用户电脑全局目录 | 本地 Web UI | 可操作 | 中间 |
| 项目级 | `project` | 单个项目目录 | 本地 Web UI | 可操作 | 最高 |

三层的默认覆盖顺序为：

```txt
项目级 skills > 系统级 skills > 云端级 skills
```

当同名 skill 同时存在于多个层级时，优先使用更高层级的版本。UI 需要展示覆盖关系，让用户能看出当前生效的 skill 来自哪一层。

## 3. 产品形态

项目采用 monorepo 组织，首版建议结构如下：

```txt
skills-manage/
  skills-cloud.config.json  # 根目录 cloud 配置，fork 后直接生效
  .github/workflows/        # 根目录 GitHub Actions，fork 后直接拥有云端自动化
  public/data/              # GitHub Pages 静态数据目录
  packages/
    core/                # 三层联动、resolver、fetcher、sync、manifest
    cli/                 # npx/global command
    local-ui/            # 系统级和项目级共用的本地可操作 UI
    cloud-ui/            # GitHub Pages 只读 UI
    providers/           # Codex、DeepSeek provider
    schemas/             # config/manifest/schema
  templates/
    cloud-repo/          # 云端自管理仓库模板
    project-init/        # 项目级初始化模板
    system-init/         # 系统级初始化模板
    actions/             # GitHub Actions 模板
```

默认产品入口采用 **fork-first**：

```txt
Fork 本仓库 -> 编辑 skills-cloud.config.json -> 启用 Actions/Pages -> 按需在本机初始化 system/project 并关联该 fork
```

`init-cloud` 保留为辅助命令，用于在其他空仓库中生成同样的 cloud layer 文件；但普通用户不应必须先安装本地 CLI 才能拥有云端能力。

`local-ui` 和 `cloud-ui` 可以共享展示组件、类型和 schema，但必须保持权限边界：

- `local-ui` 可以通过本地服务调用核心能力并执行写操作。
- `cloud-ui` 只能读取静态 JSON 数据，不提供写操作入口。

## 4. UI 需求

### 4.1 云端 UI

云端 UI 使用 GitHub Pages 发布，只能展示云端自管理仓库中的数据。

| 能力 | 要求 |
| --- | --- |
| 展示 cloud skills | 必须支持 |
| 展示 sources | 必须支持 |
| 展示 GitHub Actions 更新记录 | 必须支持 |
| 展示 manifest 和发布快照 | 必须支持 |
| 修改 sources | 不允许 |
| 触发 AI 更新 | 不允许 |
| 修改 skills | 不允许 |

云端 UI 的可见链路：

```txt
Cloud UI
  -> cloud skills only
```

### 4.2 系统级 UI

系统级 UI 通过本地命令启动，默认只监听 `localhost`。

启动方式：

```bash
skills-manage ui --system
```

系统级 UI 需要展示系统级 skills，并在配置了云端关联时展示云端状态。

系统级 UI 的可见链路：

```txt
System UI
  -> system skills
  -> linked cloud skills
```

系统级 UI 允许执行：

- 添加、编辑、删除系统级 sources。
- 同步已关联的云端 skills。
- 运行系统级 AI 更新。
- 安装、禁用、更新系统级 skills。
- 查看 provider 配置和运行日志。

系统级 UI 不允许直接改写云端仓库。需要修改云端时，应通过云端仓库自己的流程完成。

### 4.3 项目级 UI

项目级 UI 在具体项目目录中启动，默认只监听 `localhost`。

启动方式：

```bash
skills-manage ui --project
```

项目级 UI 需要展示项目级 skills，并在配置了系统级关联时展示系统级状态。如果系统级配置又关联了云端，则项目级 UI 也需要展示间接云端状态。

项目级 UI 的可见链路：

```txt
Project UI
  -> project skills
  -> linked system skills
  -> linked cloud skills, read through system config
```

项目级 UI 允许执行：

- 初始化当前项目的 skills 管理配置。
- 添加、编辑、删除项目级 sources。
- 同步系统级 skills 到项目视图。
- 运行项目级 AI 更新。
- 查看项目级、系统级、云端级的覆盖关系。

项目级 UI 不允许直接改写系统级配置或云端配置。需要修改系统级配置时，应切换到系统级 UI。

## 5. 配置模型

三层各自拥有独立配置文件。

| 文件 | 位置 | 职责 |
| --- | --- | --- |
| `skills-cloud.config.json` | GitHub 云端仓库 | 配置云端 sources、AI provider、Actions、GitHub Pages 输出 |
| `skills-system.config.json` | 系统级目录 | 配置系统级 skills、关联的云端仓库、本地 UI 权限 |
| `skills-project.config.json` | 项目目录 | 配置项目级 skills、关联的系统级自管理库、项目专属 sources |

项目级关联示例：

```json
{
  "layer": "project",
  "linkedSystem": {
    "path": "~/.skills-manage",
    "enabled": true
  }
}
```

系统级关联示例：

```json
{
  "layer": "system",
  "linkedCloud": {
    "repo": "owner/skills-cloud",
    "pagesUrl": "https://owner.github.io/skills-cloud",
    "enabled": true
  }
}
```

所有配置都必须可被 schema 校验。配置读取失败、schema 不匹配、关联路径不存在时，CLI 和 UI 都需要给出明确错误。

## 6. Manifest 需求

所有由本项目管理的 skill 都必须包含 `skill.manifest.json`。

manifest 至少需要记录：

| 字段 | 含义 |
| --- | --- |
| `name` | skill 名称 |
| `layer` | 所属层级：`cloud`、`system`、`project` |
| `sourceRepo` | 来源 GitHub 仓库 |
| `sourceCommit` | 来源 commit |
| `provider` | 使用的 AI provider |
| `generatedAt` | 生成或更新时间 |
| `managedBy` | 固定为 `skills-manage` |
| `overrides` | 当前 skill 覆盖的下层 skill |

系统只允许自动覆盖或删除 manifest 中 `managedBy` 为 `skills-manage` 的 skill，不应影响用户手动维护的 skills。

## 7. CLI 需求

CLI 需要支持通过 `npx` 首次运行，也需要支持安装后作为全局命令持续使用。

| 命令 | 作用 |
| --- | --- |
| `npx skills-manage init-cloud` | 初始化云端 GitHub 自管理仓库模板 |
| `npx skills-manage init-system` | 初始化系统级自管理库 |
| `npx skills-manage init-project` | 初始化当前项目的项目级自管理配置 |
| `skills-manage ui --system` | 打开系统级本地 UI |
| `skills-manage ui --project` | 打开当前项目本地 UI |
| `skills-manage sync` | 按当前层级执行同步 |
| `skills-manage ai-update` | 按当前层级调用 AI 更新 skills |
| `skills-manage publish-cloud-ui` | 生成 GitHub Pages 需要的只读静态数据和页面 |
| `skills-manage doctor` | 检查三层关联、provider、token、目录和 schema |

CLI 的所有写操作必须明确当前层级，避免在错误层级写入配置或 skills。

## 8. AI Provider 需求

v1 需要支持：

- Codex
- DeepSeek

云端默认使用 DeepSeek。云端运行时不得把 API key 写入仓库文件，而应通过 GitHub Actions 环境注入：

- 必需 secret：`DEEPSEEK_API_KEY`
- 可选 repository variables：`DEEPSEEK_MODEL`、`DEEPSEEK_BASE_URL`

AI provider 必须通过统一接口接入，便于后续扩展其他服务商。

provider 接口需要覆盖：

- provider 名称和能力描述。
- 认证配置检查。
- prompt 输入。
- skill 生成或更新结果输出。
- 错误信息标准化。

后续可扩展 provider：

- OpenAI
- Claude
- 本地模型
- 私有企业模型网关

## 9. 依赖来源解析需求

v1 需要支持以下来源：

- GitHub URL
- `package.json`
- `go.mod`

resolver 必须插件化，便于后续新增来源。

首版解析目标是从输入来源中析出可用于获取源码的 GitHub 仓库地址。对于无法解析到 GitHub 仓库的依赖，需要记录为 unresolved，并在 UI 和 CLI 中展示。

后续可扩展来源：

- PyPI
- Cargo
- Maven
- Dockerfile
- pnpm/yarn lockfile
- monorepo workspace 配置

## 10. 代码获取需求

v1 默认使用 git shallow clone/fetch 获取源仓库代码。

代码获取能力必须通过 fetcher 接口隔离，便于后续替换。

后续可扩展获取方式：

- GitHub API
- zip/tarball 下载
- 本地缓存镜像
- 企业内部代码平台

## 11. GitHub Actions 需求

云端自管理仓库需要包含 GitHub Actions workflow。

| Workflow | 触发方式 | 行为 |
| --- | --- | --- |
| `resolve-sources.yml` | cron + manual dispatch | 解析依赖来源，更新 repo 清单 |
| `update-skills.yml` | cron + manual dispatch | 拉取源代码，调用 AI 更新 skills |
| `validate-skills.yml` | PR/push | 校验 manifest、目录结构、重复 skill、schema |
| `release-skills.yml` | tag/manual | 发布可被本地 CLI 同步的 skills 快照 |

每个 workflow 必须在 README 中说明：

- 适用场景：用户什么时候应该手动运行，什么时候等待自动触发。
- 执行行为：实际调用的 CLI 命令和作用边界。
- 配置需求：需要哪些 secrets、variables 或 GitHub 权限。
- 输出结果：写入哪些文件、发布哪些数据，或当前阶段仅输出到 Actions 日志。

云端 Actions 在更新 skills 后，需要生成 GitHub Pages 所需的静态页面和 JSON 数据。

## 12. 权限边界

| 场景 | 允许 | 不允许 |
| --- | --- | --- |
| 云端 UI | 查看云端数据 | 修改任何数据 |
| 系统级 UI | 修改系统级配置和 skills | 直接改写云端仓库 |
| 项目级 UI | 修改项目级配置和 skills | 直接改写系统级或云端配置 |
| CLI cloud 命令 | 修改云端仓库工作区 | 修改本机系统级或项目级配置 |
| CLI system 命令 | 修改系统级工作区 | 直接改写云端仓库 |
| CLI project 命令 | 修改当前项目工作区 | 直接改写系统级或云端配置 |

所有跨层数据读取都必须通过显式配置完成。

## 13. V1 范围

v1 必须完成：

- monorepo 项目结构。
- 三层配置 schema。
- `LayerGraph` 读取和解析上游关联。
- 项目级 > 系统级 > 云端的覆盖规则。
- 本地系统级 UI 和项目级 UI。
- 云端只读 GitHub Pages UI。
- Codex 和 DeepSeek provider 接口与基础实现。
- GitHub URL、`package.json`、`go.mod` resolver。
- git fetcher。
- 云端 GitHub Actions 模板。
- CLI 初始化、同步、AI 更新、UI、doctor 命令。

v1 不要求完成：

- 多用户权限系统。
- 云端 UI 写操作。
- 自动扫描用户所有项目。
- provider marketplace。
- skill 签名和供应链安全审计。
- 非 GitHub 代码平台的完整支持。

## 14. 验收标准

| 场景 | 验收要求 |
| --- | --- |
| 云端 Fork | fork 本仓库后无需先运行本地 CLI，即可看到根目录 cloud config、GitHub Actions workflow、Pages 数据目录和 `.agents/skills` 目录约定 |
| 云端初始化 | `init-cloud` 能生成云端配置、Actions 模板和 GitHub Pages 输出结构 |
| 系统级初始化 | `init-system` 能生成系统级配置和管理目录 |
| 项目级初始化 | `init-project` 能在当前项目生成项目级配置 |
| 云端 UI | GitHub Pages 构建后能只读展示 cloud skills、sources、Actions 记录 |
| 系统级 UI | 能显示 system skills，并读取 linked cloud 状态 |
| 项目级 UI | 能显示 project skills、linked system、间接 cloud 状态 |
| 权限边界 | cloud UI 无写操作；project UI 不直接改 system；system UI 不直接改 cloud |
| 三层覆盖 | 项目级 > 系统级 > 云端，UI 中能看到覆盖来源 |
| 断链处理 | 未关联系统或云端时 UI 正常显示当前层级，并提示可配置关联 |
| Resolver | GitHub URL、`package.json`、`go.mod` 能解析为 repo 清单 |
| Provider | Codex、DeepSeek 能通过统一 provider 接口调用 |
| Clean install | 只安装 manifest 管理的 skills，不污染用户手动 skills |
| Doctor | 能检查配置、provider、token、git、目录权限和 schema |

## 15. 默认假设

- v1 使用 Node.js + TypeScript。
- v1 使用 monorepo。
- v1 云端 UI 使用 GitHub Pages，只读静态页面。
- v1 系统级和项目级共用本地 Web UI，但根据当前 layer 加载不同配置和操作权限。
- v1 三层联动通过显式配置启用，不自动扫描用户所有目录。
- v1 默认优先级固定为项目级 > 系统级 > 云端。
- v1 本地 UI 默认只监听 `localhost`。
