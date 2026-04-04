## react 函数式组件有哪些优点
**代码简洁性与逻辑集中性**
1. 减少冗余代码
> 类组件需要处理 this 绑定、生命周期方法（如 componentDidMount、componentDidUpdate）等模板代码，而函数式组件通过 useState 管理状态、useEffect 处理副作用，将相关逻辑集中到同一位置。例如，一个 useEffect 可以替代多个生命周期方法，避免代码分散
2. 消除类组件的复杂性
> 类组件中的 this 指向问题容易引发错误（如未绑定事件处理函数），而函数式组件通过闭包特性直接访问变量，降低了心智负担。
**逻辑复用与代码解耦**
3. 自定义hooks 的灵活性
> 类组件通过高阶组件（HOC）或 Render Props 复用逻辑时，容易导致“包装地狱”（Wrapper Hell）。而自定义 Hooks（如 useFetch）允许将逻辑抽离为独立函数，实现跨组件的无嵌套复用

4. 逻辑按功能聚合
> Hooks 允许将同一功能的代码（如数据获取与状态更新）聚合在同一个 useEffect 或自定义 Hook 中，而非分散在 componentDidMount 和 componentDidUpdate 等多个生命周期方法里，提升可维护性。
**性能优化与未来兼容性**
5. 轻量化与优化潜力
> 函数式组件无需实例化类，减少了内存开销。同时，React 团队对 Hooks 的优化（如 useMemo、useCallback）更直接，能更精细地控制渲染行为

6. 支持并发模式
> React 的未来特性（如并发渲染、Suspense）更适配函数式组件。Hooks 的设计（如 useTransition）天然支持异步渲染，而类组件的生命周期模型难以无缝兼容这些新特性
**开发体验与社区趋势**
7. 函数式编程的普适性
> 函数式组件更符合现代 JavaScript 的函数式编程范式，代码更简洁且易于测试。同时，TypeScript 对函数式组件的类型推断更友好

8. 官方与社区的推动
> React 官方自 2019 年推出 Hooks 后，文档和示例已全面转向函数式组件。主流生态库（如 React Router、Redux）也优先支持 Hooks，进一步推动开发者迁移。

## 路由模式
1. BrowserRouter
> 基于 HTML5 History API 的路由模式，URL 中不包含 #，但需要服务器配置支持。
2. HashRouter
> 基于 URL 哈希值的路由模式，URL 中包含 #，适用于不支持 HTML5 History API 的环境。
3. MemoryRouter
> 内存路由模式，不操作浏览器历史记录，适用于测试或非浏览器环境。


# React & React Native 高频面试题汇总

## 一、React核心基础面试题

### 1.  React的核心特性有哪些？
**答案：**
React的核心特性围绕组件化和高效渲染设计：
- **组件化**：将UI拆分为独立、可复用的组件，每个组件负责单一功能，降低复杂度并提升可维护性。
- **JSX**：JavaScript语法扩展，允许在JS中直接编写类HTML代码，直观描述UI结构，最终编译为`React.createElement()`调用。
- **虚拟DOM**：用JavaScript对象模拟真实DOM，通过Diff算法计算最小变更集，仅将差异更新到真实DOM，大幅减少DOM操作成本。
- **单向数据流**：数据只能从父组件通过Props向下传递，子组件若需修改数据需通过回调函数触发父组件更新，避免数据混乱。
- **状态与生命周期**：组件通过State管理内部动态数据，通过生命周期方法（或Hooks）控制组件从创建到销毁的各个阶段行为。

### 2.  Props和State的区别是什么？
| **对比维度** | **Props**                                 | **State**                                  |
|--------------|-------------------------------------------|--------------------------------------------|
| **数据来源** | 父组件传递，属于组件外部输入               | 组件内部定义并管理，由组件自身维护         |
| **可修改性** | 子组件不能直接修改，若需修改需通知父组件更新 | 可通过`setState`（类组件）或`useState`（函数组件）更新 |
| **用途** | 用于组件间通信，传递静态/动态数据，配置子组件 | 记录组件内部变化的数据，驱动组件重新渲染   |
| **更新触发** | 父组件更新Props时，子组件被动重渲染 | 组件内部调用更新方法触发自身重渲染         |

