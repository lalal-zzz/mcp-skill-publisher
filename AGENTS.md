# AGENTS.md — mcp-skill-publisher

## Project Overview

`mcp-skill-publisher` is an All-in-One CLI tool for publishing MCP (Model Context Protocol) servers and Agent Skills to multiple registries. It auto-detects project type and handles dual-track publishing: MCP to NPM/Smithery/Anthropic Registry/Glama, and Skills to Cursor Rules/Dify/GitHub Releases.

## Environment

- **Node.js**: >= 18.0.0
- **Python**: >= 3.10 (for Python-based MCP servers being published)
- **npm**: >= 9.0.0

## Architecture

```
bin/cli.js          → CLI entry (commander-based)
src/index.js        → Orchestrator: detect type, bump version, route to tracks
src/publish_mcp.js  → MCP track: NPM → Smithery → Official Registry → Glama/mcp.so
src/publish_skill.js → Skill track: .md → .mdc + Dify YAML → GitHub Release
templates/          → Auto-fill config templates for missing files
skills/             → Meta-skills that AI assistants use to drive this tool
```

## Key Design Decisions

1. **Dual-track architecture**: MCP and Skill publishing are separate but orchestrated together
2. **Auto-detection**: No user flags needed — the tool detects what kind of project it's in
3. **Graceful degradation**: If a registry is unreachable, print manual instructions instead of failing
4. **Dry-run first**: All commands support `--dry-run` for safe preview
5. **Template auto-fill**: Missing config files are generated from templates before publishing

## Naming Conventions

- Files: `snake_case.js`
- Functions: `camelCase`
- CLI commands: `kebab-case`
- Template variables: `{{UPPER_SNAKE_CASE}}`

## Do Not

- Do NOT use ES module syntax (`import`/`export`) — the CLI entry needs CommonJS for broad compatibility
- Do NOT fail hard on registry sync errors — print manual instructions instead
- Do NOT hardcode credentials or tokens
- Do NOT modify files outside the project root
- Do NOT run `npm publish` without `--access public`

## Common Tasks

### Add a new registry target
1. Create a `syncTo<Name>()` function in `src/publish_mcp.js`
2. Add the call step in `publishMCP()`
3. Update the output numbering

### Add a new skill output format
1. Create a `convertTo<Format>()` function in `src/publish_skill.js`
2. Add to the `convert` CLI command's format options
3. Update `publishSkill()` orchestration

### Add a new template
1. Create `templates/<name>.tpl`
2. Use `{{VARIABLE}}` placeholders
3. Add the auto-fill logic in `src/index.js → ensureConfigFiles()`
