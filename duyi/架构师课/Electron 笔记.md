# Electron 学习笔记

## 第一章 Electron快速入门

### 1.1 Electron基本介绍

Electron是一个使用前端技术（HTML、CSS、JS）来开发桌面应用的框架。

> 什么是桌面应用？
>
> 顾名思义，就是需要安装包安装到电脑上的应用程序，常见的桌面应用：QQ、视频播放器、浏览器、VSCode
>
> 桌面应用的特点：
>
> - 平台依赖性
> - 需要本地安装
> - 可以是瘦客户端，也可以是厚客户端
>   - 所谓的瘦客户端，指的是严重依赖于服务器，离线状态下没办法使用（QQ、浏览器）
>   - 厚客户端刚好相反，并不严重依赖服务器，离线状态下也可以使用（视频播放器、VSCode）
> - 更新和维护：需要用户重新下载和安装新的版本

在早期的时候，要开发一个桌面应用，能够选择的技术框架并不多：

- Qt
- GTK
- wxWidgets

这三个框架都是基于 C/C++ 语言的，因此就要求开发者也需要掌握 C/C++ 语言，对于咱们前端开发人员来讲，早期是无法涉足于桌面应用的开发的。

> StackOverflow 联合创始人 Jeff 说：
>
> 凡是能够使用 JavaScript 来书写的应用，最终都必将使用 JavaScript 来实现。

使用前端技术开发桌面应用相关的框架实际上有两个：

- NW.js
- Electron

>这两个框架都与中国开发者有极深的渊源。
>
>2011 年左右，中国英特尔开源技术中心的王文睿（*Roger Wang*）希望能用 Node.js 来操作 WebKit，而创建了 node-webkit 项目，这就是 Nw.js 的前身，但当时的目的并不是用来开发桌面 GUI 应用。
>
>中国英特尔开源技术中心大力支持了这个项目，不仅允许王文睿分出一部分精力来做这个开源项目，还给了他招聘名额，允许他招聘其他工程师来一起完成。
>
>NW.js 官网：https://nwjs.io/
>
>2012 年，故事的另一个主角赵成（*Cheng Zhao*）加入王文睿的小组，并对 node-webkit 项目做出了大量的改进。
>
>后来赵成离开了中国英特尔开源技术中心，帮助 GitHub 团队尝试把 node-webkit 应用到 Atom 编辑器上，但由于当时 node-webkit 并不稳定，且 node-webkit 项目的走向也不受赵成的控制，这个尝试最终以失败告终。
>
>但赵成和 GitHub 团队并没有放弃，而是着手开发另一个类似 node-webkit 的项目 Atom Shell，这个项目就是 Electron 的前身。赵成在这个项目上倾注了大量的心血，这也是这个项目后来广受欢迎的关键因素之一。再后来 GitHub 把这个项目开源出来，最终更名为 Electron。
>
>Electron 官网：https://www.electronjs.org/

这两个框架实际上都是基于 Chromium 和 Node.js 的，两个框架的对比如下表所示：

| 能力       | Electron                   | NW.js |
| ---------- | -------------------------- | ----- |
| 崩溃报告   | 内置                       | 无    |
| 自动更新   | 内置                       | 无    |
| 社区活跃度 | 良好                       | 一般  |
| 周边组件   | 较多，甚至很多官方提供组件 | 一般  |
| 开发难度   | 一般                       | 较低  |
| 知名应用   | 较多                       | 一般  |
| 维护人员   | 较多                       | 一般  |

从上表可以看出，无论是在哪一个方面，Electron 都是优于 NW.js。

**Electron 特点**

在 Electron 的内部，集成了两大部件：

- Chromium：为 Electron 提供了强大的 UI 能力，可以在不考虑兼容的情况下，利用 Web 的生态来开发桌面应用的界面。
- Node.js：让 Electron 有了底层的操作能力，比如文件读写，集成 C++，而且还可以使用大量开源的 npm 包来辅助开发。

而且 Chromium 和 Node.js 都是跨平台的，这意味着我们使用 Electron 所开发的应用也能够很轻松的解决跨平台的问题。

**搭建 Electron 项目**

首先创建一个新的目录，例如 client，然后使用 npm init -y 进行一个初始化。

接下来需要安装 Electron 依赖：

```js
npm install --save-dev electron
```

之后分别创建 index.html 和 index.js 文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- 书写桌面程序界面的 -->
    <h1>Hello Electron</h1>
    <p>Hello from Electron！！！</p>
</body>
</html>
```

index.html 负责的是我们桌面应用的视图。

```js
// index.js
const { app, BrowserWindow } = require("electron");

// 创建窗口的方法
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });
  win.loadFile("index.html");
};

// whenReady是一个生命周期方法，会在 Electron 完成应用初始化后调用
// 返回一个 promise
app.whenReady().then(() => {
  createWindow();
});
```

该文件就是我们桌面应用的入口文件。

最后需要在 package.json 中添加执行命令：

```js
"scripts": {
  "start": "electron ."
},
```

最后通过 npm start 就可以启动了。

### 1.2 进程与线程

什么是进程？

假设我们的电脑看作是一个工厂，电脑上面是可以运行各种应用程序的（浏览器、Word、音乐播放器、视频播放器....）每一个应用程序都可以看作是一个独立的工作区域，这个独立的工作区域就是我们的进程。

每个进程都会有独立的内存空间和系统资源，每个进程之间是独立的，这意味着假设有一个进程崩了，那么不会影响其他的进程。

什么又是线程？

刚才我们将进程比做工厂里面一个独立的工作区域，那么每个工作区域都有员工的，一个独立的工作区域是可以有多个员工的，类似的，一个进程也可以有多个线程，线程之间进行协同工作，共享相同的数据和资源。线程是操作系统所能够调度的最小单位。

同样都是线程，其中的一个线程能够创建其他的 6 个线程，并且有决定这些线程能够做什么的能力，那么这个线程就被称之为主线程。

在一个进程中所拥有的所有的资源，所有的线程都有权利去使用，这个就叫做"进程资源共享"。

理论上来讲，一个应用会对应一个进程，但是这并不是绝对的。一些大型的应用，在进行架构设计的时候，会设计为多进程应用。比较典型的就是 Chrome 浏览器。在 Chrome 浏览器中，一个标签页会对应一个进程，当前还有很多除了标签页以外的一些其他的进程。这样做的好处在于一个标签页崩溃后，不会影响其他的标签页。

这样的应用我们就称之为"多进程应用"。

和前面所提到的主线程类似，如果一个应用是多进程应用，那么也会有一个"主进程"，起到一个协调和管理其他子进程的作用。

例如，在 Node.js 里面，我们可以通过 child_process 这个模块来创建一个子进程，那么在这种情况下，启动这些子进程的 Node.js 应用实例就会被看作是主进程，child_process 就是子进程。主进程负责管理这些子进程，比如分配任务，处理通信和同步数据之类的。

回到 Electron 桌面应用，当我们启动一个 Electron 桌面应用的时候，该应用对应的也是一个多进程应用。

这里面 Electron 是主进程，对应的就是我们应用入口文件的 index.js，该主进程负责的任务有：

- 管理整个 Electron 应用程序的生命周期
- 访问文件系统以及获取操作系统的各种资源
- 处理操作系统发出的各种事件
- 创建并管理菜单栏
- 创建并管理应用程序窗口

Electron Helper（Renderer）该进程就是我们窗口所对应的渲染进程。

假设在任务管理器将该进程关闭掉，我们会发现窗口不再渲染任何的东西，但是应用还存在，窗口也还存在。

这里就需要说一下，实际上在 Electron 应用中，有一个窗口进程，由窗口进程来创建的窗口，之后才是渲染进程来渲染的页面。这也是为什么我们关闭了渲染进程，但是窗口还存在的原因。

假设我们创建了多个窗口，那么会有多个窗口进程么？

多个窗口下仍然只有一个窗口进程，由这个窗口进程负责绘制多个窗口，不同的窗口里面会有不同的渲染进程来渲染页面。

最后再明确一个点，一个窗口只能对应一个渲染进程么？

其实也不是，哪怕我是在一个窗口里面，我也是可以有多个渲染进程的。如何做到？通过 webview 加载其他的页面，当你使用 webview 的时候，也会对应一个渲染进程。

### 1.3 主进程和渲染进程通信

在多进程的应用中，进程之间的通信是必不可少的。

进程间通信，英语叫做 interprocess communication，简称叫做 IPC。这个 IPC 进程通信机制是由操作系统所提供的一种机制，允许应用中不同的进程之间进行一个交流。

在 Electron 中，我们需要关注两类进程间的通信：

- 主进程和渲染进程之间的通信
- 渲染进程彼此之间的通信

在 Electron 中，已经为我们提供了对应的模块 ipcMain 和 ipcRenderer 来实现这两类进程之间的通信。

**ipcMain模块**

- ipcMain.on(channel, listener)
  - 这个很明显是一个监听事件，on 方法监听 channel 频道所触发的事件
  - listener 是一个回调函数，当监听的频道有新消息抵达时，会执行该回调函数
    - listener(event, args...)
      - event 是一个事件对象
      - args 是一个参数列表
- ipcMain.once(channel, listener)：和上面 on 的区别在于 once 只会监听一次
- ipcMain.removeListener(channel, listener)：移除 on 方法所绑定的事件监听。

具体可以参阅：https://www.electronjs.org/docs/latest/api/ipc-main

**ipcRenderer模块**

基本上和上面的主进程非常的相似。

- ipcRenderer.on(channel, listener)
  - 和上面主进程的 on 方法用法一样

- ipcRenderer.send(channel, ...args)
  - 此方法用于向主进程对应的 channel 频道发送消息。
  - 注意 send 方法传递的内容是被序列化了的，所以并非所有数据类型都支持

这两个模块实际上是基于 Node.js 里面 EventEmitter 模块实现的。例如：

```js
// index.js
const event = require('./event');
// 触发事件
event.emit("some_event");
```

```js
// event.js
const EventEmitter = require("events").EventEmitter;
const event = new EventEmitter();

// 监听自定义事件
event.on("some_event", () => {
  console.log("事件已触发");
});

