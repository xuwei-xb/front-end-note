# 前端常用数据结构

> 20:30 开始

- 什么是数据结构
- 常用的数据结构
  - JavaScript如何实现
  - 这些数据结构实际场景



## 数据结构

所谓数据结构，是在计算机中组织、管理和存储数据的一种方式。

🙋：你知道哪些数据结构？

数据结构整体可以分为两大类：线性数据结构 和 非线性数据结构

- 线性数据结构：数据会排列成线性的序列
  - 数组（Array）：一种固定大小的数据结构，里面存储相同类型的元素集合。通过索引来进行访问。
  - 链表（Linked List）：由一个一个的节点组成，每个节点会包含数据还有下一个节点的指针（内存地址）
  - 栈（Stack）：只有一个出入口，先进后出、后进先出
  - 队列（Queue）：有两个口，因此先进先出，后进后出

- 非线性数据结构：顾名思义，就是元素不以线性的顺序排列
  - 树（Tree）：体现了一个层次，DOM树、组件树
  - 图（Graph）：由多个节点以及连接节点的边组成。
  - 哈希表（Hash Table）

前端常用的数据结构有：数组、栈、队列、链表以及树



## 数组

回顾一下数组创建的方法：

```js
// 字面量创建
const arr = [];
// Array构造函数
const arr2 = new Array(3); // 如果参数只有一个值，那么表示的是长度
const arr3 = new Array(1, 2, 3); // 如果参数是多个值，那么表示的是数组的元素
// Array.of方法：ES6 新引入的方法
// 解决 Array 构造函数参数只有一个的时候的怪异行为
const arr4 = Array.of(3); // [3]
const arr5 = Array.of(1, 2, 3); // [1, 2, 3]
// Array.from方法：从一个类组数对象或者可迭代对象创建一个新的数组
const arr6 = Array.from("abc"); // ['a', 'b', 'c']
// 扩展运算符
const a = [1, 2 ,3];
const b = [4, 5, 6];
const arr7 = [...a, ...b];
```

严格意义来讲，JS 里面所提供的数组并非数据结构里面的数组：

```java
int[] arr = new int[3];
arr[0] = 100; // 合法
arr[1] = 200; // 合法
arr[2] = 300; // 合法
arr[3] = 400; // 报错：数组越界
```

在 JS 中压根儿就没有数组越界这个概念

```js
const arr = [];
console.log(arr[10]); // undefined
arr[10] = 100;
console.log(arr[10]); // 100
```

究其原因，是因为 JS 底部，数组实际上就是对象。

类似于：

```js
const arr = {
  0: 100,
  1: 200,
  2: 300
}
console.log(arr[0]);
```



## 栈

- FILO（first in last out）：先进后出
- LIFO（last in first out）：后进先出

```js
class Stack {
  constructor(...args) {
    this.stack = [...args];
  }
  // 返回栈中元素的数量
  size() {
    return this.stack.length;
  }
  // 检查栈是否为空
  isEmpty() {
    return this.size() === 0;
  }
  // 添加一个或者多个元素到栈顶
  push(...items) {
    return this.stack.push(...items);
  }
  // 移除栈顶元素，返回被移除的元素
  pop() {
    return this.stack.pop();
  }
  // 返回栈顶元素，但是不删除
  peek() {
    return this.isEmpty() ? undefined : this.stack[this.size() - 1];
  }
}

const stack = new Stack();
console.log(stack.isEmpty()); // true
stack.push(1);
stack.push(2);
stack.push(3);
stack.push(4, 5, 6);
console.log(stack.size()); // 6
// 访问栈顶的元素
console.log(stack.peek()); // 6
stack.pop();
console.log(stack.peek()); // 5
```



**栈常见的应用场景**

1. 调用栈：函数在被调用的时候，使用的就是栈的数据结构，还有就是执行上下文，也是以栈的形式来存储的，再比如词法环境，多个词法环境，也是以栈的方式来存储的
2. 历史记录：也是通过栈这种结构来维护用户访问过的页面
3. 撤销操作：经常需要回退到用户上一次操作结果，我们这里就可以通过栈的方式来存储用户最新的操作的结果
4. 表达式求值：通过栈的方式来存储操作符和操作数



## 队列

- FIFO（first in first out）：先进先出
- LILO（last in last out）：后进后出

