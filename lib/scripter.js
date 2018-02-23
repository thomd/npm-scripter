const jsonfile = require('jsonfile')
const trim = require('trim')

const SCRIPTS = 'scripts'

const modifyFileSync = function (file, modification) {
  const pkg = jsonfile.readFileSync(file)
  const success = modification(pkg) || false
  jsonfile.writeFileSync(file, pkg, {spaces: 2})
  return success
}

const npmScript = function (script, scripts) {
  return {
    name: script,
    code: scripts[script]
  }
}

const scripter = {
  list(file, key) {
    const scripts = jsonfile.readFileSync(file)[SCRIPTS]
    if (key && scripts) {
      return scripts[key] ? [npmScript(key, scripts)] : []
    }
    if (scripts) {
      return Object.keys(scripts).map(key => npmScript(key, scripts))
    }
    return []
  },

  add(file, key, value) {
    modifyFileSync(file, pkg => {
      pkg[SCRIPTS] = pkg[SCRIPTS] || {}
      pkg[SCRIPTS][key] = trim(value)
    })
  },

  remove(file, key) {
    if (key) {
      return modifyFileSync(file, pkg => pkg[SCRIPTS] && pkg[SCRIPTS][key] && delete pkg[SCRIPTS][key])
    }
    return modifyFileSync(file, pkg => pkg[SCRIPTS] && delete pkg[SCRIPTS])
  },

  rename(file, from, _to) {
    const to = _to || from
    const scripts = jsonfile.readFileSync(file)[SCRIPTS]

    // We can't rename a script which does not exist
    if (!scripts[from]) {
      return undefined
    }

    // If source equals target script, we must do nothing
    if (from === to) {
      return true
    }

    // Target script must not already exist
    if (scripts[to]) {
      return false
    }

    return modifyFileSync(file, pkg => {
      const scripts = {}
      Object.keys(pkg[SCRIPTS]).forEach(key => {
        const val = pkg[SCRIPTS][key]
        key = key === from ? to : key
        scripts[key] = val
      })
      pkg[SCRIPTS] = scripts
    })
  },

  missing(file) {
    try {
      jsonfile.readFileSync(file)
      return false
    } catch (err) {
      return true
    }
  }
}

module.exports = scripter
