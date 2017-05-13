var jsonfile = require('jsonfile')

var SCRIPTS = 'scripts'

var modifyFileSync = function(file, modification) {
  var pkg = jsonfile.readFileSync(file)
  modification(pkg)
  jsonfile.writeFileSync(file, pkg, {spaces: 2})
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
      return [npmScript(key, scripts)]
    }
    if(scripts) {
      return Object.keys(scripts).map(key => npmScript(key, scripts))
    }
    return []
  },

  add: function(file, key, value) {
    modifyFileSync(file, pkg => {
      pkg[SCRIPTS] = pkg[SCRIPTS] || {}
      pkg[SCRIPTS][key] = value
    })
  },

  remove: function(file, key) {
    modifyFileSync(file, pkg => pkg[SCRIPTS] && delete pkg[SCRIPTS][key])
  }
}

module.exports = scripter
