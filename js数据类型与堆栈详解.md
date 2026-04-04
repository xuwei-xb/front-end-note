# JavaScript 数据类型与堆栈详解

## 常见的数据结构

> 数据结构整体可以分为两大类：线性数据结构 和 非线性数据结构

- 线性数据结构：数据会排列成线性的序列
- 数组（Array）：一种固定大小的数据结构，里面存储相同类型的元素集合。通过索引来进行访问。
- 链表（Linked List）：由一个一个的节点组成，每个节点会包含数据还有下一个节点的指针（内存地址）
- 栈（Stack）：只有一个出入口，先进后出、后进先出
- 队列（Queue）：有两个口，因此先进先出，后进后出

- 非线性数据结构：顾名思义，就是元素不以线性的顺序排列
- 树（Tree）：体现了一个层次，DOM树、组件树
- 图（Graph）：由多个节点以及连接节点的边组成。
- 哈希表（Hash Table）
- 对象（Object）：键值对存储，无序

> 前端常见的： 数组、栈、队列、链表、树

## 一、数据类型概览

JavaScript 共有 **8 种**数据类型，可分为两大类：

| 分类         | 类型      | 描述                                   |
| ------------ | --------- | -------------------------------------- |
| **原始类型** | Number    | 数字（整数、浮点数、NaN、Infinity）    |
|              | String    | 字符串                                 |
|              | Boolean   | 布尔值（true/false）                   |
|              | Undefined | 未定义                                 |
|              | Null      | 空值                                   |
|              | Symbol    | 符号（ES6新增，表示独一无二的值）      |
|              | BigInt    | 大整数（ES2020新增，表示任意精度整数） |
| **引用类型** | Object    | 对象（包括数组、函数、日期、正则等）   |

---

## 二、原始类型详解

### 1. Number

```javascript
let num1 = 42; // 整数
let num2 = 3.14; // 浮点数
let num3 = NaN; // Not a Number（typeof 结果为 "number"）
let num4 = Infinity; // 无穷大
let num5 = -Infinity; // 无穷小
```

**关键点**：

- JS 使用 IEEE 754 双精度浮点数表示
- **精度问题**：`0.1 + 0.2 !== 0.3`（结果约 0.30000000000000004）
- `isNaN()` 用于判断是否为 NaN
- `Number.isNaN()` 更严格，不进行类型转换

### 2. String

```javascript
let str1 = "双引号";
let str2 = "单引号";
let str3 = `模板字符串 ${变量}`; // ES6

// 字符串方法
"hello".length; // 5
"hello".toUpperCase(); // "HELLO"
"hello".includes("el"); // true
```

**关键点**：

- 字符串不可变（immutable）
- 支持模板字符串，可嵌入表达式
- 常用方法：`slice()`、`split()`、`replace()`、`trim()`

### 3. Boolean

```javascript
let bool1 = true;
let bool2 = false;

// 假值（falsy）列表
(false, 0, "", null, undefined, NaN);
```

**关键点**：

- 只有两个值：`true` 和 `false`
- 其他类型可通过 `Boolean()` 或 `!!` 转换为布尔值

### 4. Undefined

```javascript
let a; // 声明未赋值，值为 undefined
console.log(a); // undefined
console.log(typeof a); // "undefined"
```

**关键点**：

- 变量已声明但未赋值时的默认值
- 函数无返回值时默认返回 `undefined`
- `undefined` 是全局对象的一个属性

### 5. Null

```javascript
let b = null;
console.log(b); // null
console.log(typeof b); // "object"（历史遗留 bug）
```

**关键点**：

- 表示"空值"或"无值"
- `typeof null` 返回 `"object"` 是 JS 早期设计缺陷
- `null == undefined` 为 `true`，但 `null === undefined` 为 `false`

### 6. Symbol

```javascript
let sym1 = Symbol("描述");
let sym2 = Symbol("描述");
console.log(sym1 === sym2); // false

// 用作对象属性
let obj = {
  [sym1]: "value1",
};
```

**关键点**：

- ES6 新增，表示独一无二的值
- 用作对象属性名，防止属性名冲突
- `Symbol.for()` 可创建共享 Symbol

### 7. BigInt

```javascript
let big1 = 9007199254740991n; // 数字后加 n
let big2 = BigInt("9007199254740992");

console.log(big1 + big2);
```

**关键点**：

