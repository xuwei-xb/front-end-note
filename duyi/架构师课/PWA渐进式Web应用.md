

### 概述
#### 传统网站
采用HTML、CSS、JS等技术编写的网络应用，并通过浏览器进行访问。<font style="color:rgb(27, 27, 27);">在用户不访问它时，在用户的设备上没有存在感，只能通过用户打开浏览器并导航到该网站来访问，而且高度依赖于网络连接。</font>

<font style="color:rgb(27, 27, 27);"></font>

#### <font style="color:rgb(27, 27, 27);">平台专属应用</font>
采用IOS、Android、C++等技术编写的原生应用，只能在专属平台下使用，不能方便的跨平台移植。好处是性能更流畅，支持离线，桌面图标的独立体验等。



#### 跨平台框架
能够用同一套代码同时运行在多个平台（iOS、Android、Web、Windows、Mac 等）上的开发框架。它的核心目标是提高开发效率，减少重复开发，同时尽量保证接近原生的体验和性能。如：React Native，Flutter，uni-app等。





#### 渐进式Web应用
<font style="color:rgb(27, 27, 27);">渐进式 web 应用结合了传统网站和平台特定应用的最佳特性。具有网站的优势，包括：</font>

+ <font style="color:rgb(27, 27, 27);">使用标准的 web 平台技术开发的，所以它们可以从单一代码库在多个操作系统和设备类上运行。</font>
+ <font style="color:rgb(27, 27, 27);">可以直接通过浏览器访问。</font>

<font style="color:rgb(27, 27, 27);"></font>

<font style="color:rgb(27, 27, 27);">同时也具有平台特定应用程序的许多优势，包括：</font>

+ <font style="color:rgb(27, 27, 27);">可以从平台的应用商店安装，也可以直接从 web 安装。</font>
+ <font style="color:rgb(27, 27, 27);">设备上得到一个应用图标，与平台特定应用程序一样，用户黏性更强。</font>
+ <font style="color:rgb(27, 27, 27);">具备离线能力，在设备没有网络连接时工作，应用更加可靠。</font>
+ <font style="color:rgb(27, 27, 27);">资源具备缓存能力，使得应用启动速度更快，性能更好。</font>



**<font style="color:rgb(27, 27, 27);">总结：</font>**<font style="color:rgb(27, 27, 27);"> 渐进式 Web 应用（Progressive Web App，简称 PWA）是一种结合了网页与原生应用优点的新型 Web 应用开发模式。PWA 通过现代 Web 技术提供类似原生应用的体验：可安装、离线使用、后台更新、消息推送等。  </font>



