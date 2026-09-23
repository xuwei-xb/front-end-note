> 类型: 章节 · 来源: [[engineering/GitHub_Actions与GitLab_CI详解]] · 更新: 2026-09-23
>
> ---

## 二、GitHub Actions 深度解析

### 2.1 核心架构

```
工作流 (Workflow)
  ├─ 任务 (Job)
  │   ├─ 步骤 (Step)
  │   │   ├─ 动作 (Action) - 可复用的最小单元
  │   │   └─ Shell 命令
  │   └─ 运行器 (Runner) - 执行环境
  └─ 触发条件 (Trigger) - push / PR / schedule / manual
```

### 2.2 关键概念详解

#### Workflow（工作流）

完整的自动化流程定义文件，一个仓库可以有多个工作流文件。

#### Job（任务）

工作流中的并行或串行执行单元，可以设置依赖关系。

#### Step（步骤）

任务中的原子操作，可以运行命令或调用 Action。

#### Action（动作）

预封装的可复用脚本，可从 GitHub Marketplace 获取或自定义。

#### Runner（运行器）

执行 Job 的服务器，分为：
- **GitHub 托管 Runner**：官方提供，按分钟计费
- **自托管 Runner**：自己部署，资源可控

#### Event（触发事件）

启动工作流的触发条件：
- `push`：代码推送
- `pull_request`：PR 创建或更新
- `release`：发布 Release
- `schedule`：定时触发（Cron 表达式）
- `workflow_dispatch`：手动触发
- `repository_dispatch`：外部 API 触发

### 2.3 完整配置示例

```yaml
name: CI/CD Pipeline

# 触发条件
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  release:
    types: [ published ]
  schedule:
    - cron: '0 0 * * *'  # 每天凌晨执行
  workflow_dispatch:  # 支持手动触发

# 环境变量
env:
  NODE_ENV: production
  DEPLOY_URL: https://example.com

jobs:
  # Job 1: 代码质量检查
  lint:
    name: Lint & Format Check
    runs-on: ubuntu-latest
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
      
      - name: 安装 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 运行 ESLint
        run: npm run lint
      
      - name: 运行 Prettier 检查
        run: npm run format:check

  # Job 2: 单元测试（矩阵构建）
  test:
    name: Test (Node ${{ matrix.node-version }})
    runs-on: ubuntu-latest
    
    strategy:
      fail-fast: false  # 不因某个失败就停止全部
      matrix:
        node-version: [16.x, 18.x, 20.x]
        os: [ubuntu-latest, windows-latest]
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
      
      - name: 安装 Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 运行测试
        run: npm test
      
      - name: 生成覆盖率报告
        run: npm run test:coverage
      
      - name: 上传覆盖率到 Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info

  # Job 3: 构建
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint, test]
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
      
      - name: 安装 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 构建项目
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: 上传构建产物
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: dist/
          retention-days: 7
      
      - name: 生成构建摘要
        run: |
          echo "## 构建信息" >> $GITHUB_STEP_SUMMARY
          echo "- 分支: ${{ github.ref_name }}" >> $GITHUB_STEP_SUMMARY
          echo "- 提交: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          echo "- 构建时间: $(date)" >> $GITHUB_STEP_SUMMARY

  # Job 4: Docker 镜像构建
  docker:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
      
      - name: 设置 Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: 登录 Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: 提取元数据
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: myorg/myapp
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha,prefix={{branch}}-
      
      - name: 构建并推送镜像
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Job 5: 部署到测试环境
  deploy_staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: docker
    environment:
      name: staging
      url: https://staging.example.com
    
    steps:
      - name: 下载构建产物
        uses: actions/download-artifact@v4
        with:
          name: build-artifacts
      
      - name: 部署到服务器
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /var/www/staging
            docker-compose pull
            docker-compose up -d
            docker image prune -f

  # Job 6: 部署到生产环境（手动触发）
  deploy_production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: docker
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    
    steps:
      - name: 创建 GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false
      
      - name: 部署到生产服务器
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_KEY }}
          script: |
            cd /var/www/production
            ./deploy.sh ${{ needs.docker.outputs.image-tag }}
```

