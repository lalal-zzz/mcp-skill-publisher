# 🚀 mcp-skill-publisher

**MCP 服务器 & Agent Skill 一站式发布与注册中心同步工具。**

自动将 MCP 发布到 **NPM**、**Smithery.ai**、**Anthropic 官方注册表** & **Glama/mcp.so**，同时将 Markdown 技能转换为 **Cursor Rules (.mdc)** & **Dify 工作流** — 只需一条 CLI 命令或 AI 斜杠指令（`/skill:deploy`）。

---

## 快速开始

```bash
npx mcp-skill-publisher publish
```

就这么简单。工具会自动检测你的项目是 MCP 服务器、Agent Skill 还是两者混合 — 并发布到所有相关注册中心。

---

## 安装

```bash
npm install -g mcp-skill-publisher
```

或无需安装直接使用：

```bash
npx mcp-skill-publisher <command>
```

---

## 命令

| 命令 | 描述 |
|---------|-------------|
| `publish` | 自动检测并发布到所有注册中心 |
| `publish --dry-run` | 预览模式，不实际发布 |
| `publish --scope mcp` | 强制仅发布 MCP 轨道 |
| `publish --scope skill` | 强制仅发布 Skill 轨道 |
| `init -t mcp -n my-server` | 脚手架新建 MCP 项目 |
| `init -t skill -n my-skill` | 脚手架新建 Skill 项目 |
| `check` | 发布前健康检查 |
| `convert -i skill.md -f cursor` | 将 Markdown 转换为 Cursor Rule |
| `convert -i skill.md -f dify` | 将 Markdown 转换为 Dify YAML |

---

## 工作原理

```text
npx mcp-skill-publisher publish
          │
          ▼
  ┌──────────────────┐
  │ 1. 检测项目类型   │ ← 自动识别 MCP / Skill / 混合
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ 2. 版本号 & 构建  │ ← npm version patch，自动补全缺失配置
  └────────┬─────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
  ┌──────┐  ┌──────┐
  │ MCP  │  │Skill │  ← 双轨道并行发布
  └──┬───┘  └──┬───┘
     │         │
     ▼         ▼
  NPM         Cursor Rules (.mdc)
  Smithery    Dify YAML
  Anthropic   GitHub Release
  Glama/mcp.so
```

---

## 支持的注册中心与目标

### MCP 发布轨道

| 目标 | 提交方式 |
|--------|--------|
| **NPM** | `npm publish --access public` |
| **Smithery.ai** | `npx @smithery/cli mcp publish` |
| **Anthropic 官方** | `npx @modelcontextprotocol/registry-cli publish` |
| **Glama.ai** | 通过 NPM 自动索引 |
| **mcp.so** | 通过 NPM 自动索引 |

### Skill 发布轨道

| 目标 | 提交方式 |
|--------|--------|
| **Cursor Rules** | 自动导出到 `.cursor/rules/*.mdc` |
| **Dify 工作流** | 自动导出到 `dify_workflow.yml` |
| **Coze 插件** | 导出兼容 YAML 格式 |
| **GitHub Releases** | 自动打 Tag + 打包技能文件 |

---

## AI 斜杠指令（Meta-Skills）

本工具内置了可供 AI 助手（Claude、Cursor）驱动的 Meta-Skills：

| 指令 | Skill 文件 | 描述 |
|---------|------------|-------------|
| `/skill:deploy` | `skills/deploy_pipeline.md` | 一键全流程部署管线 |
| `/skill:init` | `skills/init_project.md` | 项目脚手架生成器 |
| `/skill:check` | `skills/check_health.md` | 发布前健康检查 |

---

## 用户安装指南（发布后自动生成）

### Claude Desktop

```json
{
  "mcpServers": {
    "your-server-name": {
      "command": "npx",
      "args": ["-y", "your-server-name"]
    }
  }
}
```

### Cursor

```
将 .cursor/rules/*.mdc 复制到你项目的 .cursor/rules/ 目录
```

### Dify

```
通过 Dify Studio → 导入 DSL 导入 dify_workflow.yml
```

---

## 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**（用于 GitHub Releases）

---

## 许可证

MIT © [lalal-zzz](https://github.com/lalal-zzz)
