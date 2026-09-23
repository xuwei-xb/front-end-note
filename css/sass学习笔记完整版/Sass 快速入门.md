> 类型: 章节 · 来源: [[css/sass学习笔记完整版]] · 更新: 2026-09-23
>
> ---

## Sass 快速入门

### Sass 发展历史

**2006 年**：Sass 由 Hampton Catlin 开发并首次发布  
**2007 年**：正式发布，采用缩进敏感语法（`.sass`），需要 Ruby 环境编译  
**2009 年**：Less 的出现带来竞争压力，Natalie Weizenbaum 和 Chris Eppstein 引入类 CSS 语法（`.scss`），无需 Ruby 即可使用

### 编译器演进

Sass 编译器经历了三个主要版本：

| 编译器 | 语言 | 状态 | 特点 |
|--------|------|------|------|
| Ruby Sass | Ruby | 已废弃 | 最早的实现 |
| LibSass | C/C++ | 非活跃 | 性能优于 Ruby 版本 |
| Dart Sass | Dart | **推荐使用** | 官方维护，功能最全 |

**推荐使用 Dart Sass**，官方已发布 npm 包，安装方便。

### 快速上手

#### 1. 初始化项目

```bash
mkdir sass-demo
cd sass-demo
pnpm init
pnpm add sass -D
```

#### 2. 创建 SCSS 文件

`src/index.scss`:
```scss
$primary-color: #4caf50;
.container {
  background-color: $primary-color;
  padding: 20px;
  .title {
    font-size: 24px;
    color: white;
  }
}
```

#### 3. 编译 SCSS

**方式一：命令行编译**

```bash
npx sass src/index.scss dist/index.css
```

**方式二：使用 Node.js API 编译**

`src/index.js`:
```javascript
const sass = require('sass');
const path = require('path');
const fs = require('fs');

const scssPath = path.resolve("src", "index.scss");
const cssDir = "dist";
const cssPath = path.resolve(cssDir, "index.css");

// 编译
const result = sass.compile(scssPath);
console.log(result.css);

// 写入文件
if(!fs.existsSync(cssDir)){
  fs.mkdirSync(cssDir);
}
fs.writeFileSync(cssPath, result.css);
```

**方式三：使用 VS Code 插件**

推荐使用 `scss-to-css` 插件，可配置是否压缩输出。

---