module.exports = event;
```

### 1.4 使用消息端口通信

#### MessageChannel

文档地址：https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel

MessageChannel 是一个浏览器所支持的 Web API，它允许我们创建一个消息通道，并通过它的两个 MessagePort 属性发送数据。每个 MessageChannel 实例都有两个端口：port1 和 port2，这使得它们可以相互通信，就像是一个**双向通信**的管道。

>双向通信和单向通信是通信系统中的两种基本通信模式。
>
>1. 双向通信
>
>双向通信，顾名思义，是**信息可以在两个方向上流动的通信方式**。这意味着参与**通信的双方既可以发送信息，也可以接收信息**。
>
>生活中也有很多双向通信的例子：
>
>- 两个人在进行面对面的对话。每个人都可以说话（发送信息）也可以听对方说话（接收信息）。这种通信方式允许实时的互动和反馈
>- 使用即时通讯软件聊天，双方都可以发送和接收消息。
>
>常见的双向通信的实现：
>
>- 电话通话：两个人可以同时进行听和说的活动。
>- 网络聊天应用（如WhatsApp, WeChat）：用户可以发送消息并接收对方的回复。
>- WebSocket 协议：在 Web 开发中，WebSocket 提供了一个全双工通信渠道，允许数据在客户端和服务器之间双向流动。
>
>2. 单向通信
>
>单向通信是指**信息只能在一个方向上流动的通信方式**。这意味着**通信的一方仅能发送信息，而另一方仅能接收信息**，反向的信息流动是不可能的。
>
>生活中也存在单向通信的例子：
>
>收听广播或看电视。广播站或电视台（发送方）向外播出节目，而听众或观众（接收方）只能接收内容，不能通过这个渠道回应。在这种情况下，信息的流动是单向的。
>
>常见的单项通信的实现：
>
>- 广播系统：如无线电广播，只能传输信息，收听者不能通过广播回传信息。
>- 通知系统：比如网站的推送通知功能，服务器可以向客户端发送通知，但客户端不能通过这些通知回复服务器。
>- RSS Feeds：允许用户订阅来自网站的更新，但用户不能通过 RSS 向网站发送信息。

这个功能特别适合于需要从**一个上下文（比如主页面）与另一个上下文（例如 Web Worker 或者 iframe）安全地通信的情况**。也就是说，进行跨上下文进行通信。

#### Electron中的消息端口

在 Electron 中，涉及到一个主进程、一个渲染进程。**如果是在渲染进程中，那么我们是可以正常使用 MessageChannel 的**。

但是如果换做是在主进程中，是**不存在 MessageChannel 类的**，因为这其实是一个 Web API，主进程不是网页，它没有 Blink 的集成，因此自然是不能使用的。

不过，**Electron 中针对该情况，为主进程新增了一个 MessageChannelMain 类**，该类的行为就类似于 MessageChannel。

### 1.5 窗口

几乎所有包含图形界面的操作系统都是以窗口为基础构建各自的用户界面的。系统内小到一个计算器，大到一个复杂的业务系统，都是基于窗口而创建的。如果开发人员要开发一个有良好用户体验的 *GUI* 应用，势必会在窗口的控制上下足功夫。

Electron 中的窗口由 BrowserWindow 对象来创建，可以配置的属性多达几十个，这里我们将介绍一些比较常用的属性，以及一些比较常见的需求。

主要包含以下内容：

- 窗口相关配置
- 组合窗口
- 窗口的层级

#### 窗口相关配置

这一块儿基本上都是传递给 BrowserWindow 的配置项。

**基础属性**

- maxWidth：设置窗口的最大宽度
- minWidth：设置窗口的最小宽度
- maxHeight：设置窗口的最大高度
- minHeight：设置窗口的最小高度
- resizable：是否可以改变大小，当设置 resizable 为 false 之后，代表不可缩放，前面所设置的 maxWidth ... 这些就没有意义了
- movable：是否可以移动

**窗口位置**

默认窗口出现在屏幕的位置是在正中间，但是我们可以通过 x、y 属性来控制窗口出现在屏幕的位置

- x：控制窗口在屏幕的横向坐标
- y：控制窗口在屏幕的纵向坐标

**标题栏文本和图标**

关于窗口的标题栏，实际上是可以在多个地方设置的。

既然可以在多个地方进行设置，那么这里自然会涉及到一个优先级的问题。优先级从高到低依次：

- HTML文档的 title
- BrowserWindow 里面的 title 属性
- package.json 里面的 name
- Electron 默认值：Electron

除了标题栏文本，我们还可以设置对应的图标：

- icon：设置标题栏的图标，一般来讲是 ico 格式

```js
// 创建窗口方法
const createWindow = () => {
  const win = new BrowserWindow({
    // ...
    icon: path.join(__dirname, "logo.ico")
  });

  win.loadFile("window/index.html");
};
```

**标题栏、菜单栏和边框**

默认我们所创建的窗口，是有标题栏、菜单栏以及边框的，不过这个也是能够控制的。通过 frame 配置项来决定是否要显示。

- frame：true/false 默认值是 true

#### 组合窗口

桌面应用有些时候是有多个窗口的，多个窗口彼此之间是相互独立，也就是说，假设我关闭了一个窗口，对另外一个窗口是没有影响的。

但是在有一些场景中，多个窗口之间存在一定程度的联动，例如两个窗口存在父窗口和子窗口之间的关系，父窗口关闭之后，子窗口也一并被关闭掉了。

在 Electron 中，类似这样的需求可以非常简单的被实现，Electron 提供了父子窗口的概念，通过 parent 来指定一个窗口的父窗口。

当窗口之间形成了父子关系之后，两个窗口在行为上就会有一定的联系：

- 子窗口可以相对于父窗口的位置来定位
- 父窗口在移动的时候，子窗口也跟着移动
- 父窗口关闭了，子窗口也应该一并被关闭掉
- .....

#### 窗口的层级

当我们创建多个窗口的时候，默认情况下最后面创建的窗口，就在越上层。但是如果两个窗口是独立的话，那么当用户点击对应的窗口的时候，被点击的窗口会处于最上层。

但是在某些场景下，我们就是需要置顶某一些窗口，有两种方式可以办到：

- alwaysOnTop：true/false
  - 该配置属性虽然也能够置顶窗口，但是没有办法进行更新细粒度的设置
- window.setAlwaysOnTop(flag, level, relativeLevel)：该方法可以进行一个更细粒度的控制
  - flag：一个布尔值，用于设置窗口是否始终位于顶部。如果为 true，窗口将始终保持在最前面；如果为 false，则取消这一设置
  - level（可选）：一个字符串，指定窗口相对于其他窗口的层次。常用的值包括 'normal', 'floating', 'torn-off-menu', 'modal-panel', 'main-menu', 'status', 'pop-up-menu', 'screen-saver' 等。这个参数在不同的操作系统上可能会有不同的行为。
  - relativeLevel（可选）：一个整数，用于在设置了 level 的情况下进一步微调窗口层次。

### 1.6 多窗口管理

实际上要对多窗口进行管理，原理是非常简单的，主要就是将所有的窗口的引用存储到一个 map 里面，之后要对哪一个窗口进行操作，直接从 map 里面取出对应的窗口引用即可。

```js
// 该 map 结构存储所有的窗口引用
const winMap = new Map();
// ...
// 往 map 里面放入对应的窗口引用
winMap.set(config.name, win);
```

很多时候，我们的窗口不仅是多个，还需要对这多个窗口进行一个分组。这个时候简单的更改一下 map 的结构即可。

首先在窗口配置方面，新增一个 group 属性，表明该窗口是哪一个分组的。

```js
const win1Config = {
  name: "win1",
  width: 600,
  height: 400,
  show: true,
  group: "group1" // 新增一个 group 的属性
  file: "window/index.html",
};
```

第二步，在创建了窗口之后，从 map 里面获取对应分组的数组，这里又分为两种情况：

- 该分组名下的数组存在：直接将该窗口引入放入到该分组的数组里面
- 该分组还不存在：创建新的数组，并且将该窗口引用放入到新分组里面

核心代码如下：

```js
if (config.group) {
  // 根据你的分组名，先找到对应的窗口数组
  let groupArr = winMap.get(config.group);
  if (groupArr) {
    // 如果数组存在，直接 push 进去
    groupArr.push(win);
  } else {
    // 新创建一个数组，作为该分组的第一个窗口
    groupArr = [win];
  }
  // 接下来更新 map
  winMap.set(config.group, groupArr);
}
```

之后，在窗口进行关闭操作时，还需要将关闭的窗口实例从 map 结构中移除掉。

```js
// 接下来还需要监听窗口的关闭事件，以便在窗口关闭时将其从 map 结构中移除
win.on("close", () => {
  groupArr = winMap.get(config.group);
  // 因为当前的窗口已经关闭，所以我们需要将其从数组中移除
  groupArr = groupArr.filter((item) => item !== win);
  // 接下来更新 map
  winMap.set(config.group, groupArr);
  // 如果该分组下已经没有窗口了，我们需要将其从 map 结构中移除
  if (groupArr.length === 0) {
    winMap.delete(config.group);
  }
});
```

### 1.7 应用常见设置（快捷键、托盘图标、剪切板、系统通知）

#### 快捷键

在 Electron 中，页面级别的快捷键直接使用 DOM 技术就可以实现。

例如，我们在渲染进程对应的 JS 中书写如下的代码：

```js
// 设置一个页面级别的快捷键
window.onkeydown = function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "q") {
    // 用户按的键是 ctrl + q
    // 我们可以执行对应的快捷键操作
    console.log("您按下了 ctrl + q 键");
  }
};
```

有些时候我们还有注册全局快捷键的需求。所谓全局快捷键，指的是操作系统级别的快捷键，也就是说，即便当前的应用并非处于焦点状态，这些快捷键也能够触发相应的动作。

在 Electron 中想要注册一个全局的快捷键，可以通过 globalShortcut 模块来实现。

例如：

```js
const { globalShortcut, app, dialog } = require("electron");

app.on("ready", () => {
  // 需要注意，在注册全局快捷键的时候，需要在 app 模块的 ready 事件触发之后
  // 使用 globalShortcut.register 方法注册之后会有一个返回值
  // 这个返回值是一个布尔值，如果为 true 则表示注册成功，否则表示注册失败
  const ret = globalShortcut.register("ctrl+e", () => {
    dialog.showMessageBox({
      message: "全局快捷键 ctrl+e 被触发了",
      buttons: ["好的"],
    });
  });

  if (!ret) {
    console.log("注册失败");
  }

  console.log(
    globalShortcut.isRegistered("ctrl+e")
      ? "全局快捷键注册成功"
      : "全局快捷键注册失败"
  );
});

