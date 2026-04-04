# Prettier 完全指南

## 一、Prettier 是什么

**Prettier** 是一个代码格式化工具，它可以自动调整代码样式，使其更具可读性和一致性。支持多种编程语言，包括 JavaScript、TypeScript、HTML、CSS、SCSS、GraphQL、JSON、Markdown 等。

### 为什么需要 Prettier

代码风格问题是所有程序员都会遇到的困境：
- 团队协作时风格不统一
- 个人偏好差异（分号 vs 无分号、单引号 vs 双引号、命名规范等）
- 代码风格过于主观，难以达成共识

Prettier 的出现是为了终结这场"代码风格圣战"，提供一个**标准化、美观、统一**的代码格式方案。

### 核心特点

- **一致的代码风格**：帮助团队成员统一代码风格，减少代码审查时的格式争议
- **零配置开箱即用**：默认配置满足大多数项目需求，无需复杂配置
- **广泛的编辑器支持**：VS Code、Sublime Text、Atom 等都有相应插件
- **灵活的自定义**：虽默认配置已足够优秀，但仍支持通过 `.prettierrc` 文件自定义
- **自动化处理**：可自动格式化文件，无需手动调整
- **多语言支持**：覆盖主流编程语言和文件格式

---

## 二、工作原理

Prettier 的格式化流程分为两个核心步骤：

### 1. 解析为 AST

Prettier 首先将代码转换为抽象语法树（AST）。底层使用 **Recast** 库，而 Recast 实际上通过 **Esprima** 来解析 ES6 代码。

**Esprima 的作用**：进行词法分析和语法分析

```javascript
// 示例：Esprima 的词法分析
const esprima = require('esprima');
const program = 'const answer = 42';

esprima.tokenize(program);
// 输出：[ { type: 'Keyword', value: 'const' }, 
//       { type: 'Identifier', value: 'answer' }, ... ]
```

无论原始代码多混乱，Prettier 都会抹掉所有样式，提取最本质的语法树结构。

### 2. 应用格式化规则输出

基于解析后的 AST，Prettier 使用自身的代码风格规则重新输出格式化后的代码。

**扩展性原理**：理论上，只要将一门语言的代码抽象为语法树，并制定对应的格式化规则，就可以支持任意语言的格式化。Prettier 通过插件机制实现对新语言的支持。

### 常见插件

| 插件名称 | 支持语言 |
|---------|---------|
| prettier-plugin-svelte | Svelte 组件 |
| prettier-plugin-toml | TOML 配置文件 |
| prettier-plugin-java | Java |
| prettier-plugin-php | PHP |

---

## 三、Prettier 的设计哲学

### Opinionated vs Unopinionated

软件工具通常分为两类设计理念：

- **Opinionated（有观点）**："我全包了，你用我的就行，有锅我背"
- **Unopinionated（无观点）**："给你一堆零件，自己组装"

**Prettier 属于 Opinionated 哲学**：它提供的代码风格是最优的，不希望用户过度自定义，而是信任 Prettier 已经为你做出了最佳决策。

---

## 四、快速上手

### 1. 安装

```bash
# 初始化项目
pnpm init

# 安装 prettier（精确版本）
pnpm add --save-dev --save-exact prettier
```

### 2. 基本使用

**方法一：命令行**

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "format": "prettier --write ."
  }
}
```

运行格式化：
```bash
pnpm format
```

**方法二：VS Code 插件**

安装 Prettier 插件后，可通过以下方式触发：
- 保存时自动格式化（需配置）
- 手动格式化（`Shift + Alt + F`）
- 右键菜单 → "格式化文档"

**两种方式对比**：

| 维度 | 命令行 | VS Code 插件 |
|-----|-------|-------------|
| 实时性 | 低，需手动执行 | 高，编写时即时反馈 |
| 范围 | 可一次性格式化整个项目 | 仅格式化当前文件 |

### 3. 自定义配置

在项目根目录创建 `.prettierrc` 文件：

```json
{
  "singleQuote": true,
  "semi": false,
  "printWidth": 80,
  "trailingComma": "es5"
}
```

**配置说明**：
- `singleQuote`：使用单引号
- `semi`：不添加分号
- `printWidth`：单行最长 80 字符
- `trailingComma`：ES5 风格的尾随逗号

---

## 五、格式化规则详解

完整规则参考：https://prettier.io/docs/en/options.html

### 常用规则

| 规则 | 默认值 | 说明 |
|-----|-------|------|
| `printWidth` | 80 | 行宽限制，超长自动换行 |
| `tabWidth` | 2 | 缩进宽度 |
| `useTabs` | false | 是否使用 tab 缩进 |
| `semi` | true | 语句末尾添加分号 |
| `singleQuote` | false | 使用单引号 |
| `trailingComma` | "es5" | 尾随逗号策略 |
| `bracketSpacing` | true | 对象括号内空格 |
| `arrowParens` | "avoid" | 箭头函数参数括号 |
| `htmlWhitespaceSensitivity` | "css" | HTML 空格处理 |
| `jsxBracketSameLine` | false | JSX 标签闭合风格 |

> **最佳实践**：这些默认规则本身就是行业最佳实践标准，日常编写代码时应主动遵循。

---

## 六、配置文件与优先级

### 配置方式（优先级从高到低）

1. **命令行选项**
   ```bash
   prettier --no-semi --print-width 50 --write .
   ```

2. **配置文件**（支持多种格式）
   - `.prettierrc.js` / `prettier.config.js`（最高优先级）
   - `.prettierrc.yaml` / `.prettierrc.yml`
   - `.prettierrc.json`
   - `.prettierrc`

3. **package.json**
   ```json
   {
     "prettier": {
       "singleQuote": true,
       "tabWidth": 4
     }
   }
   ```

4. **编辑器配置**
   在编辑器 settings 中配置

5. **Prettier 默认配置**（最低优先级）

### 忽略文件

类似 `.gitignore`，创建 `.prettierignore` 排除特定文件：

```gitignore
# 忽略所有 .min.js 文件
*.min.js