- ES2020 新增，用于表示超过 `Number.MAX_SAFE_INTEGER` 的整数
- 不能与普通数字混合运算
- 适用于加密、高精度计算等场景

---

## 三、引用类型详解

### Object

对象是引用类型的基石，包括：

```javascript
// 普通对象
let obj = { name: "张三", age: 25 };

// 数组（本质是对象）
let arr = [1, 2, 3];
console.log(typeof arr); // "object"

// 函数（特殊的对象）
function fn() {}
console.log(typeof fn); // "function"

// 日期
let date = new Date();

// 正则
let regex = /pattern/g;
```

**关键点**：

- 引用类型存储的是内存地址（指针）
- 赋值和参数传递都是传递引用
- 对象比较是比较引用，不是值：`{} !== {}`

---

## 四、内存模型：栈 vs 堆

JavaScript 的内存分为两个核心区域：

| 特性         | 栈                         | 堆                     |
| ------------ | -------------------------- | ---------------------- |
| **存储内容** | 原始类型值、引用类型的指针 | 引用类型的实际对象数据 |
| **访问速度** | 快（直接访问）             | 慢（间接访问）         |
| **分配机制** | 自动分配/释放              | 动态分配               |
| **大小限制** | 较小（约几 MB）            | 较大（受系统内存限制） |
| **数据结构** | LIFO（后进先出）           | 无序树状结构           |
| **生命周期** | 随执行上下文销毁           | 由垃圾回收机制管理     |

---

## 五、原始类型与栈

原始类型的值直接存储在**栈**中：

```javascript
let a = 10;
let b = "hello";
let c = true;
```

**内存示意**：

```
栈内存
┌─────────────┐
│     a: 10   │ ← 原始值直接存储
├─────────────┤
│ b: "hello"  │
├─────────────┤
│  c: true    │
└─────────────┘
```

**赋值行为**：

```javascript
let x = 5;
let y = x; // 复制值
y = 10;

console.log(x); // 5（不受影响）
```

**内存变化**：

```
赋值前:           赋值后:              y修改后:
┌─────────┐      ┌─────────┐         ┌─────────┐
│  x: 5   │      │  x: 5   │         │  x: 5   │
└─────────┘      └─────────┘         └─────────┘
                  ┌─────────┐         ┌─────────┐
                  │  y: 5   │         │  y: 10  │ ← 独立空间
                  └─────────┘         └─────────┘
```

**关键点**：

- 复制的是**值本身**
- 两个变量互不影响
- 修改其中一个不会影响另一个

---

## 六、引用类型与堆

引用类型的**引用（指针）**存储在栈中，**实际数据**存储在堆中：

```javascript
let obj1 = { name: "张三" };
let obj2 = [1, 2, 3];
```

**内存示意**：

```
栈内存                     堆内存
┌──────────────┐          ┌─────────────────────┐
│ obj1: 0x001  │ ────────→ │ { name: "张三" }   │
├──────────────┤          ├─────────────────────┤
│ obj2: 0x002  │ ────────→ │ [1, 2, 3]          │
└──────────────┘          └─────────────────────┘
     (指针/地址)               (实际对象数据)
```

**赋值行为**：

```javascript
let a = { value: 1 };
let b = a; // 复制的是指针（地址）
b.value = 2;

console.log(a.value); // 2（被影响了！）
```

**内存变化**：

```
赋值前:                           赋值后:
栈内存              堆内存        栈内存              堆内存
┌──────────┐      ┌─────────┐    ┌──────────┐      ┌─────────┐
│  a: 0x001│ ───→ │ value:1 │    │  a: 0x001│ ───→ │ value:2 │ ← 实际对象被修改
└──────────┘      └─────────┘    │  b: 0x001│ ───→ │         │
                                  └──────────┘      └─────────┘
                                   指向同一地址
```

**关键点**：

- 复制的是**指针（内存地址）**
- 两个变量指向**同一个堆对象**
- 修改任何一个都会影响另一个

---

## 七、类型检测

### 1. typeof

```javascript
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object"（bug）
typeof {}; // "object"
typeof []; // "object"
typeof function () {}; // "function"
typeof Symbol(); // "symbol"
typeof 42n; // "bigint"
```

**局限性**：无法区分数组、null、普通对象

### 2. instanceof

```javascript
[] instanceof Array;           // true
{} instanceof Object;          // true
new Date() instanceof Date;    // true
```

