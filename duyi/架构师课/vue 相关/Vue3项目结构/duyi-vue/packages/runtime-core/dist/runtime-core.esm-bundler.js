import { isString, isArray, isObject, isOn, isFunction } from '@vue/shared';
import { effect, isRef } from '@vue/reactivity';
export * from '@vue/reactivity';

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

export { createRenderer, h, lis, normalizeClass, options, shouldSetAsProps, watch };
