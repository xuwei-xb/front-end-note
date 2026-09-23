> 类型: 章节 · 来源: [[css/sass学习笔记完整版]] · 更新: 2026-09-23
>
> ---

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
