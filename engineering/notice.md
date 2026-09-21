# Vite 笔记

## 前端工程痛点
> 1. 兼容浏览器，编译高级语法（TS、JSX）
> 2. 开发效率（冷启动慢、HMR 慢）
> 3. 模块化需求（ESM、CommonJS）
> 4. 生产环境代码质量（压缩、tree-shaking）

## Vite 优势
> 1. 基于浏览器原生 ESM 的支持实现模块加载
> 2. 开发环境
>    - 基于原生 ES 模块（按需编译）
>    - 依赖预构建（esbuild 预打包）
>    - HMR 模块热替换（WebSocket）
>    - 开箱即用（TS、JSX、CSS 预处理器）
> 3. 生产环境
>    - 基于 Rollup 打包（tree-shaking、代码分割）
>    - 高度优化的静态资源

## Vite 工作原理
> 1. 开发环境
>    - 启动一个基于 Connect 的开发服务器
>    - 监听项目文件变化，触发 HMR 模块热替换
>    - 按需编译源代码（浏览器请求时才编译）
> 2. 生产环境
>    - 基于 Rollup 打包项目代码
>    - 生成优化的静态资源文件
>    - 支持代码分割、懒加载

## Vite 配置
> 1. vite.config.js
>    - root 项目根目录
>    - base 公共基础路径
>    - mode 项目运行的模式（development/production）
>    - define 定义全局常量
>    - resolve.alias 配置路径别名
>    - resolve.extensions 配置文件扩展名
>    - server 配置开发服务器（端口、代理、HMR）
>    - build 配置生产环境打包（输出目录、压缩、target）
>    - optimizeDeps 配置预构建依赖
>    - envDir 环境变量文件目录
>    - envPrefix 环境变量前缀

## 依赖预构建
> 1. 依赖预构建是指在开发环境启动时，vite 会自动分析项目中引入的依赖，将其转换为浏览器可以直接加载的 ESM 模块。
> 2. 预构建的依赖会被缓存起来（node_modules/.vite），后续的请求会直接从缓存中加载。
> 3. 预构建的依赖可以提高开发效率，减少每次请求的构建时间。
> 4. 可以通过配置 optimizeDeps 选项来控制预构建的行为（include/exclude）。
> 
> **流程：缓存判断 -> 依赖扫描 -> 依赖打包 -> 依赖元信息打包**

## HMR 模块热替换
> 1. 模块热替换是指在开发过程中，当修改了某个模块时，浏览器会自动加载并替换该模块，而不是重新加载整个页面。
> 2. 模块热替换可以提高开发效率，减少每次修改代码后的重新加载时间。
> 3. vite 默认支持模块热替换，可以在开发环境中使用。
> 4. 可以通过配置 server.hmr 选项来控制 HMR 的行为（overlay、protocol、host）。

## Vite 插件
> Vite 插件开发
> - 插件是一个对象，包含 name 属性和一系列钩子函数
> - 可以通过 apply 属性指定插件仅在开发或生产环境生效（'serve' | 'build'）
> - 可以通过 enforce 属性控制插件执行顺序（'pre' | 'post'）

### 通用插件 hooks（Rollup 兼容）
> 1. transform - 转换模块代码（如 TS→JS、JSX→JS）
> 2. load - 加载模块代码（从文件系统读取）
> 3. resolveId - 解析模块路径（相对路径转绝对路径）
> 4. options - 配置插件选项
> 5. configureServer - 配置开发服务器（添加中间件、修改路由）
> 6. buildStart - 打包开始时执行（清除缓存等）
> 7. buildEnd - 打包结束时执行（生成报告等）
> 8. closeBundle - 构建结束时执行（资源清理）

### Vite 独有插件 hooks
> 1. config - 配置解析前调用，可修改配置
> 2. configResolved - 配置解析完成后调用
> 3. transformIndexHtml - 转换 index.html（添加 meta、修改 title）
> 4. configurePreviewServer - 配置预览服务器
> 5. handleHotUpdate - 处理热更新（自定义 HMR 逻辑）

### 插件执行顺序（enforce 控制）
> 1. Alias 插件
> 2. 用户插件（enforce: 'pre'）
> 3. Vite 核心插件
> 4. 用户插件（无 enforce）
> 5. Vite 构建插件
> 6. 用户插件（enforce: 'post'）
> 7. Vite 后置构建插件（minify、manifest、reporting）

### Hooks 实际执行时机
> **服务器启动时：** 
> - config → configResolved → options → buildStart
> 
> **模块请求时：** 
> - resolveId → load → transform
> 
> **HTML 处理时：** 
> - transformIndexHtml
> 
> **热更新时：** 
> - handleHotUpdate
> 
> **服务器关闭时：** 
> - buildEnd → closeBundle

## code splitting
### 优点
> 1. 减少初始加载时间
> 2. 按需加载
> 3. 并行加载
> 4. 缓存优化
### 关键字
> bundle - 代码分割后的每个文件
> chunk - 代码分割后的每个文件
> vendor - 第三方库代码

### vite 拆包策略
> 自动处理Initial Chunk和Async Chunk
> 自动抽取Async Chunk中的CSS为Async CSS
> 自动处理动态import的代码分割
> 自动处理动态import的CSS代码分割

### vite 自定义拆包策略
> 1. 可以通过配置 rollupOptions.output.manualChunks 来自定义拆包策略
> 2. 可以根据模块路径、模块大小、模块依赖等因素来自定义拆包策略
> 3. 可以使用动态导入（import()）来实现按需加载
> 4. 可以使用动态导入的 CSS 来实现按需加载

### 预加载指令生成
> build.polyfillModulePreload
 - 用于生成预加载指令，用于优化异步加载的模块
 - 默认为 true，会自动生成预加载指令
 - 可以设置为 false，手动控制预加载指令的生成
> build.modulePreload.polyfill
 - 用于生成预加载指令的 polyfill 代码
 - 默认为 true，会自动生成预加载指令的 polyfill 代码
 - 可以设置为 false，手动控制预加载指令的 polyfill 代码的生成
### 循环引用问题
> 循环引用问题是指在模块中引入了循环依赖的情况，例如 A 模块引入了 B 模块，而 B 模块又引入了 A 模块。
> manualChunks 函数式配置, 但是简单的配置分割可能引起模块循环引用的问题
> vite-plugin-chunk-split(解决循环引用问题)
 - 用于自定义拆包策略，避免循环引用问题
 - 可以根据模块路径、模块大小、模块依赖等因素来自定义拆包策略
 - 可以使用动态导入（import()）来实现按需加载
 - 可以使用动态导入的 CSS 来实现按需加载

## vite 性能优化
### 代码优化
### 网络优化
### 资源优化
### 摇树优化
### 构建分析
### CDN
### 压缩