// 当我们注册了全局快捷键之后，当应用程序退出的时候，也需要注销这个快捷键
app.on("will-quit", function () {
  globalShortcut.unregister("ctrl+e");
  globalShortcut.unregisterAll();
});
```

几个核心的点：

- 需要在应用 ready 之后才能注册全局快捷键
- 使用 globalShortcut.register 来进行注册
- 通过 globalShortcut.isRegistered 可以检查某个全局快捷键是否已经被注册
- 当应用退出的时候，需要注销所注册的全局快捷键，使用 globalShortcut.unregister 进行注销

#### 托盘图标

有些时候，我们需要将应用的图标显示在托盘上面，当应用最小化的时候，能够通过点击图标来让应用显示出来。

在 Electron 里面为我们提供了 Tray 这个模块来配置托盘图标。

例如：

```js
function createTray() {
  // 构建托盘图标的路径
  const iconPath = path.join(__dirname, "assets/tray.jpg");
  tray = new Tray(iconPath);

  // 我们的图标需要有一定的功能
  tray.on("click", function () {
    win.isVisible() ? win.hide() : win.show();
  });

  // 还可以设置托盘图标对应的菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示/隐藏",
      click: () => {
        win.isVisible() ? win.hide() : win.show();
      },
    },
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
}
```

在上面的代码中，我们就创建了一个托盘图标。几个比较核心的点：

- **图片要选择合适，特别是大小，一般在 20x20 左右**
- 创建 tray 实例对象，之后托盘图标就有了
- 之后就可以为托盘图标设置对应的功能
  - 点击功能
  - 菜单目录

#### 剪切板

这个在 Electron 里面也是提供了相应的模块，有一个 clipboard 的模块专门用于实现剪切板的相关功能。

大致的使用方式如下：

```js
const { clipboard } = require('electron');
clipboard.writeText("你好"); // 向剪切板写入文本
clipboard.writeHTML("<b>你好HTML</b>"); // 向剪切板写入 HTML
```

#### 系统通知

这也是一个非常常见的需求，有些时候，我们需要给用户发送系统通知。

在 Electron 中，可以让系统发送相应的应用通知，不过这个和 Electron 没有太大的关系，这是通过 HTML5 里面的 notification API 来实现的。

例如：

```js
const notifyBtn = document.getElementById("notifyBtn");
notifyBtn.addEventListener("click", function () {
  const option = {
    title: "您有一条新的消息，请及时查看",
    body: "这是一条测试消息，技术支持来源于 HTML5 的 notificationAPI",
  };
  const myNotify = new Notification(option.title, option);
  myNotify.onclick = function () {
    console.log("用户点击了通知");
  };
});
```

核心的点有：

- 使用 HTML5 所提供的 Notification 来创建系统通知
- new Notification 之后能够拿到一个返回值，针对该返回值可以绑定一个点击事件，该点击事件会在用户点击了通知消息后触发

### 1.8 系统对话框与菜单

每个桌面应用都或多或少的要与系统 *API* 打交道。比如显示系统通知、在系统托盘区显示一个图标、通过"打开文件对话框"打开系统内一个指定的文件、通过"保存文件对话框"把数据保存到系统磁盘上面等。

早期的 *Electron* 对这方面支持不足，但随着使用者越来越多，用户需求也越来越多且各不相同，*Electron* 在这方面的支持力度也越来越强。

这节课我们来看两个方面：

- 系统对话框
- 菜单

#### 系统对话框

在 Electron 中，可以使用一个 dialog 的模块来实现打开系统对话框的功能。

ipcRenderer.invoke 和 ipcMain.handle 可以算作是一组方法，这一组方法主要就是处理异步调用。

举一个例子，如下：

```js
// 主进程
const { ipcMain } = require("electron");

ipcMain.handle('get-data', async (event, ...args) => {
  // 这里就可以执行一些异步的操作，比如读取文件、查询数据库等
  // args 是参数列表，是从渲染进程那边传递过来的
  const data = ...; // 从一些异步操作中拿到数据
  return data;
})
```

```js
// 渲染进程
const { ipcRenderer } = require("electron");

async function fetchData(){
  try{
    const data = await ipcRenderer.invoke('get-data', /* 后面可以传递额外的参数 */);
    // 后面就可以在拿到这个 data 之后做其他的操作
  } catch(e){
    console.error(e);
  }
}

fetchData();
```

接下来我们在 handle 的异步回调函数中，用到了 BrowserWindow.getFocusedWindow 方法，该方法用于获取当前聚焦的窗口，或者换一句话说，就是获取用户当前正在交互的 Electron 窗口的引用。

如果当前没有窗口获取焦点，那么会返回 null。

**使用场景**

这个方法在需要对当前用户正与之交互的窗口执行操作时非常有用。比如：

- 在当前获得焦点的窗口中打开一个对话框。
- 调整或查询当前活跃窗口的大小、位置等属性。
- 对当前用户正在使用的窗口应用特定的逻辑或视觉效果。

#### 菜单

##### 自定义菜单

在使用 Electron 开发桌面应用的时候，Electron 为我们提供了默认的菜单，但是这个菜单仅仅是用于演示而已。

我们可以自定义我们应用的菜单。

在 Electron 中，想要自定义菜单，可以使用 Menu 这个模块。代码如下：

```js
// 做我们的自定义菜单
const { Menu } = require("electron");

// 定义我们的自定义菜单
const menuArr = [
  {
    label: "",
  },
  {
    label: "菜单1",
    submenu: [
      {
        label: "菜单1-1",
      },
      {
        label: "菜单1-2",
        click() {
          // 该菜单项目被点击后要执行的逻辑
          console.log("你点击了菜单1-2");
        },
      },
    ],
  },
  {
    label: "菜单2",
    submenu: [
      {
        label: "菜单2-1",
      },
      {
        label: "菜单2-2",
        click() {
          // 该菜单项目被点击后要执行的逻辑
          console.log("你点击了菜单2-2");
        },
      },
    ],
  },
  {
    label: "菜单3",
    submenu: [
      {
        label: "菜单3-1",
      },
      {
        label: "菜单3-2",
        click() {
          // 该菜单项目被点击后要执行的逻辑
          console.log("你点击了菜单3-2");
        },
      },
    ],
  },
];

// 创建菜单
const menu = Menu.buildFromTemplate(menuArr);
// 设置菜单，让我们的自定义菜单生效
Menu.setApplicationMenu(menu);
```

核心的步骤就是：

1. 自定义菜单数组
2. 创建菜单：Menu.buildFromTemplate 方法
3. 设置菜单：Menu.setApplicationMenu

现在我们遇到了一个问题：无法打开开发者工具了，这给我们调试代码带来了很大的不便，我们需要解决这个问题。之所以无法打开，是因为 Electron 默认菜单中，包含了一些基本的功能，其中就有打开开发者工具的快捷方式，但是一旦我们自定义了菜单，这些默认项目就不存在了，默认的功能也就没了。

要解决这个问题，我们只需要在菜单模板中添加一个专门用于打开开发者工具的项目，以及设置快捷键：

```js
{
  label: "开发者工具",
  submenu: [
    {
      label: "切换开发者工具",
      accelerator:
        process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
      click(_, focusedWindow) {
        if (focusedWindow) focusedWindow.toggleDevTools();
      },
    },
  ],
}
```

在设置菜单的时候，我们是可以为菜单设置一个 role 属性。

```js
{ label: '菜单3-1', role: "paste" }
```

role 是菜单项中一个特殊的属性，用于指定一些常见的操作和行为。例如常见的复制、粘贴、剪切等。

当你设置了 role 属性之后，Electron 会自动实现对应的功能，你就不需要在编写额外的代码。

使用 role 的好处：

- 简化开发
- 一致性
- 自动的状态管理：例如当剪贴板为空的时候，粘贴的操作会自动处于禁用状态

##### 右键菜单

这个也是一个非常常见的需求，我们需要在页面上点击鼠标右键的时候，显示右键菜单。

这个功能非常简单，只需要在对应渲染进程对应的窗口上编写 HTML、CSS 和 JS 相应的逻辑即可。

核心的 JS 代码逻辑如下：

```js
const { ipcRenderer } = require("electron");

const btn = document.getElementById("btn");

btn.addEventListener("click", async function () {
  // 我们需要弹出一个对话框
  const result = await ipcRenderer.invoke("show-open-dialog");
  console.log(result);
});

const menu = document.getElementById("menu");
// 点击右键时对应的事件
window.oncontextmenu = function (e) {
  e.preventDefault();
  menu.style.left = e.clientX + "px";
  menu.style.top = e.clientY + "px";
  menu.style.display = "block";
};

// 用户点击右键菜单上面的某一项的时候
// 注意下面的查询 DOM 的方式只会获取到第一个匹配的元素
// 因此右键菜单上面的功能只会绑定到第一个菜单项上面
document.querySelector(".menu").onclick = function () {
  console.log("这是右键菜单上面的某一个功能");
};

// 当用户点击窗口的其他地方的时候，右键菜单应该消失
window.onclick = function () {
  menu.style.display = "none";
};
```

主要就是针对 3 个方面绑定事件：

- 右键点击的时候
- 右键点击后，出现的菜单上面的项目需要绑定对应的事件
- 点击窗口其他位置的时候，右键菜单要消失

### 1.9 数据持久化方案

#### 浏览器技术持久化

- localStorage
- IndexedDB
- Dexie.js

##### localStorage

在 Electron 中，如果你打开了多个 BrowserWindow 的实例，那么它们默认情况下会共享同一个 localStorage 空间。

另外，关于多个窗口是否共享 localStorage 这一点，虽然默认是多窗口共享，但是是可以进行配置的。

例如，在创建窗口二的时候，可以添加如下的配置：

```js
const secondWin = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    partition: "persist:myCustomPartition",
  },
});
```

- partition：用于定义该窗口数据存储的独立性和持久性
  - persist：这是一个前缀，该前缀表明这是一个持久性的会话
  - myCustomPartition：这个标识符代表该会话的唯一名称。这里就是通过不同的 partition 名称，给应用中的不同窗口创建了隔离的存储空间。

##### IndexedDB

IndexedDB 是一种低级的 API，用于在用户的浏览器中存储大量的结构化数据。这个 API 使用索引来实现对数据的高性能搜索。它允许你创建、读取、导航和写入客户端数据库中的数据。IndexedDB 对于需要在客户端存储大量数据或无需持续联网的应用程序特别有用。

**基础介绍**

- **数据库**：IndexedDB 创建的是一个数据库，你可以在其中存储键值对。
- **对象仓库**：这是数据库中的一个"表"，用于存储数据对象。
- **事务**：数据的读写操作是通过事务进行的。
- **键**：数据存储的标识。
- **索引**：用于高效搜索数据。

**打开数据库**

在使用 IndexedDB 之前，需要打开一个数据库。如果指定的数据库不存在，浏览器会创建它。

```javascript
let db;
const request = indexedDB.open("MyTestDatabase", 1);

