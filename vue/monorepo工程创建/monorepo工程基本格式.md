> 类型: 章节 · 来源: [[vue/monorepo工程创建]] · 更新: 2026-09-23
>
> ---

## monorepo工程基本格式

![image-20241114111129025](./assets/image-20241114111129025.png)

**pnpm-workspace.yaml**

指定工程管理目录

```typescript
packages:
  - "packages/**"
```

这里配置之后，我们在安装第三方包的时候，就需要指定安装参数，如果是全局安装，就需要指定-w或者--workspace-root
