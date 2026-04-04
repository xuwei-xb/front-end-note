# GitHub Actions 与 GitLab CI 详解

> 更新时间：2026年01月14日
> 适用场景：CI/CD 自动化、持续集成、持续部署

---

## 目录

- [一、核心概念对比](#一核心概念对比)
- [二、GitHub Actions 深度解析](#二github-actions-深度解析)
- [三、GitLab CI 深度解析](#三gitlab-ci-深度解析)
- [四、深度对比](#四深度对比)
- [五、选型决策框架](#五选型决策框架)
- [六、最佳实践](#六最佳实践)
- [七、常见组合方案](#七常见组合方案)
- [八、总结建议](#八总结建议)

---

## 一、核心概念对比

| 维度 | GitHub Actions | GitLab CI |
|------|---------------|-----------|
| **定位** | GitHub 原生 CI/CD 平台 | GitLab 内置 DevOps 平台 |
| **配置文件** | `.github/workflows/*.yml` | `.gitlab-ci.yml` |
| **执行器** | GitHub 托管 runner / 自托管 runner | GitLab Runner（通常自托管） |
| **计费模式** | 公共仓库免费，私有仓库按分钟计费 | 自建服务器成本可控，无按分钟计费 |
| **生态集成** | 与 GitHub 深度集成（PR、Issues、Release） | 与 GitLab 深度集成（MR、Registry、K8s） |
| **学习曲线** | YAML 配置，社区模板丰富 | YAML 配置，概念稍复杂 |
| **适用场景** | 开源项目、GitHub 托管的私有项目 | 企业内部、自建 GitLab、复杂 DevOps 链路 |

### 核心判断

- **开源项目 / GitHub 生态 / 开发者友好**：优先 GitHub Actions
- **企业内部 / 自建 GitLab / DevOps 深度集成**：优先 GitLab CI
- **多平台混合（GitHub + GitLab + Bitbucket 等）**：考虑 Jenkins 或 GitLab CI 的多 repo 能力

---

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

## 三、GitLab CI 深度解析

### 3.1 核心架构

```
Pipeline（流水线）
  ├─ Stage（阶段）
  │   └─ Job（任务）
  │       ├─ Script（脚本）
  │       ├─ Artifacts（产物）
  │       ├─ Cache（缓存）
  │       └─ Variables（变量）
  └─ Trigger（触发）- push / MR / schedule / manual
```

### 3.2 关键概念详解

#### Pipeline（流水线）

完整的 CI/CD 流程，由多个 Stage 组成。

#### Stage（阶段）

流水线的逻辑划分，常见的 Stage：
- `build`：构建
- `test`：测试
- `deploy`：部署
- `review`：代码评审

同一 Stage 的 Job 并行执行，不同 Stage 顺序执行。

#### Job（任务）

实际执行的工作单元，包含：
- `script`：要执行的命令
- `image`：使用的 Docker 镜像
- `services`：需要的服务（如数据库）
- `artifacts`：产物传递
- `dependencies`：依赖关系

#### Runner（运行器）

执行 Job 的代理，分为：
- **Shared Runner**：共享运行器
- **Group Runner**：组级运行器
- **Project Runner**：项目级运行器
- **Specific Runner**：特定标签的运行器

#### Artifacts（产物）

Job 之间传递的文件，支持：
- 文件/目录传递
- 过期时间设置
- 产物报告（JUnit、Cobertura 等）

#### Cache（缓存）

加速构建的依赖缓存：
- 全局缓存
- Job 级别缓存
- 分布式缓存（S3、GCS）

#### Environment（环境）

部署目标环境：
- `development`：开发环境
- `staging`：测试环境
- `production`：生产环境

支持环境变量、URL、部署板等。

### 3.3 完整配置示例

```yaml
# 全局变量
variables:
  NODE_ENV: production
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  DOCKER_HOST: tcp://docker:2376
  DOCKER_TLS_VERIFY: 1
  DOCKER_CERT_PATH: /certs/client
  CACHE_KEY: "$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA"

# 默认配置
default:
  # 默认使用的镜像
  image: node:20-alpine
  
  # 所有 Job 执行前的脚本
  before_script:
    - npm config set registry https://registry.npmmirror.com
    - echo "Starting job: $CI_JOB_NAME"
  
  # 所有 Job 执行后的脚本
  after_script:
    - echo "Job $CI_JOB_NAME completed with status: $CI_JOB_STATUS"
  
  # 重试策略
  retry:
    max: 2
    when:
      - script_failure
      - runner_system_failure
  
  # 超时设置
  timeout: 10m

# 缓存配置
cache:
  key: ${CACHE_KEY}
  paths:
    - node_modules/
    - .npm/
  policy: pull-push

# 定义 stages
stages:
  - lint
  - test
  - build
  - security
  - deploy_staging
  - deploy_production

# ============================================
# Stage 1: 代码质量检查
# ============================================

lint:
  stage: lint
  image: node:20-alpine
  script:
    - npm ci
    - npm run lint
    - npm run format:check
  allow_failure: false
  tags:
    - docker
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# ============================================
# Stage 2: 测试
# ============================================

# 单元测试（并行）
unit_test:
  stage: test
  image: node:20-alpine
  parallel: 4
  script:
    - npm ci
    - npm run test:unit -- --shard $CI_NODE_INDEX/$CI_NODE_TOTAL
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/
    expire_in: 1 week
    when: always
  tags:
    - docker

# E2E 测试
e2e_test:
  stage: test
  image: node:20-alpine
  services:
    - name: postgres:15-alpine
      alias: postgres
      variables:
        POSTGRES_DB: test_db
        POSTGRES_USER: test_user
        POSTGRES_PASSWORD: test_pass
    - name: redis:7-alpine
      alias: redis
  variables:
    DATABASE_URL: postgresql://test_user:test_pass@postgres:5432/test_db
    REDIS_URL: redis://redis:6379
  script:
    - npm ci
    - npm run test:e2e
  artifacts:
    when: on_failure
    paths:
      - tests/e2e/screenshots/
    expire_in: 3 days
  tags:
    - docker

# ============================================
# Stage 3: 构建
# ============================================

build:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
      - .next/  # 如果是 Next.js
    expire_in: 1 week
  cache:
    key: "$CI_COMMIT_REF_SLUG-build"
    paths:
      - .next/cache/
  rules:
    - if: $CI_COMMIT_BRANCH
  tags:
    - docker

# Docker 镜像构建
build_docker:
  stage: build
  image: docker:24-cli
  services:
    - docker:24-dind
  script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  tags:
    - docker

# ============================================
# Stage 4: 安全扫描
# ============================================

sast:
  stage: security
  include:
    - template: Security/SAST.gitlab-ci.yml
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

dependency_scanning:
  stage: security
  include:
    - template: Security/Dependency-Scanning.gitlab-ci.yml
  rules:
    - if: $CI_COMMIT_BRANCH

container_scanning:
  stage: security
  image: aquasec/trivy:latest
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  allow_failure: true
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# ============================================
# Stage 5: 部署到测试环境
# ============================================

.deploy_template: &deploy_template
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client curl
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $SSH_HOST >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts

deploy_staging:
  <<: *deploy_template
  stage: deploy_staging
  environment:
    name: staging
    url: https://staging.example.com
    on_stop: stop_staging
  script:
    - |
      ssh $SSH_USER@$SSH_HOST << 'ENDSSH'
        cd /var/www/staging
        docker-compose pull
        docker-compose up -d
        docker image prune -f
      ENDSSH
  needs:
    - build
    - unit_test
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  when: manual

stop_staging:
  <<: *deploy_template
  stage: deploy_staging
  environment:
    name: staging
    action: stop
  script:
    - |
      ssh $SSH_USER@$SSH_HOST << 'ENDSSH'
        cd /var/www/staging
        docker-compose down
      ENDSSH
  when: manual

# ============================================
# Stage 6: 部署到生产环境
# ============================================

deploy_production:
  <<: *deploy_template
  stage: deploy_production
  environment:
    name: production
    url: https://example.com
  script:
    - |
      ssh $SSH_USER@$SSH_HOST << 'ENDSSH'
        cd /var/www/production
        ./deploy.sh $CI_COMMIT_SHA
        ./health-check.sh
      ENDSSH
  needs:
    - build
    - unit_test
    - sast
    - dependency_scanning
  rules:
    - if: $CI_COMMIT_TAG
      when: manual
    - when: never
  tags:
    - production

# Blue-Green 部署
deploy_blue:
  <<: *deploy_template
  stage: deploy_production
  environment:
    name: production-blue
    url: https://blue.example.com
  script:
    - ./deploy-to-blue.sh
  rules:
    - if: $DEPLOY_STRATEGY == "blue-green"
      when: manual

switch_to_blue:
  stage: deploy_production
  image: alpine:latest
  script:
    - ./switch-traffic.sh blue
  needs:
    - deploy_blue
  rules:
    - if: $DEPLOY_STRATEGY == "blue-green"
      when: manual
  when: manual

# ============================================
# 定时任务
# ============================================

nightly_build:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
    - npm run test:full
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
  tags:
    - docker

# ============================================
# 清理任务
# ============================================

cleanup_old_artifacts:
  stage: .post
  image: alpine:latest
  script:
    - echo "Cleanup old artifacts"
  when: always
  allow_failure: true
```

### 3.4 高级特性

#### Pipeline 模板

创建可复用的 Pipeline 片段：

```yaml
# .gitlab/ci/templates/nodejs-build.yml
.nodejs_build:
  image: node:20-alpine
  before_script:
    - npm ci
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
```

引用模板：

```yaml
include:
  - local: '.gitlab/ci/templates/nodejs-build.yml'

build_app:
  extends: .nodejs_build
  stage: build
```

#### 多项目 Pipeline

```yaml
# 触发其他项目的 Pipeline
trigger_microservice:
  stage: deploy
  trigger:
    project: my-group/microservice
    branch: main
    strategy: depend

# 包含其他项目的 Pipeline
include:
  - project: 'my-group/ci-templates'
    file: '/templates/frontend.yml'
    ref: main
```

#### 动态 Pipeline

```yaml
# 基于变量动态生成 Pipeline
generate_config:
  stage: .pre
  image: alpine:latest
  script:
    - |
      cat > generated-config.yml << EOF
      stages:
        - test
      
      test_job:
        stage: test
        script:
          - echo "Dynamic job"
      EOF
  artifacts:
    paths:
      - generated-config.yml

dynamic_pipeline:
  stage: test
  trigger:
    include:
      - artifact: generated-config.yml
        job: generate_config
```

#### 规则引擎

```yaml
rules:
  # 条件 1: 主分支
  - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  
  # 条件 2: MR 事件
  - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    changes:
      - "src/**/*"
      - "package.json"
  
  # 条件 3: Tag 推送
  - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
  
  # 条件 4: 定时任务
  - if: $CI_PIPELINE_SOURCE == "schedule"
    variables:
      FULL_TEST: "true"
  
  # 默认: 不执行
  - when: never
```

#### 矩阵并行

```yaml
test_matrix:
  stage: test
  parallel:
    matrix:
      - NODE_VERSION: [16, 18, 20]
        TEST_SUITE: [unit, integration]
  script:
    - echo "Running $TEST_SUITE with Node $NODE_VERSION"
  before_script:
    - npm ci
    - nvm use $NODE_VERSION

# 更灵活的矩阵
test_advanced:
  stage: test
  parallel:
    matrix:
      - RUNNER_TAG: ["docker", "windows"]
        NODE_VERSION: [16, 18]
        exclude:
          - RUNNER_TAG: windows
            NODE_VERSION: 16
  script:
    - echo "Running on $RUNNER_TAG with Node $NODE_VERSION"
  tags:
    - $RUNNER_TAG
```

### 3.5 核心优势

1. **一体化 DevOps 平台**
   - 代码仓库 + CI/CD + Container Registry
   - K8s 集成（Auto DevOps）
   - Package Registry（Maven、npm、PyPI 等）
   - 监控和日志集成

2. **强大的可视化**
   - Pipeline 图形化展示
   - 实时日志查看
   - 环境部署板
   - 依赖关系可视化

3. **成本可控**
   - 自托管 Runner，无按分钟计费
   - 资源完全可控
   - 适合大规模企业

4. **环境管理**
   - 内置环境概念
   - 环境变量管理
   - 支持 Canary、蓝绿部署
   - 环境回滚

5. **高级功能**
   - Pipeline 模板
   - 多项目 Pipeline
   - 动态 Pipeline
   - Pipeline 谱系

6. **企业友好**
   - 完善的权限管理
   - 审计日志
   - SSO 集成（LDAP、SAML）
   - 合规性支持

### 3.6 局限性

1. **学习曲线**
   - 概念相对复杂
   - 需要理解 Pipeline、Stage、Job 层级
   - 配置选项繁多

2. **自建维护成本**
   - 需要维护 GitLab 服务器
   - 需要维护 Runner
   - 需要定期升级

3. **生态不如 GitHub**
   - Marketplace 相对较小
   - 社区资源较少

4. **配置灵活性**
   - 配置文件只能放在项目根目录
   - 不支持多 workflow 文件

---

## 四、深度对比

### 4.1 功能维度对比

| 功能 | GitHub Actions | GitLab CI | 说明 |
|------|---------------|-----------|------|
| **代码托管集成** | ★★★★★ | ★★★★★ | 都与各自平台深度集成 |
| **Pipeline 可视化** | ★★★★ | ★★★★★ | GitLab 的 Pipeline 图更直观 |
| **并行执行** | ★★★★★ | ★★★★★ | 都支持高度并行 |
| **缓存机制** | ★★★★ | ★★★★★ | GitLab 的分布式缓存更强大 |
| **Secret 管理** | ★★★★ | ★★★★★ | GitLab 的变量管理更完善 |
| **环境管理** | ★★★ | ★★★★★ | GitLab 有完整的环境概念 |
| **K8s 集成** | ★★★ | ★★★★★ | GitLab Auto DevOps 更完善 |
| **多项目 Pipeline** | ★★ | ★★★★★ | GitLab 支持跨项目编排 |
| **制品管理** | ★★★ | ★★★★★ | GitLab 内置 Registry |
| **Matrix 构建** | ★★★★★ | ★★★★ | GitHub 的矩阵语法更简洁 |
| **Reusability** | ★★★★★ | ★★★★ | GitHub Actions 复用性更强 |
| **可视化编辑** | ★★★★ | ★★★ | GitHub 有 Visual Editor |
| **调试体验** | ★★★★ | ★★★★ | 都支持实时日志 |
| **安全扫描** | ★★★★ | ★★★★★ | GitLab 内置 SAST、DAST 等 |

### 4.2 成本对比

#### GitHub Actions

**公共仓库**
- 完全免费，无限制

**私有仓库**
- **免费额度**：
  - Linux：2000 分钟/月
  - Windows：2000 分钟/月
  - macOS：1000 分钟/月
- **超出费用**：
  - Linux：$0.008/分钟
  - Windows：$0.016/分钟
  - macOS：$0.08/分钟
- **存储**：
  - 500 MB 免费
  - 超出：$0.25/GB/月

**自托管 Runner**
- 无按分钟计费
- 服务器成本自行承担

#### GitLab CI

**GitLab.com 托版**
- **免费版**：400 分钟/月
- **付费版**：按套餐提供更多分钟数

**自托管**
- 无按分钟计费
- 服务器成本自行承担
- 可无限使用自托管 Runner

**成本对比示例**

假设每月需要 10,000 分钟构建时间：

| 方案 | 月成本（估算） |
|------|--------------|
| GitHub Actions（托管） | $64（Linux） |
| GitLab CI（自建） | $20-50（服务器成本，取决于配置） |
| 自托管 GitHub Actions Runner | $20-50（服务器成本） |

### 4.3 性能对比

| 维度 | GitHub Actions | GitLab CI |
|------|---------------|-----------|
| **启动速度** | 快（预热池） | 取决于 Runner 配置 |
| **并发能力** | 托管版有限，自托管可控 | 完全可控 |
| **网络速度** | 国内访问不稳定 | 内网部署速度快 |
| **资源限制** | 2-core CPU, 7GB RAM | 完全自定义 |
| **执行时间限制** | 6 小时 | 无限制（自托管） |

### 4.4 生态对比

| 维度 | GitHub Actions | GitLab CI |
|------|---------------|-----------|
| **社区规模** | 极大 | 中等 |
| **可用 Actions/Templates** | 10,000+ | 2,000+ |
| **第三方集成** | 极丰富 | 丰富 |
| **文档质量** | 优秀 | 优秀 |
| **问题解决速度** | 快 | 中等 |

### 4.5 企业特性对比

| 特性 | GitHub Actions | GitLab CI |
|------|---------------|-----------|
| **权限管理** | ★★★★ | ★★★★★ |
| **审计日志** | ★★★ | ★★★★★ |
| **SSO 集成** | ★★★★ | ★★★★★ |
| **合规性** | ★★★ | ★★★★★ |
| **自托管部署** | ★★★ | ★★★★★ |
| **技术支持** | 付费版支持 | 付费版支持 |

---

## 五、选型决策框架

### 5.1 决策树

```
你的代码托管在哪里？
│
├─ GitHub
│  ├─ 公开源项目 → GitHub Actions（免费无限）
│  │
│  ├─ 私有项目
│  │  ├─ 构建量小（<2000分钟/月）→ GitHub Actions（免费）
│  │  │
│  │  └─ 构建量大
│  │     ├─ 预算充足 → GitHub Actions
│  │     ├─ 预算有限 → 自托管 GitHub Actions Runner
│  │     └─ 考虑迁移到 GitLab
│  │
│  ├─ 需要深度 GitHub 集成
│  │  ├─ PR 自动检查 → GitHub Actions
│  │  ├─ 自动 Release → GitHub Actions
│  │  └─ Issues 自动处理 → GitHub Actions
│  │
│  └─ 团队熟悉 GitHub → GitHub Actions
│
├─ GitLab（自建或托管）
│  ├─ 企业内部项目 → GitLab CI
│  ├─ 已有 GitLab 基础设施 → GitLab CI
│  │
│  ├─ 复杂 DevOps 链路
│  │  ├─ 需要 K8s 自动部署 → GitLab CI
│  │  ├─ 需要多环境管理 → GitLab CI
│  │  └─ 需要多项目编排 → GitLab CI
│  │
│  └─ 自建 GitLab → GitLab CI（一体化）
│
└─ 混合环境（GitHub + GitLab）
   ├─ GitHub 代码 + 自建 CI
   │  ├─ 自托管 GitHub Actions Runner
   │  └─ Jenkins / GitLab CI
   │
   ├─ 多平台代码统一管理
   │  └─ GitLab CI（多 repo 支持）
   │
   └─ 统一 DevOps 平台
      └─ GitLab CI
```

### 5.2 场景推荐矩阵

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| **开源项目** | GitHub Actions | 免费无限，社区曝光，便于贡献 |
| **GitHub 托管的中小型项目** | GitHub Actions | 集成简单，免费额度够用 |
| **GitHub 托管的大型项目** | 自托管 GitHub Actions Runner | 成本可控，保持生态 |
| **大型企业自建 GitLab** | GitLab CI | 一体化，成本可控，权限完善 |
| **需要复杂环境管理** | GitLab CI | 环境管理更强大，支持多环境 |
| **国内网络环境** | GitLab CI（自建） | 避免访问 GitHub 不稳定 |
| **多平台代码统一管理** | GitLab CI | 支持多 repo Pipeline 编排 |
| **简单的个人项目** | GitHub Actions | 上手最快，配置简单 |
| **需要矩阵构建** | GitHub Actions | Matrix 语法更简洁直观 |
| **需要 K8s 自动部署** | GitLab CI | Auto DevOps 完善，集成度高 |
| **微服务架构** | GitLab CI | 多项目 Pipeline，服务编排 |
| **金融/安全行业** | GitLab CI | 审计日志，合规性支持 |
| **快速迭代创业公司** | GitHub Actions | 上手快，生态丰富 |
| **有大量现成 GitHub Actions** | GitHub Actions | 复用现有生态 |

### 5.3 团队技术栈选型

| 团队现状 | 推荐方案 | 迁移成本 |
|---------|---------|---------|
| 全员使用 GitHub | GitHub Actions | 无 |
| 全员使用 GitLab | GitLab CI | 无 |
| 混合使用 Git + GitHub | GitHub Actions | 低 |
| 混合使用 Git + GitLab | GitLab CI | 低 |
| DevOps 团队熟悉 Jenkins | GitLab CI | 中等 |
| 前端团队为主 | GitHub Actions | 低 |
| 后端团队为主 | GitLab CI | 中等 |

---

## 六、最佳实践

### 6.1 通用最佳实践

#### 1. Pipeline 分层设计

```
快速反馈层（< 5 分钟）
├─ 代码格式检查（Prettier、ESLint）
├─ 语法检查（TypeScript）
└─ 单元测试快速集

完整验证层（< 20 分钟）
├─ 完整单元测试
├─ 集成测试
├─ 构建
└─ 安全扫描

部署层（手动触发）
├─ 测试环境部署
├─ 预发布环境部署
└─ 生产环境部署
```

#### 2. 缓存策略

**依赖缓存**
- node_modules（npm/yarn/pnpm）
- vendor（composer）
- .m2（Maven）
- .pip（Python）

**构建缓存**
- Webpack/Vite 缓存
- Docker 层缓存

**缓存 Key 设计**
```yaml
# GitLab CI
cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/

# GitHub Actions
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

#### 3. 并行化策略

**测试并行**
```yaml
# GitHub Actions Matrix
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: npm test -- --shard ${{ matrix.shard }}/4

# GitLab CI Parallel
test:
  parallel: 4
  script:
    - npm test -- --shard $CI_NODE_INDEX/$CI_NODE_TOTAL
```

**多平台并行**
```yaml
# GitHub Actions
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node: [16, 18, 20]
```

#### 4. 失败快速反馈

```yaml
# 优先运行快速检查
stages:
  - quick-check  # < 2 分钟
  - test         # < 10 分钟
  - build        # < 15 分钟
  - deploy

# 快速失败
strategy:
  fail-fast: true  # 某个失败立即停止全部
```

#### 5. 安全性最佳实践

- **Secret 管理**：使用平台提供的 Secret 功能，不要硬编码
- **最小权限**：Runner 和部署账号使用最小权限
- **密钥轮换**：定期轮换密钥
- **审计日志**：启用审计日志，监控异常操作
- **依赖扫描**：集成 SAST、DAST、依赖扫描
- **镜像安全**：使用官方镜像，定期更新

### 6.2 GitHub Actions 最佳实践

#### 使用 Composite Action 复用逻辑

```yaml
# .github/actions/setup-node/action.yml
name: 'Setup Node.js'
description: 'Setup Node.js with caching'
inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'
  install-command:
    description: 'Install command'
    required: false
    default: 'npm ci'

runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
    
    - shell: bash
      run: ${{ inputs.install-command }}

# 使用
steps:
  - uses: ./.github/actions/setup-node
    with:
      node-version: '18'
      install-command: 'pnpm install'
```

#### 使用 Matrix 并行测试

```yaml
strategy:
  fail-fast: false
  matrix:
    node-version: [16.x, 18.x, 20.x]
    os: [ubuntu-latest, windows-latest]
    shard: [1, 2, 3, 4]
    exclude:
      - os: windows-latest
        node-version: 16.x

run-tests:
  steps:
    - run: npm test -- --shard ${{ matrix.shard }}/4
```

#### 缓存优化

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      node_modules
      .next/cache
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.ts') }}
    restore-keys: |
      ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}-
      ${{ runner.os }}-node-
```

#### 条件执行

```yaml
# 仅在特定分支执行
- if: github.ref == 'refs/heads/main'
  run: npm run deploy

# 基于 PR 变更文件
- if: contains(github.event.head_commit.modified, 'package.json')
  run: npm install

# 仅在 PR 中执行
- if: github.event_name == 'pull_request'
  run: npm run test:pr

# 手动触发
- if: github.event_name == 'workflow_dispatch'
  run: npm run deploy
```

#### 使用 Actions Hub 查找优质 Action

- `actions/checkout`：检出代码
- `actions/setup-node`、`actions/setup-python`：环境配置
- `actions/upload-artifact`、`actions/download-artifact`：产物传递
- `peaceiris/actions-gh-pages`：部署到 GitHub Pages
- `codecov/codecov-action`：代码覆盖率
- `aws-actions/configure-aws-credentials`：AWS 集成

### 6.3 GitLab CI 最佳实践

#### 使用 extends 复用配置

```yaml
.nodejs_base: &nodejs_base
  image: node:20-alpine
  before_script:
    - npm ci

build:
  <<: *nodejs_base
  stage: build
  script:
    - npm run build

test:
  <<: *nodejs_base
  stage: test
  script:
    - npm test
```

#### 使用 rules 灵活控制

```yaml
# 基于分支
rules:
  - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  - if: $CI_COMMIT_BRANCH =~ /^feature\/.*/

# 基于文件变更
rules:
  - changes:
      - "src/**/*"
    when: on_success
  - when: never

# 基于 MR
rules:
  - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    variables:
      IS_MR: "true"

# 基于 Tag
rules:
  - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
    when: manual
  - when: never

# 手动触发
rules:
  - when: manual
    allow_failure: true
```

#### 分层缓存

```yaml
cache:
  # 第一层：基于 package-lock.json
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
  policy: pull-push

# 第二层：构建缓存
cache:
  key: "${CI_COMMIT_REF_SLUG}-build"
  paths:
    - .next/cache/
    - dist/.cache/
  policy: pull
```

#### 多项目 Pipeline

```yaml
# 触发下游服务
trigger_downstream:
  stage: deploy
  trigger:
    project: my-group/microservice
    branch: main
    strategy: depend

# 等待上游项目
upstream_bridge:
  stage: test
  trigger:
    project: my-group/upstream
    branch: main
```

#### 环境管理

```yaml
deploy_staging:
  stage: deploy
  environment:
    name: staging
    url: https://staging.example.com
    on_stop: stop_staging
  script:
    - ./deploy.sh staging

stop_staging:
  stage: deploy
  environment:
    name: staging
    action: stop
  script:
    - ./stop.sh staging
  when: manual
```

#### 安全扫描集成

```yaml
# SAST（静态应用安全测试）
sast:
  stage: security
  include:
    - template: Security/SAST.gitlab-ci.yml

# 依赖扫描
dependency_scanning:
  stage: security
  include:
    - template: Security/Dependency-Scanning.gitlab-ci.yml

# 容器扫描
container_scanning:
  stage: security
  image: aquasec/trivy:latest
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

# 密钥检测
secret_detection:
  stage: security
  include:
    - template: Security/Secret-Detection.gitlab-ci.yml
```

---

## 七、常见组合方案

### 7.1 GitHub 代码 + 自建 CI

#### 方案 A：自托管 GitHub Actions Runner

**架构**
```
GitHub 代码仓库
    ↓
自托管 GitHub Actions Runner（公司内网）
    ↓
部署到公司基础设施
```

**优点**
- 保持 GitHub 生态
- 成本可控（服务器自己管理）
- 数据在内网，更安全

**缺点**
- 需要维护 Runner
- 需要处理 Runner 升级

**配置示例**
```yaml
# 自托管 Runner 标签
runs-on: [self-hosted, linux, x64]

# 或使用特定 Runner
runs-on: [self-hosted, production]
```

#### 方案 B：Jenkins / GitLab CI

**架构**
```
GitHub 代码仓库
    ↓ (Webhook)
Jenkins / GitLab CI
    ↓
部署到公司基础设施
```

**优点**
- 完全自主可控
- 与现有 DevOps 工具链集成

**缺点**
- 失去 GitHub 集成优势
- 需要额外配置 Webhook

### 7.2 混合云部署

#### 方案：测试环境用 GitHub Actions，生产环境用 GitLab CI

**架构**
```
GitHub 代码仓库
    ├─→ GitHub Actions (托管 Runner)
    │      └─→ 测试环境部署（AWS / 阿里云）
    │
    └─→ GitLab CI (自托管)
           └─→ 生产环境部署（私有云 / K8s）
```

**适用场景**
- 测试环境需要快速迭代
- 生产环境需要严格控制

### 7.3 微服务架构

#### 方案 A：统一 GitLab CI

**架构**
```
GitLab 代码仓库（多个微服务）
    ↓
GitLab CI（多项目 Pipeline）
    ↓
K8s 集群
```

**优点**
- 统一管理所有服务
- 服务间依赖编排
- 统一监控和日志

**配置示例**
```yaml
# API Gateway
gateway:
  stage: deploy
  trigger:
    project: my-group/gateway
    strategy: depend

# 微服务 A
service_a:
  stage: deploy
  needs:
    - gateway
  trigger:
    project: my-group/service-a
    strategy: depend

# 微服务 B
service_b:
  stage: deploy
  needs:
    - gateway
  trigger:
    project: my-group/service-b
    strategy: depend
```

#### 方案 B：每个服务独立的 CI

**架构**
```
每个微服务独立的 GitHub Actions
    ↓
各自部署到 K8s
```

**优点**
- 服务独立解耦
- 团队自治

**缺点**
- 缺乏全局视图
- 依赖关系难以管理

### 7.4 多平台代码统一管理

#### 方案：GitLab CI + 多 Repo

**架构**
```
GitLab Group
├─ frontend（GitHub）
├─ backend（GitHub）
├─ mobile（GitHub）
└─ infra（GitLab）
    ↓
GitLab CI（统一编排）
    ↓
统一部署
```

**优点**
- 支持多平台代码统一管理
- 统一的 Pipeline 编排
- 统一的监控和日志

### 7.5 渐进式迁移

#### 从 Jenkins 迁移到 GitLab CI

**阶段 1：Jenkins + GitLab CI 共存**
- Jenkins 继续处理现有 Pipeline
- 新服务使用 GitLab CI

**阶段 2：逐步迁移**
- 按服务优先级逐个迁移
- 保留 Jenkins 作为备份

**阶段 3：完全切换**
- 所有服务使用 GitLab CI
- 停用 Jenkins

---

## 八、总结建议

### 8.1 快速决策指南

| 你的情况 | 推荐方案 | 关键理由 |
|---------|---------|---------|
| 代码在 GitHub，构建量小 | GitHub Actions | 免费额度够用，集成简单 |
| 代码在 GitHub，构建量大 | 自托管 Actions Runner | 成本可控，保持生态 |
| 代码在 GitLab（自建） | GitLab CI | 一体化，无额外成本 |
| 企业 DevOps 平台 | GitLab CI | 权限、审计、合规完善 |
| 开源项目 | GitHub Actions | 免费无限，社区友好 |
| 需要复杂环境管理 | GitLab CI | 环境概念更强大 |
| 国内网络环境 | GitLab CI（自建） | 避免访问 GitHub 不稳定 |
| 简单个人项目 | GitHub Actions | 上手最快 |
| 需要矩阵构建 | GitHub Actions | Matrix 语法更简洁 |
| 微服务架构 | GitLab CI | 多项目编排能力强 |
| 金融/安全行业 | GitLab CI | 审计、合规支持完善 |
| 快速迭代创业公司 | GitHub Actions | 生态丰富，上手快 |

### 8.2 核心选型原则

1. **生态优先**
   - 与代码托管平台保持一致
   - 减少集成成本和学习成本
   - 利用现有生态和社区资源

2. **成本可控**
   - 评估长期成本
   - 大型企业建议自托管
   - 避免按分钟计费陷阱

3. **团队能力**
   - 选择团队熟悉的工具
   - 考虑招聘和人才储备
   - 降低学习成本

4. **扩展性**
   - 考虑未来可能的需求
   - 如多环境、多项目、多平台
   - 避免后期迁移成本

5. **渐进迁移**
   - 可以先用简单方案
   - 后期按需升级
   - 不要过度设计

### 8.3 避坑指南

#### ❌ 常见错误

1. **过度追求免费**
   - GitHub Actions 私有仓库免费额度有限
   - 大型项目成本可能更高

2. **忽视维护成本**
   - 自托管 Runner 需要维护
   - 安全更新、版本升级都需要投入

3. **过度复杂化**
   - 简单项目不需要复杂的 Pipeline
   - 优先满足核心需求

4. **忽略团队现状**
   - 不要为了"技术选型"而选型
   - 考虑团队技术栈和能力

#### ✅ 最佳实践

1. **先定义需求**
   - 明确 CI/CD 的核心目标
   - 列出必须满足的功能
   - 设定可衡量的指标

2. **小步验证**
   - 先用简单方案验证
   - 收集反馈后优化
   - 逐步完善

3. **监控和优化**
   - 监控 Pipeline 性能
   - 定期优化配置
   - 持续改进

### 8.4 未来趋势

1. **云原生 CI/CD**
   - 更好的 K8s 集成
   - Serverless 执行器
   - 边缘计算支持

2. **AI 辅助**
   - 智能错误诊断
   - 自动优化建议
   - 代码质量预测

3. **安全性增强**
   - 供应链安全扫描
   - 密钥自动轮换
   - 合规性自动化检查

4. **DevSecOps**
   - 安全左移
   - 自动化安全测试
   - 持续合规检查

---

## 附录

### A. 参考资源

#### GitHub Actions
- 官方文档：https://docs.github.com/actions
- GitHub Marketplace：https://github.com/marketplace
- Awesome GitHub Actions：https://github.com/sdras/awesome-actions

#### GitLab CI
- 官方文档：https://docs.gitlab.com/ee/ci/
- CI/CD 模板：https://gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates
- GitLab CI Examples：https://gitlab.com/gitlab-org/ci-examples/

### B. 常用 Actions 和模板

#### GitHub Actions 常用库
```yaml
# 代码检出
- uses: actions/checkout@v4

# 环境配置
- uses: actions/setup-node@v4
- uses: actions/setup-python@v5
- uses: actions/setup-java@v4
- uses: actions/setup-go@v5

# 缓存
- uses: actions/cache@v4

# Docker
- uses: docker/setup-buildx-action@v3
- uses: docker/login-action@v3
- uses: docker/build-push-action@v5

# 部署
- uses: peaceiris/actions-gh-pages@v3
- uses: appleboy/ssh-action@master

# 测试和报告
- uses: codecov/codecov-action@v4
- uses: dorny/test-reporter@v1

# AWS
- uses: aws-actions/configure-aws-credentials@v4
```

#### GitLab CI 常用模板
```yaml
# SAST
include:
  - template: Security/SAST.gitlab-ci.yml

# 依赖扫描
include:
  - template: Security/Dependency-Scanning.gitlab-ci.yml

# 容器扫描
include:
  - template: Security/Container-Scanning.gitlab-ci.yml

# 密钥检测
include:
  - template: Security/Secret-Detection.gitlab-ci.yml

# License 扫描
include:
  - template: Security/License-Scanning.gitlab-ci.yml

# Auto DevOps
include:
  - template: Auto-DevOps.gitlab-ci.yml
```

---

> **免责声明**：本文档基于 2026 年初的技术状态编写，CI/CD 平台持续更新，建议在实际选型前查阅最新官方文档和社区动态。
