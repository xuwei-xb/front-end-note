# CSS 核心概念详解：包含块与属性计算过程

## 引言
CSS 作为网页样式设计的核心语言，其背后隐藏着许多精妙的设计原理。其中，包含块（Containing Block）和属性计算过程是理解 CSS 布局和样式渲染的关键概念。本文将深入探讨这两个核心概念，帮助你更好地掌握 CSS 的底层运作机制。

## 第一部分：CSS 包含块（Containing Block）

### 什么是包含块
一说到 CSS 盒模型，这是很多小伙伴耳熟能详的知识，甚至有的小伙伴还能说出 border-box 和 content-box 这两种盒模型的区别。但是一说到 CSS 包含块，有的小伙伴就懵圈了，什么是包含块？好像从来没有听说过这玩意儿。

好吧，如果你对包含块的知识一无所知，那么系好安全带，咱们准备出发了。包含块英语全称为**containing block**，实际上平时你在书写 CSS 时，大多数情况下你是感受不到它的存在，因此你不知道这个知识点也是一件很正常的事情。但是这玩意儿是确确实实存在的，在 CSS 规范中也是明确书写了的：
*https://drafts.csswg.org/css2/#containing-block-details*

并且，如果你不了解它的运作机制，有时就会出现一些你认为的莫名其妙的现象。

那么，这个包含块究竟说了什么内容呢？

说起来也简单，**就是元素的尺寸和位置，会受它的包含块所影响。对于一些属性，例如 width, height, padding, margin，绝对定位元素的偏移值（比如 position 被设置为 absolute 或 fixed），当我们对其赋予百分比值时，这些值的计算值，就是通过元素的包含块计算得来。**

### 包含块的基本示例
来吧，少年，让我们从最简单的 case 开始看。

```html
<body>
  <div class="container">
    <div class="item"></div>
  </div>
</body>
```

```css
.container{
  width: 500px;
  height: 300px;
  background-color: skyblue;
}
.item{
  width: 50%;
  height: 50%;
  background-color: red;
}
```

请仔细阅读上面的代码，然后你认为 div.item 这个盒子的宽高是多少？

相信你能够很自信的回答这个简单的问题，div.item 盒子的 width 为 250px，height 为 150px。

这个答案确实是没有问题的，但是如果我追问你是怎么得到这个答案的，我猜不了解包含块的你大概率会说，因为它的父元素 div.container 的 width 为 500px，50% 就是 250px，height 为 300px，因此 50% 就是 150px。

这个答案实际上是不准确的。正确的答案应该是，**div.item 的宽高是根据它的包含块来计算的**，而这里包含块的大小，正是这个元素最近的祖先块元素的内容区。

因此正如我前面所说，**很多时候你都感受不到包含块的存在。**

### 包含块的分类
包含块分为两种，一种是根元素（HTML 元素）所在的包含块，被称之为初始包含块（**initial containing block**）。对于浏览器而言，初始包含块的的大小等于视口 viewport 的大小，基点在画布的原点（视口左上角）。它是作为元素绝对定位和固定定位的参照物。

另外一种是对于非根元素，对于非根元素的包含块判定就有几种不同的情况了。大致可以分为如下几种：

1. **position: relative 或 static**：包含块由离它最近的块容器（block container）的内容区域（content area）的边缘建立。
2. **position: fixed**：包含块由视口建立。
3. **position: absolute**：包含块由它的最近的 position 的值不是 static （也就是值为fixed、absolute、relative 或 sticky）的祖先元素的内边距区的边缘组成。

### 绝对定位元素的包含块
前面两条实际上都还比较好理解，第三条往往是初学者容易比较忽视的，我们来看一个示例：

```html
<body>
    <div class="container">
      <div class="item">
        <div class="item2"></div>
      </div>
    </div>
  </body>
```

```css
.container {
  width: 500px;
  height: 300px;
  background-color: skyblue;
  position: relative;
}
.item {
  width: 300px;
  height: 150px;
  border: 5px solid;
  margin-left: 100px;
}
.item2 {
  width: 100px;
  height: 100px;
  background-color: red;
  position: absolute;
  left: 10px;
  top: 10px;
}
```

首先阅读上面的代码，然后你能在脑海里面想出其大致的样子么？或者用笔和纸画一下也行。

公布正确答案：div.item2 的包含块是 div.container，而不是 div.item。这是因为 div.container 是最近的 position 值不是 static 的祖先元素。

### 特殊情况下的包含块
实际上对于非根元素来讲，包含块还有一种可能，那就是如果 position 属性是 absolute 或 fixed，包含块也可能是由满足以下条件的最近父级元素的内边距区的边缘组成的：

- transform 或 perspective 的值不是 none
- will-change 的值是 transform 或 perspective 
- filter 的值不是 none 或 will-change 的值是 filter(只在 Firefox 下生效). 
- contain 的值是 paint (例如: contain: paint;)

