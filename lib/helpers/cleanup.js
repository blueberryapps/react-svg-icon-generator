'use strict';

exports.__esModule = true;
exports.cleanupName = cleanupName;
exports.cleanupSvg = cleanupSvg;
exports.cleanupNativeSvg = cleanupNativeSvg;
function _camelCase(string) {
  return string.replace(/^.|-./g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.substr(1).toUpperCase();
  });
}

function _basicCleanup(svg) {
  return svg.replace(/width="\S+"/, '').replace(/height="\S+"/, '').replace(/xmlns="(\S*)"/, '').replace(/data-name="(.*?)"/, '').replace(/([\w-]+)="/g, function (match) {
    return _camelCase(match);
  }).replace(/\s{2,}/g, ' ').replace(/xlink\:href="(\S*)"/g, 'xlinkHref="$1"').replace(/xmlns\:xlink="(\S*)"/g, 'xmlnsXlink="$1"').replace(/<style>(.*?)<\/style>/g, '');
}

function cleanupName(name) {
  return name.replace(/u[A-Z0-9]{4}-/, '');
}

function cleanupSvg(svg, keepFillColor) {
  var cleanedSvg = _basicCleanup(svg).replace(/viewBox/, '{...rest} height={height || size} width={width || size} onClick={onClick} style={style} className={className} viewBox');

  return keepFillColor ? cleanedSvg : cleanedSvg.replace(/fill="#?\w+"/g, '').replace(/viewBox/, 'fill={color} viewBox').replace(/\s{2,}/g, ' ').replace(/ \>/g, '>');
}

function cleanupNativeSvg(svg, keepFillColor) {
  var cleanedSvg = _basicCleanup(svg).replace(/viewBox/, '{...rest} height={height || size} width={width || size} style={style} viewBox').replace(/\<[a-z]|\<\/[a-z]/g, function (match) {
    return match.toUpperCase();
  });

  return keepFillColor ? cleanedSvg : cleanedSvg.replace(/fill="#?\w+"/g, '').replace(/\<Path/g, '<Path fill={color}').replace(/\s{2,}/g, ' ').replace(/ \>/g, '>');
}