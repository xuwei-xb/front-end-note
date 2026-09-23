> 类型: 章节 · 来源: [[vue/monorepo工程创建]] · 更新: 2026-09-23
>
> ---

## monorepo工程引用

安装工作空间中的一个包到工作空间的另外一个包：

```typescript
pnpm add <包名B> --workspace --filter <包名A>
```

上面的命令表示将B包安装到A包里面，也就是说B包成为了A包的一个依赖。

我们这里的例子中，将shared安装到reactivity中

```typescript
pnpm add @vue/shared --workspace --filter @vue/reactivity
```

这样，就在reactivity工程包中，直接引入了工作空间的另外一个包shared，我们要引入相关内容的时候，可以如下：

```typescript
import { isArray, isIntegerKey } from "@vue/shared";
```
