# JavaScript 面试题完整笔记

## 目录

- [一、执行上下文与作用域](#一执行上下文与作用域)
- [二、原型与原型链](#二原型与原型链)
- [三、this 指向与手写实现](#三this-指向与手写实现)
- [四、面向对象与继承](#四面向对象与继承)
- [五、异步编程与 Promise](#五异步编程与-promise)
- [六、事件循环与任务队列](#六事件循环与任务队列)
- [七、浏览器原理](#七浏览器原理)
- [八、性能优化](#八性能优化)

---

## 一、执行上下文与作用域

### 1.1 执行上下文定义

> 执行上下文是 JavaScript 代码执行时创建的一个环境，里面包含 JS 代码执行所需要的所有信息。

### 1.2 执行上下文分类

| 类型 | 说明 |
|------|------|
| 全局执行上下文 | 任何程序启动时首先创建的上下文，栈底始终是全局执行上下文 |
| 函数执行上下文 | 每次调用函数时创建，函数执行完毕后出栈 |
| Eval 执行上下文 | eval() 函数执行时创建（不推荐使用） |

> **执行栈**：执行上下文以栈的形式管理。栈底始终是全局执行上下文，调用函数时新的执行上下文入栈，函数执行完毕后出栈。

### 1.3 执行上下文的组成部分

```
执行上下文
├── this 绑定：确定 this 的指向
├── 词法环境（Lexical Environment）
├── 变量环境（Variable Environment）
└── 私有环境（Private Environment）：用于存储 class 中的私有变量
```

### 1.4 词法环境与变量环境

#### 词法环境（Lexical Environment）

**作用域**是一个概念，描述了变量和函数的可访问范围。**词法环境**是实现作用域的具体机制，是 JavaScript 引擎内部的数据结构。

**组成部分**：
1. **环境记录（Environment Record）**
   - 声明性环境记录：`let`、`const`、函数声明、`class` 声明、`arguments` 对象
   - 对象性环境记录：对象字面量、`with` 语句等
2. **外部词法环境引用**：指向外部的词法环境，从而形成作用域链

#### 变量环境（Variable Environment）

变量环境是词法环境的一种特殊类型。概念上与词法环境分开，但从数据结构上看，两者相同，**差别仅体现在用途上**：

| 对比项 | 词法环境 | 变量环境 |
|--------|----------|----------|
| 存储内容 | `let`、`const`、函数声明、`class` | `var` 声明的变量 |
| 变量提升 | 创建但未初始化（暂时性死区） | 创建并初始化为 `undefined` |

---

## 二、原型与原型链

### 2.1 对象的创建方式

JavaScript 中生成对象有两种方式：

| 方式 | 对象信息来源 | 特点 |
|------|--------------|------|
| 通过类实例化 | 类的构造器及参数 | ES6 `class` 语法糖 |
| 通过原型对象 | 原型对象 | JavaScript 本质 |

> **注意**：ES6 提供的 `class` 并未将 JS 改造为基于类创建对象，它只是语法糖，本质上仍基于原型链创建对象。

### 2.2 class 与构造函数的区别

| 区别点 | 构造函数 | class |
|--------|----------|-------|
| 调用方式 | 可以作为普通函数调用 | 不能作为普通函数调用，必须用 `new` |
| 枚举性 | 原型上的属性可被枚举 | 原型上的方法不可枚举 |
| 严格模式 | 默认非严格模式 | 内部默认严格模式 |
| 方法构造 | 原型方法可以被 `new` | 原型方法不能被 `new` |

### 2.3 原型链

每个对象都有一个 `[[Prototype]]` 内部属性（可通过 `__proto__` 访问），指向其构造函数的 `prototype`。当访问对象的属性时，如果对象本身没有该属性，就会沿着原型链向上查找，直到找到或到达原型链顶端（`null`）。

```
实例对象.__proto__ === 构造函数.prototype
构造函数.prototype.__proto__ === Object.prototype
Object.prototype.__proto__ === null
```

---

## 三、this 指向与手写实现

### 3.1 this 的指向规则

#### 规则一：作为构造函数调用

当函数通过 `new` 调用时，`this` 指向新创建的实例。

```javascript
function Cat(name, color) {
  this.name = name;
  this.color = color;
}
let cat1 = new Cat("大毛", "橘色");
console.log(cat1.name); // '大毛'
```

#### 规则二：直接调用

函数直接调用时，`this` 指向全局对象（浏览器中为 `window`），**严格模式下为 `undefined`**。

```javascript
function Cat(name, color) {
  this.name = name;
  this.color = color;
}
Cat("大毛", "橘色");
console.log(window.name); // '大毛'
```

#### 规则三：作为对象方法调用

当函数作为对象的方法调用时，`this` 指向调用该方法的对象（即点 `.` 前面的对象）。

```javascript
function setDetails(name, color) {
  this.name = name;
  this.color = color;
}
let cat = {};
cat.setDetails = setDetails;
cat.setDetails('大毛', '橘色');
console.log(cat.name); // '大毛'
```

#### 规则四：call/apply/bind 显式绑定

通过 `call`、`apply`、`bind` 可以显式指定 `this` 的指向。

### 3.2 思考题

**思考题 1**：嵌套函数中的 this

```javascript
let obj = {
  x: 10,
  fn: function() {
    function a() {
      console.log(this.x);
    }
    a(); // 直接调用，this 指向 window（严格模式下为 undefined）
  }
};
obj.fn(); // 输出：undefined（严格模式）或 window.x（非严格模式）
```

**思考题 2**：方法赋值后的 this

```javascript
let obj = {
  x: 10,
  fn: function() {
    console.log(this.x);
  }
};
let a = obj.fn;
obj.fn(); // 输出：10（obj 调用）
a();      // 输出：undefined（直接调用，this 指向 window）
```

**思考题 3**：返回函数的 this

```javascript
let obj = {
  x: 10,
  fn: function() {
    return function() {
      console.log(this.x);
    }
  }
};
obj.fn()(); // 输出：undefined（返回的函数直接调用）
```

### 3.3 手写实现 call

`call` 方法让函数以指定的 `this` 值调用，后续参数依次传入。

**实现思路**：
1. 在 `Function.prototype` 上挂载自定义方法
2. 将原函数作为 `context` 的临时方法调用
3. 处理方法名冲突（使用 `Symbol` 或随机字符串）
4. 执行后删除临时方法
5. 返回原函数的执行结果

```javascript
Function.prototype.call2 = function(context, ...args) {
  // 处理 context 为 null 或 undefined 的情况
  context = context || window;
  
  // 使用 Symbol 避免属性名冲突
  const uniqueKey = Symbol('fn');
  
  // 将原函数作为 context 的方法
  context[uniqueKey] = this;
  
  // 执行并获取返回值
  const result = context[uniqueKey](...args);
  
  // 删除临时方法
  delete context[uniqueKey];
  
  return result;
};
```

### 3.4 手写实现 apply

`apply` 与 `call` 功能一致，区别在于参数以数组形式传入。

```javascript
Function.prototype.apply2 = function(context, args) {
  // 处理 context 为 null 或 undefined 的情况
  context = context || window;
  
  // 使用 Symbol 避免属性名冲突
  const uniqueKey = Symbol('fn');
  
  // 将原函数作为 context 的方法
  context[uniqueKey] = this;
  
  // 处理未传参数的情况
  args = args || [];
  
  // 执行并获取返回值
  const result = context[uniqueKey](...args);
  
  // 删除临时方法
  delete context[uniqueKey];
  
  return result;
};
```

### 3.5 手写实现 bind

`bind` 返回一个新函数，不会立即执行，可以预传参。返回的函数作为构造函数时，`this` 指向实例。

**实现要点**：
1. 返回一个新函数
2. 支持预传参和调用时传参的合并
3. 返回的函数作为构造函数时，`this` 指向实例
4. 返回函数需要继承原函数的原型

```javascript
Function.prototype.bind2 = function(context, ...args) {
  const originFn = this;
  
  function fBind(...bindArgs) {
    // 判断是否作为构造函数调用
    // 如果是构造函数调用，this 指向实例；否则指向绑定的 context
    return originFn.apply(
      this instanceof fBind ? this : context,
      args.concat(bindArgs)
    );
  }
  
  // 继承原函数的原型
  fBind.prototype = Object.create(originFn.prototype);
  
  return fBind;
};
```

### 3.6 手写实现 new

`new` 操作符的实现逻辑：
1. 创建一个新对象
2. 将新对象的 `[[Prototype]]` 指向构造函数的 `prototype`
3. 执行构造函数，绑定 `this` 到新对象
4. 如果构造函数返回对象，则返回该对象；否则返回新对象

```javascript
function newFactory(constructor, ...args) {
  // 创建新对象，原型指向构造函数的 prototype
  const obj = Object.create(constructor.prototype);
  
  // 执行构造函数
  const result = constructor.apply(obj, args);
  
  // 如果返回值是对象，则返回该对象；否则返回新对象
  return result instanceof Object ? result : obj;
}
```

**使用示例**：

```javascript
function Cat(name) {
  this.name = name;
}
Cat.prototype.miao = function() {
  console.log('喵~！');
};

let cat = newFactory(Cat, '大毛');
console.log(cat.name);  // '大毛'
cat.miao();             // '喵~！'
```

---

## 四、面向对象与继承

### 4.1 原型链继承

#### 组合继承（伪经典继承）

组合继承结合了原型链继承和构造函数继承。

```javascript
// 父类
function Parent(value) {
  this.val = value;
}
Parent.prototype.getValue = function() {
  console.log(this.val);
};

// 子类
function Child(value) {
  // 继承属性
  Parent.call(this, value);
}
// 继承方法
Child.prototype = new Parent();
// 修正 constructor 指向
Child.prototype.constructor = Child;
```

**缺点**：实例对象和原型对象上都会有相同的属性，造成内存浪费。

### 4.2 圣杯模式（寄生组合式继承）

通过中间函数实现原型继承，避免调用父类构造函数。

```javascript
function inherit(Child, Parent) {
  // 创建一个中间构造函数
  function F() {}
  F.prototype = Parent.prototype;
  // 子类原型指向中间构造函数的实例
  Child.prototype = new F();
  // 修正 constructor 指向
  Child.prototype.constructor = Child;
}
```

**缺点**：代码不够优雅、语义化不强。

### 4.3 ES6 继承

ES6 提供了 `class` 和 `extends` 关键字，使继承更加简洁。

```javascript
class Parent {
  constructor(value) {
    this.val = value;
  }
  getValue() {
    console.log(this.val);
  }
}

class Child extends Parent {
  constructor(value) {
    super(value);
  }
}
```

---

## 五、异步编程与 Promise

### 5.1 Promise 基础

Promise 是 ES6 引入的异步解决方案，解决了回调地狱问题。

**Promise 的三个状态**：
- `pending`：初始状态
- `fulfilled`：成功状态
- `rejected`：失败状态

状态一旦改变，就不可再变。

### 5.2 手写 Promise 实现

#### 基础结构与状态管理

```javascript
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise2 {
  constructor(executor) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    
    const resolve = (value) => {
      // 处理 resolve Promise 实例的情况
      if (value instanceof Promise2) {
        value.then(resolve, reject);
        return;
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        // 异步执行回调
        setTimeout(() => {
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        });
      }
    };
    
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        setTimeout(() => {
          this.onRejectedCallbacks.forEach(fn => fn(this.reason));
        });
      }
    };
    
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
}
```

#### then 方法实现

`then` 方法返回一个新的 Promise，支持链式调用。

```javascript
then(onFulfilled, onRejected) {
  const promise2 = new Promise2((resolve, reject) => {
    if (this.status === FULFILLED) {
      setTimeout(() => {
        try {
          const callbackValue = onFulfilled(this.value);
          resolve(callbackValue);
        } catch (error) {
          reject(error);
        }
      });
    }
    
    if (this.status === REJECTED) {
      setTimeout(() => {
        try {
          const callbackValue = onRejected(this.reason);
          resolve(callbackValue);
        } catch (error) {
          reject(error);
        }
      });
    }
    
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        try {
          const callbackValue = onFulfilled(this.value);
          resolve(callbackValue);
        } catch (error) {
          reject(error);
        }
      });
      this.onRejectedCallbacks.push(() => {
        try {
          const callbackValue = onRejected(this.reason);
          resolve(callbackValue);
        } catch (error) {
          reject(error);
        }
      });
    }
  });
  
  return promise2;
}
```

#### 静态方法实现

```javascript
// Promise.resolve
static resolve(value) {
  if (value instanceof Promise2) {
    return value;
  }
  return new Promise2((resolve) => resolve(value));
}

// Promise.reject
static reject(reason) {
  return new Promise2((_, reject) => reject(reason));
}

// Promise.all
static all(promises) {
  return new Promise2((resolve, reject) => {
    const resolvedValues = [];
    let resolvedCounter = 0;
    
    promises.forEach((promise, index) => {
      Promise2.resolve(promise).then(
        (value) => {
          resolvedValues[index] = value;
          resolvedCounter++;
          if (resolvedCounter === promises.length) {
            resolve(resolvedValues);
          }
        },
        (reason) => reject(reason)
      );
    });
  });
}

// Promise.race
static race(promises) {
  return new Promise2((resolve, reject) => {
    promises.forEach((promise) => {
      Promise2.resolve(promise).then(resolve, reject);
    });
  });
}

// catch 方法
catch(onRejected) {
  return this.then(null, onRejected);
}
```

### 5.3 防抖与节流

#### 防抖（Debounce）

**概念**：在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。

**场景**：搜索框输入、窗口 resize

```javascript
function debounce(fn, delay) {
  let timer = null;
  
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

#### 节流（Throttle）

**概念**：规定单位时间内，只能有一次触发事件的回调执行。

**场景**：滚动加载、按钮点击

```javascript
function throttle(fn, delay) {
  let canRun = true;
  
  return function(...args) {
    if (!canRun) return;
    
    canRun = false;
    fn.apply(this, args);
    
    setTimeout(() => {
      canRun = true;
    }, delay);
  };
}
```

---

## 六、事件循环与任务队列

### 6.1 宏任务与微任务

| 类型 | 执行时机 | 常见 API |
|------|----------|----------|
| 宏任务（MacroTask） | 下一个事件循环 | `setTimeout`、`setInterval`、`setImmediate`（Node）、`requestAnimationFrame`、I/O、UI 渲染 |
| 微任务（MicroTask） | 当前事件循环队尾 | `Promise.then`、`MutationObserver`、`process.nextTick`（Node） |

### 6.2 事件循环机制

```
执行栈
   ↓
执行同步代码
   ↓
检查微任务队列 → 执行所有微任务
   ↓
检查宏任务队列 → 执行一个宏任务
   ↓
检查微任务队列 → 执行所有微任务
   ↓
渲染页面（如果需要）
   ↓
循环...
```

### 6.3 执行顺序示例

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 输出顺序：1 -> 4 -> 3 -> 2
```

**解析**：
1. 同步代码：`1`、`4`
2. 微任务：`3`
3. 宏任务：`2`

---

## 七、浏览器原理

### 7.1 从输入 URL 到页面展示的流程

```
用户输入 URL
    ↓
DNS 解析（获取 IP 地址）
    ↓
建立 TCP 连接（三次握手）
    ↓
发送 HTTP 请求
    ↓
服务器处理请求，返回响应
    ↓
浏览器接收响应
    ↓
解析 HTML → 构建 DOM 树
    ↓
解析 CSS → 构建 CSSOM 树
    ↓
执行 JavaScript
    ↓
构建渲染树（Render Tree）
    ↓
布局（Layout/Reflow）
    ↓
绘制（Paint/Repaint）
    ↓
合成（Composite）
    ↓
页面展示
```

### 7.2 DNS 解析过程

1. **浏览器缓存**：检查浏览器是否有该域名的缓存
2. **系统 Hosts**：检查本地 hosts 文件
3. **本地 DNS 服务器**：向 ISP 的 DNS 服务器查询
4. **迭代查询**：
   - 向根域名服务器查询 → 返回顶级域名服务器 IP
   - 向顶级域名服务器查询 → 返回权威域名服务器 IP
   - 向权威域名服务器查询 → 返回域名对应的 IP
5. **缓存结果**：将结果缓存供下次使用

### 7.3 TCP 三次握手与四次挥手

#### 三次握手（建立连接）

```
客户端                      服务端
   |                          |
   |-------- SYN ------------>|  第一次：请求建立连接
   |                          |
   |<------ SYN + ACK --------|  第二次：确认请求，同意建立连接
   |                          |
   |-------- ACK ------------>|  第三次：确认收到
   |                          |
```

**为什么是三次而不是两次？**

防止已失效的连接请求报文段突然到达服务端，导致服务端错误建立连接。

#### 四次挥手（关闭连接）

```
客户端                      服务端
   |                          |
   |-------- FIN ------------>|  第一次：请求关闭连接
   |                          |
   |<-------- ACK ------------|  第二次：确认请求
   |                          |
   |<-------- FIN ------------|  第三次：服务端也准备好关闭
   |                          |
   |-------- ACK ------------>|  第四次：确认关闭
   |                          |
```

### 7.4 HTTP 缓存

#### 强缓存

不发送请求，直接使用本地缓存。

| Header | 说明 |
|--------|------|
| `Cache-Control` | HTTP/1.1，指定缓存机制（如 `max-age=3600`） |
| `Expires` | HTTP/1.0，指定过期时间（绝对时间） |

#### 协商缓存

需要向服务器验证缓存是否有效。

| Header | 说明 |
|--------|------|
| `Last-Modified` | 资源最后修改时间 |
| `ETag` | 资源的唯一标识 |

**缓存流程**：

```
请求资源
    ↓
检查强缓存（Cache-Control/Expires）
    ↓
有效 → 使用缓存（200 from cache）
无效 → 发送请求验证协商缓存
    ↓
未修改 → 返回 304 Not Modified
已修改 → 返回新资源（200）
```

### 7.5 浏览器渲染过程

1. **解析 HTML** → 构建 DOM 树
2. **解析 CSS** → 构建 CSSOM 树
3. **执行 JavaScript** → 可能修改 DOM 或 CSSOM
4. **构建渲染树** → DOM + CSSOM
5. **布局（Layout）** → 计算元素位置和大小
6. **绘制（Paint）** → 将元素绘制到图层
7. **合成（Composite）** → 将图层合成到页面

> **注意**：CSS 下载不阻塞解析，但 JavaScript 会等待 CSS 下载并解析完成后再执行（因为 JS 可能读取 CSS 属性）。

### 7.6 重绘与重排

#### 重排（Reflow）

元素的**几何属性**变化，需要重新计算布局。

**触发条件**：
- 添加/删除可见 DOM 元素
- 元素位置改变
- 元素尺寸改变（宽、高、边距、边框）
- 浏览器窗口大小改变

#### 重绘（Repaint）

元素的**外观样式**变化，不影响布局。

**触发条件**：
- 改变颜色、背景
- 改变 visibility、outline

> **关系**：重排必然重绘，重绘不一定重排。

#### 优化措施

```javascript
// 1. 批量修改样式
el.style.cssText = 'border-left: 1px; border-right: 2px; padding: 5px;';

// 2. 隐藏元素后修改，再显示
ul.style.display = 'none';
// ... 修改操作
ul.style.display = 'block';

// 3. 使用文档片段
const fragment = document.createDocumentFragment();
// ... 添加元素
container.appendChild(fragment);

// 4. 缓存布局信息
const current = div.offsetLeft;
div.style.left = 1 + current + 'px';
```

---

## 八、性能优化

### 8.1 减少 HTTP 请求

- 合并 CSS、JS 文件
- 使用 CSS Sprites
- 使用字体图标或 SVG

### 8.2 代码层面优化

- 使用防抖/节流减少频繁触发
- 避免在循环中操作 DOM
- 使用事件委托
- 合理使用 Web Workers

### 8.3 资源加载优化

- 图片懒加载
- 路由懒加载
- 预加载关键资源（`<link rel="preload">`）
- 使用 CDN

---

## 附录：常见面试题速查

| 题目 | 答案要点 |
|------|----------|
| 闭包是什么？ | 函数与其词法环境的组合，可以访问外部函数的变量 |
| typeof 返回值 | `undefined`、`boolean`、`number`、`string`、`object`、`function`、`symbol`、`bigint` |
| == 和 === 的区别 | `==` 会类型转换，`===` 严格比较 |
| 深拷贝实现 | `JSON.parse(JSON.stringify())`、递归实现、structuredClone |
| 事件委托原理 | 利用事件冒泡，在父元素上监听事件 |
| var/let/const 区别 | var 有变量提升、函数作用域；let/const 块级作用域、暂时性死区 |
| 箭头函数特点 | 没有 this、arguments、super、new.target，不能作为构造函数 |
| ES6 新特性 | let/const、箭头函数、模板字符串、解构、Promise、class、模块化等 |

---

> 本笔记整合自《JS经典面试题》与《JavaScript原生常规面试题》，经纠错、补充、重组而成。
