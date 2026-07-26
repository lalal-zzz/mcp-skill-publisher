---
name: init
description: Scaffold a new MCP server or Agent Skill project with best-practice templates
always_apply: false
---

# /skill:init — Project Scaffolding Generator

Initialize a new MCP server, Agent Skill, or hybrid project with all required configuration files and best-practice structure.

## Activation

Use this skill when the user says:
- `/skill:init`
- "create a new MCP project"
- "scaffold a new skill"
- "initialize project"

## Standard Operating Procedure (SOP)

### Step 1: Gather Requirements
Ask the user:
1. Project name?
2. Project type: `mcp`, `skill`, or `hybrid`?
3. Runtime: Node.js or Python?
4. Brief description (for package.json / README)

### Step 2: Generate Directory Structure

**For MCP projects:**
```
project-name/
├── src/
│   └── index.js          (or main.py)
├── bin/
│   └── cli.js            (for npx support)
├── package.json          (or pyproject.toml)
├── smithery.yaml
├── server.json
└── README.md
```

**For Skill projects:**
```
project-name/
├── skills/
│   └── main.md
├── .cursor/
│   └── rules/
│       └── main.mdc
├── dify_workflow.yml
└── README.md
```

### Step 3: Fill Templates
- Use `templates/package.json.tpl` → generate package.json
- Use `templates/smithery.yaml.tpl` → generate smithery.yaml
- Use `templates/server.json.tpl` → generate server.json
- Use `templates/cursor_rule.mdc.tpl` → generate Cursor rule

### Step 4: Write README
Generate README with:
- Badges (npm, license)
- Installation instructions
- Usage examples
- Claude Desktop config snippet

### Step 5: Initialize Git
```bash
git init
git add -A
git commit -m "Initial commit — project scaffolded by mcp-skill-publisher"
```

## Template Variables

| Variable | Source |
|----------|--------|
| `{{PROJECT_NAME}}` | User input |
| `{{PROJECT_DESCRIPTION}}` | User input |
| `{{AUTHOR}}` | `git config user.name` |
| `{{YEAR}}` | Current year |
