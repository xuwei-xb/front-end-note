

### 程序的可扩展性
<font style="color:rgb(31, 35, 40);">可扩展性是指系统、程序或技术架构在功能、规模及性能需求增加时，能够容易地增加其性能、容量和功能的能力。</font>

<font style="color:rgb(31, 35, 40);"></font>

#### <font style="color:rgb(31, 35, 40);">示例</font>
<font style="color:rgb(31, 35, 40);">假设我们有一个国际化网站，我们希望根据用户选择的语言动态显示不同的内容，比如在网站首页展示一个欢迎语，不考虑扩展性，可能的实现方式如下：</font>

```vue
<!--Vue实现示例-->
<template>
  <div>
    <h1> 
      {{language === 'en' ? 'Hello' : '你好' }}
    </h1>
    <div>
      {{language === 'en' ? 'Welcome to our website!' : '欢迎访问我们网站!' }}
    </div>
  </div>
</template>
```



<font style="color:rgb(31, 35, 40);">随着公司业务的发展，领导现在要求需要支持法语，如果我们采用上述方式实现这个功能，势必会要进行大量的修改。</font>

<font style="color:rgb(31, 35, 40);">这里可以采用策略模式进行修改，代码如下：</font>

```javascript
const translations = {
  zh: {
    greeting: '你好',
    message: '欢迎访问我们网站!'
  },
  en: {
    greeting: 'Hello',
    message: 'Welcome to our website!'
  },
  fr: {
    greeting: 'Bonjour',
    message: 'Bienvenue sur notre site web!'
  },
  // other language translations...
};

export default translations;
```

```vue
<!--Vue实现示例-->
<template>
  <div>
    <h1> 
      {{translations[language].greeting}}
    </h1>
   <div>
      {{translations[language].message}}
   </div>
  </div>
</template>
```



### 程序的API
<font style="color:rgb(31, 35, 40);">API 全称：Application Programming Interface（应用程序编程接口），API 就是一组让别人可以“使用你功能”的“说明书”或“中介”。</font>

#### <font style="color:rgb(31, 35, 40);">示例</font>
```vue
<!--Vue选项式 API-->
<script>
export default {
  data() {
    return {
      title: '商品列表',
      keyword: '',
      list: [
        { id: 1, name: '苹果' },
        { id: 2, name: '香蕉' },
        { id: 3, name: '橙子' }
      ]
    };
  },
  mounted() {
    console.log('组件已挂载，开始加载数据...');
    // 模拟请求数据
    setTimeout(() => {
      this.list.push({ id: 4, name: '梨子' });
    }, 1000);
  },
  computed: {
    filteredList() {
      if (!this.keyword) return this.list;
      return this.list.filter(item =>
        item.name.includes(this.keyword)
      );
    }
  },
  watch: {
    keyword(newVal, oldVal) {
      console.log(`关键词从 "${oldVal}" 改成了 "${newVal}"`);
      // 可以添加节流搜索等逻辑
    }
  },
  methods: {
    search() {
      console.log('用户点击了搜索按钮，当前关键词是：', this.keyword);
      // 这里可以发起接口请求
    }
  }
};
</script>
```



### API的可扩展性设计
#### 开闭原则
+ <font style="color:rgb(31, 35, 40);">对扩展开放：当需要添加新功能时，应该尽可能地开放类、模块、函数等的扩展点，通过扩展点给使用者增加新功能的机会。</font>
+ <font style="color:rgb(31, 35, 40);">对修改关闭：当需要修改现有功能时，应该尽可能地关闭类、模块、函数等的修改点，尽量通过扩展的方式来变更功能，而不是修改原有功能。</font>

:::info
上面的国际化示例就是符合开闭原则的设计。

:::



#### 按需导入
<font style="color:rgb(31, 35, 40);">概述：</font>

<font style="color:rgb(31, 35, 40);">按需导入方式可支持tree shaking，有利于生产环境下的性能提升。</font>

```javascript
import _ from 'lodash-es'; // 引入全部
import { cloneDeep } from 'lodash-es';  // 按需引入
```



<font style="color:rgb(31, 35, 40);">实现：</font>

```javascript
// cloneDeep.js
function cloneDeep(value) {
}
export default cloneDeep;
```

```javascript
// lodash.default.js
import cloneDeep from './cloneDeep.js';
const lodash = {
  cloneDeep
}
export default lodash;
```

```javascript
// lodash.js
export { default as cloneDeep } from './cloneDeep.js';
export { default } from './lodash.default.js';
```



#### 配置选项
<font style="color:rgb(31, 35, 40);">概述：</font>

