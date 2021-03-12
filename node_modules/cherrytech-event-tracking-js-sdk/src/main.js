'use strict';

var Tracker = require('./lib/tracker.js');
var loadScript = require('./load-external-script');

// Browserify exposes `window` as `global`
global.CherryTechEventTracking = module.exports = require('./lib/tracking.js');

if (global.__ctet) { // eslint-disable-line no-underscore-dangle
    bootstrapWithLoader();
} else {
    bootstrapWithoutLoader();
}

/**
 * Handles queued events when including tracking lib asynchronously but invoking
 * tracker's functions before it is loaded.
 *
 * It processes `queue` property of global object `__ctet` by replacing
 * all stubs with Tracker instance and applying all queued function invocations
 * along with all parameters passed previously.
 *
 * Queue is an array of well defined objects, like:
 *
 * var queuedItem = {
 *     id: 'tracker1',
 *     action: {
 *         fname: 'track',
 *         args: ['button_clicked', { type: 'register', page: 'login_overlay' }]
 *     }
 * };
 *
 * where:
 *     - `id` is unique identifier of Tracker that will be instantiated
 *       and attached to `window`
 *     - `action.fname` is a name of one of functions exposed by Tracker API
 *     - `action.args` is array of arguments passed to that function
 */
function bootstrapWithLoader() {
    bootstrapDefaultPlugins();
    global.CherryTechEventTracking.setPlugins(global.__ctet.plugins);
    global.__ctet.libraryLoadedCallback = (function () {
        var callback = global.__ctet.libraryLoadedCallback;

        return function () {
            callback();
            replaceStubs();
        }
    })();

    replaceStubs();
}

/**
 * Bootstraps the application in sync mode (Angular, node, sync script loading)
 */
function bootstrapWithoutLoader() {
    global.__ctet = {
        plugins: {}
    };
    bootstrapDefaultPlugins();

    global.CherryTechEventTracking.setPlugins(global.__ctet.plugins);
}

/**
 * Replaces existing tracker stubs with actual tracker instances, executes queued operations.
 */
function replaceStubs() {
    if (!haveLibrariesLoaded()) {
        return; // Loading more libraries
    }

    global.__ctet.libraryLoadedCallback = function () {};
    global.__ctet.queue.forEach(function (trackerStub) { // eslint-disable-line no-underscore-dangle
        var tracker = global[trackerStub.id];

        if (!(tracker instanceof Tracker)) {
            global[trackerStub.id] = tracker = new Tracker(trackerStub.id, global.__ctet.plugins);
        }

        tracker[trackerStub.action.fname].apply(tracker, trackerStub.action.args);
    });
}

/**
 * @returns {boolean}
 */
function haveLibrariesLoaded() {
    return global.__ctet.librariesTotal === global.__ctet.librariesLoaded;
}

function bootstrapDefaultPlugins() {
    global.__ctet.plugins.loadScript = loadScript;
}
