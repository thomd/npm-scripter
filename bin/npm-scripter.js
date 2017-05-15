#!/usr/bin/env node

var cli = require('commander')
var fs = require('fs')
var editor = require('editor')
var tempfile = require('tempfile')
var scripter = require('../lib/scripter')
var logger = require('../lib/logger')
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
        logger.deleted(task)
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
          logger.added(task)
        })
        return
      }

      // npm-scripter task
      var scripts = scripter.list(PKG, task)
      if(scripts.length === 0) {
        logger.notFound(task)
      } else {
        scripts.forEach(logger.listScript)
      }

    } else {

      // npm-scripter task command -e
      if(cli.edit) {
        var tmpfile = tempfile()
        fs.writeFileSync(tmpfile, code)
        editor(tmpfile, function(ret) {
          ret === 0 && scripter.add(PKG, task, fs.readFileSync(tmpfile, 'utf-8'))
          logger.added(task)
        })
        return
      }

      // npm-scripter task command
      scripter.add(PKG, task, code)
      logger.added(task)
    }
  })

cli.on('--help', () => {
  var examples = `
  Examples:

    list all npm-scritps:

      > npm-scripter

    create npm-script 'foo':

      > npm-scripter foo 'echo -n "foobar"'

    create npm-script 'foo' in $EDITOR:

      > npm-scripter foo -e

    delete npm-script 'foo':

      > npm-scripter foo -d
`
  console.log(examples)
})

cli.parse(process.argv)

if(!action) {
  if(cli.delete) {
    // npm-scripter -d
    scripter.remove(PKG)
    logger.deleted()
  } else {
    // npm-scripter
    var scripts = scripter.list(PKG)
    if(scripts.length === 0) {
      logger.notFound()
    } else {
      scripts.forEach(logger.listScript)
    }
  }
}

