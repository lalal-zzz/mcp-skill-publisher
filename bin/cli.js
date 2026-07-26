#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

const program = new Command();

program
  .name('mcp-skill-publisher')
  .description('All-in-One Publisher for MCP Servers & Agent Skills')
  .version(require('../package.json').version);

program
  .command('publish')
  .description('Auto-detect project type and publish to all registries')
  .option('-d, --dry-run', 'Run without actually publishing')
  .option('-s, --scope <type>', 'Force publish scope: mcp, skill, or both')
  .action(async (options) => {
    const index = require('../src/index');
    await index.runPublish(options);
  });

program
  .command('init')
  .description('Initialize a new MCP/Skill project with scaffolding')
  .option('-t, --type <type>', 'Project type: mcp, skill, or hybrid')
  .option('-n, --name <name>', 'Project name')
  .action(async (options) => {
    const index = require('../src/index');
    await index.runInit(options);
  });

program
  .command('check')
  .description('Validate project before publishing')
  .action(async () => {
    const index = require('../src/index');
    await index.runCheck();
  });

program
  .command('convert')
  .description('Convert Markdown Skills to Cursor Rules / Dify YAML')
  .option('-i, --input <path>', 'Input markdown skill file')
  .option('-f, --format <type>', 'Output format: cursor, dify, or both')
  .action(async (options) => {
    const skill = require('../src/publish_skill');
    await skill.convertSkill(options);
  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

program.parse(process.argv);