```js
class Queue {
  constructor(...args) {
    this.queue = [...args];
  }
  // 返回队列元素的数量
  size() {
    return this.queue.length;
  }
  // 检查队列是否为空
  isEmpty() {
    return this.queue.length === 0;
  }
  // 入队
  enqueue(...item) {
    return this.queue.push(...item);
  }
  // 出队
  dequeue() {
    return this.queue.shift();
  }
  // 返回一个队列头部的元素，但是不删除
  front() {
    return this.isEmpty() ? undefined : this.queue[0];
  }
  // 返回一个队列尾部的元素，但是不删除
  back() {
    return this.isEmpty() ? undefined : this.queue[this.size() - 1];
  }
}
```



**队列的常见场景**

1. 任务队列：在 JavaScript，存在异步操作的时候会将异步操作的结果放到一个队列里面，等待同代操作结束后，再从队列中依次取出结果来使用。
2. 动画队列：在 Web 动画中，如果要执行多个动画效果，可以将多个动画放入到队列里面，之后依次执行。通过队列的方式，我们可以确保前一个动画结束后，后一个动画才执行。



## 链表

链表仍然是属于线性数据结构。

- 数组：查找一个元素很快。但是做插入和删除操作比链表慢
- 链表：查找一个元素的效率比较低，但是插入和删除操作比数组效率高

链表可以分为单向链表和双向链表

- 单向链表：维护了一组节点，每个节点包含数据，同时还包含指向链表中下一个节点的指针
- 双向链表：维护了一组节点，每个节点包含数据，同时还包含下一个节点以及上一个节点的指针。



### 单向链表

```js
// 节点类
class Node {
  constructor(data) {
    this.data = data; // 存储数据
    this.next = null; // 指向下一个节点
  }
}

// 链表类
class LinkedList {
  constructor() {
    this.head = null; // 链表的头节点
    this.size = 0; // 链表的长度
  }
  // 接下来我们主要是需要实现一系列方法
  // 添加、指定位置添加、删除指定数据、删除指定位置、翻转、交换
  add(data) {
    const newNode = new Node(data); // 先生成一个数据节点
    if (!this.head) {
      // 查看当前的链表是否为空，如果为空，那么新节点就应该是头节点
      this.head = newNode;
    } else {
      // 否则我们就需要去做链表的遍历操作
      // 找到最后一个节点，将新节点添加到最后一个节点的 next 属性上
      let current = this.head; // current 相当于是一个指针
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }
  // 在指定索引处去添加节点
  addAt(data, index) {
    if (index < 0 || index > this.size) {
      return false;
    }
    // 创建一个新的节点
    const newNode = new Node(data);
    let current = this.head; // current 相当于是一个指针，指向头节点
    let prev = null; // 用来保存前一个节点
    if (index === 0) {
      // 说明你是要插入到第一个节点的最前面
      // 也就是说新节点要成为头节点
      newNode.next = current;
      this.head = newNode;
    } else {
      // 进入此分支，说明要插入到中间或者最后
      // 这里需要遍历
      for (let i = 0; i < index; i++) {
        prev = current;
        current = current.next;
      }
      // for 循环退出后，说明找到了要插入的位置
      newNode.next = current;
      prev.next = newNode;
    }
    this.size++;
  }
  // 打印链表数据
  // 1 -> 2 -> 3 -> null
  print() {
    let current = this.head; // current 相当于是一个指针，一开始指向头节点
    let result = ""; // 拼接结果
    while (current) {
      result += current.data + " -> ";
      current = current.next;
    }
    result += "null";
    console.log(result);
  }
  // 删除指定数据
  remove(data) {
    let current = this.head; // current 相当于是一个指针，指向头节点
    let prev = null; // 用来保存前一个节点
    while (current != null) {
      if (current.data === data) {
        // 说明找到了要删除的节点
        if (prev === null) {
          // 说明要删除的是头节点
          this.head = current.next;
        } else {
          // 说明是后面的节点
          prev.next = current.next;
        }
        this.size--;
        // 返回被删除的节点的数据
        return current.data;
      }
      // 没有进入上面的 if，说明还没有找到要删除的节点
      // 继续往下找
      prev = current;
      current = current.next;
    }
    return -1;
  }
  // 翻转链表
  reverse() {
    let current = this.head; // 指针指向头节点
    let prev = null; // 用来保存前一个节点
    let next = null; // 用来保存下一个节点
    while (current !== null) {
      next = current.next; // 保存下一个节点
      current.next = prev; // 当前节点的 next 指向前一个节点
      prev = current; // prev 指针往前移动
      current = next; // current 指针往前移动
    }
    this.head = prev; // 重置头节点
  }
  // 节点的交换
  swap(index1, index2) {
    // 防御措施
    // 有关防御措施，在封装一些公共的方法的时候，一定要考虑到一些边界情况
    if (
      index1 < 0 ||
      index2 < 0 ||
      index1 >= this.size ||
      index2 >= this.size ||
      index1 === index2
    ) {
      // 这些情况都是索引无效的情况
      return false;
    }

    if (index1 > index2) {
      return this.swap(index2, index1);
    }

    let current = this.head; // 指针，用于遍历所有的节点
    let counter = 0; // 记录索引值的
    let node1 = null;
    let node2 = null;

    while (current) {
      if (counter === index1) {
        // 找到了第一个下标所对应的节点
        node1 = current;
      } else if (counter === index2) {
        // 找到了第二个下标所对应的节点
        node2 = current;
      }
      if (node1 && node2) break;
      // 接着往后面走
      current = current.next;
      counter++;
    }
    // 进行后面的交换操作
    if (node1 && node2) {
      let temp = node1.data;
      node1.data = node2.data;
      node2.data = temp;
      return true;
    }
  }
}

// 测试相关代码
const linkedList = new LinkedList();
linkedList.add(1);
linkedList.add(2);
linkedList.add(3);
linkedList.print();
linkedList.addAt(100, 2);
linkedList.print();
linkedList.remove(100);
linkedList.print();
linkedList.reverse();
linkedList.print();
linkedList.swap(0, 2);
linkedList.print();
```



