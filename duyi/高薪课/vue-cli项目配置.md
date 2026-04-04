### **Vue3 defineProps报错：**

```diff
"eslintConfig": {
    "root": true,
    "env": {
      "node": true,
+     "vue/setup-compiler-macros": true
    },
    ......  
}
```

### ESLint处理

**直接拷贝代码之后可能会有一些ESLint报错问题**

可以vue-cli中可以配置`lintOnSave`，也可以自定义**rule**

```javascript
module.exports = {
  "root": true,
  "env": {
    "node": true,
    "vue/setup-compiler-macros": true
  },
	......
  rules: {
    // eslint (http://eslint.cn/docs/rules)
    "no-var": "error", // 要求使用 let 或 const 而不是 var
    "no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
    "prefer-const": "off", // 使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
    "no-use-before-define": "off", // 禁止在 函数/类/变量 定义之前使用它们
    "no-irregular-whitespace": "off", // 禁止不规则的空白

    // typeScript (https://typescript-eslint.io/rules)
    "@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
    "@typescript-eslint/prefer-ts-expect-error": "error", // 禁止使用 @ts-ignore
    "@typescript-eslint/no-inferrable-types": "off", // 可以轻松推断的显式类型可能会增加不必要的冗长
    "@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间。
    "@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
    "@typescript-eslint/ban-types": "off", // 禁止使用特定类型
    "@typescript-eslint/explicit-function-return-type": "off", // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
    "@typescript-eslint/no-var-requires": "off", // 不允许在 import 语句中使用 require 语句
    "@typescript-eslint/no-empty-function": "off", // 禁止空函数
    "@typescript-eslint/no-use-before-define": "off", // 禁止在变量定义之前使用它们
    "@typescript-eslint/ban-ts-comment": "off", // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
    "@typescript-eslint/no-non-null-assertion": "off", // 不允许使用后缀运算符的非空断言(!)
    "@typescript-eslint/explicit-module-boundary-types": "off", // 要求导出函数和类的公共类方法的显式返回和参数类型

    // vue (https://eslint.vuejs.org/rules)
    "vue/require-valid-default-prop":"off", // 强制 props 默认值有效
    "vue/script-setup-uses-vars": "error", // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效。
    "vue/v-slot-style": "error", // 强制执行 v-slot 指令样式
    "vue/no-mutating-props": "off", // 不允许组件 prop的改变
    "vue/no-v-html": "off", // 禁止使用 v-html
    "vue/custom-event-name-casing": "off", // 为自定义事件名称强制使用特定大小写
    "vue/attributes-order": "off", // vue api使用顺序，强制执行属性顺序
    "vue/one-component-per-file": "off", // 强制每个组件都应该在自己的文件中
    "vue/html-closing-bracket-newline": "off", // 在标签的右括号之前要求或禁止换行
    "vue/max-attributes-per-line": "off", // 强制每行的最大属性数
    "vue/multiline-html-element-content-newline": "off", // 在多行元素的内容之前和之后需要换行符
    "vue/singleline-html-element-content-newline": "off", // 在单行元素的内容之前和之后需要换行符
    "vue/attribute-hyphenation": "off", // 对模板中的自定义组件强制执行属性命名样式
    "vue/require-default-prop": "off", // 此规则要求为每个 prop 为必填时，必须提供默认值
    "vue/multi-word-component-names": "off", // 要求组件名称始终为 “-” 链接的单词
  }
};
```

### 全局Sass文件引入

由于引入了全局Sass文件，因此，vue-cli配置全局sass文件

```shell
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  },
})
```

### Element-plus按需配置

```shell
npm i unplugin-vue-components unplugin-auto-import -D
```

```javascript
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

let configureWebpack = {
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
}

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack,
})
```

### Mockjs

```shell
npm i mockjs -D
```

```javascript
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env.VUE_APP_PORT || 8080,
    open: JSON.parse(process.env.VUE_APP_OPEN || "true"),
    setupMiddlewares: require('./mock')
  },
  configureWebpack
})
```

### webpack-bundle-analyzer

**安装**

```shell
npm i webpack-bundle-analyzer -D
```

