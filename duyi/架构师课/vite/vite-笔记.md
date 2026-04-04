# Vite 笔记

## 前端工程痛点

> 1. **浏览器兼容性**：需要编译高级语法（TS、JSX、Less 等）为浏览器可执行代码
> 2. **开发效率问题**：
>    - 冷启动慢：传统打包工具需要先打包整个项目才能启动开发服务器
>    - HMR 慢：修改代码后需要重新打包整个模块，热更新速度慢
> 3. **模块化需求**：处理 ESM、CommonJS、AMD 等多种模块格式
> 4. **生产环境代码质量**：需要压缩、tree-shaking、代码分割等优化

## Vite 优势

> 1. **基于浏览器原生 ESM**：利用浏览器原生 ES Modules 实现按需加载，无需预先打包
> 2. **开发环境**
>    - 基于原生 ES 模块，按需编译，秒级启动
>    - 依赖预构建：使用 esbuild 将第三方依赖预打包为 ESM
>    - 极速 HMR：基于 WebSocket 的模块热替换，毫秒级更新
>    - 开箱即用：内置 TypeScript、JSX、CSS 预处理器支持
> 3. **生产环境**
>    - 基于 Rollup 打包，提供 tree-shaking、代码分割、压缩等优化
>    - 生成高度优化的静态资源，性能优异
>    - 代码分割和懒加载，减少初始加载体积

## Vite 工作原理

> ### 开发环境
> - 启动基于 Connect 的开发服务器（非打包模式）
> - 浏览器请求源码时，服务器按需编译并返回（无需预先打包）
> - 使用 WebSocket 实现文件监听和 HMR 热更新
> - 第三方依赖从预构建缓存（node_modules/.vite）中加载
>
> ### 生产环境
> - 基于 Rollup 打包项目代码
> - 执行 tree-shaking、代码分割、压缩等优化
> - 生成优化的静态资源文件（HTML、JS、CSS 等）
> - 支持代码分割和动态导入，实现懒加载

## Vite 配置

> ```javascript
> // vite.config.js
> export default {
>   // 项目配置
>   root: './',              // 项目根目录
>   base: '/',               // 公共基础路径（部署路径）
>   mode: 'development',     // 运行模式：development | production
>   define: {                // 定义全局常量
>     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
>   },
>
>   // 路径解析
>   resolve: {
>     alias: {               // 路径别名
>       '@': '/src'
>     },
>     extensions: ['.js', '.ts', '.json']  // 文件扩展名
>   },
>
>   // 环境变量
>   envDir: './',           // 环境变量文件目录
>   envPrefix: 'VITE_',     // 环境变量前缀
>
>   // 开发服务器
>   server: {
>     port: 5173,           // 端口
>     host: 'localhost',    // 主机
>     open: true,           // 自动打开浏览器
>     proxy: {              // 代理配置
>       '/api': 'http://localhost:3000'
>     },
>     hmr: {                // HMR 配置
>       overlay: true       // 错误遮罩层
>     }
>   },
>
>   // 生产构建
>   build: {
>     outDir: 'dist',       // 输出目录
>     assetsDir: 'assets',  // 静态资源目录
>     target: 'modules',    // 构建目标
>     sourcemap: false,     // 生成 sourcemap
>     minify: 'terser',     // 压缩方式：terser | esbuild
>     cssCodeSplit: true,   // CSS 代码分割
>     rollupOptions: {      // Rollup 配置
>       output: {
>         manualChunks: {}  // 自定义代码分割
>       }
>     },
>     polyfillModulePreload: true,  // 预加载 polyfill
>     modulePreload: {
>       polyfill: true            // 预加载 polyfill
>     }
>   },
>
>   // 依赖预构建
>   optimizeDeps: {
>     include: [],          // 强制预构建的依赖
>     exclude: [],          // 排除预构建的依赖
>     entries: []           // 预构建入口文件
>   },
>
>   // 插件
>   plugins: []
> }
> ```

## 依赖预构建

