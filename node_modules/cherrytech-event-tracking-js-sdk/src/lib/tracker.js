'use strict';

var http = require('axios');
var cookie = require('browser-cookies-shim');
var uuid = require('uuid');
var util = require('./util');

module.exports = Tracker;

var defaultConfig = {
    apiEndpoint: undefined,
    domain: util.getHost() || 'localhost',
    cookieName: 'ct_tracker',
    pageViewEventName: 'page_view'
};

/**
 * @constructor
 * @param {String} id
 * @param {Object} [plugins] List of plugins (name-indexed)
 *
 * @throws
 */
function Tracker(id, plugins) {
    if (!util.isString(id)) {
        throw new TypeError('`id` has to be a string');
    }

    if (util.isEmpty(id)) {
        throw new TypeError('`id` cannot be empty');
    }

    this.id = id.trim();
    this.config = defaultConfig;
    this.identity = {};
    this.uid = null;
    this.xhr = http;
    this.plugins = plugins || {};

    // Create tracking cookie
    if (!cookieExists(this.config.cookieName)) {
        cookie.set(this.config.cookieName, uuid.v4(), {
            expires: new Date(4242, 12, 30, 23, 59, 59)
        });
    }
}

Tracker.prototype.configure = configure;
Tracker.prototype.identify = identify;
Tracker.prototype.track = track;
Tracker.prototype.trackPageView = trackPageView;

/**
 * @param  {Object}  options
 * @return {Tracker}
 */
function configure(options) {
    this.config = util.merge([
        this.config,
        util.whitelist(options, ['apiEndpoint', 'cookieName', 'domain', 'pageViewEventName'])
    ]);

    return this;
}

/**
 * @param  {String}  [uid]
 * @param  {Object}  [identificationPayload]
 * @return {Tracker}
 */
function identify(uid, identificationPayload) {
    if (util.isString(uid)) {
        uid = uid.trim();
    }

    if (!util.isString(uid) && !util.isEmpty(uid)) {
        throw new TypeError('`uid` has to be a string');
    }

    if (util.isDefined(identificationPayload) && !util.isPlainObject(identificationPayload)) {
        throw new TypeError('`identificationPayload` has to be a plain object');
    }

    this.uid = util.isEmpty(uid) ? null : uid;

    if (util.isDefined(identificationPayload)) {
        this.identity = util.merge([this.identity, identificationPayload]);
    }

    return this;
}

/**
 * @param  {String}  eventName
 * @param  {Object}  [eventPayload]
 * @return {Promise}
 *
 * @throws
 */
function track(eventName, eventPayload) {
    if (util.isEmpty(eventName)) {
        throw new TypeError('`eventName` cannot be empty');
    }

    if (!util.isString(eventName)) {
        throw new TypeError('`eventName` has be a string');
    }

    if (util.isDefined(eventPayload) && !util.isPlainObject(eventPayload)) {
        throw new TypeError('`eventPayload` has to be an object');
    }

    if (!util.isDefined(this.config.apiEndpoint)) {
        throw new Error('`API endpoint` for tracker `' + this.id + '` is undefined. Configure it properly to use tracking.');
    }

    var self = this;

    var xhrPayload = util.merge([
        {
            host: this.config.domain,
            cookie: cookie.get(this.config.cookieName),
            event: eventName
        },
        prefixObjectKeys(eventPayload, 'ev_'),
        prefixObjectKeys(this.identity, 'ur_')
    ]);

    if (this.uid) {
        xhrPayload = util.merge([xhrPayload, {uid: this.uid}]);
    }

    return this.xhr({
        method: 'get',
        url: this.config.apiEndpoint,
        params: xhrPayload
    })
    .then(function (response) {
        response.evalResults = [];

        if (response && response.data && response.data.actions) {
            response.data.actions.forEach(function (action) {
                if (action.type === 'javascript') {
                    // Store eval results
                    response.evalResults.push(evalInContext(action.code));
                }
            });
        }

        // Reset identification related properties to default values
        // as we don't want to send it to web services every time.
        self.uid = null;
        self.identity = {};

        return response;
    });

    function evalInContext(js) {
        var tracker = self.plugins; // accessible in eval

        try {
            return eval(js); // eslint-disable-line no-eval
        } catch (e) {
            console.error('drop_javascript: %s', e.message);

            return '';
        }
    }
}

/**
 * @param  {Object}  [payload]
 * @return {Promise}
 */
function trackPageView(payload) {
    return this.track(this.config.pageViewEventName, payload);
}

/**
 * @description
 * Checks if cookie with passed name exists.
 *
 * @param  {String}  cookieName
 * @return {Boolean}
 */
function cookieExists(cookieName) {
    // That's not entirely true as cookie can have undefined value
    // but we treat it as non existent in that case.
    return cookie.get(cookieName) !== null;
}

/**
 * @description
 * Returns new prefixed object.
 *
 * @param  {Object} object
 * @param  {String} prefix
 * @return {Object}
 */
function prefixObjectKeys(object, prefix) {
    prefix = prefix || '';

    var out = {};

    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            out[prefix + key] = object[key];
        }
    }

    return out;
}
