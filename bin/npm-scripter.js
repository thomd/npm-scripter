#!/usr/bin/env node

var cli = require('commander')
var chalk = require('chalk')
var fs = require('fs')
var editor = require('editor')
var tempfile = require('tempfile')
var scripter = require('../lib/scripter')
var symbol = require('../lib/symbols')
var pkg = require('../package.json')

var PKG = 'package.json'
var action = false

cli
  .version(pkg.version)
  .option('-d, --delete', 'delete npm-script')
  .option('-e, --edit', `edit npm-script in ${process.env.EDITOR} (the code part)`)
  .arguments('[task] [code]')
  .action((task, code) => {
    action = true

    if(!code) {

      // npm-scripter task -d
      if(cli.delete) {
        scripter.remove(PKG, task)
        console.log(chalk.gray(`\n  ${chalk.red(symbol.del)} deleted npm-script ${chalk.underline(task)}`))
        return
      }

      // npm-scripter task -e
      if(cli.edit) {
        var tmpfile = tempfile()
        var script = scripter.list(PKG, task).shift()
        if(script) {
          fs.writeFileSync(tmpfile, script.code)
        }
        editor(tmpfile, function(ret) {
          ret === 0 && scripter.add(PKG, task, fs.readFileSync(tmpfile, 'utf-8'))
          console.log(chalk.gray(`\n  ${chalk.green(symbol.add)} added npm-script ${chalk.underline(task)}`))
        })
        return
      }

      // npm-scripter task
      var scripts = scripter.list(PKG, task)
      if(scripts.length == 0) {
        console.log(chalk.gray(`\n  npm-script ${chalk.underline(task)} not found`))
      } else {
        scripts.forEach(script => console.log(`\n  ${chalk.underline(script.name)}: ${script.code}`))
      }

    } else {

      // npm-scripter task command -e
      if(cli.edit) {
        var tmpfile = tempfile()
        fs.writeFileSync(tmpfile, code)
        editor(tmpfile, function(ret) {
          ret === 0 && scripter.add(PKG, task, fs.readFileSync(tmpfile, 'utf-8'))
          console.log(chalk.gray(`\n  ${chalk.green(symbol.add)} added npm-script ${chalk.underline(task)}`))
        })
      }

      // npm-scripter task command
      scripter.add(PKG, task, code)
      console.log(chalk.gray(`\n  ${chalk.green(symbol.add)} added npm-script ${chalk.underline(task)}`))
    }
  })

cli.on('--help', () => {
  var examples = `
  Examples:

    list all npm-scritps:

      > npm-scripter

    create npm-scritp 'foo':

      > npm-scripter foo 'echo -n "foobar"'
`
  console.log(examples)
})

cli.parse(process.argv)

if(!action) {
  if(cli.delete) {
    // npm-scripter -d
    scripter.remove(PKG)
    console.log(chalk.gray(`\n  ${chalk.red(symbol.del)} deleted all npm-scripts`))
  } else {
    // npm-scripter
    var scripts = scripter.list(PKG)
    if(scripts.length == 0) {
      console.log(chalk.gray(`\n  ${chalk.red(symbol.del)} no npm-scripts`))
    } else {
      console.log('')
      scripts.forEach(script => console.log(`  ${chalk.underline(script.name)}: ${script.code}`))
    }
  }
}

