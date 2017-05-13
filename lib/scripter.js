var jsonfile = require('jsonfile')

var scripter = {
  list: function(file, key) {
    var scripts = jsonfile.readFileSync(file)[SCRIPTS]
    return key ? scripts[key] : scripts
  },

  add: function(file, key, value) {
    modifyFileSync(file, pkg => pkg[SCRIPTS][key] = value)
  },

  remove: function(file, key) {
    modifyFileSync(file, pkg => delete pkg[SCRIPTS][key])
  }
}

var SCRIPTS = 'scripts'

var modifyFileSync = function(file, callback) {
  var pkg = jsonfile.readFileSync(file)
  callback(pkg)
  jsonfile.writeFileSync(file, pkg, {spaces: 2})
}

module.exports = scripter
