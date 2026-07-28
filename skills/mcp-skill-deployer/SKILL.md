---
name: mcp-skill-deployer
description: One-stop toolkit to audit, optimize, and publish MCP servers and Agent Skills. Use when the user asks to inspect, audit, score, optimize, or improve an MCP server / Agent Skill project, or to package and publish it to NPM, Smithery, Official MCP Registry, GitHub, cursor.directory, Dify Marketplace, OpenAI GPT Store, Coze Store, FlowGPT, PromptBase, and popular awesome-lists.
---

# 一站式 MCP & Skill 体检、优化与全平台发布技能 (MCP & Skill Deployer)

当用户请求"检查/体检我的 MCP 或 Skill"、"帮我优化这个 Skill"、"检查并发布项目"或执行 `/mcp-skill-deployer` 时，请严格按照以下 SOP 执行。

---

## 运行模式选择 (Mode Selection)

根据用户意图选择运行模式，**不要默认执行完整发布流程**：

| 模式 | 触发意图示例 | 执行阶段 |
|------|-------------|---------|
| 🔍 **体检模式 (Audit)** | "检查一下我的 MCP"、"这个 Skill 有什么问题"、"帮我打个分" | 阶段 0 → 1 → 2（只输出报告，不修改文件） |
| 🛠 **优化模式 (Optimize)** | "帮我优化这个 Skill"、"改进我的 MCP"、"把问题修掉" | 阶段 0 → 1 → 2 → 3（逐项确认后修改文件） |
| 🚀 **发布模式 (Publish)** | "发布我的项目"、"上传到各个平台"、"打包上架" | 阶段 0 → 1 → 2 → 3 → 4 → 5 → 6（完整管道） |

*意图不明确时，先询问用户："你希望我 (1) 只做体检打分，(2) 体检并优化，还是 (3) 一路发布到各平台？"*

---

## 全平台导出总览

发布模式下，本工具支持将项目一次性导出为以下所有平台格式：

```
mcp-skill-deployer
       │
       ├──> [1. CLI / GitHub] ────> skills/<name>/SKILL.md → npx skills add
       ├──> [2. Cursor IDE] ───────> .cursor/rules/<name>.mdc → cursor.directory
       ├──> [3. Dify 平台] ────────> workflows/<name>.yml → Dify Marketplace
       ├──> [4. OpenAI GPTs] ─────> gpts/<name>-instructions.txt → GPT Store
       ├──> [5. Coze 扣子] ───────> coze/<name>-bot.json → 扣子商店
       ├──> [6. FlowGPT] ─────────> flowgpt/<name>.md → flowgpt.com
       ├──> [7. PromptBase] ──────> promptbase/<name>.md → promptbase.com
       ├──> [8. Windsurf] ────────> .windsurfrules → Windsurf Rules
       └──> [9. Awesome Lists] ──> PR 模板 → GitHub awesome-* 仓库
```

---

## 阶段 0：基本合规性门禁检查 (Pre-flight Compliance Audit)

在执行任何优化、构建或上传动作前，**必须先执行以下基本要求检查**。若存在不合规项且无法自动修复，立刻暂停并指引用户。体检/优化模式下可跳过 NPM 登录检查。

### 1. 环境与账号基本要求检查（发布模式必查）
- [ ] **NPM 登录状态检查**：在终端运行 `npm whoami`。
  - *若返回未登录*：暂停流程，提示用户："请先在终端运行 `npm login` 完成登录后再试。"
- [ ] **Git 状态检查**：运行 `git status`。
  - *若存在未提交的关键修改*：提示用户是否需要先 `git commit`。
- [ ] **网络连通性检查**：检查是否能正常访问 `registry.npmjs.org` 和 GitHub。

### 2. MCP 项目基本合规要求检查 (若包含 MCP)
- [ ] **`package.json` 合规性**：
  - 必须包含 `name`（小写字母、数字与连字符，符合 npm 命名规范）；
  - 必须包含 `version`（符合语义化版本规范，如 `1.0.0`）；
  - 必须包含 `bin` 可执行节点（如 `"bin": { "my-mcp": "./index.js" }`），确保支持 `npx` 免安装运行。
