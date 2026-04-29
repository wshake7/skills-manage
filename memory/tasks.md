# 任务追踪

## 进行中

- [~] 实施 skills-manage v1 骨架
  - 已完成：pnpm + TypeScript monorepo 根配置。
  - 已完成：三层 config 与 skill manifest schema。
  - 已完成：core 包首版配置读写、LayerGraph、resolver、git fetcher、manifest 工具。
  - 已完成：Codex/DeepSeek provider 接口与基础占位实现。
  - 已完成：CLI 首版命令入口：`init-cloud`、`init-system`、`init-project`、`doctor`、`sync`、`ai-update`、`publish-cloud-ui`、`ui`。
  - 已完成：local-ui/cloud-ui 权限边界占位包。
  - 已完成：cloud/system/project 初始化模板和云端 Actions 模板。
  - 已完成：新增中英双语 README。
  - 已完成：拆分中英文 README，并补充 cloud/system/project 三层安装使用流程。
  - 已完成：新增本地全局安装脚本，支持 `pnpm global:install` 后直接运行 `skills-manage`。
  - 已完成：新增 `sm` 短命令，并让 `sm ui` 默认从 `~/.skills-manage` 启动系统级 UI。
  - 已完成：实现最小可访问本地 UI 服务，`sm ui` 会真正监听 localhost 并提供首页与状态 API。
  - 已完成：使用 `ui-ux-pro-max` 优化本地 UI 视觉与信息架构。
  - 已完成：移除 UI 中的请求端点展示，保留内部状态接口。
  - 已完成：将产品入口调整为 fork-first，仓库根目录直接携带 cloud config、Actions、Pages 数据目录和 `.agents/skills` 约定。
  - 下一步：把 CLI 初始化改为复制模板文件，并实现本地 Fastify 服务与 React UI 首屏。