**局限性**：只能用于引用类型，且依赖原型链

### 3. Object.prototype.toString.call()

```javascript
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
```

**优点**：最准确的类型检测方法

---

## 八、栈深度与递归

栈内存有限，深度递归会导致**栈溢出**（Stack Overflow）：

```javascript
// 递归导致栈溢出
function deepRecursion(n) {
  if (n === 0) return 0;
  return deepRecursion(n - 1);
}

deepRecursion(10000); // RangeError: Maximum call stack size exceeded
```

**原因**：

- 每次函数调用在栈中创建一个**执行上下文**
- 执行上下文包含：变量、函数参数、返回地址等
- 递归深度过大时，栈空间耗尽

**解决方案**：

```javascript
// 1. 尾递归优化（ES6，但部分引擎未实现）
function tailRecursion(n, acc = 0) {
  if (n === 0) return acc;
  return tailRecursion(n - 1, acc + n);
}

// 2. 改用循环（推荐）
function loopSum(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
```

---

## 九、堆与垃圾回收

堆中的对象由**垃圾回收器**（Garbage Collector, GC）自动管理。

### 垃圾回收算法

#### 1. 引用计数法（已废弃）

```javascript
let obj = { data: "value" };
let obj2 = obj;
obj = null;
obj2 = null; // 引用计数为 0，被回收
```

**问题**：循环引用无法回收

```javascript
let a = {};
let b = {};
a.ref = b; // a 引用 b
b.ref = a; // b 引用 a
// a 和 b 的引用计数都为 1，永远不会被回收
```

#### 2. 标记-清除法（现代 GC）

1. **标记阶段**：从根对象（全局变量、活动执行上下文）开始，遍历所有可访问对象并标记
2. **清除阶段**：清除未标记的对象

```javascript
// 可达对象会被保留
let obj1 = { data: "reachable" };

// 不可达对象会被清除
function createObj() {
  let obj2 = { data: "unreachable" };
  return obj1; // obj2 离开作用域，变为不可达
}
createObj();
```

---

## 十、闭包与堆

闭包的本质就是**延长堆对象的声明周期**：

```javascript
function createCounter() {
  let count = 0; // 存储在堆中（因为是闭包变量）

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

**内存示意**：

```
堆内存
┌──────────────────────────────────┐
│ Counter Closure:                  │
│   count: 3                        │ ← 一直存活在堆中
│   [[Scopes]]: {                   │
│     count: [堆对象引用]           │
│   }                               │
└──────────────────────────────────┘
```

**关键点**：

- 闭包变量存储在**堆**中而非栈中
- 只要闭包被引用，堆中的变量就不会被回收
- 过度使用闭包可能导致内存泄漏

---

## 十一、类型转换

### 隐式转换

```javascript
// 字符串拼接
"5" + 1; // "51"
1 + "5"; // "15"

// 数学运算（除 + 外）
"5" - 1; // 4
"5" * 2; // 10
"5" / 2; // 2.5

// 逻辑运算
"5" == 5; // true（弱相等）
"5" === 5; // false（强相等）
```

### 显式转换

```javascript
// 转字符串
String(123); // "123"
(123).toString(); // "123"
123 + ""; // "123"

// 转数字
Number("123"); // 123
parseInt("123"); // 123
parseFloat("3.14"); // 3.14
+"123"; // 123（一元运算符）

// 转布尔值
Boolean(0); // false
Boolean("hello"); // true
!!"hello"; // true（双重否定）
```

---

## 十二、浅拷贝 vs 深拷贝

### 浅拷贝

只复制栈中的指针，堆对象仍然是共享的：

```javascript
let original = { a: 1, b: { c: 2 } };

// 方式1: Object.assign()
let shallow1 = Object.assign({}, original);

// 方式2: 展开运算符
let shallow2 = { ...original };

// 修改嵌套对象
shallow1.b.c = 999;

console.log(original.b.c); // 999（被影响！）
```

### 深拷贝

完全复制堆中的所有对象：

```javascript
let original = { a: 1, b: { c: 2 } };

// 方式1: JSON 方法（局限：无法处理函数、undefined、Symbol）
let deep1 = JSON.parse(JSON.stringify(original));

// 方式2: structuredClone（现代浏览器支持）
let deep2 = structuredClone(original);

