# Pomelo

基于 Vite、TypeScript、Three.js 和 Rapier 的静态前端 3D 物理模拟网站。

## 环境要求

推荐使用 Node.js 24 LTS，使用 npm 管理依赖。

## 安装依赖

在项目根目录执行：

```bash
npm ci
```

## 本地开发

```bash
npm run dev
```

打开终端输出的本地地址。

## 生产构建

```bash
npm run build
```

先执行 TypeScript 类型检查，再由 Vite 构建，产物输出至 `dist/`。

## 预览构建产物

构建完成后执行：

```bash
npm run preview
```

打开终端输出的预览地址。预览服务仅用于本地检查，不是生产服务器。

## 静态部署

将 `dist/` 中的内容部署到 GitHub Pages 等静态托管服务。资源路径已配置为相对路径，支持子目录部署；当前未配置自动部署工作流。

Rapier compat 内嵌 WASM，构建时可能出现大包提示，不影响产物生成。

架构与代码结构见 [技术规划](docs/技术规划.md)。
