'use strict';

module.exports = {
    getHost: getHost,
    isDefined: isDefined,
    isEmpty: isEmpty,
    isPlainObject: isPlainObject,
    isString: isString,
    merge: merge,
    whitelist: whitelist
};

/**
 * @return {String|undefined}
 */
function getHost() {
    // Browserify makes `global` an alias to `window` in browsers
    return global.location ? global.location.hostname : undefined;
}

/**
 * @param  {*} value
 * @return {Boolean}
 */
function isArray(value) {
    return Array.isArray(value);
}

/**
 * @param  {*} value
 * @return {Boolean}
 */
function isDefined(value) {
    return value !== undefined;
}

/**
 * @param  {*} value
 * @return {Boolean}
 */
function isEmpty(value) {
    if (typeof value === 'string') {
        return value.trim() === '';
    }

    if (isArray(value)) {
        return value.length < 1;
    }

    if (typeof value === 'object' && value !== null && value.constructor !== Date) {
        return Object.getOwnPropertyNames(value).length < 1;
    }

    return value === undefined || value === null;
}

/**
 * @param  {*} value
 * @return {Boolean}
 */
function isPlainObject(value) {
    if (value === null) {
        return false;
    }

    // value = Object.create(null) case
    if (typeof value === 'object' && !(value instanceof Object)) {
        return true;
    }

    return typeof value === 'object' && value.constructor === Object;
}

/**
 * @param  {*} value
 * @return {Boolean}
 */
function isString(value) {
    return typeof value === 'string';
}

/**
 * @description
 * Shallow merge passed objects and return new one.
 *
 * @param  {Array}  objects Collection of objects to be merged
 * @return {Object}
 */
function merge(objects) {
    var out = {};

    if (!objects || !isArray(objects)) {
        throw new TypeError('Non array passed');
    }

    if (objects.length < 2) {
        throw new RangeError('Pass at least 2 objects');
    }

    objects.forEach(function (obj) {
        if (!isPlainObject(obj)) {
            throw new TypeError('Non object passed: ' + obj);
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                out[key] = obj[key];
            }
        }
    });

    return out;
}

/**
 * @description
 * Return new object containing whitelisted properties only.
 *
 * @param  {Object} object
 * @param  {Array}  whiteList
 * @return {Object}
 */
function whitelist(object, whiteList) {
    var out = {};

    for (var key in object) {
        if (object.hasOwnProperty(key) && whiteList.indexOf(key) > -1) {
            out[key] = object[key];
        }
    }

    return out;
}