### 3.  什么是受控组件和非受控组件？使用场景有何区别？
- **受控组件**：表单数据由React State控制，通过`onChange`事件同步更新State。适合表单校验、联动交互、复杂表单逻辑场景。
  ```jsx
  function App() {
    const [value, setValue] = useState('');
    return (
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    );
  }
  ```
- **非受控组件**：表单数据由DOM自身管理，通过`ref`获取值。适合简单表单、一次性获取值、性能敏感场景。
  ```jsx
  function App() {
    const inputRef = useRef();
    const handleClick = () => {
      console.log(inputRef.current.value);
    };
    return <input ref={inputRef} />;
  }
  ```

## 二、React Hooks专项面试题

### 1.  React Hooks的设计动机是什么？
- 解决类组件的“嵌套地狱”问题，将分散在多个生命周期中的逻辑聚合到单一Hook中，使组件逻辑更清晰。
- 使状态逻辑更易于复用和组合，通过自定义Hook实现逻辑提取和复用，无需使用高阶组件或Render Props导致的嵌套问题。
- 降低学习成本，无需理解复杂的Class语法和`this`绑定问题，使用函数式编程风格编写组件。

### 2.  使用Hooks必须遵守哪些规则？
- **顶层调用**：仅在函数组件的顶层调用Hooks，不能在循环、条件语句或嵌套函数中调用，确保Hook调用顺序的一致性。
- **React函数中调用**：仅在React函数组件或自定义Hook中调用Hooks，不能在普通JavaScript函数中调用。

### 3.  useEffect的作用是什么？如何正确使用依赖数组？
**作用**：处理副作用操作，如数据获取、订阅事件、DOM操作等。
**依赖数组规则**：
- **空数组`[]`**：仅在组件挂载和卸载时执行，模拟`componentDidMount`和`componentWillUnmount`。
- **包含依赖的数组**：当依赖项发生变化时执行，模拟`componentDidUpdate`。
- **不传依赖数组**：每次渲染后都执行，可能导致无限重渲染，需谨慎使用。
**示例代码**：
```jsx
useEffect(() => {
  const subscription = someEventSource.subscribe();
  return () => {
    subscription.unsubscribe(); // 清理副作用，避免内存泄漏
  };
}, [dependency]);
```

### 4.  如何解决React Hooks中的闭包陷阱问题？
闭包陷阱通常出现在异步操作中访问旧状态值，解决方法有两种：
- **函数式更新**：使用更新函数获取最新状态，不依赖闭包捕获的旧值。
  ```jsx
  setCount(prevCount => prevCount + 1);
  ```
- **使用useRef保存最新值**：通过ref同步最新状态，避免闭包捕获旧值。
  ```jsx
  const countRef = useRef(count);
  useEffect(() => {
    countRef.current = count;
  }, [count]);
  ```

### 5.  useLayoutEffect与useEffect的区别是什么？适用场景有何不同？
两者API一致，但执行时机和阻塞特性存在本质区别：
#### 执行时机差异
- **`useEffect`**：浏览器完成渲染后异步执行，属于非阻塞操作。React会在页面绘制完成后，将`useEffect`的回调放入事件队列中执行，不会影响用户看到页面的时间。
  ```jsx
  useEffect(() => {
    console.log("页面已渲染完成");
  }, []);
  ```
- **`useLayoutEffect`**：DOM更新后、浏览器绘制前同步执行，会阻塞页面渲染。React会等待`useLayoutEffect`执行完成后，才进行浏览器的绘制操作。
  ```jsx
  useLayoutEffect(() => {
    console.log("DOM已更新，页面尚未绘制");
  }, []);
  ```

