# qiankun 面试题

## 如何实现子应用隔离

1. 沙箱机制: 通过proxy 代理Window 对象,隔离全局变量
2. 样式隔离: 运行时自动添加css 前缀, 或者构建时配置css Modules/ Scoped css

## 子应用加载流程

1. 主应用通过fetch 获取子应用的HTML入口文件,解析其中的js/css 资源动态创建<script> 标签并执行
2. 优势: 天然支持子应用独立部署,资源路径自动修正

## 通信

### 父子应用

1. props 传参
2. 全局状态管理(initGlobalState)
3. 自定义事件(EventBus)

### 子应用之间

1. 通过主应用中转
2. 直接通信: 全局状态共享或者EventBus

## 样式污染

1. 构建时: 使用css Modules / Scoped Css(vue)/ BEM 命名规范
2. 运行时: qiankun 自动添加Css前缀 

## qiankun 和single-spa 的区别

1. qiankun 基于 single-spa 封装, 提供了开箱即用的沙箱/资源加载等能力

## 路由冲突

1. 使用activeRule 为子应用分配单独的路由前缀
2. history 监听: 主应用劫持路由变化,动态匹配子应用

## qiankun api

1. 子应用列表

```javascript
 [
    {
      name: 'app1',
      entry: '//localhost:8080',
      container: '#container',
      activeRule: '/react',
      props: {
        name: 'kuitos',
      },
    },
  ],
```

2. 注册：registerMicroApps

 		**beforeLoad**

​		**beforeMount**

​		**afterMount**

​		**beforeUnmount**

​		**afterUnmount**

3. 全局状态

​		**onGlobalStateChange**

​		**setGlobalState**

​		**initGlobalState**