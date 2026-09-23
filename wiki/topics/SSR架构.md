> 类型: 综述 · 更新: 2026-09-23 · 关联: [[engineering/SSR架构核心思想解读]] [[performance/前端性能优化完全指南]] [[vue/补充专题]] [[wiki/topics/性能优化总览]]
>
> ---

# SSR 架构核心思想综述

> 编译自 [[engineering/SSR架构核心思想解读]]，提炼「演进脉络 / 同构渲染原理 / 6 大坑点」。

## 1. Web 应用渲染演进

1. **静态页面**：纯 HTML。
2. **动态页面**：后端模板引擎（JSP/PHP/ASP/Rails）+ LAMP。
3. **SPA / CSR**：Ajax + 前端框架（Angular/React/Vue），数据驱动视图、组件化、前端路由、状态管理。
   - 痛点：**首屏白屏**（`div#app` 空壳）、**SEO 不友好**。
4. **SSR**：服务器端渲染首屏 → 返回完整 HTML → 客户端水合还原为 SPA。
   - 首屏 ≠ 首页，指用户请求的第一个页面。

## 2. 同构渲染（Isomorphic）原理

- 服务端用 `createSSRApp` + `renderToString` 把 Vue 实例渲染为 **HTML 字符串**返回。
- 客户端拿到 HTML 后做 **Hydration（水合）**，把静态结构重新激活为可交互的 SPA。
- 服务端结构与客户端结构必须一致，否则报 `Hydration completed but mismatch`。

## 3. 六大核心注意点（通用，Nuxt 等框架同理）

| # | 注意点 | 关键结论 |
|---|---|---|
| 1 | 服务器端响应 | 服务端**禁用响应式**（数据仅作静态状态），提升性能 |
| 2 | 生命周期钩子 | `onMounted`/`onUpdated` 等 DOM 相关钩子**只在客户端**执行；服务端侧写副作用（如 `setInterval`）须在 `onMounted` 内，否则内存泄漏 |
| 3 | 平台特有 API | 通用代码不能访问 `window` 等；浏览器 API 放 `onMounted`，请求用 `node-fetch` 等通用库 |
| 4 | 跨请求状态污染 | 每个请求创建**全新** Vue 实例（工厂函数返回实例），不能共用单例 |
| 5 | 激活不匹配 | 结构嵌套错误 / 数据含随机值 → 服务端/客户端 HTML 不一致 |
| 6 | Teleports | SSR 需特殊处理，用占位符替换最终 DOM 字符串 |

## 4. CSR 项目重构为 SSR 的步骤

1. 改造 router（返回工厂函数）
2. 改造入口文件（分离客户端/服务端入口）
3. 编写服务端渲染逻辑（`renderToString`）
4. 客户端水合（`hydrate`）
5. 解决组件库渲染问题（避免服务端访问 DOM）

## 5. 关联与延伸

- 首屏/SEO 收益对应：[[performance/前端性能优化完全指南]] 的「首屏优化」「Core Web Vitals」。
- 同构思想与：[[wiki/topics/性能优化总览]] 中的「SSR/SSG 方案」。
- Vue 体系衔接：[[vue/补充专题]]。
