'use strict';

exports.__esModule = true;
exports['default'] = minifySvg;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _svgoBrowser = require('./svgoBrowser');

var _svgoBrowser2 = _interopRequireDefault(_svgoBrowser);

var svgo = new _svgoBrowser2['default']();

function minifySvg(file, content) {
  return new _bluebird2['default'](function (resolve) {
    return svgo.optimize(content, function (result) {
      return resolve({
        filename: file,
        name: _path2['default'].basename(file, '.svg'),
        svg: result
      });
    });
  });
}

module.exports = exports['default'];