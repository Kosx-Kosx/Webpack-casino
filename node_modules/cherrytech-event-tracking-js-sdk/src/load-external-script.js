'use strict';

var util = require('./lib/util');

module.exports = loadScript;

function loadScript(src, callback) {
    var doc = document,
        script;

    if (!util.isString(src)) {
        throw new TypeError('`src` has to be a string');
    }

    if (util.isEmpty(src)) {
        throw new TypeError('`src` cannot be empty');
    }

    if (!callback || 'function' != typeof callback) {
        callback = null;
    }

    script = createScript(src.trim(), callback);
    doc.getElementsByTagName('head')[0].appendChild(script);

    function createScript(src, callback) {
        var script = doc.createElement('script');

        script.type = 'text/javascript';
        script.async = true;
        script.src = src;

        if (undefined !== script.onreadystatechange) {
            script.onreadystatechange = function () {
                if (4 === this.readyState || 'complete' === this.readyState || 'loaded' === this.readyState) {
                    invokeCallback();
                    removeScript();
                }
            };
        } else {
            script.onload = function () {
                invokeCallback();
                removeScript();
            };

            script.onerror = removeScript;
        }

        return script;

        function invokeCallback() {
            if (callback) {
                callback();
                callback = null;
            }
        }

        function removeScript() {
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
                script = null;
            }
        }
    }
}
