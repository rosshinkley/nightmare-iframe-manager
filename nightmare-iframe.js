var path = require('path'),
  debug = require('debug')('nightmare:iframe');

module.exports = exports = function(Nightmare) {
  Nightmare.prototype.evaluate_now = function(js_fn, done) {
    var template = require(path.resolve(path.dirname(require.resolve('nightmare')), 'javascript'));
    var child = this.child;

    var args = Array.prototype.slice.call(arguments).slice(2).map(a=> {
      return { argument: JSON.stringify(a) };
    });

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

    child.call('javascript', template.execute({
      src: sendJsFn,
      args: args
    }), done);

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
};
