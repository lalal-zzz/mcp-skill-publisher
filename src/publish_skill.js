const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };

  const fm = {};
  match[1].split('\n').forEach(line => {
    const kv = line.match(/^(\w[\w\s]*?):\s*(.*)/);
    if (kv) {
      const key = kv[1].trim().toLowerCase().replace(/\s+/g, '_');
      fm[key] = kv[2].trim();
    }
  });

  return { frontmatter: fm, body: content.slice(match[0].length).trim() };
}

async function convertToCursorRule(mdFilePath, outputDir, options = {}) {
  const spinner = ora('Converting to Cursor Rule (.mdc)...').start();

  const content = fs.readFileSync(mdFilePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);

  const name = frontmatter.name || path.basename(mdFilePath, '.md');
  const description = frontmatter.description || `${name} — AI Agent Skill`;

  const ruleDir = outputDir || path.join(options.projectRoot || process.cwd(), '.cursor', 'rules');
  fs.ensureDirSync(ruleDir);

  const mdcContent = `---
description: "${description}"
globs: ["**/*"]
alwaysApply: ${frontmatter.always_apply || 'false'}
---

${body}`;

  const outPath = path.join(ruleDir, `${name.replace(/\s+/g, '-').toLowerCase()}.mdc`);
  fs.writeFileSync(outPath, mdcContent);
  spinner.succeed(`Cursor Rule created: ${outPath}`);
  return outPath;
}

async function convertToDifyYAML(mdFilePath, outputDir, options = {}) {
  const spinner = ora('Converting to Dify Workflow YAML...').start();

  const content = fs.readFileSync(mdFilePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);

  const name = frontmatter.name || path.basename(mdFilePath, '.md');
  const description = frontmatter.description || `${name} — AI Agent Skill`;

  const difyYml = {
    app: {
      name: name,
      description: description,
      icon: '🤖',
      mode: 'advanced-chat'
    },
    kind: 'app',
    version: '0.1.0',
    workflow: {
      graph: {
        nodes: [
          {
            id: 'start',
            type: 'start',
            data: {
              title: 'Start',
              type: 'start',
              variables: [
                {
                  variable: 'user_query',
                  label: 'User Query',
                  type: 'text-input',
                  required: true
                }
              ]
            }
          },
          {
            id: 'llm',
            type: 'llm',
            data: {
              title: 'Skill Execution',
              model: {
                provider: 'openai',
                name: 'gpt-4',
                mode: 'chat'
              },
              prompt_template: [
                {
                  role: 'system',
                  text: body
                }
              ]
            }
          },
          {
            id: 'end',
            type: 'end',
            data: {
              title: 'End',
              outputs: [
                {
                  variable: 'result',
                  type: 'llm.text'
                }
              ]
            }
          }
        ],
        edges: [
          { source: 'start', target: 'llm' },
          { source: 'llm', target: 'end' }
        ]
      }
    }
  };

  const outDir = outputDir || options.projectRoot || process.cwd();
  const outPath = path.join(outDir, 'dify_workflow.yml');
  fs.writeFileSync(outPath, yaml.dump(difyYml, { lineWidth: 120, noRefs: true }));
  spinner.succeed(`Dify YAML created: ${outPath}`);
  return outPath;
}

async function createGitHubRelease(projectRoot, options = {}) {
  const spinner = ora('Creating GitHub Release...').start();

  const skillsDir = path.join(projectRoot, 'skills');
  if (!fs.existsSync(skillsDir)) {
    spinner.warn('No skills/ directory — skipping GitHub Release');
    return false;
  }

  const tag = `v${options.version || '1.0.0'}`;

  if (options.dryRun) {
    spinner.info(`[dry-run] Would create tag ${tag} and upload skills package`);
    return true;
  }

  try {
    const { execSync } = require('child_process');
    execSync(`git tag -a "${tag}" -m "Release ${tag}"`, { cwd: projectRoot, stdio: 'pipe' });
    execSync(`git push origin "${tag}"`, { cwd: projectRoot, stdio: 'pipe' });
    spinner.succeed(`Tag ${tag} pushed — GitHub Actions will create the release`);
    return true;
  } catch (err) {
    spinner.info(`Manual: Create release at GitHub with tag ${tag}`);
    return false;
  }
}

async function publishSkill(projectRoot, options = {}) {
  console.log(chalk.dim('  [1/4] Convert to Cursor Rules (.mdc)'));

  const skillsDir = path.join(projectRoot, 'skills');
  const skillFiles = fs.existsSync(skillsDir)
    ? fs.readdirSync(skillsDir).filter(f => f.endsWith('.md')).map(f => path.join(skillsDir, f))
    : [];

  if (skillFiles.length > 0) {
    for (const skillPath of skillFiles) {
      await convertToCursorRule(skillPath, null, { ...options, projectRoot });
    }
  } else {
    const directMDFiles = fs.readdirSync(projectRoot).filter(f => f.endsWith('.md') && f !== 'README.md');
    for (const md of directMDFiles) {
      await convertToCursorRule(path.join(projectRoot, md), null, { ...options, projectRoot });
    }
  }

  console.log(chalk.dim('  [2/4] Export Dify Workflow YAML'));
  const allSkillFiles = [
    ...skillFiles,
    ...fs.readdirSync(projectRoot).filter(f => f.endsWith('.md') && f !== 'README.md' && !skillFiles.includes(f)).map(f => path.join(projectRoot, f))
  ];

  for (const sp of allSkillFiles) {
    try {
      await convertToDifyYAML(sp, null, { ...options, projectRoot });
    } catch {}
  }

  console.log(chalk.dim('  [3/4] Create GitHub Release'));
  await createGitHubRelease(projectRoot, options);

  console.log(chalk.dim('  [4/4] Skill package ready'));
  console.log(chalk.green('  ✓ All skill artifacts generated'));

  return true;
}

async function convertSkill(options) {
  const input = options.input;
  const format = options.format || 'both';
  const projectRoot = process.cwd();

  if (!input || !fs.existsSync(input)) {
    console.error(chalk.red(`File not found: ${input}`));
    process.exit(1);
  }

  if (format === 'cursor' || format === 'both') {
    await convertToCursorRule(input, null, { projectRoot });
  }

  if (format === 'dify' || format === 'both') {
    await convertToDifyYAML(input, null, { projectRoot });
  }
}

module.exports = {
  publishSkill,
  convertSkill,
  convertToCursorRule,
  convertToDifyYAML,
  createGitHubRelease,
  parseFrontmatter
};
