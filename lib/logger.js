var chalk = require('chalk')
var columnify = require('columnify')
var symbol = require('./symbols')
var PAD = '\n  '

var logger = {
  added: function(task) {
    console.log(chalk.gray(`${PAD}${chalk.green(symbol.add)} added npm-script ${chalk.green(task)}`))
  },
  deleted: function(task) {
    var what = task ? `npm-script ${chalk.green(task)}` : `all npm-scripts`
    console.log(chalk.gray(`${PAD}${chalk.red(symbol.del)} deleted ${what}`))
  },
  notFound: function(task) {
    var what = task ? `npm-script ${chalk.green(task)}` : `npm-scripts`
    console.log(chalk.gray(`${PAD}no ${what} found`))
  },
  noPkgFound: function(pkg) {
    console.log(chalk.gray(`${PAD}no ${chalk.green(pkg)} found`))
  },
  list: function(scripts) {
    console.log(PAD + columnify(scripts, {
      showHeaders: false,
      columnSplitter: '  ',
      dataTransform: function(cell, column) {
        return column.name === 'name' ? chalk.green(cell) : cell
      }
    }).replace(/\n/g, PAD))
  }
}

module.exports = logger
