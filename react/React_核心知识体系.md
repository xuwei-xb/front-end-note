# React 核心知识体系与面试图谱

---

## 一、React 基础概念

### 1.1 React 是 MVVM 框架吗？

React 是 Facebook 开源的 JS 框架，专注于 **View 层**，不包含数据访问层或路由（但有插件支持）。与 Angular、Ember 等大而全的框架不同，React 的核心是 **Component（组件）**——认为一切页面元素都可以抽象为组件。

**关键区别**：
- MVVM 的核心特征是 **双向绑定**，而 React 是 **单向数据流**
- React 可以作为 MVVM 中的 V（View），但本身不是 MVVM 框架
- React 整体是 **函数式思想**，推崇结合 `immutable` 实现数据不可变

---

### 1.2 React 的核心特性

| 特性 | 说明 |
|------|------|
| **组件化** | 将 UI 拆分为独立、可复用的组件，每个组件负责单一功能 |
| **JSX** | JavaScript 语法扩展，允许在 JS 中编写类 HTML 代码，最终编译为 `React.createElement()` |
| **虚拟 DOM** | 用 JavaScript 对象模拟真实 DOM，通过 Diff 算法计算最小变更集 |
| **单向数据流** | 数据从父组件通过 Props 向下传递，子组件通过回调触发父组件更新 |
| **状态与生命周期** | 通过 State 管理内部数据，通过生命周期或 Hooks 控制各阶段行为 |

---

### 1.3 Props 与 State 的区别

| 维度 | Props | State |
|------|-------|-------|
| **数据来源** | 父组件传递，外部输入 | 组件内部定义并管理 |
| **可修改性** | 子组件不能直接修改 | 通过 `setState` 或 `useState` 更新 |
| **用途** | 组件间通信、配置子组件 | 记录内部变化数据，驱动重渲染 |
| **更新触发** | 父组件更新时被动重渲染 | 组件内部调用更新方法触发重渲染 |

---

### 1.4 受控组件与非受控组件

**受控组件**：表单数据由 React State 控制，通过 `onChange` 同步更新
```jsx
function ControlledInput() {
  const [value, setValue] = useState('');
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}
```
**适用场景**：表单校验、联动交互、复杂表单逻辑

**非受控组件**：表单数据由 DOM 自身管理，通过 `ref` 获取值
```jsx
function UncontrolledInput() {
  const inputRef = useRef();
  const handleClick = () => {
    console.log(inputRef.current.value);
  };
  return <input ref={inputRef} />;
}
```
**适用场景**：简单表单、一次性获取值、性能敏感场景

---

## 二、类组件与函数组件

### 2.1 核心区别

| 维度 | 类组件 | 函数组件 |
|------|--------|----------|
| **定义方式** | ES6 class 定义 | 接收 props 对象，返回 React 元素 |
| **状态管理** | 有实例、有 state、有生命周期、有 this | hooks 前无状态，hooks 后可通过 useState 管理 |
| **调用方式** | 实例化后调用 render 方法 | 直接执行函数返回结果 |
| **性能** | 需要实例化，开销较大 | 无需实例化，性能更高 |
| **this 问题** | 需要手动绑定，容易出错 | 无 this，通过闭包访问变量 |

---

### 2.2 类组件的缺点

1. 大型组件难以拆分和重构，难以测试
2. 业务逻辑分散在各生命周期方法中，导致重复或关联逻辑
3. 引入复杂的编程模式（render props、高阶组件）
4. `this` 指向问题增加心智负担

---

### 2.3 函数组件的优势

**代码简洁性与逻辑集中**
- 减少 this 绑定、生命周期方法等模板代码
- `useEffect` 可将相关逻辑集中到同一位置

**逻辑复用与解耦**
- 自定义 Hooks 替代高阶组件/Render Props，避免"包装地狱"
- 逻辑按功能聚合，而非分散在多个生命周期方法

**性能与未来兼容性**
- 无需实例化，内存开销更小
- 天然支持并发模式、Suspense 等新特性