> 1. **作用**：将第三方依赖（通常为 CommonJS/UMD 格式）转换为 ESM 格式，并合并成单个文件，减少 HTTP 请求
> 2. **缓存机制**：预构建结果缓存到 `node_modules/.vite` 目录，后续启动直接使用缓存
> 3. **性能提升**：
>    - 减少模块请求数量（多个依赖合并为少量 chunk）
>    - 将 CommonJS 转换为 ESM，提高浏览器加载效率
>    - esbuild 预构建速度极快（Go 语言编写）
> 4. **配置控制**：
>    ```javascript
>    optimizeDeps: {
>      include: ['vue', 'react'],  // 强制预构建
>      exclude: ['some-lib'],      // 排除预构建
>      entries: './src/main.js'    // 预构建入口
>    }
>    ```
>
> **预构建流程**：
> ```
> 缓存判断 → 依赖扫描 → 依赖打包 → 依赖元信息生成 → 缓存存储
> ```

## HMR 模块热替换

> 1. **工作原理**：
>    - 开发服务器监听文件变化（chokidar）
>    - 通过 WebSocket 推送更新消息给浏览器
>    - 浏览器接收更新，使用新模块替换旧模块（通过 `import.meta.hot.accept()`）
>    - 保持应用状态，无需刷新整个页面
> 2. **性能优势**：
>    - 仅重新编译修改的模块，而非整个项目
>    - 毫秒级热更新，开发体验极佳
> 3. **配置选项**：
>    ```javascript
>    server: {
>      hmr: {
>        overlay: true,           // 错误遮罩层
>        protocol: 'ws',          // WebSocket 协议
>        host: 'localhost',       // HMR 主机
>        port: 24678,            // HMR 端口
>        clientPort: 24678        // 客户端连接端口
>      }
>    }
>    ```

## Vite 插件

> ### 插件基本结构
> ```javascript
> // vite.config.js
> export default {
>   plugins: [
>     {
>       name: 'my-plugin',                    // 插件名称
>       enforce: 'pre',                       // 执行顺序：'pre' | 'post'
>       apply: 'serve',                       // 应用场景：'serve' | 'build' | 函数
>       config(config) {                      // 配置解析前
>         return { /* 修改配置 */ }
>       },
>       configResolved(resolvedConfig) {      // 配置解析后
>         // 读取最终配置
>       },
>       transform(code, id) {                 // 代码转换
>         if (id.endsWith('.js')) {
>           return { code: transformedCode, map }
>         }
>       },
>       handleHotUpdate(ctx) {                // HMR 处理
>         // 自定义热更新逻辑
>       }
>     }
>   ]
> }
> ```

### 通用插件 hooks（Rollup 兼容）

| Hook | 触发时机 | 用途 |
|------|----------|------|
| `options` | 构建开始前 | 修改构建配置选项 |
| `buildStart` | 构建开始时 | 清除缓存、初始化资源 |
| `resolveId` | 解析模块路径 | 自定义模块解析逻辑 |
| `load` | 加载模块内容 | 自定义模块加载方式 |
| `transform` | 转换模块代码 | TS→JS、JSX→JS、代码转换 |
| `moduleParsed` | 模块解析完成后 | 分析模块依赖关系 |
| `buildEnd` | 构建结束时 | 生成报告、清理资源 |
| `closeBundle` | 构建关闭时 | 清理临时文件 |

### Vite 独有插件 hooks

| Hook | 触发时机 | 用途 |
|------|----------|------|
| `config` | 配置解析前 | 修改配置对象 |
| `configResolved` | 配置解析后 | 读取最终配置 |
| `configureServer` | 开发服务器配置前 | 添加中间件、自定义路由 |
| `transformIndexHtml` | HTML 转换时 | 注入 meta、修改 title、添加标签 |
| `configurePreviewServer` | 预览服务器配置前 | 自定义预览服务器行为 |
| `handleHotUpdate` | 文件变化时 | 自定义 HMR 逻辑 |

### 插件执行顺序

```javascript
// 按 enforce 控制的顺序
1. Alias 插件（路径别名）
2. 用户插件（enforce: 'pre'）
3. Vite 核心插件（ESM 转换、HMR 等）
4. 用户插件（无 enforce）
5. Vite 构建插件（Rollup 集成）
6. 用户插件（enforce: 'post'）
7. Vite 后置构建插件（压缩、manifest、报告）
```

### Hooks 实际执行时机

**服务器启动时：**
```
config → configResolved → options → buildStart → configureServer
```

**模块请求时（开发环境）：**
```
resolveId → load → transform
```

**HTML 处理时：**
```
transformIndexHtml
```