# 忽略 build 目录
/build/

# 忽略 node_modules
node_modules/

# 忽略特定文件
my-special-file.js
```

---

## 七、命令行工具详解

### 基本语法

```bash
prettier [options] [file/dir/glob ...]
```

### 常用选项

| 选项 | 说明 | 别名 |
|-----|------|-----|
| `--write` | 写入文件（而非仅输出） | `-w` |
| `--check` | 检查文件是否已格式化 | 无 |
| `--config` | 指定配置文件路径 | 无 |
| `--no-config` | 不读取配置文件 | 无 |
| `--ignore-path` | 指定忽略文件路径 | 无 |

### 使用示例

```bash
# 格式化单个文件
prettier --write file.js

# 格式化指定目录下的所有 JS 文件
prettier -w "src/**/*.js"

# 检查文件格式化状态
prettier --check src/

# 使用指定配置文件
prettier --config ~/configs/prettier.json --write .
```

---

## 八、API 使用

### prettier.format(source, options)

格式化代码的核心 API。

```javascript
const prettier = require('prettier');
const fs = require('fs');
const path = require('path');

const options = {
  singleQuote: false,
  printWidth: 50,
  semi: false,
  trailingComma: 'es5',
  parser: 'babel', // 使用 API 时必须指定 parser
};

fs.readdir('src', (err, files) => {
  if (err) throw err;
  
  files.forEach(file => {
    const sourcePath = path.resolve('src', file);
    const jsSource = fs.readFileSync(sourcePath, 'utf8');
    
    prettier.format(jsSource, options).then(formatted => {
      fs.writeFileSync(sourcePath, formatted, 'utf-8');
    });
  });
  
  console.log('格式化完毕...');
});
```

### prettier.check(source, options)

检查文件是否已格式化。

```javascript
const prettier = require('prettier');
const fs = require('fs');
const path = require('path');

const options = {
  parser: 'babel',
};

fs.readdir('src', async (err, files) => {
  if (err) throw err;
  
  let isAllFormatted = true;
  
  for (const file of files) {
    const sourcePath = path.resolve('src', file);
    const jsSource = fs.readFileSync(sourcePath, 'utf8');
    
    const isFormatted = await prettier.check(jsSource, options);
    
    if (!isFormatted) {
      console.log(`${file} 文件还没有格式化`);
      isAllFormatted = false;
    }
  }
  
  if (isAllFormatted) {
    console.log('所有文件都已经格式化...');
  }
});
```

---

## 九、实践：实现简易 CLI 工具

### 创建项目

```bash
# 初始化项目
pnpm init formattool

# 创建 index.js
```

### CLI 实现

```javascript
#!/usr/bin/env node

const prettier = require('prettier');
const fs = require('fs');
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('请提供一个参数！');
  process.exit(1);
}

const input = args[0];

// 读取源码
const sourcePath = path.resolve('src', 'index.js');
const jsSource = fs.readFileSync(sourcePath, 'utf8');

// 读取配置文件
const options = JSON.parse(
  fs.readFileSync(path.resolve('.prettierrc'))
);

if (input === '--write' || input === '-w') {
  prettier.format(jsSource, options).then(formatted => {
    fs.writeFileSync(sourcePath, formatted, 'utf-8');
  });
  
  console.log('格式化操作已经完成...');
}
```

### 全局链接

```bash
# 在 formattool 目录下
npm link

# 在目标项目目录下
npm link formattool

# 在 package.json 中添加脚本
{
  "scripts": {
    "formattool": "formattool"
  }
}

# 使用
pnpm formattool --write
```

> **注意**：这是 CLI 的简化演示，实际生产环境需要更完善的错误处理和参数解析。

---

## 十、最佳实践建议

1. **团队统一**：在项目根目录配置 `.prettierrc` 并提交到版本控制
2. **自动化集成**：配合 husky 在 git commit 前自动检查格式
3. **CI/CD 集成**：在 CI 流水线中添加格式检查，确保代码质量
4. **VS Code 配置**：设置保存时自动格式化，提升开发体验
5. **谨慎自定义**：默认配置已是最佳实践，除非必要，不建议过度修改
