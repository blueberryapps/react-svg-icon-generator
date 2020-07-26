'use strict';

exports.__esModule = true;
exports['default'] = minifySvg;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _svgo = require('./svgo');

var _svgo2 = _interopRequireDefault(_svgo);

function minifySvg(file, content) {
  return new _bluebird2['default'](function (resolve) {
    return _svgo2['default'].optimize(content, function (result) {
      return resolve({
        name: _path2['default'].basename(file, '.svg'),
        svg: result
      });
    });
  });
}

module.exports = exports['default'];