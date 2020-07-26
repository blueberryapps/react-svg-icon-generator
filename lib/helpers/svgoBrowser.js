/* eslint-disable */
// This is magic file that setups SVGO to be used in browser

/**
 * SVGO is a Nodejs-based tool for optimizing SVG vector graphics files.
 *
 * @see https://github.com/svg/svgo
 *
 * @author Kir Belevich <kir@soulshine.in> (https://github.com/deepsweet)
 * @copyright © 2012 Kir Belevich
 * @license MIT https://raw.githubusercontent.com/svg/svgo/master/LICENSE
 */

'use strict';

var SVG2JS = require('svgo/lib/svgo/svg2js.js'),
    PLUGINS = require('svgo/lib/svgo/plugins.js'),
    JSAPI = require('svgo/lib/svgo/jsAPI.js'),
    JS2SVG = require('svgo/lib/svgo/js2svg.js');

var EXTEND = require('whet.extend');

var PLUGINS_REQUIRE = {
    removeDoctype: require('svgo/plugins/removeDoctype'),
    removeXMLProcInst: require('svgo/plugins/removeXMLProcInst'),
    removeComments: require('svgo/plugins/removeComments'),
    removeMetadata: require('svgo/plugins/removeMetadata'),
    removeEditorsNSData: require('svgo/plugins/removeEditorsNSData'),
    cleanupAttrs: require('svgo/plugins/cleanupAttrs'),
    convertStyleToAttrs: require('svgo/plugins/convertStyleToAttrs'),
    cleanupIDs: require('svgo/plugins/cleanupIDs'),
    removeRasterImages: require('svgo/plugins/removeRasterImages'),
    removeUselessDefs: require('svgo/plugins/removeUselessDefs'),
    cleanupNumericValues: require('svgo/plugins/cleanupNumericValues'),
    cleanupListOfValues: require('svgo/plugins/cleanupListOfValues'),
    convertColors: require('svgo/plugins/convertColors'),
    removeUnknownsAndDefaults: require('svgo/plugins/removeUnknownsAndDefaults'),
    removeNonInheritableGroupAttrs: require('svgo/plugins/removeNonInheritableGroupAttrs'),
    removeUselessStrokeAndFill: require('svgo/plugins/removeUselessStrokeAndFill'),
    removeViewBox: require('svgo/plugins/removeViewBox'),
    cleanupEnableBackground: require('svgo/plugins/cleanupEnableBackground'),
    removeHiddenElems: require('svgo/plugins/removeHiddenElems'),
    removeEmptyText: require('svgo/plugins/removeEmptyText'),
    convertShapeToPath: require('svgo/plugins/convertShapeToPath'),
    moveElemsAttrsToGroup: require('svgo/plugins/moveElemsAttrsToGroup'),
    moveGroupAttrsToElems: require('svgo/plugins/moveGroupAttrsToElems'),
    collapseGroups: require('svgo/plugins/collapseGroups'),
    convertPathData: require('svgo/plugins/convertPathData'),
    convertTransform: require('svgo/plugins/convertTransform'),
    removeEmptyAttrs: require('svgo/plugins/removeEmptyAttrs'),
    removeEmptyContainers: require('svgo/plugins/removeEmptyContainers'),
    mergePaths: require('svgo/plugins/mergePaths'),
    removeUnusedNS: require('svgo/plugins/removeUnusedNS'),
    transformsWithOnePath: require('svgo/plugins/transformsWithOnePath'),
    sortAttrs: require('svgo/plugins/sortAttrs'),
    removeTitle: require('svgo/plugins/removeTitle'),
    removeDesc: require('svgo/plugins/removeDesc'),
    removeDimensions: require('svgo/plugins/removeDimensions'),
    removeAttrs: require('svgo/plugins/removeAttrs'),
    addClassesToSVGElement: require('svgo/plugins/addClassesToSVGElement'),
    removeStyleElement: require('svgo/plugins/removeStyleElement')
};

/**
 * Read and/or extend/replace default config file,
 * prepare and optimize plugins array.
 *
 * @param {Object} [config] input config
 * @return {Object} output config
 */
var CONFIG = function CONFIG(config) {

    var defaults = { plugins: [] };
    config = typeof config == 'object' && config || {};

    if (config.plugins && !Array.isArray(config.plugins)) {
        return { error: 'Error: Invalid plugins list. Provided \'plugins\' in config should be an array.' };
    }

    if (config.full) {
        defaults = config;

        if (Array.isArray(defaults.plugins)) {
            defaults.plugins = preparePluginsArray(defaults.plugins);
        }
    } else {
        defaults = {
            plugins: preparePluginsArray(defaults.plugins)
        };
        defaults = extendConfig(defaults, config);
    }

    if ('floatPrecision' in config && Array.isArray(defaults.plugins)) {
        defaults.plugins.forEach(function (plugin) {
            if (plugin.params && 'floatPrecision' in plugin.params) {
                // Don't touch default plugin params
                plugin.params = EXTEND({}, plugin.params, { floatPrecision: config.floatPrecision });
            }
        });
    }

    if (Array.isArray(defaults.plugins)) {
        defaults.plugins = optimizePluginsArray(defaults.plugins);
    }

    return defaults;
};

/**
 * Require() all plugins in array.
 *
 * @param {Array} plugins input plugins array
 * @return {Array} input plugins array of arrays
 */