// 方式3: 手动递归（最灵活）
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  const clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

let deep3 = deepClone(original);

deep3.b.c = 999;
console.log(original.b.c); // 2（不受影响）
```

**拷贝对比**：

| 特性     | 浅拷贝   | 深拷贝            |
| -------- | -------- | ----------------- |
| 栈指针   | 复制     | 复制              |
| 堆对象   | 共享     | 全部复制          |
| 嵌套对象 | 受影响   | 不受影响          |
| 性能     | 快       | 慢（递归/序列化） |
| 适用场景 | 扁平对象 | 复杂嵌套对象      |

---

## 十三、函数参数传递

JS 的参数传递本质是**值传递**，引用类型传递的是指针的副本：

```javascript
// 原始类型：值传递
function modifyPrimitive(num) {
  num = 100;
}

let x = 5;
modifyPrimitive(x);
console.log(x); // 5（不变）

// 引用类型：传递指针副本
function modifyObject(obj) {
  obj.value = 100; // 可以修改原对象
  obj = { value: 200 }; // 但不能改变指针指向
}

let y = { value: 5 };
modifyObject(y);
console.log(y.value); // 100（被修改，但指针未变）
```

---

## 十四、常见面试题

### 1. `null` 和 `undefined` 的区别？

| 特性     | null         | undefined             |
| -------- | ------------ | --------------------- |
| 含义     | 空值         | 未定义                |
| typeof   | "object"     | "undefined"           |
| 转数字   | 0            | NaN                   |
| 使用场景 | 主动赋值为空 | 变量未初始化/无返回值 |

### 2. `==` 和 `===` 的区别？

```javascript
"5" == 5; // true（类型转换后比较）
"5" === 5; // false（不转换，严格比较）
```

**建议**：始终使用 `===` 避免隐式转换带来的陷阱。

### 3. 如何判断数组？

```javascript
Array.isArray([]); // true（推荐）
[] instanceof Array; // true
Object.prototype.toString.call([]) === "[object Array]"; // true
```

---

## 十五、性能优化建议

基于堆栈理解，以下是性能优化要点：

### 1. 避免不必要的对象创建

```javascript
// 低效：循环中频繁创建对象
function bad() {
  for (let i = 0; i < 10000; i++) {
    let temp = { index: i }; // 每次都在堆中分配
  }
}

// 高效：复用对象
function good() {
  let temp = {};
  for (let i = 0; i < 10000; i++) {
    temp.index = i;
  }
}
```

### 2. 及时释放引用

```javascript
let largeData = fetchData();
process(largeData);
largeData = null; // 解除引用，允许 GC 回收
```

### 3. 避免深度递归

```javascript
// 改用循环或尾递归
function processData(data) {
  // 循环处理，避免栈溢出
  while (data) {
    // 处理逻辑
    data = data.next;
  }
}
```

### 4. 合理使用深拷贝

```javascript
// 仅在必要时深拷贝
let copy = shallowCopy; // 优先浅拷贝
if (needDeepCopy) {
  copy = deepClone(data);
}
```

---

## 十六、完整对照表

| 场景     | 原始类型         | 引用类型           |
| -------- | ---------------- | ------------------ |
| 存储位置 | 栈               | 指针在栈，数据在堆 |
| 赋值行为 | 复制值           | 复制指针           |
| 比较行为 | 比较值           | 比较指针           |
| 参数传递 | 值传递           | 指针副本传递       |
| 内存管理 | 随执行上下文销毁 | 垃圾回收机制       |
| 大小限制 | 小               | 大                 |
| 访问速度 | 快               | 相对慢             |
| 嵌套行为 | 不支持           | 支持任意嵌套       |

---

## 十七、最佳实践

1. **始终使用 `===` 进行比较**，避免隐式转换的坑
2. **显式类型转换**比隐式更可读、更可控
3. **区分 `null` 和 `undefined`**：`null` 表示"无值"，`undefined` 表示"未赋值"
4. **使用 `Object.prototype.toString.call()`** 进行精确类型检测
5. **注意浮点数精度问题**，涉及金额计算时使用整数或第三方库
6. **理解堆栈差异**，避免对象赋值带来的"意外联动"
7. **合理使用深拷贝**，根据场景选择拷贝策略
8. **及时释放大对象引用**，避免内存泄漏
9. **避免深度递归**，改用循环或尾递归优化