**开发体验**
- 更符合函数式编程范式，代码简洁易测试
- TypeScript 类型推断更友好

---

## 三、React Hooks 体系

### 3.1 Hooks 设计动机

1. **解决逻辑分散问题**：将分散在多个生命周期中的逻辑聚合到单一 Hook
2. **提升逻辑复用性**：通过自定义 Hook 提取复用逻辑，避免高阶组件嵌套
3. **降低学习成本**：无需理解 Class 语法和 this 绑定

---

### 3.2 Hooks 使用规则

1. **顶层调用**：仅在函数组件顶层调用，不能在循环、条件语句或嵌套函数中调用
2. **React 函数中调用**：仅在函数组件或自定义 Hook 中调用

---

### 3.3 常用 Hooks 详解

#### useState（状态钩子）
```jsx
const [count, setCount] = useState(0);
// 函数式更新，解决闭包陷阱
setCount(prev => prev + 1);
```

#### useEffect（副作用钩子）
```jsx
useEffect(() => {
  const subscription = eventSource.subscribe();
  return () => subscription.unsubscribe(); // 清理函数
}, [dependency]); // 依赖数组
```

**依赖数组规则**：
- `[]`：仅在挂载和卸载时执行
- `[dep]`：依赖变化时执行
- 不传：每次渲染都执行（慎用）

#### useContext（共享状态钩子）
```jsx
const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}

function Child() {
  const theme = useContext(ThemeContext);
  return <div>{theme}</div>;
}
```

#### useReducer（action 钩子）
适用于复杂状态逻辑，类似 Redux 的 reducer 模式

#### useCallback（记忆函数）
缓存函数引用，避免子组件因函数变化而重渲染
```jsx
const memoizedFn = useCallback(() => {
  console.log('clicked');
}, [dependency]);
```

#### useMemo（记忆值）
缓存计算结果，避免重复计算
```jsx
const expensiveValue = useMemo(() => compute(a, b), [a, b]);
```

**useCallback vs useMemo**：
- `useCallback` 不执行函数，返回记忆后的函数
- `useMemo` 执行函数，返回计算结果

#### useRef（保存引用值）
```jsx
const inputRef = useRef();
// 访问 DOM 节点
inputRef.current.focus();
// 保存任意可变值（不触发重渲染）
const countRef = useRef(count);
```

#### useImperativeHandle（穿透 Ref）
让父组件通过 ref 访问子组件的指定方法

---

### 3.4 useEffect vs useLayoutEffect

| 维度 | useEffect | useLayoutEffect |
|------|-----------|-----------------|
| **执行时机** | 浏览器渲染后，异步执行 | DOM 更新后、浏览器绘制前，同步执行 |
| **阻塞特性** | 非阻塞，不影响渲染性能 | 阻塞渲染，执行耗时会卡顿 |
| **适用场景** | 数据请求、事件订阅、日志 | DOM 测量、布局调整、避免闪烁 |

```jsx
// useLayoutEffect 示例：测量 DOM 尺寸
useLayoutEffect(() => {
  const { height } = elementRef.current.getBoundingClientRect();
  console.log('元素高度：', height);
}, []);
```

---

### 3.5 闭包陷阱及解决方案

**问题**：异步操作中访问旧状态值

**解决方案**：
1. **函数式更新**：`setCount(prev => prev + 1)`
2. **useRef 保存最新值**：
```jsx
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count;
}, [count]);
```

---

## 四、组件通信方式

### 4.1 父 → 子：Props 传递
```jsx
const Parent = () => <Child name="React" />;
const Child = props => <p>{props.name}</p>;
```

### 4.2 子 → 父：回调函数
```jsx
const Parent = () => {
  const handleMsg = msg => console.log(msg);
  return <Child onSend={handleMsg} />;
};
const Child = props => (
  <button onClick={() => props.onSend('hello')}>发送</button>
);
```

### 4.3 跨级组件：Context
```jsx
const ThemeContext = createContext();

// 顶层提供
<ThemeContext.Provider value="dark">
  <GrandChild />
</ThemeContext.Provider>

// 任意层级消费
const theme = useContext(ThemeContext);
```

