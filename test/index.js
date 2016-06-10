/**
 * Module dependencies.
 */

require('mocha-generators')
  .install();

var Nightmare = require('nightmare');
var chai = require('chai');
var url = require('url');
var server = require('./server');
var path = require('path');
var child_process = require('child_process');
var should = chai.should();

require('../nightmare-iframe')(Nightmare);

/**
 * Get rid of a warning.
 */

process.setMaxListeners(0);

/**
 * Locals.
 */

var base = 'http://localhost:7500/';

describe('Nightmare', function() {
  before(function(done) {
    server.listen(7500, done);
  });

  it('should be constructable', function*() {
    var nightmare = Nightmare();
    nightmare.should.be.ok;
    yield nightmare.end();
  });

  describe('iframes', function() {
    var nightmare;

    beforeEach(function() {
      nightmare = Nightmare();
    });

    afterEach(function*() {
      yield nightmare.end();
    });

    it('should start in the main document', function*() {
      var title = yield nightmare
        .goto(fixture('iframes'))
        .title()

      title.should.equal('root')
    });

    it('should be able to enter an iframe', function*() {
      var title = yield nightmare
        .goto(fixture('iframes'))
        .enterIFrame('#root')
        .title()

      title.should.equal('first')
    });

    it('should be able to enter a nested iframe', function*() {
      var title = yield nightmare
        .goto(fixture('iframes'))
        .enterIFrame('#root')
        .title()

      title.should.equal('first')

      var title = yield nightmare
        .enterIFrame('#first')
        .title()

      title.should.equal('second')
    });

    it('should be able to enter a (possibly nested) iframe and go back to the main document', function*() {
      var title = yield nightmare
        .goto(fixture('iframes'))
        .enterIFrame('#root')
        .title()

      title.should.equal('first')

      var title = yield nightmare
        .enterIFrame('#first')
        .title()

      title.should.equal('second')

      var title = yield nightmare
        .resetFrame()
        .title()

      title.should.equal('root')
    });

  });
});

/**
 * Generate a URL to a specific fixture.
 *
 * @param {String} path
 * @returns {String}
 */

function fixture(path) {
  return url.resolve(base, path);
}

/**
 * Simple assertion for running processes
 */
chai.Assertion.addProperty('process', function() {
  var running = true;
  try {
    process.kill(this._obj, 0);
  } catch (e) {
    running = false;
  }
  this.assert(
    running,
    'expected process ##{this} to be running',
    'expected process ##{this} not to be running');
});
