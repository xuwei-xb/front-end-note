function Node(value) {
  this.value = value;
  this.next = null;
}
// 为方面查看，添加一个打印方法
Node.prototype.print = function () {
  let n = this;
  let str = '';
  while (n) {
    str += n.value;
    n.next && (str += '->');
    n = n.next;
  }
  console.log(str);
};

// 链表逆置方法
function reverse(node) {
  if(!node) return false
  if(!node.next) return node
  let newHead = reverse(node.next)
  node.next.next = node
  node.next = null
  
  return newHead
}
// 创建节点的辅助方法
function createLinkedList(...arr) {
  if (arr.length === 0) {
    return null;
  }
  var root = new Node(arr[0]);
  var node = root;
  for (var i = 1; i < arr.length; i++) {
    node.next = new Node(arr[i]);
    node = node.next;
  }
  return root;
}
// 测试
// var root = createLinkedList(1, 2, 3, 4, 5);
// root.print();

// var newRoot = reverse(root);
// newRoot.print();
// 选择排序
function selectSort (arr) {
  const n = arr.length
  for(let i = 0; i < n -1; i++) {
    let minIndex = i
    for(let j = i + 1; j < n ; j++) {
      if(arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    if(minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}

// console.log(selectSort([1,3,2,5,4]));
// 简单快速排序
function quickSort (arr) {
  if(!arr || arr.length <= 1) return arr
  let left = []
  let right = []
  let equl = []
  for(let i = 0; i < arr.length; i ++) {
    if(arr[i] > arr[0]) {
      right.push(arr[i])
    } else if (arr[i] < arr[0]) {
      left.push(arr[i])
    } else {
      equl.push(arr[i])
    }
  }
  return [...quickSort(left), ...equl, ...quickSort(right)]
}
// console.log(quickSort([9,0,1,4,3,2]));
function Node(value) {
  this.value = value;
  this.left = null;
  this.right = null;
}

var a = new Node("a");
var b = new Node("b");
var c = new Node("c");
var d = new Node("d");
var e = new Node("e");
var f = new Node("f");
var g = new Node("g");

a.left = c;
a.right = b;
c.left = f;
c.right = g;
b.left = d;
b.right = e;

function f1(root) {
  if (root == null) return;
  console.log(root.value);
  f1(root.left);
  f1(root.right);
}

// f1(a);
function* generator() {
  setTimeout(() => {
    console.log('g1','0');
  }, 0)
  console.log('g1', '1');
  let result = yield Promise.resolve(1);
  console.log('g1', '2', result);
  result = yield Promise.resolve(2);
  console.log('g1', '3', result);
  result = yield Promise.resolve(3);
  console.log('g1', '4', result);
}
function* generator2() {
  console.log('g2', 0);
  let result = yield 1;
  result = yield* generator();
  console.log('g2', 1, result);
  result = yield 2;
  console.log('g2', 2, result);
  result = yield 3;
  console.log('g2', 3, result);
}
// const gen = generator2();


const gen = generator();

function runGenerator(prevResult) {
  const { value: promise, done } = gen.next(prevResult);
  if (done) return;
  promise.then(res => {
    runGenerator(res); // 递归调用，将结果传递给下一次 next()
  });
}

// runGenerator(); // 启动生成器





