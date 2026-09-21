## 一、一句话核心区别（先给结论）

| API | 执行时机 | 优先级 | 核心用途 |
| :--- | :--- | :--- | :--- |
| **`requestAnimationFrame`** | **下一帧渲染之前** | **高优先级**（与屏幕刷新同步） | **动画/视觉更新** |
| **`requestIdleCallback`** | **浏览器空闲时段** | **低优先级**（不阻塞关键任务） | **非紧急后台任务** |

> **记忆口诀：** rAF 管**画**，rIC 管**算**。

---

## 二、底层机制详解（技术深度）

### 1. requestAnimationFrame（rAF）

**执行时机：**
- 浏览器**每次重绘前**（约 60fps → 16.67ms 一次）
- 由 **显示器垂直同步信号（VSync）** 触发
- **与帧率绑定**：60Hz 屏幕下约 16.67ms 执行一次，120Hz 下约 8.33ms

**特点：**
```javascript
let count = 0;
function animate() {
  count++;
  console.log('执行于帧开始前', count);
  requestAnimationFrame(animate);
}
animate();
// 输出频率 = 屏幕刷新率（60fps → 每秒约 60 次）
```

**核心优势：**
- ✅ **自动匹配刷新率**，不会丢帧或撕裂
- ✅ **页面不可见时自动暂停**（节省 CPU/电池）
- ✅ **执行时机精准**：在 `style` 计算和 `layout` 之前，适合做 DOM 操作

**典型场景：**
- CSS 动画/Canvas/SVG 动画
- 滚动位置同步（如视差滚动）
- 数据可视化实时更新（ECharts 动态数据）
- 游戏循环（`requestAnimationFrame` + `deltaTime` 计算）

---

### 2. requestIdleCallback（rIC）

**执行时机：**
- 浏览器**一帧的剩余空闲时间**（即完成所有高优先级任务后）
- **不保证执行**：如果一直忙碌，可能永远不会执行

**特点：**
```javascript
requestIdleCallback(function(deadline) {
  // deadline.timeRemaining() 返回当前帧剩余时间（毫秒）
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.pop();
    task(); // 执行一个任务
  }
  // 如果还有任务，继续注册
  if (tasks.length > 0) {
    requestIdleCallback(arguments.callee);
  }
}, { timeout: 2000 }); // 超时后备：2秒后强制执行
```

**核心参数：**
- `deadline.timeRemaining()`：当前帧剩余时间（通常 ≤ 50ms）
- `timeout` 选项：超时后强制执行，防止任务饿死

**核心优势：**
- ✅ **不阻塞主线程**，用户交互不受影响
- ✅ 利用空闲时间做**预加载/预计算**，提升感知性能

**典型场景：**
- 数据上报/埋点（非关键路径）
- 大量数据的离线计算/排序
- 预加载下一页内容（如列表无限滚动）
- 非关键 DOM 的延迟渲染（如页面底部内容）

---

## 三、执行优先级对比（关键考点）

一张图看懂浏览器**一帧（16.67ms）** 的执行顺序：

```
一帧开始
  │
  ├── 1. 处理事件（点击/滚动/输入等）
  │
  ├── 2. requestAnimationFrame（rAF）  ← 高优先级，必须执行
  │
  ├── 3. 样式计算（Recalculate Style）
  │
  ├── 4. 布局（Layout）
  │
  ├── 5. 绘制（Paint）
  │
  ├── 6. 合成（Composite）
  │
  └── 7. requestIdleCallback（rIC）  ← 低优先级，有空才执行
        ↑
        └── 如果剩余时间 < 当前任务预期耗时，则延迟到下一帧
```

**关键结论：**
- **rAF 一定执行**（每帧都跑），**rIC 不一定执行**（有空才跑）
- **同一个帧内**：`rAF` 先于 `rIC` 执行
- **页面不可见时**：`rAF` 自动暂停，`rIC` 依然可以执行（但频率降低）

---

## 四、实战代码对比（面试官最爱问）

### 场景：实时动画 + 后台数据计算