**配置**

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let configureWebpack = {
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    isProduction && new BundleAnalyzerPlugin()
  ].filter(Boolean)
}
......
```

### Code splitting配置

```javascript
module.exports = {
  optimization: {
    chunkIds: 'named',
    runtimeChunk: "single",
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendor: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
          reuseExistingChunk: true
        },
        echarts: {
          name: 'chunk-echarts',
          priority: 25,
          test: /[\\/]node_modules[\\/]_?echarts|zrender(.*)/,
          reuseExistingChunk: true
        },
        element: {
          name: 'chunk-element',
          priority: 25,
          test: /[\\/]node_modules[\\/]@?element(.*)/,
          reuseExistingChunk: true
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 2, //为了演示效果，设为只要引用2次就会被拆分，实际情况根据各自项目需要设定
          priority: 5,
          minSize: 0, //为了演示效果，设为0字节，实际情况根据各自项目需要设定
          reuseExistingChunk: true
        },
        lib: {
          test(module) {
            return (
              //如果模块大于160字节，并且模块的名称包含node_modules，就会被拆分
              module.size() > 160000 &&
              module.nameForCondition() && module.nameForCondition().includes('node_modules')
            )
          },
          name(module) {
            const packageNameArr = module.context.match(/[\\/]node_modules[\\/]\.pnpm[\\/](.*?)([\\/]|$)/);
            const packageName = packageNameArr ? packageNameArr[1] : '';
            
            return `chunk-lib.${packageName.replace(/[+@]/g, "")}`;
          },
          priority: 20,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        module: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageNameArr = module.context.match(/[\\/]node_modules[\\/]\.pnpm[\\/](.*?)([\\/]|$)/);
            const packageName = packageNameArr ? packageNameArr[1] : '';
            
            return `chunk-module.${packageName.replace(/[+@]/g, "")}`;
          },
          priority: 15,
          minChunks: 1,
          reuseExistingChunk: true,
        }
      },
    }
  },
}
```

```javascript
const chunkConfig = require("./build/webpack.chunk");
const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) { 
  configureWebpack = {
    ...configureWebpack,
    ...chunkConfig,
  }
}

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env.VUE_APP_PORT || 8080,
    open: JSON.parse(process.env.VUE_APP_OPEN || "true"),
    setupMiddlewares: require('./mock')
  },
  configureWebpack
})
```

### 设置缓存

```javascript
if (isProduction) { 
  configureWebpack = {
    ...configureWebpack,
    ...chunkConfig,
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },
  }
}
```



### webpack-chain

```javascript
module.exports = defineConfig({
  ......
  // devServer: {
  //   port: 3000,
  //   open: true,
  //   setupMiddlewares: require('./mock')
  // },
  chainWebpack: config => {
    config.delete('devtool')
    config.devServer.set('setupMiddlewares',require('./mock'))
    config.plugin('html').tap(args => { 
      args[0].title = process.env.VUE_APP_TITLE;
      return args;
    })
    if (isProduction) {
      config.optimization.minimizer('terser').tap((args) => { 
        Object.assign(args[0].terserOptions.compress, {
          warnings: false,
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log','console.error']
        })
        return args
      })
    }
  }
})
```

### CDN

```javascript
const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const chunkConfig = require("./build/webpack.chunk");
const isProduction = process.env.NODE_ENV === 'production'

const cdn = {
  externals: {
    vue: 'Vue',
    "vue-router": "VueRouter",
    "echarts": "echarts",
    "vue-echarts": "VueECharts",
    "@vueuse/core": "VueUse",
    "element-plus": 'ElementPlus',
  },
  js: [
    "https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.min.js",
    "https://cdn.jsdelivr.net/npm/vue-router@4.2.4/dist/vue-router.global.min.js",
    "https://cdn.jsdelivr.net/npm/@vueuse/shared@10.4.1/index.iife.min.js",
    "https://cdn.jsdelivr.net/npm/@vueuse/core@10.4.1/index.iife.min.js",
    "https://cdn.jsdelivr.net/npm/element-plus@2.3.12/dist/index.full.min.js",
    "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js",
    "https://cdn.jsdelivr.net/npm/vue-echarts@6.6.1/dist/index.umd.min.js"
  ],
  css: [
    "https://cdn.jsdelivr.net/npm/element-plus@2.3.12/dist/index.min.css",
    "https://cdn.jsdelivr.net/npm/vue-echarts@6.6.1/dist/csp/style.min.css"
  ]
}

let configureWebpack = {
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    isProduction && new BundleAnalyzerPlugin()
  ].filter(Boolean)
}

if (isProduction) { 
  configureWebpack = {
    ...configureWebpack,
    // ...chunkConfig,
    externals: cdn.externals, 
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },
  }
}

module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
  //   port: process.env.VUE_APP_PORT || 8080,
  //   open: JSON.parse(process.env.VUE_APP_OPEN || "true"),
  //   setupMiddlewares: require('./mock')
  // },
  configureWebpack,
  chainWebpack: config => {
    config.delete('devtool')  
    config.devServer.set('setupMiddlewares',require('./mock'))
    if (isProduction) {
      //  config.optimization.minimizer('terser')
      config.optimization.minimizer('terser').tap((args) => { 
        Object.assign(args[0].terserOptions.compress, {
          warnings: false,
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log','console.error']
        })
        return args
      })
      // config.plugin('html') 
      config.plugin('html').tap((args) => {
        args[0].title = process.env.VUE_APP_TITLE;
        args[0].cdn = cdn
        return args
      })
    }
  }
})
```

**EJS模板语法**

```javascript
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <% for (var i in htmlWebpackPlugin.options.cdn.css) { %>
      <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="stylesheet">
    <% } %>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
  <% for (var i in htmlWebpackPlugin.options.cdn.js) { %>
    <script src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
  <% } %>
</html>

```

**定义package.json脚本预览**

```javascript
npm i serve 

"preview": "serve ./dist -l 4000 -s"
```
