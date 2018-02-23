const win32 = (process.platform === 'win32')

module.exports = {
  add: win32 ? '√' : '✓',
  del: win32 ? '×' : '✖',
  warning: '!'
}
