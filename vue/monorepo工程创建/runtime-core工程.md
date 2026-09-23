> 类型: 章节 · 来源: [[vue/monorepo工程创建]] · 更新: 2026-09-23
>
> ---

## runtime-core工程

工程的相关处理和上面reactivity和shared基本一致，就不再重复了。

由于runtime-core工程中需要用到reactivity和shared中的代码，当然需要通过Monorepo工程进行引入

```typescript
pnpm add @vue/shared @vue/reactivity --workspace --filter @vue/runtime-core
```
