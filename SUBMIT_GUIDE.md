# 平台分发参考指南 — mcp-skill-deployer

以下为**可选的手工提交参考**，用户可根据需要选择性地向各个平台提交，无需全部发布。

## 自动完成项
- [x] GitHub Push
- [x] Git Tag v1.0.0

---

## 平台 1：cursor.directory

提交链接：https://cursor.directory/plugins/new

操作步骤：
  1. 点击上方链接进入提交页面
  2. Plugin Name 填：MCP Skill Deployer
  3. Description 填：One-stop MCP & Skill quality auditor, optimizer, and multi-platform publisher. 100-point quality scoring, guided fixes, 9 platform export formats, and publishing to NPM, Smithery, GitHub, cursor.directory, Dify, GPT Store, Coze, FlowGPT, and more.
  4. Rules / Plugin Content：粘贴 .cursor/rules/mcp-skill-deployer.mdc 的完整内容
  5. GitHub Repo 填：https://github.com/lalal-zzz/mcp-skill-publisher
  6. 点击 Submit

## 平台 2：Dify Marketplace

提交链接：https://dify.ai 登录后在 Studio 中选择 "Import DSL File"
导入文件：workflows/mcp-skill-deployer.yml

---

## 平台 3：OpenAI GPT Store

提交链接：https://chatgpt.com/gpts/editor
操作步骤：
  1. 点击 "Create a GPT"
  2. 在 Instructions 框中粘贴 gpts/mcp-skill-deployer-instructions.txt 的完整内容
  3. Name 填：MCP Skill Deployer
  4. Description 填：One-stop quality audit, optimization, and multi-platform publishing for MCP & Skill projects
  5. 点击 Publish（选择 Public）

---

## 平台 4：Coze 扣子商店

提交链接：https://coze.cn 或 https://coze.com
操作步骤：
  1. 创建 Bot
  2. 在「人设与回复逻辑」中粘贴 coze/mcp-skill-deployer-bot.json 中的 system prompt
  3. 发布到商店

---

## 平台 5：FlowGPT

提交链接：https://flowgpt.com 登录后 Create New Prompt
粘贴内容：flowgpt/mcp-skill-deployer.md 的完整 Markdown

---

## 平台 6：PromptBase

提交链接：https://promptbase.com/sell
粘贴内容：promptbase/mcp-skill-deployer.md 的内容
价格：Free

---

## 平台 7：Awesome Lists (PR 提交)

### 7a: f/awesome-chatgpt-prompts
PR 链接：https://github.com/f/awesome-chatgpt-prompts/edit/main/README.md

在文件中搜索 "## Other" 附近，添加：
```
- **[MCP Skill Deployer]** — One-stop MCP & Skill quality audit, optimization, and multi-platform publisher. 100-point scoring + 9 platform export formats. [Repo](https://github.com/lalal-zzz/mcp-skill-publisher)
```

### 7b: PatrickJS/awesome-cursorrules
PR 链接：https://github.com/PatrickJS/awesome-cursorrules/edit/main/README.md

在 .cursorrules 或 Cursor 相关分类下添加：
```
- [**mcp-skill-deployer**](https://github.com/lalal-zzz/mcp-skill-publisher) — Universal MCP & Skill publisher. Auto-exports to .mdc, .yml, .txt, .json for 9 platforms.
```

### 7c: e2b-dev/awesome-ai-agents
PR 链接：https://github.com/e2b-dev/awesome-ai-agents/edit/main/readme.md

在 Agent 工具分类下添加：
```
- [mcp-skill-deployer](https://github.com/lalal-zzz/mcp-skill-publisher) — Agent skill that automates publishing MCP servers and skills to 9 platforms.
```
