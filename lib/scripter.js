var jsonfile = require('jsonfile')
var trim = require('trim')

var SCRIPTS = 'scripts'

var modifyFileSync = function(file, modification) {
  var pkg = jsonfile.readFileSync(file)
  var success = modification(pkg) || false
  jsonfile.writeFileSync(file, pkg, {spaces: 2})
  return success
}

var npmScript = function(script, scripts) {
  return {
    name: script,
    code: scripts[script]
  }
}

var scripter = {
  list: function(file, key) {
    var scripts = jsonfile.readFileSync(file)[SCRIPTS]
    if(key && scripts) {
      return scripts[key] ? [npmScript(key, scripts)] : []
    }
    if(scripts) {
      return Object.keys(scripts).map(key => npmScript(key, scripts))
    }
    return []
  },

  add: function(file, key, value) {
    modifyFileSync(file, pkg => {
      pkg[SCRIPTS] = pkg[SCRIPTS] || {}
      pkg[SCRIPTS][key] = trim(value)
    })
  },

  remove: function(file, key) {
    if(key) {
      return modifyFileSync(file, pkg => pkg[SCRIPTS] && pkg[SCRIPTS][key] && delete pkg[SCRIPTS][key])
    } else {
      return modifyFileSync(file, pkg => pkg[SCRIPTS] && delete pkg[SCRIPTS])
    }
  }
}

module.exports = scripter
