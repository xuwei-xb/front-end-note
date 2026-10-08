# Wiki 索引（统一内容目录）

> 总页面数: 约 226（md，含 122 个拆分章节；不含 `tools/` 练习稿） | 最后更新: 2026-10-08
> 模式：笔记层（现有目录）＋ 连接层（本 `wiki/`）。规则见 [[SCHEMA]]。

## 入口枢纽
- [[README]] — 知识地图 + 学习路线（人类阅读入口）
- [[知识总结]] — 前端核心知识体系总纲（10 章锚点目录）
- [[Vue完整笔记]] — Vue 体系总索引

## 主题综述（编译层 · `wiki/topics/`）
- [[wiki/topics/虚拟DOM综述]] — 虚拟 DOM 概念 / Diff / PatchFlag，串 Vue·React·性能
- [[wiki/topics/Vue2与Vue3响应式差异]] — defineProperty vs Proxy 对比
- [[wiki/topics/构建工具演进]] — Webpack → Vite 演进与选型
- [[wiki/topics/性能优化总览]] — 加载 / 渲染 / 运行三层性能串联
- [[wiki/topics/微前端与qiankun]] — 微前端动机 / qiankun 沙箱·样式·通信·路由
- [[wiki/topics/SSR架构]] — 渲染演进 / 同构原理 / 6 大坑点
- [[wiki/topics/设计模式总览]] — SOLID + 创建/结构/行为三型速查（design模式已拆分）

## 按主题

### JavaScript · [[js/]]
- [[js/js数据类型与堆栈详解]] 📒 · [[js/箭头函数]] 📒 · [[js/进程与线程]] 📒
- [[js/js定时器不精准问题解析]] 📒 · [[js/requestAnimationFrame和requestIdleCallback区别]] 📒
- [[js/前端常用数据结构part2]] 📒 · [[js/抽象语法树]] 📒
- [[js/JavaScript面试题完整笔记]] 🎯

### CSS · [[css/]]
- [[css/CSS核心概念详解]] 📒 · [[css/CSS 属性计算过程]] 📒 · [[css/CSS 之包含块]] 📒 · [[css/sass学习笔记完整版]] 📒

### 浏览器 / 渲染 / 网络 · [[browser/]]
- [[browser/浏览器是如何渲染页面的]] 📒 · [[browser/浏览器]] 📒 · [[browser/事件]] 📒 · [[browser/弱网环境与离线包知识点汇总]] 📒

### HTTP · [[http/]]
- [[http/HTTP协议完整笔记]] 📒

### Vue · [[vue/]]
- [[vue/核心原理概览]] 📒 · [[vue/虚拟DOM]] 📒 · [[vue/实例化过程]] 📒 · [[vue/响应式系统]] 📒
- [[vue/计算属性与侦听器]] 📒 · [[vue/组件通信]] 📒 · [[vue/CompositionAPI]] 📒 · [[vue/项目构建工具]] 📒
- [[vue/Vue2与Vue3差异]] 📒 · [[vue/常见问题与最佳实践]] 📒 · [[vue/补充专题]] 📒
- [[vue/模板编译原理]] 📒 · [[vue/monorepo工程创建]] 📒 · [[vue/面试]] 🎯

### React · [[react/]]
- [[react/React_核心知识体系]] 📒 · [[react/你是否懂得真正的React 缓存hooks的用法]] 📒 · [[react/React大厂面试30问]] 🎯

### 工程化 · [[engineering/]]
- [[engineering/工程打包]] 📒 · [[engineering/Webpack完整梳理版]] 📒 · [[engineering/vite-笔记]] 📒 · [[engineering/Prettier]] 📒 · [[engineering/npm 包管理]] 📒
- [[engineering/GitHub_Actions与GitLab_CI详解]] 📒 · [[engineering/框架设计]] 📒 · [[engineering/使用 Node.js 快速制作一个 cli 工具]] 📒
- [[engineering/qiankun]] 📒 · [[engineering/PWA渐进式Web应用]] 📒 · [[engineering/SSR架构核心思想解读]] 📒
- [[engineering/notice]] 📒（Vite 笔记同源版本；engineering 即前端工程化汇总，归属合理，保留）

### 性能优化 · [[performance/]]
- [[performance/前端性能优化完全指南]] 📒 · [[performance/前端性能优化方法论]] 📒 · [[performance/二进制与性能优化]] 📒

