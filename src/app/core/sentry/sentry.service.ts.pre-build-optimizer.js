import { addBreadcrumb, captureException, captureMessage, configureScope, Severity, withScope } from '@sentry/browser';
import { PlatformService } from 'app/core/platform.service';
import * as i0 from "@angular/core";
import * as i1 from "../platform.service";
/**
 * This is a helper class for proxying calls to Sentry in order to make them mockable.
 * This needs to separated from SentryInitService to avoid circular dependencies.
 */
var SentryService = /** @class */ (function () {
    function SentryService(platformService) {
        this.platformService = platformService;
    }
    /**
     * Records a new breadcrumb which will be attached to future events.
     *
     * Breadcrumbs will be added to subsequent events to provide more context on
     * user's actions prior to an error or crash.
     *
     * @param breadcrumb The breadcrumb to record.
     */
    SentryService.prototype.addBreadcrumb = function (breadcrumb) {
        addBreadcrumb(breadcrumb);
    };
    /**
     * Captures an exception event and sends it to Sentry.
     *
     * @param exception An exception-like object.
     * * @param fingerprint Fingerprint under which this message should be grouped
     * @param showConsoleError When set to `false` then calling `console.error` will be skipped. Default: `true`.
     * @returns The original exception
     */
    SentryService.prototype.captureException = function (exception, fingerprint, showConsoleError) {
        if (showConsoleError === void 0) { showConsoleError = true; }
        var fingerprintArray = !Array.isArray(fingerprint) ? [fingerprint] : fingerprint;
        if (showConsoleError) {
            // This may result in duplicated error item in browser console, but also may be the only error in console.
            console.error(exception);
        }
        withScope(function (scope) {
            if (fingerprint && fingerprintArray.length) {
                fingerprintArray[0] = "syntheticException_" + fingerprintArray[0];
                scope.addBreadcrumb({
                    message: "Adding fingerprint: " + fingerprintArray.join('|'),
                    level: Severity.Info,
                });
                scope.setFingerprint(fingerprintArray);
            }
            captureException(exception);
        });
        return exception;
    };
    /**
     * Captures an exception event and sends it to Sentry.
     *
     * @param message The message to send to Sentry
     * @param fingerprint Fingerprint under which this message should be grouped
     * @param level Level of the message (default: Info)
     * @param showConsoleError When set to `false` then calling `console.error` / `console.log` will be skipped. Default: `true`
     * @returns The generated eventId.
     */
    SentryService.prototype.captureMessage = function (message, fingerprint, level, showConsoleError) {
        if (level === void 0) { level = Severity.Info; }
        if (showConsoleError === void 0) { showConsoleError = true; }
        if (showConsoleError) {
            if ([Severity.Info, Severity.Log].includes(level)) {
                // tslint:disable:no-console
                console.log(message);
            }
            else {
                console.error(message);
            }
        }
        withScope(function (scope) {
            if (fingerprint) {
                scope.setFingerprint(["syntheticMessage_" + fingerprint]);
            }
            captureMessage(message, level);
        });
    };
    /**
     * Set key:value that will be sent as tags data with the event.
     *
     * @param {string} tagKey
     * @param {string} tagValue
     */
    SentryService.prototype.setTag = function (tagKey, tagValue) {
        configureScope(function (scope) {
            scope.setTag(tagKey, tagValue);
        });
    };
    /**
     * Sets context data with the given name.
     *
     * @param {string} tagKey
     * @param {string} tagValue
     */
    SentryService.prototype.setContext = function (key, context) {
        configureScope(function (scope) {
            scope.setContext(key, context);
        });
    };
    /**
     * Sets fingerprint for the current scope. All errors that will be sent after setting it will be grouped under this.
     *
     * @param {string[]} fingerprint
     */
    SentryService.prototype.setFingerprint = function (fingerprint) {
        configureScope(function (scope) {
            scope.addBreadcrumb({
                message: "Adding fingerprint: " + fingerprint.join('|'),
                level: Severity.Info,
            });
            scope.setFingerprint(fingerprint);
        });
    };
    /**
     * Escapes sensitive words to avoid filtering out whole string by Data Scrubber in a places that would return false positives.
     *
     * @param unescapedString String to be escaped, eg. `Reset password`.
     * @returns Escaped string, eg. `Reset pas_word`
     */
    SentryService.prototype.forceSafeString = function (unescapedString) {
        if (typeof unescapedString !== 'string') {
            return unescapedString;
        }
        // IMPORTANT: Escape only specific use cases (eg. 'Reset password' title)
        // to avoid leaking out truly sensitive data ('password' property of registration form).
        // List of words scrubbed by default: https://docs.sentry.io/data-management/sensitive-data/#server-side-scrubbing
        return unescapedString
            .replace(/type=\"password\"/gi, 'type=\"pas_word\"') // input's `type=\"password\"` in breadcrumbs
            .replace(/reset password/gi, 'Reset pas_word')
            .replace(/reset-password/gi, 'reset-pas_word')
            .replace(/reset-pas_word\/.*\)/gi, 'reset-pas_word/CODE_ESCAPED') // remove reset code from url
            .replace(/forgot password/gi, 'Forgot pas_word')
            .replace(/forgot-password/gi, 'forgot-pas_word')
            .replace(/change-phone-password/gi, 'change-phone-pas_word')
            .replace(/change-phone-password/gi, 'change-phone-pas_word')
            .replace(/login-password/gi, 'login-pas_word');
    };
    /**
     * Extracts plain text content from a HTML markup.
     *
     * @param {string} markup
     * @returns {string} extracted text content
     */
    SentryService.prototype.extractPlainText = function (markup) {
        if (typeof markup !== 'string' || !markup.length) {
            return;
        }
        var tempElem = this.platformService.document.createElement('div');
        tempElem.innerHTML = markup;
        return tempElem.textContent || tempElem.innerText || '';
    };
    SentryService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SentryService_Factory() { return new SentryService(i0.ɵɵinject(i1.PlatformService)); }, token: SentryService, providedIn: "root" });
    return SentryService;
}());
export { SentryService };
