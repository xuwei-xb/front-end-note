# Vue 完整学习笔记

---

## 目录

- [一、Vue核心原理概览](#一vue核心原理概览)
- [二、虚拟DOM](#二虚拟dom)
- [三、Vue实例化过程](#三vue实例化过程)
- [四、响应式系统](#四响应式系统)
- [五、计算属性、侦听器与方法](#五计算属性侦听器与方法)
- [六、组件通信](#六组件通信)
- [七、Vue3 Composition API](#七vue3-composition-api)
- [八、Vue3项目构建工具](#八vue3项目构建工具)
- [九、Vue2与Vue3核心差异](#九vue2与vue3核心差异)

---

## 一、Vue核心原理概览

### 1.1 Vue本质

Vue本质是一个构造函数，必须通过`new`实例化调用：

```javascript
function Vue(options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

### 1.2 Vue核心架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Vue 核心架构                           │
├─────────────────────────────────────────────────────────────┤
│  Data (响应式数据)                                           │
│    ↓                                                         │
│  Observer (数据劫持) → Dep (依赖收集)                         │
│    ↓                                                         │
│  Watcher (订阅者) → Virtual DOM                              │
│    ↓                                                         │
│  Render → Patch → Real DOM                                   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Vue编译流程

```
template → parse → AST → optimize → generate → render函数
```

**流程详解：**
1. **parse**：将模板解析为AST（抽象语法树）
2. **optimize**：标记静态节点，优化diff性能
3. **generate**：将AST转换为render函数字符串

---

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

## 三、Vue实例化过程

### 3.1 实例化流程图

```
实例化Vue
    │
    ├── 1. 合并配置选项 (mergeOptions)
    │       └── 处理 extend/mixins
    │
    ├── 2. 初始化生命周期 (initLifecycle)
    │
    ├── 3. 初始化事件系统 (initEvents)
    │
    ├── 4. 初始化渲染函数 (initRender)
    │       └── 初始化 $createElement, $attrs, $listeners
    │
    ├── 5. 调用 beforeCreate 钩子
    │
    ├── 6. 初始化依赖注入 (initInjections)
    │
    ├── 7. 初始化状态 (initState)
    │       ├── initProps
    │       ├── initMethods
    │       ├── initData → 响应式处理
    │       ├── initComputed
    │       └── initWatch
    │
    ├── 8. 调用 created 钩子
    │
    ├── 9. 编译模板 (compile)
    │       ├── 解析template为AST
    │       ├── 优化AST
    │       └── 生成render函数
    │
    ├── 10. 挂载实例 ($mount)
    │       ├── 调用 beforeMount 钩子
    │       ├── 创建Watcher
    │       ├── 执行render生成VNode
    │       ├── 执行patch生成真实DOM
    │       └── 调用 mounted 钩子
    │
    └── 实例化完成
```

### 3.2 核心步骤详解

#### 3.2.1 initState（状态初始化）

```javascript
export function initState(vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) initData(vm)
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch) initWatch(vm, opts.watch)
}
```

#### 3.2.2 initData（响应式处理核心）

```javascript
function initData(vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
  
  // 代理 data 到 vm 实例
  Object.keys(data).forEach(key => {
    proxy(vm, `_data`, key)
  })
  
  // 响应式处理
  observe(data, true)
}
```

---

## 四、响应式系统

### 4.1 Vue2响应式原理

#### 4.1.1 核心机制

**Object.defineProperty + 发布订阅模式**

```javascript
function defineReactive(obj, key, val) {
  const dep = new Dep()
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 依赖收集
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      // 派发更新
      dep.notify()
    }
  })
}
```

#### 4.1.2 Dep（依赖管理器）

```javascript
class Dep {
  constructor() {
    this.subs = []
  }
  
  addSub(sub) {
    this.subs.push(sub)
  }
  
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}
```

#### 4.1.3 Watcher（订阅者）

```javascript
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.getter = expOrFn
    this.cb = cb
    this.value = this.get()
  }
  
  get() {
    Dep.target = this
    const value = this.getter.call(this.vm)
    Dep.target = null
    return value
  }
  
  update() {
    this.run()
  }
  
  run() {
    const value = this.get()
    if (value !== this.value) {
      const oldValue = this.value
      this.value = value
      this.cb.call(this.vm, value, oldValue)
    }
  }
}
```

#### 4.1.4 Vue2响应式缺陷

| 缺陷 | 说明 | 解决方案 |
|------|------|----------|
| **无法检测属性添加/删除** | 后添加的属性不是响应式的 | `Vue.set()` / `this.$set()` |
| **数组下标修改无效** | `arr[0] = 'x'` 不触发更新 | `Vue.set()` 或 `arr.splice()` |
| **不支持Map/Set** | 无法追踪集合类型 | Vue3 Proxy方案 |

### 4.2 Vue3响应式原理

#### 4.2.1 核心机制

**Proxy + Reflect + Effect**

```javascript
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key) // 依赖收集
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key) // 派发更新
      return result
    }
  })
}
```

#### 4.2.2 Effect（副作用函数）

```javascript
let activeEffect = null
const targetMap = new WeakMap()

