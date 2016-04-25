var Nightmare = require('nightmare'),
  path = require('path'),
  debug = require('debug')('nightmare:iframe');

Nightmare.prototype.evaluate_now = function(js_fn, done) {
  var template = require(path.resolve(path.dirname(require.resolve('nightmare')), 'javascript'));
  var child = this.child;

  child.once('javascript', function(err, result) {
    if (err) return done(err);
    done(null, result);
  });

  var args = Array.prototype.slice.call(arguments)
    .slice(2);
  var argsList = JSON.stringify(args)
    .slice(1, -1);

  var sendJsFn = String(function() {
    var document = window.top.document;
    if ($array.length > 0) {
      $array.forEach(function(selector) {
        document = document.querySelector(selector)
          .contentDocument;
      });
    }
    return (js_fn)
      .apply(this, arguments);
  });

  sendJsFn = sendJsFn.replace(/\$array/g, JSON.stringify(this.__documents || []))
    .replace('js_fn', String(js_fn));

  child.emit('javascript', template.execute({
    src: sendJsFn,
    args: argsList
  }));

  return this;
};

Nightmare.action('enterIFrame',
  function(selector, done) {
    this.__documents = this.__documents || [];
    debug(`entering iframe ${selector}`);
    this.__documents.push(selector);
    done();
  });

Nightmare.action('exitIFrame',
  function(done) {
    this.__documents.pop();
    done();
  });

Nightmare.action('resetFrame',
  function(done) {
    this.__documents = [];
    done();
  });
