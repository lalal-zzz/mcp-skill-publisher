const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

async function publishToNPM(projectRoot, options) {
  const spinner = ora('Publishing to NPM...').start();
  const pkgPath = path.join(projectRoot, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    spinner.warn('No package.json found — skipping NPM publish');
    return false;
  }

  if (options.dryRun) {
    spinner.info('[dry-run] Would execute: npm publish --access public');
    return true;
  }

  try {
    execSync('npm publish --access public', {
      cwd: projectRoot,
      stdio: 'pipe',
      env: { ...process.env }
    });
    spinner.succeed('Published to NPM registry');
    return true;
  } catch (err) {
    spinner.fail(`NPM publish failed: ${err.message}`);
    return false;
  }
}

async function syncToSmithery(projectRoot, options) {
  const spinner = ora('Syncing to Smithery.ai...').start();
  const smitheryPath = path.join(projectRoot, 'smithery.yaml');

  if (!fs.existsSync(smitheryPath)) {
    spinner.warn('No smithery.yaml found — skipping Smithery sync');
    return false;
  }

  if (options.dryRun) {
    spinner.info('[dry-run] Would execute: npx @smithery/cli mcp publish');
    return true;
  }

  try {
    execSync('npx @smithery/cli mcp publish', {
      cwd: projectRoot,
      stdio: 'pipe',
      env: { ...process.env }
    });
    spinner.succeed('Synced to Smithery.ai');
    return true;
  } catch {
    const config = fs.readFileSync(smitheryPath, 'utf8');
    const nameMatch = config.match(/name:\s*(\S+)/);
    const name = nameMatch ? nameMatch[1] : path.basename(projectRoot);

    spinner.info(
      `Manual: Submit at https://smithery.ai/servers/new (server: ${name})`
    );
    return false;
  }
}

async function syncToOfficialRegistry(projectRoot, options) {
  const spinner = ora('Syncing to Anthropic Official Registry...').start();
  const serverPath = path.join(projectRoot, 'server.json');

  if (!fs.existsSync(serverPath)) {
    spinner.warn('No server.json found — skipping Official Registry sync');
    return false;
  }

  if (options.dryRun) {
    spinner.info('[dry-run] Would execute: npx @modelcontextprotocol/registry-cli publish');
    return true;
  }

  try {
    execSync('npx @modelcontextprotocol/registry-cli publish', {
      cwd: projectRoot,
      stdio: 'pipe',
      env: { ...process.env }
    });
    spinner.succeed('Synced to Official MCP Registry');
    return true;
  } catch {
    spinner.info(
      'Manual: Submit at https://github.com/modelcontextprotocol/servers (PR with server.json)'
    );
    return false;
  }
}

async function syncToGlama(projectRoot, options) {
  const spinner = ora('Syncing to Glama.ai & mcp.so...').start();
  const pkgPath = path.join(projectRoot, 'package.json');

  let name = path.basename(projectRoot);
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);
    name = pkg.name || name;
  }

  if (options.dryRun) {
    spinner.info(`[dry-run] Would notify Glama & mcp.so about ${name}`);
    return true;
  }

  spinner.info(
    `Indexers auto-discover NPM packages. Glama: https://glama.ai/mcp/servers/${name}  |  mcp.so: https://mcp.so/servers/${name}`
  );
  return true;
}

async function publishMCP(projectRoot, options = {}) {
  console.log(chalk.dim('  [1/4] NPM Registry'));
  const npmOk = await publishToNPM(projectRoot, options);

  console.log(chalk.dim('  [2/4] Smithery.ai'));
  await syncToSmithery(projectRoot, options);

  console.log(chalk.dim('  [3/4] Anthropic Official Registry'));
  await syncToOfficialRegistry(projectRoot, options);

  console.log(chalk.dim('  [4/4] Glama.ai & mcp.so'));
  await syncToGlama(projectRoot, options);

  return npmOk;
}

module.exports = { publishMCP, publishToNPM, syncToSmithery, syncToOfficialRegistry, syncToGlama };
