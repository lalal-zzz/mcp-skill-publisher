# mcp-skill-deployer

> One-stop MCP & Skill quality auditor, optimizer, and multi-platform publisher

## About This Agent

This agent covers the full lifecycle of your MCP server or Agent Skill project:

- **🔍 Audit** — Compliance gates + a 100-point quality scorecard (tool naming, descriptions, schemas, error handling, token efficiency for MCP; description triggerability, executable instructions, trigger boundaries, confirmation gates for Skills) with A/B/C/D grading
- **🛠 Optimize** — Item-by-item fixes with diff previews, applied only after your confirmation, then re-scored so you see the before/after improvement
- **🚀 Publish** — Export to 9 platforms and publish with per-step confirmation:
  - **NPM** - For MCP server packages
  - **Smithery.ai** - MCP registry
  - **Anthropic Official Registry** - MCP registry
  - **cursor.directory** - Cursor rules marketplace
  - **Dify Marketplace** - No-code AI workflow platform
  - **OpenAI GPT Store** - Custom GPT publishing
  - **Coze Store** - 扣子 bot marketplace
  - **FlowGPT / PromptBase** - Prompt & skill communities
  - **GitHub Awesome Lists** - Open-source discovery

## How to Use

Pick your mode by just saying what you want:

- Audit only: "Score my MCP server" / "What's wrong with my skill?"
- Optimize: "Fix the issues in my skill"
- Full publish: "Help me inspect, package, and publish my project to the world!"

The agent will:
1. Run pre-flight compliance checks (git, secret scan, package.json, SKILL.md)
2. Auto-detect your project type (MCP / Skill / hybrid)
3. Score your project on a 100-point quality checklist with prioritized fixes
4. Optimize item by item (with your confirmation), then re-score
5. Auto-generate all 9 platform-specific files
6. Run tests and security audits
7. Ask for confirmation before each publish/push, then execute NPM, Smithery, GitHub publishing — and give you ready-to-submit files for all other platforms

## Interaction Guide

**Try these prompts:**

- "Score my MCP server and tell me what to improve"
- "Optimize my skill's description so agents trigger it correctly"
- "Check and publish my MCP server"
- "Export my skill to all platforms"
- "Generate Cursor rules and Dify workflow for my skill"
- "Package everything and give me the GPT Store instructions"

The agent will produce a graded audit report and ready-to-use files for every platform.
