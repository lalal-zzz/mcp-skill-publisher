---
name: mcp-skill-deployer
description: Universal AI Agent Skill to inspect compliance, auto-scaffold metadata, test, package, and publish any MCP server or Agent Skill project to NPM, Smithery, Official MCP Registry, GitHub, cursor.directory, Dify Marketplace, OpenAI GPT Store, Coze Store, FlowGPT, PromptBase, and popular awesome-lists.
---

# 一站式 MCP & Skill 合规检查与全平台发布技能 (MCP & Skill Deployer)

当用户请求"检查并发布项目"、"打包部署 MCP/Skill"或执行 `/mcp-skill-deployer` 时，请严格按照以下 SOP 自动化完成合规检查与全套发布管道。

---

## 全平台导出总览

本工具支持将项目一次性导出为以下所有平台格式：

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

在执行任何补全、构建或上传动作前，**必须先执行以下基本要求检查**。若存在不合规项且无法自动修复，立刻暂停并指引用户：

### 1. 环境与账号基本要求检查
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

### 3. Skill 项目基本合规要求检查 (若包含 Skill)
- [ ] **目录结构合规性**：技能文件必须存放在 `skills/<skill-name>/SKILL.md` 二级目录下。
- [ ] **SKILL.md 文件名**：文件名必须完全大写为 `SKILL.md`。
- [ ] **YAML Frontmatter 标头合规性**：
  - 文件顶部必须包含 `---` 标头；
  - 必须包含 `name:`（仅限小写字母、数字和连字符 `-`，如 `stock-diagnose`）；
  - 必须包含非空的 `description:`。

---

## 阶段 1：项目类型自动识别 (Project Inspection)

通过合规性检查后，自动判定项目模式：
- **纯 MCP 模式**：仅包含代码与 MCP 依赖；
- **纯 Skill 模式**：仅包含 `skills/` Markdown 技能包；
- **MCP + Skill 混合模式**：同时包含代码与技能包。

---

## 阶段 2：全平台格式自动导出 (Multi-Platform Auto-Export)

根据项目类型，自动生成以下全部平台格式文件。**对于 Skill 项目，以下所有导出全部执行；对于 MCP 项目，执行 MCP 相关及适用的平台格式。**

### 平台 1：CLI / GitHub 原生格式
- 确保 `skills/<name>/SKILL.md` 已存在且合规
- 生成包含一键安装指令的 README.md 更新

### 平台 2：Cursor IDE + cursor.directory
- **输出路径**：`.cursor/rules/<skill-name>.mdc`
- **生成规则**：将 SKILL.md 的 YAML frontmatter 转换为 Cursor `.mdc` 格式：
  ```yaml
  ---
  description: <skill description>
  globs: **/*
  alwaysApply: true
  ---
  ```
  后跟 SKILL.md 的正文内容（去除原有 YAML frontmatter）
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

## 阶段 3：代码测试与安全校验 (Testing & Audit)

1. **运行单元测试**：根据项目类型运行 `pytest` 或 `npm test`。
2. **打包预览校验**：运行 `npm pack --dry-run`，确保敏感文件（如 `.env`、私钥）未混入打包列表中。

*若单元测试失败，立刻停止并输出错误日志。*

---

## 阶段 4：执行打包与全网分发 (Execution & Distribution)

### 轨道 A：执行 MCP 全网发布
1. **NPM 发布**：
   ```bash
   npm version patch --no-git-tag-version
   npm publish --access public
   ```
2. **提交至 Smithery.ai**：
   ```bash
   npx -y @smithery/cli mcp publish .
   ```
3. **提交至 Anthropic 官方注册表**：
   ```bash
   npx -y @modelcontextprotocol/registry-cli publish
   ```
4. **输出 Glama.ai / mcp.so** 自动索引提交链接。

### 轨道 B：执行 Skill 全网发布
1. **GitHub Release / Tag**：提示并协助用户推送 Git Tag。
   ```bash
   git tag v<version> -m "<description>"
   git push origin v<version>
   ```
2. **生成各平台安装指令**：
   - CLI：`npx skills add https://github.com/用户/仓库`
   - Cursor：提示将 `.mdc` 文件提交至 `cursor.directory`
   - Dify：提示将 `.yml` 导入 Dify 并上架商店
   - GPTs：提示复制 `gpts/` 目录下的 Instructions 文本创建 Custom GPT
   - Coze：提示导入 `coze/` 下的 JSON 至扣子商店
   - FlowGPT / PromptBase：提示复制 Markdown 至对应平台发布
   - Awesome Lists：提示复制 PR 模板提交至目标仓库

---

## 阶段 5：生成运维汇报 (Final Summary)

向用户汇报完整发布结果：

```
========================================
 🚀 全平台发布结果汇总
========================================

 📦 项目名称：<project-name>
 🔍 项目类型：<MCP / Skill / 混合>

 ✅ 合规检查：通过

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
