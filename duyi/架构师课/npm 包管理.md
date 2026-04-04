# npm 包管理笔记：查漏补缺整理完善

## npm 回顾 - 回顾 npm 基本概念
### 为什么现代前端开发中需要包管理器？
在项目开发过程中，常常需要使用他人已有的代码。若采用传统方式，每次引入一个包都要从官网下载代码、解压，再放入自己的项目，这种做法过于原始且繁琐。此外，现代开发中引用的包往往存在复杂的依赖关系，例如模块A依赖模块B，模块B又依赖模块C，让开发者手动管理这种依赖关系，容易出错且十分麻烦。因此，包管理器应运而生，它专门用于管理软件包、库以及相互之间的依赖关系。一般来说，一门成熟的编程语言都会有配套的包管理器，如：
- Node.js: npm (Node Package Manager)
- Python: pip (Pip Installs Packages)
- Ruby: rubygems (Ruby Gems)
- Java: Maven (Maven Repository)
- PHP: Composer (Dependency Manager for PHP)
- Rust: Cargo (Rust's Package Manager)
- Go: Go mod (Go's Package Manager)

### npm 的组成部分
npm 实际上由三个部分组成：
1. **网站**：即 npm 的官网（https://www.npmjs.com/），用户可以在该网站注册账号、搜索特定包并查看包的说明文档（对于一些没有官网的插件来说尤为重要）。
2. **CLI（command line interface）**：也就是命令行接口，用户可以在控制台输入命令与 npm 进行交互。这是我们日常使用 npm 最常用的方式，例如在控制台输入 `npm i`、`npm init` 等命令进行操作。
3. **registry**：这是 npm 对应的大型仓库，所有上传的包都会存储在这个仓库中。

## 关于包的概念
### 什么是包（package）？
从软件工程的角度来看，包是一种组织代码结构的方式。通常情况下，一个包提供一个特定的功能来解决某一个问题，它会将相关的所有目录和文件放置在一个独立的文件夹中，并通过一个特殊的文件（`package.json`）来描述这个包。此外，若要向 npm 发布包，npm 要求必须要有 `package.json` 文件。

### 包和 module 的区别
- **包（package）**：是一个包含多个相关文件和目录的集合，通常提供一个完整的功能，并且有 `package.json` 文件来描述其基本信息和依赖关系。例如，一个名为 `my-package` 的包可能包含多个模块和资源文件。
- **模块（module）**：一般指一个单独的 JS 文件，该文件包含一个或多个变量、函数、类、对象的导出，是一个独立的单元，可以被其他模块导入并使用。例如，在 `my-package` 包中的 `string-utils.js` 就是一个模块。

### public package、private package、scope package
- **public package（公共包）**：是在 npm 注册表中公开发布的包，任何人都可以搜索、查看和安装这些包。公共包在发布时默认为开源许可证（如 MIT、BSD、Apache 等），其他人可以自由地查看源代码、修改代码并在自己的项目中使用。当希望与广泛的开发者社区共享代码并允许他们参与到项目中时，可以选择发布为公共包。
- **private package（私有包）**：是在 npm 注册表中非公开发布的包，它们只能被特定的用户或团队成员搜索、查看和安装。私有包通常用于存储企业内部的代码和资源，或者在开发过程中尚未准备好向公众发布的项目。要发布和使用私有包，需要拥有一个 npm 付费账户，并将包的 `private` 属性设置为 `true`。私有包通常都是作用域包。
- **scope package（作用域包）**：必须以 `@` 符号开头，后面跟上作用域名称，接着是一个斜杠，最后是包名，格式为 `@scope-name/package-name`。例如 `@vue/cli`、`@vue/runtime-core`、`@vue/shared` 等。在安装作用域包时，需要将作用域名写全，如 `npm i @vue/cli -g`；在引入时，也需要将作用域名写全，如 `const mypackage = require("@myorg/mypackage")`。作用域包可以避免重名的情况，作用域名可以充当一个命名空间，同时也能表达某一系列包属于某一个组织。

## npm 进阶指令
### 查看相关信息的指令
- **`npm version`**：查看当前 npm cli 的详细信息，相比 `npm -v` 显示的信息更为丰富。
- **`npm root`**：查找本地或者全局安装的包的根目录。若要查看全局的包目录，需要添加 `-g` 参数。
- **`npm info`**：查看某一个包的详细信息，包括包的版本、依赖项、作者、描述等，便于开发者选择合适的包。
- **`npm search`**：对包进行搜索，提供一个关键字，会搜索出所有和关键字相关的包。
- **`npm outdated`**：用于检查当前项目中的依赖包是否过时，以及当前可用的最新版本。
- **`npm ls`**：罗列出当前项目安装的依赖包以及依赖包下层的依赖。可以通过 `--depth 0/1/2` 来进行层级的调整，例如 `npm ls --depth 1` 能够罗列出当前依赖以及当前依赖下一层所需的依赖。若使用 `npm ls -g`，则会罗列出全局的包。

### 配置相关指令
npm 支持配置，其配置可以来自三个地方：命令行、环境变量和 `.npmrc` 文件。其中，`.npmrc` 文件最常用于配置仓库镜像，也可以通过命令行指令进行修改，相关命令如下：
```bash
npm config get registry
npm config set registry=xxxxx
npm config list
```
此外，还可以通过 `npm config edit` 进入编辑模式，对各种配置项目进行编辑。

### 建立软链接
`npm link` 命令用于针对一个包（如包 a）创建一个快捷方式，其他项目（如项目 b）若要使用该包，可通过快捷方式快速链接到包 a，无需每次包 a 重新发布后，项目 b 都重新安装。具体操作步骤如下：
1. 针对包 a 做链接：
```bash
npm link
```
运行该命令后，会在全局的 `node_modules` 下面创建一个软链接，指向包 a。
2. 在项目 b 中链接到包 a：
```bash
npm link a
```
3. 当开发完成后，断开链接：
```bash
cd /path/to/b
npm unlink a
```
4. 若包 a 项目已没有被任何项目所链接，可将其从全局 `node_modules` 中删除：
```bash
cd /path/to/a
npm unlink -g a
```

### 缓存相关的指令
当安装、更新或者卸载包时，npm 会将这些包的 tarball 文件缓存到本地磁盘上，有助于加速将来的安装过程。相关指令如下：
- **`npm cache clean`**：清理缓存，但在较新的版本中，推荐使用 `npm cache verify` 来验证缓存。
- **`npm cache verify`**：验证缓存的完整性，检查缓存是否过期、无效、损坏，若缓存无用则进行删除。
- **`npm cache add <package-name>`**：一般不需要手动添加缓存，因为在安装包时会自动添加缓存。
- **`npm cache ls`**：查看 npm 缓存的所有包。
- **`npm config get cache`**：查看缓存目录。

### 包的更新相关的指令
- **`npm update`**：用于更新当前项目中的依赖包，npm 会检查是否有新的版本，若有则进行更新，但更新时会满足 `package.json` 里面的版本范围规定（`^`、`~`）。也可以指定要更新某一个包，如 `npm update package_name`。
- **`npm audit`**：用于检查当前项目中的依赖，找出存在漏洞的依赖。在审计的同时，可以直接进行修复，通过命令 `npm audit fix`。
- **`npm dedupe`**：优化项目里面的依赖树的结构，尽量消除重复的包。但无法将所有重复的包进行消除，因为有些时候不同的依赖项需要不同版本的相同依赖。
- **`npm prune`**：用于删除没有在 `package.json` 文件中列出的依赖包，帮助清理 `node_modules`，删除不再需要的依赖。

### 提供帮助
- **`npm help`**：查看 npm 中提供的所有指令。
- **`npm help <command>`**：查看某个指令的具体信息。

## 包的说明文件
### 包的说明信息相关的配置
- **`name`**：包的名字，必须是唯一的。
- **`version`**：包的版本号，一般由三个数字组成，格式为 `x.y.z`。其中，`x` 代表主版本号，当软件包发生重大变化或者不兼容的升级时，需要增加主版本号；`y` 代表次版本号，当软件包增加新的功能或者新的特性时，需要增加次版本号；`z` 代表修订号，当软件包进行 bug 修复、性能优化或较小改动时，需要增加修订号。
- **`description`**：包的描述信息。
- **`keyword`**：包的关键词，用于搜索和分类。例如：
```json
{
  "keyword": ["good", "tools"]
}
```
- **`author`**：作者信息。例如：
```json
"author": {
  "name": "John Doe",
  "email": "john.doe@example.com",
  "url": "https://example.com/johndoe"
}
```
- **`contributors`**：包的贡献者名单。
- **`license`**：包的许可证信息，指定包的开源类型。
- **`repository`**：包的源代码仓库信息，可以提供一个 git 地址。例如：
```json
"repository": {
  "type": "git",
  "url": "https://github.com/username/my-awesome-package.git"
}
```
- **`engines`**：指定项目需要的 node 版本以及 npm 版本，避免用户在使用包时出现因版本不支持而产生的问题。例如：
```json
"engines": {
  "node": ">=12.0.0",
  "npm": ">=6.0.0"
}
```

### 包执行相关配置
- **`main`**：代表包的入口文件。
- **`browser`**：该选项表示在浏览器环境下，可以替换一些特定模块或者文件。例如：
```json
{
  "main": "index.js",
  "browser": "browser.js"
}
```
上述配置表示在 node 环境下，`index.js` 为入口文件；在浏览器环境下，使用 `browser.js` 作为入口文件。也可以替换特定的模块，如：
```json
{
  "browser": {
    "./node-version.js": "./browser-version.js"
  }
}
```
还可以排除某些模块，如：
```json
{
  "browser": {
    "fs": false
  }
}
```
- **`scripts`**：配置可执行命令。例如：
```json
"scripts": {
  "start": "node index.js",
  "test": "jest",
  "build": "webpack",
  "lint": "eslint src",
  "format": "prettier --write src"
}
```
脚本还可以配置生命周期钩子方法，使用关键词 `pre` 和 `post`，`pre` 代表在执行某个脚本之前，`post` 代表在执行某个脚本之后。例如：
```json
"scripts": {
  "prestart": "npm run build",
  "start": "node index.js",
  "test": "mocha",
  "build": "webpack",
  "lint": "eslint src",
  "format": "prettier --write src",
  "posttest": "npm run lint && npm run format"
}
```

### 包的依赖信息相关配置
- **`dependencies`**：包的依赖列表，最终打包时会将这一部分依赖打包进去。例如，项目中用到了 `lodash`，最终打包时应该将 `lodash` 打包进去，所以 `lodash` 应记入到 `dependencies`。
- **`devDependencies`**：代表开发依赖，开发时会用到，但最终打包时不需要打包进去，如 `webpack`、`eslint`、`typescript`、`sass` 等，应记入到 `devDependencies`。
- **版本范围控制符号**：
    - **`^`（脱字符）**：表示允许更新到相同主版本号的最新版本，即次版本和补丁版本可以变，但主版本不能变。例如，`^1.2.3` 更新时允许的范围是 `>= 1.2.3` 且 `< 2.0.0`。
    - **`~`（波浪字符）**：表示主版本号和次版本号都必须相同，只能更新补丁号。例如，`~1.2.3` 更新时允许的范围是 `>= 1.2.3` 且 `< 1.3.0`。
- **`peerDependencies`**：通常用于开发插件或者库的时候，表示需要与项目（使用插件或库的项目）一起使用的依赖，确保这些依赖有一个合适的版本。例如，开发一个 react 插件时，可将 react 和 react-dom 声明为 `peerDependencies`：
```json
{
  "name": "my-react-plugin",
  "version": "1.0.0",
  "peerDependencies": {
    "react": "^17.0.0",
    "react-dom": "^17.0.0"
  }
}
```

## 发布 npm 包
### 准备账号
首先到 npm 官网（https://www.npmjs.com/）注册一个账号，并设置好邮箱，方便接收验证码。账号注册完毕后，在控制台通过 `npm login` 进行登录，还可以通过 `npm profile` 相关指令获取个人账号相关信息。若要退出登录，可使用 `npm logout` 指令。注意，向 npm 官方推送包时，需要将镜像修改为 npm 的镜像源：
```bash
npm config set registry=https://registry.npmjs.org/
```

### 配置 package.json
#### 设置忽略文件
当将包发布到 npm 上时，应避免上传无意义的文件。设置忽略文件的方式有两种：
- **黑名单**：在项目根目录下创建一个 `.npmignore` 文件，设置哪些文件或者目录不需要上传到 npm。例如：
```
# .npmignore
src
tests
```
但这种方式在新增不需要发布的文件后，容易忘记修改 `.npmignore` 文件，因此更推荐使用白名单的方式。
- **白名单**：在 `package.json` 文件中设置 `files` 字段，只有出现在该字段中的文件或目录才会被上传。例如：
```json
{
  "name": "toolset2",
  "version": "1.0.7",
  "private": false,
  "description": "This is a JavaScript function library, primarily aimed at learning and communication.",
  "files": [
    "/dist",
    "LICENSE"
  ]
}
```

#### 设置模块类型
通过 `type` 值来设置模块类型，`type` 有两个可选值：
- **`commonjs`**：当 `type` 的值设置为 `commonjs` 时，node.js 将默认使用 CommonJS 模块系统，可直接使用 `require` 函数来导入模块。若要使用 ECMAScript 模块（即使用 `import` 和 `export` 语法），则需要将文件扩展名设置为 `.mjs`。
- **`module`**：当 `type` 的值设置为 `module` 时，node.js 将默认使用 ECMAScript 模块系统，可直接使用 `import` 和 `export` 语法来导入和导出模块。若要使用 CommonJS 模块（即使用 `require` 导入模块），则需要将文件扩展名设置为 `.cjs`。
此外，node.js 还支持 `exports` 配置项，用于定义一个模块的导出映射，可对模块的导入环境以及条件做更精细的控制，指定不同的模块的入口文件。例如：
```json
{
  "exports": {
    "import": "./dist/index.esm.js",
    "require": "./dist/index.cjs"
  }
}
```

### 打包发布
在配置好 `package.json` 后，可使用以下命令进行发布：
- **`npm whoami`**：查看当前登录的用户。
- **`npm publish`**：发布包（确保镜像已切换为 npm 镜像）。

## 搭建 npm 私有服务器
在企业应用开发中，很多时候需要发布私有包，而 npm 支持发布私有包但需要付费账号，因此搭建私有服务器是更好的选择。搭建 npm 私有服务器具有以下优势：保证代码的私密性、下载速度更快、可对发布的包进行权限设置。

### Verdaccio
Verdaccio 是企业开发中常用的搭建 npm 私有仓库的工具，具有以下特点：
- **轻量级**：采用 Node.js 编写，安装和运行快速，不依赖外部数据库，将数据存储在本地文件系统中。
- **简单的配置**：只需一个 YAML 文件即可进行配置，可轻松指定用户权限、上游代理、缓存设置等。
- **缓存和代理**：可作为上游 npm 注册表的代理，减轻网络延迟并提高包的安装速度，同时缓存已下载的包，以便在无互联网连接的情况下正常工作。
- **访问控制**：支持基于用户和包的访问控制，可轻松管理谁可以访问、发布和安装私有 npm 包。
- **插件支持**：支持插件，可扩展其功能，如添加身份验证提供程序、审计日志等。

#### 安装和启动
1. 安装 Verdaccio：
```bash
npm i -g verdaccio
```
2. 查看 Verdaccio 的基本信息：
```bash
verdaccio -h
```
3. 启动服务器：
```bash
verdaccio
```

#### 相关配置
Verdaccio 配置文件采用 YAML 格式，常见配置项如下：
- **`storage`**：存储包的路径。
- **`web`**：网站相关的配置，如标题等。
- **`uplinks`**：上游代理，当通过私服下载某些包而私服没有时，会从上游代理中下载并缓存到私服中。例如：
```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```
- **`packages`**：对权限进行控制。例如：
```yaml
packages:
  '@your-scope/*':
    access: $authenticated
    publish: $authenticated
    proxy: npmjs
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```
- **`auth`**：设置用户身份的验证方法，默认采用 htpasswd 的方式。

## 镜像管理工具 nrm
nrm 是一个专门用于管理 npm 镜像的工具，全称是 npm registry manager。安装 nrm 时可能会遇到一些问题，若出现如下错误：
```js
const open = require('open');
^
Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/jie/.nvm/versions/node/v16.17.1/lib/node_modules/nrm/node_modules/open/index.js from /Users/jie/.nvm/versions/node/v16.17.1/lib/node_modules/nrm/cli.js not supported.
```
可使用以下命令进行安装：
```bash
npm install -g nrm open@8.4.2
```
nrm 常见的指令如下：
- **`nrm ls`**：列出所有可用的镜像列表。
- **`nrm use <registry-name>`**：切换镜像。
- **`nrm add <registry-name> <registry-url>`**：添加镜像。
- **`nrm del <registry-name>`**：删除镜像。

## 其他包管理器
### Yarn
Yarn 是在 2016 年由 Facebook、Google、Exponent 以及 Tilde 团队共同开发推出的包管理器，主要用于解决 npm 在速度、安全性以及一致性方面的问题。其引入了 `yarn.lock` 锁文件，确保了在不同环境中的依赖结构一致性。Yarn 与 npm 的指令对比情况如下：
| npm | Yarn | 说明 |
| --- | --- | --- |
| `npm init` | `yarn init` | 初始化项目 |
| `npm install/link` | `yarn install/link` | 默认的安装依赖操作 |
| `npm install <package>` | `yarn add <package>` | 安装某个依赖 |
| `npm uninstall <package>` | `yarn remove <package>` | 移除某个依赖 |
| `npm install <package> --save-dev` | `yarn add <package> --dev` | 安装开发依赖 |
| `npm update <package> --save` | `yarn upgrade <package>` | 更新某个依赖 |
| `npm install <package> --global` | `yarn global add <package>` | 全局安装 |
| `npm publish/login/logout` | `yarn publish/login/logout` | 发布/登录/登出 |
| `npm run <script>` | `yarn run <script>` | 执行 script 命令 |

从 npm v5 开始，也引入了名为 `package-lock.json` 的锁文件，类似于 Yarn 的 `yarn.lock` 文件。

### pnpm
pnpm 是继 Yarn 之后出现的包管理器，具有以下优势：
1. **节省磁盘空间**：使用 npm 时，若有 100 个项目使用同一个依赖项，会在磁盘上保存该依赖项的 100 份副本。而 pnpm 采用内容可寻址的存储方式，依赖项会存储在一个全局的内容地址存储中，通过硬链接和符号链接的方式在项目中引用。直接依赖使用硬链接，间接依赖使用符号链接，避免了文件的重复存储。例如，若不同项目依赖同一个包的不同版本，会在全局仓库下分别存储每个版本，但仅存储不同版本之间不同的文件。
2. **解决幽灵依赖**：幽灵依赖是指一个包可能会意外地访问并使用另一个包的依赖，即使它没有在自己的 `package.json` 文件中声明这些依赖。pnpm 采用包隔离策略，每个依赖包都有自己独立的安装环境，避免了不同依赖之间的冲突，从而解决了幽灵依赖问题。
3. **原生支持 Monorepo**：在企业开发中，使用 Monorepo 架构可以统一多个包的依赖，简化代码共享，更容易进行跨项目更改和跨团队协作。pnpm 原生支持 Monorepo，可更好地管理多个包。

pnpm 相关指令如下：
- 安装 pnpm：`npm install -g pnpm`
- 创建新项目：`pnpm init`
- 添加依赖：`pnpm add <package>`
- 添加所有依赖：`pnpm install`
- 升级依赖：`pnpm update <package>`
- 删除依赖：`pnpm remove <package>`

## 包的隔离和提升
- **包隔离**：指在项目中，每个依赖包都有自己独立的安装环境，避免不同依赖之间的冲突。当不同的依赖包需要相同的子依赖但不同版本时，包隔离机制可以确保每个依赖包都能使用其所需的版本，避免项目运行错误或行为异常。pnpm 默认采用包隔离策略。
- **包提升**：指将依赖关系中某些包提升到更高的目录层次，以减少冗余，节省磁盘空间。但这种方式可能会导致依赖版本冲突，例如，项目依赖两个包 PackageA 和 PackageB，PackageA 依赖 `lodash@4.17.21`，PackageB 依赖 `lodash@3.10.1`，在传统包管理工具中，若将 `lodash@4.17.21` 提升到根目录，PackageB 依赖的 `lodash@3.10.1` 会被忽略，导致 PackageB 无法正常运行。

## 多包管理方案
### 什么是包和仓库？
- **包**：被包管理器（如 npm、yarn、pnpm）初始化之后的目录，会存在一个包描述文件 `package.json`，这样的目录被称之为包。
- **仓库**：被版本控制系统（如 svn、git）初始化之后的目录，例如使用 git 进行初始化之后，会存在一个 `.git` 的目录。

### Monorepo
Monorepo 是将多个模块共享同一个仓库的管理方式，具有以下优势：
1. **统一的依赖管理**：多个项目可以共享同一套构建流程和代码规范，统一管理依赖版本，避免不同项目中相同依赖存在版本不同的情况。
2. **简化代码共享**：方便共享公共组件、工具库、api 等，查看代码、修改 bug、调试等更加便捷。
3. **更容易进行跨项目更改**：当组件改动涉及到多个项目时，无需手动在多个项目中进行更改。
4. **更好的跨团队协作**：团队成员可以在一个仓库中进行协作，提高工作效率。

知名公司和前端项目使用 Monorepo 的案例有很多，如谷歌、Meta、微软、Twitter、Uber 等公司，以及 React、React Native、Jest 等前端项目。然而，Monorepo 也存在一些缺点，如代码库规模较大、缺乏独立版本控制、权限和安全性问题以及对工具和基础设施要求较高等。

### Multirepo
Multirepo 是将不同项目和库存储在各自独立的代码库中的策略，具有以下优点：
- **独立版本控制**：每个项目都有独立的版本控制，便于单独管理和发布。
- **更小的代码库规模**：每个仓库体积相对较小，模块划分清晰，便于维护和管理。
- **更高的项目自治**：各个团队可以控制代码权限，根据项目需求独立进行开发和决策。

两种代码管理策略的对比如下表所示：
| | Monorepo | Multirepo |
| --- | --- | --- |
| 开发 | 只需要在一个仓库中开发 | 仓库体积小，模块划分清晰 |
| 复用 | 代码复用高，方便进行代码重构 | 需要多个仓库来回切换，无法实现跨项目代码复用 |
| 工程配置 | 所有项目统一使用相同配置 | 各个项目可能有一套单独标准 |
| 依赖管理 | 共同依赖可提升至 root，版本控制更加容易，依赖管理更加方便 | 不同项目中会存在相同的依赖，并且依赖会存在版本不同的情况 |
| 代码管理 | 代码全在一个仓库，项目太大用 git 管理会存在问题，无法隔离项目代码权限 | 各个团队可以控制代码权限，也几乎不会有项目太大的问题 |

在选择使用哪种多包管理方案时，需要根据项目的具体情况进行综合考虑。若项目之间有很多共享代码和资源，团队需要进行跨项目协作，或者统一多个包的依赖非常重要，那么 Monorepo 可能是更合适的选择；若项目相对独立，需要独立的版本控制和较高的项目自治，那么 Multirepo 可能更适合。