request.onerror = function(event) {
  // 错误处理
  console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function(event) {
  db = event.target.result;
};
```

**创建对象仓库**

对象仓库类似于 SQL 数据库中的表。以下是在数据库的升级过程中创建对象仓库的示例：

```javascript
request.onupgradeneeded = function(event) {
  const db = event.target.result;

  // 创建一个对象仓库来存储我们的数据。我们将使用 "id" 作为键路径，因为我们假设它是唯一的。
  const objectStore = db.createObjectStore("name", { keyPath: "id" });

  // 创建一个索引来通过 name 进行搜索。
  objectStore.createIndex("name", "name", { unique: false });
};
```

**添加数据**

一旦有了对象仓库，就可以往里面添加数据了。这需要在一个事务中完成。

```javascript
function addData() {
  const transaction = db.transaction(["name"], "readwrite");
  const objectStore = transaction.objectStore("name");
  
  const data = {id: "1", name: "Zhang San"};
  const request = objectStore.add(data);

  request.onsuccess = function(event) {
    console.log("数据添加成功");
  };

  request.onerror = function(event) {
    console.log("数据添加失败");
  };
}
```

**读取数据**

从对象仓库中读取数据也很简单：

```javascript
function readData() {
  const transaction = db.transaction(["name"]);
  const objectStore = transaction.objectStore("name");
  const request = objectStore.get("1"); // 使用 id 读取数据

  request.onerror = function(event) {
    console.log("事务失败");
  };

  request.onsuccess = function(event) {
    if (request.result) {
      console.log("Name: " + request.result.name);
    } else {
      console.log("未找到数据");
    }
  };
}
```

**更新数据**

更新数据与添加数据类似，但通常会先读取现有数据，然后进行修改。

```javascript
function updateData() {
  const transaction = db.transaction(["name"], "readwrite");
  const objectStore = transaction.objectStore("name");
  const request = objectStore.get("1");

  request.onsuccess = function(event) {
    const data = event.target.result;
    data.name = "Li Si"; // 修改名称

    const requestUpdate = objectStore.put(data);
    requestUpdate.onerror = function(event) {
      console.log("更新失败");
    };
    requestUpdate.onsuccess = function(event) {
      console.log("更新成功");
    };
  };
}
```

**删除数据**

删除数据也很直接：

```javascript
function deleteData() {
  const request = db.transaction(["name"], "readwrite")
    .objectStore("name")
    .delete("1");

  request.onsuccess = function(event) {
    console.log("数据删除成功");
  };
}
```

以上就是 IndexedDB 的基本用法。通过这些基本操作，可以在前端应用中实现复杂的数据存储需求。不过，记得 IndexedDB 的操作都是异步的，所以你可能需要管理好回调或者使用`async/await`来处理这些异步操作。

##### Dexie.js

除了使用浏览器原生的 IndexedDB 以外，我们还可以使用 Dexie.js，该第三方库提供了**更简洁、更易用**的 API。

**IndexedDB**

1. **原生 Web API**：IndexedDB 是一个低级的 API，直接内置于现代浏览器中，用于在客户端存储大量结构化数据。
2. **复杂性**：直接使用 IndexedDB 可能相当复杂，主要是因为它的异步性质和繁琐的错误处理。它的 API 设计更偏向于底层，提供了大量的灵活性，但也使得简单操作变得复杂。
3. **事务管理**：IndexedDB 需要显式地处理事务。事务、对象存储、索引等需要仔细管理和协调。
4. **无包装器**：直接使用 IndexedDB 意味着编写更多的引导和设置代码，例如处理数据库的版本升级逻辑。

**Dexie.js**

1. **封装库**：Dexie.js 是一个对 IndexedDB 进行封装的库，提供了一个简单、更易于理解和使用的 API。
2. **简化的操作**：通过 Dexie.js，复杂的 IndexedDB 操作变得更简单。例如，它简化了异步操作的处理，使得使用 promises 和 async/await 变得直观。
3. **错误处理**：Dexie.js 提供了更加友好和简洁的错误处理方式。
4. **强化的功能**：Dexie.js 增加了一些额外的功能，如简化的索引查询和批量操作。
5. **事务管理**：Dexie.js 简化了事务管理。你仍然需要理解 IndexedDB 的事务概念，但 Dexie.js 提供了更简单的方法来处理它们。
6. **易于升级**：在 Dexie.js 中，处理数据库的版本升级更加简单和直观。

**Dexie.js 的优势**

- **更简洁的代码**：使用 Dexie.js 可以写出更清晰、更简洁的代码，尤其是在处理复杂查询和大量的异步操作时。
- **易于维护**：由于 API 更加简单，维护和更新使用 Dexie.js 编写的代码通常比直接使用 IndexedDB 更容易。
- **更好的错误处理**：Dexie.js 提供了更友好的错误处理机制，有助于更容易地诊断问题。
- **社区支持**：Dexie.js 拥有一个活跃的社区，提供了丰富的文档和社区支持。

下面简单介绍一下它的基本语法：

```js
let db = new Dexie("testDb");
db.version(1).stores({ articles: "id", settings: "id"});
```

第一行创建一个名为 *testDb* 的 *IndexedDB* 数据库。第二行中的 *db.version(1)* 表示数据库的版本。

在 *IndexedDB* 中，有版本的概念，例如假设现在的应用的数据库版本号为 *1*（默认值也是 *1*），新版本应用希望更新数据结构，可以把数据库版本号设置为 *2*。当用户打开应用访问数据时，会触发 *IndexedDB* 的 *upgradeneeded* 事件，我们可以在此事件中完成数据的迁移工作。

在 *Dexie.js* 中，对 *IndexedDB* 的版本 *API* 进行了封装，所以在上面的代码中，我们使用 *db.version* 方法获得当前版本的实例，然后调用实例方法 *stores*，并传入数据结构对象。

数据结构对象相当于传统数据库的表，与传统数据库不同的是，我们不必为数据结构对象指定每一个字段的字段名，此处我们为 *IndexedDB* 添加了两个表 *articles* 和 *settings*，它们都有一个必备字段 *id*，其他字段可以在写入数据时临时决定。

将来如果版本更新，数据库版本号变为 *2* 时，数据库增加了一张表 *users*，代码如下：

```js
db.version(2).stores({ articles: "id", settings: "id", users: "id"});
```

此时 *Dexie.js* 会为我们进行相应的处理，在增加新的表的同时，原有表以及表里面的数据不变。这为我们从容地控制客户端数据库版本提供了强有力的支撑。

下面来看一下使用 *Dexie.js* 进行常用数据操作的代码：

```js
// 增加数据
await db.articles.add({ id: 0, title: 'test'});

// 查询数据
await db.articles.filter(article => article.title === 'test');

// 修改数据
await db.articles.put({ id: 0, title: 'testtest'});

// 删除数据
await db.articles.delete(id);

// 排序数据
await db.articles.orderBy('title');
```

注意，上面的代码中使用到了 *await* 关键字，所以使用的时候，应该放在 *async* 标记的函数里面才能正常执行。

更多有关 *Dexie.js* 的使用，可以参阅官网：*https://dexie.org/*

### 1.10 生命周期、预加载脚本和上下文隔离

#### 生命周期

我们在最早就接触了一个 Electron 的生命周期方法：

```js
// whenReady 是一个生命周期方法，当 Electron 完成初始化后会调用这个方法
app.whenReady().then(() => {
  createWindow();
});
```

该方法是在 Electron 完成初始化后会调用这个方法。

- will-finish-launching：在应用完成基本启动进程之后触发
- ready：当 Electron 完成初始化后触发
- window-all-closed：所有窗口都关闭的时候触发，特别是在 windows 和 linux 里面，所有窗口都关闭则意味着应用退出

```js
app.on("window-all-closed", ()=>{
  // 当操作系统不是 darwin(macOS) 的时候
  if(process.platform !== 'darwin'){
    // 退出应用
    app.quit();
  }
})
```

- before-quit：退出应用之前触发
- will-quit：即将退出应用的时候
- quit：退出应用的时候

你可以在 https://www.electronjs.org/docs/latest/api/app 看到更多的 app 模块的生命周期方法。

除了 app 模块以外，BrowserWindow 也有很多的事件钩子：

- closed：当窗口被关闭的时候
- focus：当窗口聚焦的时候
- show：当窗口展示的时候
- hide：当窗口隐藏的时候
- maximize：当窗口最大化的时候
- minimize：当窗口最小化的时候

你可以在 https://www.electronjs.org/docs/latest/api/browser-window 这里看到更多的关于 BrowserWindow 的事件钩子。

一个简单的使用示例：

```js
win.on("minimize", () => {
  console.log("窗口最小化了");
});
```

#### 渲染进程的权限

在 Electron 中，出于安全性的考虑，实际上提供给渲染进程的可用的 API 是比较少的。

在早期的时候，Electron 团队其实提供了一个名为 remote 的模块，该模块也能够达到主进程和渲染进程互访的目的，降低两者之间通信的难度。

但是该模块本身带来了一些问题：

- 性能问题
  - 通过 remote 模块倒是可以使用原本只能在主进程里面使用的对象、类型、方法，但是这些操作都是跨进程的。在操作系统中，一旦涉及到跨进程的操作，性能上的损耗可能会达到几百倍甚至上千倍。
  - 假设我们在渲染进程里面通过 remote 模块使用了主进程的 BrowserWindow 来创建一个窗口实例，不仅创建该窗口实例的过程很慢，你后面使用这个窗口实例的过程也很慢，小到更新属性，大到使用方法，都是跨进程。
- 影子对象
  - 在渲染进程中通过 remote 模块使用到了主进程里面的某个对象，看上去是得到了主进程里面真正的对象，但实际上不是，得到的是一个对象的代理（影子）。
  - 这个影子对象和主进程里面真正的原本的对象还是有一定区别。首先，原本的对象的原型链上面的属性是不会被映射到渲染进程的影子对象上面。另外，类似于 NaN、Infinity 这样的值在渲染进程的影子对象里面得到是 undefined。这意味着假设在主进程里面有一个方法返回一个 NaN 的值，通过渲染进程的影子对象来调用该方法的话，得到的却是 undefined。
- 存在安全性问题
  - 使用 remote 模块后，渲染进程可以很轻松的直接访问主进程的模块和对象，这会带来一些安全性问题，可能会导致一些渲染进程里面的恶性代码利用该特性进行攻击。

Electron 团队意识到这个问题之后，将 remote 模块标记为了"不赞成"。

从 Electron 10 版本开始，要使用 remote 模块，必须手动开启

```js
const { app, BrowserWindow } = require("electron");

// 创建窗口方法
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true // 允许使用 remote 模块
    }
  });

  win.loadFile("window/index.html");
};