- [ ] **入口文件存在性**：检查 `bin` 指向的文件（如 `index.js`）或 Python 入口文件（如 `server.py`）是否存在。
- [ ] **依赖完整性**：检查 `node_modules` 或 Python `pip` 依赖是否已正确安装。
- [ ] **LICENSE 文件存在性**：开源发布必须包含 LICENSE 文件，缺失时提示用户选择协议（默认建议 MIT）。

### 3. Skill 项目基本合规要求检查 (若包含 Skill)
- [ ] **目录结构合规性**：技能文件必须存放在 `skills/<skill-name>/SKILL.md` 二级目录下。
- [ ] **SKILL.md 文件名**：文件名必须完全大写为 `SKILL.md`。
- [ ] **YAML Frontmatter 标头合规性**：
  - 文件顶部必须包含 `---` 标头；
  - 必须包含 `name:`（仅限小写字母、数字和连字符 `-`，如 `stock-diagnose`）；
  - 必须包含非空的 `description:`。

### 4. 安全合规要求检查 (Security Compliance) — 强制执行
以下为发布前的**强制安全门禁**，任何一项不通过必须暂停并指引用户修复：

- [ ] **敏感信息扫描**：
  - 扫描项目文件（含 SKILL.md、配置文件、示例代码）中是否存在 API Key、Token、密码、私钥、`.env` 内容等敏感信息
  - *若发现*：立刻暂停并列出具体文件与行号，指引用户移除后再继续

- [ ] **Cursor Rules 安全配置**：
  - 检查 `.cursor/rules/*.mdc` 和 `.windsurfrules` 文件
  - **禁止** `alwaysApply: true` 与 `globs: **/*` 同时出现（会导致 SOP 在所有上下文中常驻，增加误触发风险）
  - 正确配置示例：`alwaysApply: false` + `globs: "**/package.json,**/skills/**"`（仅在相关项目中激活）
  - *若不合规*：自动修正为安全默认值，或提示用户确认修改

- [ ] **操作确认门禁 (Confirmation Gates)**：
  - 检查 SKILL.md 中是否包含 `npm publish`、`git push`、`npx -y <第三方CLI>` 等写入/外发指令
  - **每一条写入/外发指令前必须有明确的用户确认步骤**（如 "I'm about to run X. Proceed?"）
  - *若不合规*：在 SKILL.md 的对应阶段自动插入确认门禁语句

- [ ] **命名一致性检查**：
  - 仓库名、Skill 名称（YAML `name:`）、插件列表名称应保持一致或具有明确的对应关系
  - 避免仓库名与 Skill 内部标识名存在无文档说明的偏差
  - *若存在偏差*：提示用户在 README 中说明对应关系

- [ ] **批量发布与灌水检查**：
  - 检查是否存在自动向多个平台批量提交的脚本或指令（如自动 PR 提交、批量商店上架）
  - 多平台分发应生成**手工提交指南**而非自动执行脚本
  - 每个平台的提交应由用户手动确认并操作
  - *若不合规*：将自动批量提交逻辑替换为「生成提交指南 + 用户手动确认」模式

---

## 阶段 1：项目类型自动识别 (Project Inspection)

通过合规性检查后，自动判定项目模式：
- **纯 MCP 模式**：仅包含代码与 MCP 依赖；
- **纯 Skill 模式**：仅包含 `skills/` Markdown 技能包；
- **MCP + Skill 混合模式**：同时包含代码与技能包。

---

## 阶段 2：质量体检与评分 (Quality Audit & Scoring)

合规检查解决"**能不能发**"，本阶段解决"**好不好用**"。逐项打分并输出体检报告。

### 2A. MCP Server 质量体检清单（每项 10 分，共 100 分）

