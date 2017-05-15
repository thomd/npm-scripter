var chalk = require('chalk')
var symbol = require('./symbols')

var logger = {
  added: function(task) {
    console.log(chalk.gray(`\n  ${chalk.green(symbol.add)} added npm-script ${chalk.underline(task)}`))
  },
  deleted: function(task) {
    var what = task ? `npm-script ${chalk.underline(task)}` : `all npm-scripts`
    console.log(chalk.gray(`\n  ${chalk.red(symbol.del)} deleted ${what}`))
  },
  notFound: function(task) {
    var what = task ? `npm-script ${chalk.underline(task)}` : `npm-scripts`
    console.log(chalk.gray(`\n  no ${what} found`))
  },
  listScript: function(script, num) {
    num === 0 && console.log('')
    console.log(`  ${chalk.gray(`(${num + 1})`)} ${chalk.underline(script.name)}: ${script.code}`)
  }
}

module.exports = logger
