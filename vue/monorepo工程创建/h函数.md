> 类型: 章节 · 来源: [[vue/monorepo工程创建]] · 更新: 2026-09-23
>
> ---

## h函数

前面我们都是自己直接创建vnode对象，其实大家知道，vue中，我们可以通过h函数创建vnode虚拟dom对象，首先将源代码中`runtime-dom`打包，看看源代码中的h函数生成的对象是什么样子的。

```typescript
<script src="./runtime-dom.global.js"></script>
<script>
const {h} = VueRuntimeDOM;

let ele1 = h("div");
let ele2 = h("div","hello div");
let ele3 = h("div",[h("img")]);

console.log(ele1);
console.log(ele2);
console.log(ele3);
</script>
```

注意打印的结果，里面有一个属性**shapeFlag**

![image-20241115144519499](./assets/image-20241115144519499.png)

这个属性在源代码中如下（shared目录中）：

```typescript
export const enum ShapeFlags {
  ELEMENT = 1, // 1
  FUNCTIONAL_COMPONENT = 1 << 1,// 2
  STATEFUL_COMPONENT = 1 << 2,// 4
  TEXT_CHILDREN = 1 << 3, // 8
  ARRAY_CHILDREN = 1 << 4,// 16
  SLOTS_CHILDREN = 1 << 5,// 32
  TELEPORT = 1 << 6, // 64
  SUSPENSE = 1 << 7,// 128
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 256
  COMPONENT_KEPT_ALIVE = 1 << 9, // 512
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // 6
}
```

通过`|`**按位或运算**计算出h函数需要创建什么内容，比如

```typescript
  0001  ------------- 1
| 1000  ------------- 8
  ----
  1001  ------------- 9

  00001 ------------- 1
| 10000 ------------- 16
  -----
  10001 ------------- 17
```

在判断的时候，判断有没有包含可以用`&`**按位与**运算符，比如 9与1

```typescript
  1001  ------------- 9
& 0001  ------------- 1
  ----
  0001
```

得到结果1，这样,只要有值，可以表明组成关系，比如，如果是9与2

```typescript
  1001  ------------- 9
& 0010  ------------- 2
  ----
  0000
```

得到结果0，没有值，表明9与2没有组成关系

可以将ShapeFlags枚举放入到shared工程中，在`index.ts`中直接导出即可

```typescript
export * from "./shapeFlags";
```



接下来，首先创建`createVNode`函数，该函数的主要目的是创建虚拟节点对象vnode的基本雏形

```typescript
function createVNode(type: any, props: any, children: any) {
  const shapeFlags = isString(type) ? ShapeFlags.ELEMENT : 0;

  const vnode = {
    __v_isVnode: true, // 虚拟节点的标识
    type,
    props,
    children,
    component: null,
    el: null,
    key: props?.key,
    shapeFlags,
  };

  if (children) {
    if (Array.isArray(children)) {
      vnode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN;
    } else {
      vnode.shapeFlags |= ShapeFlags.TEXT_CHILDREN;
    }
  }
  return vnode;
}
```

创建h函数

```typescript
import { ShapeFlags, isString, isObject, isArray } from "@vue/shared";

export function h(type: any, props: any, children: any) {
  // 因为h函数可以传递2个，3个甚至3个以上参数，所以我们需要根据传递的参数不一样进行判断处理
  let l = arguments.length;
  if (l === 2) {
    if (isObject(props) && !isArray(props)) {
      // 判断是不是虚拟节点
      if (isVnode(props)) {
        // 如果是虚拟节点，那么props就是children
        return createVNode(type, null, [props]);
      }
      // 如果props不是虚拟节点，那么就是props属性
      return createVNode(type, props, null);
    } else {
      // 如果是文本节点，直接挂载
      return createVNode(type, null, props);
    }
  } else {
    if (l > 3) {
      // 如果参数大于3个，除了前面的参数，后面的参数都是children，所以需要转换成数组
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVnode(children)) {
      // 如果参数等于3个，且children是虚拟节点
      children = [children];
    }
    return createVNode(type, props, children);
  }
}

function isVnode(value: any) {
  return value?.__v_isVnode;
}
```

当然别忘记在index.ts文件中导出h函数

重新打包之后，测试：

```typescript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
  <script src="./runtime-core.global.js"></script>
  <script >
    const {options, createRenderer, h} = VueRuntimeCore;

    let ele1 = h("div");
    let ele2 = h("div","hello div");
    let ele3 = h("div",[h("img")]);

    console.log(ele1);
    console.log(ele2);
    console.log(ele3);

    // const oldVNode = {
    //   type: "div",
    //   children: [
    //     { type: "p", children: "1", key: 1 },
    //     { type: "p", children: "2", key: 2 },
    //     { type: "p", children: "3", key: 3 },
    //     { type: "p", children: "4", key: 4 },
    //     { type: "p", children: "6", key: 6 },
    //     { type: "p", children: "5", key: 5 },
    //   ],
    // };

    const oldVNode = h("div",[
      h("p",{key:1},"1"),
      h("p",{key:2},"2"),
      h("p",{key:3},"3"),
      h("p",{key:4},"4"),
      h("p",{key:6},"6"),
      h("p",{key:5},"5"),
    ])

    // const newVNode = {
    //   type: "div",
    //   children: [
    //     { type: "p", children: "1", key: 1 },
    //     { type: "p", children: "3", key: 3 },
    //     { type: "p", children: "4", key: 4 },
    //     { type: "p", children: "2", key: 2 },
    //     { type: "p", children: "7", key: 7 },
    //     { type: "p", children: "5", key: 5 },
    //   ],
    // };

    const newVNode = h("div",[
      h("p",{key:1},"1"),
      h("p",{key:3},"3"),
      h("p",{key:4},"4"),
      h("p",{key:2},"2"),
      h("p",{key:7},"7"),
      h("p",{key:5},"5"),
    ])

    const nodeOps = options;

    const renderer = createRenderer(nodeOps);
    // 首次挂载
    renderer.render(oldVNode, document.getElementById("app"));

    // 1秒后更新
    setTimeout(() => {
      renderer.render(newVNode, document.getElementById("app"));
    }, 1000);
  </script>
</html>

```

同时，我们之前判断节点类型的代码，其实也就可以通过`shapeFlags`来进行判断

```typescript
function patchChildren(oldVNode:VNode, newVNode:VNode, container:any) {
  const prevShapeFlag = oldVNode ? oldVNode.shapeFlags : 0
  const shapeFlag = newVNode.shapeFlags

  // 新子节点的类型是文本节点
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // 如果旧子节点是一组子节点，循环遍历并且卸载
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      (oldVNode.children as any).forEach((child:any) => {
        unmount(child);
      });
    }

    // 如果旧子节点是文本节点或者没有子节点，直接更新文本内容
    setElementText(container, newVNode.children as string);
  }
  // 新子节点的类型是数组，也就是一组子节点
  else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    patchKeyedChildren(oldVNode, newVNode, container);
  }
  // 新子节点不存在
  else {
    // 如果运行到这里，说明新子节点不存在
    // 如果旧子节点是一组子节点，循环遍历并且卸载
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      (oldVNode.children as any).forEach((child:any) => {
        unmount(child);
      });
    }
    // 如果旧子节点是文本节点,直接清空
    else if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      setElementText(container, "");
    }
  }
}
```