### 4.4 非嵌套组件：事件总线 / 状态管理
- 发布订阅模式（如 `pubsub-js`）
- 全局状态管理（Redux、Zustand）
- 兄弟组件可通过共同父组件中转

---

## 五、React 核心原理

### 5.1 虚拟 DOM 与 Diff 算法

**虚拟 DOM**：用 JavaScript 对象描述真实 DOM 节点，包含标签名、属性、子节点等信息

**核心优势**：
- 减少真实 DOM 操作成本
- 支持跨平台（React Native）
- 批量更新优化

**Diff 算法优化策略**（O(n³) → O(n)）：
1. **同层比较**：仅对比同一层级节点
2. **类型判断**：类型相同继续比较，不同则销毁重建
3. **key 唯一性**：列表通过 key 快速找到可复用节点

---

### 5.2 setState 的异步与同步

**异步情况**：React 事件处理函数中
**同步情况**：setTimeout、原生 DOM 事件中

```jsx
// 异步（React 事件）
handleClick = () => {
  this.setState({ count: this.state.count + 1 });
  console.log(this.state.count); // 旧值
};

// 同步（setTimeout）
setTimeout(() => {
  this.setState({ count: this.state.count + 1 });
  console.log(this.state.count); // 新值
}, 0);
```

---

### 5.3 React 事件绑定原理

React 采用 **事件委托** 机制：
- 不在真实 DOM 上绑定事件
- 在 `document` 处监听所有支持的事件
- 事件冒泡到 document 后，React 封装合成事件（SyntheticEvent）并执行处理函数

**优势**：
- 减少内存消耗
- 统一订阅和移除事件

**注意**：阻止冒泡需使用 `event.stopPropagation()`，而非 `event.preventDefault()`

---

### 5.4 React Fiber 架构

**背景**：大量同步计算阻塞 UI 渲染，导致掉帧

**实现原理**：
- **Fiber 数据结构**：链表形式的节点对象
```js
const fiber = {
  stateNode,  // 节点实例
  child,      // 子节点
  sibling,    // 兄弟节点
  return,     // 父节点
};
```

**调度机制**：
- 任务优先级：synchronous > task > animation > high > low > offscreen
- 高优先级任务可打断低优先级任务

**两阶段执行**：
1. **阶段一（可中断）**：生成 Fiber 树，计算差异
2. **阶段二（不可中断）**：批量更新 DOM

**核心改进**：递归改循环，配合 `requestIdleCallback` 实现任务拆分与恢复

---

### 5.5 React.lazy 懒加载原理

```jsx
const LazyComponent = React.lazy(() => import('./Component'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

**原理**：
- `React.lazy` 返回 LazyComponent 对象，`_status` 初始为 -1
- 首次渲染时执行 `import()`，抛出 thenable
- `Suspense` 捕获 thenable，显示 fallback
- 模块加载完成后，重新渲染子组件

---

## 六、生命周期

### 6.1 挂载阶段
```
constructor → getDerivedStateFromProps → render → componentDidMount
```

### 6.2 更新阶段
```
getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate
```

### 6.3 卸载阶段
```
componentWillUnmount
```

---

## 七、React Router 路由体系

### 7.1 路由模式

| 模式 | 特点 |
|------|------|
| **BrowserRouter** | 基于 HTML5 History API，URL 无 #，需服务器配置支持 |
| **HashRouter** | 基于 URL 哈希，URL 有 #，兼容旧浏览器 |
| **MemoryRouter** | 内存路由，不操作浏览器历史，适合测试环境 |

---

### 7.2 核心组件

| 组件 | 作用 |
|------|------|
| `BrowserRouter/HashRouter` | 路由根组件，提供路由上下文 |
| `Routes/Route` | `Routes` 包裹多个 `Route`，匹配第一个符合条件的路由 |
| `Link/NavLink` | 声明式导航，`NavLink` 支持激活样式 |
| `useNavigate` | 编程式导航 Hook，替代 `useHistory` |
| `Outlet` | 嵌套路由中渲染子路由组件 |

---

### 7.3 动态路由与参数获取
```jsx
// 定义动态路由
<Route path="/user/:id" element={<User />} />