// whenReady 是一个生命周期方法，当 Electron 完成初始化后会调用这个方法
app.whenReady().then(() => {
  createWindow();
});
```

开启之后，就可以在渲染进程中直接通过 remote 使用一些原本只能在主进程中才能使用的 API

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <button id="btn">新建页面</button>
    <script>
        let { remote } = require('electron');
        let newWin = null;
        btn.onclick = function () {
            // 创建新的渲染进程
            newWin = new remote.BrowserWindow({
                webPreferences: { nodeIntegration: true }
            })
            // 在新的渲染进程中加载 html 文件
            newWin.loadFile('./index2.html');
        }
    </script>
</body>

</html>
```

之后，从 Electron 14 版本开始，彻底废除了 remote 模块。

不过，如果你坚持要用，也有一个替代品，就是 @electron/remote：https://www.npmjs.com/package/@electron/remote

#### 预加载脚本

所谓预加载脚本，指的是执行于渲染进程当中，但是要先于网页内容开始加载的代码。

在预加载脚本中，可以使用 Node.js 的 API，并且由于它是在渲染进程中，也可以使用渲染进程的 API 以及 DOM API，另外还可以通过 IPC 和主进程之间进行通信，从而达到调用主进程模块的目的。

因此，预加载脚本虽然是在渲染进程中，但是却拥有了更多的权限。

下面是一个简单的示例：

```js
// preload.js
const fs = require("fs");

window.myAPI = {
  write: fs.writeSync,
};
```

在 preload.js 中，我们引入了 Node.js 的 API，并且由于预加载脚本和渲染进程里面的浏览器共享一个全局的 window 对象，因此我们可以将其挂载到 window 对象上面。

之后需要在 webPreferences 里面指定预加载脚本的路径，注意这是一个绝对路径，这意味着最好使用 path.join 方法去拼接路径。

```js
webPreferences: {
  nodeIntegration: true,
  contextIsolation: false,
  preload: path.join(__dirname, "preload.js"),
},
```

但是需要注意，从 Electron 12 版本开始，默认是开启了上下文隔离的，这意味着预加载脚本和渲染进程里面的浏览器不再共享 window 对象，我们在 preload 里面对 window 的任何修改，不会影响渲染进程里面的 window 对象。

#### 上下文隔离

上下文隔离（contextIsolation）是 Electron 里面的一个非常重要的安全特性，用于提高渲染进程里面的安全性。从 Electron 12 版本开始默认就开启，当然目前可以在 webPreferences 里面设置关闭。

上下文隔离打开之后，主要是为了将渲染进程中的 JS 上下文环境和主进程隔离开，减少安全性风险。

举个例子：

假设有一个 Electron 程序，在没有隔离的情况，其中一个渲染进程进行文件相关的操作，例如文件删除，这就可能导致安全漏洞。

现在，在启动了上下文隔离之后，渲染进程是无法直接使用 Node.js 里面的模块的。

那么如果我在渲染进程中就是想要使用一些 Node.js 的相关模块，该怎么办呢？这里就可以通过预加载脚本来选择性的向渲染进程暴露，提高了安全性。

下面是一个简单的示例：

```js
const fs = require("fs");
const { contextBridge } = require("electron");

// 通过 contextBridge 暴露给渲染进程的方法
contextBridge.exposeInMainWorld("myAPI", {
  write: fs.writeSync,
  open: fs.openSync,
});
```

在预加载脚本中，我们通过 contextBridge 的 exposeInMainWorld 方法来向渲染进程暴露一些 Node.js 里面的 API，这样做的一个好处在于渲染进程中只能使用到暴露出来的 API，其他没有暴露的是无法使用。

在渲染进程中，通过如下的方式来使用：

```js
// 渲染进程 index.js
console.log(window.myAPI, "window.myAPI");

const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
  // 打开文件
  const fd = window.myAPI.open("example.txt", "w");
  // 写入内容
  window.myAPI.write(fd, "This is a test");
});
```

当我们使用 contextBridge 向渲染进程暴露方法的时候，有两个方法可选：

- exposeInMainWorld：允许向渲染进程的主世界（MainWorld）暴露 API.

该方法接收两个参数：

- apiKey：在主世界的 window 对象下暴露的 API 名称
- api（Object）：要暴露的方法，一般封装到一个对象里面

```js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  doSomething: () => console.log('在主世界中做了些事情！')
});
```

- exposeInIsolatedWorld：允许向渲染进程的隔离世界（IsolatedWorld）暴露 API.

该方法接收 4 个参数：

- worldId：隔离世界的唯一标识
- apiKey：想在隔离世界的 window 对象下暴露的 API 名称
- api（Object）：要暴露的方法，一般封装到一个对象里面
- options：附加渲染

```js
// 在预加载脚本中
const { contextBridge } = require('electron');

contextBridge.exposeInIsolatedWorld(
  'isolatedWorld', // 隔离世界的标识
  'myIsolatedAPI', // 在隔离世界中暴露的 API 名称
  {
    doSomethingElse: () => console.log('在隔离世界中做了些事情！')
  },
  {}
);
```

```js
// 在隔离世界的网页脚本中
window.myIsolatedAPI.doSomethingElse(); // 输出："在隔离世界中做了些事情！"
```

一般来讲 exposeInMainWorld 就够用了。

---

## 第二章 实战案例：构建Markdown编辑器（待补充）

本章会从原理着手：

- Markdown原理
  - 抽象语法树
  - 常见的 Markdown 实现原理
- 使用 Electron 构建 Markdown 编辑器
  - 打开一个 Markdown 文档
  - 保存文档
  - 拖动一个文档到编辑器
  - ...

---

## 第三章 实战案例：构建音乐播放器（待补充）

同样是通过不断迭代的方式，一步一步完善音乐播放器。

- 原生网页版音乐播放器
- AmplitudeJS迭代音乐播放器
- Electron版本音乐播放器
- Vite、Vue、Electron搭建一个项目，继续迭代音乐播放器
- Electron-Vite 迭代音乐播放器

---

## 第四章 Electron开发进阶

### 4.1 应用打包（macOS/Windows）

在 Electron 中，要对应用进行打包，可用方案有好几套：

- Electron Packager
- Electron Builder
- Electron Forge

**Electron Packager**

Electron Packager 是一个用于 Electron 应用的命令行工具，能够帮助我们将 Electron 应用打包成各个平台（Windows, macOS, Linux）的可分发格式。它提供了很多自定义选项，比如设置图标、应用名称、版本号等。结合其他的工具，然后再使用 Electron Packager 可以很方便地为应用生成不同平台的安装包。

**特点：**

- 它是一个简单、灵活的工具，适合于快速将Electron应用打包成可执行文件。
- 支持多平台打包，包括Windows、macOS和Linux。
- 允许自定义打包选项，如应用图标、版本号、应用名称等。
- 不内置生成安装程序的功能，但你可以结合其他工具（如NSIS、DMG）来创建安装包。

**适用场景：**

- 适合于小型或中型项目，对打包过程的要求不是特别复杂。
- 当你只需要简单地将应用打包成可执行文件，不需要额外的安装程序或更新机制时。

**Electron Builder**

Electron Builder 针对大多数构建任务重新编写了自己的内部逻辑，提供了丰富的功能，包括代码签名、发布支持、文件配置、多种目标构建等。Electron Builder 不限制使用的框架和打包工具，使得可以更加灵活地进行配置和打包。

**特点：**

- 提供了一套全面的解决方案，包括打包、创建安装程序、自动更新等。
- 支持广泛的安装包格式，如NSIS、AppImage、DMG、Snap等，适用于不同平台。
- 高度可配置，可以通过 electron-builder.yml（或 json、toml）文件详细控制打包和分发过程。
- 内置自动更新机制，与GitHub、S3等服务紧密集成，方便应用发布和更新。

**适用场景：**

- 适合于需要复杂打包和分发流程的中大型项目。
- 当你需要创建专业的安装程序，并实现自动更新功能时。

**Electron Forge**

Electron Forge 因为是官方维护的产品，所以当 Electron 支持新的应用程序构建功能时，它会立即集成这些新的能力。另外，Electron Forge 专注于将现有的工具组合成一个单一的构建流程，因此更易于跟踪代码的流程和扩展。

**特点：**

- 是一个综合性的工具，提供了开发到打包的全流程支持。
- 集成了Webpack、Electron Packager和Electron Builder的部分功能，提供了一站式的开发体验。
- 通过插件系统扩展功能，支持自定义Webpack配置、React、Vue等前端框架。
- 简化了开发和打包流程，通过简单的命令即可启动开发环境、打包和创建安装程序。

**适用场景：**

- 适合于所有规模的项目，特别是那些希望通过一套工具管理整个Electron应用生命周期的项目。
- 当你需要一个简单而全面的解决方案，不仅包括打包，还包括开发过程中的实时重新加载、打包优化等。

针对上面三个工具，简单总结一下：

- Electron Packager：简单，灵活，适合于打包的基础需求。
- Electron Builder：全面、功能丰富，支持各种各样的配置，适合于需要复杂打包流程和高度定制的项目。
- Electron Forge：官方出品，集成度高，可以一站式管理 Electron 应用的生命周期。

#### 图标

关于图标这一块儿，我们又不是 UI，所以可以去找一些现成的免费的 icon 来用。

Icon Generator：https://icongenerator.net/

在该网站找到一个合适的图标，下载之后放置于你的项目对应的目录里面即可。

另外，在打包 macOS 应用的时候，需要的不仅仅是一个图标，而是**一组图标**，一组不同尺寸大小的图标，方便应用在不同地方显示合适尺寸的图标。

这里我们可以借助 electron-icon-builder 这个插件，可以快速的基于我们所提供的图标模板生成一套不同尺寸的图标。

```bash
npm install electron-icon-builder -D
```

之后就可以在 package.json 里面配置一条脚本命令：

```js
"scripts": {
  "build-icon": "electron-icon-builder --input=./assets/markdown.png --flatten"
}
```

#### 打包配置

主要是配置一个名为 build 的配置项，主要需要配置的内容如下：

- appId：这个是我们应用的唯一标识符，一般会采用反向域名的格式。（假设我们应用的官网对应的地址：markdown.duyi.com，那么这里 appId 就是 com.duyi.markdown）
  - 来看一些有名的应用在 appId 上面的示例
  - **Visual Studio Code**: `com.microsoft.vscode`
  - **Slack**: `com.tinyspeck.slackmacgap`
  - **WhatsApp**: `com.whatsapp.desktop`
  - **Skype**: `com.skype.skype`
  - **Discord**: `com.hnc.Discord`