#### 使用场景区别
| **Hook**          | **适用场景**                          | **优势与风险**                                  |
|-------------------|---------------------------------------|-------------------------------------------------|
| **`useEffect`**   | 异步操作（数据请求、事件订阅、日志收集） | 非阻塞渲染，性能友好；但无法同步读取最新DOM状态 |
| **`useLayoutEffect`** | 同步DOM操作（测量尺寸、调整布局、避免闪烁） | 可获取最新DOM状态，避免页面闪烁；但会阻塞渲染，执行耗时过长会导致页面卡顿 |

#### 典型应用示例
##### 1.  `useLayoutEffect` 测量DOM尺寸
当需要在DOM更新后立即获取元素尺寸并调整布局时，使用`useLayoutEffect`可以避免页面闪烁。
```jsx
import { useRef, useLayoutEffect } from 'react';

function MeasureElement() {
  const elementRef = useRef(null);
  
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (element) {
      const { height } = element.getBoundingClientRect();
      console.log("元素高度：", height); // 同步获取最新尺寸
    }
  }, []);
  
  return <div ref={elementRef} style={{ width: "200px", background: "red" }}>内容</div>;
}
```

##### 2.  `useEffect` 异步数据请求
大多数异步操作优先使用`useEffect`，避免阻塞页面渲染。
```jsx
import { useState, useEffect } from 'react';

function FetchData() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch("https://api.example.com/data")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);
  
  return <div>{data ? data.content : "加载中..."}</div>;
}
```

## 三、React原理与性能优化面试题

### 1.  什么是虚拟DOM？为什么React需要虚拟DOM？
**定义**：虚拟DOM是用JavaScript对象描述真实DOM节点的轻量级结构，包含节点的标签名、属性、子节点等信息。
**核心优势**：
- **减少真实DOM操作**：真实DOM操作成本极高，修改会触发重排/重绘。虚拟DOM通过Diff算法计算最小变更集，仅更新差异部分，大幅减少操作次数。
- **跨平台支持**：虚拟DOM脱离浏览器环境，React可基于虚拟DOM适配不同平台（如React Native映射原生组件）。
- **批量更新优化**：React可将多次状态更新合并为一次虚拟DOM对比，避免频繁触发真实DOM更新。

### 2.  React Diff算法的核心优化策略是什么？
React Diff算法基于两个假设将时间复杂度从O(n³)优化到O(n)：
1.  **同层比较**：仅对比DOM树的同一层级节点，不跨层级比较。若某一层级节点类型变化，直接销毁该节点及所有子节点，重建新节点树。
2.  **类型相同则继续比较**：若两个组件类型相同（如都是`<User />`），则认为其结构相似，继续对比Props和子节点；若类型不同，则销毁旧组件及子树，创建新组件及子树。
3.  **列表key唯一性**：列表节点需使用唯一`key`标识，Diff时通过`key`快速找到可复用节点，仅进行移动、插入、删除操作，避免重新创建所有列表项。

### 3.  如何优化React应用的性能？
- **组件级别优化**：
  - 使用`React.memo`避免函数组件不必要的重渲染，对比Props是否变化决定是否重新渲染。
  - 合理使用`useMemo`缓存计算结果，避免每次渲染重复执行复杂计算。
  - 使用`useCallback`缓存回调函数，避免子组件因函数引用变化而重复渲染。
- **代码分割**：
  - 使用动态导入（Dynamic Import）和`React.lazy()`结合`Suspense`实现组件懒加载，减少初始包体积，提升加载速度。
- **列表优化**：
  - 使用`FlatList`替代`ScrollView`处理大数据列表，提升滚动性能，支持分页加载和懒加载。
- **状态管理优化**：
  - 精细化状态更新，避免不必要的全局状态变化导致组件重渲染。
  - 针对大型应用选择合适的状态管理方案（如Redux Toolkit、Zustand），优化状态更新机制。

## 四、React实战与生态面试题

