# 前端知识笔记仓库

前端学习笔记与实战教程知识库。本仓库**按知识主题**组织（不再按课程来源分类），便于按主题查阅与从浅到深学习。

## 知识地图

### 🧭 总纲
- [知识总结（前端核心知识体系总览）](知识总结.md) — 建议入门先读，建立全景
- [Vue 完整笔记（总索引）](Vue完整笔记.md) — Vue 体系总入口，分章链接到 `vue/`

### 🟨 JavaScript · [`js/`](js/)
数据类型与堆栈 · 箭头函数 · 进程与线程 · [定时器精度](js/js定时器不精准问题解析.md) · [渲染调度 API](js/requestAnimationFrame和requestIdleCallback区别.md) · [常用数据结构](js/前端常用数据结构part2.md) · [抽象语法树](js/抽象语法树.md) · [JS 面试](js/JavaScript面试题完整笔记.md)

### 🟦 CSS · [`css/`](css/)
[核心概念](css/CSS核心概念详解.md) · [属性计算过程](css/CSS%20属性计算过程.md) · [包含块](css/CSS%20之包含块.md) · [Sass](css/sass学习笔记完整版.md)

### 🌐 浏览器 / 渲染 / 网络 · [`browser/`](browser/)
[页面渲染流程](browser/浏览器是如何渲染页面的.md) · [浏览器原理](browser/浏览器.md) · [事件机制](browser/事件.md) · [弱网与离线包](browser/弱网环境与离线包知识点汇总.md) · [百度地图跨域](browser/解决百度地图跨域的问题.html)

### 📡 HTTP 协议 · [`http/`](http/)
[HTTP 协议完整笔记](http/HTTP协议完整笔记.md)（含 1.0 / 1.1 / 2.0 / 3.0 演进与对比）

### 💚 Vue · [`vue/`](vue/)
[总索引](Vue完整笔记.md) → 核心原理 / 虚拟 DOM / 实例化 / 响应式 / 计算属性与侦听器 / 组件通信 / Composition API / 构建工具 / Vue2-3 差异 / 最佳实践 / 补充专题 ＋ [面试](vue/面试.md) · [模板编译原理](vue/模板编译原理.md) · [monorepo 工程创建](vue/monorepo工程创建.md)

### 🔵 React · [`react/`](react/)
[核心知识体系](react/React_核心知识体系.md) · [hooks 缓存](react/你是否懂得真正的React%20缓存hooks的用法.md) · [面试 30 问](react/React大厂面试30问.md)（[PDF](react/7.React国内国外大厂面试%2030问.pdf)）

### 🛠 工程化 / 构建 / 工具链 · [`engineering/`](engineering/)
[工程打包](engineering/工程打包.md) · [Webpack](engineering/Webpack完整梳理版.md) · [Vite](engineering/vite-笔记.md) · [Prettier](engineering/Prettier.md) · [npm 包管理](engineering/npm%20包管理.md) · [CI/CD](engineering/GitHub_Actions与GitLab_CI详解.md) · [框架设计](engineering/框架设计.md) · [Node CLI 工具](engineering/使用%20Node.js%20快速制作一个%20cli%20工具.md) · [微前端 qiankun](engineering/qiankun.md) · [PWA](engineering/PWA渐进式Web应用.md) · [SSR](engineering/SSR架构核心思想解读.md)

### ⚡ 性能优化 · [`performance/`](performance/)
[优化指南](performance/前端性能优化完全指南.md) · [方法论](performance/前端性能优化方法论.md) · [二进制与性能](performance/二进制与性能优化.md)

### 🏛 架构 / 设计 / 方法论 · [`architecture/`](architecture/)
[原子化架构](architecture/前端原子化架构详解.md) · [大型项目构建](architecture/如何构建一个大型项目.md) · [设计模式](architecture/设计模式.md) · [跨端选型](architecture/跨端框架选型指南.md) · [API 可扩展性](architecture/API的可扩展性设计.md) · [文档协同](architecture/文档协同.md) · [架构师思维](architecture/架构师思维.md) · [**Agent 项目架构设计**](architecture/Agent项目架构设计.md)（六层架构 / 编排 / 工具 / 记忆 / 前端 / 部署 / 安全） · [**Agent 宿主平台剖析（以 WorkBuddy 为例）**](architecture/Agent宿主平台剖析-以WorkBuddy为例.md)（拿真实产品反推大脑搭建）

### 📊 监控 / 可观测性 · [`monitoring/`](monitoring/)
[监控概况](monitoring/前端服务监控概况.md) · [用户行为埋点](monitoring/用户行为收集与埋点.md) · [数据上报](monitoring/数据上报.md) · [错误监控](monitoring/错误监控.md) · [页面性能监控](monitoring/页面性能监控.md)

### 📱 移动端 / 跨端 / 桌面 · [`mobile/`](mobile/)
[webapp 常见问题](mobile/webapp常见问题.md) · [移动端面试题](mobile/移动端面试题汇总.md) · [Electron](mobile/Electron%20笔记.md)

### 🎯 面试 / 综合 · [`interview/`](interview/)
[许威面试题汇总（前端+后端+AI）](interview/许威面试题汇总-前后端AI.md) · [**自建 Agent 面试题库**](interview/自建Agent面试题库.md)（132 题 / 12 维度：架构 / 算法 / 记忆 / 工具与 MCP / 多 Agent / RAG / 容错 / 评测 / 安全 / 可观测 / 部署 / 系统设计）· [**Agent 面试题学习线路**](interview/Agent面试题学习线路.md)（9 套从浅往深 · 必背/加分分级 + 面试话术）

### 🧪 工具 / 演示（练习稿，非系统笔记）· [`tools/`](tools/)
`index.js` · `js-tools.js` · Promise 练习 · react-16 简化版 · vue3 渲染器源码解析演示 · 模板编译演示

### 📁 资料（课程配套 docx / 图片）· [`资料/`](资料/)

---

## 推荐学习路线（从浅入深）

`知识总结`（总纲）→ JS 基础 → CSS 基础 → 浏览器与 HTTP → Vue / React 基础 → 工程化（打包 / Vite / Webpack / CI）→ 框架进阶（虚拟 DOM / hooks / 渲染演进）→ 性能优化 → 架构设计 / 源码级 → 面试与监控专题

> 说明：本仓库已移除按"课程来源"（duyi/高薪课、架构师课）的分类，统一按知识主题扁平组织；大篇幅主题（如 Vue）拆分为子文件并由总索引链接。
