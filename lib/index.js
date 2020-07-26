'use strict';

exports.__esModule = true;
exports['default'] = configureSvgIcon;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _configureGenerator = require('./configureGenerator');

var _configureGenerator2 = _interopRequireDefault(_configureGenerator);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

function configureSvgIcon(config) {
  _gulp2['default'].task('svg-icon', _configureGenerator2['default'](config));
}

exports.configureGenerator = _configureGenerator2['default'];