### 1.  除了Props，还有哪些组件通信方式？
1.  **Context上下文**：适合全局状态共享（如主题、用户信息），避免Props逐层传递的“钻隧道”问题。
    ```jsx
    // 创建上下文
    const ThemeContext = React.createContext();
    // 父组件提供上下文值
    function App() {
      const [theme, setTheme] = useState('light');
      return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <Header />
          <MainContent />
        </ThemeContext.Provider>
      );
    }
    // 子组件消费上下文
    function MainContent() {
      const { theme } = useContext(ThemeContext);
      return <div>Theme: {theme}</div>;
    }
    ```
2.  **事件总线**：通过第三方库（如EventEmitter）创建全局事件中心，组件通过监听和触发事件通信，适合非父子组件解耦。
3.  **Ref转发**：用于操作子组件DOM或实例，通过`forwardRef`将父组件的Ref转发到子组件内部DOM节点。
    ```jsx
    // 子组件通过forwardRef接收Ref
    const ChildComponent = forwardRef((props, ref) => {
      return <input type="text" ref={ref} />;
    });
    // 父组件创建Ref并转发
    function ParentComponent() {
      const inputRef = useRef();
      return <ChildComponent ref={inputRef} />;
    }
    ```

### 2.  如何实现React代码分割和懒加载？
使用`React.lazy`和`Suspense`实现组件懒加载，只有在组件需要渲染时才加载对应的代码块：
```jsx
import React, { Suspense, lazy } from 'react';
// 动态导入组件
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 五、React Native专项面试题

### 1.  React Native是什么？它和React的区别是什么？
React Native是Facebook开发的开源框架，允许使用React和JavaScript构建跨平台移动应用，支持iOS和Android平台。
- **核心区别**：
  - **渲染目标**：React将虚拟DOM映射到浏览器DOM，而React Native将虚拟DOM映射到原生移动组件（如iOS的UIView、Android的View）。
  - **组件库**：React使用Web组件（如`div`、`input`），React Native使用原生组件（如`View`、`TextInput`）。
  - **平台特性**：React Native可直接调用原生API（如相机、地理位置），实现接近原生应用的性能和体验。

### 2.  如何优化React Native应用的性能？
- **列表优化**：使用`FlatList`替代`ScrollView`处理大数据列表，`FlatList`支持按需渲染和内存回收，提升滚动性能。
- **避免过度渲染**：使用`shouldComponentUpdate`或`React.memo`避免不必要的组件重渲染。
- **图片优化**：使用`react-native-fast-image`实现图片缓存和懒加载，压缩图片尺寸，减少内存占用。
- **减少桥接通信**：尽量在JavaScript端处理逻辑，减少JavaScript和原生层之间的频繁通信，桥接通信是React Native性能瓶颈之一。
- **使用原生模块**：对于性能要求高的操作，使用原生模块实现，避免JavaScript层性能限制。

### 3.  React Native中的桥接（Bridge）机制是什么？
React Native通过桥接机制实现JavaScript代码与原生平台之间的通信：
- **工作原理**：JavaScript和原生运行在不同的线程，桥接作为中间层负责消息传递。JavaScript代码通过桥接发送异步请求，原生层处理请求后将结果返回给JavaScript。
- **特点**：异步通信模式，保证UI线程不被阻塞；支持双向通信，JavaScript可调用原生API，原生也可触发JavaScript事件。

## 六、高频实战代码面试题与解答

### 1.  实现一个自定义Hook：useDebounce防抖函数
```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer); // 清理定时器，避免内存泄漏
    };
  }, [value, delay]);

  return debouncedValue;
}
```
**使用场景**：搜索框输入防抖，避免每次输入都触发API请求，提升性能和用户体验。

### 2.  实现一个简单的待办事项列表（支持增删）
```jsx
import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue]);
      setInputValue('');
    }
  };

  const handleDelete = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleAdd}>添加</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => handleDelete(index)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 3.  使用Context API实现全局主题切换
```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function UseTheme() {
  return useContext(ThemeContext);
}

// 使用示例
function App() {
  const { theme, toggleTheme } = UseTheme();
  return (
    <div style={{ background: theme === 'light' ? 'white' : 'black', color: theme === 'light' ? 'black' : 'white' }}>
      <h1>Theme: {theme}</h1>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
}
```
**使用场景**：全局主题、用户登录状态等全局状态管理，避免Props逐层传递。

