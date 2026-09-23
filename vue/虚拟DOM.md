> 类型: 笔记 · 更新: 2026-09-23
> 关联: 待补
>
> ---

## 二、虚拟DOM

### 2.1 什么是虚拟DOM

虚拟DOM是一个**轻量化的JavaScript对象**，用于描述真实DOM的结构和属性。它是真实DOM的抽象表示。

```javascript
// 虚拟DOM示例
const vnode = {
  tag: 'div',
  props: { id: 'app', class: 'container' },
  children: [
    { tag: 'p', children: 'Hello Vue' }
  ]
}
```

### 2.2 为什么需要虚拟DOM

**核心原因：** 框架频繁更新DOM时，直接操作真实DOM会触发大量重排重绘，导致性能问题。
**使用真实dom 不一定会让性能浏览器渲染性能变差，但是想vue、react这样的框架会频繁的更新dom，导致性能变差（选择虚拟dom 的理由）**

### 2.3 虚拟DOM的优点

| 优点 | 说明 |
|------|------|
| **性能优化** | 通过Diff算法批量更新，减少直接操作DOM次数 |
| **跨平台能力** | 与渲染逻辑解耦，可适配浏览器、SSR、React Native等 |
| **声明式开发** | 开发者关注状态描述，框架自动处理DOM更新 |

### 2.4 虚拟DOM的缺点

| 缺点 | 说明 |
|------|------|
| **首次渲染开销** | 需额外构建虚拟DOM树 |
| **内存占用** | 维护虚拟DOM树消耗内存 |
| **Diff复杂度** | 极端情况（无Key列表频繁变动）效率下降 |

### 2.5 Diff算法核心策略

#### 2.5.1 同层比较

仅对比同层级节点，不跨层级移动，复杂度从O(n³)降至O(n)。
- **传统Diff**：深度优先遍历，递归比较所有子节点。  
- **React Fiber**：广度优先遍历，将树结构转为链表，支持任务分片。  

#### 2.5.2 Key的作用

- **无Key**：Vue尽可能复用同类型元素
- **有Key**：基于Key变化重新排列元素顺序

```html
<!-- 正确使用Key -->
<ul>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</ul>
```

#### 2.5.3 类型判断

节点类型不同（如`div` → `span`），直接替换整个子树。

### 2.6 Vue3 Diff优化：PatchFlag

Vue3引入静态标记（PatchFlag），只在动态节点上添加标记，diff时只比对标记节点。

```javascript
export const enum PatchFlags {
  TEXT = 1,           // 动态文本节点
  CLASS = 1 << 1,     // 动态class
  STYLE = 1 << 2,     // 动态style
  PROPS = 1 << 3,     // 动态属性
  FULL_PROPS = 1 << 4, // 具有动态key属性
  HYDRATE_EVENTS = 1 << 5, // 带有监听事件
  HOISTED = -1,       // 静态提升节点
  BAIL = -2           // 退出优化模式
}
```

---

## 关联
- 综述: [[wiki/topics/虚拟DOM综述]] · 性能: [[wiki/topics/性能优化总览]]
- 跨框架: [[react/React_核心知识体系]]（Fiber 任务分片）
