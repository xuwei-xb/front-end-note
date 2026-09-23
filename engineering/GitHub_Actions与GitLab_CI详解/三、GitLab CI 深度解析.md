> 类型: 章节 · 来源: [[engineering/GitHub_Actions与GitLab_CI详解]] · 更新: 2026-09-23
>
> ---

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