### PWA基本使用
#### 效果演示
[Squoosh](https://squoosh.app/) 一款开源 浏览器中运行的图像压缩工具。

+ web安装
+ 离线访问



同时支持商店安装：

+ 适用于 Android 和 ChromeOS 的 Google Play 商店，使用 Trusted Web Activity。
+ 适用于 iOS、macOS 和 iPadOS 的 Apple App Store，使用 WKWebView 和应用绑定网域。
+ 适用于 Windows 10 和 11 的 Microsoft Store，使用 APPX 软件包。
+ Samsung Galaxy Store，使用 Samsung WebAPK 铸造服务器。
+ 华为 AppGallery，使用适用于 HTML 应用的 QuickApp 容器。



[PWA Builder](https://www.pwabuilder.com/)： 支持将你的 PWA 打包为适合各大应用商店提交的安装包格式，例如 Windows Microsoft Store 的 `.msix` / `.appx`，以及通过 TWA 打包后提交至 Google Play Store。还支持 Samsung Store、Meta Quest 平台等。 



#### 具备PWA的条件
+ https协议（开发阶段可以localhost）
    - 移动端可以采用模拟器或Fiddler代理本地站点
    - 可通过github actions提供带有https的static page
+ manifest清单
    - 官方扩展名为 `.webmanifest`，也可以是为 `manifest.json`文件
+ service worker文件
    - 一个特殊的Web Worker文件，可以后台运行
    - 充当代理，拦截浏览器和服务器之间的请求，并处理缓存实现离线访问



#### mainfest清单
<font style="color:rgb(32, 33, 36);">用于告知浏览器您希望 Web 内容以何种方式在操作系统中显示为应用。清单可以包含基本信息（例如应用名称、图标和主题颜色）；高级偏好设置（例如所需屏幕方向和应用快捷方式）；以及目录元数据（例如屏幕截图）。</font>

```json
{
  "name": "我的 PWA",
  "short_name": "PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "description": "一个简单的 PWA 示例",
  "icons": [
    {
      "src": "icons/test.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

![](https://cdn.nlark.com/yuque/0/2025/png/312720/1754468164718-284930ce-867b-4997-8191-9514f16f931b.png)

![](https://cdn.nlark.com/yuque/0/2025/png/312720/1754468686512-43935c66-e12b-4b10-bea4-f8668cb956c7.png)



#### Service Worker
![](https://cdn.nlark.com/yuque/0/2025/png/312720/1754468285117-59e9e723-30d5-4496-af20-e485f99150b8.png)

```javascript
// main.js

// 创建 Worker
const worker = new Worker('worker.js');

// 监听来自 worker 的消息
worker.onmessage = function(event) {
  document.getElementById('result').innerText = '来自 Worker 的消息：' + event.data;
};

// 向 worker 发送消息
function sendMessage() {
  worker.postMessage('你好，Worker！');
}
```

```javascript
// worker.js

// 接收主线程的消息
onmessage = function(event) {
  console.log('主线程发来的消息:', event.data);

  // 处理完后，发送消息回主线程
  postMessage('收到你的消息："'+ event.data + '"，你好，主线程！');
};
```



![](https://cdn.nlark.com/yuque/0/2025/png/312720/1754468478551-f7ee06d0-916c-446b-970e-858081cab0db.png)

<font style="color:rgb(32, 33, 36);"></font>

<font style="color:rgb(32, 33, 36);">使用步骤：</font>

+ 注册service worker
+ 添加install事件，注册成功触发，主要用于缓存资料
+ 添加activate事件，激活的时候触发，主要用于删除旧的资源
+ 添加fetch事件，主要用于操作缓存或者读取网络资源



#### <font style="color:rgb(32, 33, 36);">自定义安装</font>
<font style="color:rgb(32, 33, 36);">当浏览器检测到您的应用可供安装时，就会触发 </font>`<font style="color:rgb(32, 33, 36);">beforeinstallprompt</font>`<font style="color:rgb(32, 33, 36);"> 事件。您需要实现此事件处理脚本来自定义用户体验。</font>



:::info
pwa01案例

:::

<font style="color:rgb(32, 33, 36);"></font>

### <font style="color:rgb(32, 33, 36);">PWA离线访问</font>
#### cache storage
<font style="color:rgb(32, 33, 36);">cache storage 是 Service Worker 的核心功能之一，它是浏览器提供的一种 </font>**在客户端持久化缓存资源（如 HTML、JS、CSS、图片等）**<font style="color:rgb(32, 33, 36);"> 的机制。   在 PWA中，通常使用 cache storage 来离线缓存页面资源，实现离线访问、快速加载等特性。  </font>

| **<font style="color:rgb(32, 33, 36);">方法</font>** | **<font style="color:rgb(32, 33, 36);">作用</font>** |
| --- | --- |
| `<font style="color:rgb(32, 33, 36);">caches.open(name)</font>` | <font style="color:rgb(32, 33, 36);">打开或创建一个缓存</font> |
| `<font style="color:rgb(32, 33, 36);">cache.add(url)</font>` | <font style="color:rgb(32, 33, 36);">缓存一个 URL 的请求</font> |
| `<font style="color:rgb(32, 33, 36);">cache.addAll([urls])</font>` | <font style="color:rgb(32, 33, 36);">批量缓存多个资源</font> |
| `<font style="color:rgb(32, 33, 36);">cache.put(request, response)</font>` | <font style="color:rgb(32, 33, 36);">手动放入缓存（需 clone）</font> |
| `<font style="color:rgb(32, 33, 36);">caches.match(request)</font>` | <font style="color:rgb(32, 33, 36);">匹配缓存中的资源</font> |
| `<font style="color:rgb(32, 33, 36);">caches.keys()</font>` | <font style="color:rgb(32, 33, 36);">获取所有缓存名称</font> |
| `<font style="color:rgb(32, 33, 36);">caches.delete(name)</font>` | <font style="color:rgb(32, 33, 36);">删除某个缓存</font> |


#### 缓存策略
预缓存（静态资源）

![](https://cdn.nlark.com/yuque/0/2025/png/312720/1754482761128-c16e5003-d39c-44ae-a70c-1ad56411893c.png)

```javascript
self.addEventListener("fetch", event => {
   event.respondWith(
     caches.match(event.request)
     .then(cachedResponse => {
       // It can update the cache to serve updated content on the next request
         return cachedResponse || fetch(event.request);
     }
   )
  )
});
```



<font style="color:rgb(32, 33, 36);">网络优先（动态缓存）</font>

![](https://cdn.nlark.com/yuque/0/2025/png/312720/1754482824108-f017e114-66a9-4c93-a83b-8355ac034434.png)

```javascript
self.addEventListener("fetch", event => {
   event.respondWith(
     fetch(event.request)
     .catch(error => {
       return caches.match(event.request);
     })
   );
});
```



<font style="color:rgb(32, 33, 36);">在重新验证时过时</font>

![](https://cdn.nlark.com/yuque/0/2025/png/312720/1754483133203-139827c7-1356-42ec-8343-13db88e32c73.png)

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
        const networkFetch = fetch(event.request).then(response => {
          // update the cache with a clone of the network response
          const responseClone = response.clone()
          caches.open(url.searchParams.get('name')).then(cache => {
            cache.put(event.request, responseClone)
          })
          return response
        }).catch(function (reason) {
          console.error('ServiceWorker fetch failed: ', reason)
        })
        // prioritize cached response over network
        return cachedResponse || networkFetch
      }
    )
  )
})
```



#### 离线通知
+ navigator.onLine、online事件
+ Notifications API



#### 后台同步
+ sync事件



:::info
pwa02案例

:::



### PWA框架
#### Workbox
[Workbox](https://developer.chrome.com/docs/workbox?hl=zh-cn) 是 **Google 推出的一个 PWA（渐进式 Web 应用）工具库**，主要用来简化 **Service Worker** 的编写和管理，让开发者可以更轻松地实现离线缓存、资源预加载、后台同步等功能。  



<font style="color:rgb(32, 33, 36);">一些常用的模块包括：</font>

+ **<font style="color:rgb(32, 33, 36);">workbox-routing</font>**<font style="color:rgb(32, 33, 36);">：当 Service Worker 拦截请求时，此模块会将这些请求路由到提供响应的不同函数；简化</font>`<font style="color:rgb(55, 71, 79);">fetch</font>`<font style="color:rgb(32, 33, 36);"> 事件处理脚本的实现。</font>

```javascript
import { registerRoute } from 'workbox-routing'

registerRoute(
  ({url}) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
  })
)
```

+ **<font style="color:rgb(32, 33, 36);">workbox-strategies</font>**<font style="color:rgb(32, 33, 36);">：一组运行时缓存策略，用于处理请求响应，例如先缓存并在重新验证时过时：</font>

```javascript
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
```

+ **<font style="color:rgb(32, 33, 36);">workbox-precaching</font>**<font style="color:rgb(32, 33, 36);">：它是 Service Worker 的 </font>`<font style="color:rgb(55, 71, 79);">install</font>`<font style="color:rgb(32, 33, 36);"> 事件处理程序中缓存文件的实现（也称为预缓存）。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/312720/1755141436010-868ace76-c202-4520-ae4b-fdc702ec3494.png)

+ ....



#### vite-plugin-pwa
[<font style="color:rgb(58, 92, 204);">vite-plugin-pwa</font>](https://vite-pwa-org.netlify.app/)<font style="color:rgb(32, 33, 36);">为 Vite 及其生态系统提供 PWA 集成，内部用 Workbox 做 Service Worker 相关的缓存和生成工作。  
</font><font style="color:rgb(32, 33, 36);">它相当于 “Vite + Workbox 的桥梁”，让你在 Vite 项目里用简单配置就能启用 PWA 功能，而不必手动整合 Workbox 构建流程。  </font>



```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})

```





