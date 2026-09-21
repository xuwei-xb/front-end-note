## 九、Vue2与Vue3核心差异

### 9.1 响应式系统

| 对比项 | Vue2 | Vue3 |
|--------|------|------|
| **实现原理** | Object.defineProperty | Proxy |
| **属性添加/删除** | 需要$set/$delete | 自动响应式 |
| **数组下标修改** | 需要$set | 直接支持 |
| **Map/Set支持** | 不支持 | 支持 |
| **IE兼容** | IE8+ | 不支持IE |

### 9.2 API风格

| Vue2 Options API | Vue3 Composition API |
|------------------|---------------------|
| data | ref / reactive |
| computed | computed |
| watch | watch / watchEffect |
| methods | 普通函数 |
| 生命周期钩子 | onMounted等 |
| this访问 | 无this |

### 9.3 模板差异

#### 9.3.1 v-if与v-for优先级

```html
<!-- Vue2: v-for优先级更高 -->
<div v-for="item in list" v-if="item.active"></div>

<!-- Vue3: v-if优先级更高，会报错 -->
<!-- 需要使用template包裹 -->
<template v-for="item in list" :key="item.id">
  <div v-if="item.active">{{ item.name }}</div>
</template>
```

#### 9.3.2 插槽语法

```html
<!-- Vue2 -->
<template slot="header" slot-scope="{ user }">
  {{ user.name }}
</template>

<!-- Vue3 -->
<template #header="{ user }">
  {{ user.name }}
</template>
```

### 9.4 全局API变化

```javascript
// Vue2
Vue.prototype.$http = axios
Vue.component('MyButton', MyButton)
Vue.directive('focus', FocusDirective)

// Vue3
const app = createApp(App)
app.config.globalProperties.$http = axios
app.component('MyButton', MyButton)
app.directive('focus', FocusDirective)
app.mount('#app')
```

### 9.5 性能优化

| 优化点 | 说明 |
|--------|------|
| **PatchFlag** | 静态标记，diff只比对动态节点 |
| **静态提升** | 静态节点只创建一次，复用 |
| **事件缓存** | 事件处理函数缓存复用 |
| **SSR优化** | 静态内容直接字符串输出 |
| **Tree-shaking** | 按需引入，体积更小 |

### 9.6 新增特性

| 特性 | 说明 |
|------|------|
| **Fragment** | 组件可以有多个根节点 |
| **Teleport** | 将组件渲染到DOM树其他位置 |
| **Suspense** | 异步组件加载状态处理 |
| **自定义渲染器** | 可创建自定义渲染器 |

---
