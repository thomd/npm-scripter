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
    "scripts": {
      "foo": "npm run bar && npm run baz",
      "bar": "echo bar",
      "baz": "echo baz"
    }
  }

  before(function(done) {
    TEST_DIR = path.join(os.tmpdir(), 'npm-scripter-tests')
    rimraf.sync(TEST_DIR)
    fs.mkdir(TEST_DIR, done)
  })

  after(function(done) {
    //rimraf.sync(TEST_DIR)
    done()
  })

  beforeEach(function(done) {
    TEST_FILE = path.join(TEST_DIR, 'package.json')
    fs.writeFileSync(TEST_FILE, JSON.stringify(TEST_PKG))
    done()
  })

  afterEach(function(done) {
    //rimraf.sync(TEST_FILE)
    done()
  })

  it.skip('should find no npm scripts if no scripts are defined', function() {

  })

  it('should find all npm scripts', function() {
    var scripts = scripter.list(TEST_FILE)
    assert.equal(Object.keys(scripts).length, 3)
  })

  it('should find npm script "foo"', function() {
    var script = scripter.list(TEST_FILE, 'foo')
    assert.equal(script, "npm run bar && npm run baz")
  })

  it.skip('should add a first npm script "test"', function() {

  })

  it('should add an additional npm script "test"', function() {
    scripter.add(TEST_FILE, 'test', 'echo test')
    var scripts = scripter.list(TEST_FILE)
    assert.equal(Object.keys(scripts).length, 4)
    var script = scripter.list(TEST_FILE, 'test')
    assert.equal(script, 'echo test')
  })

  it('should remove an existing npm script', function() {
    scripter.remove(TEST_FILE, 'foo')
    var scripts = scripter.list(TEST_FILE)
    assert.equal(Object.keys(scripts).length, 2)
    assert.equal(scripts['foo'], undefined)
    assert.equal(scripts['bar'], "echo bar")
    assert.equal(scripts['baz'], "echo baz")
  })

  it.skip('should not remove a npm script if no scripts are defined', function() {

  })
})
