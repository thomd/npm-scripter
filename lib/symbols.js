const win32 = (process.platform === 'win32')

module.exports = {
  add: win32 ? '\u221A' : '✓',
  del: win32 ? '\u00D7' : '✖'
}
