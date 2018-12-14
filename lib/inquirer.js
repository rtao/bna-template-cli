const inquirer = require('inquirer');
const files = require('.//files');

module.exports = {
  askModuleName: () => {
    const questions = [
      {
        name: 'moduleName',
        type: 'input',
        message: 'Enter your new module name:',
        validate: value => {
          if (value.length) return true;
          return 'Please enter your new module name:';
        },
      },
    ];

    return inquirer.prompt(questions);
  },
};
