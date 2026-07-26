# 🚀 mcp-skill-publisher

**All-in-One Publisher & Registry Sync Tool for MCP Servers & Agent Skills.**

Auto-publish MCPs to **NPM**, **Smithery.ai**, **Anthropic Official Registry** & **Glama/mcp.so**, while converting Markdown Skills to **Cursor Rules (.mdc)** & **Dify workflows** — all via a single CLI command or AI slash command (`/skill:deploy`).

---

## Quick Start

```bash
npx mcp-skill-publisher publish
```

That's it. The tool auto-detects whether your project is an MCP server, an Agent Skill, or both — and publishes to every relevant registry.

---

## Installation

```bash
npm install -g mcp-skill-publisher
```

Or use without installing:

```bash
npx mcp-skill-publisher <command>
```

---

## Commands

| Command | Description |
|---------|-------------|
| `publish` | Auto-detect & publish to all registries |
| `publish --dry-run` | Preview without actually publishing |
| `publish --scope mcp` | Force MCP-only publish track |
| `publish --scope skill` | Force Skill-only publish track |
| `init -t mcp -n my-server` | Scaffold a new MCP project |
| `init -t skill -n my-skill` | Scaffold a new Skill project |
| `check` | Pre-publish health validation |
| `convert -i skill.md -f cursor` | Convert Markdown to Cursor Rule |
| `convert -i skill.md -f dify` | Convert Markdown to Dify YAML |

---

## How It Works

```
npx mcp-skill-publisher publish
          │
          ▼
  ┌──────────────────┐
  │ 1. Detect Type   │ ← Auto-detect MCP / Skill / Hybrid
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ 2. Version & Build│ ← npm version patch, auto-fill missing configs
  └────────┬─────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
  ┌──────┐  ┌──────┐
  │ MCP  │  │Skill │  ← Dual-track parallel publish
  └──┬───┘  └──┬───┘
     │         │
     ▼         ▼
  NPM        Cursor Rules (.mdc)
  Smithery   Dify YAML
  Anthropic  GitHub Release
  Glama/mcp.so
```

---

## Supported Registries & Targets

### MCP Track

| Target | Method |
|--------|--------|
| **NPM** | `npm publish --access public` |
| **Smithery.ai** | `npx @smithery/cli mcp publish` |
| **Anthropic Official** | `npx @modelcontextprotocol/registry-cli publish` |
| **Glama.ai** | Auto-indexed via NPM |
| **mcp.so** | Auto-indexed via NPM |

### Skill Track

| Target | Method |
|--------|--------|
| **Cursor Rules** | Auto-export to `.cursor/rules/*.mdc` |
| **Dify Workflow** | Auto-export to `dify_workflow.yml` |
| **Coze Plugin** | Export compatible YAML |
| **GitHub Releases** | Auto-tag + package skills |

---

## AI Slash Commands (Meta-Skills)

This tool comes with built-in Meta-Skills that AI assistants (Claude, Cursor) can use:

| Command | Skill File | Description |
|---------|------------|-------------|
| `/skill:deploy` | `skills/deploy_pipeline.md` | One-click full deployment pipeline |
| `/skill:init` | `skills/init_project.md` | Project scaffolding generator |
| `/skill:check` | `skills/check_health.md` | Pre-publish health validation |

---

## User Installation Guide (Auto-Generated)

After publishing, your users get this config snippet:

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
Copy .cursor/rules/*.mdc to your project's .cursor/rules/ directory
```

### Dify

```
Import dify_workflow.yml via Dify Studio → Import DSL
```

---

## Requirements

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** (for GitHub Releases)

---

## License

MIT © [lalal-zzz](https://github.com/lalal-zzz)