function effect(fn) {
  activeEffect = fn
  fn()
  activeEffect = null
}

function track(target, key) {
  if (!activeEffect) return
  
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  
  dep.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  
  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect())
  }
}
```

#### 4.2.3 Proxy拦截器详解

| 拦截器 | 作用 | 触发操作 |
|--------|------|----------|
| `get` | 拦截属性读取 | `proxy.key` |
| `set` | 拦截属性设置 | `proxy.key = value` |
| `has` | 拦截in操作符 | `key in proxy` |
| `deleteProperty` | 拦截删除操作 | `delete proxy.key` |
| `ownKeys` | 拦截键值获取 | `Object.keys(proxy)` |

#### 4.2.4 Vue3响应式API

##### reactive

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  nested: {
    value: 1
  }
})

// 深层响应式
state.nested.value = 2 // 触发更新
```

##### ref

```javascript
import { ref } from 'vue'

const count = ref(0)

console.log(count.value) // 0
count.value++ // 触发更新

// 模板中自动解包
// <div>{{ count }}</div>  无需 .value
```

##### computed

```javascript
import { ref, computed } from 'vue'

const count = ref(1)

// 只读计算属性
const plusOne = computed(() => count.value + 1)

// 可写计算属性
const fullName = computed({
  get: () => firstName.value + ' ' + lastName.value,
  set: (val) => {
    [firstName.value, lastName.value] = val.split(' ')
  }
})
```

##### readonly

```javascript
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })
const copy = readonly(original)

copy.count++ // 警告：只读属性无法修改
```

---

## 五、计算属性、侦听器与方法

### 5.1 对比总结

| 特性 | computed | watch | methods |
|------|----------|-------|---------|
| **缓存** | ✅ 有缓存 | ❌ 无缓存 | ❌ 无缓存 |
| **异步支持** | ❌ 不支持 | ✅ 支持 | ✅ 支持 |
| **返回值** | 必须返回值 | 可选 | 可选 |
| **使用场景** | 派生状态 | 异步操作/复杂数据处理 | 事件处理 |

### 5.2 computed详解

#### 5.2.1 基础用法

```javascript
// Vue2
computed: {
  reversedMessage() {
    return this.message.split('').reverse().join('')
  }
}

// Vue3
import { ref, computed } from 'vue'
const message = ref('Hello')
const reversedMessage = computed(() => 
  message.value.split('').reverse().join('')
)
```

#### 5.2.2 getter/setter

```javascript
computed: {
  fullName: {
    get() {
      return this.firstName + ' ' + this.lastName
    },
    set(newValue) {
      [this.firstName, this.lastName] = newValue.split(' ')
    }
  }
}
```

**执行顺序：** setter → getter → updated

### 5.3 watch详解

#### 5.3.1 基础用法

```javascript
// Vue2
watch: {
  firstName(newVal, oldVal) {
    this.fullName = newVal + ' ' + this.lastName
  }
}

// Vue3
import { ref, watch } from 'vue'
const firstName = ref('')
watch(firstName, (newVal, oldVal) => {
  // 异步操作
  fetchData(newVal)
})
```

#### 5.3.2 监听对象属性

```javascript
// Vue2：需要配合computed
computed: {
  secondValue() {
    return this.obj.second
  }
},
watch: {
  secondValue(newVal) {
    console.log('second changed:', newVal)
  }
}

// Vue3：直接监听
watch(
  () => state.nested.value,
  (newVal) => {
    console.log('changed:', newVal)
  }
)
```

#### 5.3.3 深度监听

```javascript
watch: {
  obj: {
    handler(newVal) {
      console.log('obj changed')
    },
    deep: true,
    immediate: true
  }
}
```

### 5.4 watchEffect（Vue3）