- mac 配置
  - category：你的应用在 macOS 上面的一些类别，例如我们的 markdown 是属于工具类应用，那么在 macOS 平台，就有一个分类，名为 public.app-category.utilities
    - 这里来看一下其他有名的应用的分类填写示例
    - public.app-category.developer-tools: 开发工具，示例：Visual Studio Code, Sublime Text, Atom
    - public.app-category.utilities: 实用工具，示例：Alfred, CleanMyMac, DaisyDisk
    - public.app-category.social-networking: 社交网络，示例：Slack, WhatsApp Desktop, Telegram
    - public.app-category.music: 音乐，示例：Spotify, Apple Music
    - public.app-category.productivity: 生产力，示例：Microsoft Office Suite, Notion, Evernote
  - target：对应的是要打包的目标格式，值为一个数组，数组里面的值经常填写的为 dmg 和 pkg
- dmg 格式相关配置
  - title：打包成 dmg 格式时，磁盘映像对应的标题
  - icon：对应的就是一组 icon 的目录
  - background：dmg 窗口的背景图路径
  - window：dmg 窗口的大小，通过 width 和 height 来进行指定
  - contents：指定 dmg 窗口里面，应用和目录具体显示的位置。
- pkg 格式相关配置
  - installLocation：指定 pkg 安装包在进行安装的时候，将应用安装到的具体位置，一般也是 /Applications 这个位置

更多详细的关于 electron-builder 的配置信息，可以参阅：https://www.electron.build/index.html

下面是我们针对此次项目打包所做的配置信息，如下：

```js
"build": {
  "appId": "com.duyi.markdown",
  "productName": "Markdown Editor",
  "mac": {
    "category": "public.app-category.utilities",
    "target": [
      "dmg",
      "pkg"
    ]
  },
  "dmg": {
    "title": "Markdown Editor",
    "icon": "./icons",
    "background": "./assets/background.jpeg",
    "window": {
      "width": 660,
      "height": 400
    },
    "contents": [
      {
        "x": 180,
        "y": 170
      },
      {
        "x": 480,
        "y": 170,
        "type": "link",
        "path": "/Applications"
      }
    ]
  },
  "pkg": {
    "installLocation": "/Applications"
  }
}
```

build 这个配置完成之后，我们又可以在 package.json 中添加一条脚本命令：

```js
"scripts": {
  "build": "electron-builder"
}
```

记得要安装一下 electron-builder

```bash
npm install electron-builder -D
```

接下来运行 npm run build 就可以成功打包，注意打包的时候，有两个信息值得注意：

```
skipped macOS application code signing  reason=cannot find valid "Developer ID Application" identity or custom non-Apple code signing certificate, it could cause some undefined behaviour, e.g. macOS localized description not visible, see https://electron.build/code-signing allIdentities=     0 identities found
```

这里的提示信息表示在打包的过程中，跳过了代码签名的验证。

要解决这个问题，你需要有一个有效的 Apple 开发者证书，然后需要执行如下的步骤：

1. **加入苹果开发者计划**：如果还没有，你需要加入苹果开发者计划。这通常涉及到一些费用。
2. **创建并下载证书**：登录到你的苹果开发者账户，然后在证书、标识符和配置文件部分创建一个新的"Developer ID Application"证书。创建并下载这个证书到你的电脑。
3. **安装证书到钥匙串**：双击下载的证书文件，它会自动添加到你的钥匙串访问中。这样，electron-builder 就能在打包应用程序时使用这个证书了。
4. **在 electron-builder 配置中指定证书**：在你的 `electron-builder` 配置文件中（通常是 `package.json` 中的 `build` 部分），确保正确设置了代码签名的配置。例如，你可以在配置中指定证书的名称或位置。

```json
"mac": {
  "category": "public.app-category.utilities",
  "target": ["dmg", "zip"],
  "identity": "Developer ID Application: [你的开发者名]"
}
```

5. **重新打包应用程序**：完成上述步骤后，再次使用 electron-builder 打包你的应用程序。这次应该不会出现之前的提示，因为 electron-builder 现在能找到并使用你的开发者 ID 证书进行代码签名了。

```
Detected arm64 process, HFS+ is unavailable. Creating dmg with APFS - supports Mac OSX 10.12+
```

这个不是错误，这个仅仅是一个提示信息，告诉你在新的 arm 芯片的 macOS 里面，不再支持 HFS+ 这种文件格式系统。

#### 打包生成文件说明

- Markdown Editor-1.0.0-arm64.dmg.blockmap：这个文件是和 dmg 文件相关的 map 文件，该文件主要的作用是为了支持增量更新。
- com.duyi.markdown.plist：这是一个属性列表文件，通常用于 macOS 程序存储一些配置信息，例如应用程序的标识符、版本信息、安全权限等。
- builder-debug.yml：通常是记录 electron-builder 详细的构建过程的日志信息。
- builder-effective-config.yaml：该文件包含了在使用 electron-builder进行打包的时候，实际所使用的配置信息。也就是说，electron-builder 有一个默认的基础配置，然后结合我们所给的 build 配置，最终所生成的，实际所用的配置。

#### 打包Windows应用

打包Windows应用基本上和上节课介绍的打包 macOS应用大同小异，但是有一些注意点：

1. 在打包 windows 应用的时候，需要填写 author 字段。
2. 关于图标，对应的是一个具体的 ico 格式的文件，而非一组文件
3. nsis 配置打包出来就是 exe 文件，对应的常见配置项：
   - oneClick：false
     - 表示是否需要一键式安装程序，当你设置为 true 的时候，安装包在进行安装的时候，就不会给用户提供相应的选项（用户组的选择、安装路径的选择），全部按照默认配置去安装。
   - allowElevation：true
     - 安装程序是否在需要的时候，能够请求提升权限
       - true：表示安装包在进行安装的时候，如果遇到权限不足的情况，那么会向用户请求提升权限。
       - false：表示安装包在进行安装的时候，如果遇到权限不足的场景，直接安装失败。
   - allowToChangeInstallationDirectory：true
     - 布尔类型，如果是 true，表示允许用户在安装的过程中修改安装路径。
   - createDesktopShortcut：true
     - 是否创建桌面快捷方式
   - createStartMenuShortcut：true
     - 是否在 windows 系统的开始菜单创建快捷方式
   - shortcutName：string
     - 快捷方式显示的名称

### 4.2 asar文件

#### asar基本的介绍

asar 英语全称 Atom Shell Archive。翻译成中文"Atom层文件归档"。这个其实就是一种 Electron 自定义的文件格式而已。在 Electron 应用进行构建的时候，会把所有的源代码以及相关的资源文件都打包到这个文件里面。

asar 文件开头有一段 JSON，类似于如下的结构：

```js
{
  "files": {
    "default_app.js": { "size": 38848, "unpacked": true },
    "icon.png": { "size": 1023, "offset": "0" },
    "index.html": { "size": 52792, "unpacked": true },
    "index.css": { "size": 21, "offset": "1023", "executable": true },
    "pickle.js": { "size": 4626, "offset": "1044" },
    "main.js": { "size": 593, "offset": "5670" }
    ...
  }
}
```

在开头，有一个 files，其对应的值就是被打包进来的文件的名称、大小以及该文件在 asar 文件内部的一个偏移值，这个偏移值（offset）非常重要，回头 Electron可以通过该偏移值在 asar 文件中找到具体的文件内容，从而加载文件内容。

Electron 之所以使用自定义的 asar 文件来存储源代码，有两个原因：

- 性能优化：asar 文件是一个归档文件，这意味着将原本项目中成百上千的小文件合并成了一个单文件。那么操作系统在加载文件的时候，也就只需要加载一个大文件，而非数千个小文件。在某些操作系统中，可以显著的提高读取速度和应用启动的速度。
- 避免文件路径的限制：例如在 windows 操作系统中，默认最长的资源路径的长度为 256 位字符串，那么打包为 asar 归档文件之后，使用的是虚拟路径，绕开了外部文件系统的限制。

#### 制作asar

Electron 官方是提供了相应的工具，帮助我们制作 asar

```bash
npm install -g @electron/asar
```

安装完成后，就可以使用命令：

```bash
asar pack ./项目名 <asar文件名>.asar
```

> 注意，在使用 asar 打包的时候，切换到项目所在的父目录。

打包完成后，我们可以通过 asar list 的命令来查看打包了哪些文件进去。

```bash
asar list app.asar
```

#### 使用asar文件

首先我们新创建一个项目，然后在主进程书写如下的代码：

```js
const { app, BrowserWindow } = require("electron");
const path = require("path");
require(path.join(__dirname, "app.asar", "menu.js"));
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, "app.asar", "window/index.html"));
};

app.whenReady().then(() => {
  createWindow();
});
```

这样就可以将我们之前所写的项目跑起来了。

#### asar文件的意义

实际上像 electron-builder 这样的打包工具，一般在默认情况下也是将项目里面的所有文件进行 asar 归档操作，也方便我们后期介绍诸如像差分升级、electron-builder原理一类的知识。

### 4.3 应用更新

关于更新，我们这里存在两个的方面的准备工作：

- 应用本身要有检查更新的能力
- 准备一个提供资源的服务器

#### 应用本身要有检查更新的能力

这里需要使用一个依赖库 electron-updater

```bash
npm install electron-updater
```

接下来，在主进程中添加检查更新的逻辑即可：

