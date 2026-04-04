# 你是否真正懂得 React 的 memoization 机制

> 提到 memoization 机制，大家都会跟 `useMemo`、`useCallback` 和 `React.memo` 联系起来。
> 但是你知道 memoization 真正要解决的问题是什么吗？

## 目录

1. [值是如何被比较的](#值是如何被比较的)
2. [Re-render = new references](#re-render--new-references)
3. [useMemo 和 useCallback 的工作原理](#usememo-和-usecallback-的工作原理)
4. [React 底层的实现](#react-底层的实现)
5. [实际应用场景](#实际应用场景)
6. [常见误区与反例](#常见误区与反例)
7. [性能权衡：何时使用 memoization](#性能权衡何时使用-memoization)

---

## 值是如何被比较的

理解 React 的比较机制是掌握 memoization 的基础：

### 原始类型（Primitive Types）

**数字、字符串、布尔值、null、undefined、Symbol、BigInt** 是按**值比较**的：

```typescript
const a = 1;
const b = 1;
console.log(a === b); // true

const str1 = 'hello';
const str2 = 'hello';
console.log(str1 === str2); // true
```

### 引用类型（Reference Types）

**对象、数组、函数等** 是按**引用比较**的：

```typescript
const obj1 = { id: 1 };
const obj2 = { id: 1 };
console.log(obj1 === obj2); // false —— 即使内容相同，引用不同

const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
console.log(arr1 === arr2); // false

const fn1 = () => {};
const fn2 = () => {};
console.log(fn1 === fn2); // false —— 每个函数都是新引用
```

---

## Re-render = new references

### 核心问题

每当组件 **re-render**，React 都会重新执行组件函数。这意味着组件内部的所有局部变量——包括函数——都会被重新创建。

```typescript
const Component = () => {
  // 每次组件 render，这个函数都会被重新创建
  const submit = () => {
    console.log('submit');
  };

  useEffect(() => {
    submit();
  }, [submit]); // submit 每次 render 都是新引用
};
```

### 问题表现

因为 `submit` 每次都会被重新创建，React 总是认为它"变了"，于是 `useEffect` 在**每一次 render**时都会执行——即使代码本身完全一样。

**副作用链式反应**：

```typescript
const Parent = () => {
  const handleClick = () => console.log('click');

  // 因为 handleClick 是新引用，Child 每次 Parent render 都会 re-render
  return <Child onClick={handleClick} />;
};

// 即使 Child 被 React.memo 包裹
const Child = React.memo(({ onClick }) => {
  useEffect(() => {
    console.log('Child mounted');
  }, [onClick]); // 这个 effect 也会重复执行
  return <button onClick={onClick}>Click me</button>;
});
```

---

## useMemo 和 useCallback 的工作原理

### 核心目标

让值在 re-render 之间保持**同一个引用**，这样 React 才不会误以为它发生了变化。

### useCallback 详解

```typescript
// ✅ 正确：空依赖，引用永远不会改变
const submit = useCallback(() => {
  console.log('submit');
}, []);

// ✅ 正确：依赖 data，只有 data 变化时才创建新引用
const handleSubmit = useCallback(() => {
  console.log(data);
}, [data]);

// ❌ 错误：每次 render 都是新引用，等于没用
const handleClick = useCallback(() => {
  console.log('click');
}, [data]); // data 每次都变
```

**重要理解**：

```typescript
// 你传入 useCallback 的这个函数本身，每次 render 都会被重新创建
// 这是 JavaScript 的行为，不是 React 的问题

const memoizedCallback = useCallback(() => {
  // 这个函数体每次 render 都会被重新创建
  doSomething();
}, [dependency]); // 但是 useCallback 会缓存并返回同一个引用

// 对比 useMemo
const memoizedFn = useMemo(() => {
  // useMemo memoize 的是这个函数的**返回值**
  return () => doSomething();
}, [dependency]);
```

### useMemo 详解

```typescript
// 缓存计算结果
const expensiveValue = useMemo(() => {
  console.log('expensive calculation...');
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);

// 缓存对象
const config = useMemo(() => ({
  endpoint: '/api',
  headers: { 'Content-Type': 'application/json' }
}), []);

// 缓存组件（谨慎使用）
const MemoizedComponent = useMemo(() => (
  <HeavyComponent data={data} />
), [data]);
```

**关键点**：

- `useCallback(fn, deps)` 等价于 `useMemo(() => fn, deps)`
- `useMemo` 缓存的是**回调的返回值**，不是回调本身
- 你传入 `useMemo` 的函数每次 render 都会被执行（**除了返回值被缓存的那一刻**）

---

## React 底层的实现

### 极简伪代码实现

React 本质上是在缓存结果。可以用一个极简的伪实现来理解：

```typescript
// 简化的 React hooks 实现
let hooksState = [];
let hooksIndex = 0;

function useCallback(callback, dependencies) {
  const currentIndex = hooksIndex++;

  // 首次执行，创建缓存
  if (hooksState[currentIndex] === undefined) {
    hooksState[currentIndex] = {
      cachedCallback: callback,
      lastDeps: dependencies
    };
    return callback;
  }

  const { cachedCallback, lastDeps } = hooksState[currentIndex];

  // 比较依赖是否变化
  const depsEqual = dependencies.every((dep, i) =>
    Object.is(dep, lastDeps[i])
  );

  if (depsEqual) {
    // 依赖没变，返回缓存的函数
    return cachedCallback;
  } else {
    // 依赖变了，更新缓存
    hooksState[currentIndex] = {
      cachedCallback: callback,
      lastDeps: dependencies
    };
    return callback;
  }
}

function useMemo(callback, dependencies) {
  const currentIndex = hooksIndex++;

  // 首次执行，创建缓存
  if (hooksState[currentIndex] === undefined) {
    const result = callback();
    hooksState[currentIndex] = {
      cachedResult: result,
      lastDeps: dependencies
    };
    return result;
  }

  const { cachedResult, lastDeps } = hooksState[currentIndex];

  // 比较依赖是否变化
  const depsEqual = dependencies.every((dep, i) =>
    Object.is(dep, lastDeps[i])
  );

  if (depsEqual) {
    // 依赖没变，返回缓存的结果
    return cachedResult;
  } else {
    // 依赖变了，重新计算并更新缓存
    const newResult = callback();
    hooksState[currentIndex] = {
      cachedResult: newResult,
      lastDeps: dependencies
    };
    return newResult;
  }
}
```

**关键观察**：

```typescript
// useMemo 每次都会执行传入的函数（用于比较依赖）
useMemo(() => {
  // 这个函数每次 render 都会被调用
  // 但是返回值会被缓存
  return expensiveCalculation(data);
}, [data]);

// useCallback 每次都会执行传入的函数（用于比较依赖）
useCallback(() => {
  // 这个函数每次 render 都会被调用
  // 但是返回的函数引用会被缓存
  console.log('creating function');
}, []);
```

---

## 实际应用场景

### 场景 1：prop 会被用作依赖

```typescript
const Parent = () => {
  const data = useData();

  // ❌ 错误：每次 render 都会创建新引用
  // const fetch = () => fetchData(data.id);

  // ✅ 正确：memoize，保持引用稳定
  const fetch = useCallback(() => {
    fetchData(data.id);
  }, [data.id]); // 只依赖 data.id，而不是整个 data

  return <Child onMount={fetch} />;
};

const Child = ({ onMount }) => {
  useEffect(() => {
    onMount();
  }, [onMount]); // 只有 onMount 引用变化时才执行
  // ...
};
```

### 场景 2：组件被 React.memo 包裹

```typescript
const Child = React.memo(({ data, onChange }) => {
  console.log('Child rendered');
  return <div onClick={() => onChange(data.id)}>{data.name}</div>;
});

const Parent = () => {
  const [count, setCount] = useState(0);
  const data = { id: 1, name: 'Item' };

  // ❌ 错误：每次 Parent render 都会创建新函数
  // 导致 Child 也重新渲染（即使 data 没变）
  const handleChange = () => console.log('changed');

  // ✅ 正确：memoize，保持引用稳定
  const handleChange = useCallback((id) => {
    console.log('changed', id);
  }, []);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <Child data={data} onChange={handleChange} />
    </>
  );
};
```

### 场景 3：传递给子组件的对象/数组

```typescript
const Parent = () => {
  const data = useData();

  // ❌ 错误：每次 render 都是新对象
  // const options = data.map(item => ({ id: item.id, name: item.name }));

  // ✅ 正确：使用 useMemo memoize
  const options = useMemo(() =>
    data.map(item => ({
      id: item.id,
      name: item.name
    }))
  , [data]);

  return <Select options={options} />;
};
```

### 场景 4：事件处理器传递给多个子组件

```typescript
const Parent = ({ items }) => {
  // ❌ 错误：每个 item 都会创建新函数
  // return items.map(item => (
  //   <Child key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
  // ));

  // ✅ 正确：使用 useCallback + data 属性
  const handleItemClick = useCallback((id) => {
    console.log('clicked', id);
  }, []);

  return items.map(item => (
    <Child
      key={item.id}
      item={item}
      onClick={handleItemClick}
      itemId={item.id}
    />
  ));
};

const Child = ({ item, onClick, itemId }) => {
  const handleClick = () => onClick(itemId);
  return <div onClick={handleClick}>{item.name}</div>;
};
```

---

## 常见误区与反例

### 误区 1：盲目使用 useCallback

```typescript
// ❌ 反例：没有必要的 useCallback
const Parent = () => {
  // 如果这个函数只用在 button 的 onClick
  // 而 Button 没有被 React.memo 包裹
  // 这个 useCallback 就是多余的
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <button onClick={handleClick}>Click me</button>;
};

// ✅ 正例：直接声明函数即可
const Parent = () => {
  const handleClick = () => {
    console.log('clicked');
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

**为什么不需要？**

- 如果子组件没有被 `React.memo` 包裹，即使 prop 变了，它本来也会 re-render
- 如果函数不在任何依赖数组中，它的引用变化不会导致额外副作用

### 误区 2：依赖项使用不当

```typescript
// ❌ 反例：依赖项过多，导致缓存失效
const handleSubmit = useCallback(() => {
  api.submit({ name, email, phone, address, city, zip });
}, [name, email, phone, address, city, zip]);
// 任何一个字段变化都会创建新函数

// ✅ 正例：传递整体对象
const handleSubmit = useCallback((formData) => {
  api.submit(formData);
}, []);

// 使用时
handleSubmit({ name, email, phone, address, city, zip });
```

### 误区 3：在依赖数组中过度使用 `useMemo`

```typescript
// ❌ 反例：对简单值也使用 useMemo
const count = useMemo(() => items.length, [items]);

// ✅ 正例：直接使用
const count = items.length;

// ✅ 只有当计算昂贵时才用 useMemo
const expensiveResult = useMemo(() => {
  return items.filter(item => item.active)
              .map(item => item.value * 2)
              .reduce((acc, val) => acc + val, 0);
}, [items]);
```

### 误区 4：忘记 React.memo 的比较函数

```typescript
// ❌ 反例：React.memo 默认浅比较，对象 prop 会失效
const Child = React.memo(({ data }) => {
  return <div>{data.name}</div>;
});

const Parent = () => {
  // 每次 render 都是新对象，即使内容相同
  const data = { name: 'John' };
  return <Child data={data} />;
};

// ✅ 正例 1：使用 useMemo memoize prop
const Parent = () => {
  const data = useMemo(() => ({ name: 'John' }), []);
  return <Child data={data} />;
};

// ✅ 正例 2：自定义比较函数
const Child = React.memo(
  ({ data }) => <div>{data.name}</div>,
  (prevProps, nextProps) => {
    return prevProps.data.name === nextProps.data.name;
  }
);
```

### 误区 5：在循环中创建闭包

```typescript
// ❌ 反例：闭包陷阱
const Parent = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      {[1, 2, 3].map((num) => (
        <button
          key={num}
          onClick={() => setCount(count + num)} // 闭包陷阱！所有按钮都只会加 1
        >
          Add {num}
        </button>
      ))}
    </>
  );
};

// ✅ 正例 1：使用函数式更新
const Parent = () => {
  return (
    <>
      {[1, 2, 3].map((num) => (
        <button
          key={num}
          onClick={() => setCount(c => c + num)} // 总是获取最新值
        >
          Add {num}
        </button>
      ))}
    </>
  );
};

// ✅ 正例 2：使用 useCallback
const Parent = () => {
  const handleClick = useCallback((num) => {
    setCount(c => c + num);
  }, []);

  return (
    <>
      {[1, 2, 3].map((num) => (
        <button
          key={num}
          onClick={() => handleClick(num)}
        >
          Add {num}
        </button>
      ))}
    </>
  );
};
```

---

## 性能权衡：何时使用 memoization

### 使用 memoization 的收益

```
收益 = 避免的 render 成本 - memoization 成本
```

**避免的 render 成本包括**：
- 子组件的执行成本（JSX 渲染、计算逻辑）
- 子组件的副作用（useEffect 执行）
- DOM diff 和更新成本

**memoization 成本包括**：
- 依赖比较的成本（通常很低，但数组越大成本越高）
- 内存占用（缓存结果）
- 代码可读性降低（增加了认知负担）

### 何时使用 useCallback

✅ **应该使用**：
1. 函数被传递给 `React.memo` 包裹的子组件
2. 函数被用作 `useEffect`、`useMemo` 等的依赖
3. 函数被传递给多个子组件，且这些子组件可能 re-render

❌ **不应该使用**：
1. 函数只在当前组件内部使用
2. 函数只传递给没有 memo 的子组件
3. 函数的依赖变化非常频繁，导致缓存基本无效

### 何时使用 useMemo

✅ **应该使用**：
1. 计算结果昂贵（复杂计算、大量数据处理）
2. 计算结果被传递给 `React.memo` 包裹的子组件
3. 计算结果被用作其他 hooks 的依赖

❌ **不应该使用**：
1. 简单计算（如数组长度、简单对象属性访问）
2. 依赖频繁变化，导致缓存基本无效
3. 为了"看起来性能好"而过度使用

### 何时使用 React.memo

✅ **应该使用**：
1. 组件渲染成本高（复杂 UI、大量子组件）
2. 组件经常因父组件 re-render 而无意义地重新渲染
3. 组件接收的 props 大部分时间保持稳定

❌ **不应该使用**：
1. 组件本身就是轻量级的
2. 组件的 props 几乎每次都变化
3. 过早优化，没有实际性能问题

### 性能分析清单

在添加 memoization 之前，先回答：

1. **真的有性能问题吗？**
   - 使用 React DevTools Profiler 测量实际性能
   - 不要基于假设优化

2. **这个优化能解决什么问题？**
   - 减少不必要的 re-render
   - 避免昂贵的计算重复执行
   - 稳定依赖避免副作用重复触发

3. **这个优化的成本是什么？**
   - 增加的代码复杂度
   - 维护成本
   - 可能的 bug（闭包陷阱、依赖错误）

### 实战建议

```typescript
// ✅ 策略：渐进式优化

// 第一步：不做优化，保持简单
const Parent = () => {
  const handleClick = () => console.log('clicked');
  const data = { id: 1, name: 'Item' };
  return <Child data={data} onClick={handleClick} />;
};

// 第二步：使用 Profiler 发现问题
// 发现 Child re-render 过于频繁

// 第三步：针对性优化
const Child = React.memo(({ data, onClick }) => {
  console.log('Child rendered');
  return <div onClick={onClick}>{data.name}</div>;
});

const Parent = () => {
  const data = { id: 1, name: 'Item' };
  const handleClick = useCallback(() => console.log('clicked'), []);
  return <Child data={data} onClick={handleClick} />;
};

// 第四步：如果还有问题，继续优化
const Parent = () => {
  const data = useMemo(() => ({ id: 1, name: 'Item' }), []);
  const handleClick = useCallback(() => console.log('clicked'), []);
  return <Child data={data} onClick={handleClick} />;
};
```

---

## 总结

### 核心要点

1. **memoization 的本质**：保持引用稳定，避免不必要的 re-render 和副作用
2. **比较机制**：原始类型按值比较，引用类型按引用比较
3. **useCallback vs useMemo**：useCallback 缓存函数引用，useMemo 缓存计算结果
4. **React.memo**：缓存组件渲染结果，通过 props 比较决定是否重新渲染
5. **性能权衡**：不要过度优化，先测量再优化

### 最佳实践

- 只在有实际性能问题时才使用 memoization
- 优先保持代码简单，可读性比微小的性能提升更重要
- 使用 React DevTools Profiler 识别真正的性能瓶颈
- 理解每个工具的成本和收益，做出明智的权衡
- 记住：**过早优化是万恶之源**

---

**记住：你不需要在每一个组件都使用 `useCallback` 和 `useMemo`。理解何时使用比盲目使用更重要。**
