> 类型: 章节 · 来源: [[vue/monorepo工程创建]] · 更新: 2026-09-23
>
> ---

## api-extractor的问题

如果在其他的工程中导出引入工程，比如在runtime-core的工程中，导出reactivity工程的代码

```typescript
export * from "@vue/reactivity";
```

再次打包，就会提示下面的错误：

```typescript
Error: /Users/yingside/Desktop/duyi-vue/packages/shared/src/index.ts:1:1 - (ae-wrong-input-file-type) Incorrect file type; API Extractor expects to analyze compiler outputs with the .d.ts file extension. Troubleshooting tips: https://api-extractor.com/link/dts-error
```

这其实是api-extractor的问题，我们按照错误提示，屏蔽掉错误，在**全局api-extractor.json**配置中加入下面的代码即可：

```typescript
"messages": {
  "extractorMessageReporting": {
    // ... 其他配置
    "ae-wrong-input-file-type": {
      "logLevel": "none"
    }
  }
}
```
