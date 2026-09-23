> 类型: 章节 · 来源: [[css/sass学习笔记完整版]] · 更新: 2026-09-23
>
> ---

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
