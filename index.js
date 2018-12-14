const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const repo = require('./lib/repo');
const inquirer = require('./lib/inquirer');

const argv = require('minimist')(process.argv.slice(2));

clear();

console.log(chalk.yellow(figlet.textSync('bna-template-cli', { horizontalLayout: 'full' })));

const run = async () => {
  let moduleName = null;

  if (argv.module !== undefined && argv.module !== null) moduleName = argv.module;
  if (argv.m !== undefined && argv.m !== null) moduleName = argv.m;

  if (moduleName === null) {
    const result = await inquirer.askModuleName();
    moduleName = result.moduleName;
  }

  if (moduleName !== undefined && moduleName !== null) {
    console.log(chalk.green(`Creating new BNA module: ${moduleName}`));

    if (!files.directoryExists(moduleName)) {
      await repo.downloadArchive();
      await repo.unpackArchive(moduleName);
      repo.clearArchive();
    } else {
      console.log(chalk.magenta(`Module: ${moduleName} already exists.`));
    }
  } else {
    console.log(chalk.magenta('Module not defined'));
  }
};

run();