我们还是来看一个示例：

```html
<body>
  <div class="container">
    <div class="item">
      <div class="item2"></div>
    </div>
  </div>
</body>
```

```css
.container {
  width: 500px;
  height: 300px;
  background-color: skyblue;
  position: relative;
}
.item {
  width: 300px;
  height: 150px;
  border: 5px solid;
  margin-left: 100px;
  transform: rotate(0deg); /* 新增代码 */
}
.item2 {
  width: 100px;
  height: 100px;
  background-color: red;
  position: absolute;
  left: 10px;
  top: 10px;
}
```

我们对于上面的代码只新增了一条声明，那就是 transform: rotate(0deg)，此时的渲染效果却发生了改变。可以看到，此时对于 div.item2 来讲，包含块就变成了 div.item。

### CSS 规范中的示例
我们再把 CSS 规范中所举的例子来看一下。

```html
<html>
  <head>
    <title>Illustration of containing blocks</title>
  </head>
  <body id="body">
    <div id="div1">
      <p id="p1">This is text in the first paragraph...</p>
      <p id="p2">
        This is text
        <em id="em1">
          in the
          <strong id="strong1">second</strong>
          paragraph.
        </em>
      </p>
    </div>
  </body>
</html>
```

上面是一段简单的 HTML 代码，在没有添加任何 CSS 代码的情况下，你能说出各自的包含块么？

对应的结果如下：

| 元素    | 包含块                      |
| ------- | --------------------------- |
| html    | initial C.B. (UA-dependent) |
| body    | html                        |
| div1    | body                        |
| p1      | div1                        |
| p2      | div1                        |
| em1     | p2                          |
| strong1 | p2                          |

首先 HTML 作为根元素，对应的包含块就是前面我们所说的初始包含块，而对于 body 而言，这是一个 static 定位的元素，因此该元素的包含块参照第一条为 html，以此类推 div1、p1、p2 以及 em1 的包含块也都是它们的父元素。

不过 strong1 比较例外，它的包含块确实 p2，而非 em1。为什么会这样？建议你再把非根元素的第一条规则读一下：

- 如果元素的 positiion 是 relative 或 static ，那么包含块由离它最近的**块容器（block container）**的内容区域（content area）的边缘建立。

没错，因为 em1 不是块容器，而包含块是**离它最近的块容器**的内容区域，所以是 p2。

接下来添加如下的 CSS：

```css
#div1 { 
  position: absolute; 
  left: 50px; top: 50px 
}
```

上面的代码我们对 div1 进行了定位，那么此时的包含块会发生变化么？你可以先在自己思考一下。

答案如下：

| 元素    | 包含块                      |
| ------- | --------------------------- |
| html    | initial C.B. (UA-dependent) |
| body    | html                        |
| div1    | initial C.B. (UA-dependent) |
| p1      | div1                        |
| p2      | div1                        |
| em1     | p2                          |
| strong1 | p2                          |

可以看到，这里 div1 的包含块就发生了变化，变为了初始包含块。这里你可以参考前文中的这两句话：

- 初始包含块（**initial containing block**）。对于浏览器而言，初始包含块的的大小等于视口 viewport 的大小，基点在画布的原点（视口左上角）。它是作为元素绝对定位和固定定位的参照物。
- 如果元素使用了 absolute 定位，则包含块由它的最近的 position 的值不是 static （也就是值为fixed、absolute、relative 或 sticky）的祖先元素的内边距区的边缘组成。

是不是一下子就理解了。没错，因为我们对 div1 进行了定位，因此它会应用非根元素包含块计算规则的第三条规则，寻找离它最近的  position 的值不是 static 的祖先元素，不过显然 body 的定位方式为 static，因此 div1 的包含块最终就变成了初始包含块。

接下来我们继续修改我们的 CSS：

```css
#div1 { 
  position: absolute; 
  left: 50px; 
  top: 50px 
}
#em1  { 
  position: absolute; 
  left: 100px; 
  top: 100px 
}
```

这里我们对 em1 同样进行了 absolute 绝对定位，你想一想会有什么样的变化？

没错，聪明的你大概应该知道，em1 的包含块不再是 p2，而变成了 div1，而 strong1 的包含块也不再是 p2 了，而是变成了 em1。

如下表所示：

| 元素    | 包含块                                                       |
| ------- | ------------------------------------------------------------ |
| html    | initial C.B. (UA-dependent)                                  |
| body    | html                                                         |
| div1    | initial C.B. (UA-dependent)                                  |
| p1      | div1                                                         |
| p2      | div1                                                         |
| em1     | div1（因为定位了，参阅非根元素包含块确定规则的第三条）       |
| strong1 | em1（因为 em1 变为了块容器，参阅非根元素包含块确定规则的第一条） |

