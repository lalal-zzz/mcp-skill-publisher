# MCP & Skill Deployer

> 一站式 MCP & Skill 合规检查与全网发布工具

An all-in-one Universal Agent Skill (`SKILL.md`) that automates pre-flight compliance audits, metadata scaffolding, testing, packaging, and multi-registry publishing for both **MCP Servers** and **Agent Skills**.

---

## Installation / 安装

```bash
npx skills add https://github.com/YOUR_GITHUB_USERNAME/mcp-skill-publisher
```

---

## Usage / 使用方式

Open any MCP or Skill project workspace and ask your AI Agent:

> **"Help me inspect, package, and publish my project to the world!"**
> *(or run `/mcp-skill-deployer`)*

在任意 MCP 或 Skill 项目工作区中对 AI Agent 说：

> **"帮我检查并发布当前项目！"**
> *(或执行 `/mcp-skill-deployer`)*

---

## Automated Pipeline / 自动化工作流

| Step | English | 中文 |
|------|---------|------|
| 0 | **Pre-flight Audit** — `npm whoami`, git status, `package.json` / `SKILL.md` compliance | **合规门禁** — 检查 NPM 登录、Git 状态、配置文件合规性 |
| 1 | **Project Inspection** — Auto-detect MCP-only, Skill-only, or hybrid mode | **项目识别** — 自动判定纯 MCP / 纯 Skill / 混合模式 |
| 2 | **Auto-Scaffolding** — Generate missing `smithery.yaml`, `server.json`, `.mdc` rules, Dify workflows | **自动补全** — 生成缺失的配置文件 |
| 3 | **Testing & Audit** — Run `npm test` / `pytest` + dry-run security check | **测试校验** — 运行单元测试 + 打包安全审计 |
| 4 | **Publishing** — NPM, Smithery.ai, Anthropic Registry, GitHub Releases | **全网发布** — 推送至 NPM 及各注册中心 |

## MCP vs Skill Publishing / 发布渠道区别

| | MCP Server | Agent Skill |
|---|---|---|
| **分发渠道** | NPM + Smithery + Anthropic Registry + Glama + mcp.so | GitHub Release + `npx skills add` |
| **一键安装** | `npx <package-name>` | `npx skills add <repo-url>` |
| **版本管理** | `npm version patch` | Git Tag |

---

## License / 开源协议

MIT License