// 获取参数
const { id } = useParams();
```

---

### 7.4 嵌套路由
```jsx
function Dashboard() {
  return (
    <div>
      <nav>
        <Link to="profile">Profile</Link>
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet />
    </div>
  );
}

<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

---

### 7.5 路由守卫（鉴权）
```jsx
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

<Route path="/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
```

---

### 7.6 React Router 5 vs 6 主要区别

| 维度 | v5 | v6 |
|------|----|----|
| 路由匹配 | `Switch` | `Routes`，自动按优先级匹配 |
| 组件渲染 | `component={Home}` | `element={<Home />}` |
| 编程式导航 | `useHistory` | `useNavigate` |
| 嵌套路由 | 较复杂 | 通过 `Outlet` 简化 |

---

## 八、性能优化

### 8.1 组件级别优化

| 方法 | 作用 |
|------|------|
| `React.memo` | 避免函数组件不必要的重渲染 |
| `useMemo` | 缓存计算结果，避免重复计算 |
| `useCallback` | 缓存函数引用，避免子组件重渲染 |
| `shouldComponentUpdate` | 类组件中手动控制是否重渲染 |

---

### 8.2 代码分割与懒加载
```jsx
const LazyComponent = lazy(() => import('./Component'));

<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

**适用场景**：加载大组件、路由异步加载

---

### 8.3 列表优化
- 使用唯一 `key` 属性
- 大数据列表使用虚拟滚动（如 `react-window`）

---

### 8.4 状态管理优化
- 精细化状态更新，避免不必要的全局状态变化
- 选择合适的状态管理方案（Redux Toolkit、Zustand）

---

## 九、实战代码示例

### 9.1 自定义 Hook：useDebounce
```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

### 9.2 待办事项列表
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      setTodos([...todos, input]);
      setInput('');
    }
  };

  const handleDelete = index => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleAdd}>添加</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo}
            <button onClick={() => handleDelete(i)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### 9.3 全局主题切换
```jsx
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div style={{
      background: theme === 'light' ? '#fff' : '#000',
      color: theme === 'light' ? '#000' : '#fff'
    }}>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
}
```

---

## 十、React Native 专项

### 10.1 React vs React Native

| 维度 | React | React Native |
|------|-------|--------------|
| **渲染目标** | 浏览器 DOM | 原生移动组件（UIView/View） |
| **组件库** | div、input、span 等 | View、TextInput、Text 等 |
| **平台特性** | Web API | 原生 API（相机、地理位置等） |

---

### 10.2 React Native 性能优化

| 方法 | 说明 |
|------|------|
| 使用 `FlatList` | 替代 `ScrollView` 处理大数据列表，支持按需渲染 |
| 避免过度渲染 | 使用 `React.memo`、`shouldComponentUpdate` |
| 图片优化 | 使用 `react-native-fast-image`，压缩图片尺寸 |
| 减少桥接通信 | 尽量在 JS 端处理逻辑，减少 JS 与原生层通信 |
| 使用原生模块 | 性能要求高的操作使用原生模块实现 |

---

### 10.3 Bridge 桥接机制

React Native 通过 Bridge 实现 JavaScript 与原生平台的通信：
- **工作原理**：JS 和原生运行在不同线程，Bridge 负责异步消息传递
- **特点**：异步通信，保证 UI 线程不被阻塞；支持双向通信

---

## 十一、Portals 与异步组件

### 11.1 Portals
将子组件渲染到父组件 DOM 层次结构之外的节点：
```jsx
ReactDOM.createPortal(child, container);
```
**适用场景**：Modal、Tooltip 等需要脱离父组件层级的组件

---

### 11.2 异步组件
```jsx
const AsyncComponent = lazy(() => import('./Component'));

<Suspense fallback={<div>Loading...</div>}>
  <AsyncComponent />
</Suspense>
```
**适用场景**：加载大组件、路由懒加载
