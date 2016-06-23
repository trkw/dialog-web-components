const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const chalk = require('chalk');
const inquirer = require('inquirer');

const info = (message) => console.error(chalk.cyan(message));
const warning = (message) => console.error(chalk.yellow(message));
const error = (message) => console.error(chalk.red(message));

const questions = [
  {
    name: 'name',
    message: 'Component name',
    validate(value) {
      const valid = /^[A-Z][a-zA-Z]+$/.test(value);
      return valid || 'Component name should match /^[A-Z][a-zA-Z]+$/';
    }
  },
  {
    name: 'styles',
    type: 'confirm',
    message: 'With styles?',
    default: true
  }
];

function mkdir(dirName) {
  try {
    fs.mkdirSync(dirName);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}

const src = path.resolve(__dirname, '../src/components');
const templates = path.resolve(__dirname, 'templates');

function render(options, template, out) {
  const input = path.join(templates, template);
  const output = path.join(src, options.name, out);

  const code = ejs.render(fs.readFileSync(input, 'utf8'), options);
  fs.writeFileSync(output, code);
}

inquirer.prompt(questions).then((options) => {
  const dirName = path.join(src, options.name);

  try {
    fs.mkdirSync(dirName);
  } catch (e) {
    if (e.code === 'EEXIST') {
      warning(`Component ${options.name} already exists!`);
      return;
    }

    throw e;
  }

  render(options, 'README.md', 'README.md');
  render(options, 'package.json', 'package.json');
  render(options, 'Component.js', `${options.name}.js`);
  if (options.styles) {
    render(options, 'Component.css', `${options.name}.css`);
  }

  info(`Component ${options.name} successfully created!`);
}).catch((error) => {
  error(chalk.red(error));
});