### 包含块的实际应用
了解包含块的概念对于理解 CSS 布局至关重要。在实际开发中，包含块的概念经常用于以下场景：

1. **绝对定位元素的定位**：绝对定位元素的位置是相对于其包含块计算的。
2. **百分比单位的计算**：当元素使用百分比单位时，其值是相对于包含块计算的。
3. **CSS 变换的参考系**：当元素应用 CSS 变换时，变换的参考系是其包含块。

### 扩展阅读
关于包含块的知识，在 MDN 上除了解说了什么是包含块以外，也举出了很多简单易懂的示例。具体你可以移步到：*https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_block*

## 第二部分：CSS 属性计算过程

### 引言
你是否了解 CSS 的属性计算过程呢？

有的同学可能会讲，CSS属性我倒是知道，例如：

```css
p{
  color : red;
}
```

上面的 CSS 代码中，p 是元素选择器，color 就是其中的一个 CSS 属性。

但是要说 CSS 属性的计算过程，还真的不是很清楚。

没关系，通过此篇文章，能够让你彻底明白什么是 CSS 属性的计算流程。

### 完整的 CSS 样式
首先，不知道你有没有考虑过这样的一个问题，假设在 HTML 中有这么一段代码：

```html
<body>
  <h1>这是一个h1标题</h1>
</body>
```

上面的代码也非常简单，就是在 body 中有一个 h1 标题而已，该 h1 标题呈现出来的外观是默认样式，例如有默认的字体大小、默认的颜色。

那么问题来了，我们这个 h1 元素上面除了有默认字体大小、默认颜色等属性以外，究竟还有哪些属性呢？

答案是**该元素上面会有 CSS 所有的属性。**你可以打开浏览器的开发者面板，选择【元素】，切换到【计算样式】，之后勾选【全部显示】，此时你就能看到在此 h1 上面所有 CSS 属性对应的值。

换句话说，**我们所书写的任何一个 HTML 元素，实际上都有完整的一整套 CSS 样式**。这一点往往是让初学者比较意外的，因为我们平时在书写 CSS 样式时，往往只会书写必要的部分，例如前面的：

```css
p{
  color : red;
}
```

这往往会给我们造成一种错觉，认为该 p 元素上面就只有 color 属性。而真实的情况确是，任何一个 HTML 元素，都有一套完整的 CSS 样式，只不过你没有书写的样式，**大概率可能**会使用其默认值。例如上图中 h1 一个样式都没有设置，全部都用的默认值。

但是注意，我这里强调的是“大概率可能”，难道还有我们“没有设置值，但是不使用默认值”的情况么？

嗯，确实有的，所以我才强调你要了解“CSS 属性的计算过程”。

### 属性计算的四个步骤
总的来讲，属性值的计算过程，分为如下这么 *4* 个步骤：

1. **确定声明值**：使用作者编写的 CSS 样式和浏览器默认样式。
2. **层叠冲突**：解决不同样式声明之间的冲突。
3. **使用继承**：从父元素继承可继承的属性值。
4. **使用默认值**：如果以上步骤都无法确定属性值，则使用 CSS 规范定义的默认值。

#### 步骤一：确定声明值
首先第一步，是确定声明值。所谓声明值就是作者自己所书写的 CSS 样式，例如前面的：

```css
p{
  color : red;
}
```

这里我们声明了 p 元素为红色，那么就会应用此属性设置。

当然，除了作者样式表，一般浏览器还会存在“用户代理样式表”，简单来讲就是浏览器内置了一套样式表。

在上面的示例中，作者样式表中设置了 color 属性，而用户代理样式表（浏览器提供的样式表）中设置了诸如 display、margin-block-start、margin-block-end、margin-inline-start、margin-inline-end 等属性对应的值。

这些值目前来讲也没有什么冲突，因此最终就会应用这些属性值。

#### 步骤二：层叠冲突
在确定声明值时，可能出现一种情况，那就是声明的样式规则发生了冲突。此时会进入解决层叠冲突的流程。而这一步又可以细分为下面这三个步骤：

1. **比较源的重要性**
2. **比较优先级**
3. **比较次序**

##### 比较源的重要性
当不同的 CSS 样式来源拥有相同的声明时，此时就会根据样式表来源的重要性来确定应用哪一条样式规则。

整体来讲有三种来源：

- 浏览器会有一个基本的样式表来给任何网页设置默认样式。这些样式统称**用户代理样式**。
- 网页的作者可以定义文档的样式，这是最常见的样式表，称之为**页面作者样式**。
- 浏览器的用户，可以使用自定义样式表定制使用体验，称之为**用户样式**。

对应的重要性顺序依次为：页面作者样式 > 用户样式 > 用户代理样式

更详细的来源重要性比较，可以参阅 *MDN*：*https://developer.mozilla.org/zh-CN/docs/Web/CSS/Cascade*