```js
const { autoUpdater } = require("electron-updater");

autoUpdater.autoDownload = false; // 关闭自动下载更新，防止下载失败

// 接下来监听和更新相关的一系列事件，不同的事件做不同的事情

// 有更新可用的情况下会触发该事件
autoUpdater.on("update-available", async () => {
  const result = await dialog.showMessageBox({
    type: "info",
    title: "发现新版本",
    message: "发现新版本，是否立即更新？",
    buttons: ["是", "否"],
  });
  if (result.response === 0) {
    // 说明用户点击了是
    autoUpdater.downloadUpdate(); // 开始下载更新
  }
});

// 出错的时候会触发 error 事件
autoUpdater.on("error", (err) => {
  win.webContents.send("error", err.message);
});

// 监听下载进度
// 每次下载进度更新的时候，该事件就会触发
autoUpdater.on("download-progress", (progressObj) => {
  // 拼接一个下载进度的日志信息
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  win.webContents.send("download-progress", log_message);
});

// 监听更新下载完成事件
autoUpdater.on("update-downloaded", () => {
  // 下载完成后，也给用户一个提示，询问是否立即更新
  dialog
    .showMessageBox({
      type: "info",
      title: "安装更新",
      message: "更新下载完成，应用将重启并安装更新",
      buttons: ["是", "否"],
    })
    .then((result) => {
      if (result.response === 0) {
        // 退出应用并安装更新
        autoUpdater.quitAndInstall();
      }
    });
});

// 需要在加载完成后检查更新
win.once("ready-to-show", () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

接下来我们需要去更新 package.json

```js
"publish": [
  {
    "provider": "generic",
    "url": "http://127.0.0.1:3000/"
  }
],
```

generic 代表的意思是提供更新资源服务的服务器是 HTTP/HTTPS 的服务器，也就是我们自己的服务器，而非某个特定云服务提供商所提供的服务。

另外，需要将 mac 配置项里面的 target 值去掉，这样 target 所对应的值就是 default 默认，到时候进行打包的时候，就会生成 zip 和 dmg 格式的文件。

```js
"mac": {
  "category": "public.app-category.utilities",
},
```

#### 准备一个提供资源的服务器

这里选择 http-server 这个第三方库来作为我们的服务器。

首先安装 http-server

```bash
npm install http-server
```

然后修改 package.json：

```js
"scripts": {
  "start": "http-server static/ -p 3000"
},
```

最后在项目根目录下创建一个 static 目录，将更新的文件放入到该目录下即可。

### 4.4 应用安全性

如果你构建的 Electron 应用目的主要显示本地内容，所有代码都是本地受信任的，即使有远程内容也是受信任的、安全的内容，那么你可以不用太在意这部分的安全性内容。

但如果你需要加载第三方不受信任来源的网站内容并且还要为这些网站提供可以访问、操作文件系统，用户等能力和权限，那么可能会造成重大的安全风险。

Electron 最大的优势是同时融入了 Node.js 和 Chromium，但这也就同时意味着 Electron 要面对来自 Web 和 Node.js 两方面的安全性问题。

#### Web方面安全性

先来看一下 Web 方面的安全性问题

- XSS：全称是跨站脚本攻击（Cross-Site Scripting），是一种在web应用中常见的安全漏洞。它允许攻击者将恶意脚本注入到原本是可信的网站上。用户的浏览器无法判断这些脚本是否可信，因此会执行这些脚本。这可能导致用户信息被窃取、会话被劫持、网站被篡改或是被迫执行不安全的操作。
  - 存储型XSS：恶意脚本被永久地存储在目标服务器上（如数据库、消息论坛、访客留言等），当用户访问这个存储了恶意脚本的页面时，脚本会被执行。
  - 反射型XSS：恶意脚本在URL中被发送给用户，当用户点击这个链接时，服务器将恶意脚本作为页面的一部分返回，然后在用户浏览器上执行。这种攻击通常通过钓鱼邮件等方式实现。
  - 基于DOM的XSS：这种攻击通过在客户端运行的脚本在DOM（文档对象模型）中动态添加恶意代码来实现。它不涉及向服务器发送恶意代码，而是直接在用户的浏览器中执行。

- CSRF：全称是跨站请求伪造（Cross-Site Request Forgery），是一种常见的网络攻击方式。在CSRF攻击中，攻击者诱导受害者访问一个第三方网站，在受害者不知情的情况下，这个第三方网站利用受害者当前的登录状态发起一个跨站请求。这种请求可以是任何形式，如请求转账、修改密码、发邮件等，且对受害者来说是完全透明的。因为请求是在用户已经通过身份验证的会话中发起的，服务器无法区分该请求是用户自愿发起的还是被CSRF攻击所诱导的。

#### Node.js方面安全性

接下来我们来看一下 Node.js 方面所带来的安全性问题。

在 Electron v5 版本之前，Electron 的架构是这样的：

其中，渲染进程和主进程之间的主要沟通桥梁是 remote 模块以及 nodeIntegration，但是在渲染进程中集成了本来只能在 Node 中使用的能力的时候，就给了攻击者一定的发挥空间，渲染进程中的恶意代码可以利用 remote 模块调用主进程的任意代码，从而控制整个应用和底层操作系统，这种安全问题是非常严重的，这在前面第一章，我们介绍 preload 的时候也有提到过。

举个例子：比如我们通过 Electron 的 BrowserWindow 模块加载了一个三方网站，然后这个网站中存在着这样的一段代码：

```html
<img onerror="require('child_process').exec('rm -rf *')" />
```

这种第三方网站不受信任的代码就会造成对计算机的伤害。所以如何防止这样问题的发生，那就是不要授予这些网站直接操作 node 的能力，也就意味着遵循**最小权限原则**，只赋予应用程序所需的最低限度权限。

所以，从 Electron v5 开始，Electron 默认关闭这些不安全的选项，并默认选择更安全的选项。渲染器和主进程之间的通信被解耦，变得更加安全。

IPC 可用于在主进程和渲染进程之间通信，而 preload 脚本可以扩展渲染进程的功能，提供必要的操作权限，这种责任分离使我们能够应用最小权限原则。

#### 常见措施

##### 1. 使用preload.js和上下文隔离

在 Electron 最新版本中，默认都是关闭了渲染进程对 Node.js API 的集成，那么如果渲染进程需要使用某一些 Node.js 的 API，通过 preload.js 的方式暴露出去。

另外，新版的 Electron 还会开启一个上下文隔离，所谓上下文隔离，指的是渲染进程（网页）对应的 JS 执行环境和 Electron API 的执行环境是隔离开的，这意味着网页的 JS 是无法直接访问 Electron API 的，如果想要使用某些 API，必须通过 preload.js 暴露，然后才能使用，这也就是所谓的最小权限原则。

平时授课的时候，仅仅是为了方面，所以打开了 nodeIntegration，关闭了 contextIsolation，但是在实际开发中，同学们一定要记得通过 preload.js 去最小程度的暴露 API。

##### 2. 开启沙盒模式

从 Electron 20 版本开始，默认就会开启沙盒模式。沙盒模式的主要目录也就是起到一个主进程和渲染进程之间隔离的作用。

同样作为隔离，上下文隔离和沙盒模式的隔离会有所不同：

- sandbox：通过创建一个限制环境来隔离渲染进程，属于进程级别的隔离，相当于进程都不一样了。
- contextIsolation：分离网页内容的 JS 和 Electron 代码的执行上下文，属于上下文级别的隔离。也就是说，是属于同一个进程内容，但是通过隔离上下文的方式来防止不安全的交互。

两者之间有一个明显的区别，如果仅仅是上下文隔离，那么在 preload.js 中是能够访问 Node.js 的 API 的。

但是如果开启了沙盒模式，那么在 preload.js 里面都无法访问 Node.js 的 API 了。

另外注意，在沙盒模式下，preload.js 中仍然可以使用一部分以 polyfill 形式所提供的 Node.js API 的子集。

- events
- timers
- url
- ipcRenderer

例如在 preload.js 中：

```js
const events = require("events");
const timers = require("timers");
const url = require("url");
console.log(events);
console.log(timers);
console.log(url);
```

我们可以使用这几个模块。

在沙盒模式下，如果 preload.js 里面想要使用某些 Node.js 的 API，这些 API 又不属于 polyfill 里面的，那么就需要再做一次封装，由主进程来提供相关的方法。

##### 3. 开启webSecurity

开启该配置项之后，会启动浏览器的同源策略，一些跨域资源请求就会被拦截。

webSecurity 一般也是默认开启的。

##### 4. 限制网页的跳转

如果你的应用存在自动跳转的行为，那么我们最好将导航严格限制在特定范围内。

可以通过在 will-navigate 生命周期方法中阻止默认事件，然后再做一个白名单的校验：

```js
const { URL } = require('url')
const { app } = require('electron')

app.on('web-contents-created', (event, contents) => {
  // will-navigate 是在跳转之前会触发
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
		// 这里进行一个白名单的校验，如果跳转的地址和我预期不符合，那么我们就阻止默认事件
    if (parsedUrl.origin !== 'https://example.com') {
      event.preventDefault()
    }
  })
})
```

最后，做一个总结，Electron 安全性的原则是基于最小化权限为前提的，也就是说，我们只为渲染进程提供最必要的权限，其他的相关操作的 API 通通不暴露出去。

另外在 Electron 官网，也总结了关于提升应用安全性的一些措施：https://www.electronjs.org/zh/docs/latest/tutorial/security

### 4.5 异常处理

在 Node.js 中，如果存在未捕获的异常，那么就会导致程序退出。

```js
const invalidJSON = "{name: 'Front-End Wizard', age: 25;}";
JSON.parse(invalidJSON);
console.log("后续代码...");
```

在上面的代码中，JSON.parse 进行解析的时候会产生异常，抛出 SyntaxError 的错误，程序也就终止了，后面的代码不会再被执行。

对于基于 Node.js 的 Electron 来讲，也同样存在这样不稳定的因素。

因此，在编写代码的过程中，对异常的处理就非常重要。

常见的异常处理分为两大类：

- 局部异常处理
- 全局异常处理

#### 局部异常处理

所谓局部异常处理，指的就是开发人员在编写代码的过程中，意识到某一处可能会产生异常，于是有意识的捕获和处理异常。

```js
const invalidJSON = "{name: 'Front-End Wizard', age: 25;}";
try {
  JSON.parse(invalidJSON);
} catch (e) {
  console.error("解析 JSON 时发生错误：", e.message);
}
console.log("后续代码...");
```

在上面的代码中，我们使用 try 包括 JSON.parse 这一段解析逻辑，当产生异常的时候，会进入到 catch，catch 里面会对异常进行处理，这样子的话即便产生了异常，程序也能够继续往后面执行，不会被中断。

常见需要捕获异常的地方：

- 数据库连接
- 网络请求
- ...

不过，局部异常处理，会存在两个问题：

1. 和业务逻辑有很大的相关性
2. 非常依赖于开发人员的代码质量意识

在真实项目，往往会遇到很多本来应该去捕获异常的地方，忘记去捕获了，因此在这种时候，我们就需要第二种异常处理机制：全局异常处理。

#### 全局异常处理

无论是 Node.js 环境还是 Chromium 环境，都提供了相应的全局事件，我们可以通过这些事件来捕获异常。

- Node.js 环境：对应的事件注册对象为 process
  - 事件名：uncaughtException
  - 事件名：unhandledRejection
- Chromium 环境：对应的事件注册对象为 window
  - 事件名：error
  - 事件名：unhandledRejection

因此，我们可以在我们的项目中，单独书写一个模块，进行全局的异常捕获。

```js
let isInited = false; // 检查是否已经初始化

