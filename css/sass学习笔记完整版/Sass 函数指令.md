> 类型: 章节 · 来源: [[css/sass学习笔记完整版]] · 更新: 2026-09-23
>
> ---

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