```javascript
import { watchEffect } from 'vue'

// 自动追踪依赖
watchEffect(() => {
  console.log('count is:', count.value)
})

// 清除副作用
watchEffect((onInvalidate) => {
  const timer = setInterval(() => {}, 1000)
  
  onInvalidate(() => {
    clearInterval(timer)
  })
})

// 停止侦听
const stop = watchEffect(() => {})
stop() // 手动停止
```

---

## 六、组件通信

### 6.1 父传子

#### 6.1.1 Props

```vue
<!-- 父组件 -->
<template>
  <Child :msg="message" />
</template>

<!-- 子组件 -->
<script>
export default {
  props: {
    msg: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>
```

#### 6.1.2 ref

```vue
<!-- 父组件 -->
<template>
  <Child ref="child" />
  <button @click="getChildData">获取子组件数据</button>
</template>

<script>
export default {
  methods: {
    getChildData() {
      console.log(this.$refs.child.childData)
    }
  }
}
</script>
```

#### 6.1.3 $children / $parent（不推荐）

```javascript
// 父组件访问子组件
this.$children[0].someMethod()

// 子组件访问父组件
this.$parent.someData
```

### 6.2 子传父

#### 6.2.1 $emit

```vue
<!-- 子组件 -->
<script>
export default {
  methods: {
    sendToParent() {
      this.$emit('update', this.data)
    }
  }
}
</script>

<!-- 父组件 -->
<template>
  <Child @update="handleUpdate" />
</template>
```

#### 6.2.2 v-model（语法糖）

```vue
<!-- 父组件 -->
<Child v-model="value" />

<!-- 等价于 -->
<Child :value="value" @input="value = $event" />

<!-- 子组件 -->
<script>
export default {
  props: ['value'],
  methods: {
    updateValue(val) {
      this.$emit('input', val)
    }
  }
}
</script>
```

### 6.3 兄弟组件通信

#### 6.3.1 EventBus（Vue2）

```javascript
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 组件A
EventBus.$emit('event', data)

// 组件B
EventBus.$on('event', (data) => {
  console.log(data)
})
```

#### 6.3.2 Vuex / Pinia

```javascript
// Vuex
this.$store.commit('mutation', payload)
this.$store.dispatch('action', payload)

// Pinia (Vue3推荐)
import { useStore } from '@/stores/main'
const store = useStore()
store.increment()
```

### 6.4 跨层级通信

#### 6.4.1 provide/inject

```javascript
// 祖先组件
export default {
  provide() {
    return {
      theme: this.theme
    }
  }
}

// 后代组件
export default {
  inject: ['theme']
}
```

#### 6.4.2 Vue3 provide/inject（响应式）

```javascript
import { provide, inject, ref, readonly } from 'vue'

// 祖先组件
const theme = ref('dark')
provide('theme', readonly(theme))

// 后代组件
const theme = inject('theme')
```

### 6.5 父子组件生命周期执行顺序

```
父 beforeCreate
父 created
父 beforeMount
  子 beforeCreate
  子 created
  子 beforeMount
  子 mounted
父 mounted
```

---

## 七、Vue3 Composition API

### 7.1 setup函数

#### 7.1.1 基础用法

```vue
<template>
  <div>{{ count }}</div>
  <button @click="increment">+1</button>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    function increment() {
      count.value++
    }
    
    return {
      count,
      increment
    }
  }
}
</script>
```

#### 7.1.2 参数

```javascript
setup(props, context) {
  // props: 响应式的父组件传递的props
  console.log(props.name)
  
  // context: 上下文对象
  context.attrs   // 非响应式属性
  context.slots   // 插槽
  context.emit    // 触发事件
  context.expose  // 暴露公共属性
}
```

**注意：**
- 不要解构props，会失去响应性
- setup中不能使用this

### 7.2 生命周期钩子

| Vue2 | Vue3 Composition API |
|------|---------------------|
| beforeCreate | setup() |
| created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeDestroy | onBeforeUnmount |
| destroyed | onUnmounted |

```javascript
import { 
  onMounted, 
  onUpdated, 
  onUnmounted 
} from 'vue'

setup() {
  onMounted(() => {
    console.log('mounted')
  })
  
  onUpdated(() => {
    console.log('updated')
  })
  
  onUnmounted(() => {
    console.log('unmounted')
  })
}
```

### 7.3 依赖注入

