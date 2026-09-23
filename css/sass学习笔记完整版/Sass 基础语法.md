> 类型: 章节 · 来源: [[css/sass学习笔记完整版]] · 更新: 2026-09-23
>
> ---

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