### 2.4 高级特性

#### 复合 Actions（Composite Actions）

创建可复用的 Action 组合：

```yaml
# .github/actions/build-node/action.yml
name: 'Build Node.js Application'
description: 'Install dependencies and build Node.js project'
inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'
  build-command:
    description: 'Build command'
    required: false
    default: 'npm run build'

runs:
  using: 'composite'
  steps:
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      shell: bash
      run: npm ci
    
    - name: Build
      shell: bash
      run: ${{ inputs.build-command }}
```

使用复合 Action：

```yaml
steps:
  - uses: ./.github/actions/build-node
    with:
      node-version: '18'
      build-command: 'npm run build:prod'
```

#### 环境变量管理

```yaml
env:
  # 全局环境变量
  NODE_ENV: production
  APP_NAME: myapp

jobs:
  build:
    # Job 级别环境变量
    env:
      BUILD_DIR: /tmp/build
    steps:
      - name: 使用环境变量
        run: |
          echo "Node Env: $NODE_ENV"
          echo "Build Dir: $BUILD_DIR"
        env:
          # Step 级别环境变量
          LOCAL_VAR: local_value
```

#### 条件执行

```yaml
steps:
  - name: 仅在主分支执行
    if: github.ref == 'refs/heads/main'
    run: echo 'Deploying to production'
  
  - name: 仅在 PR 中执行
    if: github.event_name == 'pull_request'
    run: echo 'Running PR checks'
  
  - name: 基于 previous job 结果
    if: needs.build.result == 'success'
    run: echo 'Build succeeded'
  
  - name: 基于文件变更
    if: contains(github.event.head_commit.modified, 'package.json')
    run: echo 'package.json changed'
```

#### 矩阵策略

```yaml
strategy:
  matrix:
    # 多版本并行
    node-version: [16.x, 18.x, 20.x]
    # 多操作系统并行
    os: [ubuntu-latest, windows-latest, macos-latest]
    # 自定义变量
    include:
      - os: ubuntu-latest
        target: linux
      - os: windows-latest
        target: windows
      - os: macos-latest
        target: macos
    # 排除某些组合
    exclude:
      - os: windows-latest
        node-version: 16.x
```

### 2.5 核心优势

1. **生态极其丰富**
   - GitHub Marketplace 有 10,000+ 现成 Action
   - 覆盖所有主流技术和云平台
   - 社区活跃，更新频繁

2. **配置简单直观**
   - YAML 语法清晰易懂
   - 大量模板和示例
   - Visual Editor 可视化编辑

3. **深度 GitHub 集成**
   - PR 状态检查自动关联
   - 自动创建 Release 和 Tag
   - Issues/Comment 触发工作流
   - 内置 Package Registry

4. **免费额度慷慨**
   - 公共仓库：无限制
   - 私有仓库：每月 2000 分钟免费（Linux）

5. **强大的缓存机制**
   - 依赖缓存（npm、pip、maven）
   - 构建缓存
   - 支持 Actions Cache API

6. **灵活的自托管**
   - 支持自托管 Runner
   - 可部署在任何环境（云、私有云、本地）
   - 支持 Docker 容器运行

### 2.6 局限性

1. **托管 Runner 资源限制**
   - 2-core CPU，7GB RAM
   - 14GB 磁盘空间
   - 6 小时执行时间限制

2. **私有仓库按分钟计费**
   - 超出免费额度后：$0.008/分钟（Linux）
   - 大型企业成本可能较高

3. **自托管维护成本**
   - 需要维护服务器
   - 需要升级 Runner 版本
   - 需要处理安全更新

4. **网络访问限制**
   - 国内访问 GitHub 不稳定
   - 某些地区可能无法访问

---
