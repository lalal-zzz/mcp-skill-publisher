---
name: check
description: Pre-publish validation: syntax, config, and interface health checks
always_apply: false
---

# /skill:check — Pre-Publish Health Check

Validate an MCP server or Agent Skill project before publishing to catch common issues early.

## Activation

Use this skill when the user says:
- `/skill:check`
- "check my project"
- "validate before publish"
- "is my project ready?"

## Standard Operating Procedure (SOP)

### Phase 1: Environment Check
- [ ] Node.js >= 18 (if JS project)
- [ ] Python >= 3.10 (if Python project)
- [ ] `npm` / `pip` available
- [ ] Git repository initialized

### Phase 2: MCP Configuration Checks
- [ ] `package.json` exists and is valid JSON
- [ ] `smithery.yaml` exists with required fields (name, build)
- [ ] `server.json` exists with required fields (name, command, args)
- [ ] Entry point file exists (as specified in package.json main/bin)
- [ ] All `dependencies` are resolvable

#### package.json Required Fields
```json
{
  "name": "required — must be npm-valid package name",
  "version": "required — semver format",
  "main": "required — entry point file exists",
  "bin": "optional — for npx support"
}
```

#### smithery.yaml Required Fields
```yaml
name: required
build:
  command: required
  runtime: required (node | python)
```

#### server.json Required Fields
```json
{
  "name": "required",
  "command": "required (npx | python | node)",
  "args": "required — array of strings"
}
```

### Phase 3: Skill Checks
- [ ] `skills/` directory exists
- [ ] At least one `.md` file in `skills/`
- [ ] All `.md` files parse without errors
- [ ] Frontmatter is valid YAML (if present)
- [ ] `.cursor/rules/` directory contains `.mdc` files (if converted)

### Phase 4: Integration Tests
- [ ] `npm test` passes (if test script exists)
- [ ] `npx -y <package-name>` runs successfully
- [ ] `npm pack` produces correct file list

### Phase 5: Security Scan
- [ ] No hardcoded API keys or secrets
- [ ] No `.env` files committed
- [ ] `.gitignore` covers `node_modules/`, `.env`, `dist/`

## Error Severity Levels

| Level | Icon | Description |
|-------|------|-------------|
| ERROR | 🔴 | Must fix before publish |
| WARN | 🟡 | Should fix — may cause issues |
| INFO | 🔵 | Recommendation only |

## Output Format

```
🔍 Health Check Report — my-mcp-server
========================================
✅ Node.js v20.11.0 (>= 18 required)
✅ package.json — valid
🟡 smithery.yaml — missing (auto-gen available)
✅ server.json — valid
✅ Entry point src/index.js exists
✅ npm test passed (3/3)
🔴 Unresolved dependency: express
---
Result: 1 error, 1 warning
Status: NOT READY for publish
```
