const chalk = require('chalk')
const columnify = require('columnify')
const symbol = require('./symbols')

const PAD = '\n  '

// Calculate available screen width of commands-column
const commandsColumnWidth = function (scripts) {
  const terminalWidth = process.stdout.columns
  const nameColumnWidth = scripts.reduce((width, script) => {
    const length = script.name.length
    return length > width ? length : width
  }, 0)
  return terminalWidth - nameColumnWidth - 8
}

const logger = {
  added(task) {
    console.log(chalk.gray(`${PAD}${chalk.green(symbol.add)} added npm-script ${chalk.green(task)}`))
  },
  deleted(task) {
    const what = task ? `npm-script ${chalk.green(task)}` : `all npm-scripts`
    console.log(chalk.gray(`${PAD}${chalk.red(symbol.del)} deleted ${what}`))
  },
  renamed(oldTask, newTask) {
    console.log(chalk.gray(`${PAD}${chalk.green(symbol.add)} renamed npm-script ${chalk.green(oldTask)} to ${chalk.green(newTask)}`))
  },
  targetExist(task) {
    console.log(chalk.gray(`${PAD}${chalk.yellow(symbol.warning)} npm-script ${chalk.green(task)} already exist!`))
  },
  sourceMissing(task) {
    console.log(chalk.gray(`${PAD}${chalk.yellow(symbol.warning)} npm-script ${chalk.green(task)} does not exist`))
  },
  notFound(task) {
    const what = task ? `npm-script ${chalk.green(task)}` : `npm-scripts`
    console.log(chalk.gray(`${PAD}no ${what} found`))
  },
  noPkgFound(pkg) {
    console.log(chalk.gray(`${PAD}no ${chalk.green(pkg)} found`))
  },
  list(scripts, truncate) {
    console.log(PAD + columnify(scripts, {
      showHeaders: false,
      maxWidth: truncate ? commandsColumnWidth(scripts) : Infinity,
      truncate: Boolean(truncate),
      truncateMarker: chalk.red(' ...'),
      columnSplitter: '  ',
      dataTransform(cell, column) {
        return column.name === 'name' ? chalk.green(cell) : cell
      }
    }).replace(/\n/g, PAD))
  }
}

module.exports = logger
