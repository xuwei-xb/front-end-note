

### 概述
 Vue 是一个响应式框架，数据变更会触发视图更新。高效的渲染机制对于提升应用性能至关重要，否则可能会影响页面的流畅度和用户体验。 



Vue 渲染策略演变：

+ 1.0：DOM-based templating（基于DOM的模板）
+ 2.0：Pure Virtual DOM（纯虚拟DOM）
+ 3.0：Compiler-enhanced Virtual DOM（编译器增强型虚拟DOM）
+ 3.6：Vapor Mode（蒸汽模式）



### 纯虚拟DOM
React 是最早提出虚拟 DOM（VDOM）概念的库，而 Vue 在 2.0 版本也引入了 VDOM。 

Vue 2.0 采用 VDOM 的主要原因：

+ 对渲染过程进行抽象化，有助于处理复杂逻辑
+ 有了SFC方式，把颗粒度提升到了组件上
+ 适配 DOM 以外的渲染目标



```html
<div id="hello"></div>
```



```javascript
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* 更多 vnode */
  ]
}
```

```javascript
xstate：状态机
```



![](https://cdn.nlark.com/yuque/0/2025/webp/312720/1742547994121-74e616ed-9f86-4500-97d9-12b5c4088e03.webp)



### 编译器增强型虚拟DOM
虚拟 DOM 的对比和渲染、还有响应式数据的依赖收集，都是在运行时完成的，所以<font style="color:rgb(33, 53, 71);">算法无法预知新的虚拟 DOM 树会是怎样，因此它总是需要遍历整棵树、比较每个 vnode 上 props 的区别来确保正确性。另外，即使一棵树的某个部分从未改变，还是会在每次重渲染时创建新的 vnode，带来了大量不必要的内存压力。</font>

<font style="color:rgb(33, 53, 71);">Vue框架包含编译器和运行时两部分，那么Vue3.0提出在编译器中做一些虚拟DOM的优化手段，从而提升渲染性能，这就是</font><font style="color:rgb(33, 53, 71);">编译器增强型虚拟DOM。</font>



#### <font style="color:rgb(33, 53, 71);">缓存静态内容</font>
<font style="color:rgb(33, 53, 71);">渲染器在首次渲染时会将创建的这部分 vnode 缓存起来，并在后续的重新渲染中使用缓存的 vnode，渲染器知道新旧 vnode 在这部分是完全相同的，所以会完全跳过对它们的差异比对。</font>

<font style="color:rgb(33, 53, 71);"></font>

```vue
<script setup>
  import { ref } from 'vue'
  const baz = ref('baz')
</script>
<template>
  <div>
    <div>foo</div> <!-- 需缓存 -->
    <div>bar</div> <!-- 需缓存 -->
    <div>{{ baz }}</div>
  </div>
</template>
```

<font style="color:rgb(33, 53, 71);"></font>

<font style="color:rgb(33, 53, 71);">当有足够多连续的静态元素时，它们还会再被压缩为一个“静态 vnode”，其中包含的是这些节点相应的纯 HTML 字符串。</font>

```vue
<script setup>
  import { ref } from 'vue'
  const bar = ref('bar')
</script>
<template>
  <div>
    <div class="foo">foo</div>
    <div class="foo">foo</div>
    <div class="foo">foo</div>
    <div class="foo">foo</div>
    <div class="foo">foo</div>
    <div>{{ bar }}</div>
  </div>
</template>
```

<font style="color:rgb(33, 53, 71);"></font>

#### <font style="color:rgb(33, 53, 71);">更新类型标记</font>
```vue
<script setup>
  import { ref } from 'vue'
  const foo = ref('foo')
  const bar = ref('bar')
</script>
<template>
  <div>
    <div :class="foo"></div>
    <div :id="bar"></div>
    <div :class="foo" :id="bar"></div>
  </div>
</template>
```

[https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts)



#### <font style="color:rgb(33, 53, 71);">树结构打平</font>
```html
<script setup>
import { ref } from 'vue'
const foo = ref('foo')
const bar = ref('bar')
</script>
<template>
  <div>
    <div>...</div>
    <div :id="foo"></div>
    <div>
      <div>{{ bar }}</div>
    </div>
  </div>
</template>
```



#### 运行时的优化
Vue2和Vue3的diff算法差别，Vue2双端对比，Vue3最长递增子序列。



![](https://cdn.nlark.com/yuque/0/2025/png/312720/1742614177037-41402396-5c92-4329-be93-ff3e626404f0.png)



![](https://cdn.nlark.com/yuque/0/2025/png/312720/1742614437852-6b2b08d5-6d37-4e80-ae0a-c6a095a583d5.png)

<font style="color:rgb(33, 53, 71);"></font>

### <font style="color:rgb(33, 53, 71);">signal（信号）</font>
#### <font style="color:rgb(33, 53, 71);">什么是响应性</font>
<font style="color:rgb(33, 53, 71);">文档地址：</font>[https://cn.vuejs.org/guide/extras/reactivity-in-depth.html](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)



<font style="color:rgb(33, 53, 71);">从根本上说，信号是与 Vue 中的 ref 相同的响应性基础类型。它是一个在访问时跟踪依赖、在变更时触发副作用的值容器。</font>

<font style="color:rgb(33, 53, 71);">很多其他框架已经引入了与 Vue 组合式 API 中的 ref 类似的响应性基础类型，并称之为“信号”：</font>

+ [Solid 信号](https://www.solidjs.com/docs/latest/api#createsignal)
+ [Angular 信号](https://angular.dev/guide/signals)
+ [Preact 信号](https://preactjs.com/guide/v10/signals/)
+ [Qwik 信号](https://qwik.builder.io/docs/components/state/#usesignal)



随着信号能力的增强，当前的响应式系统可以从组件级颗粒度回归到节点级颗粒度，而不会影响性能。 

 ![](https://cdn.nlark.com/yuque/0/2025/png/312720/1742615077796-7bf9d9b7-3760-427c-bdef-0b894586cf73.png)

alien-signals：[https://github.com/stackblitz/alien-signals](https://github.com/stackblitz/alien-signals?tab=readme-ov-file)



Vue3.6内置了alien-signals1.0版本。

测试Vue3.6：[https://vapor-repl.netlify.app/](https://vapor-repl.netlify.app/)



alien-signals 对比 @vue/reactivify的优势：施加了一些约束（例如不使用 Array/Set/Map 和不允许函数递归）来确保性能。保持算法的简单性比复杂的调度策略提供更显着的改进。



![](https://cdn.nlark.com/yuque/0/2025/png/312720/1742615412233-c876bbf1-45af-4c37-9831-dd3ba67c4795.png)

### Vapor Mode（蒸汽模式）
在Vue3.6中有了alien-signals的加持下，无虚拟DOM的方案得以实现。

Vapor Mode的原理：

1. 基于强大的响应式系统，最小颗粒化的收集依赖的所有副作用
2. 在对应的副作用中进行最小颗粒化的真实DOM的更新



```vue
<script setup vapor>
  import { ref } from 'vue'
  const baz = ref('baz')
</script>

<template>
  <div>foo</div>
  <div>bar</div>
  <div>{{ baz }}</div>
</template>
```



```vue
<script setup vapor>
import { ref } from 'vue'
const foo = ref('foo')
</script>

<template>
  <ul>
    <li>aaa</li>
    <li>bbb</li>
    <li>ccc</li>
    <li>{{ foo }}</li>
    <li>ddd</li>
    <li>eee</li>
    <li>fff</li>
    <li>ggg</li>
  </ul>
</template>
```



```vue
<script setup vapor>
import { ref } from 'vue'
const foo = ref('foo')
const list = ref([
  {id: 1, text: 'aaa'},
  {id: 2, text: 'bbb'},
  {id: 3, text: 'ccc'}
])
</script>

<template>
  <div>{{ foo }}</div>
  <div v-for="item in list" :key="item.id">{{ item.text }}</div>
</template>
```



