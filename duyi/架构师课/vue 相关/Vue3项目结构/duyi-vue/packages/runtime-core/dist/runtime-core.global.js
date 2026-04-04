var VueRuntimeCore = (function (exports) {
  'use strict';

  // 自定义守卫，`形参 is 类型`的语法结构
  const isObject = (val) => {
      return val !== null && typeof val === 'object';
  };
  const isString = (val) => {
      return typeof val === 'string';
  };
  const isFunction = (val) => {
      return typeof val === 'function';
  };
  // 空函数
  const NOOP = () => { };
  const isArray = Array.isArray;
  // 通过Object.is来判断两个值是否相等,框架可以避免一些特殊情况
  // 比如NaN和NaN是相等的，而Object.is(NaN, NaN)是true
  // +0和-0是不相等的，而Object.is(+0, -0)是false
  const hasChanged = (value, oldValue) => {
      return !Object.is(value, oldValue);
  };
  const isSymbol = (val) => {
      return typeof val === 'symbol';
  };
  const extend = Object.assign;
  // 判断一个key是否是一个合法的整数类型的字符串
  const isIntegerKey = (key) => {
      return isString(key) && // 检查key是否是字符串
          key !== 'NaN' && // 确保key不是NaN字符串
          key[0] !== '-' && // 确保key不是负数
          '' + parseInt(key, 10) === key; // 确保key是一个可以被转换为整数的合法字符串
  };
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, // 判断的对象
  key // 判断的key
  ) => hasOwnProperty.call(val, key);
  // 以on开头的正则
  const onRE = /^on[^a-z]/;
  // 判断字符串是否以on开头
  const isOn = (key) => onRE.test(key);

  const Text = Symbol("Text"); // 文本类型Symbol
  const Comment = Symbol("Comment"); // 注释类型Symbol
  const Fragment = Symbol("Fragment"); // 片段类型Symbol
  function normalizeClass(value) {
      let res = "";
      if (isString(value)) {
          res = value;
      }
      else if (isArray(value)) {
          for (let i = 0; i < value.length; i++) {
              const normalized = normalizeClass(value[i]);
              if (normalized) {
                  res += normalized + " ";
              }
          }
      }
      else if (isObject(value)) {
          for (const name in value) {
              if (value[name]) {
                  res += name + " ";
              }
          }
      }
      return res.trim();
  }
  function shouldSetAsProps(el, key, value) {
      // 特殊处理
      if (key === "form" && el.tagName === "INPUT")
          return false;
      // 兜底
      return key in el;
  }
  const options = {
      createElement(tag) {
          return document.createElement(tag);
      },
      // 用于设置元素的文本节点
      setElementText(el, text) {
          el.textContent = text;
      },
      // 用于在给定的 parent 下添加指定元素
      insert(el, parent, anchor = null) {
          //在anchor之前插入 newNode(el) 的节点。
          // 如果为 null，newNode(el) 将被插入到节点的子节点列表末尾
          parent.insertBefore(el, anchor);
      },
      patchProps(el, key, prevValue, nextValue) {
          if (isOn(key)) {
              const eventName = key.slice(2).toLowerCase();
              // 定义el._vei为一个对象，这样就很方便的做到事件名称和对应函数的映射
              const invokers = el._vei || (el._vei = {});
              // 根据事件名称获取对应的函数
              let invoker = invokers[key];
              if (nextValue) {
                  if (!invoker) {
                      invoker = el._vei[key] = (e) => {
                          // 如果时间发生事件，早于事件处理函数的绑定事件，就不执行
                          if (e.timeStamp < invoker.attached)
                              return;
                          // 如果invoker.value是数组，那么就遍历数组，依次执行
                          if (Array.isArray(invoker.value)) {
                              invoker.value.forEach((fn) => fn(e));
                          }
                          else {
                              invoker.value(e);
                          }
                      };
                      invoker.value = nextValue;
                      // 添加attached属性，存储时间处理函数被绑定的时间
                      invoker.attached = performance.now();
                      el.addEventListener(eventName, invoker);
                  }
                  else {
                      invoker.value = nextValue;
                  }
              }
              else if (invoker) {
                  el.removeEventListener(eventName, invoker);
              }
          }
          else if (key === "class") {
              el.className = nextValue || "";
          }
          else if (shouldSetAsProps(el, key)) {
              // 判断该DOM Properties的类型
              const type = typeof el[key];
              // 如果是布尔类型，并且value是空字符串'',那么就是设置为true
              if (type === "boolean" && nextValue === "") {
                  el[key] = true;
              }
              else {
                  el[key] = nextValue;
              }
          }
          else {
              // 如果key不存在在DOM Properties上，那么就是setAttribute
              el.setAttribute(key, nextValue);
          }
      },
      // 文本类型
      createText(text) {
          return document.createTextNode(text);
      },
      setText(el, text) {
          el.textContent = text;
      },
      // 注释内容
      createComment(text) {
          return document.createComment(text);
      },
  };
  function createRenderer(options) {
      // 通过 options 得到操作 DOM 的 API
      const { createElement, insert, setElementText, patchProps, createText, setText, createComment, } = options;
      function patchElement(oldVNode, newVNode) {
          const el = (newVNode.el = oldVNode.el), oldProps = oldVNode.props, newProps = newVNode.props;
          // 更新Props
          for (const key in newProps) {
              if (newProps[key] !== oldProps[key]) {
                  patchProps(el, key, oldProps[key], newProps[key]);
              }
          }
          for (const key in oldProps) {
              if (!(key in newProps)) {
                  patchProps(el, key, oldProps[key], null);
              }
          }
          // 更新子节点
          patchChildren(oldVNode, newVNode, el);
      }
      function patchChildren(oldVNode, newVNode, container) {
          // 新子节点的类型是文本节点
          if (typeof newVNode.children === "string") {
              // 如果旧子节点是一组子节点，循环遍历并且卸载
              if (Array.isArray(oldVNode.children)) {
                  oldVNode.children.forEach((child) => {
                      unmount(child);
                  });
              }
              // 如果旧子节点是文本节点或者没有子节点，直接更新文本内容
              setElementText(container, newVNode.children);
          }
          // 新子节点的类型是数组，也就是一组子节点
          else if (Array.isArray(newVNode.children)) {
              patchKeyedChildren(oldVNode, newVNode, container);
          }
          // 新子节点不存在
          else {
              // 如果运行到这里，说明新子节点不存在
              // 如果旧子节点是一组子节点，循环遍历并且卸载
              if (Array.isArray(oldVNode.children)) {
                  oldVNode.children.forEach((child) => {
                      unmount(child);
                  });
              }
              // 如果旧子节点是文本节点,直接清空
              else if (typeof oldVNode.children === "string") {
                  setElementText(container, "");
              }
          }
      }
      function patchKeyedChildren(oldVNode, newVNode, container) {
          const oldChildren = oldVNode.children;
          const newChildren = newVNode.children;
          // 处理相同的前置节点，索引j指向新旧两组子节点的开头
          let j = 0;
          let oldVN = oldChildren[j];
          let newVN = newChildren[j];
          // while循环向后遍历，直到遇到拥有不同Key值的节点为止
          while (oldVN.key === newVN.key) {
              // 调用patch函数更新
              patch(oldVN, newVN, container);
              // 更新索引j，递增+1
              j++;
              oldVN = oldChildren[j];
              newVN = newChildren[j];
              if (!oldVN || !newVN)
                  break;
          }
          // 更新相同的后置节点
          let oldEnd = oldChildren.length - 1;
          let newEnd = newChildren.length - 1;
          oldVN = oldChildren[oldEnd];
          newVN = newChildren[newEnd];
          // while循环从后往前遍历，直到遇到不同key值的节点为止
          while (oldVN.key === newVN.key) {
              // 调用patch函数更新
              patch(oldVN, newVN, container);
              // 递减索引
              oldEnd--;
              newEnd--;
              oldVN = oldChildren[oldEnd];
              newVN = newChildren[newEnd];
              if (!oldVN || !newVN)
                  break;
          }
          // 满足下面的条件，说明j和newEnd之间的节点需要作为新节点插入
          if (j > oldEnd && j <= newEnd) {
              // 插入的锚点索引
              const anchorIndex = newEnd + 1;
              // 锚点元素，如果锚点索引 >= 新子节点的长度 说明不需要插入，直接挂载到尾部即可
              const anchor = anchorIndex < newChildren.length
                  ? newChildren[anchorIndex].el
                  : null;
              // while循环，如果有多个，逐个挂载
              while (j <= newEnd) {
                  patch(null, newChildren[j++], container, anchor);
              }
          }
          else if (j > newEnd && j <= oldEnd) {
              while (j <= oldEnd) {
                  unmount(oldChildren[j++]);
              }
          }
          else {
              // 新子节点中剩余未处理节点的数量
              const count = newEnd - j + 1;
              if (count <= 0)
                  return;
              const source = new Array(count);
              source.fill(-1);
              // 新旧节点的起始索引
              const oldStart = j;
              const newStart = j;
              // 构建索引表
              const keyIndex = {};
              // 新增变量moved和pos
              let moved = false;
              let pos = 0;
              // 新增patched变量，表示更新过的节点数量
              let patched = 0;
              // 索引表中填入键值
              for (let i = newStart; i <= newEnd; i++) {
                  keyIndex[newChildren[i].key] = i;
              }
              // 遍历旧节点中未处理的键值
              for (let i = oldStart; i <= oldEnd; i++) {
                  oldVN = oldChildren[i];
                  // 如果更新过的节点数量<=需要更新的节点数量，执行更新
                  if (patched <= count) {
                      // 通过索引表快速找到新子节点中具有相同key值的节点位置
                      const k = keyIndex[oldVN.key];
                      if (typeof k !== "undefined") {
                          // 找到了具有相同key值的节点
                          newVN = newChildren[k];
                          patch(oldVN, newVN, container);
                          // 填充source数组
                          source[k - newStart] = i;
                          // 判断节点是否需要移动
                          if (k < pos) {
                              moved = true;
                          }
                          else {
                              pos = k;
                          }
                      }
                      else {
                          // 没有找到,卸载旧节点
                          unmount(oldVN);
                      }
                  }
                  else {
                      unmount(oldVN);
                  }
              }
              if (moved) {
                  const seq = lis(source);
                  // s 指向最长递增子序列的最后一个元素
                  let s = seq.length - 1;
                  // i 指向新的一组子节点的最后一个元素
                  let i = count - 1;
                  // for 循环 i 递减
                  for (; i >= 0; i--) {
                      if (source[i] === -1) {
                          // 该节点在新子节点中的真实位置索引
                          const pos = i + newStart;
                          const newVN = newChildren[pos];
                          // 该节点的下一个节点的位置索引
                          const nextPos = pos + 1;
                          // 锚点
                          const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;
                          patch(null, newVN, container, anchor);
                      }
                      else if (i !== seq[s]) {
                          // 如果节点索引i不等于seq[s]的值，说明该节点需要移动
                          // 该节点在新的一组子节点中真实位置索引
                          const pos = i + newStart;
                          const newVN = newChildren[pos];
                          // 该节点的下一个节点位置索引
                          const nextPos = pos + 1;
                          // 锚点
                          const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;
                          // 移动
                          insert(newVN.el, container, anchor);
                      }
                      else {
                          // 当i===seq[s]时，说明该位置的节点不需要移动
                          // 只需要让s指向下一个位置
                          s--;
                      }
                  }
              }
          }
      }
      function mountElement(vnode, container, anchor) {
          // 让 vnode.el 引用真实 DOM 元素
          const el = (vnode.el = createElement(vnode.type));
          if (typeof vnode.children === "string") {
              // 如果子节点是字符串，说明它是文本节点
              setElementText(el, vnode.children);
          }
          else if (Array.isArray(vnode.children)) {
              // 如果子节点是数组，说明它是多个子节点，遍历子节点，并且通过patch挂载它们
              vnode.children.forEach((child) => {
                  patch(null, child, el);
              });
          }
          // 如果存在props属性，遍历props属性，并且将其设置到el上
          if (vnode.props) {
              for (const key in vnode.props) {
                  const value = vnode.props[key];
                  patchProps(el, key, null, value);
              }
          }
          insert(el, container, anchor);
      }
      function patch(oldVNode, newVNode, container, anchor = null) {
          if (oldVNode && oldVNode.type !== newVNode.type) {
              // 如果新旧 vnode 的类型不同，则直接将旧 vnode 卸载
              unmount(oldVNode);
              oldVNode = null;
          }
          const { type } = newVNode;
          // 如果类型是字符串，说明描述的是普通标签
          if (typeof type === "string") {
              // 如果旧节点不存在，就意味着是挂载，调用mountElement函数完成挂载
              if (!oldVNode) {
                  mountElement(newVNode, container, anchor);
              }
              else {
                  // 如果oldVNode存在，意味着更新，暂时省略......
                  console.log("打补丁");
                  patchElement(oldVNode, newVNode);
              }
          }
          else if (type === Text) {
              // 如果没有旧节点，直接进行挂载
              if (!oldVNode) {
                  // 创建文本节点
                  const el = (newVNode.el = createText(newVNode.children));
                  // 插入文本节点
                  insert(el, container);
              }
              else {
                  // 如果新旧节点都存在，更新文本内容
                  const el = (newVNode.el = oldVNode.el);
                  if (newVNode.children !== oldVNode.children) {
                      setText(el, newVNode.children);
                  }
              }
          }
          else if (type === Comment) {
              // 如果没有旧节点，直接进行挂载
              if (!oldVNode) {
                  // 创建注释节点
                  const el = (newVNode.el = createComment(newVNode.children));
                  // 插入注释节点
                  insert(el, container);
              }
              else {
                  // 如果新旧节点都存在，更新注释内容
                  const el = (newVNode.el = oldVNode.el);
                  if (newVNode.children !== oldVNode.children) {
                      setText(el, newVNode.children);
                  }
              }
          }
          else if (type === Fragment) {
              if (!oldVNode) {
                  // 如果旧vnode不存在，那么就是将Fragment的children逐个直接挂载
                  newVNode.children.forEach((child) => patch(null, child, container));
              }
              else {
                  // 如果旧vnode存在，那么就是更新Fragment的children
                  // 我们可以直接调用patchChildren函数
                  patchChildren(oldVNode, newVNode, container);
              }
          }
          else if (typeof type === "object") {
              // todo:组件
              console.log("组件处理");
          }
          else {
              // todo:未知类型
              console.log("未知类型");
          }
      }
      function unmount(vnode) {
          // 卸载时，如果卸载的是Fragment，那么就需要递归卸载children
          if (vnode.type === Fragment) {
              vnode.children.forEach((child) => unmount(child));
              return;
          }
          const parent = vnode.el.parentNode;
          if (parent) {
              parent.removeChild(vnode.el);
          }
      }
      function render(vnode, container) {
          if (vnode) {
              // 如果新vnode存在，将其与旧vnode一起传递给patch函数，进行更新(打补丁)
              patch(container._vnode, vnode, container);
          }
          else {
              if (container._vnode) {
                  unmount(container._vnode);
              }
          }
          // 将vnode存储到container._vnode下，在后续的渲染中代表旧的vnode
          container._vnode = vnode;
      }
      return {
          render,
      };
  }
  function lis(arr) {
      // 用于记录每个位置的前驱索引，以便最后重建序列
      const p = arr.slice();
      // 存储当前找到的最长递增子序列的索引
      const result = [0];
      // 声明循环变量和辅助变量
      let i, j, u, v, c;
      // 获取输入数组的长度
      const len = arr.length;
      // 遍历输入数组
      for (i = 0; i < len; i++) {
          const arrI = arr[i];
          // 忽略值为 0 的元素（Vue源码中的diff算法对0有特定处理）
          if (arrI !== 0) {
              // 获取当前最长序列中最后一个元素的索引
              j = result[result.length - 1];
              // 贪心算法部分：如果当前元素大于当前最长序列的最后一个元素，直接添加
              if (arr[j] < arrI) {
                  // 记录当前元素的前驱索引为 j
                  p[i] = j;
                  // 将当前元素的索引添加到 result 中
                  result.push(i);
                  continue;
              }
              // 二分查找部分：在 result 中寻找第一个大于等于 arrI 的元素位置
              u = 0;
              v = result.length - 1;
              while (u < v) {
                  // 取中间位置
                  c = ((u + v) / 2) | 0;
                  // 比较中间位置的值与当前值
                  if (arr[result[c]] < arrI) {
                      // 如果中间值小于当前值，搜索区间缩小到 [c + 1, v]
                      u = c + 1;
                  }
                  else {
                      // 否则，搜索区间缩小到 [u, c]
                      v = c;
                  }
              }
              // 如果找到的值大于当前值，进行替换
              if (arrI < arr[result[u]]) {
                  // 如果 u 不为 0，记录前驱索引
                  if (u > 0) {
                      p[i] = result[u - 1];
                  }
                  // 更新 result 中的位置 u 为当前索引 i
                  result[u] = i;
              }
          }
      }
      // 重建最长递增子序列
      u = result.length;
      v = result[u - 1];
      while (u-- > 0) {
          // 将索引替换为对应的前驱索引
          result[u] = v;
          v = p[v];
      }
      // 返回最长递增子序列的索引数组
      return result;
  }
  function createVNode(type, props, children) {
      const shapeFlags = isString(type) ? 1 /* ShapeFlags.ELEMENT */ : 0;
      const vnode = {
          __v_isVnode: true, // 虚拟节点的标识
          type,
          props,
          children,
          component: null,
          el: null,
          key: props === null || props === void 0 ? void 0 : props.key,
          shapeFlags,
      };
      if (children) {
          if (Array.isArray(children)) {
              vnode.shapeFlags |= 16 /* ShapeFlags.ARRAY_CHILDREN */;
          }
          else {
              vnode.shapeFlags |= 8 /* ShapeFlags.TEXT_CHILDREN */;
          }
      }
      return vnode;
  }
  function h(type, props, children) {
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
          }
          else {
              // 如果是文本节点，直接挂载
              return createVNode(type, null, props);
          }
      }
      else {
          if (l > 3) {
              // 如果参数大于3个，除了前面的参数，后面的参数都是children，所以需要转换成数组
              children = Array.prototype.slice.call(arguments, 2);
          }
          else if (l === 3 && isVnode(children)) {
              // 如果参数等于3个，且children是虚拟节点
              children = [children];
          }
          return createVNode(type, props, children);
      }
  }
  function isVnode(value) {
      return value === null || value === void 0 ? void 0 : value.__v_isVnode;
  }

  const ITERATE_KEY$1 = Symbol("");
  function isEffect(fn) {
      return fn && fn._isEffect === true;
  }
  let activeEffect;
  let effectStack = [];
  let targetMap = new WeakMap();
  let shouldTrack = true;
  function pauseTracking() {
      shouldTrack = false;
  }
  function enableTracking() {
      shouldTrack = true;
  }
  function track(target, type, key) {
      // 暂停依赖收集开关，没有activeEffect或者shouldTrack为false时，不进行依赖收集
      if (!shouldTrack || activeEffect === undefined) {
          return;
      }
      console.log(`依赖收集：【${type}】 ${String(key)}属性被读取了`);
      // 1. 根据target从buckets中获取对应的Map，保存的类型是key---effects的键值对
      let depsMap = targetMap.get(target);
      // 如果depsMap不存在，则初始化一个depsMap
      if (!depsMap) {
          targetMap.set(target, (depsMap = new Map()));
      }
      // 2.根据key从depsMap中获取对应的Set，保存的是副作用函数
      let deps = depsMap.get(key);
      if (!deps) {
          depsMap.set(key, (deps = new Set()));
      }
      // 3.将副作用函数添加到deps中
      deps.add(activeEffect);
      // 将上面deps 集合的内容挂载到activeEffect.deps
      activeEffect.deps.push(deps);
  }
  function trigger(target, type, key, newValue, oldValue) {
      console.log(`触发更新：【${type}】 ${String(key)}属性被修改了`);
      // 根据target从buckets中获取对应的depsMap
      const depsMap = targetMap.get(target);
      // 如果depsMap不存在，则直接返回
      if (!depsMap) {
          return;
      }
      // 根据key从depsMap中获取对应的deps----> effects
      depsMap.get(key);
      // 依次执行deps中的副作用函数
      // 为了避免无限循环，这里可以新建一个Set对象
      const effects = new Set();
      const add = (effectsToAdd) => {
          if (effectsToAdd) {
              effectsToAdd.forEach((effect) => {
                  if (effect !== activeEffect) {
                      effects.add(effect);
                  }
              });
          }
      };
      if (key === "length" && isArray(target)) {
          depsMap.forEach((dep, key) => {
              if (key === "length" || key >= newValue) {
                  add(dep);
              }
          });
      }
      else {
          // 在vue3源码中使用void 0 替代undefined
          // 在框架中需要避免一些极端情况，比如ES5之前，undefined不是一个保留字，是可以被重写的
          if (key !== void 0) {
              add(depsMap.get(key));
          }
          // ADD 操作 会影响for...in循环迭代，也会隐式的影响数组长度，这些都需要触发更新
          // DELETE 操作 会影响for...in循环迭代,需要触发更新
          // 注意 delete arr[1],只是设置数组的值为undefined，并不会触发数组长度的更新
          switch (type) {
              case "ADD" /* TriggerOpTypes.ADD */:
                  // 如果不是数组，说明是需要迭代的对象
                  if (!isArray(target)) {
                      add(depsMap.get(ITERATE_KEY$1));
                  }
                  // key是一个整数类型的字符串,证明是数组，需要触发length属性
                  else if (isIntegerKey(key)) {
                      add(depsMap.get("length"));
                  }
                  break;
              case "DELETE" /* TriggerOpTypes.DELETE */:
                  // 如果不是数组，说明是需要迭代的对象
                  if (!isArray(target)) {
                      add(depsMap.get(ITERATE_KEY$1));
                  }
                  break;
          }
      }
      effects.forEach((effect) => {
          if (effect.options.scheduler) {
              effect.options.scheduler(effect);
          }
          else {
              effect();
          }
      });
  }
  function createReactiveEffect(fn, options = {}) {
      const effect = function reactiveEffect() {
          if (!effectStack.includes(effect)) {
              // 先进行清理
              cleanup(effect);
              try {
                  // 当effectFn执行时，将其设置为当前激活的副作用函数
                  activeEffect = effect;
                  // 在调用副作用函数之前，将其压入effectStack栈中
                  effectStack.push(effect);
                  // 执行副作用函数,结果保存在res中
                  const res = fn();
                  // 返回结果
                  return res;
              }
              finally {
                  // 在调用副作用函数之后，将其从effectStack栈中弹出
                  effectStack.pop();
                  // activeEffect始终指向当前effectStack栈顶的副作用函数
                  activeEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      // 将options挂载到effectFn上
      effect.options = options;
      // 在effectFn函数上又挂载了deps数组，目的是在收集依赖时可以临时记录依赖关系
      // 在effectFn函数上挂载，其实就相当于挂载在activeEffect
      effect.deps = [];
      // 如果发生了effect嵌套，直接将内部的fn函数给到effect.raw
      effect._isEffect = true;
      effect.raw = fn;
      return effect;
  }
  function effect(fn, options = {}) {
      // 如果fn是一个副作用函数，则直接取其raw属性
      if (isEffect(fn)) {
          fn = fn.raw;
      }
      // 创建一个副作用函数
      const effect = createReactiveEffect(fn, options);
      // 只有非lazy的情况，才会立即执行副作用函数
      if (!options.lazy) {
          effect();
      }
      // 将副作用函数作为返回值返回
      return effect;
  }
  function cleanup(effect) {
      const { deps } = effect;
      if (deps.length) {
          for (let i = 0; i < deps.length; i++) {
              deps[i].delete(effect);
          }
          deps.length = 0;
      }
  }

  // 用来表示对象的"迭代依赖"标识
  const ITERATE_KEY = Symbol('');
  const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
      .map(key => Symbol[key])
      .filter(isSymbol));
  // 通过对象存储改动之后的数组方法，进行统一管理
  const arrayInstrumentations = {};
  ['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
      // 首先获取原生方法的引用
      const method = Array.prototype[key];
      arrayInstrumentations[key] = function (...args) {
          // 首先将this转化为非响应式(代理)对象
          const arr = toRaw(this);
          // 遍历当前数组的每个索引，通过track函数对数组索引进行依赖收集
          for (let i = 0, l = this.length; i < l; i++) {
              track(arr, "GET" /* TrackOpTypes.GET */, i + '');
          }
          // 直接在原始对象中查找,使用原始数组和参数
          const res = method.apply(arr, args);
          if (res === -1 || res === false) {
              // 如果在原始数组中没有找到，注意，还需要进行处理，因为参数也有可能是响应式的
              return method.apply(arr, args.map(toRaw));
          }
          else {
              return res;
          }
      };
  });
  ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(key => {
      // 获取到原生的方法
      const method = Array.prototype[key];
      arrayInstrumentations[key] = function (...args) {
          pauseTracking();
          const res = method.apply(this, args);
          enableTracking();
          return res;
      };
  });
  function createGetter(isReadonly = false, shallow = false) {
      return function get(target, key, receiver) {
          if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
              return true;
          }
          else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
              return isReadonly;
          }
          else if (key === "__v_raw" /* ReactiveFlags.RAW */ // 当代理对象访问__v_raw属性时，返回原始对象
              && receiver === (isReadonly ? readonlyMap : reactiveMap).get(target) // 确保请求原始对象的访问是代理对象发起的
          ) {
              return target;
          }
          const targetIsArray = isArray(target);
          if (targetIsArray && arrayInstrumentations.hasOwnProperty(key)) {
              return Reflect.get(arrayInstrumentations, key, receiver);
          }
          // 返回对象的相应属性值
          const result = Reflect.get(target, key, receiver);
          const keyIsSymbol = isSymbol(key);
          if (keyIsSymbol
              ? builtInSymbols.has(key)
              : key === '__proto__') {
              return result;
          }
          // todo: 收集依赖
          // 只有非只读的才会进行依赖收集
          if (!isReadonly) {
              track(target, "GET" /* TrackOpTypes.GET */, key);
          }
          // 如果只是浅层代理，直接返回结果
          if (shallow) {
              return result;
          }
          // 如果是对象，再次进行递归代理
          if (isObject(result)) {
              return isReadonly ? readonly(result) : reactive(result);
          }
          return result;
      };
  }
  function createSetter(shallow = false) {
      return function set(target, key, value, receiver) {
          let oldValue = target[key];
          // 判断动作是ADD还是SET
          // 如果目标是数组，并且key是一个有效的数组索引，需要判断key是否小于数组长度
          // 如果目标是普通对象或者其他非数组对象，判断对象是否有这个key
          // const hadKey = 如果是数组，并且key是一个有效的数组索引 ？
          //    key 是否小于数组的长度(小于Set操作，大于Add操作)
          //    : 不是数组直接判断是否有这个key属性(有Set操作，没有Add操作)
          const hadKey = isArray(target) && isIntegerKey(key)
              ? Number(key) < target.length
              : hasOwn(target, key);
          const result = Reflect.set(target, key, value, receiver);
          if (target === toRaw(receiver)) {
              if (!hadKey) { // ADD操作
                  trigger(target, "ADD" /* TriggerOpTypes.ADD */, key, value);
              }
              else if (hasChanged(value, oldValue)) { // SET操作
                  trigger(target, "SET" /* TriggerOpTypes.SET */, key, value);
              }
          }
          return result;
      };
  }
  const get = /*#__PURE__*/ createGetter();
  const readonlyGet = /*#__PURE__*/ createGetter(true);
  const shallowGet = /*#__PURE__*/ createGetter(false, true);
  const set = /*#__PURE__*/ createSetter();
  const shallowSet = /*#__PURE__*/ createSetter(true);
  // function get(target: object, key: string | symbol, receiver: object): any { 
  //   if (key === ReactiveFlags.IS_REACTIVE) {
  //     return true;
  //   }
  //   else if (
  //     key === ReactiveFlags.RAW // 当代理对象访问__v_raw属性时，返回原始对象
  //     && receiver === targetMap.get(target) // 确保请求原始对象的访问是代理对象发起的
  //   ) { 
  //     return target;
  //   }
  //   const targetIsArray = isArray(target);
  //   if (targetIsArray && arrayInstrumentations.hasOwnProperty(key)) { 
  //     return Reflect.get(arrayInstrumentations, key, receiver);
  //   }
  //   // todo: 收集依赖
  //   track(target, TrackOpTypes.GET, key);
  //   // 返回对象的相应属性值
  //   const result = Reflect.get(target, key, receiver);
  //   // 如果是对象，再次进行递归代理
  //   if (isObject(result)) { 
  //     return reactive(result);
  //   }
  //   return result;
  // }
  // function set(target: Record<string | symbol, unknown>, key: string | symbol, value: unknown, receiver: object): boolean { 
  //   // todo: 触发更新
  //   // 判断动作是ADD还是SET，而且SET操作应该是值不一样的情况下再进行处理
  //   const hadKey = target.hasOwnProperty(key);
  //   const type = target.hasOwnProperty(key) ? TriggerOpTypes.SET : TriggerOpTypes.ADD;
  //   // ts注意object类型，target[key]如果直接这么写，ts会报错，元素有隐式的any类型
  //   // 这里可以直接将target修改为Record<string | symbol, unknown>
  //   let oldValue = target[key];
  //   // 如果是数组获取长度,首先获取的是修改之前的长度
  //   const oldLen = isArray(target) ? target.length : 0;
  //   // if (!hadKey) {
  //   //   trigger(target, TriggerOpTypes.ADD, key);
  //   // }
  //   // else if(hasChanged(value, oldValue)) { 
  //   //   trigger(target, TriggerOpTypes.SET, key);
  //   // }
  //   // 设置对象的相应属性值
  //   const result = Reflect.set(target, key, value, receiver);
  //   if (!result) { 
  //     return result;
  //   }
  //   // 修改之后的长度
  //   const newLen = isArray(target) ? target.length : 0;
  //   if (hasChanged(value, oldValue) || type === TriggerOpTypes.ADD) { 
  //     trigger(target, type, key);
  //     if (isArray(target) && oldLen !== newLen) { 
  //       if (key !== 'length') { 
  //         trigger(target, TriggerOpTypes.SET, 'length');
  //       }
  //       else {
  //         for(let i=newLen; i<oldLen; i++) { 
  //           trigger(target, TriggerOpTypes.DELETE, i + '');
  //         }
  //       }
  //     }
  //   }
  //   return result;
  // }
  function has(target, key) {
      // todo: 收集依赖
      track(target, "HAS" /* TrackOpTypes.HAS */, key);
      const result = Reflect.has(target, key);
      return result;
  }
  function ownKeys(target) {
      // 依赖收集
      track(target, "ITERATE" /* TrackOpTypes.ITERATE */, ITERATE_KEY);
      return Reflect.ownKeys(target);
  }
  function deleteProperty(target, key) {
      // 删除也判断是否属性存在
      const hadKey = target.hasOwnProperty(key);
      // 删除的结果
      const result = Reflect.deleteProperty(target, key);
      // 对象有这个属性，并且删除成功，触发更新
      if (hadKey && result) {
          trigger(target, "DELETE" /* TriggerOpTypes.DELETE */, key);
      }
      return result;
  }
  const mutableHandlers = {
      get,
      set,
      has,
      ownKeys,
      deleteProperty
  };
  const readonlyHandlers = {
      get: readonlyGet,
      set(target, key) {
          console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
          return true;
      },
      deleteProperty(target, key) {
          console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
          return true;
      }
  };
  extend({}, mutableHandlers, {
      get: shallowGet,
      set: shallowSet
  });

  // 为了区分普通代理reactive和readonly,我们分开进行存储
  const reactiveMap = new WeakMap();
  const readonlyMap = new WeakMap();
  function createReactiveObject(target, isReadonly, baseHandlers) {
      // 如果target不是对象，直接返回
      if (!isObject(target)) {
          return target;
      }
      // 如果是已经代理过的对象，就不需要再进行代理了
      const proxyMap = isReadonly ? readonlyMap : reactiveMap;
      const existingProxy = proxyMap.get(target);
      if (existingProxy) {
          return existingProxy;
      }
      // 判断是否是响应式对象
      if (target["__v_raw" /* ReactiveFlags.RAW */] && target["__v_isReactive" /* ReactiveFlags.IS_REACTIVE */]) {
          return target;
      }
      const proxy = new Proxy(target, baseHandlers);
      proxyMap.set(target, proxy);
      return proxy;
  }
  function reactive(target) {
      if (target && target["__v_isReadonly" /* ReactiveFlags.IS_READONLY */]) {
          return target;
      }
      return createReactiveObject(target, false, mutableHandlers);
  }
  function readonly(target) {
      return createReactiveObject(target, true, readonlyHandlers);
  }
  function toRaw(observed) {
      return observed["__v_raw" /* ReactiveFlags.RAW */] || observed;
  }

  function computed(getterOrOptions) {
      let getter;
      let setter;
      if (isFunction(getterOrOptions)) {
          getter = getterOrOptions;
          setter = NOOP;
      }
      else {
          getter = getterOrOptions.get;
          setter = getterOrOptions.set;
      }
      return new ComputedRefImpl(getter, setter, isFunction(getterOrOptions) || !getterOrOptions.set);
  }
  class ComputedRefImpl {
      constructor(getter, _setter, isReadonly) {
          this._setter = _setter;
          this._dirty = true;
          this._setter = _setter;
          this.effect = effect(getter, {
              lazy: true,
              scheduler: () => {
                  if (!this._dirty) {
                      this._dirty = true;
                      trigger(toRaw(this), "SET" /* TriggerOpTypes.SET */, "value");
                  }
              }
          });
          this["__v_isReadonly" /* ReactiveFlags.IS_READONLY */] = isReadonly;
      }
      get value() {
          if (this._dirty) {
              this._value = this.effect();
              this._dirty = false;
          }
          track(toRaw(this), "GET" /* TrackOpTypes.GET */, "value");
          return this._value;
      }
      set value(newValue) {
          this._setter(newValue);
      }
  }

  function isRef(r) {
      return Boolean(r && r.__v_isRef === true);
  }
  function ref(value) {
      return createRef(value);
  }
  function createRef(rawValue, shallow = false) {
      // 如果rawValue是ref对象，直接返回
      if (isRef(rawValue)) {
          return rawValue;
      }
      // 其他情况，我们通过RefImpl类来实现
      return new RefImpl(rawValue, shallow);
  }
  const convert = (val) => {
      return isObject(val) ? reactive(val) : val;
  };
  class RefImpl {
      constructor(_rawValue, _shallow) {
          this._rawValue = _rawValue;
          this._shallow = _shallow;
          this.__v_isRef = true;
          this._value = _shallow ? _rawValue : convert(_rawValue);
      }
      get value() {
          track(toRaw(this), "GET" /* TrackOpTypes.GET */, 'value');
          return this._value;
      }
      set value(newVal) {
          if (hasChanged(toRaw(newVal), this._rawValue)) {
              this._rawValue = newVal;
              this._value = this._shallow ? newVal : convert(newVal);
              trigger(toRaw(this), "SET" /* TriggerOpTypes.SET */, 'value', newVal);
          }
      }
  }

  function traverse(value, seen) {
      seen = seen || new Set();
      // 如果要被读取的数据是原始值，或者已经被读取过了，那么直接返回
      if (!isObject(value) || seen.has(value)) {
          return;
      }
      // 将数据添加到seen中，代表遍历的读取过了，避免循环引用引起的死循环问题
      seen.add(value);
      if (isRef(value)) {
          traverse(value.value, seen);
      }
      else if (isArray(value)) {
          for (let i = 0; i < value.length; i++) {
              traverse(value[i], seen);
          }
      }
      else {
          for (const key in value) {
              traverse(value[key], seen);
          }
      }
      return value;
  }
  function watch(source, cb, options) {
      let getter;
      let oldValue, newValue;
      if (isFunction(source)) {
          getter = source;
      }
      else {
          getter = () => traverse(source);
      }
      // cleanup用来存储用户注册的过期回调
      let cleanup;
      function onInvalidate(fn) {
          cleanup = fn;
      }
      // 把之前写在scheduler函数中执行的代码，提取出来封装为job函数
      const job = () => {
          // 得到新值
          newValue = effectFn();
          if (cleanup) {
              cleanup();
          }
          cb(newValue, oldValue, onInvalidate);
          // 更新旧值
          oldValue = newValue;
      };
      const effectFn = effect(() => getter(), {
          lazy: true,
          scheduler: job
      });
      if (options.immediate) {
          job();
      }
      else {
          oldValue = effectFn();
      }
  }

  exports.computed = computed;
  exports.createRenderer = createRenderer;
  exports.effect = effect;
  exports.h = h;
  exports.isRef = isRef;
  exports.lis = lis;
  exports.normalizeClass = normalizeClass;
  exports.options = options;
  exports.reactive = reactive;
  exports.ref = ref;
  exports.shouldSetAsProps = shouldSetAsProps;
  exports.watch = watch;

  return exports;

})({});
