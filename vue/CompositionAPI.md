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