```javascript
// 提供依赖
import { provide, ref } from 'vue'

setup() {
  const theme = ref('dark')
  provide('theme', theme)
}

// 注入依赖
import { inject } from 'vue'

setup() {
  const theme = inject('theme', 'light') // 默认值
}
```

### 7.4 模板Refs

```vue
<template>
  <div ref="root">content</div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const root = ref(null)
    
    onMounted(() => {
      console.log(root.value) // <div>content</div>
    })
    
    return {
      root
    }
  }
}
</script>
```

### 7.5 响应式工具函数

```javascript
import { 
  unref,      // 解包ref
  toRef,      // 为属性创建ref
  toRefs,     // 对象转ref集合
  isRef,      // 检查是否为ref
  isProxy,    // 检查是否为代理
  isReactive, // 检查是否为reactive
  isReadonly  // 检查是否为readonly
} from 'vue'

// toRefs示例：解构不丢失响应性
function useFeature() {
  const state = reactive({
    foo: 1,
    bar: 2
  })
  
  return toRefs(state)
}

setup() {
  const { foo, bar } = useFeature()
  // foo, bar 都是ref，保持响应性
}
```

### 7.6 高级响应式API

#### 7.6.1 customRef（自定义ref）

```javascript
import { customRef } from 'vue'

function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        value = newValue
        trigger()
      }, delay)
    }
  }))
}
```

#### 7.6.2 shallowReactive / shallowRef

```javascript
// 浅层响应式
import { shallowReactive, shallowRef } from 'vue'

const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

state.foo++           // 触发更新
state.nested.bar++    // 不触发更新（非响应式）
```

---

## 八、Vue3项目构建工具

### 8.1 Vite

#### 8.1.1 核心优势

| 特性 | 说明 |
|------|------|
| **即时启动** | 无需打包，开发服务器秒级启动 |
| **即时编译** | 按需编译，只编译当前页面用到的模块 |
| **HMR** | 热更新速度快，只更新修改的模块 |
| **开箱即用** | 内置TypeScript、CSS预处理器支持 |

#### 8.1.2 创建项目

```bash
# npm
npm create vite@latest my-app -- --template vue

# yarn
yarn create vite my-app --template vue

# pnpm
pnpm create vite my-app -- --template vue
```

#### 8.1.3 Vite原理

```
┌─────────────────────────────────────────────────────────────┐
│                      Vite 工作原理                            │
├─────────────────────────────────────────────────────────────┤
│  1. 启动开发服务器 (Koa)                                      │
│  2. 浏览器请求入口文件 (index.html)                           │
│  3. 拦截模块请求                                              │
│     ├── /@modules/* → 重写为 node_modules 路径               │
│     ├── *.vue → 即时编译为JS模块                              │
│     └── *.css → 转换为JS模块                                  │
│  4. WebSocket 实现 HMR                                        │
│  5. chokidar 监听文件变化                                     │
└─────────────────────────────────────────────────────────────┘
```

#### 8.1.4 与Webpack对比

| 对比项 | Vite | Webpack |
|--------|------|---------|
| 启动速度 | 毫秒级 | 秒级 |
| 热更新 | 毫秒级 | 秒级 |
| 原理 | 浏览器原生ESM | 打包编译 |
| 生产构建 | Rollup | Webpack |
| 兼容性 | 现代浏览器 | 可兼容旧浏览器 |

### 8.2 Vue CLI

```bash
# 安装
npm install -g @vue/cli

# 创建项目
vue create my-project

# 启动
npm run serve
```

### 8.3 路由懒加载

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
```

---

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

## 附录：常见问题与最佳实践

### A1. 响应式丢失问题

```javascript
// ❌ 错误：解构丢失响应性
const { foo, bar } = reactive({ foo: 1, bar: 2 })

// ✅ 正确：使用toRefs
const { foo, bar } = toRefs(reactive({ foo: 1, bar: 2 }))
```

### A2. 响应式判断

```javascript
import { isRef, isReactive, isProxy, isReadonly } from 'vue'

const count = ref(0)
const state = reactive({})

console.log(isRef(count))        // true
console.log(isReactive(state))   // true
```

### A3. 性能优化建议

1. **合理使用computed**：利用缓存避免重复计算
2. **避免深层watch**：尽量监听具体属性
3. **使用v-once**：静态内容只渲染一次
4. **虚拟滚动**：大数据列表使用虚拟滚动
5. **组件懒加载**：路由级和组件级懒加载

---

**更新日期：** 2026年04月04日
**版本：** Vue 2.7 / Vue 3.4