### 架构 / 设计 · [[architecture/]]
- [[architecture/前端原子化架构详解]] 📒 · [[architecture/如何构建一个大型项目]] 📒 · [[architecture/设计模式]] 📒
- [[architecture/跨端框架选型指南]] 📒 · [[architecture/API的可扩展性设计]] 📒 · [[architecture/文档协同]] 📒 · [[architecture/架构师思维]] 📒
- [[architecture/Agent项目架构设计]] 📒（AI Agent 系统设计：判型 / 六层架构 / 编排 / 工具 / 记忆 / 接入 / 部署 / 评测 / 安全 / 跨案例同构）
- [[architecture/Agent宿主平台剖析-以WorkBuddy为例]] 📒（以真实 Agent 宿主反推方法论：单主脑循环 + 按需派子 Agent · Skill/Connector 分离 · 三层记忆 · 分级路由 · 护栏前置）

### 监控 / 可观测性 · [[monitoring/]]
- [[monitoring/前端服务监控概况]] 📒 · [[monitoring/用户行为收集与埋点]] 📒 · [[monitoring/数据上报]] 📒 · [[monitoring/错误监控]] 📒 · [[monitoring/页面性能监控]] 📒

### 移动端 / 跨端 / 桌面 · [[mobile/]]
- [[mobile/webapp常见问题]] 📒
- [[mobile/移动端面试题汇总]] 🎯
- [[mobile/Electron 笔记]] 📒

### 面试 / 综合 · [[interview/]]
- [[interview/许威面试题汇总-前后端AI]] 🎯（95 题；第十一章 Agent 系统设计深挖 16 题精选）
- [[interview/自建Agent面试题库]] 🎯（132 题完整版 / 12 维度：架构设计 · 核心算法 · 上下文与记忆 · 工具与 MCP · 多 Agent · RAG · 报错容错 · 评测 · 安全 · 可观测成本 · 部署运维 · 系统设计）
- [[interview/Agent面试题学习线路]] 🎯（9 套从浅往深路线 · 必背/加分/可跳过三级分级 · 每套面试话术 + 跨套追问 + 临考 12 题最小集）
- [[interview/面试索引]] 📑（串联全部面试资料）

## 已拆分巨型文件（索引 + 子目录，2026-09-23）
> 以下 7 个 >1000 行文件已原地拆分为「索引页 + 同名子目录」，原路径入链全部保留：
- [[css/sass学习笔记完整版]]（11 章，目录 `css/sass学习笔记完整版/`）
- [[mobile/Electron 笔记]]（16 节，目录 `mobile/Electron 笔记/`）
- [[engineering/GitHub_Actions与GitLab_CI详解]]（10 节，目录 `engineering/GitHub_Actions与GitLab_CI详解/`）
- [[react/React大厂面试30问]]（7 组，目录 `react/React大厂面试30问/`）
- [[architecture/设计模式]]（5 型，目录 `architecture/设计模式/`）
- [[vue/面试]]（59 题，目录 `vue/面试/`）
- [[vue/monorepo工程创建]]（14 节，目录 `vue/monorepo工程创建/`）
> 注：`知识总结.md` 作为总纲枢纽页保留整体不拆。

## 交叉引用（已打通 / 持续维护）
> 以下跨主题概念已通过 `wiki/topics/` 综述页 + 源笔记「关联」小节建立双向链接：
- 虚拟 DOM / Diff：[[vue/虚拟DOM]] ↔ [[wiki/topics/虚拟DOM综述]] ↔ [[performance/前端性能优化完全指南]] ↔ [[react/React_核心知识体系]]
- 响应式：[[vue/响应式系统]] ↔ [[wiki/topics/Vue2与Vue3响应式差异]] ↔ [[react/React_核心知识体系]]
- 性能优化：[[performance/前端性能优化完全指南]] ↔ [[wiki/topics/性能优化总览]] ↔ [[vue/补充专题]] ↔ [[engineering/框架设计]]
- 构建工具演进：[[engineering/Webpack完整梳理版]] ↔ [[wiki/topics/构建工具演进]] ↔ [[engineering/vite-笔记]]
- 设计模式：[[architecture/设计模式]] ↔ [[wiki/topics/设计模式总览]]
- 微前端：[[engineering/qiankun]] ↔ [[wiki/topics/微前端与qiankun]] ↔ [[architecture/跨端框架选型指南]]
- SSR：[[engineering/SSR架构核心思想解读]] ↔ [[wiki/topics/SSR架构]] ↔ [[performance/前端性能优化完全指南]]
- AI Agent 架构：[[architecture/Agent项目架构设计]] ↔ [[architecture/Agent宿主平台剖析-以WorkBuddy为例]]（实例反推）↔ [[interview/许威面试题汇总-前后端AI]]（AI 章节问答 + 第十一章深挖）↔ [[interview/自建Agent面试题库]]（132 题完整版）↔ [[interview/Agent面试题学习线路]]（9 套学习路线）↔ [[engineering/框架设计]]（插件化）↔ [[architecture/如何构建一个大型项目]]

## 类型图例
📒 笔记 · 📑 索引 · 🎯 面试 · 🧪 练习（`tools/` 不计入）
