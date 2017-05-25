#!/usr/bin/env node

const fs = require('fs')
const cli = require('commander')
const editor = require('editor')
const tempfile = require('tempfile')
const chalk = require('chalk')
const scripter = require('../lib/scripter')
const logger = require('../lib/logger')
const pkg = require('../package.json')

const PKG = 'package.json'

if (scripter.missing(PKG)) {
  logger.noPkgFound(PKG)
  process.exit(-1)
}

let action = false

cli
  .version(pkg.version)
  .option('-d, --delete', 'delete npm-script')
  .option('-e, --edit', `edit npm-script (the commands part) in ${process.env.EDITOR || '$EDITOR'}`)
  .arguments('[task] [code]')
  .action((task, code) => {
    action = true

    if (code) {
      //
      // ----- npm-scripter task command -e -------------------------------------------------------
      if (cli.edit) {
        const tmpfile = tempfile()
        fs.writeFileSync(tmpfile, code)
        editor(tmpfile, ret => {
          if (ret === 0) {
            scripter.add(PKG, task, fs.readFileSync(tmpfile, 'utf-8'))
          }
          logger.added(task)
        })
        return
      }

      // ----- npm-scripter task command ----------------------------------------------------------
      scripter.add(PKG, task, code)
      logger.added(task)
    } else {
      // ----- npm-scripter task -d ---------------------------------------------------------------
      if (cli.delete) {
        if (scripter.remove(PKG, task)) {
          logger.deleted(task)
        } else {
          logger.notFound(task)
        }
        return
      }

      // ----- npm-scripter task -e ---------------------------------------------------------------
      if (cli.edit) {
        const tmpfile = tempfile()
        const script = scripter.list(PKG, task).shift()
        if (script) {
          fs.writeFileSync(tmpfile, script.code)
        }
        editor(tmpfile, ret => {
          if (ret === 0) {
            scripter.add(PKG, task, fs.readFileSync(tmpfile, 'utf-8'))
          }
          logger.added(task)
        })
        return
      }

      // ----- npm-scripter task ------------------------------------------------------------------
      const scripts = scripter.list(PKG, task)
      if (scripts.length === 0) {
        logger.notFound(task)
      } else {
        logger.list(scripts, false)
      }
    }
  })

cli.on('--help', () => {
  if (!process.env.EDITOR) {
    console.log(`\n  ${chalk.red('EDITOR environment variable is not set!')}`)
  }
  const examples = `
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

if (!action) {
  if (cli.delete) {
    // ----- npm-scripter -d ----------------------------------------------------------------------
    if (scripter.remove(PKG)) {
      logger.deleted()
    } else {
      logger.notFound()
    }
  } else {
    // ----- npm-scripter -------------------------------------------------------------------------
    const scripts = scripter.list(PKG)
    if (scripts.length === 0) {
      logger.notFound()
    } else {
      logger.list(scripts, true)
    }
  }
}