**热更新时：**
```
文件变化 → handleHotUpdate → WebSocket 推送 → 浏览器更新
```

**服务器关闭时：**
```
buildEnd → closeBundle
```

## Code Splitting（代码分割）

### 基本概念

> - **Bundle**：打包后的整体输出文件
> - **Chunk**：代码分割后的独立代码块
> - **Vendor**：第三方库代码 chunk
> - **Async Chunk**：异步加载的代码块（动态 import）

### 优点

> 1. **减少初始加载时间**：只加载必要的代码
> 2. **按需加载**：路由懒加载、组件懒加载
> 3. **并行加载**：多个 chunk 可并行请求
> 4. **缓存优化**：第三方库单独打包，长期缓存
> 5. **减少带宽消耗**：避免加载无用代码

### Vite 自动拆包策略

> 1. **自动处理 Initial Chunk**：入口文件的依赖自动分割
> 2. **自动处理 Async Chunk**：动态 `import()` 的代码自动分割
> 3. **自动抽取 CSS**：Async Chunk 中的 CSS 自动提取为独立文件
> 4. **智能 vendor 分离**：第三方库自动分离到独立 chunk

### Vite 自定义拆包策略

> ```javascript
> build: {
>   rollupOptions: {
>     output: {
>       // 方式 1：静态配置
>       manualChunks: {
>         'vendor': ['vue', 'react', 'axios'],
>         'utils': ['lodash', 'dayjs']
>       }
>
>       // 方式 2：函数式配置（更灵活）
>       manualChunks(id) {
>         // 第三方库打包到 vendor
>         if (id.includes('node_modules')) {
>           return 'vendor'
>         }
>
>         // 路由组件单独打包
>         if (id.includes('/src/views/')) {
>           return 'pages'
>         }
>       }
>     }
>   }
> }
> ```

### 预加载指令生成

> ```javascript
> build: {
>   // 生成预加载指令（用于优化异步加载）
>   polyfillModulePreload: true,  // 默认 true，自动生成预加载指令
>
>   // 预加载 polyfill 代码
>   modulePreload: {
>     polyfill: true  // 默认 true，自动生成预加载 polyfill
>   }
> }
> ```

### 循环引用问题

> **问题描述**：
> - A 模块依赖 B 模块，B 模块又依赖 A 模块
> - 使用 `manualChunks` 函数式配置时，可能触发循环依赖错误
>
> **解决方案**：
> 1. 使用 `vite-plugin-chunk-split` 插件自动处理循环依赖
> 2. 在 `manualChunks` 函数中添加循环检测逻辑
> 3. 将循环依赖的模块合并到同一个 chunk
>
> ```javascript
> // 安装插件
> npm install vite-plugin-chunk-split -D
>
> // 配置
> import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
>
> export default {
>   plugins: [
>     chunkSplitPlugin({
>       strategy: 'single-vendor',  // 策略：single-vendor | all-in-one | default
>       customSplitting: {
>         'vue-vendor': ['vue', 'vue-router'],
>         'ui-lib': ['element-plus', '@element-plus/icons-vue']
>       }
>     })
>   ]
> }
> ```

## Vite 性能优化

### 代码优化

> 1. **Tree-shaking**：自动移除未使用的代码
>    ```javascript
>    build: {
>       rollupOptions: {
>         treeshake: {
>           moduleSideEffects: ['some-module']  // 标记有副作用的模块
>         }
>       }
>    }
>    ```
> 2. **代码压缩**：使用 terser 或 esbuild 压缩代码
>    ```javascript
>    build: {
>      minify: 'terser',  // terser | esbuild
>      terserOptions: {
>        compress: {
>          drop_console: true,  // 移除 console
>          drop_debugger: true  // 移除 debugger
>        }
>      }
>    }
>    ```
> 3. **代码分割**：合理拆分 vendor 和业务代码

### 网络优化

> 1. **HTTP/2**：启用 HTTP/2 多路复用
>    ```javascript
>    server: {
>      https: true  // 启用 HTTPS（自动启用 HTTP/2）
>    }
>    ```
> 2. **预加载**：自动生成 preload 指令
>    ```javascript
>    build: {
>      polyfillModulePreload: true,
>      modulePreload: { polyfill: true }
>    }
>    ```
> 3. **Gzip/Brotli 压缩**：使用 `vite-plugin-compression`
>    ```javascript
>    import compression from 'vite-plugin-compression'
>
>    export default {
>      plugins: [
>        compression({
>          algorithm: 'gzip',  // gzip | brotliCompress | deflate
>          ext: '.gz',
>          threshold: 10240    // 大于 10KB 才压缩
>        })
>      ]
>    }
>    ```
> 4. **CDN 加速**：将静态资源部署到 CDN

