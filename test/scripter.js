const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const rimraf = require('rimraf')
const scripter = require('../lib/scripter')

describe('npm-scripter', () => {
  let TEST_DIR
  let TEST_FILE
  const TEST_PKG = {
    name: 'scripter-test',
    version: '1.0.0',
    scripts: {
      foo: 'npm run bar && npm run baz',
      bar: 'echo bar',
      baz: 'echo baz'
    }
  }
  const TEST_PKG_EMPTY = {
    name: 'scripter-test',
    version: '1.0.0'
  }

  beforeEach(done => {
    TEST_DIR = path.join(os.tmpdir(), 'npm-scripter-tests')
    rimraf.sync(TEST_DIR)
    fs.mkdir(TEST_DIR, () => {
      TEST_FILE = path.join(TEST_DIR, 'package.json')
      done()
    })
  })

  afterEach(done => {
    rimraf.sync(TEST_DIR)
    done()
  })

  it('should inform correctly if package.json does exist', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    const missing = scripter.missing(TEST_FILE)
    assert.equal(missing, false)
  })

  it('should inform correctly if package.json does not missing', () => {
    const missing = scripter.missing(TEST_FILE)
    assert.equal(missing, true)
  })

  it('should find no npm scripts if no scripts are defined', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG_EMPTY))
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 0)
  })

  it('should find all npm scripts', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 3)
    assert.deepEqual(scripts.map(script => script.name), ['foo', 'bar', 'baz'])
  })

  it('should find npm script "foo"', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    const scripts = scripter.list(TEST_FILE, 'foo')
    assert.equal(scripts.length, 1)
    assert.equal(scripts[0].name, 'foo')
    assert.equal(scripts[0].code, 'npm run bar && npm run baz')
  })

  it('should not find npm script "xyz"', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    const scripts = scripter.list(TEST_FILE, 'xyz')
    assert.equal(scripts.length, 0)
  })

  it('should add a first npm script "test"', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG_EMPTY))
    scripter.add(TEST_FILE, 'test', 'echo test')
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 1)
    assert.equal(scripts[0].name, 'test')
    assert.equal(scripts[0].code, 'echo test')
  })

  it('should add an additional npm script "test"', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    scripter.add(TEST_FILE, 'test', 'echo test')
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 4)
    assert.deepEqual(scripts.map(script => script.name), ['foo', 'bar', 'baz', 'test'])
  })

  it('should overwrite an existing npm script "foo"', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    scripter.add(TEST_FILE, 'foo', 'echo foo')
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 3)
    assert.deepEqual(scripts.map(script => script.name), ['foo', 'bar', 'baz'])
    assert.equal(scripts.filter(script => script.name === 'foo').shift().code, 'echo foo')
  })

  it('should remove an existing npm script', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    const success = scripter.remove(TEST_FILE, 'bar')
    assert.equal(success, true)
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 2)
    assert.deepEqual(scripts.map(script => script.name), ['foo', 'baz'])
  })

  it('should not remove a npm script if no scripts are defined', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG_EMPTY))
    const success = scripter.remove(TEST_FILE, 'bar')
    assert.equal(success, false)
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 0)
  })

  it('should not remove all npm scripts if no scripts are defined', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG_EMPTY))
    const success = scripter.remove(TEST_FILE)
    assert.equal(success, false)
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 0)
  })

  it('should remove all npm scripts', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    const success = scripter.remove(TEST_FILE)
    assert.equal(success, true)
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 0)
  })

  it('should rename a script', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    scripter.rename(TEST_FILE, 'bar', 'bar2')
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 3)
    assert.deepEqual(scripts.map(script => script.name), ['foo', 'bar2', 'baz'])
    assert.equal(scripts.filter(script => script.name === 'bar2').shift().code, 'echo bar')
  })

  it('should rename a script to itself if no target script is given', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    const success = scripter.rename(TEST_FILE, 'bar')
    assert.equal(success, true)
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 3)
    assert.deepEqual(scripts.map(script => script.name), ['foo', 'bar', 'baz'])
    assert.equal(scripts.filter(script => script.name === 'bar').shift().code, 'echo bar')
  })

  it('should not rename a script if source script does not exist', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    const success = scripter.rename(TEST_FILE, 'bar2')
    assert.equal(success, undefined)
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 3)
    assert.deepEqual(scripts.map(script => script.name), ['foo', 'bar', 'baz'])
  })

  it('should not rename a script if target script does already exist', () => {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    const success = scripter.rename(TEST_FILE, 'bar', 'baz')
    assert.equal(success, false)
    const scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 3)
    assert.deepEqual(scripts.map(script => script.name), ['foo', 'bar', 'baz'])
  })
})
