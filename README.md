# MCP & Skill Deployer

> 一站式 MCP & Skill 体检、优化与全网发布工具

An all-in-one Universal Agent Skill (`SKILL.md`) that **audits, scores, optimizes, and publishes** both **MCP Servers** and **Agent Skills** — from pre-flight compliance checks and quality scoring (100-point checklist) to guided optimization and multi-registry publishing.

**Note:** The repository is named `mcp-skill-publisher` (the tool/project name), while the skill identifier is `mcp-skill-deployer` (the agent skill name). Both refer to the same project — `mcp-skill-deployer` is the skill you invoke in agents; `mcp-skill-publisher` is the repository that ships it.

---

## Installation / 安装

```bash
npx skills add https://github.com/lalal-zzz/mcp-skill-publisher
```

---

## Three Modes / 三种运行模式

| Mode | Say this / 这样说 | What happens |
|------|------------------|--------------|
| 🔍 **Audit / 体检** | "检查一下我的 MCP" / "Score my skill" | Compliance gates + 100-point quality report (read-only) |
| 🛠 **Optimize / 优化** | "帮我优化这个 Skill" / "Fix the issues" | Audit + item-by-item fixes with confirmation & before/after score |
| 🚀 **Publish / 发布** | "帮我检查并发布当前项目" / "Publish everywhere" | Full pipeline: audit → optimize → export 9 formats → test → publish |

Open any MCP or Skill project workspace and ask your AI Agent, or run `/mcp-skill-deployer`.

---

## Quality Scoring / 质量评分

Two dedicated 100-point checklists (10 items × 10 pts):

- **MCP Server**: tool naming & descriptions, parameter schemas, error handling, token-efficient responses, registry metadata (`smithery.yaml` / `server.json`), security design, cold-start runnability…
- **Agent Skill**: description triggerability, progressive disclosure (≤500 lines), executable instructions, trigger boundaries, error branches, confirmation gates, metadata consistency…

Output: `A/B/C/D` grade + prioritized fix list (blockers → high impact → polish).

---

## Automated Pipeline / 自动化工作流

| Step | English | 中文 |
|------|---------|------|
| 0 | **Pre-flight Audit** — `npm whoami`, git status, secret scan, `package.json` / `SKILL.md` compliance | **合规门禁** — NPM 登录、Git 状态、敏感信息扫描、配置合规性 |
| 1 | **Project Inspection** — Auto-detect MCP-only, Skill-only, or hybrid mode | **项目识别** — 自动判定纯 MCP / 纯 Skill / 混合模式 |
| 2 | **Quality Audit** — 100-point scoring with prioritized fix suggestions | **质量体检** — 百分制评分 + 按影响排序的优化建议 |
| 3 | **Optimization** — Item-by-item fixes with diff preview & user confirmation | **逐项优化** — 展示改动预览，确认后修改，前后分数对比 |
| 4 | **Auto-Export** — Generate `smithery.yaml`, `server.json`, `.mdc` rules, Dify workflows & 9 platform formats | **全平台导出** — 生成 9 种平台格式文件 |
| 5 | **Testing & Audit** — Run `npm test` / `pytest` + dry-run security check | **测试校验** — 运行单元测试 + 打包安全审计 |
| 6 | **Publishing** — NPM, Smithery.ai, Anthropic Registry, GitHub Releases (per-step confirmation) | **全网发布** — 逐项确认后推送至 NPM 及各注册中心 |

## MCP vs Skill Publishing / 发布渠道区别

| | MCP Server | Agent Skill |
|---|---|---|
| **分发渠道** | NPM + Smithery + Anthropic Registry + Glama + mcp.so | GitHub Release + `npx skills add` |
| **一键安装** | `npx <package-name>` | `npx skills add <repo-url>` |
| **版本管理** | `npm version patch` | Git Tag |

---

## Security Model / 安全模型

- 所有 `npm publish` / `git push` / 注册表提交操作**逐项确认后执行**，禁止自动批量发布
- 发布前强制敏感信息扫描（API Key、Token、`.env`）
- 多平台商店分发只生成**手工提交指南**，不做自动灌水提交

---

## License / 开源协议

MIT License
