#!/usr/bin/env node

var cli = require('nash')()
var editor = require('editor')
var scripter = require('../lib/scripter')

var PKG = 'package.json'

cli.default().handler(function(data, flags, done) {

  if(data.length == 0) {
    if(flags.d) {
      scripter.remove(PKG)
      console.log('deleted all npm-scripts')
    } else {
      var scripts = scripter.list(PKG)
      scripts.forEach(script => console.log(`${script.name}: ${script.code}`))
    }
  }

  if(data.length == 1) {
    var task = data.shift()
    if(flags.d) {
      scripter.remove(PKG, task)
      console.log(`deleted task "${task}"`)
    } else if(flags.e) {
      // TODO
      console.log(`edit task "${task}"`)
      editor('tempfile', function(code, sig) {
        console.log(`code is: "${code}"`)
        console.log(`sig is: "${sig}"`)
      })
    } else {
      var scripts = scripter.list(PKG, task)
      scripts.forEach(script => console.log(`${script.name}: ${script.code}`))
    }
  }

  if(data.length == 2) {
    var task = data.shift()
    if(flags.e) {
      // TODO
      console.log(`edit task "${task}"`)
    } else {
      scripter.add(PKG, task, 'echo test')
      console.log(`added task "${task}"`)
    }
  }

  done()
})

cli.run(process.argv)