function initErrorHandler() {
  if (isInited) return;
  if (!isInited) {
    // 进行初始化操作
    isInited = true;
    if (process.type === "renderer") {
      // 进入此分支，说明是来自渲染进程的错误
      window.addEventListener("error", (e) => {
        e.preventDefault();
        console.log("这是来自于渲染进程的 error 类型的异常");
        console.log(e.error);
      });
      window.addEventListener("unhandledRejection", (e) => {
        e.preventDefault();
        console.log("这是来自于渲染进程的 unhandledRejection 类型的异常");
        console.log(e.reason);
      });
    } else {
      // 进入此分支，说明是来自主进程的错误
      process.on("uncaughtException", (error) => {
        console.log("这是来自于主进程的 uncaughtException 类型的异常");
        console.log(error);
      });
      process.on("unhandledRejection", (error) => {
        console.log("这是来自于主进程的 unhandledRejection 类型的异常");
        console.log(error);
      });
    }
  }
}

module.exports = initErrorHandler;
```

#### 关于同步异常和异步异常

在上面，虽然我们添加了全局的异常捕获处理模块，但是这是针对异步的全局错误进行的捕获，例如：

- 正常该捕获但是忘了捕获的异常
- 未处理的 promise 拒绝

也就是说，这里的全局异常捕获模块，是作为 **最后一道防线**。

一般来讲，针对同步的异常，例如上面的 JSON.parse 这一类的异常，仍然是应该通过 try ... catch 去捕获的，除非开发人员实在是忘了进行同步捕获，那么我们就在全局异常捕获模块（最后一道防线）将其捕获到。

```js
const initErrorHandler = require("../errorHandler");
initErrorHandler();

const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
  const invalidJSON = "{name: 'Front-End Wizard', age: 25;}";
  try {
    JSON.parse(invalidJSON);
  } catch (e) {
    console.error("解析 JSON 时发生错误：", e.message);
  }
  console.log("后续代码...");
});
```

最后，我们可以对我们的全局异常处理模块再次进行封装，使其同时支持捕获同步异常和异步异常，以及全局异常处理模块：

```js
let isInited = false; // 检查是否已经初始化
module.exports = {
  // 初始化全局异常处理模块
  initGlobalErrorHandler: function () {
    if (isInited) return;
    if (!isInited) {
      // 进行初始化操作
      isInited = true;
      if (process.type === "renderer") {
        // 进入此分支，说明是来自渲染进程的错误
        window.addEventListener("error", (e) => {
          e.preventDefault();
          console.log("这是来自于渲染进程的 error 类型的异常");
          console.log(e.error);
        });
        window.addEventListener("unhandledRejection", (e) => {
          e.preventDefault();
          console.log("这是来自于渲染进程的 unhandledRejection 类型的异常");
          console.log(e.reason);
        });
      } else {
        // 进入此分支，说明是来自主进程的错误
        process.on("uncaughtException", (error) => {
          console.log("这是来自于主进程的 uncaughtException 类型的异常");
          console.log(error);
        });
        process.on("unhandledRejection", (error) => {
          console.log("这是来自于主进程的 unhandledRejection 类型的异常");
          console.log(error);
        });
      }
    }
  },
  // 用于捕获同步代码的异常
  captureSyncErrors: function (func) {
    try {
      func();
    } catch (error) {
      console.error("捕获到同步代码的异常：", error);
      // 这里往往会添加后续的逻辑，比如将错误信息发送到服务器，记录到错误日志中等
    }
  },
  // 用于捕获异步代码的异常
  captureAsyncErrors: async function (asyncFunc) {
    try {
      await asyncFunc();
    } catch (error) {
      console.error("捕获到异步代码的异常：", error);
      // 这里往往会添加后续的逻辑，比如将错误信息发送到服务器，记录到错误日志中等
    }
  },
};
```

### 4.6 日志记录

#### mkdirp

mkdirp 是一个在 Node.js 环境下非常实用的小工具，其主要功能是允许你以递归的方式创建目录。

这意味着你可以一次性创建多层嵌套的目录，而不需要手动地一层一层地检查和创建。这在处理文件系统时特别有用，尤其是当你的应用需要在运行时生成一系列复杂的目录结构时。

**主要特性**

- **递归创建目录**：最大的特点就是能够递归创建目录，无需担心中间目录是否存在。
- **简单易用**：API 简单，易于集成和使用。
- **兼容性**：兼容各种版本的 Node.js。

**使用方法**

1. 安装

通过 npm 或 yarn 可以很容易地安装mkdirp：

```bash
npm install mkdirp
# 或者
yarn add mkdirp
```

2. 示例代码

使用 mkdirp 创建一个嵌套目录结构的示例代码如下：

```js
const mkdirp = require('mkdirp');

// 创建多层嵌套目录
mkdirp('/tmp/foo/bar/baz')
  .then(made => console.log(`目录已创建于 ${made}`))
  .catch(error => console.error(`创建目录时出错: ${error}`));
```

在这个示例中，/tmp/foo/bar/baz目录（以及所有中间目录）将被创建。如果目录已经存在，则不会执行任何操作。

>在 Node.js 版本 10.12.0 及以上，fs 模块已经原生支持了 mkdir 的 { recursive: true } 选项，使得 mkdirp 的功能可以通过原生 fs 直接实现。不过，对于旧版本的 Node.js 或者需要mkdirp提供的特殊功能，mkdirp 仍然是一个非常有用的库。

#### log4js

log4js是一个在Node.js环境中使用的流行日志管理工具，灵感来源于Apache的log4j库。它提供了一个功能强大、灵活的日志记录解决方案，让开发者能够控制日志信息的输出位置和输出级别。这对于开发大型应用和系统时进行问题追踪和性能监控尤其重要。

**主要特性**

- **多种日志记录级别**：支持标准的日志记录级别，如TRACE、DEBUG、INFO、WARN、ERROR、FATAL，使得开发者可以根据需要输出不同重要程度的信息。
- **灵活的日志输出**：可以配置将日志输出到不同的地方，比如控制台、文件、远程服务器等。
- **日志分割**：支持按文件大小或日期自动分割日志文件，便于管理和维护。
- **自定义布局**：允许自定义日志信息的格式，使得日志信息更加符合项目需求。
- **性能**：设计上考虑到了性能，尽量减少日志记录对应用性能的影响。

**配置和使用**

1. 安装

首先，在Node.js项目中安装log4js。通过npm或yarn即可安装：

```bash
npm install log4js --save
# 或者
yarn add log4js
```

2. 简单配置

安装完毕后，你就可以在项目中引入并使用 log4js 了。下面是一个基本的配置示例：

```js
const log4js = require('log4js');

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'application.log' }
  },
  categories: {
    default: { appenders: ['out', 'app'], level: 'debug' }
  }
});

const logger = log4js.getLogger();
logger.debug("Some debug messages");
```

在这个例子中，我们配置了两个 appender：

- 一个是输出到控制台（stdout）
- 另一个是输出到名为application.log的文件。

我们还设置了默认的日志级别为 debug，这意味着所有 debug 及以上级别的日志都会被记录。

3. 进阶配置

log4js 的配置非常灵活，支持更多高级特性，比如日志分割、自定义日志格式等。

这里是一个配置日志分割的例子：

```js
log4js.configure({
  appenders: {
    everything: { type: 'dateFile', filename: 'all-the-logs.log', pattern: '.yyyy-MM-dd', compress: true }
  },
  categories: {
    default: { appenders: ['everything'], level: 'debug' }
  }
});
```

这个配置会将日志输出到一个文件中，并且每天自动创建一个新的文件，旧的日志文件会被压缩保存。

#### Sentry

Sentry 是一个开放源代码的错误追踪工具，它可以帮助开发者实时监控和修复应用程序中的错误。Sentry 支持多种编程语言和框架，包括 JavaScript、Python、PHP、Ruby、Java、.NET、iOS 和 Android 等，非常适用于跨平台应用程序的错误监控。通过在应用程序中集成 Sentry，开发者可以获得详细的错误报告，包括错误发生的时间、环境、导致错误的代码行以及影响的用户等信息。

Sentry 对应的官网：https://sentry.io/welcome/

**Sentry 的主要特点**

- **实时错误追踪**：Sentry 提供实时错误追踪功能，当应用程序出现错误时，能够立即通知开发者，帮助快速定位问题。
- **跨平台支持**：支持广泛的编程语言和平台，使得几乎所有类型的应用程序都能利用 Sentry 进行错误追踪。
- **详细的错误报告**：错误报告包括堆栈跟踪、影响的用户、错误发生的环境和上下文信息，使得开发者可以更容易地理解和解决问题。
- **问题分组和聚合**：Sentry 自动将相似的错误报告分组，便于管理和分析大量的错误。
- **性能监控**：除了错误追踪，Sentry 还提供性能监控功能，帮助开发者了解应用程序的性能瓶颈。
- **集成和通知**：可以与常用的开发工具和通讯平台（如 Slack、GitHub、Jira 等）集成，使得错误处理流程更加高效。

**如何使用 Sentry**

使用 Sentry 通常包括以下几个步骤：

1. **注册并创建项目**：在 Sentry 网站注册账户，并为你的应用程序创建一个新项目。
2. **集成 SDK**：根据你的应用程序所使用的编程语言或平台，选择合适的 Sentry SDK 并集成到你的应用程序中。
3. **配置和定制**：根据需要配置 Sentry SDK，例如设置错误捕获的级别、自定义错误报告信息等。
4. **监控和解决错误**：部署应用程序后，通过 Sentry 的控制台监控错误，使用提供的详细信息快速定位和解决问题。

注册了 Sentry 之后，官方会为我们提供一组 SDK

接下来回到我们的项目，我们需要在我们的项目中安装 Sentry 相关的依赖：

```bash
npm install --save @sentry/electron
```

安装完成后，在我们自己的项目里面配置相关的 SDK 即可。

```js
const { init } = require("@sentry/electron");
init({
  dsn: "你自己的SDK",
});
```

---

## 第五章 底层原理（待补充）

这一章主要是聚焦于 Electron 底层一些比较重要的特性，针对一些非常重要的代码片段进行剖析。

- Electron 源码目录的结构
- Electron 如何做到跨平台
- Electron 本身 API 是如何为开发者提供支持的
- 进程间是如何通信
- ...

还会包含一些和 Electron 相关的周边工具的原理剖析

- electron-builder
- electron-updater

以及还会介绍一些看似和 Electron 工程没有关系，但是其实是比较重要的一些原理。

- V8引擎执行的原理
- 垃圾回收相关原理

---

## 第六章 Electron常见开发需求（待补充）

- 点对点通信
- 拼写检查
- 窗口池
- 原生文件的拖放
- 最近文件列表
- 屏幕截图

该章节是一个长期更新的章节。
