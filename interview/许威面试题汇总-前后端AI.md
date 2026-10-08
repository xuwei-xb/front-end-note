> 类型: 面试 · 更新: 2026-10-08
> 关联: [[interview/Agent面试题学习线路]]（132 题题库的 9 套学习路线）、[[interview/自建Agent面试题库]]（完整版答案）、[[architecture/Agent项目架构设计]]（方法论）
>
> ---

# 许威 · 面试题汇总（前端 + 后端 + AI）

> 对齐简历《前端 / AI 应用开发工程师》，覆盖 **前端核心 → 跨端 → 后端与数据 → 鉴权安全 → 云运维 → AI 大模型 → 项目深度 → 软技能 → Node+LangGraph Agent → 架构与业务对接** 十大板块（＋第十一章 Agent 系统设计深挖 16 题，精选自 [[interview/自建Agent面试题库]]），共 95 题。
>
> 标注说明：`【简历】`= 会被简历关键词直接命中的题；`【高频】`= 出现概率高；`【AI】`= AI 方向必问。
> 参考素材：`front-end-note/` 全套笔记、`Agent-Skill-MCP面试题.md`。旧版《许威面试题与最优答案》中未被本汇总覆盖的前端核心原理、跨端、架构与业务对接类题目，已就地合入第八 / 九 / 十章。

---

## 目录

