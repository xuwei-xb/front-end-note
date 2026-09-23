# Vue2 与 Vue3 响应式差异

> 类型: comparison | 创建: 2026-09-23 | 更新: 2026-09-23
> 来源: [[vue/响应式系统]] · [[vue/Vue2与Vue3差异]]

## 摘要
Vue2 用 `Object.defineProperty` + 发布订阅实现响应式，存在属性增删 / 数组下标 / Map-Set 追踪缺陷；Vue3 改用 `Proxy` + `Reflect` + `Effect`，原生支持上述场景并带来编译期优化。

## 对比

| 对比项 | Vue2 | Vue3 |
|--------|------|------|
| 实现原理 | Object.defineProperty | Proxy |
| 属性添加/删除 | 需 `$set` / `$delete` | 自动响应式 |
| 数组下标修改 | 需 `$set` | 直接支持 |
| Map/Set | 不支持 | 支持 |
| IE 兼容 | IE8+ | 不支持 IE |

- Vue2 缺陷：无法检测属性添加/删除、数组下标修改无效、不支持 Map/Set（见 [[vue/响应式系统]] 4.1.4）。
- Vue3 API：`reactive` / `ref` / `computed` / `readonly`，深层响应式（见 [[vue/响应式系统]] 4.2）。

## 关联
- 概念: [[wiki/topics/虚拟DOM综述]] · [[wiki/topics/性能优化总览]]
- 来源: [[vue/响应式系统]] · [[vue/Vue2与Vue3差异]] · [[vue/CompositionAPI]]
- 跨框架: React 用可变状态 + 调度（见 [[react/React_核心知识体系]]）

## 引用来源
- [1] [[vue/响应式系统]] — Vue2 defineProperty 与 Vue3 Proxy 实现
- [2] [[vue/Vue2与Vue3差异]] — 响应式 / API / 模板 / 性能差异总表

## 变更记录
- 2026-09-23: 由 [[vue/响应式系统]] [[vue/Vue2与Vue3差异]] 编译生成对比页
