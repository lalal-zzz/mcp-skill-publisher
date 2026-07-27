---
name: mcp-skill-deployer
description: Universal AI Agent Skill to inspect compliance, auto-scaffold metadata, test, package, and publish any MCP server or Agent Skill project to NPM, Smithery, Official MCP Registry, and GitHub.
---

# 一站式 MCP & Skill 合规检查与全网发布技能 (MCP & Skill Deployer)

当用户请求"检查并发布项目"、"打包部署 MCP/Skill"或执行 `/mcp-skill-deployer` 时，请严格按照以下 SOP 自动化完成合规检查与全套发布管道：

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

## 阶段 2：缺失配置文件自动修复与补全 (Auto-Scaffolding)

若基本检查通过但缺少部分扩展配置文件，自动帮用户补全生成：

### 若含 MCP 项目：
1. **自动生成 `smithery.yaml`**（若缺失）：生成 Smithery.ai 一键安装配置。
2. **自动生成 `server.json`**（若缺失）：生成 Anthropic Official Registry 声明文件。
3. **自动生成 `index.js`**（若为 Python MCP 且缺失 Node Shim）：生成拉起 Python 的 ESM 入口脚本。

### 若含 Skill 项目：
1. **自动转换导出 Cursor Rules**：在 `.cursor/rules/` 下生成 `.mdc` 规则文件。
2. **自动转换导出 Dify 工作流**：解析 Prompt 并导出 `dify_workflow.yml`。

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
2. **生成安装指令**：在用户 `README.md` 中生成专属一键安装代码：
   `npx skills add https://github.com/用户/用户仓库`

---

## 阶段 5：生成运维汇报 (Final Summary)

向用户汇报发布结果：
- ✅ 合规检查状态；
- 🚀 已发布的 NPM 版本与四大注册中心提交状态；
- 📦 供消费者复制使用的 Claude Desktop / Cursor / Dify 配置代码片段。
