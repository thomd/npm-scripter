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
  .option('-r, --rename', 'rename npm-script')
  .arguments('[task] [code]')
  .action((task, code) => {
    action = true

    if (code) {
      //
      // ----- nps --edit task code ---------------------------------------------------------------
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

      // ----- nps --rename task task2 ------------------------------------------------------------
      if (cli.rename) {
        const oldTask = task
        const newTask = code || task
        const success = scripter.rename(PKG, oldTask, newTask)
        if (success) {
          logger.renamed(oldTask, newTask)
        } else {
          if(success === undefined) {
            logger.sourceMissing(oldTask)
          } else {
            logger.targetExist(newTask)
          }
        }
        return
      }

      // ----- nps task code ----------------------------------------------------------------------
      scripter.add(PKG, task, code)
      logger.added(task)
    } else {
      // ----- nps --delete task ------------------------------------------------------------------
      if (cli.delete) {
        if (scripter.remove(PKG, task)) {
          logger.deleted(task)
        } else {
          logger.notFound(task)
        }
        return
      }

      // ----- nps --rename task ------------------------------------------------------------------
      if (cli.rename) {
        scripter.rename(PKG, task)
        const success = scripter.rename(PKG, task)
        if (success) {
          logger.renamed(task, task)
        } else {
          if(success === undefined) {
            logger.sourceMissing(task)
          } else {
            logger.targetExist(task)
          }
        }
        return
      }

      // ----- nps --edit task --------------------------------------------------------------------
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

      // ----- nps task ---------------------------------------------------------------------------
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

      > nps

    create npm-script 'foo':

      > nps foo 'echo -n "foobar"'

    create npm-script 'foo' in $EDITOR:

      > nps -e foo

    delete npm-script 'foo':

      > nps -d foo

    rename npm-script 'foo' into 'bar':

      > nps -r foo bar
`
  console.log(examples)
})

cli.parse(process.argv)

if (!action) {
  if (cli.delete) {
    // ----- nps --delete -------------------------------------------------------------------------
    if (scripter.remove(PKG)) {
      logger.deleted()
    } else {
      logger.notFound()
    }
  } else {
    // ----- npa ----------------------------------------------------------------------------------
    const scripts = scripter.list(PKG)
    if (scripts.length === 0) {
      logger.notFound()
    } else {
      logger.list(scripts, true)
    }
  }
}

