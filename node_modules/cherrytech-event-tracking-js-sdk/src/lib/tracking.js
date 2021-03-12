'use strict';

var Tracker = require('./tracker');

module.exports = {
    createTracker: createTracker,
    setPlugins: setPlugins,
    getPlugins: getPlugins
};

var data = {
    plugins: {}
};

/**
 * @param  {String}  id
 * @param  {Object}  [config] Configuration object expected by {Tracker} instance
 * @param  {Object}  [plugins] List of additional plugins available to {Tracker} (name-indexed)
 * @return {Tracker}
 */
function createTracker(id, config, plugins) {
    config = config || {};
    plugins = plugins || {};

    return new Tracker(id, plugins).configure(config);
}

/**
 * @param {Object} [plugins] List of plugins (name-indexed)
 */
function setPlugins(plugins) {
    data.plugins = plugins || {};
}

/**
 * @returns {Object} List of plugins (name-indexed)
 */
function getPlugins() {
    return data.plugins;
}