| # | 检查项 | 评判标准 |
|---|--------|---------|
| 1 | **工具命名** | 工具名使用 `snake_case` 动词短语（如 `search_files`），语义清晰，无缩写歧义 |
| 2 | **工具描述质量** | 每个 tool 的 `description` 说清「做什么 + 何时使用 + 输入输出」，而非一句空话 |
| 3 | **参数 Schema 完备性** | 每个参数有 `description`、正确的 `type`，必填项标注 `required`，枚举值用 `enum` |
| 4 | **工具数量克制** | 工具职责单一、无功能重复；相似操作合并（避免 20+ 个碎片工具挤爆上下文） |
| 5 | **错误处理** | 出错时返回可读的错误信息（指导 Agent 如何修正），而非裸抛异常或空响应 |
| 6 | **返回值 Token 效率** | 大结果支持分页/截断/过滤，避免一次返回上万 token 压垮上下文 |
| 7 | **README 完整性** | 包含功能介绍、安装命令、配置示例（`claude_desktop_config.json` / IDE 配置片段）、可用工具列表 |
| 8 | **注册表元数据** | 存在 `smithery.yaml` / `server.json`，字段与 `package.json` 一致 |
| 9 | **安全设计** | 敏感操作（写文件、发请求、执行命令）有约束说明；密钥通过环境变量传入而非硬编码 |
| 10 | **可运行性** | `npx <package>` / 入口命令可直接冷启动，无缺失依赖或路径错误 |

### 2B. Agent Skill 质量体检清单（每项 10 分，共 100 分）

| # | 检查项 | 评判标准 |
|---|--------|---------|
| 1 | **description 可触发性** | 包含「做什么 + 何时使用（Use when...）」和用户可能说出的关键词，Agent 能据此正确路由 |
| 2 | **name 规范** | 小写字母 + 连字符，与目录名一致，语义达意 |
| 3 | **正文长度克制** | SKILL.md 正文 ≤ 500 行；超长内容拆分到 `references/` 或 `assets/` 子文件按需加载（渐进披露） |
| 4 | **指令可执行性** | 步骤是具体可操作的指令（含命令、路径、格式模板），而非抽象原则 |
| 5 | **触发边界清晰** | 明确「什么时候用 / 什么时候不用」，避免与其他 skill 抢触发 |
| 6 | **示例充分** | 关键输出（报告、配置、代码）有格式模板或示例，Agent 照抄即可 |
| 7 | **错误分支处理** | 对失败场景（检查不通过、命令报错）有明确的暂停/回退/指引动作 |
| 8 | **无环境假设** | 不假设特定 OS/Shell/工具已安装；有前置依赖时先检测并给出安装指引 |
| 9 | **安全边界** | 写入/外发操作有确认门禁；无诱导 Agent 绕过安全策略的措辞 |
| 10 | **元数据一致性** | frontmatter、README、目录名、安装命令中的名称与描述互相一致 |

### 2C. 体检报告输出格式

```
========================================
 🔍 质量体检报告：<project-name>
========================================
 项目类型：<MCP / Skill / 混合>
 总分：<n>/100  评级：<A ≥90 | B ≥75 | C ≥60 | D <60>

 ✅ 已达标 (<n> 项)
   [√] 工具命名规范
   ...

 ⚠️ 待优化 (<n> 项，按影响排序)
   [1] <检查项>：<具体问题> → 建议：<具体改法>
   [2] ...

 ❌ 阻断项 (<n> 项，发布前必须修复)
   [1] <检查项>：<具体问题> → 修复方法：<具体步骤>
========================================
```

**体检模式到此结束**，输出报告后询问用户是否进入优化模式。

---

## 阶段 3：优化执行 (Optimization)

针对阶段 2 报告中的「待优化」和「阻断项」，逐项执行优化：

1. **逐项展示改动预览**：每项优化先说明「改哪个文件、为什么改、改成什么样」，展示关键 diff；
2. **征得确认后修改**：用户确认后才写入文件；用户可跳过任意项；
3. **优化优先级**：阻断项 → 高影响待优化项（description、工具描述、安全门禁）→ 低影响项（措辞、格式）；
4. **不做的事**：不改变项目的核心功能逻辑；不删除用户的自定义内容；对不确定的改动宁可询问也不擅自决定；
5. **优化完成后重新打分**，展示前后分数对比。

**优化模式到此结束**。若用户要求发布，继续以下阶段。

---

## 阶段 4：全平台格式自动导出 (Multi-Platform Auto-Export)

