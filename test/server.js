var express = require('express'),
  path = require('path'),
  serve = require('serve-static');

var app = module.exports = express();

app.use(serve(path.resolve(__dirname, 'fixtures')));

if (!module.parent) app.listen(7500);