- [一、后端 & 数据](#一后端--数据)
- [二、鉴权 & 安全](#二鉴权--安全)
- [三、云部署 & 运维](#三云部署--运维)
- [四、AI & 大模型](#四ai--大模型)
- [五、项目深度追问](#五项目深度追问)
- [六、软技能 & 综合](#六软技能--综合)
- [七、Node + LangGraph Agent 开发](#七node--langgraph-agent-开发)
- [八、前端核心原理](#八前端核心原理)
- [九、跨端开发](#九跨端开发)
- [十、架构与业务对接](#十架构与业务对接)
- [十一、Agent 系统设计深挖（题库精选）](#十一agent-系统设计深挖题库精选)
- [附：速答速查表（面试前 10 分钟扫）](#附速答速查表面试前-10-分钟扫)

---

## 一、后端 & 数据

### Q1.【简历】【高频】Node.js 的事件循环和浏览器有什么区别？为什么适合 I/O 密集？
**答（核心）：** Node 基于 **libuv**，事件循环按固定顺序轮转 6 个阶段：`timers → pending callbacks → idle/prepare → poll → check → close callbacks`。
- 浏览器只有「宏任务 / 微任务」两层：取一个宏任务 → 清空微任务 → 渲染 → 下一个。
- Node 把宏任务**细分成了 6 个阶段**（I/O、timers、check 等各自成阶段），并多一个 `process.nextTick` 队列；`setImmediate` 专门在 **check 阶段**执行。

**两处精确机制（面试官爱抠，答出即加分）：**
1. **nextTick 不是微任务**：事件循环每跑完一个阶段，会先**清空 nextTick 队列**，再**清空 microtask 队列（Promise.then / queueMicrotask / await）**，然后才进下一阶段。所以 `nextTick` 优先级比 `Promise` 高，且它独立于微任务。
2. **Node 不是"纯单线程"**：JS 主线程单线程跑事件循环；但 libuv 有**线程池（默认 4 个）**兜底文件 / DNS 等异步，网络 I/O 走内核 `epoll/kqueue`，不占线程池。

**为什么适合 I/O 密集：** 发起 I/O（网络 / 文件）不阻塞主线程，内核或线程池完成后把回调丢回事件循环调度，单线程即可扛高并发。但**不适合 CPU 密集**——长时间计算会占住主线程、卡住整个循环，需要 `worker_threads`（同进程多线程、共享内存）或 `cluster`（多进程按 CPU 核 fork、共享端口）分流。

**追问预案：**
- Q：`setTimeout(0)` 和 `setImmediate` 谁先？→ 普通代码里**不确定**（两阶段相邻）；但在 **I/O 回调内部**，`setImmediate` 一定先于 `setTimeout`。
- Q：`nextTick` 递归会怎样？→ **饿死事件循环**（队列永远清不完、阶段不前进），禁止递归调用。
- Q：`worker_threads` 和 `cluster` 区别？→ cluster 多进程（按核 fork、共享端口，适合 HTTP 服务）；worker_threads 多线程（同进程、共享内存，适合 CPU 重计算）。

**速记口诀：** 浏览器两层（宏→微→渲染），Node 六阶段（timers…check…close），nextTick 比 Promise 早，I/O 用循环、CPU 用线程。

### Q2.【简历】NestJS 的核心概念？依赖注入和 AOP 怎么理解？
**答：** NestJS 基于 Express/Fastify，核心：**模块（Module）**组织代码、**控制器（Controller）**处理路由、**服务（Provider）**承载业务。
- **依赖注入（DI）**：IoC 容器自动创建并注入依赖，类里只声明构造函数参数（用 `@Injectable()`），不需手动 `new`，便于测试和替换
- **AOP 洋葱模型**：`Middleware`（中间件）→ `Guards`（守卫，鉴权）→ `Interceptors`（拦截器，前后增强/日志/缓存）→ `Pipes`（管道，参数校验转换）→ Controller → `ExceptionFilters`（异常过滤器）
**追问：** 参数校验用 `class-validator` + `ValidationPipe`；统一响应格式/错误用 Interceptor + Filter。

### Q3.【简历】REST API 设计规范？幂等性怎么保证？
**答：** 用 HTTP 方法表达语义：GET（查，幂等）/ POST（增，非幂等）/ PUT（全量改，幂等）/ PATCH（局部改）/ DELETE（删，幂等）。URL 用名词复数（`/users/1`），状态码语义化（200/201/400/401/403/404/409/500），版本化（`/v1/`），分页 `?page=&size=`。
幂等：`PUT`/`DELETE` 天然幂等；`POST` 用**幂等键（Idempotency-Key）** 或唯一约束 + 去重表保证。

### Q4.【简历】【高频】MySQL 索引原理？B+ 树为什么适合做索引？
**答：** InnoDB 索引结构是 **B+ 树**：非叶子节点只存键、叶子节点存数据且用链表相连。相比 B 树/B 树：树更矮（每页存更多键 → 磁盘 I/O 少）、范围查询快（叶子链表）、查询稳定（都到叶子）。主键索引是**聚簇索引**（叶子存整行）；二级索引叶子存主键值，需**回表**。

### Q5.【简历】什么是最左前缀原则？回表、覆盖索引、索引失效?
**答：** 联合索引 `(a,b,c)` 按 a→b→c 排序，查询必须从最左列连续匹配才能用上索引（`where a=? and c=?` 只能用到 a）。
- **回表**：二级索引拿到主键再去聚簇索引取整行 → 多一次 I/O
- **覆盖索引**：查询字段都在索引里，无需回表（`explain` 的 Extra 显示 `Using index`）
- **索引失效**：在索引列上做运算/函数、隐式类型转换、`like '%x'` 前缀模糊、`or` 连接非索引列、违反最左前缀、`!=`/`is not null` 有时弃用。

### Q6.【简历】MySQL 事务的 ACID 和隔离级别？
**答：** ACID：原子性（Atomicity，undo log）、一致性（Consistency）、隔离性（Isolation，锁 + MVCC）、持久性（Durability，redo log）。
隔离级别（低→高）：**读未提交 → 读已提交（RC）→ 可重复读（RR，MySQL 默认）→ 串行化**。
问题：脏读、不可重复读、幻读。InnoDB 在 RR 下用 **MVCC（ReadView + undo log 版本链）** 解决不可重复读，用**间隙锁（Next-Key Lock）** 解决幻读。

### Q7.【简历】慢 SQL 怎么排查优化？
**答：** ① 开慢查询日志 `slow_query_log` 定位；② `EXPLAIN` 看执行计划：`type`（至少 range，避免 ALL 全表扫描）、`key`（是否用索引）、`rows`、`Extra`；③ 优化：加/改索引、避免 `select *`、覆盖索引消除回表、大偏移分页用游标/子查询、`join` 小表驱动大表、读写分离/分库分表兜底。

### Q8.【简历】MongoDB 和 MySQL 的区别？什么场景用 MongoDB？
**答：** MongoDB 是**文档型 NoSQL**，存 BSON 文档，无固定 schema，天然嵌套、读写快、易水平扩展（分片）；MySQL 是关系型，强 schema、事务/联合查询强、数据一致性要求高。
MongoDB 适用：**数据结构多变/嵌套**（如流程配置、对话日志、表单配置）、读写吞吐高、弱事务强扩展。简历里"流程配置、执行日志、表单配置"就属此类。

### Q9.【简历】【高频】Redis 有哪些数据类型和典型应用场景？
**答：** String（缓存、计数 `INCR`）、Hash（对象、购物车）、List（消息队列、最新列表）、Set（去重、共同好友）、ZSet（排行榜、延时队列）、Bitmap（签到、活跃统计）、HyperLogLog（UV 去重计数）、Stream（消息队列，5.0+）。

### Q10.【简历】【高频】Redis 缓存三大问题：穿透、击穿、雪崩？怎么解决？
**答：**
- **穿透**：查不存在的数据，绕过缓存直打 DB。解法：缓存空值（短 TTL）、布隆过滤器拦截、参数校验
- **击穿**：热点 key 过期瞬间高并发打 DB。解法：互斥锁（只放一个线程重建）、热点 key 逻辑过期不删、预热
- **雪崩**：大量 key 同时过期或 Redis 宕机。解法：过期时间加随机值打散、多级缓存、限流降级、集群高可用（哨兵/Cluster）

### Q11.【简历】Redis 持久化 RDB 和 AOF？缓存和数据库一致性怎么保证？
**答：** RDB = 定期快照（二进制、恢复快、可能丢数据）；AOF = 追加写命令（实时性好、文件大、恢复慢）；混合持久化（4.0+）兼顾。
**一致性**：优先 **Cache Aside**——更新 DB 后**删除**缓存（而非更新）。最终一致用 **延时双删** 或 **订阅 binlog（Canal）+ 消息队列**异步删缓存。强一致场景可加分布式锁。

### Q12.【简历】说一个你做过/理解的后端中间层设计（结合 AI 中间服务）。
**答：** 前端 → **NestJS 中间层** → 大模型 API：中间层负责 ①统一鉴权（Guard 校验 JWT）②请求适配（不同模型参数格式统一）③流式转发（`@Sse()` 透传）④Redis 缓存相同 prompt 省成本 ⑤MongoDB 记录 prompt/耗时/成本 ⑥限流降级（令牌桶 + 超时降级）。这样前端只调一个标准接口，模型可随时更换。

---

## 二、鉴权 & 安全

### Q13.【简历】【高频】JWT 的结构？它和无状态鉴权的关系？缺点是什么？
**答：** JWT = `Header.Payload.Signature` 三段 Base64。Header 声明算法，Payload 存声明（`sub`/`exp`/自定义），Signature 用密钥对前两段签名防篡改。
**无状态**：服务端不存 session，校验签名即可，适合分布式/跨服务。**缺点**：无法主动失效（登出/封禁难，除非配黑名单 Redis）、泄露后有效期内一直可用、payload 明文（不能放敏感信息）、体积比 session id 大。私钥签名用 RS256（非对称）比 HS256 更安全。

### Q14.【简历】Session 和 JWT 怎么选？
**答：** Session 存服务端（有状态），可主动失效、可控，但需 session 共享（Redis）跨服务；JWT 无状态、易扩展，但难失效。选型：单体/需要强登出 → Session + Redis；微服务/前后端分离/无状态扩展 → JWT，配短 access token + 长 refresh token。

### Q15.【简历】【高频】OAuth2 的授权码模式流程？
**答：** ① 前端引导用户跳转授权服务器（带 `client_id`/`redirect_uri`/`scope`）② 用户登录并同意授权 ③ 授权服务器回调 `redirect_uri` 携带 `code` ④ 后端用 `code + client_secret` 换 `access_token`（可含 `refresh_token`）⑤ 用 token 访问资源。**加分**：加 PKCE 防授权码拦截（前端 SPA 必备）。

### Q16.【简历】【高频】什么是 PKCE？为什么能防授权码拦截？SPA 为什么必须用它？
**答：** PKCE（Proof Key for Code Exchange，RFC 7636）是 OAuth2 授权码模式的**安全增强**，专门解决"公共客户端（SPA / 移动 App）无法安全保管 client_secret"导致的**授权码拦截攻击**。
原理（三步）：
1. **生成**：客户端先随机生成 `code_verifier`（高熵随机串，43–128 字符），用 `code_challenge_method=S256` 对其做 SHA-256 → Base64URL 编码得到 `code_challenge`。
2. **申请 code**：授权请求里带上 `code_challenge` + `code_challenge_method`（不再需要 client_secret）。
3. **换 token**：用 `code` + 原始 `code_verifier` 换 token；授权服务器用同样算法对 `code_verifier` 算 challenge 比对，**不一致直接拒绝**。
**为什么能防拦截**：攻击者即使截获了 `code`，因为没有 `code_verifier`（只存在于发起请求的客户端内存里、从不经网络传输），换不到 token。而传统授权码模式靠 `client_secret` 防截获，但 SPA 把 secret 写在前端等于公开，拦截 code 后攻击者可冒充换 token。
**追问：**
- Q：为什么用 S256 而不是 plain？→ `plain` 等于把 verifier 直接当 challenge 传，被拦截即破功；S256 让网络上只流动不可逆的哈希。
- Q：PKCE 和 HTTPS 是替代关系吗？→ 互补不替代。HTTPS 防传输窃听，但防不了"恶意 App 抢注 redirect_uri 拿到 code"这类本地拦截；PKCE 兜底此类场景。
- Q：授权码 + PKCE 和隐式模式（implicit）比？→ 隐式模式把 token 直接放 URL，已被 OAuth 2.1 废弃；授权码 + PKCE 是当前公共客户端标准做法。

### Q17.【简历】OIDC 和 OAuth2 的区别？SSO 单点登录原理？
**答：** OAuth2 只解决**授权**（能访问什么），OIDC 在其上加了**认证**层，返回 `id_token`（JWT），包含用户身份信息，解决"你是谁"。
**SSO**：多个系统共用一个认证中心。用户首次登录认证中心拿全局票据（如 CAS 的 TGT），访问其他系统时携带票据向认证中心验证，通过则签发局部会话，实现一次登录、多系统通行。核心是**共享认证 + 票据校验**。

### Q18.【简历】RBAC 权限模型怎么设计？
**答：** 经典 **用户 - 角色 - 权限**（User-Role-Permission）三段式：用户绑角色、角色绑权限（菜单/按钮/接口），解耦。表：`user`、`role`、`permission`、`user_role`、`role_permission`。
**前端落地**：登录后拉菜单/权限码 → 动态路由（`addRoutes`）+ 按钮级指令（`v-permission` / HOC）；**后端**：Guard/中间件校验接口权限码。进阶：RBAC + 数据权限（行级，如只能看本部门数据）+ 角色继承。

### Q19.【简历】XSS 和 CSRF 是什么？如何防御？
**答：** **XSS**：注入恶意脚本。分存储型/反射型/DOM 型。防御：输入输出转义、CSP、`HttpOnly` Cookie、富文本白名单过滤（如 DOMPurify）。
**CSRF**：借用户已登录身份伪造请求。防御：`SameSite` Cookie、CSRF Token 校验、校验 `Referer`/`Origin`、关键操作二次验证。JWT 放 Header（而非 Cookie）可天然缓解 CSRF。

---

## 三、云部署 & 运维

### Q20.【简历】Docker 镜像和容器的区别？镜像分层原理？
**答：** 镜像 = 只读模板（多层叠加，Dockerfile 每条指令一层，可复用共享）；容器 = 镜像的运行实例（在最上层加可写层）。分层好处：共享底层节省空间、构建时命中缓存加速。`COPY`/`RUN` 顺序影响缓存命中率，变化少的放前面。

### Q21.【简历】【高频】Dockerfile 多阶段构建有什么用？写一个前端 + Nginx 的多阶段？
**答：** 多阶段构建：构建阶段用 node 镜像装依赖+打包，运行阶段只 COPY 产物到 nginx 镜像，最终镜像**不含源码和 node_modules**，体积从 ~1GB 降到 ~25MB，更安全启动更快。

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Q22.【简历】CI/CD 流水线一般包含哪些阶段？
**答：** 代码提交 → Webhook 触发 → 拉代码 → `npm ci` 装依赖（锁定版本 + 缓存）→ Lint → 单测（覆盖率阈值）→ 构建 → Docker 镜像 → 推送仓库（Harbor/ACR）→ 部署（测试直接更新 / 生产滚动）→ 通知（钉钉/飞书）。
优化：依赖缓存、Lint 与测试并行、产物归档支持回滚。工具：Jenkins（灵活）、GitLab CI、GitHub Actions、云效。

### Q23.【简历】Nginx 常见作用？反向代理和正向代理区别？
**答：** Nginx 作用：静态资源服务、**反向代理**、负载均衡（轮询/加权/IP Hash/最少连接）、HTTPS 终结、gzip、限流、SPA 的 `try_files` 解决 history 路由 404。
区别：**正向代理**代理客户端（客户端知道、服务端不知道，如翻墙）；**反向代理**代理服务端（客户端不知道真实后端，如 Nginx 转发到后端服务）。

### Q24.【简历】线上问题怎么排查？日志监控怎么接？
**答：** 排查思路：先看**监控告警**（错误率/延迟/资源）→ 看**日志**定位（前端 Sentry 捕获 JS 错误 + 后端结构化日志）→ 复现 → `top`/`netstat`/链路追踪定位。
工具链：日志（ELK / Loki）、监控（Prometheus + Grafana）、APM/链路追踪（SkyWalking / OpenTelemetry）。
常见线上问题：内存泄漏（Node `--inspect` + heap snapshot）、接口超时（看 Nginx 日志 + 慢 SQL）、白屏（CDN/资源 404）。

---

## 四、AI & 大模型

> 系统设计侧面（判型 / 分层架构 / 编排 / 工具 / 记忆 / 部署 / 评测 / 安全）见 [[architecture/Agent项目架构设计]]。
> 完整 120 题深度题库（12 维度、含参考答案与追问预案）见 [[interview/自建Agent面试题库]]——本章 Q25–Q36 为其精简版，第十一章为其未覆盖考点精选。

### Q25.【AI】LLM 和 Agent 有什么区别？
**答：** Agent = LLM + 工具 + 记忆 + 规划，在循环中自主完成目标。LLM 有四个天花板：只会说不会做、没记忆、知识截止、不会规划；Agent 的四个模块（感知/规划/行动/记忆）刚好补上。举例："查天气下雨就取消跑步"，LLM 只会建议你打开 App，Agent 会调天气 API → 调日历 API 删日程 → 告诉你结果。

### Q26.【AI】Agent 和 Workflow 怎么选？
**答：** 控制权不同：Workflow 在代码手里（流程固定、确定性强、Token 低）；Agent 在 LLM 手里（灵活探索、Token 高 4–8x）。生产多是**混合架构**：简单确定性任务走 Workflow，复杂探索走 Agent。Anthropic 官方建议"能用 Workflow 就别上 Agent"。

### Q27.【AI】Agent 的四种工作模式？
**答：** ReAct（边想边做，通用）、Plan-and-Execute（先规划再执行，省 ~80% token）、Reflection（生成→审查→迭代，适合高质量产出）、Multi-Agent（多专家协作，最贵）。防死循环：最大步数、重复检测、超时控制。

### Q28.【AI】【高频】Function Calling 底层是怎么实现的？
**答：** LLM 自己**不执行**函数。流程：① 开发者用 **JSON Schema** 描述函数名、参数；② LLM 输出"调什么、传什么参数"的 JSON 指令；③ 你的代码解析并执行真实 API；④ 结果回传 LLM 生成最终回答。关键：模型需经过训练才具备 FC 能力，不是所有模型都支持（不支持的用 ReAct + prompt 模板兜底）。

### Q29.【AI】【高频】什么是 MCP？它解决了什么问题？和 Function Calling 什么关系？
**答：** MCP（Model Context Protocol）是 Anthropic 推的开放协议，目标是"工具实现一次、所有兼容 Agent 都能用"，类比 **USB 接口标准**。解决工具到 LLM 的**接入标准化**问题（工具发现、描述格式、调用协议统一）。
架构：Host（宿主应用）→ Client（1:1 连 Server）→ Server（暴露工具），用 **JSON-RPC 2.0** 通信。
**三大原语**：Tools（可执行函数）、Resources（静态数据）、Prompts（提示模板）。传输方式：stdio（本地子进程，首选）/ Streamable HTTP（远程服务）/ SSE（旧实现，新项目别用）；另含 Sampling（反向让客户端调 LLM，极少用）。
与 FC 关系：MCP **不取代** FC，而是建立在其上的生态层——底层仍是 FC 调工具，MCP 统一了"工具接入标准"。

### Q30.【AI】Skill 和 MCP 的区别？和普通 Prompt 有什么不同？
**答：** MCP 是**协议层**（解决"能连什么"），Skill 是**架构层**（解决"怎么做事"）。
Skill = Prompt 的工程化封装：三层结构（metadata 始终加载 / 核心指令按需 / 支持文件按需），**按需加载**避免 context 浪费、可发现可组合。类比前端组件库（Ant Design）——不是新能力，是经验沉淀复用。
三者关系一句话：**Agent 是"谁来做"（决策），Skill 是"怎么做"（方法论），MCP 是"用什么做"（工具连接）。**

### Q31.【AI】【简历】为什么用 LangGraph 而不是直接用 LangChain？
**答：** LangChain 的 `Chain` 是线性的，不支持循环/条件分支，多步状态靠手动拼接，无法实现 Agent 的"思考→行动→观察"循环。
LangGraph 把工作流定义为**有向图**（节点 + 边）：① 支持条件分支/循环/并行 ② 全局 `State` 在节点间流转（`Annotated[list, operator.add]` 追加模式）③ 原生支持 ReAct Agent 循环 ④ **checkpoint 持久化**（中断可恢复）⑤ **Human-in-the-loop**（`interrupt` 暂停等人工确认）⑥ 节点流式输出。

### Q32.【AI】【简历】简历里"基于 LangGraph 编排多步骤工作流 + 前端可视化配置"具体怎么做的？
**答：** 前端 ReactFlow 画布拖节点（Agent/工具/条件判断）→ 连线定义执行顺序 → 节点属性面板配置 systemPrompt/tools/模型参数 → 条件边配表达式（`state.intent === 'code'`）→ 导出 **JSON Schema** → NestJS 后端动态构建 LangGraph 图并执行 → 执行中每个节点状态实时推回前端，高亮当前节点。串行/并行由依赖关系决定（无依赖并行、有依赖串行）。

### Q33.【AI】RAG 是什么？完整流程说一下。
**答：** RAG（检索增强生成）= 检索 + 生成：解决大模型知识截止和幻觉。
流程：① **离线**：文档切分（Chunking）→ Embedding 向量化 → 存入向量库（Milvus/Pinecone/Chroma）；② **在线**：用户问题向量化 → 向量库相似度检索 Top-K → 拼进 Prompt 作为上下文 → LLM 生成答案。
优化：混合检索（向量 + 关键词 BM25）、Rerank 重排、查询改写、切分策略（重叠/语义）、来源引用。**最大风险是答得很流畅但完全编造**——相似度低于阈值要明确拒答，而非拿最不相关结果凑（工程细节见 [[interview/自建Agent面试题库]] Q71–Q83）。

### Q34.【AI】【高频】大模型流式输出前端怎么接收？SSE 和 WebSocket 怎么选？
**答：** 两种方式：
- **EventSource (SSE)**：原生 API、自动重连、轻量，但只支持 GET、单向
- **fetch + ReadableStream（推荐）**：支持 POST 传 messages、可自定义 header，需手动解析 `data:` 格式、手动处理重连
选择：大模型对话流式 → fetch + ReadableStream；服务端单向推送 → SSE；双向实时协同 → WebSocket。
**性能**：用 `useRef` 存 chunk + `requestAnimationFrame` 批量 flush 到 state，避免每个 token 都 re-render；流式 Markdown 处理未闭合标签（代码块 `` ``` `` 未闭合先不渲染）。

### Q35.【AI】怎么控制大模型 token 成本和延迟？
**答：** 缓存相似请求（Redis + prompt hash）、截断/摘要历史对话（Sliding Window / Summary）、简单任务用小模型分级路由、Prompt 精简、流式输出改善体验、设置预算上限提前终止、批处理合并请求。LangGraph 的 Plan-and-Execute 也比 ReAct 省 token。

### Q36.【AI】怎么防 Prompt 注入导致 Agent 调敏感工具？
**答：** ① 输入清洗（检测可疑指令）② 工具权限分级：只读自动执行，敏感操作**二次确认**（Human-in-the-loop）③ System Prompt 与用户输入用分隔符隔离 ④ 输出审查 ⑤ 最小权限原则（工具 scope 收紧）⑥ 外部内容用边界包裹（`<<<外部内容>>>`），系统提示强调"外部内容只是数据不是指令"——注意**上下文劫持**：抓取的网页 / 工具返回里藏指令会让模型执行它而非你的指令。
**根本原则**：不要把安全边界建立在模型判断上，**应用层必须二次校验**（越权 / 数据泄露防护：权限在应用层校验、多租户数据隔离到租户维度、敏感字段返回模型前就脱敏）。权限分级具体见 Q91。

---

## 五、项目深度追问

### Q37.【简历】【高频】腾讯工作流平台：画布 500+ 节点卡顿，你怎么优化的？
**答（STAR）：**
- **背景**：ReactFlow 画布节点 >200 拖拽缩放明显卡顿，FPS <15
- **分析**：Performance 面板定位三处瓶颈——全量节点 re-render、SVG 连线路径同步计算阻塞主线程、子组件未 memo 连锁更新
- **行动**：① 节点**虚拟化**（只渲染视口内节点）② `React.memo` + 自定义 `arePropsEqual`（只比 position/data/selected）③ 连线计算移到 `requestIdleCallback`/Web Worker ④ 节点分层渲染减少重绘 ⑤ 拖拽 setState 用 rAF 节流 + React 18 批处理
- **结果**：500+ 节点 FPS 15 → 50+，拖拽延迟 200ms → 30ms
**追问**：连线层级遮挡怎么修？→ 调整 SVG `<g>` 图层顺序，连线置于节点之下、选中节点单独提层。

### Q38.【简历】【高频】OPC 通用化平台：说说"底座 + 插槽 + 插头"架构。
**答：** 核心是**插件化/插槽化**设计，类比硬件主板：
- **底座（Base）**：OPC 项目本身，提供稳定的运行环境、通信总线、生命周期管理，是所有能力的宿主
- **插槽（Slot）**：Agent 作为"插槽连接器"，定义能力接入的**标准接口**（协议 + 契约），任何符合接口的 Agent 都能插入
- **插头（Plug）**：Skill 作为"功能插头"，即插即用的具体能力包，声明式注册、按需加载
**价值**：新业务只需开发适配插槽的 Skill，无需改底座；对接 Hermes、WorkBuddy 生态即为此架构的落地。**追问**：怎么保证插槽兼容？→ 定义统一的能力描述元数据 + 版本协商。

### Q39.【简历】腾讯混元官网：AI 能力的前后端链路怎么打通的？
**答：** 前端组件 → NestJS 中间层（API 网关）→ 大模型 API。中间层职责：统一鉴权（JWT Guard）、请求适配（文生图/语音/对话参数统一）、流式转发（`@Sse()`）、Redis 缓存相同 prompt、MongoDB 记日志、限流降级。前端封装 `useAIChat`/`AIImageGen`/`AIVoiceToText` 组件，统一超时/限流/异常 UI。3D 模块：前端 Three.js 预览 `.glb`，后端调模型生成。

### Q40.【简历】低代码平台的组件引擎怎么设计的？
**答：** 三层：**物料层**（组件注册 schema：类型/属性/默认值/面板配置，NPM 发布 + 动态 import）、**逻辑层**（表达式引擎 `new Function`/AST、事件总线发布订阅、数据源管理）、**渲染层**（维护 JSON Schema 树，递归渲染 + `React.memo` 局部更新）。schema 序列化存库，支持版本回滚；拖拽用 dnd-kit。

### Q41.【简历】qiankun 微前端：主子应用通信和样式隔离怎么做？
**答：** 通信三方案：① `initGlobalState` Actions 全局状态 ② `CustomEvent` 事件 ③ 主应用挂全局 Store 通过 props 注入（项目实际用）。
样式隔离：`experimentalStyleIsolation`（加 `div[data-qiankun]` 前缀）、`strictStyleIsolation`（Shadow DOM，兼容性差）、CSS Modules/`scoped`、约定类名前缀。实际做法：关掉 strict（弹窗兼容问题多），用 experimental + CSS Modules + 规范约束。

### Q42.【简历】自研脚手架 xhwl-cli 和企业 NPM 私库是怎么做的？
**答：** **xhwl-cli**（Node + commander + inquirer）：`create` 交互选模板（主/子应用/组件库，内置 ESLint + husky），`register` 自动注册 qiankun 子应用，`add` 生成标准组件，`build --privatization` 一键打离线部署包。
**NPM 私库**：Verdaccio（Docker 部署，proxy 官方源 + 淘宝源，权限管理），团队 `.npmrc` 指向内网 registry，组件 + Hooks 发布私库，Storybook 出文档。

### Q43.【简历】福彩系统：跨端开发的坑和解决？
**答：** ① 平台 API 差异 → 统一 API 层 + 条件编译 `#ifdef` ② 样式差异（rpx vs px、iOS fixed 异常）→ rpx 适配 + 动态测量 ③ 第三方 SDK（法大大合同、腾讯身份证、摄像头）→ 原生插件封装 + 小程序端条件编译 ④ App 冷启动白屏 → 资源预置 + nvue 启动页 + 预加载。

---

## 六、软技能 & 综合

### Q44.【简历】"能快速理解并接手现有系统与代码库"，你怎么做的？
**答：** ① 先跑起来（跑通本地环境、走核心链路）② 从入口顺藤摸瓜（路由 → 页面 → 组件 → 接口）③ 看文档 + 画架构/数据流图 ④ 从一个小需求/ bug 入手验证理解 ⑤ 主动 git blame / 找原作者问关键决策。体现：结构化拆解 + 主动沟通。

### Q45.【简历】"主动发现并解决问题"，举个例子。
**答：** 用工作流性能优化举例：没人指派、是我在测试时主动用 Performance 面板发现卡顿 → 定位 → 提方案 → 落地 → 量化收益。强调**发现问题（主动）→ 量化影响 → 推动落地 → 验证结果**的闭环。

### Q46.【简历】怎么保证代码质量和系统稳定性？
**答：** 规范（ESLint/Prettier + Git commit 规范）、Code Review（≥1 人 Approve）、单测/类型检查（TS + Jest/Vitest 覆盖率门槛）、CI 卡点（lint/test 不过不合并）、防御性代码（null 检查、loading/error 态、接口优雅降级）、监控告警兜底。

### Q47. 遇到和产品/后端意见不一致怎么处理？
**答：** 对事不对人：先对齐目标（产品要什么效果 / 后端有什么约束），摆数据和技术成本，给 2–3 个方案 + 各自 trade-off，让业务方决策；技术实现分歧用 POC 验证，而不是空争论。

### Q48. 你怎么学习新技术（比如 AI 方向）？
**答：** 项目驱动 + 官方文档为主：先跑通最小 demo（如 LangGraph 官方示例），再结合实际项目验证，输出笔记沉淀（我有整理成 blog/笔记的习惯）。AI 方向持续跟进大模型 API、Agent、MCP、RAG 的工程实践。

### Q49. 你的职业规划？
**答：** 短期：深耕**前端 + AI 应用**方向，把 AI 能力工程化落地到业务（Agent 编排、AI 前端交互、性能与体验）；中期：向**全栈/技术架构**延伸，能独立主导从前端到后端到 AI 服务的完整交付；长期：成为能把 AI 真正落地到产品里的复合型工程师。

---

## 七、Node + LangGraph Agent 开发（TS/JS 生态）

> 面向 LangGraph.js（`@langchain/langgraph` + `@langchain/core`），State 用 `Annotation` 而非 Python 的 `TypedDict`。对应简历「基于 LangGraph 编排多步骤工作流 + 前端可视化配置」「OPC 底座 + 插槽 + 插头」。

### Q50.【AI】【简历】LangGraph 和 LangChain 的 Chain 本质区别？什么场景该用 LangGraph 而不是普通 Chain / 直接调 LLM？
**答：** Chain 是静态线性执行，一次 `invoke` 跑完；LangGraph 把流程建成**有状态、可循环、可条件分支、可中断**的图（graph）。
- 用 LangGraph：多步自主决策、循环调工具、条件路由、断点续跑、人工介入。
- 用普通 Chain / 直接调：单轮问答、固定管线（一次性 RAG）= 过度设计。
- 对应简历：多步骤 Agent 工作流 + 前端可视化配置，本质是图的编排。

### Q51.【AI】【简历】Node 项目里为什么选 LangGraph.js（TS）而不是 Python 版 LangGraph？
**答：** 团队栈统一、复用 TS 类型与现有 NestJS 后端，避免跨语言进程通信与两套部署。
- 代价：Python 生态（新特性、示例）通常更早更全，JS 版略滞后。
- 选型：已有 Node 服务 + 复用前端工程能力 → JS 版；重科研 / 大量 Python 工具链 → Python 版。

### Q52.【AI】【简历】LangGraph.js 里 State 怎么定义？和 Python 的 `Annotated[Type, reducer]` 怎么对应？
**答：** 用 `Annotation.Root({...})` 声明状态，每个字段配 `Annotation<Type>({ reducer, default? })` 表达累积逻辑。
- Python：`TypedDict` + `Annotated[list, add_messages]`；JS：`Annotation.Root({ messages: Annotation<BaseMessage[]>({ reducer: addMessages }) })`。
- 语义一致，只 API 形态不同；核心是"字段如何合并"。

### Q53.【AI】为什么 State 字段必须配 reducer？不配会怎样？
**答：** 不配 reducer 时，节点返回的同名字段会**整体覆盖**上一轮而非追加。
- `messages` 必须用追加 reducer，否则每轮对话历史被清空，模型失忆。
- 路由 / 计数类字段无累积需求可用覆盖；按需选择。

### Q54.【AI】TS 里怎么给工具 / 节点参数做强类型校验？
**答：** 用 `@langchain/core` 的 `tool()` + **zod** schema 定义入参，自动生成 JSON Schema 给模型挑选与填参。
- 运行时由 zod 校验，错参直接报错返回模型自愈，不污染整图。
- 节点函数用 TS 类型标注 State，编译期发现字段错误。

### Q55.【AI】【高频】StateGraph 怎么加节点、边和条件路由？
**答：** `addNode(name, fn)` 注册节点；`addEdge(a, b)` 普通边；`addConditionalEdges(source, routingFn, {映射})` 条件边。
- `routingFn` 返回下一节点名或 `END`；映射表把返回值映射到具体节点，缺省走 `END` 不可控，务必写全。
- 编译：`graph.compile()` 后才可 invoke / stream。

### Q56.【AI】【高频】ReAct 循环在图里怎么体现？怎么防止死循环？
**答：** 回路：`START → 模型 → 工具 → 模型 …`，每轮模型决定是否再调工具或返回 `END`。
- 防死循环：设 `recursionLimit`（max steps），超限强制终止。
- 配合明确退出条件（"已拿到最终答案"），避免模型无限绕。

### Q57.【AI】`recursionLimit` 超限抛什么错？生产怎么兜底？
**答：** 抛 `GraphRecursionError`。
- 捕获后给模型反馈"已达最大步数"，让其总结当前进度或直接转人工。
- 监控该错误频率，定位提示词 / 工具设计缺陷（循环根因）。

### Q58.【AI】模型节点在 Node 侧怎么调用？流式 token 怎么拿到？
**答：** `ChatModel.bindTools(tools)` 让模型能返回工具调用；用 `graph.streamEvents({}, { version: "v2" })` 订阅 `on_chat_model_stream` 事件拿 token 增量。
- 也可 `stream` 拿整体状态更新；前端按事件类型渲染。

### Q59.【AI】工具异常如何不影响整图？
**答：** 工具内部 `try/catch` + 超时（AbortController）；把错误作为 `ToolMessage` 内容返回，让模型自己决定重试或换路。
- 不把异常抛到图外层，避免整张图崩溃。
- 外部副作用（写库 / 发消息）做好幂等，重试安全。

### Q60.【AI】【简历】Checkpointer 在 Node 怎么用？`thread_id` 的作用？
**答：** 开发用 `MemorySaver`；生产用 `@langchain/langgraph-checkpoint-sqlite` 的 `SqliteSaver`（或 Postgres）。
- 每次调用带 `thread_id`：隔离多用户会话、支持断点续跑、时间旅行调试（回退到某步重跑）。
- 对应简历：前端可视化配置 → 后端按 thread_id 维护每个会话的图状态。

### Q61.【AI】【高频】【简历】Node 后端怎么把 Agent 执行流式推给前端？
**答：** `graph.streamEvents` / `graph.stream` 经 **SSE**（`text/event-stream`）逐事件推前端。
- 前端逐字渲染 token + 高亮"当前节点"（model / tools 状态），对应简历"执行中每个节点状态实时推回前端"。
- 单向推送 SSE 更轻；双向交互走 WebSocket。

### Q62.【AI】短期上下文 vs 长期记忆怎么分层？
**答：** 三层分离——短期=当前轮上下文窗口；长期=向量库 / DB 存的跨会话知识；会话状态=Checkpointer 管的 thread 进度。
- 上下文溢出时把旧对话摘要压缩或外置长期记忆，避免 token 爆。
- 别把长期记忆塞进每轮 State，按需检索注入。
- 另含**程序性记忆**（Skill / 系统提示，做事的方法论而非知识）；长期记忆要有写入条件（只记用户明确偏好 / 跨任务复用结论 / 反复纠正，不记一次性任务细节与未验证假设），新旧冲突时记录带时间戳多版本而非直接覆盖；上下文溢出时在 **70–75% 占用**就摘要压缩，**约束和状态永远不压**。

### Q63.【AI】`interrupt` / `Command.resume` 在 Node 怎么用？
**答：** 节点里 `interrupt(value)` 暂停并产出中间态；外部构造 `Command({ resume: x })` 再 `graph.invoke` 恢复执行。
- 适合审批类流程：暂停 → 人审 → 恢复带结果继续。
- 配合 Checkpointer 持久化暂停点。

### Q64.【AI】哪些节点该 `interrupt`？
**答：** 只在**不可逆副作用**前暂停：发消息、写库、付款、外部 API 调用。
- 纯计算 / 检索节点不停，保流程顺畅。
- 过度 interrupt 会让 Agent 体感卡顿，按需收紧。

### Q65.【AI】【简历】LangGraph.js 服务怎么部署与并发隔离？
**答：** NestJS / Express 常驻进程，每请求独立 `thread_id`；Checkpointer 后端共享存储。
- 不在浏览器直连（密钥 / 限流 / 审计都在服务端）。
- CPU 密集用 `worker_threads`；I/O 密集靠 Node 非阻塞。

### Q66.【AI】【高频】怎么评测一个 LangGraph Agent？
**答：** 构造任务数据集跑指标：任务通过率、工具调用正确率、幻觉率、平均步数 / 成本。
- 接 LangSmith（或自研）追踪每步 token / 耗时 / 工具入参出参，定位"哪步抽风"。
- 回归测试：prompt / 工具改完跑同一批 case 防退化。
- **分层评测**：工具层（选对率 / 参数正确率）/ 轨迹层（步数 / 循环 / 重试）/ 任务层（端到端成功率）/ 质量层（正确性 / 格式）/ 成本层（单任务 token / 成本）/ 性能层（P50/P95）——只看端到端会漏掉"成功率不变但成本翻倍"。LLM-as-judge 有四偏见（位置 / 长度 / 自我 / 宽松），**安全用例必须 100% 通过**。完整维度见 [[interview/自建Agent面试题库]] Q97–Q106。

### Q67.【简历】结合 OPC 项目：怎么把"Skill 即 LangGraph 节点"落地成插槽热插拔？
**答：** 每个 Skill 实现统一 Node 接口（输入 State、输出部分 State、声明依赖工具）；OPC 底座运行时 `addNode` + `addEdge` 动态注册，即插即用。
- 插槽=图的固定编排骨架；插头=可注册 Skill，新增能力不改底座代码。
- 对应"底座 + agent 插槽 + skills 插头"架构，和 Hermes 自进化长 Skill 同源。

---

## 八、前端核心原理

### Q68.【简历】Vue 2 和 Vue 3 的响应式原理有什么区别？
**答（核心）：**

| 维度 | Vue 2 | Vue 3 |
|------|-------|-------|
| 核心机制 | `Object.defineProperty` | `Proxy` |
| 监听范围 | 只能监听已声明属性 | 新增/删除属性自动响应 |
| 数组监听 | 需重写 7 个变异方法 | 原生支持 |
| 性能 | 初始化递归遍历所有属性 | 惰性响应（访问时才转换） |
| 兼容性 | IE9+ | 不支持 IE |

- **Vue 2**：`Object.defineProperty` 对 data 每个属性定义 `get`/`set`，`get` 收集依赖（Dep + Watcher），`set` 通知更新；缺陷：新增属性需 `Vue.set()`、数组需重写变异方法、深层对象初始化递归性能差。
- **Vue 3**：`reactive()` 用 `Proxy` 代理整个对象，`get` 时 `track()` 收集、`set` 时 `trigger()` 触发；`ref()` 用 `RefImpl` 包装原始值，`.value` 触发响应；**惰性收集**（只有被 `effect` 读取的属性才建依赖）；Proxy 是引擎层拦截，比 defineProperty 快。
- **加分点**：`effectScope` 管理 effect 生命周期；`shallowReactive`/`shallowRef` 只代理第一层；`markRaw` 跳过响应式转换。

### Q69.【简历】React Hooks 性能优化你做了哪些？
**答（核心）：** 分场景：① 避免不必要 re-render——`React.memo` 包裹子组件、`useMemo` 缓存计算结果、`useCallback` 缓存函数引用（关键认知：`useMemo`/`useCallback` 本身有开销，只在传给 memo 子组件或依赖数组中才有意义）；② 状态拆分与下移——频繁变化状态下移到叶子组件，大表单用 `useReducer` 替代多个 `useState`；③ 列表虚拟化——`react-window`/`react-virtualized` 只渲染可见行（工作流平台 500+ 节点即此方案）；④ 批量更新——React 18 自动批处理，`useTransition`/`startTransition` 标记非紧急更新；⑤ 代码分割——`React.lazy` + `Suspense` 路由级懒加载，`import()` 动态导入重组件；⑥ 并发渲染——`useDeferredValue`/`useTransition` 把昂贵更新标记过渡，保持 UI 响应。
**追问：** `useMemo` 与 `useCallback` 区别 → `useCallback(fn, deps)` 等价于 `useMemo(() => fn, deps)`；简单值缓存比计算还简单时不用 `useMemo`。

### Q70.【高频】Vue 和 React 的 Diff 算法有什么区别？
**答（核心）：** 共同基础：同层比较、Type 标识、Key 优化。
- **Vue 2 双端对比**：头头/尾尾/头尾/尾头四种对比，乱序部分用旧节点 key→index 的 Map 查找。
- **Vue 3 最长递增子序列（LIS）**：头尾预检跳过相同节点，中间用 LIS 找不需移动的节点，只有不在 LIS 中的才移动 DOM。
- **React 单向从左到右**：逐个比较用 key 匹配，移动时直接移动不找最优方案。
- **核心差异**：Vue 3 LIS > Vue 2 双端 > React 单向；React Fiber 使 Diff 可中断恢复，Vue Diff 同步不可中断。

### Q71.【高频】TypeScript 中 type 和 interface 的区别？什么场景用哪个？
**答（核心）：**

| 维度 | `interface` | `type` |
|------|------------|--------|
| 扩展方式 | `extends` 继承 | `&` 交叉类型 |
| 声明合并 | 同名自动合并 | 不允许重复定义 |
| 描述范围 | 对象/类 | 对象/原始值/元组/联合/映射 |
| 计算 | 不支持 | 支持条件类型、映射类型 |

**实际选择**：对象/类形状、API 响应/DTO、组件 Props → 优先 `interface`；联合/交叉/工具类型 → 必须 `type`。

### Q72.【简历】WebSocket 实时通讯怎么实现的？心跳保活怎么做的？
**答（核心）：** 封装 WebSocket 管理类：① 连接管理——`new WebSocket(url)`，监听 `onopen`/`onmessage`/`onclose`/`onerror`，状态机 connecting→connected→disconnecting→disconnected；② 心跳保活——每 30s 发 `{"type":"ping"}`，服务端回 `{"type":"pong"}`，超 3 次未收 pong 判定断开触发重连；③ 断线重连——指数退避 1s→2s→4s→…→30s，超上限提示手动重连，重连恢复订阅频道；④ 消息分发——按 `type` 路由到不同处理函数，支持订阅/取消订阅。
**追问：** WebSocket vs SSE → 双向选 WS、单向推送选 SSE；大量消息用队列缓冲 + `requestAnimationFrame` 批量处理。`requestAnimationFrame`（下一帧渲染前，高优先级）与 `requestIdleCallback`（浏览器空闲时，低优先级）分工：前者动画/视觉更新，后者后台任务。

---

## 九、跨端开发

### Q73.【简历】React Native 跨端：Android/iOS 统一渲染逻辑怎么保证的？
**答（核心）：** 原则：业务逻辑 100% 共享，平台差异封装到适配层。
- **样式统一**：`StyleSheet.create`；尺寸用 `Dimensions.get('window')` 动态适配；Design Token + `Platform.select` 微调。
- **平台差异封装**：`SafeAreaView` + `Platform.select` 处理状态栏/安全区；React Navigation 统一路由；原生模块（相机/推送）封装成统一 JS 接口。
- **条件编译**：文件级 `Component.ios.tsx`/`Component.android.tsx`（Metro 自动加载）；代码级 `Platform.OS === 'ios'`。
- **Expo 集成**：`expo-camera` 等跨平台 API，`npx expo prebuild` 生成原生代码。
**追问：** RN 与原生通信 → 旧架构 Bridge / 新架构 JSI（NativeModules）；性能优化 → FlatList 虚拟化、`react-native-fast-image`、Animated + `useNativeDriver`。

### Q74.【高频】UniApp 和 Taro 的优缺点对比？你怎么选型？
**答（核心）：**

| 维度 | UniApp | Taro |
|------|--------|------|
| 语法 | Vue 为主 | React 为主，也支持 Vue |
| 编译 | DCloud 自有编译器 | 多端编译（Webpack/Vite） |
| 生态 | DCloud 插件市场丰富 | 社区活跃 |
| App | nvue 原生渲染 / WebView | React Native 方案 |
| 调试 | HBuilderX | VS Code / CLI |

**选型**：团队 Vue 栈 → UniApp（生态好、上手快）；React 栈 → Taro；需 App 原生渲染 → UniApp 的 nvue。实际福彩系统选 UniApp（团队 Vue 栈 + DCloud 生态成熟 + 第三方 SDK 多）。

### Q75.【简历】跨端开发中遇到的最大坑是什么？怎么解决的？
**答（核心）：** ① 各平台 API 差异 → 封装统一 API 层，内部 `#ifdef` 条件编译分平台调用；② 样式渲染差异（H5 Flex 在小程序异常、`fixed` 在 iOS WebView 异常）→ 用 `rpx` 替代 `px`、复杂布局降级 float/table、`uni.createSelectorQuery` 动态适配；③ 第三方 SDK 接入（法大大/腾讯身份证/TP-Link 摄像头）→ 写原生插件封装，小程序端条件编译，前端统一接口调用；④ App 冷启动白屏 → 首屏资源预置本地 + `nvue` 启动页 + 预加载下一页。

---

## 十、架构与业务对接

### Q76.【简历】海外彩票平台：NestJS 怎么封装第三方游戏数据接口的？
**答（核心）：** 问题：多个第三方供应商 API 格式各异，前端直连需适配多套结构。
- **适配器模式**：定义统一 `GameService` 接口（`getLotteryResult`/`getGameList`/`placeBet`）；每个供应商实现 Adapter；NestJS Provider 按参数动态选择。
- **统一数据模型**：定义统一 DTO，所有 Adapter 转换第三方数据为统一格式，前端只对接标准化接口。
- **请求封装**：各 Adapter 内部用 `HttpService`（Axios）封装各自鉴权（API Key / OAuth）、超时、重试、错误格式化。
- **缓存策略**：开奖结果 Redis 缓存（TTL 5 分钟），历史数据缓存更长。

### Q77.【简历】技术选型时怎么决策的？
**答（核心）：** 四维度决策框架：① **业务匹配度**（技术能否解决核心问题，如低代码选飞书低代码因生态匹配）；② **团队熟悉度**（看现有栈，避免推倒重来，不盲目追新）；③ **生态与维护**（社区活跃度、文档完善度、废弃风险，如选 qiankun 因社区成熟）；④ **长期成本**（上手 vs 维护成本、招聘难易、能否渐进迁移）。
**案例**：微前端 qiankun vs micro-app/wujie → qiankun（生态最成熟）；跨端 UniApp vs Taro → 按团队 Vue 栈选 UniApp。

### Q78.【简历】Google 广告及归因系统 API 调研对接，你怎么做的？
**答（核心）：** ① **API 研读**：Google Ads API（Campaign/AdGroup/Report）+ OAuth 2.0（Service Account / Refresh Token）；② **归因对接**：Google Analytics Data API，归因模型 Last Click / First Click / Data-driven，前端展示转化漏斗、渠道贡献度、ROI；③ **鉴权方案**：用户授权拿 Access + Refresh Token，NestJS 中间层自动刷新过期 Token，只申请必要 scope（`ads.readonly`）；④ **数据展示**：ECharts 可视化花费/曝光/点击/转化，归因多维度对比。

### Q79.【高频】鸿蒙开发跟普通前端开发有什么区别？
**答（核心）：**

| 维度 | Web 前端 | 鸿蒙 (ArkTS/ArkUI) |
|------|----------|---------------------|
| 语言 | JS/TS | ArkTS（TS 超集） |
| UI 框架 | React/Vue | ArkUI 声明式 |
| 布局 | CSS Flex/Grid | Flex/Column/Row 声明式 |
| 状态管理 | useState/Pinia | @State/@Prop/@Link |
| 生命周期 | useEffect/onMounted | aboutToAppear/aboutToDisappear |

**核心区别**：ArkTS 类型更严格（禁 `any`/`unknown`，编译期静态检查）；ArkUI 声明式类似 SwiftUI/Flutter；状态驱动 UI（`@State` 变化自动刷新，类似 Vue 响应式）；分布式跨设备调用（手机→平板→智慧屏）；ArkTS 编译为方舟字节码接近原生性能。

---

## 十一、Agent 系统设计深挖（题库精选）

> 以下为 [[interview/自建Agent面试题库]]（120 题完整版）中，前四章与第七章未覆盖、面试高频的核心考点精选。完整版含参考答案、表格与追问预案，深度准备直接看该文件。

### Q80.【AI】【高频】单 Agent 和多 Agent 怎么抉择？
**答：** 先看**上下文是否爆掉**——多 Agent 的唯一实质收益是**上下文隔离**，不是并行提速。决策路径：单 Agent 跑通 → 上下文爆 → Router 模式 → 需质量把关 → 加 Supervisor → 有明确独立子任务 → 上 Parallel。**不要一开始就上 Supervisor**（复杂度是单 Agent 的 3–5 倍）。判断标准：单 Agent 撞到上下文墙了吗？没撞到就别拆。

### Q81.【AI】多 Agent 的四种编排模式？各适用什么？
**答：**

| 模式 | 机制 | 适用 |
|---|---|---|
| Router | 入口只做意图判断，按类型分发 | 任务类型可枚举 |
| Parallel | 子任务无依赖同时跑，汇总 / 投票 | 调研、多方案对比 |
| Supervisor | 主 Agent 拆解、分派、验收、决定重做 | 长任务、需质量复核 |
| Pipeline | 固定顺序逐级加工 | 内容生成、审核加工 |

**最通用**：Supervisor（拆解 → 分派 → 验收 → 最多 3 轮退回 → 转人工）。子任务契约七要素：身份 / 目标 / 输入 / 约束 / 输出格式 JSON schema / 验收标准 / 预算与上报；最不可省的是输出格式和验收标准。

### Q82.【AI】Agent 系统怎么分层划模块？
**答：** 五层，每层职责单一、可独立替换：接入层（对话 / API / 权限入口）· 编排层（规划 / 工具选择 / 重试 / 终止，核心是 ReAct 循环 + 状态机）· 能力层（工具注册 / Schema 契约 / 沙箱，MCP/Skill 挂载点）· 记忆状态层（短期上下文 / 长期偏好 / 断点恢复）· 基础设施层（日志 / trace / 成本 / 评测 / 灰度，横切）。
**加分点**：Agent 瓶颈是模型延迟不是吞吐，单体 + 清晰分层比微服务拆分更划算。

### Q83.【AI】【高频】一个 Agent 该挂多少工具？过多怎么办？
**答：** 20 个以内全量注入；20–40 做工具搜索（只注入目录，用到再拉 schema）；40+ 语义路由 + 工具搜索，或子 Agent 隔离。工具数 > 60 选择准确率断崖下跌（调不存在的工具、在相似工具间横跳）。**动因**：每个 tool schema 占 100–300 token，且工具数量与选择准确率负相关。Tool Search 能把 20 个工具从 3000 token 降到约 500（省 85%，工具数 > 20 才为正）。

### Q84.【AI】【高频】工具 description 怎么写才准？
**答：** description 比工具实现更重要（决定模型何时调它）。必须含三段：① 做什么（动词开头）② 什么时候用（触发场景）③ 什么时候不用（边界）。
**反例**：`查询数据库`
**正例**：`执行只读 SQL 查询数据库。用于从业务表取数、统计、验证假设。不用于：写操作、schema 变更、跨库查询`
长度 20–40 字最佳：太短区分度不够，太长占上下文。

### Q85.【AI】任务终止条件怎么设计（防死循环）？
**答：** 五个信号，缺一不可：

| 信号 | 判定方式 |
|---|---|
| 成功 | 明确终态标记 + 自检通过 |
| 步数上限 | 累计 > N（建议 10–25） |
| token 预算 | 累计消耗 > B |
| 循环检测 | 最近 5 步「工具+参数」组合重复 |
| 停滞检测 | 连续 3 步观察结果无变化 |

**最易漏掉的是停滞检测**——循环检测只能发现完全重复，停滞检测能发现"反复调不同参数但结果一样"的隐性空转。LangGraph 侧另加 `recursionLimit` 兜底（超限抛 `GraphRecursionError`，见 Q57）。

### Q86.【AI】上下文怎么分区、压缩、防腐化？
**答：** 分区：固定区（角色 / 输出格式契约 / 关键约束，**永不裁剪**置顶）· 状态区（进度 / 已收集信息 / 待办，每步更新）· 观察区（工具返回，只留最近 N 条 + 摘要）· 历史区（早期对话 / 推理，压成摘要）· 召回区（外部检索，按 query 动态召回）。
压缩：占用达 **70–75%** 就压（别等爆），用廉价模型按语义段压，**约束和状态永远不压**。
防腐化：定期重生成"状态清单"替代原始历史、主动清除已解决的错误路径、关键约束每 N 步重申一次。

### Q87.【AI】工具调用的错误怎么分类与重试？
**答：** 按错误类型分级，**最易错的是把业务错误算进故障率导致误熔断**：

| 错误类型 | 重试策略 |
|---|---|
| 超时 / 网络错误 | 退避重试 3 次 |
| 限流 429 | 带 `Retry-After` 重试 |
| 5xx | 重试 2 次 |
| 4xx 参数错误 | **不重试**，原样返回给模型 |
| 认证失败 | 不重试，熔断 |
| 业务错误（"找不到文件"） | **不重试，这不是故障** |

### Q88.【AI】什么是"空转"？怎么检测？
**答：** Agent 执行无效动作、没有向目标收敛。三种形态：① 显式循环（完全相同的工具+参数重复）② 隐性空转（参数在变但结果一样）③ 伪探索（穷举式尝试，无方向性）。
检测：循环检测（最近 5 步组合重复）+ 停滞检测（连续 3 步结果无变化）。**停滞检测比循环检测更重要**，因为隐性空转占多数。

### Q89.【AI】模型自己判断"任务是否完成"可靠吗？
**答：** 不可靠——模型有很强的**完成偏置**，会倾向宣布完成以结束任务。必须配合：① 可验证的验收标准（契约里的清单）② 规则校验（能用代码判的绝不用模型判）③ 外部信号（测试通过 / 文件存在 / 状态已改）。
**原则：能用确定性规则验证的，不要用模型验证。**

### Q90.【AI】什么是"工具幻觉"？怎么防？
**答：** 模型调用不存在的工具，或编造工具参数值。成因：工具描述模糊与其他工具重叠、工具数量过多导致选择困难、上下文里残留了其他场景的工具信息。
防护：工具名清晰无歧义、每个工具有唯一用途边界、超 20 个时做聚合、幻觉发生后返回明确错误让模型重新选，**而非静默失败**。

### Q91.【AI】【高频】工具权限怎么分级？
**答：**

| 级别 | 定义 | 处理 |
|---|---|---|
| L0 只读 | 读文件、查数据库（只读） | 直接执行 |
| L1 低风险写 | 写草稿、创建分支 | 记录日志 |
| L2 对外可见 | 发 issue、发消息、提交 MR | 二次确认 |
| L3 不可逆 | 删除、发布、付款、部署 | 二次确认 + 明确展示影响 |

**关键**：分级要落到工具定义里，不能靠模型自觉。二次确认只在真正需要时打断（L2/L3、批量操作、首次执行该类操作），且信息要具体——"将创建 3 个 issue 到 project-x 仓库"优于"确认执行？"。与 Q36 Prompt 注入配套：**根本原则是不把安全边界建立在模型判断上，应用层必须二次校验**。

### Q92.【AI】【高频】RAG 工程要点：混合检索 + rerank + 分块？
**答：** 离线：加载 → 清洗 → 分块 → 向量化 → 入库；在线：query 改写 → 多路召回 → rerank → 组装 → 注入。
**质量决定点**：召回率决定上限，重排决定实际精度——必须**混合检索 + rerank**，只做向量检索精度差一截。
混合：向量（语义相似）+ BM25（专有名词 / 错误码 / 版本号在语义空间无区分度）+ 元数据过滤；融合用 **RRF**（倒数排名融合，`1/(60+rank)` 求和，比加权平均鲁棒、不用调权重）。
分块：递归字符切分 + **父子块**（小块索引精准、召回后注入父块保完整），中文 300–500 字、块间留 10–15% 重叠。
**最大风险是答得很流畅但完全编造**——相似度低于阈值要明确拒答，不是拿最不相关的结果凑。

### Q93.【AI】【高频】怎么评测一个 Agent（维度 + LLM-as-judge 偏见）？
**答：** 分层评测：

| 层级 | 指标 |
|---|---|
| 工具层 | 工具选对率、参数正确率、调用成功率 |
| 轨迹层 | 平均步数、循环次数、重试次数 |
| 任务层 | 端到端成功率 |
| 质量层 | 输出正确性、完整性、格式合规 |
| 成本层 | 单任务 token / 成本 |
| 性能层 | P50 / P95 延迟 |

**只看端到端会丢失细节**——成功率不变但成本翻倍，你不会知道。
LLM-as-judge 四种偏见与缓解：位置偏见（交换顺序取一致）/ 长度偏见（明确要求"只判质量不看长度"）/ 自我偏好（用第三方模型做 judge）/ 宽松偏见（改二元判定而非 1–10 分）。
**门槛**：安全用例必须 **100% 通过**，其他指标（成功率、成本、延迟）可妥协。先建 20–30 条真实用例评测集再优化，否则迭代就是盲改。

### Q94.【AI】什么是"能力缺口"？怎么定位？
**答：** 某任务既没有对应工具（MCP / Skill 缺失），也没有对应方法论（不知道怎么做）时的状态。
**排查方法**：统计失败 trace，按「无合适工具」和「工具选错」分类——前者是**接入缺口**（补 MCP），后者是**描述缺口**（改 description）。
**意义**：这个概念直接决定"该补 MCP 还是该补 Skill"。

### Q95.【AI】代码执行沙箱 / 越权防护怎么做？
**答：** 沙箱隔离层级（按需求递增）：子进程 + 独立工作目录 → 资源限制（CPU / 内存 / 时间 / 磁盘）→ 网络出网白名单（禁内网）→ 文件系统只读挂载系统目录 → 非 root / 容器隔离。**判断标准：执行的代码来源是否可信**——跑用户上传的代码必须全隔离，跑自己的固定脚本可放宽；沙箱逃逸是真实风险，不要假设绝对安全。
越权 / 数据泄露：权限在**应用层**校验不靠模型；多租户场景数据隔离到租户维度、工具查询强制带租户过滤条件；敏感字段在**返回给模型前**就脱敏，不依赖模型不输出；工具粒度而非 Agent 粒度授权；审计日志记录"谁通过哪个 Agent 访问了什么"。

---

## 附：速答速查表（面试前 10 分钟扫）

| 问题 | 一句话答案 |
|---|---|| Node 适合什么 | I/O 密集（非阻塞 + Event Loop）；CPU 密集用 cluster/worker |
| NestJS AOP | Middleware→Guard→Interceptor→Pipe→Controller→Filter |
| B+ 树做索引 | 树矮 IO 少、叶子链表适合范围查询、查询稳定 |
| 最左前缀 | 联合索引必须从左连续匹配才生效 |
| 事务隔离级别 | RC / RR（默认）/ 串行化；RR 用 MVCC + 间隙锁 |
| Redis 穿透/击穿/雪崩 | 布隆过滤器 / 互斥锁 / 过期加随机 |
| 缓存一致性 | Cache Aside：更新 DB 后删缓存；延时双删 / binlog |
| JWT | Header.Payload.Signature；无状态但难失效 |
| OAuth2 授权码 | code 换 token；SPA 加 PKCE |
| PKCE 防授权码拦截 | S256 哈希 challenge，截获 code 无 verifier 也换不到 token |
| OIDC vs OAuth2 | OIDC 在授权上加了"认证"层，返回 id_token |
| CSRF 防御 | SameSite / CSRF Token / 校验 Origin |
| Docker 多阶段 | 构建镜像与运行镜像分离，体积 1G→25M |
| Agent vs LLM | Agent = LLM + 工具 + 记忆 + 规划 |
| Agent vs Workflow | 控制权在 LLM vs 在代码 |
| Function Calling | 模型输出"调什么"的 JSON，你的代码执行 |
| MCP | 工具接入标准协议（USB），三原语 Tools/Resources/Prompts |
| Skill vs MCP | Skill=怎么做（方法论）；MCP=用什么做（工具连接） |
| LangGraph vs LangChain | 图结构支持循环/分支/状态/checkpoint，LangChain 是线性 Chain |
| RAG | 切分→向量化→检索→拼 Prompt→生成 |
| 大模型流式 | fetch + ReadableStream（POST）或 SSE；rAF 批量刷新 |
| 画布性能优化 | 虚拟化 + memo + 连线异步 + 分层 + 批处理 |
| LangGraph vs Chain | 图支持循环/分支/状态/checkpoint；Chain 线性 |
| 为何 LangGraph.js | TS 栈统一、复用类型与 NestJS，免跨语言 |
| State 定义(JS) | Annotation.Root + reducer，对应 Python Annotated |
| reducer 必配 | 不配覆盖，messages 丢历史 |
| 工具强类型 | tool()+zod 生成 JSON Schema |
| 加节点/边/路由 | addNode/addEdge/addConditionalEdges(fn→节点/END) |
| ReAct 循环 | model→tools→model，路由判 END |
| 防死循环 | recursionLimit 护栏 |
| 超限兜底 | 抛 GraphRecursionError，捕获转提示/人工 |
| 模型流式 | bindTools+streamEvents v2 拿 token 增量 |
| 工具异常 | try/超时，错误作 ToolMessage 让模型自愈 |
| Checkpointer | MemorySaver/SqliteSaver+thread_id 续跑隔离 |
| 前端流式 SSE | streamEvents 透传，逐字+节点态 |
| 记忆分层 | 上下文/长期记忆/会话状态 三者分离 |
| interrupt | 敏感操作前暂停，Command.resume 恢复 |
| 何时 interrupt | 仅不可逆副作用（发消息/写库/付款） |
| 部署并发 | 常驻+每请求 thread_id，密钥在服务端 |
| 评测 Agent | 通过率/工具正确率/幻觉率+LangSmith |
| Vue2/3 响应式 | defineProperty vs Proxy；Vue3 惰性收集、LIS Diff |
| React Hooks 优化 | memo/useMemo/useCallback + 状态下移 + 虚拟化 + 并发 |
| Vue/React Diff | Vue3 LIS > Vue2 双端 > React 单向；Fiber 可中断 |
| TS type vs interface | 对象/DTO 用 interface；联合/工具类型用 type |
| WebSocket 心跳 | 30s ping/pong，指数退避重连 |
| 跨端 RN | 逻辑共享 100%，差异封适配层；Platform.select/条件编译 |
| UniApp vs Taro | Vue 栈选 UniApp，React 栈选 Taro |
| 技术选型 | 业务匹配/团队熟悉/生态维护/长期成本 四维度 |
| 鸿蒙 vs Web | ArkTS 严格 + ArkUI 声明式 + 分布式 + 方舟字节码 |
| 单 vs 多 Agent | 先看上下文是否爆掉；多 Agent 唯一收益是上下文隔离，不是提速 |
| 四种编排模式 | Router 分发 / Parallel 汇总 / Supervisor 验收 / Pipeline 加工 |
| Agent 五层 | 接入 / 编排 / 能力 / 记忆状态 / 基础设施（横切） |
| 工具数量 | 20 内全量、20–40 搜索、40+ 路由+隔离；>60 准确率断崖 |
| 工具 description | 做什么+何时用+何时不用；20–40 字，比实现更重要 |
| 终止条件 | 成功/步数(10-25)/预算/循环检测/停滞检测，最易漏停滞 |
| 上下文分区 | 固定区永不裁 + 状态区每步更 + 观察区留最近 N + 历史压摘要 |
| 上下文压缩 | 70–75% 就压，用廉价模型；约束和状态永远不压 |
| 错误重试 | 超时网络退避；4xx 不重试；业务错误不是故障，别误熔断 |
| 空转检测 | 显式循环/隐性空转/伪探索；循环+停滞双检测更稳 |
| 模型自判完成 | 不可靠（完成偏置），必须用规则/外部信号验收 |
| 工具幻觉 | 描述模糊+数量过多；返回明确错误让模型重选，别静默失败 |
| 权限分级 | L0 只读 / L1 低风险写 / L2 对外可见 / L3 不可逆，落到工具定义 |
| RAG 工程 | 混合检索(BM25+向量)+rerank+RRF；最大风险是流畅编造 |
| 评测六层 | 工具/轨迹/任务/质量/成本/性能；judge 四偏见；安全 100% |
| 能力缺口 | 无工具且无方法论；区分补 MCP 还是改 description |

---

> **使用建议**：每题先理解核心思路，再结合**自己的项目经历**复述，避免背诵感。被追问不慌，没深入实践过的诚实说"了解原理、没在生产深入用过"，展示学习态度更能加分。
