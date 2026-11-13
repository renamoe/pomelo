# 项目指南

## 项目定位

Pomelo 是部署于 GitHub Pages 的静态前端 Web 3D 物理模拟网站。

## 文件结构

- `.gitignore`：Git 忽略规则。
- `AGENTS.md`：项目定位、结构、索引与通用规范。
- `index.html`：页面入口。
- `package.json`、`package-lock.json`：依赖与开发、构建命令。
- `vite.config.ts`、`tsconfig.json`：构建与类型检查配置。
- `src/`：应用入口、共享数据及样式。
  - `physics/`：物理世界。
  - `rendering/`：渲染场景。
- `docs/`：项目文档。
  - `AGENTS.md`：文档目录规范入口。
  - `技术规划.md`：技术选型、架构与运行方式。

## 通用规范

- 文档性质的文件均使用中文，语言尽可能简练；代码标识、包名和链接保留原文。
- 项目文档统一维护于 `docs/`，遵循该目录的 `AGENTS.md`。
- 本文件只维护项目定位、简要结构、外部索引及整个项目通用的守则和规范。
- 具体技术细节写入对应文档，本文件保留便于查找的索引。
- 项目定位、结构或规范变更时，同步更新本文件及相关文档。
- 保持静态部署能力；物理与渲染分离，具体设计见技术文档。

## 文档索引

- [技术规划](docs/技术规划.md)
- [文档目录规范](docs/AGENTS.md)

## 外部索引

- [Vite](https://vite.dev/guide/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Three.js](https://threejs.org/docs/)
- [Rapier JavaScript](https://rapier.rs/docs/user_guides/javascript/getting_started_js/)
- [lil-gui](https://lil-gui.georgealways.com/)
- [GitHub Pages](https://docs.github.com/zh/pages)