**单向链表常见的应用场景**

React16 之后引入了 Fiber 架构。其中的 Fiber 节点就是使用的单向链表进行链接的。

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
 	// ...

  // Fiber
  this.return = null; // 指向父Fiber节点
  this.child = null; // 指向子Fiber节点
  this.sibling = null; // 指向兄弟Fiber节点
	
  // 通过单向链表的方式，将整个Fiber节点串联起来了
  // ...
}
```

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-02-24-032509.png" alt="image-20230224112508425" style="zoom:50%;" />



### 双向链表

```js
// 节点类
class Node {
  constructor(data) {
    this.data = data; // 存储数据
    this.next = null; // 指向下一个节点
    this.prev = null; // 指向上一个节点
  }
}

// 双向链表类
class DoubleLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  // 添加一个节点
  add(item) {
    const node = new Node(item); // 创建一个节点
    if (!this.head) {
      // 表示当前链表连头节点都没有
      // 当前节点就应该是头节点
      this.head = node;
      this.tail = node;
    } else {
      // 当前链表已经有头节点，只需要将当前节点添加到链表的尾部
      node.prev = this.tail; // 当前节点的prev指向链表的尾部
      this.tail.next = node; // 链表的尾部的next指向当前节点
      this.tail = node; // 当前节点就是链表的尾部
    }
  }
  // 在链表指定位置添加一个节点
  addAt(index, item) {
    let current = this.head; // 指针，用来遍历链表
    let counter = 1; // 记录下标值
    const node = new Node(item); // 创建一个节点

    if (index === 0) {
      // 说明是要在头部前面添加一个节点
      this.head.prev = node; // 头部的prev指向当前节点
      node.next = this.head; // 当前节点的next指向头部
      this.head = node; // 当前节点就是头部
    } else {
      // 非头部插入，这里就会涉及到一个遍历的操作
      while (current) {
        current = current.next; // 指针指向下一个节点
        if (counter === index) {
          // 说明找到了要插入的地方
          node.prev = current.prev; // 当前节点的prev指向当前节点的prev
          current.prev.next = node; // 当前节点的prev的next指向当前节点
          node.next = current; // 当前节点的next指向找到的这个节点
          current.prev = node; // 找到的这个节点的prev指向当前节点
          break;
        }
        counter++;
      }
    }
  }
  // 打印方法
  // 打印成这种形式：{data:'Node1',prev:null,next:Node2} {data:'Node2',prev:Node1,next:Node3}
  print() {
    let current = this.head; // 指针，用来遍历链表
    let result = "";
    while (current) {
      result += `{data:'${current.data}',prev:${
        current.prev ? current.prev.data : null
      },next:${current.next ? current.next.data : null}} \n`;
      current = current.next; // 指针指向下一个节点
    }
    console.log(result);
  }

  // 删除指定数据的节点
  remove(item) {
    let current = this.head; // 指针，用来遍历链表
    while (current) {
      if (current.data === item) {
        // 说明找到了要删除的节点
        if (current === this.head && current === this.tail) {
          // 说明只有一个节点，这个节点既是头部又是尾部
          this.head = null;
          this.tail = null;
        } else if (current === this.head) {
          this.head = this.head.next;
          this.head.prev = null;
        } else if (current === this.tail) {
          this.tail = this.tail.prev;
          this.tail.next = null;
        } else {
          // 中间的节点
          current.prev.next = current.next;
          current.next.prev = current.prev;
        }
        return true;
      }
      // 继续往后面找
      current = current.next; // 指针指向下一个节点
    }
  }
}