根据项目类型，自动生成以下全部平台格式文件。**对于 Skill 项目，以下所有导出全部执行；对于 MCP 项目，执行 MCP 相关及适用的平台格式。** 生成前若目标文件已存在，必须先询问是否覆盖。

### 平台 1：CLI / GitHub 原生格式
- 确保 `skills/<name>/SKILL.md` 已存在且合规
- 生成包含一键安装指令的 README.md 更新

### 平台 2：Cursor IDE + cursor.directory
- **输出路径**：`.cursor/rules/<skill-name>.mdc`
- **生成规则**：将 SKILL.md 的 YAML frontmatter 转换为 Cursor `.mdc` 格式：
  ```yaml
  ---
  description: <skill description>
  globs: "**/package.json,**/skills/**"
  alwaysApply: false
  ---
  ```
  后跟 SKILL.md 的正文内容（去除原有 YAML frontmatter）
- **安全约束**：禁止生成 `alwaysApply: true` 与 `globs: **/*` 的组合；必须使用范围化的 globs 并保持 `alwaysApply: false`
- 提示用户可提交至 `cursor.directory` 获取全球曝光

### 平台 3：Dify Marketplace
- **输出路径**：`workflows/<skill-name>.yml`
- **生成规则**：将 SKILL.md 的每个阶段拆分为 Dify 工作流节点，按阶段顺序构建 Dify DSL：
  ```yaml
  app:
    name: <skill-name>
    mode: workflow
  kind: app
  version: 0.1.0
  workflow:
    graph:
      nodes:
        - id: start
          type: start
        - id: llm
          type: llm
          data:
            model:
              provider: openai
              name: gpt-4
            prompt_template:
              - text: "<SKILL.md 完整 SOP 内容>"
  ```
- 提示用户可导入至 `dify.ai` 商店

### 平台 4：OpenAI GPT Store
- **输出路径**：`gpts/<skill-name>-instructions.txt`
- **生成规则**：纯文本文件，内容为：
  ```
  # <skill-name>
  <SKILL.md 正文去除 YAML frontmatter 的完整内容>

  You must follow the above instructions step by step.
  ```
- 提示用户可在 ChatGPT 创建 Custom GPT 时粘贴此内容至 Instructions 字段

### 平台 5：Coze 扣子商店
- **输出路径**：`coze/<skill-name>-bot.json`
- **生成规则**：生成 Coze Bot 配置 JSON：
  ```json
  {
    "name": "<skill-name>",
    "description": "<skill description>",
    "prompt": {
      "system": "<SKILL.md 正文精简为 JSON-safe 字符串>"
    }
  }
  ```
- 提示用户可导入至 `coze.cn` 或 `coze.com`

### 平台 6：FlowGPT
- **输出路径**：`flowgpt/<skill-name>.md`
- **生成规则**：Markdown 文件，内容是去除 YAML frontmatter 的 SKILL.md 正文，并附加一段 Interaction Guide 供 FlowGPT 用户直接使用

### 平台 7：PromptBase
- **输出路径**：`promptbase/<skill-name>.md`
- **生成规则**：精简版 Markdown，头几行写售价建议（如 "Free"），后跟技能描述和核心 Prompt

### 平台 8：Windsurf Rules
- **输出路径**：`.windsurfrules`
- **生成规则**：与 Cursor `.mdc` 格式相同，但文件名为 `.windsurfrules`，放置在项目根目录

### 平台 9：Awesome Lists PR 模板
- **输出路径**：`awesome-prs/<skill-name>.md`
- **生成规则**：生成一个 PR 说明 Markdown 文件，包含：
  - Skill 名称与一句话描述
  - GitHub 仓库链接
  - 适用于哪些 awesome 列表（`f/awesome-chatgpt-prompts`、`awesome-cursorrules`、`awesome-agent-skills`）
  - 供用户直接复制粘贴提交 PR 的链接和文本

---

## 阶段 5：代码测试与安全校验 (Testing & Audit)

1. **运行单元测试**：根据项目类型运行 `pytest` 或 `npm test`。
2. **打包预览校验**：运行 `npm pack --dry-run`，确保敏感文件（如 `.env`、私钥）未混入打包列表中。

*若单元测试失败，立刻停止并输出错误日志。*

---

