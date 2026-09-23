> 类型: 综述 · 更新: 2026-09-23 · 关联: [[engineering/qiankun]] [[architecture/跨端框架选型指南]] [[architecture/架构师思维]] [[wiki/topics/构建工具演进]]
>
> ---

# 微前端与 qiankun 综述

> 编译自 [[engineering/qiankun]]（qiankun 面试题），串联「为什么需要微前端 / qiankun 核心机制 / 与其他方案对比」。

## 1. 微前端解决什么问题

- **巨石应用拆分**：将单一 SPA 拆成多个可独立开发、独立部署、技术栈无关的子应用。
- **团队自治**：不同团队维护不同子应用，互不影响构建与发布节奏。
- **渐进式迁移**：老系统可逐个子应用替换，不必一次性重写。

## 2. qiankun 核心机制

| 能力 | 做法 | 要点 |
|---|---|---|
| **JS 隔离（沙箱）** | 基于 `Proxy` 代理 `window` | 隔离全局变量，避免子应用互相污染 |
| **样式隔离** | 运行时自动加 `css` 前缀 / 构建期 `css Modules` / `Scoped CSS` | 默认 `shadow DOM` 或 `scoped` 策略 |
| **子应用加载** | 主应用 `fetch` 子应用 HTML 入口 → 解析 js/css → 动态插入 `<script>` | 天然支持独立部署、路径自动修正 |
| **通信** | `props` 传参 / `initGlobalState` 全局状态 / 自定义事件 `EventBus` | 父子 + 子子均可通过主应用中转 |
| **路由冲突** | `activeRule` 分配路由前缀 + 主应用劫持路由 | history 监听动态匹配子应用 |

### qiankun 与 single-spa

- qiankun **基于 single-spa 封装**，额外提供了开箱即用的沙箱、资源加载、样式隔离能力。

### 注册 API 速记

- `registerMicroApps(apps, { beforeLoad, beforeMount, afterMount, beforeUnmount, afterUnmount })`
- `start()` 启动
- `initGlobalState` / `onGlobalStateChange` / `setGlobalState` 全局状态

## 3. 关联与延伸

- 选型对比：[[architecture/跨端框架选型指南]]（含微前端 vs 跨端方案权衡）
- 架构思维：[[architecture/架构师思维]]
- 工程化底座：[[wiki/topics/构建工具演进]]（Vite/Webpack 对微前端模块加载的影响）

## 4. 常见面试题

1. 子应用如何实现 JS / 样式隔离？→ 沙箱 + 运行时前缀。
2. 子应用加载流程？→ fetch HTML 入口 → 解析资源 → 动态执行。
3. 父子 / 子子如何通信？→ props / 全局状态 / EventBus。
4. 路由冲突如何解决？→ activeRule 前缀 + 主应用劫持。