<font style="color:rgb(31, 35, 40);">灵活的参数传递和默认值设置。</font>

```javascript
import { gsap } from 'gsap'
gsap.to('.box', {
  x: 500,
  duration: 1,  // default: 0.5
  delay: 1,     // default: 0
  stagger: 0.2  // stagger: 0
})
```

```javascript
import { gsap } from 'gsap'
gsap.to('.box', {
  x: 500,
  duration: 1,
  delay: 1,
  stagger: {
    each: 0.2,
    from: 'center'  // default: start
  } 
})
```

<font style="color:rgb(31, 35, 40);"></font>

<font style="color:rgb(31, 35, 40);">实现：</font>

```javascript
function to(selector, options) {
  const defaults = {
    duration: 0.5,
    delay: 0,
    stagger: 0 // 可以是 number 或对象
  }

  const config = { ...defaults, ...options }

  const elements = document.querySelectorAll(selector)

  let totalDelay = config.delay

  const staggerConfig = typeof config.stagger === 'object'
    ? {
        each: config.stagger.each || 0,
        from: config.stagger.from || 'start'
      }
    : {
        each: config.stagger,
        from: 'start'
      }

  const count = elements.length

  let order = Array.from({ length: count }, (_, i) => i)

  // 支持 from: 'center'
  if (staggerConfig.from === 'center') {
    const center = (count - 1) / 2
    order = order.sort((a, b) => Math.abs(a - center) - Math.abs(b - center))
  }

  order.forEach((index, i) => {
    const el = elements[index]
    const elementDelay = totalDelay + staggerConfig.each * i
    setTimeout(() => {
      el.style.transform = `translateX(500px)`
      el.style.transition = `transform ${config.duration}s`
    }, elementDelay * 1000)
  })
}
```



#### 回调映射
概述：

方便的控制每一个元素的自定义行为和返回值。

```javascript
text.replace(new RegExp(sensitiveWords, 'gi'), '*')

// 回调映射
text.replace(new RegExp(sensitiveWords, 'gi'), (match) => '*'.repeat(match.length))
```

```javascript
import { gsap } from 'gsap'

gsap.to('.box', {
  x: 500,
})

// 回调映射
gsap.to('.box', {
  x: (i, item) => (i + 1) * 200,
})
```



实现：

```javascript
function to(selector, options) {
  const defaults = {
    duration: 0.5,
    delay: 0,
    stagger: 0,
  }

  const config = { ...defaults, ...options }
  const elements = document.querySelectorAll(selector)
  const count = elements.length

  const staggerValue = typeof config.stagger === 'number' ? config.stagger : 0

  elements.forEach((el, i) => {
    const delay = (config.delay || 0) + staggerValue * i

    // 支持 x 为静态值或函数
    let xValue = 0
    if (typeof config.x === 'function') {
      xValue = config.x(i, el)
    } else if (typeof config.x === 'number') {
      xValue = config.x
    }

    setTimeout(() => {
      el.style.transition = `transform ${config.duration}s`
      el.style.transform = `translateX(${xValue}px)`
    }, delay * 1000)
  })
}

```



#### 注册机制
概述：

允许在运行时动态地添加或修改程序的行为。

```javascript
// Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:articleName', component: Article, name: 'article' }],
})

router.addRoute({ path: '/about', component: About })
router.addRoute({ path: '/helper', component: Helper })
router.removeRoute('article')
```

<font style="color:rgb(101, 109, 118);"></font>

实现：

```javascript
function createRouter({ history, routes: initialRoutes }) {
  const routes = [...initialRoutes]  // 用数组维护路由表

  return {
    getRoutes() {
      return routes
    },

    addRoute(route) {
      routes.push(route)
    },

    removeRoute(name) {
      const index = routes.findIndex(route => route.name === name)
      if (index !== -1) {
        routes.splice(index, 1)
      } else {
        console.warn(`未找到名称为 "${name}" 的路由`)
      }
    }
  }
}
```



#### 拦截器 / 钩子函数
概述：

拦截器和钩子函数的作用类似，用于在特定的时间点或条件下执行自定义逻辑。

```javascript
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 例如，添加认证令牌到请求头
  if (store.getters.token) {
    config.headers['Authorization'] = Bearer ${store.getters.token}
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  if (error.response && error.response.status === 401) {
    // 跳转到登录页面或执行其他操作
  }
  return Promise.reject(error);
});
```

```javascript
import { gsap } from 'gsap'

gsap.to('.box', {
  x: 500,
  duration: 2,
  onStart(param1, param2) {
    console.log('onStart', param1, param2)
  },
  onStartParams: ['hello', 'world'],
  onComplete(param1, param2) {
    console.log('onComplete', param1, param2)
  },
  onCompleteParams: ['hello2', 'world2'],
  onUpdate() {
    console.log('onUpdate')
  }
})
```



