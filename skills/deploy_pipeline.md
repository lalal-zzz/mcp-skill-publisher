---
name: deploy
description: One-click full deployment pipeline for MCP servers and Agent skills
always_apply: false
---

# /skill:deploy — All-in-One Deploy Pipeline

This skill orchestrates the complete publication workflow for MCP servers and Agent Skills.

## Activation

Use this skill when the user says:
- `/skill:deploy`
- "deploy my project"
- "publish to all registries"
- "release my MCP server"

## Standard Operating Procedure (SOP)

### Phase 1: Environment & Code Check
1. Run tests (`npm test` or `pytest`)
2. Verify Node.js >= 18 or Python >= 3.10
3. Auto-detect project type (MCP, Skill, or Hybrid)
4. Check for missing config files and auto-generate from templates

### Phase 2: Version & Build
1. Increment patch version (`npm version patch`)
2. Run build step if configured
3. Verify all required files exist in package

### Phase 3: Dual-Track Publish

**MCP Track (if detected):**
1. Publish to NPM Registry → `npm publish --access public`
2. Sync to Smithery.ai → `npx @smithery/cli mcp publish`
3. Sync to Anthropic Official Registry → `npx @modelcontextprotocol/registry-cli publish`
4. Notify Glama.ai & mcp.so (auto-indexed via NPM)

**Skill Track (if detected):**
1. Convert Markdown Skills to Cursor Rules (.mdc)
2. Export Dify Workflow YAML
3. Create GitHub Release with packaged skills

### Phase 4: Generate User Installation Guide
1. Output Claude Desktop JSON config snippet
2. Output Cursor Rules install instructions
3. Output Dify import instructions
4. List all registry URLs

## Error Handling

- If NPM publish fails → check auth token (`npm login`)
- If Smithery sync fails → provide manual submission URL
- If Official Registry fails → link to PR template
- If Git tag fails → provide manual release instructions

## Post-Publish Checklist

- [ ] Verify NPM package appears at npmjs.com
- [ ] Check Smithery listing is live
- [ ] Verify GitHub release has correct assets
- [ ] Test `npx -y <package-name>` works end-to-end
