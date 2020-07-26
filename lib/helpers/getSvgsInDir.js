'use strict';

exports.__esModule = true;
exports['default'] = getSvgsInDir;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function getSvgsInDir(dir) {
  if (!_fs2['default'].existsSync(dir)) {
    return null;
  }

  return [].concat.apply([], _fs2['default'].readdirSync(dir).map(function (file) {
    var absolutePath = _path2['default'].join(dir, file);

    if (_fs2['default'].lstatSync(absolutePath).isDirectory()) {
      return getSvgsInDir(dir, file);
    }

    if (!absolutePath.match(/\.svg$/)) {
      return null;
    }

    return absolutePath;
  })).filter(function (filePath) {
    return filePath !== null;
  });
}

module.exports = exports['default'];