实现：

```javascript
function to(selector, options) {
  const elements = document.querySelectorAll(selector)
  const duration = options.duration || 0.5
  const totalFrames = Math.round(duration * 60)

  elements.forEach((el, i) => {
    const startTime = performance.now()
    const startX = 0
    const endX = typeof options.x === 'function' ? options.x(i, el) : options.x || 0

    // onStart
    if (typeof options.onStart === 'function') {
      options.onStart(...(options.onStartParams || []))
    }

    let frame = 0

    function animate(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const currentX = startX + (endX - startX) * progress

      el.style.transform = `translateX(${currentX}px)`

      // onUpdate
      if (typeof options.onUpdate === 'function') {
        options.onUpdate()
      }

      frame++

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // onComplete
        if (typeof options.onComplete === 'function') {
          options.onComplete(...(options.onCompleteParams || []))
        }
      }
    }

    requestAnimationFrame(animate)
  })
}
```



#### 中间件
概述：

<font style="color:rgb(31, 35, 40);">中间件一般用来扩展前端框架的能力，功能可以在多个中间件之间进行传递与控制。</font>

![](https://cdn.nlark.com/yuque/0/2025/webp/312720/1747634768285-40af5b7b-b6b4-482e-a450-3cb639ebc439.webp)

```javascript
// koa中间件
const Koa = require('koa')
const app = new Koa()

app.use(cors())
app.use(serve(__dirname + '/public/'))

app.use((ctx, next) => {
  console.log(1)
  next()
})
app.use((ctx, next) => {
  console.log(2)
})
app.use((ctx, next) => {
  console.log(3)
})

app.listen(3000)
```



实现：

```javascript
const http = require('http')

class SimpleKoa {
  constructor() {
    this.middlewares = []
  }

  use(fn) {
    this.middlewares.push(fn)
  }

  compose(ctx) {
    const dispatch = (i) => {
      if (i >= this.middlewares.length) return Promise.resolve()

      const middleware = this.middlewares[i]
      return Promise.resolve(
        middleware(ctx, () => dispatch(i + 1))
      )
    }

    return dispatch(0)
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      const ctx = { req, res }

      this.compose(ctx)
        .then(() => {
          if (!res.headersSent) {
            res.end('Done')
          }
        })
        .catch((err) => {
          res.statusCode = 500
          res.end('Internal Server Error: ' + err.message)
        })
    })

    server.listen(port, callback)
  }
}
```



#### 插件
概述：

<font style="color:rgb(31, 35, 40);">插件是一种遵循一定规范的应用程序接口编写出来的程序，它可以扩展或增强主应用程序的功能，而不需要修改主应用程序的源代码。插件通常设计为可以在运行时被动态加载和执行，这使得主应用程序具有很高的灵活性和可扩展性。</font>

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vFocusNext from "v-focus-next";


Vue.use(VueRouter)   //扩展路由
Vue.use(ElementUI);  //扩展组件
Vue.use(vFocusNext); //扩展指令

Vue.use(MyPlugin, options);
```

```javascript
const MyPlugin = {
  install(Vue, options) {
    // 添加全局方法或者属性
    Vue.myGlobalMethod = function () {
      // 逻辑...
    };
  }
};
```



实现：

```javascript
const installedPlugins = [];
 
function use(plugin, options) {
  if (installedPlugins.includes(plugin)) {
    console.warn(`Plugin ${plugin.name} has already been installed.`);
    return;
  }
 
  // 如果插件是个对象，且有install方法，调用它的install方法
  if (typeof plugin === 'object' && plugin.install) {
    plugin.install(Vue, options);
  }
  // 如果插件是个函数，直接作为installer调用
  if (typeof plugin === 'function') {
    plugin(Vue, options);
  }
 
  // 将插件记录为已安装
  installedPlugins.push(plugin);
}
```



#### 柯里化函数
概述：

<font style="color:rgb(49, 49, 48);">柯里化是一种函数的转换，它是指将一个函数从可调用的 </font>`<font style="color:rgb(113, 111, 110);">f(a, b, c)</font>`<font style="color:rgb(49, 49, 48);"> 转换为可调用的 </font>`<font style="color:rgb(113, 111, 110);">f(a)(b)(c)</font>`<font style="color:rgb(49, 49, 48);">。柯里化不会调用函数，它只是对函数进行转换。</font>

```javascript
import { gsap } from 'gsap'

document.addEventListener('mousemove', function (e) {
    const snapX = gsap.utils.snap(50, e.pageX)
    const snapY = gsap.utils.snap(50, e.pageY)
    console.log(snapX, snapY)
})

// 柯里化
document.addEventListener('mousemove', function (e) {
    const snap50 = gsap.utils.snap(50)
    const snapX = snap50(e.pageX)
    const snapY = snap50(e.pageY)
    console.log(snapX, snapY)
})
```

<font style="color:rgb(113, 111, 110);"></font>

实现：

```javascript
function curry(func) {

  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };

}