### 资源优化

> 1. **图片优化**：使用 `vite-plugin-imagemin` 压缩图片
>    ```javascript
>    import imagemin from 'vite-plugin-imagemin'
>
>    export default {
>      plugins: [
>        imagemin({
>           gifsicle: { optimizationLevel: 7 },
>           optipng: { optimizationLevel: 7 },
>           mozjpeg: { quality: 80 },
>           pngquant: { quality: [0.8, 0.9] },
>           svgo: {
>             plugins: [
>               { name: 'removeViewBox', active: false }
>             ]
>           }
>        })
>      ]
>    }
>    ```
> 2. **字体优化**：使用字体子集化，只保留需要的字符
> 3. **资源内联**：小资源（< 4KB）内联到 HTML，减少请求

### 构建优化

> 1. **减少构建体积**：
>    - 使用 `build.rollupOptions.output.manualChunks` 合理拆分
>    - 使用 CDN 引入大体积库（如 React、Vue）
> 2. **提高构建速度**：
>    - 配置 `optimizeDeps.include` 预构建常用依赖
>    - 使用 `esbuild` 替代 `terser` 压缩（更快）
>    - 关闭不必要的 sourcemap（生产环境）
> 3. **并行构建**：利用多核 CPU 并行处理

### 构建分析

> 1. **体积分析**：使用 `rollup-plugin-visualizer`
>    ```javascript
>    import { visualizer } from 'rollup-plugin-visualizer'
>
>    export default {
>      plugins: [
>        visualizer({
>          open: true,
>          filename: 'dist/stats.html',
>          gzipSize: true,
>          brotliSize: true
>        })
>      ]
>    }
>    ```
> 2. **依赖分析**：使用 `vite-plugin-inspect` 查看中间状态
>    ```javascript
>    import { inspect } from 'vite-plugin-inspect'
>
>    export default {
>      plugins: [
>        inspect({
>          build: true,
>          outputDir: '.vite-inspect'
>        })
>      ]
>    }
>    ```

### CDN 配置

> 1. **生产环境使用 CDN**：
>    ```javascript
>    build: {
>      rollupOptions: {
>        output: {
>          // 将 vue、axios 等从 bundle 中排除
>          external: ['vue', 'axios'],
>          globals: {
>            vue: 'Vue',
>            axios: 'axios'
>          }
>        }
>      }
>    }
>    ```
> 2. **在 index.html 中手动引入 CDN**：
>    ```html
>    <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
>    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
>    ```

### 综合优化配置示例

> ```javascript
> import { defineConfig } from 'vite'
> import vue from '@vitejs/plugin-vue'
> import compression from 'vite-plugin-compression'
> import { visualizer } from 'rollup-plugin-visualizer'
> import imagemin from 'vite-plugin-imagemin'
>
> export default defineConfig({
>   plugins: [
>     vue(),
>     compression({
>       algorithm: 'gzip',
>       ext: '.gz',
>       threshold: 10240
>     }),
>     visualizer({
>       open: true,
>       filename: 'dist/stats.html',
>       gzipSize: true
>     }),
>     imagemin({
>       gifsicle: { optimizationLevel: 7 },
>       optipng: { optimizationLevel: 7 }
>     })
>   ],
>   build: {
>     outDir: 'dist',
>     assetsDir: 'assets',
>     target: 'modules',
>     sourcemap: false,
>     minify: 'esbuild',  // 使用 esbuild 压缩（更快）
>     cssCodeSplit: true,
>     rollupOptions: {
>       output: {
>         // 自定义代码分割
>         manualChunks: {
>           'vendor': ['vue', 'vue-router', 'pinia'],
>           'utils': ['axios', 'lodash']
>         }
>       }
>     },
>     polyfillModulePreload: true,
>     modulePreload: { polyfill: true }
>   },
>   optimizeDeps: {
>     include: ['vue', 'vue-router', 'pinia', 'axios']
>   }
> })
> ```
