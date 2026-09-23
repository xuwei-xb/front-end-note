> 类型: 章节 · 来源: [[css/sass学习笔记完整版]] · 更新: 2026-09-23
>
> ---

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