function preparePluginsArray(plugins) {

    var plugin, key;

    return plugins.map(function (item) {

        // {}
        if (typeof item === 'object') {

            key = Object.keys(item)[0];

            // custom
            if (typeof item[key] === 'object' && item[key].fn && typeof item[key].fn === 'function') {
                plugin = setupCustomPlugin(key, item[key]);
            } else {

                plugin = EXTEND({}, PLUGINS_REQUIRE[key]);
                // name: {}
                if (typeof item[key] === 'object') {
                    plugin.params = EXTEND({}, plugin.params || {}, item[key]);
                    plugin.active = true;

                    // name: false
                } else if (item[key] === false) {
                        plugin.active = false;

                        // name: true
                    } else if (item[key] === true) {
                            plugin.active = true;
                        }

                plugin.name = key;
            }

            // name
        } else {

                plugin = EXTEND({}, PLUGINS_REQUIRE[item]);
                plugin.name = item;
            }

        return plugin;
    });
}

/**
 * Extend plugins with the custom config object.
 *
 * @param {Array} plugins input plugins
 * @param {Object} config config
 * @return {Array} output plugins
 */
function extendConfig(defaults, config) {

    var key;

    // plugins
    if (config.plugins) {

        config.plugins.forEach(function (item) {

            // {}
            if (typeof item === 'object') {

                key = Object.keys(item)[0];

                // custom
                if (typeof item[key] === 'object' && item[key].fn && typeof item[key].fn === 'function') {
                    defaults.plugins.push(setupCustomPlugin(key, item[key]));
                } else {
                    defaults.plugins.forEach(function (plugin) {

                        if (plugin.name === key) {
                            // name: {}
                            if (typeof item[key] === 'object') {
                                plugin.params = EXTEND({}, plugin.params || {}, item[key]);
                                plugin.active = true;

                                // name: false
                            } else if (item[key] === false) {
                                    plugin.active = false;

                                    // name: true
                                } else if (item[key] === true) {
                                        plugin.active = true;
                                    }
                        }
                    });
                }
            }
        });
    }

    defaults.multipass = config.multipass;

    // svg2js
    if (config.svg2js) {
        defaults.svg2js = config.svg2js;
    }

    // js2svg
    if (config.js2svg) {
        defaults.js2svg = config.js2svg;
    }

    return defaults;
}

/**
 * Setup and enable a custom plugin
 *
 * @param {String} plugin name
 * @param {Object} custom plugin
 * @return {Array} enabled plugin
 */
function setupCustomPlugin(name, plugin) {
    plugin.active = true;
    plugin.params = EXTEND({}, plugin.params || {});
    plugin.name = name;

    return plugin;
}

/**
 * Try to group sequential elements of plugins array.
 *
 * @param {Object} plugins input plugins
 * @return {Array} output plugins
 */
function optimizePluginsArray(plugins) {

    var prev;

    return plugins.reduce(function (plugins, item) {
        if (prev && item.type == prev[0].type) {
            prev.push(item);
        } else {
            plugins.push(prev = [item]);
        }
        return plugins;
    }, []);
}

var SVGO = module.exports = function (config) {
    this.config = CONFIG(config);
};

module.exports['default'] = SVGO;

SVGO.prototype.optimize = function (svgstr, callback) {
    this.config = CONFIG({
        full: true,
        plugins: ['removeDoctype', 'removeXMLProcInst', 'removeComments', 'removeMetadata', 'removeEditorsNSData', 'cleanupAttrs', 'convertStyleToAttrs', 'cleanupIDs', 'removeRasterImages', 'removeUselessDefs', 'cleanupNumericValues', 'cleanupListOfValues', 'convertColors', 'removeUnknownsAndDefaults', 'removeNonInheritableGroupAttrs', 'removeUselessStrokeAndFill', 'removeViewBox', 'cleanupEnableBackground', 'removeHiddenElems', 'removeEmptyText', 'convertShapeToPath', 'moveElemsAttrsToGroup', 'moveGroupAttrsToElems', 'collapseGroups', 'convertPathData', 'convertTransform', 'removeEmptyAttrs', 'removeEmptyContainers', 'mergePaths', 'removeUnusedNS', 'transformsWithOnePath', 'sortAttrs', 'removeTitle', 'removeDesc', 'removeDimensions', 'addClassesToSVGElement', 'removeStyleElement', {
            removeAttrs: {
                attrs: 'class'
            }
        }]
    });

    if (this.config.error) return callback(this.config);

    var _this = this,
        config = this.config,
        maxPassCount = config.multipass ? 10 : 1,
        counter = 0,
        prevResultSize = Number.POSITIVE_INFINITY,
        optimizeOnceCallback = function optimizeOnceCallback(svgjs) {

        if (svgjs.error) {
            callback(svgjs);
            return;
        }

        if (++counter < maxPassCount && svgjs.data.length < prevResultSize) {
            prevResultSize = svgjs.data.length;
            _this._optimizeOnce(svgjs.data, optimizeOnceCallback);
        } else {
            callback(svgjs);
        }
    };

    _this._optimizeOnce(svgstr, optimizeOnceCallback);
};

SVGO.prototype._optimizeOnce = function (svgstr, callback) {
    var config = this.config;

    SVG2JS(svgstr, function (svgjs) {

        if (svgjs.error) {
            callback(svgjs);
            return;
        }

        svgjs = PLUGINS(svgjs, config.plugins);

        callback(JS2SVG(svgjs, config.js2svg));
    });
};

/**
 * The factory that creates a content item with the helper methods.
 *
 * @param {Object} data which passed to jsAPI constructor
 * @returns {JSAPI} content item
 */
SVGO.prototype.createContentItem = function (data) {

    return new JSAPI(data);
};