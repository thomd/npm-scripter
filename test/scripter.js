var assert = require('assert')
var fs = require('fs')
var os = require('os')
var path = require('path')
var rimraf = require('rimraf')
var scripter = require('../lib/scripter')

describe('npm-scripter', function() {
  var TEST_DIR, TEST_FILE
  var TEST_PKG = {
    "name": "scripter-test",
    "version": "1.0.0",
    "scripts": {
      "foo": "npm run bar && npm run baz",
      "bar": "echo bar",
      "baz": "echo baz"
    }
  }
  var TEST_PKG_EMPTY = {
    "name": "scripter-test",
    "version": "1.0.0"
  }

  beforeEach(function(done) {
    TEST_DIR = path.join(os.tmpdir(), 'npm-scripter-tests')
    rimraf.sync(TEST_DIR)
    fs.mkdir(TEST_DIR, function() {
      TEST_FILE = path.join(TEST_DIR, 'package.json')
      done()
    })
  })

  afterEach(function(done) {
    rimraf.sync(TEST_DIR)
    done()
  })

  it('should inform correctly if package.json does exist', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    var missing = scripter.missing(TEST_FILE)
    assert.equal(missing, false)
  })

  it('should inform correctly if package.json does not missing', function() {
    var missing = scripter.missing(TEST_FILE)
    assert.equal(missing, true)
  })

  it('should find no npm scripts if no scripts are defined', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG_EMPTY))
    var scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 0)
  })

  it('should find all npm scripts', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    var scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 3)
    assert.deepEqual(scripts.map(script => script.name), ["foo", "bar", "baz"])
  })

  it('should find npm script "foo"', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    var scripts = scripter.list(TEST_FILE, 'foo')
    assert.equal(scripts.length, 1)
    assert.equal(scripts[0].name, "foo")
    assert.equal(scripts[0].code, "npm run bar && npm run baz")
  })

  it('should not find npm script "xyz"', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    var scripts = scripter.list(TEST_FILE, 'xyz')
    assert.equal(scripts.length, 0)
  })

  it('should add a first npm script "test"', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG_EMPTY))
    scripter.add(TEST_FILE, 'test', 'echo test')
    var scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 1)
    assert.equal(scripts[0].name, "test")
    assert.equal(scripts[0].code, "echo test")
  })

  it('should add an additional npm script "test"', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    scripter.add(TEST_FILE, 'test', 'echo test')
    var scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 4)
    assert.deepEqual(scripts.map(script => script.name), ["foo", "bar", "baz", "test"])
  })

  it('should overwrite an existing npm script "foo"', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    scripter.add(TEST_FILE, 'foo', 'echo foo')
    var scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 3)
    assert.deepEqual(scripts.map(script => script.name), ["foo", "bar", "baz"])
    assert.equal(scripts.filter(script => script.name === "foo").shift().code, "echo foo")
  })

  it('should remove an existing npm script', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    var success = scripter.remove(TEST_FILE, 'bar')
    assert.equal(success, true)
    var scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 2)
    assert.deepEqual(scripts.map(script => script.name), ["foo", "baz"])
  })

  it('should not remove a npm script if no scripts are defined', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG_EMPTY))
    var success = scripter.remove(TEST_FILE, 'bar')
    assert.equal(success, false)
    var scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 0)
  })

  it('should not remove all npm scripts if no scripts are defined', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG_EMPTY))
    var success = scripter.remove(TEST_FILE)
    assert.equal(success, false)
    var scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 0)
  })

  it('should remove all npm scripts', function() {
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    var success = scripter.remove(TEST_FILE)
    assert.equal(success, true)
    var scripts = scripter.list(TEST_FILE)
    assert.equal(scripts.length, 0)
  })
})