```javascript
// ❌ 错误做法：把计算放在 rAF 里（会掉帧）
function badExample() {
  requestAnimationFrame(() => {
    // 既要画动画，又要算大数据
    updateAnimation(); // 必须及时
    heavyComputation(); // 可以慢点，但拖慢了动画 → 掉帧
    requestAnimationFrame(badExample);
  });
}

// ✅ 正确做法：rAF 只画动画，计算交给 rIC
function goodExample() {
  // 1. rAF 只负责视觉更新（高优先级）
  function draw() {
    updateAnimation(); // 只做 DOM/Canvas 操作
    requestAnimationFrame(draw);
  }
  draw();

  // 2. rIC 负责后台计算（低优先级）
  function compute() {
    if (hasMoreData()) {
      heavyComputation(); // 不会阻塞动画
    }
    requestIdleCallback(compute);
  }
  requestIdleCallback(compute);
}
```

---

## 五、面试官追问：rIC 的兼容性和替代方案

### 追问1：requestIdleCallback 支持哪些浏览器？

> **回答：** Safari 和部分旧浏览器不支持（iOS Safari 全系不支持）。**生产环境需要 polyfill**（降级方案：用 `setTimeout` 或 `MessageChannel`）。

```javascript
// 简易 polyfill
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function(callback, options) {
    const start = Date.now();
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      });
    }, 1);
  };
}
```

### 追问2：既然 rIC 有兼容问题，有没有其他替代方案？

> **回答：** 有 3 种替代策略：
> 1. **`setTimeout(fn, 0)`**：宏任务，优先级低于微任务但高于 rIC，会阻塞帧但可实现“让出主线程”
> 2. **`MessageChannel`**：宏任务，比 `setTimeout` 触发更快，常用于 React 的 `scheduler` 包
> 3. **Web Worker**：真正的多线程，把计算放到 Worker 中，完全不阻塞主线程（**最推荐**）

**React 源码中的调度方案：** React 的 `scheduler` 包早期用 `requestIdleCallback`，后来改为 **`MessageChannel` + `setImmediate`（Node 环境）**，因为 `rIC` 触发频率不稳定，影响调度精度。

---

## 六、你的简历（前端转 AI 全栈）怎么利用这个知识点

如果你在简历中写**性能优化**相关经历，可以这样写：

**简历项目描述示例：**
> **AI 对话流式输出性能优化**
> - 使用 **`requestAnimationFrame`** 控制 AI 回复的逐字渲染速度，确保打字机效果与屏幕刷新率同步，**避免出现卡顿或跳字**。
> - 将历史对话的 **Markdown 解析与代码高亮** 计算放在 **`requestIdleCallback`** 中执行，**优先保证用户输入响应（< 50ms）**，解析任务在空闲时完成，**页面交互流畅度提升 40%**。
> - 针对 `requestIdleCallback` 在 Safari 的兼容问题，降级使用 `MessageChannel` 实现异步任务分片。

---

## 七、速记对比表（面试前看一遍）

| 对比维度 | requestAnimationFrame | requestIdleCallback |
| :--- | :--- | :--- |
| **执行时机** | 帧开始前（VSync 触发） | 帧结束后（空闲时段） |
| **执行频率** | 约 60fps（与刷新率同步） | 不确定（取决于主线程负载） |
| **优先级** | **高**（必须执行） | **低**（尽量执行） |
| **是否保证执行** | ✅ 是 | ❌ 否（可能永远不执行） |
| **是否可设置超时** | ❌ 否 | ✅ 可以（`timeout` 选项） |
| **页面不可见时** | 🛑 自动暂停 | ✅ 继续执行（频率降低） |
| **典型用途** | 动画、渲染、滚动同步 | 埋点、预加载、大计算分片 |
| **兼容性** | 所有现代浏览器 | Safari 不支持（需 polyfill） |

---

**最后一个小技巧：** 面试时如果被问到区别，先用**一句话结论**开头（见第一部分），然后说**“我举个例子”**（见第四部分的动画+计算场景），最后补充**兼容性和替代方案**（见第五部分）。这一套组合拳下来，面试官会认为你既有理论深度又有实战经验。

如果你还想了解 **`requestAnimationFrame` 和 `setTimeout` 做动画的区别** 或 **React 的 `useEffect` 与 rAF 的配合**，我可以继续给你展开。