const dll = new DoubleLinkedList();
// 添加节点
dll.add("Node 1");
dll.add("Node 2");
dll.add("Node 3");
dll.add("Node 4");
dll.add("Node 5");

dll.addAt(0, "Node 6");

dll.addAt(2, "Node 7");
dll.print();
dll.remove("Node 2");
dll.print();
```

双向链表基本上和单向是差不太多，注意很多方法其实主要就是多了一个针对 prev 的操作。



## 树

只要是有需要维护 **<u>有层级关系</u>** 的数据，那么树就是一个很好的选择。

- DOM树
- 组件树
- 菜单树
- ...

树其实有很多的分类，无论怎么分类，都有一些共同的特性：

- 除了根节点，所有节点都 **<u>有一个父节点</u>**。
- 每个节点都可以有若干子节点。
  - 如果一个节点没有子节点，也就是说它不是任何节点的父节点，那么我们称之为**<u>叶子节点</u>**（Leaf Node）
- 一个节点所拥有的叶子节点的个数，称之为该节点的度（degree），叶子节点的度为 0
- 一颗树的度，取决于树中所有节点的度的最大值。

前端这边用的比较多的就是二叉树，每个节点最多只有两个子节点，二叉树的度 2.

二叉树又可以分类

如果是关注节点的是否有序排列，那么二叉树可以分为：

- 二叉搜索树（BST）
  - 平衡二叉搜索树（AVL）
  - 红黑树（R/B Tree）

如果关注的是树的形状，二叉树下面还有

- 完全二叉树：所谓完全二叉树，指的是一颗树在进行数据的填充的时候，遵循的是“从左往右，从上往下”，除了最后一层，其他层都会被完全填满，并且所有的节点都尽可能的集中在左侧。

例如下面的图，都是完全二叉树：

![image-20221230135524942](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-30-055525.png)

下面的图，就不是完全二叉树：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-30-055856.png" alt="image-20221230135856627" style="zoom:50%;" />

针对完全二叉树，有一个应用，就是最大堆和最小堆。

- 最大堆：父节点的数值大于或者等于所有的子节点
- 最小堆：刚好相反，父节点的数值小于或者等于所有的子节点

最大堆的示例

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-30-060219.png" alt="image-20221230140218584" style="zoom:50%;" />

最小堆的示例

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-30-060339.png" alt="image-20221230140339328" style="zoom:50%;" />

关于这种最大堆或者最小堆（完全二叉树），仍然是可以使用数组的方式来存储：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-30-061555.png" alt="image-20221230141555180" style="zoom:50%;" />

通过数组，我们可以非常方便的找到一个节点的所有亲属

- 父节点：Math.floor((当前节点下标 - 1) / 2)
- 左子节点：当前节点下标 * 2 + 1
- 右子节点：当前节点下标 * 2 + 2



在 React 中，就是使用最小堆来管理和调度任务的优先级。

在 React 源码的 scheduler 下的 SchedulerMinHeap.js 文件中，总共有 6 个方法：

- push：暴露出去
- pop：暴露出去
- peek：暴露出去
- siftUp：内部方法
- siftDown：内部方法
- compare：内部方法

```js
// 先看暴露出去的三个方法的使用
type Task = {
  id: number,
  callback: Callback | null,
  priorityLevel: PriorityLevel,
  startTime: number,
  expirationTime: number,
  sortIndex: number,
  isQueued?: boolean,
};
var taskQueue: Array<Task> = [];
push(taskQueue, newTask); // 往任务队列里面推入一个新的任务
peek(taskQueue); // 从任务队列里面取一个最新的任务
pop(taskQueue); // 从任务队列中弹出一个任务
```

```js
export function peek<T: Node>(heap: Heap<T>): T | null {
  return heap.length === 0 ? null : heap[0];
}
```

```js
export function push<T: Node>(heap: Heap<T>, node: T): void {
  const index = heap.length; // 当前堆的任务数量
  heap.push(node); // 推入新的任务，默认是在数组的最后面
  siftUp(heap, node, index); // 向上调整
}
```

```js
function siftUp<T: Node>(heap: Heap<T>, node: T, i: number): void {
  let index = i; // 新添加的节点的索引值
  // 只要节点不是根节点，那么我们就进行调整
  while (index > 0) {
    // 首先获取到父节点的索引
    // >>> 1 就是除以 2
    // >> 和 >>> 的区别在于是有符号还是无符号的，>>> 代表无符号位移，前面空出来的部分始终填充 0
    const parentIndex = (index - 1) >>> 1;
    // 找到父节点
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}
```