## 阶段 6：执行打包与全网分发 (Execution & Distribution)

**⚠️ 强制安全规则：所有写入/外发操作（npm publish、git push、npx 第三方 CLI、注册表提交等）必须在执行前获得用户逐项明确确认。禁止自动批量执行。**

### 轨道 A：执行 MCP 全网发布
1. **NPM 发布**（需逐项确认）：
   先询问用户：「即将执行 `npm version patch` 升级版本号并 `npm publish --access public` 发布到 NPM，是否继续？」
   用户确认后执行：
   ```bash
   npm version patch --no-git-tag-version
   npm publish --access public
   ```
2. **提交至 Smithery.ai**（需逐项确认）：
   先询问用户：「即将执行 `npx @smithery/cli mcp publish` 提交到 Smithery.ai，是否继续？」
   用户确认后执行：
   ```bash
   npx -y @smithery/cli mcp publish .
   ```
3. **提交至 Anthropic 官方注册表**（需逐项确认）：
   先询问用户：「即将执行 `npx @modelcontextprotocol/registry-cli publish` 提交到 Anthropic 注册表，是否继续？」
   用户确认后执行：
   ```bash
   npx -y @modelcontextprotocol/registry-cli publish
   ```
4. **输出 Glama.ai / mcp.so** 自动索引提交链接。

### 轨道 B：执行 Skill 全网发布
1. **GitHub Release / Tag**（需逐项确认）：
   先询问用户：「即将执行 `git tag` 并 `git push` 推送到远程仓库，是否继续？」
   用户确认后执行：
   ```bash
   git tag v<version> -m "<description>"
   git push origin v<version>
   ```
2. **生成各平台手工提交指南**（仅生成指南文件，不自动提交）：
   生成 `SUBMIT_GUIDE.md` 文件，包含各平台的**手动操作步骤和所需内容**，由用户自行决定去哪些平台提交：
   - CLI：`npx skills add https://github.com/<目标项目用户名>/<目标项目仓库名>`（替换为被发布项目的实际地址）
   - Cursor：提供 `.mdc` 文件路径，引导用户手动访问 `cursor.directory/plugins/new` 提交
   - Dify：提供 `.yml` 文件路径，引导用户在 Dify Studio 手动导入
   - GPTs：提供 `gpts/` 目录下的 Instructions 文本，供用户手动创建 Custom GPT
   - Coze：提供 `coze/` 下的 JSON，引导用户在扣子平台手动导入
   - FlowGPT / PromptBase：提供 Markdown 内容，供用户手动复制发布
   - Awesome Lists：提供 PR 模板文本，供用户手动提交

---

## 阶段 7：生成运维汇报 (Final Summary)

向用户汇报完整发布结果：

```
========================================
 🚀 全平台发布结果汇总
========================================

 📦 项目名称：<project-name>
 🔍 项目类型：<MCP / Skill / 混合>

 ✅ 合规检查：通过
 🔍 质量评分：<优化前 n>/100 → <优化后 n>/100（评级 <A/B/C/D>）

 📁 已生成的平台文件：
   [1] skills/<name>/SKILL.md         → npx skills add
   [2] .cursor/rules/<name>.mdc       → cursor.directory
   [3] workflows/<name>.yml           → Dify Marketplace
   [4] gpts/<name>-instructions.txt   → OpenAI GPT Store
   [5] coze/<name>-bot.json           → Coze 扣子商店
   [6] flowgpt/<name>.md              → flowgpt.com
   [7] promptbase/<name>.md           → promptbase.com
   [8] .windsurfrules                 → Windsurf IDE
   [9] awesome-prs/<name>.md          → Awesome Lists PR

 🚀 已执行的发布动作：
   [√] GitHub Push
   [√] Git Tag v<version>
   [√] NPM Publish (MCP only)
   [√] Smithery.ai 提交 (MCP only)

 📋 待用户手动执行（需登录对应平台）：
   [ ] cursor.directory 提交
   [ ] Dify Marketplace 上架
   [ ] GPT Store 发布
   [ ] 扣子商店 上架
   [ ] FlowGPT 发布
   [ ] PromptBase 发布
   [ ] Awesome Lists PR 提交
========================================
```
