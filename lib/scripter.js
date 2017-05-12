var jsonfile = require('jsonfile')

var scripter = {
  list: function(file, key) {
    var scripts = jsonfile.readFileSync(file)['scripts']
    return key ? scripts[key] : scripts
  },
  add: function(file, key, value) {
    var pkg = jsonfile.readFileSync(file)
    pkg['scripts'][key] = value
    jsonfile.writeFileSync(file, pkg, {spaces: 2})
  },
  remove: function(key) {}
}

module.exports = scripter
