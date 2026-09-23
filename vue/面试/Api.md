> 类型: 章节 · 来源: [[vue/面试]] · 更新: 2026-09-23
>
> ---

### Api 
#### 1.优化逻辑组织
- Vue2.x: OptionsAPI，逻辑代码按照 data、methods、computed、props 进行分类
- Vue3.x: OptionsAPI + CompositionAPI（推荐）
    - CompositionAPI优点：查看一个功能的实现时候，不需要在文件跳来跳去；并且这种风格代码可复用的粒度更细

#### 2.优化逻辑复用
> Vue2.x: 复用逻辑使用 mixin，但是 mixin 本身有一些缺点
> - 不清晰的数据来源
> - 命名空间冲突
> - 隐式的跨mixin交流

#### 3.解耦vue 示例配置
``` vue2
    import App from './App.vue'
    // 通过实例化 Vue 来创建应用
    new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
    })
    // or
    new Vue({
    render: h => h(App),
    }).$mount('#app')
```
> 这种方式缺点在于一个页面如果存在多个 Vue 应用，部分配置会影响所有的 Vue 应用
```vue2
    <!-- vue2 -->
    <div id="app1"></div>
    <div id="app2"></div>
    <script>
    Vue.use(...); // 此代码会影响所有的vue应用
    Vue.mixin(...); // 此代码会影响所有的vue应用
    Vue.component(...); // 此代码会影响所有的vue应用
                    
        new Vue({
        // 配置
    }).$mount("#app1")
    
    new Vue({
        // 配置
    }).$mount("#app2")
    </script>
```
``` vue3
    import { createApp } from 'vue';
    import App from './App.vue'

    createApp(App).mount('#app');
```
> 这种方式就能很好的规避上面的问题
``` vue3 
    <!-- vue3 -->
    <div id="app1"></div>
    <div id="app2"></div>
    <script>  
        createApp(根组件).use(...).mixin(...).component(...).mount("#app1")
    createApp(根组件).mount("#app2")
    </script>
```
> 面试题：为什么 Vue3 中去掉了 Vue 构造函数？

> 参考答案：

> Vue2 的全局构造函数带来了诸多问题：
> 调用构造函数的静态方法会对所有vue应用生效，不利于隔离不同应用
> Vue2 的构造函数集成了太多功能，不利于 tree shaking，Vue3 把这些功能使用普通函数导出，能够充分利用 tree shaking 优化打包体积
> Vue2 没有把组件实例和 Vue 应用两个概念区分开，在 Vue2 中，通过 new Vue 创建的对象，既是一个 Vue 应用，同时又是一个特殊的 Vue 组件。
> Vue3 中把两个概念区别开来，通过 createApp 创建的对象，是一个 Vue 应用，它内部提供的方法是针对整个应用的，而不再是一个特殊的组件。