## 七、React Router专项面试题

### 1.  React Router的核心组件有哪些？分别有什么作用？
React Router 6的核心组件包括：
- **BrowserRouter/HashRouter**：路由根组件，用于包裹整个应用，提供路由上下文。`BrowserRouter`使用HTML5 History API，支持优雅的URL；`HashRouter`使用URL哈希值，兼容旧浏览器。
- **Routes/Route**：`Routes`替代了React Router 5的`Switch`，用于包裹多个`Route`组件，匹配第一个符合条件的路由。`Route`用于定义路由路径和对应的组件。
  ```jsx
  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>
  ```
- **Link/NavLink**：用于实现客户端路由导航，`Link`是基础导航组件，`NavLink`可通过`isActive`判断当前路由是否激活，自动添加激活样式。
- **useNavigate**：编程式导航Hook，替代React Router 5的`useHistory`，用于在函数组件中实现页面跳转。

### 2.  如何实现动态路由？如何获取动态路由参数？
动态路由用于匹配具有动态参数的URL，如用户详情页`/user/:id`。通过`useParams`Hook获取路由参数：
```jsx
// 定义动态路由
<Route path="/user/:id" element={<User />} />

// User组件获取参数
import { useParams } from 'react-router-dom';
function User() {
  const { id } = useParams();
  return <h1>User ID: {id}</h1>;
}
```

### 3.  React Router 5和React Router 6有哪些主要区别？
1.  **路由匹配机制**：React Router 6使用`Routes`替代`Switch`，`Routes`自动按优先级匹配，更高效。
2.  **组件渲染**：`Route`的`component`和`render`属性被`element`替代，直接传递JSX元素，更直观。
    ```jsx
    // React Router 5
    <Route path="/home" component={Home} />
    // React Router 6
    <Route path="/home" element={<Home />} />
    ```
3.  **编程式导航**：`useHistory`被`useNavigate`替代，`navigate`函数支持更灵活的导航方式，如前进、后退、替换路由。
4.  **嵌套路由**：React Router 6嵌套路由更简洁，通过`Outlet`组件渲染子路由。
5.  **路由守卫**：移除了`Prompt`组件，可通过`useNavigate`和自定义逻辑实现路由守卫。

### 4.  如何使用React Router实现嵌套路由？
嵌套路由用于实现页面的层级结构，如后台管理系统的侧边栏导航。通过`Outlet`组件渲染子路由：
```jsx
import { Routes, Route, Outlet, Link } from 'react-router-dom';

// 父路由组件
function Dashboard() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/dashboard/profile">Profile</Link></li>
          <li><Link to="/dashboard/settings">Settings</Link></li>
        </ul>
      </nav>
      {/* Outlet用于渲染子路由 */}
      <Outlet />
    </div>
  );
}

// 子路由组件
function Profile() {
  return <h1>Profile Page</h1>;
}
function Settings() {
  return <h1>Settings Page</h1>;
}

// 路由配置
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

### 5.  如何实现路由守卫（鉴权）？
通过自定义路由组件和`Navigate`组件实现路由守卫，拦截未授权用户访问：
```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token') !== null; // 模拟鉴权逻辑
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// 使用ProtectedRoute包裹需要鉴权的路由
<Routes>
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
</Routes>
```

### 6.  如何实现编程式导航？
使用`useNavigate`Hook实现编程式导航，支持前进、后退、替换路由等操作：
```jsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 模拟登录成功
    localStorage.setItem('token', 'user-token');
    navigate('/dashboard'); // 跳转到仪表盘页面
    // navigate(-1); // 后退一页
    // navigate('/home', { replace: true }); // 替换当前路由，不可通过后退按钮返回
  };

  return <button onClick={handleLogin}>登录</button>;
}
```

### 7.  如何在React Router中实现路由懒加载？
结合`React.lazy`和`Suspense`实现路由懒加载，减少初始包体积，提升加载速度：
```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// 懒加载路由组件
const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```