我们来看一个示例。例如现在有**页面作者样式表**和**用户代理样式表**中存在属性的冲突，那么会以作者样式表优先。

```css
p{
  color : red;
  display: inline-block;
}
```

可以明显的看到，作者样式表和用户代理样式表中同时存在的 display 属性的设置，最终作者样式表干掉了用户代理样式表中冲突的属性。这就是第一步，根据不同源的重要性来决定应用哪一个源的样式。

##### 比较优先级
那么接下来，如果是在在同一个源中有样式声明冲突怎么办呢？此时就会进行样式声明的优先级比较。

例如：

```html
<div class="test">
  <h1>test</h1>
</div>
```

```css
.test h1{
  font-size: 50px;
}

h1 {
  font-size: 20px;
}
```

在上面的代码中，同属于**页面作者样式**，源的重要性是相同的，此时会以选择器的权重来比较重要性。很明显，上面的选择器的权重要大于下面的选择器，因此最终标题呈现为 *50px*。

可以看到，落败的作者样式在 *Elements>Styles* 中会被划掉。

有关选择器权重的计算方式，不清楚的同学，可以进入此传送门：*https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity*

##### 比较次序
经历了上面两个步骤，大多数的样式声明能够被确定下来。但是还剩下最后一种情况，那就是样式声明既是同源，权重也相同。此时就会进入第三个步骤，比较样式声明的次序。

举个例子：

```css
h1 {
  font-size: 50px;
}

h1 {
  font-size: 20px;
}
```

在上面的代码中，同样都是**页面作者样式**，**选择器的权重也相同**，此时位于下面的样式声明会层叠掉上面的那一条样式声明，最终会应用 *20px* 这一条属性值。

至此，样式声明中存在冲突的所有情况，就全部被解决了。

#### 步骤三：使用继承
层叠冲突这一步完成后，解决了相同元素被声明了多条样式规则究竟应用哪一条样式规则的问题。那么如果没有声明的属性呢？此时就使用默认值么？

*No、No、No*，别急，此时还有第三个步骤，那就是使用继承而来的值。

例如：

```html
<div>
  <p>Lorem ipsum dolor sit amet.</p>
</div>
```

```css
div {
  color: red;
}
```

在上面的代码中，我们针对 div 设置了 color 属性值为红色，而针对 p 元素我们没有声明任何的属性，但是由于 color 是可以继承的，因此 p 元素从最近的 div 身上继承到了 color 属性的值。

这里有两个点需要同学们注意一下。

首先第一个是我强调了是**最近的** div 元素，看下面的例子：

```html
<div class="test">
  <div>
    <p>Lorem ipsum dolor sit amet.</p>
  </div>
</div>
```

```css
div {
  color: red;
}
.test{
  color: blue;
}
```

因为这里并不涉及到选中 p 元素声明 color 值，而是从父元素上面继承到 color 对应的值，因此这里是**谁近就听谁**的，初学者往往会产生混淆，又去比较权重，但是这里根本不会涉及到权重比较，因为压根儿就没有选中到 p 元素。

第二个就是哪些属性能够继承？关于这一点的话，大家可以在 MDN 上面很轻松的查阅到。例如我们以 text-align 为例，可以在 MDN 文档中看到该属性是可以继承的。

#### 步骤四：使用默认值
好了，目前走到这一步，如果属性值都还不能确定下来，那么就只能是使用默认值了。

前面我们也说过，一个 HTML 元素要在浏览器中渲染出来，必须具备所有的 CSS 属性值，但是绝大部分我们是不会去设置的，用户代理样式表里面也不会去设置，也无法从继承拿到，因此最终都是用默认值。

### 面试题解析
好了，学习了今天的内容，让我来用一道面试题测试测试大家的理解程度。

下面的代码，最终渲染出来的效果，a 元素是什么颜色？p 元素又是什么颜色？

```html
<div>
  <a href="">test</a>
  <p>test</p>
</div>
```

```css
div {
  color: red;
}
```

大家能说出为什么会呈现这样的结果么？

解答如下：

实际上原因很简单，因为 a 元素在用户代理样式表中已经设置了 color 属性对应的值，因此会应用此声明值。而在 p 元素中无论是作者样式表还是用户代理样式表，都没有对此属性进行声明，然而由于 color 属性是可以继承的，因此最终 p 元素的 color 属性值通过继承来自于父元素。

## 总结
CSS 包含块和属性计算过程是理解 CSS 布局和样式渲染的核心概念。包含块决定了元素的尺寸和位置计算的参考系，而属性计算过程则决定了元素最终应用的样式值。

掌握这两个概念对于编写高效、可维护的 CSS 代码至关重要。希望通过本文的讲解，你对这两个核心概念有了更深入的理解。

---

-*EOF*-