function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

alert( curriedSum(1, 2, 3) ); // 6，仍然可以被正常调用
alert( curriedSum(1)(2, 3) ); // 6，对第一个参数的柯里化
alert( curriedSum(1)(2)(3) ); // 6，全柯里化
```



#### 组合函数
概述：

将多个小的函数组合成一个大的函数，使数据依次通过这些函数进行处理。

```javascript
// without pipe()
var value1 = func1(input);
var value2 = func2(value1);
var output = func3(value2);

// cleaner with pipe()
var transfrom = pipe(func1, func2, func3);
var output = transform(input);
```

```javascript
import { gsap } from 'gsap'

document.addEventListener('mousemove', function (e) {
  const snapX = gsap.utils.snap(50, e.pageX)
  const clampX = gsap.utils.clamp(100, 500, snapX)
  console.log(clampX)
})


// 函数组合
document.addEventListener('mousemove', function (e) {
  const snapAndClampX = gsap.utils.pipe(gsap.utils.snap(50), gsap.utils.clamp(100, 500))
  console.log(snapAndClampX(e.pageX))
})
```



实现：

```javascript
function pipe(...fns) {
  return function (input) {
    return fns.reduce((acc, fn) => {
      if (typeof fn !== 'function') {
        throw new Error('All arguments to pipe must be functions');
      }
      return fn(acc);
    }, input);
  };
}
```



#### 高阶函数
概述：

接受一个或多个函数作为参数，或者返回一个函数作为结果的函数。保留原函数的行为能力并且添加新功能。

```javascript
import { debounce } from 'lodash-es'

let count = 0;
btn.onclick = function(){
  div.innerHTML = ++count;
};


// 高阶函数
btn.onclick = debounce(function(){
  div.innerHTML = ++count;
}, 200);
```



实现：

```javascript
function debounce(fn, delay = 200) {
  let timer = null;
  
  return function(...args) {
    const context = this;
    clearTimeout(timer); 
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);  
  };
}
```



#### 链式调用
概述：

指的是多个方法连续调用，每次调用返回对象本身或另一个支持继续调用的方法的对象，从而实现简洁、流畅的 API 使用体验。

```javascript
import { gsap } from 'gsap'

const tl = gsap.timeline()
tl.to('.red', {
  x: 100,
  duration: 1
})
tl.from('.green', {
  x: 200,
  duration: 2
})
tl.set('.blue', {
  x: 300,
  duration: 3
})

// 链式调用
const tl = gsap.timeline()
tl.to('.red', {
  x: 100,
  duration: 1
})
  .from('.green', {
  x: 200,
  duration: 2
})
  .set('.blue', {
  x: 300,
  duration: 3
})
```



实现：

```javascript
function createTimeline() {
  const queue = [];

  const timeline = {
    to(selector, config) {
      queue.push(() => {
        console.log(`to ${selector}`, config);
      });
      return this;
    },

    from(selector, config) {
      queue.push(() => {
        console.log(`from ${selector}`, config);
      });
      return this;
    },

    set(selector, config) {
      queue.push(() => {
        console.log(`set ${selector}`, config);
      });
      return this;
    },
    
  };

  return timeline;
}
```



#### 范围隔离
概述：

可以创建具有独立作用范围的实例，实现“范围隔离”，避免全局污染。



```javascript
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/'
axios.defaults.timeous = 1000
axios.get('/users').then().catch()
axios.get('/todos').then().catch()


// 范围隔离
const instance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 1000,
})
instance.get('/users').then().catch()
instance.get('/todos').then().catch()
```



实现：

```javascript

const axios = (function () {
  const defaults = {
    baseURL: '',
    timeout: 0,
  }

  function createAxios(config) {
    return {
      defaults: config,
      get(url) {
        const requestConfig = {
          baseURL: config.baseURL,
          timeout: config.timeout,
          url,
        }
        return Promise.resolve(requestConfig)
      },
      create(customConfig = {}) {
        const mergedConfig = {
          ...config,
          ...customConfig,
        }
        return createAxios(mergedConfig)
      }
    }
  }

  return createAxios(defaults)
})()

```





