# MEMORY.md — 长期记忆

本文件保存跨对话需要记住的持久信息。每次新对话读取此文件，重要信息在对话结束时更新到这里。

---

## 用户与项目背景

- **仓库名称**：skills-manage
- **仓库用途**：个人 AI 助手技能管理，持续演化的 AI 工作空间
- **初始化日期**：2026-03-30
- **AI 助手代号**：Claw

---

## 用户偏好

- 使用技能（skill）时，统一保存在 `.agents/skills/<skill-name>/`，主入口为 `SKILL.md`
- 用户重视技能的可复用性、持久化和可发现性
- 用户期望云端能力采用 fork-first：直接 fork 仓库后就拥有 cloud config、GitHub Actions、Pages 数据目录和 skills 目录约定；本地 CLI 安装应是 system/project 联动的可选步骤，而不是云端能力的前置步骤。

---

## 持久约定

- 使用中文作为主要交流语言
- 文件保持简洁，不过度设计
- 优先用已有工具和库，避免引入不必要的依赖

---

## 技术栈决策

- **项目形态**：Node.js + TypeScript monorepo。
- **包管理与工作区**：暂定使用 pnpm workspace，适合多 packages 管理与 CLI 发布。
- **核心包**：`packages/core` 承载三层联动、LayerGraph、resolver、fetcher、sync、manifest 等纯逻辑。
- **CLI**：`packages/cli` 提供 `skills-manage` 命令，支持 `npx` 首次运行与全局安装后持续使用。
- **配置与校验**：`packages/schemas` 维护三层 config、manifest schema；运行时使用 schema 校验配置与 manifest。
- **UI**：`packages/local-ui` 和 `packages/cloud-ui` 分离；本地 UI 支持系统级/项目级写操作，云端 UI 仅面向 GitHub Pages 静态只读展示。首版 UI 框架暂定 React + Vite。
- **本地服务**：本地 UI 默认只监听 `localhost`，通过本地服务调用核心能力；首版服务框架暂定 Fastify。
- **AI Provider**：`packages/providers` 通过统一接口接入 Codex、DeepSeek，后续可扩展 OpenAI、Claude、本地模型或企业网关。
- **Context7 优先**：GitHub source 更新 skill 时默认先尝试 Context7 参考；Context7 不可用时才退回 GitHub 仓库原始信息，避免基础工具 skill 退化为静态摘要。
- **Resolver v1**：支持 GitHub URL、`package.json`、`go.mod`，目标是解析出 GitHub 仓库地址，无法解析时记录为 unresolved。
- **Fetcher v1**：默认使用 git shallow clone/fetch，后续可替换为 GitHub API、压缩包下载或缓存镜像。
- **云端能力**：GitHub Actions 负责定时/手动 resolve、update、validate、release，并可通过 Context7 refresh workflow 刷新仓库文档索引；GitHub Pages 发布只读 UI 与静态 JSON 数据。

---

## 重要决策记录

| 日期 | 决策 | 原因 |
|---|---|---|
| 2026-04-29 | v1 技术栈确定为 Node.js + TypeScript monorepo；暂定 pnpm workspace、React + Vite、Fastify；核心能力拆分到 core/cli/local-ui/cloud-ui/providers/schemas/templates | 与需求文档中的 v1 默认假设、三层 UI、CLI、GitHub Pages 和 provider/resolver/fetcher 边界一致 |

---

*最后更新：2026-04-29*
