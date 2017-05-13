#!/usr/bin/env node

var cli = require('nash')()

cli.default().handler(function(data, flags, done) {

  if(data.length == 0) {
    if(flags.d) {
      console.log('delete all tasks')
    } else {
      console.log('list all tasks')
    }
  }

  if(data.length == 1) {
    var task = data.shift()
    if(flags.d) {
      console.log(`delete task "${task}"`)
    } else if(flags.e) {
      console.log(`edit task "${task}"`)
    } else {
      console.log(`list task "${task}"`)
    }
  }

  if(data.length == 2) {
    var task = data.shift()
    if(flags.e) {
      console.log(`edit task "${task}"`)
    } else {
      console.log(`add task "${task}" to: "${data.join(' ')}"`)
    }
  }
  done()
})

cli.run(process.argv)

