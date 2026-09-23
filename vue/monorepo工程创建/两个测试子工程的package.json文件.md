> 类型: 章节 · 来源: [[vue/monorepo工程创建]] · 更新: 2026-09-23
>
> ---

## 两个测试子工程的package.json文件

### reactivity/package.json

```typescript
{
  "name": "@vue/reactivity",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.ts", 
  "module": "dist/reactivity.esm-bundler.js",
  "types": "dist/reactivity.d.ts",
  "unpkg": "dist/reactivity.global.js",
  "jsdelivr": "dist/reactivity.global.js",
  "buildOptions": {
    "name": "VueReactivity",
    "formats": [
      "esm-bundler",
      "esm-browser",
      "cjs",
      "global"
    ]
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

**注意：**main现在在测试环境下，如果打包之后可以直接指定js文件

`module`: esm文件

`types`：类型声明文件

`unpkg，jsdelivr`：浏览器可以直接引入的文件，这种文件内容一般是iife或者umd，需要指定函数返回的变量名

`buildOptions`：指定变量名和打包文件格式名

### shared/package.json

```typescript
{
  "name": "@vue/shared",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.ts",
  "module": "dist/shared.esm-bundler.js",
  "types": "dist/shared.d.ts",
  "buildOptions": {
    "formats": [
      "esm-bundler",
      "cjs"
    ]
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

其中，测试环境下，在main属性下，直接写的`src/index.ts`路径，我们也可以自己构造一下，比如在reactivity工程根目录下直接创建`index.js`

```typescript
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/reactivity.cjs.prod.js')
} else {
  module.exports = require('./dist/reactivity.cjs.js')
}
```

`package.json`的属性main可以改成`index.js`

shared工程同理：

```typescript
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/shared.cjs.prod.js')
} else {
  module.exports = require('./dist/shared.cjs.js')
}
```

`package.json`的属性main可以改成`index.js`
