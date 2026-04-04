# Sass 学习笔记

## 目录
- [预处理器介绍](#预处理器介绍)
- [Sass 快速入门](#sass-快速入门)
- [Sass 基础语法](#sass-基础语法)
- [Sass 控制指令](#sass-控制指令)
- [Sass 混合指令](#sass-混合指令)
- [Sass 函数指令](#sass-函数指令)
- [Sass @规则](#sass-规则)
- [模块化开发](#模块化开发)
- [最佳实践](#最佳实践)

---

## 预处理器介绍

### 什么是 CSS 预处理器

CSS 预处理器是一种通过增强语法来扩展 CSS 功能的技术。开发者使用增强语法编写样式，然后通过编译器将其转换为标准 CSS。

### 为什么需要预处理器

在日常工作中，尤其是面对大型项目时，普通 CSS 存在以下痛点：

- **维护困难**：代码量大，难以查找和修改
- **扩展性差**：难以复用已有的样式代码
- **缺乏编程特性**：不支持变量、函数、条件判断等

### 预处理器的优势

CSS 预处理器解决了上述问题，带来以下优势：

1. **代码组织**：通过嵌套、模块化和文件引入，使 CSS 结构更清晰
2. **变量和函数**：增强代码的可重用性和一致性
3. **代码简洁**：减少冗余，提高开发效率
4. **易于扩展**：通过插件系统添加新特性

### 主流 CSS 预处理器

目前前端领域主要有三种 CSS 预处理器：

#### 1. Sass

- **出现时间**：2006 年
- **特点**：功能最强大，社区活跃，插件丰富
- **语法格式**：
  - 缩进式语法（`.sass`）- 2006 年推出
  - 类 CSS 语法（`.scss`）- 2009 年推出

```scss
// SCSS 语法（推荐）
$primary-color: #4CAF50;
.container {
  background-color: $primary-color;
  padding: 20px;
  .title {
    font-size: 24px;
    color: white;
  }
}
```

#### 2. Less

- **出现时间**：2009 年
- **特点**：兼容原生 CSS，学习曲线平滑
- **缺点**：编程功能相比 Sass 较弱，社区规模较小

```less
@primary-color: #4CAF50;
.container {
  background-color: @primary-color;
  padding: 20px;
}
```

#### 3. Stylus

- **特点**：语法极其简洁，自定义性强
- **缺点**：社区规模较小

```stylus
primary-color = #4CAF50
.container
  background-color primary-color
  padding 20px
```

---

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

## Sass 基础语法

### 1. 注释

Sass 支持两种注释方式：

```scss
/* 多行注释 - 会编译到 CSS 中 */
// 单行注释 - 不会编译到 CSS 中
```

**编译结果**：
```css
/* 多行注释 - 会编译到 CSS 中 */
```

#### 强制保留注释

在压缩模式下，可以使用 `!` 强制保留注释（常用于版权信息）：

```scss
/*! 作者：XXX
    创建时间：2024年
 */
.test {
  width: 300px;
}
```

**编译结果（压缩模式）**：
```css
/*! 作者：XXX 创建时间：2024年 */.test{width:300px}
```

---

### 2. 变量

#### 变量声明

使用 `$` 符号声明变量：

```scss
$width: 1600px;
$pen-size: 3em;

div {
  width: $width;
  font-size: $pen-size;
}
```

**编译结果**：
```css
div {
  width: 1600px;
  font-size: 3em;
}
```

#### 变量作用域

- **全局变量**：在嵌套规则外部定义
- **局部变量**：在嵌套规则内部定义

```scss
$width: 1600px;  // 全局变量

div {
  $width: 800px;  // 局部变量，覆盖全局变量
  $color: red;    // 局部变量
  
  p.one {
    width: $width;   // 800px
    color: $color;   // red
  }
}

p.two {
  width: $width;   // 1600px
  color: $color;   // 报错！$color 是局部变量
}
```

#### `!global` 标记

将局部变量提升为全局变量：

```scss
$width: 1600px;

div {
  $width: 800px;
  $color: red !global;  // 提升为全局变量
  
  p.one {
    width: $width;
    color: $color;
  }
}

p.two {
  width: $width;   // 1600px
  color: $color;   // red - 现在可以访问了
}
```

**编译结果**：
```css
div p.one {
  width: 800px;
  color: red;
}
p.two {
  width: 1600px;
  color: red;
}
```

---

### 3. 数据类型

Sass 支持 7 种数据类型：

| 类型 | 示例 |
|------|------|
| 数值 | `1`, `2`, `13`, `10px` |
| 字符串 | `"foo"`, `'bar'`, `baz` |
| 布尔 | `true`, `false` |
| 空值 | `null` |
| 数组（List） | `1px 10px 15px 5px`, `1px,10px,15px,5px` |
| 字典（Map） | `(key1: value1, key2: value2)` |
| 颜色 | `blue`, `#04a012`, `rgba(0,0,12,0.5)` |

#### 3.1 数值类型

```scss
$my-age: 19;
$your-age: 19.5;
$height: 120px;
```

#### 3.2 字符串类型

支持有引号和无引号字符串：

```scss
$name: 'Tom Bob';
$container: "top bottom";
$what: heart;

div {
  background-image: url($what + ".png");
}
```

**编译结果**：
```css
div {
  background-image: url(heart.png);
}
```

#### 3.3 布尔类型

支持 `and`、`or`、`not` 逻辑运算：

```scss
$a: 1>0 and 0>5;     // false
$b: "a" == a;        // true
$c: false;           // false
$d: not $c;          // true
```

#### 3.4 空值类型

`null` 表示空值，不能参与算术运算：

```scss
$value: null;
```

#### 3.5 数组类型（List）

数组通过空格或逗号分隔：

```scss
$list0: 1px 2px 5px 6px;
$list1: 1px 2px, 5px 6px;
$list2: (1px 2px) (5px 6px);
```

**注意事项**：

1. **子数组**：当内外层分隔符相同时，使用小括号区分
2. **编译时去括号**：`()` 会在编译时去除
3. **空数组**：`()` 不能直接编译为 CSS
4. **访问元素**：使用 `nth()` 函数，索引从 1 开始

```scss
// 访问数组元素
$font-sizes: 12px 14px 16px 18px 24px;
$base-font-size: nth($font-sizes, 3);  // 16px

body {
  font-size: $base-font-size;
}
```

**编译结果**：
```css
body {
  font-size: 16px;
}
```

**实际应用 - 批量生成样式**：

```scss
$sizes: 40px 50px 60px;

@each $s in $sizes {
  .icon-#{$s} {
    font-size: $s;
    width: $s;
    height: $s;
  }
}
```

**编译结果**：
```css
.icon-40px {
  font-size: 40px;
  width: 40px;
  height: 40px;
}
.icon-50px {
  font-size: 50px;
  width: 50px;
  height: 50px;
}
.icon-60px {
  font-size: 60px;
  width: 60px;
  height: 60px;
}
```

#### 3.6 字典类型（Map）

字典使用小括号和键值对：

```scss
$colors: (
  "primary": #4caf50,
  "secondary": #ff9800,
  "accent": #2196f3,
);

$primary: map-get($colors, "primary");

button {
  background-color: $primary;
}
```

**编译结果**：
```css
button {
  background-color: #4caf50;
}
```

**实际应用 - 生成图标样式**：

```scss
$icons: (
  "eye": "\f112",
  "start": "\f12e",
  "stop": "\f12f",
);

@each $key, $value in $icons {
  .icon-#{$key}:before {
    display: inline-block;
    font-family: "Open Sans";
    content: $value;
  }
}
```

**编译结果**：
```css
.icon-eye:before {
  display: inline-block;
  font-family: "Open Sans";
  content: "\f112";
}
.icon-start:before {
  display: inline-block;
  font-family: "Open Sans";
  content: "\f12e";
}
.icon-stop:before {
  display: inline-block;
  font-family: "Open Sans";
  content: "\f12f";
}
```

#### 3.7 颜色类型

支持所有 CSS 颜色格式，并提供丰富的颜色函数：

**常用颜色函数**：

| 函数 | 作用 |
|------|------|
| `lighten($color, $amount)` | 增加亮度 |
| `darken($color, $amount)` | 减少亮度 |
| `saturate($color, $amount)` | 增加饱和度 |
| `desaturate($color, $amount)` | 减少饱和度 |
| `adjust-hue($color, $degrees)` | 调整色相 |
| `rgba($color, $alpha)` | 添加透明度 |
| `mix($color1, $color2, $weight)` | 混合两种颜色 |

```scss
$color: #4caf50;

.div1 {
  background-color: lighten($color, 10%);  // 亮度增加 10%
}

.div2 {
  background-color: darken($color, 10%);   // 亮度减少 10%
}

.div3 {
  background-color: saturate($color, 10%); // 饱和度增加 10%
}

.div4 {
  background-color: desaturate($color, 10%); // 饱和度减少 10%
}
```

**编译结果**：
```css
.div1 {
  background-color: #66bb6a;
}
.div2 {
  background-color: #388e3c;
}
.div3 {
  background-color: #4caf50;
}
.div4 {
  background-color: #4caf50;
}
```

更多颜色函数请参考：[官方文档](https://sass-lang.com/documentation/modules/color)

---

### 4. 嵌套语法

#### 4.1 选择器嵌套

```scss
$color: skyblue;

.container {
  width: 500px;
  height: 500px;
  
  .div1 {
    color: $color;
    width: 200px;
    height: 200px;
  }
  
  p {
    width: 400px;
    background-color: red;
  }
}
```

**编译结果**：
```css
.container {
  width: 500px;
  height: 500px;
}
.container .div1 {
  color: skyblue;
  width: 200px;
  height: 200px;
}
.container p {
  width: 400px;
  background-color: red;
}
```

#### 4.2 `&` 父选择器引用

```scss
a {
  color: yellow;
  
  &:hover {
    color: green;
  }
  
  &:active {
    color: red;
  }
}

div {
  width: 100px;
  height: 100px;
  
  &.one {
    background-color: red;
  }
}
```

**编译结果**：
```css
a {
  color: yellow;
}
a:hover {
  color: green;
}
a:active {
  color: red;
}
div {
  width: 100px;
  height: 100px;
}
div.one {
  background-color: red;
}
```

#### 4.3 属性嵌套

```scss
.test {
  font: {
    family: "Helvetica Neue";
    size: 20px;
    weight: bold;
  }
}
```

**编译结果**：
```css
.test {
  font-family: "Helvetica Neue";
  font-size: 20px;
  font-weight: bold;
}
```

---

### 5. 插值语法

使用 `#{}` 进行插值，类似于模板字符串：

#### 5.1 基础插值

```scss
$name: foo;
$attr: border;

p.#{$name} {
  color: red;
  #{$attr}-color: blue;
}
```

**编译结果**：
```css
p.foo {
  color: red;
  border-color: blue;
}
```

#### 5.2 避免提前计算

插值可以防止 Sass 提前计算 `calc()` 表达式：

```scss
$base-font-size: 16px;
$line-height: 1.5;

// 直接编译：Sass 会先计算
.div1 {
  padding: calc($base-font-size * $line-height * 2);
}

// 使用插值：保留 calc 表达式
.div2 {
  padding: calc(#{$base-font-size * $line-height} * 2);
}
```

**编译结果**：
```css
.div1 {
  padding: 48px;
}
.div2 {
  padding: calc(24px * 2);
}
```

#### 5.3 注释插值

```scss
$author: xiejie;

/*! Author: #{$author} */
```

**编译结果**：
```css
/*! Author: xiejie */
```

---

### 6. 运算

#### 6.1 `calc()` 函数

```scss
.container {
  width: 80%;
  padding: 0 20px;
  
  .element {
    width: calc(100% - 40px);  // 单位相同，直接计算
  }
  
  .element2 {
    width: calc(100px - 40px); // 60px
  }
}
```

**编译结果**：
```css
.container {
  width: 80%;
  padding: 0 20px;
}
.container .element {
  width: calc(60%);
}
.container .element2 {
  width: 60px;
}
```

#### 6.2 `min()` 和 `max()`

```scss
$width1: 500px;
$width2: 600px;

.element {
  width: min($width1, $width2);  // 500px
}
```

**编译结果**：
```css
.element {
  width: 500px;
}
```

#### 6.3 `clamp()`

`clamp(min, value, max)` 将值限制在范围内：

```scss
$min-font-size: 16px;
$max-font-size: 24px;

body {
  font-size: clamp($min-font-size, 1.25vw + 1rem, $max-font-size);
}
```

**编译结果**：
```css
body {
  font-size: clamp(16px, 1.25vw + 1rem, 24px);
}
```

---

## Sass 控制指令

Sass 提供了类似编程语言的流程控制，增强样式的逻辑性。

### 1. 三元运算符

```scss
p {
  color: if(1+1==2, green, yellow);  // green
}

div {
  color: if(1+1==3, green, yellow);  // yellow
}
```

**编译结果**：
```css
p {
  color: green;
}
div {
  color: yellow;
}
```

---

### 2. `@if` 条件判断

#### 2.1 单分支

```scss
p {
  @if 1+1 == 2 {
    color: red;
  }
  margin: 10px;
}

div {
  @if 1+1 == 3 {
    color: red;
  }
  margin: 10px;
}
```

**编译结果**：
```css
p {
  color: red;
  margin: 10px;
}
div {
  margin: 10px;
}
```

#### 2.2 双分支

```scss
p {
  @if 1+1 == 2 {
    color: red;
  } @else {
    color: blue;
  }
  margin: 10px;
}

div {
  @if 1+1 == 3 {
    color: red;
  } @else {
    color: blue;
  }
  margin: 10px;
}
```

**编译结果**：
```css
p {
  color: red;
  margin: 10px;
}
div {
  color: blue;
  margin: 10px;
}
```

#### 2.3 多分支

```scss
$type: monster;

p {
  @if $type == ocean {
    color: blue;
  } @else if $type == matador {
    color: red;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}
```

**编译结果**：
```css
p {
  color: green;
}
```

---

### 3. `@for` 循环

```scss
// from ... to：不包含结束值
@for $i from 1 to 3 {
  .item-#{$i} {
    width: $i * 2em;
  }
}

// from ... through：包含结束值
@for $i from 1 through 3 {
  .item2-#{$i} {
    width: $i * 2em;
  }
}
```

**编译结果**：
```css
.item-1 {
  width: 2em;
}
.item-2 {
  width: 4em;
}
.item2-1 {
  width: 2em;
}
.item2-2 {
  width: 4em;
}
.item2-3 {
  width: 6em;
}
```

---

### 4. `@while` 循环

```scss
$i: 6;

@while $i > 0 {
  .item-#{$i} {
    width: 2em * $i;
  }
  $i: $i - 2;  // 重要：修改循环变量，避免死循环
}
```

**编译结果**：
```css
.item-6 {
  width: 12em;
}
.item-4 {
  width: 8em;
}
.item-2 {
  width: 4em;
}
```

---

### 5. `@each` 循环

类似 JS 的 `for...of`，遍历数组或字典：

#### 5.1 遍历数组

```scss
$animals: puma, sea-slug, egret, salamander;

@each $animal in $animals {
  .#{$animal}-icon {
    background-image: url("/images/#{$animal}.png");
  }
}
```

**编译结果**：
```css
.puma-icon {
  background-image: url("/images/puma.png");
}
.sea-slug-icon {
  background-image: url("/images/sea-slug.png");
}
.egret-icon {
  background-image: url("/images/egret.png");
}
.salamander-icon {
  background-image: url("/images/salamander.png");
}
```

#### 5.2 遍历字典

```scss
$font-sizes: (
  h1: 2em,
  h2: 1.5em,
  h3: 1.2em,
  h4: 1em,
);

@each $header, $size in $font-sizes {
  #{$header} {
    font-size: $size;
  }
}
```

**编译结果**：
```css
h1 {
  font-size: 2em;
}
h2 {
  font-size: 1.5em;
}
h3 {
  font-size: 1.2em;
}
h4 {
  font-size: 1em;
}
```

---

## Sass 混合指令（Mixin）

Mixin 是可重用的代码片段，通过 `@mixin` 定义，`@include` 调用。

### 1. 基本用法

#### 1.1 定义和调用

```scss
// 定义 Mixin
@mixin large-text {
  font: {
    family: "Open Sans", sans-serif;
    size: 20px;
    weight: bold;
  }
  color: #ff0000;
}

// 调用 Mixin
p {
  @include large-text;
  padding: 20px;
}

div {
  width: 200px;
  height: 200px;
  background-color: #fff;
  @include large-text;
}
```

**编译结果**：
```css
p {
  font-family: "Open Sans", sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: #ff0000;
  padding: 20px;
}
div {
  width: 200px;
  height: 200px;
  background-color: #fff;
  font-family: "Open Sans", sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: #ff0000;
}
```

#### 1.2 Mixin 嵌套

Mixin 可以引用其他 Mixin：

```scss
@mixin background {
  background-color: #fc0;
}

@mixin header-text {
  font-size: 20px;
}

@mixin compound {
  @include background;
  @include header-text;
}

p {
  @include compound;
}
```

**编译结果**：
```css
p {
  background-color: #fc0;
  font-size: 20px;
}
```

#### 1.3 在最外层使用

Mixin 可以在根级别使用，但需要包含选择器：

```scss
@mixin compound {
  div {
    background-color: #fc0;
    font-size: 20px;
  }
}

@include compound;
```

**编译结果**：
```css
div {
  background-color: #fc0;
  font-size: 20px;
}
```

---

### 2. 参数化 Mixin

#### 2.1 基本参数

```scss
@mixin bg-color($color, $radius) {
  width: 200px;
  height: 200px;
  margin: 10px;
  background-color: $color;
  border-radius: $radius;
}

.box1 {
  @include bg-color(red, 10px);
}

.box2 {
  @include bg-color(blue, 20px);
}
```

**编译结果**：
```css
.box1 {
  width: 200px;
  height: 200px;
  margin: 10px;
  background-color: red;
  border-radius: 10px;
}
.box2 {
  width: 200px;
  height: 200px;
  margin: 10px;
  background-color: blue;
  border-radius: 20px;
}
```

#### 2.2 默认参数

```scss
@mixin bg-color($color, $radius: 20px) {
  width: 200px;
  height: 200px;
  margin: 10px;
  background-color: $color;
  border-radius: $radius;
}

.box1 {
  @include bg-color(blue);  // 使用默认半径 20px
}
```

**编译结果**：
```css
.box1 {
  width: 200px;
  height: 200px;
  margin: 10px;
  background-color: blue;
  border-radius: 20px;
}
```

#### 2.3 关键词参数

```scss
@mixin bg-color($color: blue, $radius) {
  width: 200px;
  height: 200px;
  margin: 10px;
  background-color: $color;
  border-radius: $radius;
}

.box1 {
  @include bg-color($radius: 20px, $color: pink);
}

.box2 {
  @include bg-color($radius: 20px);  // 使用默认颜色 blue
}
```

**编译结果**：
```css
.box1 {
  width: 200px;
  height: 200px;
  margin: 10px;
  background-color: pink;
  border-radius: 20px;
}
.box2 {
  width: 200px;
  height: 200px;
  margin: 10px;
  background-color: blue;
  border-radius: 20px;
}
```

#### 2.4 不定参数（Rest 参数）

使用 `...` 接收不定数量的参数：

```scss
@mixin box-shadow($shadow...) {
  box-shadow: $shadow;
}

.box1 {
  @include box-shadow(0 1px 2px rgba(0,0,0,.5));
}

.box2 {
  @include box-shadow(
    0 1px 2px rgba(0,0,0,.5),
    0 2px 5px rgba(100,0,0,.5)
  );
}
```

**编译结果**：
```css
.box1 {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.box2 {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5), 0 2px 5px rgba(100, 0, 0, 0.5);
}
```

#### 2.5 参数展开

`...` 也可以用于展开数组：

```scss
@mixin colors($text, $background, $border) {
  color: $text;
  background-color: $background;
  border-color: $border;
}

$values: red, blue, pink;

.box {
  @include colors($values...);
}
```

**编译结果**：
```css
.box {
  color: red;
  background-color: blue;
  border-color: pink;
}
```

---

### 3. `@content` 指令

`@content` 类似插槽，允许在调用 Mixin 时插入额外内容：

#### 3.1 基本用法

```scss
@mixin test {
  html {
    @content;
  }
}

@include test {
  background-color: red;
  
  .logo {
    width: 600px;
  }
}

@include test {
  color: blue;
  
  .box {
    width: 200px;
    height: 200px;
  }
}
```

**编译结果**：
```css
html {
  background-color: red;
}
html .logo {
  width: 600px;
}
html {
  color: blue;
}
html .box {
  width: 200px;
  height: 200px;
}
```

#### 3.2 实际应用

```scss
@mixin button-theme($color) {
  background-color: $color;
  border: 1px solid darken($color, 15%);
  
  &:hover {
    background-color: lighten($color, 5%);
    border-color: darken($color, 10%);
  }
  
  @content;
}

.button-primary {
  @include button-theme(#007bff) {
    width: 500px;
    height: 400px;
  }
}

.button-secondary {
  @include button-theme(#6c757d) {
    width: 300px;
    height: 200px;
  }
}
```

**编译结果**：
```css
.button-primary {
  background-color: #007bff;
  border: 1px solid #0056b3;
  width: 500px;
  height: 400px;
}
.button-primary:hover {
  background-color: #1a88ff;
  border-color: #0062cc;
}
.button-secondary {
  background-color: #6c757d;
  border: 1px solid #494f54;
  width: 300px;
  height: 200px;
}
.button-secondary:hover {
  background-color: #78828a;
  border-color: #545b62;
}
```

#### 3.3 作用域隔离

Mixin 和 `@content` 的变量作用域是独立的：

```scss
@mixin scope-test {
  $test-variable: "mixin";
  
  .mixin {
    content: $test-variable;
  }
  
  @content;
}

.test {
  $test-variable: "test";
  
  @include scope-test {
    .content {
      content: $test-variable;
    }
  }
}
```

**编译结果**：
```css
.test .mixin {
  content: "mixin";
}
.test .content {
  content: "test";
}
```

---

## Sass 函数指令

### 1. 自定义函数

使用 `@function` 和 `@return` 定义函数：

#### 1.1 基本语法

```scss
@function divide($a, $b) {
  @return $a / $b;
}

.container {
  width: divide(100px, 2);
}
```

**编译结果**：
```css
.container {
  width: 50px;
}
```

#### 1.2 不定参数

```scss
@function sum($nums...) {
  $sum: 0;
  
  @each $n in $nums {
    $sum: $sum + $n;
  }
  
  @return $sum;
}

.box1 {
  width: sum(1, 2, 3) + px;
}

.box2 {
  width: sum(1, 2, 3, 4, 5, 6) + px;
}
```

**编译结果**：
```css
.box1 {
  width: 6px;
}
.box2 {
  width: 21px;
}
```

#### 1.3 实际应用

根据背景色自动计算最佳文字颜色：

```scss
@function contrast-color($background-color) {
  // 计算亮度
  $brightness: red($background-color) * 0.299 + 
               green($background-color) * 0.587 + 
               blue($background-color) * 0.114;
  
  // 根据亮度返回黑色或白色
  @if $brightness > 128 {
    @return #000;
  } @else {
    @return #fff;
  }
}

.button {
  $background-color: #007bff;
  background-color: $background-color;
  color: contrast-color($background-color);
}
```

**编译结果**：
```css
.button {
  background-color: #007bff;
  color: #fff;
}
```

---

### 2. 内置函数

Sass 提供了大量内置函数，官方文档：[https://sass-lang.com/documentation/modules](https://sass-lang.com/documentation/modules)

#### 2.1 字符串函数

| 函数 | 作用 |
|------|------|
| `quote($string)` | 添加引号 |
| `unquote($string)` | 去除引号 |
| `to-lower-case($string)` | 转小写 |
| `to-upper-case($string)` | 转大写 |
| `str-length($string)` | 返回字符串长度 |
| `str-index($string, $substring)` | 返回子字符串位置 |
| `str-insert($string, $insert, $index)` | 插入字符串 |
| `str-slice($string, $start, $end)` | 截取字符串（索引从 1 开始） |

```scss
$str: "Hello world!";

.slice1 {
  content: str-slice($str, 1, 5);  // "Hello"
}

.slice2 {
  content: str-slice($str, -1);    // "!"
}
```

**编译结果**：
```css
.slice1 {
  content: "Hello";
}
.slice2 {
  content: "!";
}
```

---

#### 2.2 数字函数

| 函数 | 作用 |
|------|------|
| `percentage($number)` | 转为百分比 |
| `round($number)` | 四舍五入 |
| `ceil($number)` | 向上取整 |
| `floor($number)` | 向下取整 |
| `abs($number)` | 绝对值 |
| `min($number...)` | 最小值 |
| `max($number...)` | 最大值 |
| `random($number?)` | 随机数（0-1 或 0-n） |

```scss
.item {
  width: percentage(2/5);                      // 40%
  height: random(100) + px;                    // 随机高度
  color: rgb(random(255), random(255), random(255));  // 随机颜色
}
```

**编译结果**：
```css
.item {
  width: 40%;
  height: 83px;
  color: rgb(31, 86, 159);
}
```

---

#### 2.3 数组函数

| 函数 | 作用 |
|------|------|
| `length($list)` | 数组长度 |
| `nth($list, n)` | 获取第 n 个元素 |
| `set-nth($list, $n, $value)` | 修改第 n 个元素 |
| `join($list1, $list2, $separator)` | 拼接数组 |
| `append($list, $val, $separator)` | 添加元素 |
| `index($list, $value)` | 返回元素索引 |
| `zip($lists...)` | 合并多个数组为多维数组 |

```scss
$list1: 1px solid, 2px dotted;
$list2: 3px dashed, 4px double;
$combined-list: join($list1, $list2, comma);

$base-colors: red, green, blue;
$extended-colors: append($base-colors, yellow, comma);

$fonts: "Arial", "Helvetica", "Verdana";
$weights: "normal", "bold", "italic";
$font-pair: zip($fonts, $weights);

@each $border-style in $combined-list {
  .border-#{index($combined-list, $border-style)} {
    border: $border-style;
  }
}

@each $pair in $font-pair {
  $font: nth($pair, 1);
  $weight: nth($pair, 2);
  
  .text-#{index($font-pair, $pair)} {
    font-family: $font;
    font-weight: $weight;
  }
}
```

**编译结果**：
```css
.border-1 {
  border: 1px solid;
}
.border-2 {
  border: 2px dotted;
}
.border-3 {
  border: 3px dashed;
}
.border-4 {
  border: 4px double;
}
.text-1 {
  font-family: "Arial";
  font-weight: "normal";
}
.text-2 {
  font-family: "Helvetica";
  font-weight: "bold";
}
.text-3 {
  font-family: "Verdana";
  font-weight: "italic";
}
```

---

#### 2.4 字典函数

| 函数 | 作用 |
|------|------|
| `map-get($map, $key)` | 获取键值 |
| `map-merge($map1, $map2)` | 合并字典 |
| `map-remove($map, $key)` | 删除键 |
| `map-keys($map)` | 获取所有键 |
| `map-values($map)` | 获取所有值 |
| `map-has-key($map, $key)` | 判断键是否存在 |

```scss
$colors: (
  "primary": #007bff,
  "secondary": #6c757d,
  "success": #28a745,
  "info": #17a2b8,
  "warning": #ffc107,
  "danger": #dc3545,
);

$more-colors: (
  "light": #f8f9fa,
  "dark": #343a40
);

$all-colors: map-merge($colors, $more-colors);

@each $color-key, $color-value in $all-colors {
  .text-#{$color-key} {
    color: $color-value;
  }
}

button {
  color: map-get($colors, "primary");
}
```

**编译结果**：
```css
.text-primary {
  color: #007bff;
}
.text-secondary {
  color: #6c757d;
}
.text-success {
  color: #28a745;
}
.text-info {
  color: #17a2b8;
}
.text-warning {
  color: #ffc107;
}
.text-danger {
  color: #dc3545;
}
.text-light {
  color: #f8f9fa;
}
.text-dark {
  color: #343a40;
}
button {
  color: #007bff;
}
```

---

#### 2.5 颜色函数

**RGB 函数**：

| 函数 | 作用 |
|------|------|
| `rgb($red, $green, $blue)` | 创建 RGB 颜色 |
| `rgba($red, $green, $blue, $alpha)` | 创建 RGBA 颜色 |
| `red($color)` | 获取红色值 |
| `green($color)` | 获取绿色值 |
| `blue($color)` | 获取蓝色值 |
| `mix($color1, $color2, $weight)` | 混合颜色 |

**HSL 函数**：

| 函数 | 作用 |
|------|------|
| `hsl($hue, $saturation, $lightness)` | 创建 HSL 颜色 |
| `hsla($hue, $saturation, $lightness, $alpha)` | 创建 HSLA 颜色 |
| `saturation($color)` | 获取饱和度 |
| `lightness($color)` | 获取亮度 |
| `adjust-hue($color, $degrees)` | 调整色相 |
| `lighten($color, $amount)` | 增加亮度 |
| `darken($color, $amount)` | 减少亮度 |
| `hue($color)` | 获取色相值 |

**Opacity 函数**：

| 函数 | 作用 |
|------|------|
| `alpha($color)` / `opacity($color)` | 获取透明度 |
| `rgba($color, $alpha)` | 设置透明度 |
| `opacify($color, $amount)` | 增加不透明度 |
| `transparentize($color, $amount)` | 增加透明度 |

---

#### 2.6 其他函数

| 函数 | 作用 |
|------|------|
| `type-of($value)` | 返回值的类型 |
| `unit($number)` | 返回数字单位 |
| `unitless($number)` | 判断是否无单位 |
| `comparable($number1, $number2)` | 判断是否可运算 |

```scss
$value: 42;
$length: 10px;

.box {
  content: "Value type: #{type-of($value)}";          // number
  content: "Length unit: #{unit($length)}";            // px
  content: "Is unitless: #{unitless(42)}";             // true
  content: "Can compare: #{comparable(1px, 2em)}";     // false
  content: "Can compare: #{comparable(1px, 2px)}";     // true
}
```

**编译结果**：
```css
.box {
  content: "Value type: number";
  content: "Length unit: px";
  content: "Is unitless: true";
  content: "Can compare: false";
  content: "Can compare: true";
}
```

---

## Sass @规则

### 1. `@import`

#### 1.1 基本用法

Sass 的 `@import` 在编译时合并文件，不会产生额外的 HTTP 请求。

**文件结构**：
```
src/
├── _variables.scss
├── _mixins.scss
├── _header.scss
└── index.scss
```

`_variables.scss`:
```scss
$primary-color: #007bff;
$secondary-color: #6c757d;
```

`_mixins.scss`:
```scss
@mixin reset-margin-padding {
  margin: 0;
  padding: 0;
}
```

`_header.scss`:
```scss
header {
  background-color: $primary-color;
  color: $secondary-color;
  @include reset-margin-padding;
}
```

`index.scss`:
```scss
@import "variables";
@import "mixins";
@import "header";

body {
  background-color: $primary-color;
  color: $secondary-color;
  @include reset-margin-padding;
}
```

**编译结果（单个 CSS 文件）**：
```css
header {
  background-color: #007bff;
  color: #6c757d;
  margin: 0;
  padding: 0;
}
body {
  background-color: #007bff;
  color: #6c757d;
  margin: 0;
  padding: 0;
}
```

#### 1.2 部分文件（Partials）

以下划线 `_` 开头的文件称为部分文件，不会单独生成 CSS：

```scss
// _colors.scss
$primary: #007bff;
$secondary: #6c757d;

// styles.scss
@import "colors";  // 省略下划线和扩展名
```

#### 1.3 不会触发导入的情况

以下情况会编译为原生 CSS `@import`：

- 文件扩展名是 `.css`
- 文件名以 `http://` 开头
- 文件名是 `url()`
- `@import` 包含 media queries

```scss
@import "foo.css";
@import "foo" screen;
@import "http://foo.com/bar";
@import url(foo);
```

---

### 2. `@media`

#### 2.1 嵌套媒体查询

```scss
.navigation {
  display: flex;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}
```

**编译结果**：
```css
.navigation {
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
  }
}
```

#### 2.2 使用变量

```scss
$mobile-breakpoint: 768px;

.navigation {
  display: flex;
  justify-content: flex-end;
  
  @media (max-width: $mobile-breakpoint) {
    flex-direction: column;
  }
}
```

**编译结果**：
```css
.navigation {
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
  }
}
```

#### 2.3 结合 Mixin

```scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == "mobile" {
    @media (max-width: 768px) {
      @content;
    }
  } @else if $breakpoint == "tablet" {
    @media (min-width: 769px) and (max-width: 1024px) {
      @content;
    }
  } @else if $breakpoint == "desktop" {
    @media (min-width: 1025px) {
      @content;
    }
  }
}

.container {
  width: 80%;
  
  @include respond-to("mobile") {
    width: 100%;
  }
  
  @include respond-to("desktop") {
    width: 70%;
  }
}
```

**编译结果**：
```css
.container {
  width: 80%;
}
@media (max-width: 768px) {
  .container {
    width: 100%;
  }
}
@media (min-width: 1025px) {
  .container {
    width: 70%;
  }
}
```

---

### 3. `@extend`

#### 3.1 基本继承

```scss
.button {
  display: inline-block;
  padding: 20px;
  background-color: red;
  color: white;
}

.primary-button {
  @extend .button;
  background-color: blue;
}
```

**编译结果**：
```css
.button, .primary-button {
  display: inline-block;
  padding: 20px;
  background-color: red;
  color: white;
}
.primary-button {
  background-color: blue;
}
```

#### 3.2 复杂继承

```scss
.box {
  border: 1px #f00;
  background-color: #fdd;
}

.container {
  @extend .box;
  border-width: 3px;
}

.box.a {
  background-image: url("/image/abc.png");
}
```

**编译结果**：
```css
.box, .container {
  border: 1px #f00;
  background-color: #fdd;
}
.container {
  border-width: 3px;
}
.box.a, .a.container {
  background-image: url("/image/abc.png");
}
```

#### 3.3 占位符选择器

使用 `%` 定义占位符，不生成单独的 CSS：

```scss
%button {
  display: inline-block;
  padding: 20px;
  background-color: red;
  color: white;
}

.primary-button {
  @extend %button;
  background-color: blue;
}

.secondary-button {
  @extend %button;
  background-color: pink;
}
```

**编译结果**：
```css
.secondary-button, .primary-button {
  display: inline-block;
  padding: 20px;
  background-color: red;
  color: white;
}
.primary-button {
  background-color: blue;
}
.secondary-button {
  background-color: pink;
}
```

#### 3.4 `@extend` vs `@mixin`

| 特性 | `@extend` | `@mixin` |
|------|-----------|----------|
| 参数支持 | ❌ 不支持 | ✅ 支持 |
| CSS 生成 | 合并选择器，紧凑 | 每处完整复制 |
| 适用场景 | 继承已有样式 | 需要参数的通用样式 |

---

### 4. `@at-root`

将嵌套规则移动到根级别：

```scss
.parent {
  color: red;
  
  @at-root .child {
    color: blue;
  }
}
```

**编译结果**：
```css
.parent {
  color: red;
}
.child {
  color: blue;
}
```

移动一组规则：

```scss
.parent {
  color: red;
  
  @at-root {
    .child {
      color: blue;
    }
    .test {
      color: pink;
    }
    .test2 {
      color: purple;
    }
  }
}
```

**编译结果**：
```css
.parent {
  color: red;
}
.child {
  color: blue;
}
.test {
  color: pink;
}
.test2 {
  color: purple;
}
```

---

### 5. `@debug`、`@warn`、`@error`

#### 5.1 `@debug`

输出调试信息：

```scss
$primary-color: #007bff;

@debug "Primary color: #{$primary-color}";
```

**编译时输出**：
```
Debug: Primary color: #007bff
```

#### 5.2 `@warn`

输出警告信息，不会中断编译：

```scss
$deprecated-var: old-value;

@warn "变量 $deprecated-var 已弃用，请使用新变量";
```

**编译时输出**：
```
Warning: 变量 $deprecated-var 已弃用，请使用新变量
```

#### 5.3 `@error`

输出错误信息，中断编译：

```scss
@function divide($a, $b) {
  @if $b == 0 {
    @error "除数不能为零！";
  }
  @return $a / $b;
}

.container {
  width: divide(100px, 0);
}
```

**编译时输出**：
```
Error: 除数不能为零！
```

**使用场景**：

- `@debug`：开发时调试变量和函数
- `@warn`：提示废弃的 API 或潜在问题
- `@error`：在参数不合法时中断编译

---

## 模块化开发

### 1. 文件组织建议

```
styles/
├── abstracts/          # 抽象层
│   ├── _variables.scss    # 变量
│   ├── _functions.scss    # 自定义函数
│   └── _mixins.scss       # Mixins
├── base/               # 基础层
│   ├── _reset.scss        # CSS Reset
│   └── _typography.scss   # 排版
├── components/         # 组件层
│   ├── _buttons.scss      # 按钮组件
│   ├── _cards.scss        # 卡片组件
│   └── _forms.scss        # 表单组件
├── layout/             # 布局层
│   ├── _header.scss       # 头部
│   ├── _footer.scss       # 底部
│   └── _grid.scss         # 网格
├── pages/              # 页面层
│   ├── _home.scss         # 首页
│   └── _about.scss        # 关于页
└── main.scss           # 主文件
```

### 2. 使用 `@use`（现代方式）

Sass Module System 是推荐的模块化方式：

**`_colors.scss`**:
```scss
$primary: #007bff;
$secondary: #6c757d;
```

**`main.scss`**:
```scss
@use "colors" as c;

.button {
  background-color: c.$primary;
}
```

### 3. 使用 `@forward`

转发模块：

**`_theme.scss`**:
```scss
@forward "colors";
@forward "typography";
```

**`main.scss`**:
```scss
@use "theme";

.button {
  background-color: theme.$primary;
}
```

---

## 最佳实践

### 1. 命名规范

- **变量**：使用小写字母和连字符 `$primary-color`
- **Mixin**：使用小写字母和连字符 `@mixin flex-center`
- **函数**：使用小写字母和连字符 `@function rem-calc`

### 2. 代码组织

1. **变量声明在前**：先声明所有变量
2. **Mixin 在前**：在使用前定义
3. **嵌套不超过 3 层**：避免过度嵌套
4. **使用 `@extend` 时谨慎**：避免生成过长的选择器

### 3. 性能优化

1. **避免过度使用 `@extend`**：可能生成巨大的选择器
2. **使用占位符选择器**：`%placeholder` 而非具体选择器
3. **合理使用 `!global`**：尽量减少全局变量

### 4. 现代工作流

#### 使用 Dart Sass

```bash
npm install sass --save-dev
```

#### 配置 `package.json`

```json
{
  "scripts": {
    "build:css": "sass src/scss:dist/css --style compressed",
    "watch:css": "sass --watch src/scss:dist/css"
  }
}
```

#### 结合构建工具

**Vite 配置**：
```javascript
// vite.config.js
export default {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
}
```

**Webpack 配置**：
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
```

### 5. VS Code 配置

推荐插件：
- **SCSS IntelliSense**：智能提示
- **Live Sass Compiler**：实时编译

**VS Code 设置**：
```json
{
  "liveSassCompile.settings.formats": [
    {
      "format": "expanded",
      "extensionName": ".css",
      "savePath": "/dist/css"
    }
  ],
  "liveSassCompile.settings.generateMap": true,
  "liveSassCompile.settings.autoprefix": true
}
```

---

## 总结

Sass 是一个功能强大的 CSS 预处理器，主要特性包括：

1. **变量系统**：统一管理样式值
2. **嵌套语法**：清晰的选择器层级
3. **Mixin 和函数**：代码复用和计算
4. **控制指令**：条件判断和循环
5. **模块化**：通过 `@import`、`@use`、`@forward` 组织代码

掌握 Sass 能显著提升 CSS 开发效率和代码质量，是现代前端开发的必备技能。

---

**参考资源**：

- [Sass 官方文档](https://sass-lang.com/documentation)
- [Dart Sass GitHub](https://github.com/sass/dart-sass)
- [Sass Guidelines](https://sass-guidelin.es/)
