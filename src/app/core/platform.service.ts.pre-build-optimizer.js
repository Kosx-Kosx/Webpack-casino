import { Location as NgLocation } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { EnvConfig } from './environment.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./environment.config";
import * as i3 from "ngx-device-detector";
/**
 * Handle platform specific interaction like DOM manipulation.
 */
var PlatformService = /** @class */ (function () {
    function PlatformService(document, environment, ngLocation, deviceDetector) {
        var _this = this;
        this.document = document;
        this.environment = environment;
        this.ngLocation = ngLocation;
        this.enableAccessibility = function (event) {
            if (event.key === 'Tab') {
                _this.document.body.classList.add('allow-outline');
                _this.window.removeEventListener('keydown', _this.enableAccessibility);
            }
        };
        this.window = this.document.defaultView;
        this.location = this.document.location;
        this.navigator = this.window.navigator;
        // Adding this listener in order to enable the accessibility outline only after the user presses the tab key
        // @see BM-163
        this.window.addEventListener('keydown', this.enableAccessibility);
        // @see https://stackoverflow.com/questions/21825157/internet-explorer-11-detection
        this.isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        // TODO: what about isMobile shouldn't it also be bound?
        this.isDesktop = deviceDetector.isDesktop.bind(deviceDetector);
        this.isTablet = deviceDetector.isTablet.bind(deviceDetector);
    }
    /**
     * Compares the current device info with the mobile application User Agent.
     * @returns `true` if the current platform is a mobile application for iOS or `false` otherwise.
     */
    PlatformService.prototype.isIOSMobileApplication = function () {
        return this.navigator.userAgent.includes('playcherryios');
    };
    /**
     * Create an absolute URL from a relative one.
     *
     * @param url The relative URL.
     */
    PlatformService.prototype.prepareAbsoluteUrl = function (url) {
        return this.location.protocol + "//" + this.location.host + this.ngLocation.prepareExternalUrl(url);
    };
    /**
     * Go to an absolute URL with or without a new history entry.
     *
     * @param url The URL to go to.
     * @param replace `true` to replace the last history entry or `false` to add a new one.
     */
    PlatformService.prototype.gotoAbsoluteUrl = function (url, replace) {
        if (replace === void 0) { replace = false; }
        var method = replace ? 'replace' : 'assign';
        this.location[method](url);
    };
    /**
     * Get the current platform device alias.
     */
    PlatformService.prototype.getDevice = function () {
        return !this.isDesktop() ? 'mobile' : 'desktop';
    };
    /** Generates unique identifier that no other browser tab has ever been given in current browser */
    PlatformService.prototype.generateUniqueTabId = function () {
        var keyName = 'xc-last-tab-index';
        var lastTabIndex = this.window.localStorage.getItem(keyName);
        var currentTabIndex = lastTabIndex ? +lastTabIndex + 1 : 0;
        this.window.localStorage.setItem(keyName, currentTabIndex.toString());
        // Date and random number should be unique enough. Every init of XCAF increases index counter, which main role is for debug.
        // Due to the fact that access performance to localStorage is very slow in compare with in-memory operations
        // it's very likely that when two tabs refresh at the same time then both will have the same tab index
        return Date.now() + "_" + currentTabIndex.toString() + "_" + Math.floor(Math.random() * 10000);
    };
    PlatformService.prototype.getUniqueTabId = function () {
        if (this.browserTabId) {
            return this.browserTabId;
        }
        return this.browserTabId = this.generateUniqueTabId();
    };
    /**
     * Get whether the current platform supports touch input or not.
     */
    PlatformService.prototype.isTouch = function () {
        return this.window['Modernizr'] && this.window['Modernizr'].touchevents
            || !!(this.window.navigator.pointerEnabled && this.window.navigator.maxTouchPoints > 1); // MS Surface
    };
    /**
     * Get DOM element outer width (includes padding, border and margins).
     * Use in no sooner than at ngAfterViewInit stage.
     *
     * @param elem DOM node
     * @returns {Number} outer width in pixels. `0` when node is hidden.
     */
    PlatformService.prototype.outerElemWidth = function (elem) {
        if (!elem) {
            return 0;
        }
        var style = getComputedStyle(elem);
        return style.display === 'none' ? 0 : elem.offsetWidth + parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
    };
    /**
     * Get DOM element outer height (includes padding, border and margins).
     * Use in no sooner than at ngAfterViewInit stage.
     *
     * @param elem DOM node
     * @returns {Number} outer height in pixels. `0` when node is hidden.
     */
    PlatformService.prototype.outerElemHeight = function (elem) {
        if (!elem) {
            return 0;
        }
        var style = getComputedStyle(elem);
        return style.display === 'none' ? 0 : elem.offsetHeight + parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
    };
    /**
     * Load an external script dynamically and insert it in the body.
     */
    PlatformService.prototype.loadExternalScript = function (id, src, reload) {
        var _this = this;
        if (reload === void 0) { reload = false; }
        return new Observable(function (observer) {
            // Complete if already loaded
            var script = _this.document.getElementById(id);
            if (script) {
                if (reload) {
                    _this.document.body.removeChild(script);
                }
                else {
                    observer.next(script);
                    observer.complete();
                    return;
                }
            }
            // Load the script
            script = _this.document.createElement('script');
            script.id = id;
            script.src = src;
            script.async = true;
            script.onerror = function (oError) {
                // Make sure there is an error thrown even when observable doesn't catch it
                console.error('Script error in', oError.srcElement, oError);
                return observer.error.call(observer, oError);
            };
            script.onload = function () {
                observer.next(script);
                observer.complete();
            };
            _this.document.body.appendChild(script);
        });
    };
    /**
     * Attempt to remove service workers on demand.
     * @returns {Promise} Promise that should fulfill when all workers are dead.
     */
    PlatformService.prototype.unregisterServiceWorkers = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var navigator = _this.window.navigator;
            if (navigator && navigator.serviceWorker) {
                return navigator.serviceWorker.getRegistrations()
                    .then(function (registrations) { return Promise.all(registrations.map(function (reg) { return reg.unregister(); })); })
                    .then(resolve, resolve);
            }
            resolve();
        });
    };
    /**
     * Detect if platform is iOS
     * @returns {IOSDeviceName | false}
     */
    PlatformService.prototype.detectIOS = function () {
        switch (navigator.platform) {
            case 'iPad':
                return 'iPad';
            case 'iPhone':
                return 'iPhone';
            case 'iPod':
                return 'iPod';
        }
        return false;
    };
    /**
     * Returns the environment type that app is currently running at.
     *
     * @returns {EnvironmentType} Name of the environment
     */
    PlatformService.prototype.getEnvironmentType = function () {
        var environmentType = 'production';
        if (!this.environment.production) {
            environmentType = 'localhost';
            // Eg. staging.eurolotto.com, staging-xcaf.eurolotto.com, eurolotto-stg-k8s.xcaliber.io
            if (/(staging|stg)/.test(this.window.location.hostname)) {
                environmentType = 'staging';
            }
            // Eg. smc-xcaf-smc-gt-220-sentry.kbox.k8s.xcaliber.io, smc-xcaf-smc-gt-220-sentry.kbox-ext.k8s.xcaliber.io
            else if (/k8s\.xcaliber\.io$/.test(this.window.location.hostname)) {
                environmentType = 'falcon';
            }
        }
        return environmentType;
    };
    PlatformService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function PlatformService_Factory() { return new PlatformService(i0.ɵɵinject(i1.DOCUMENT), i0.ɵɵinject(i2.ENVIRONMENT), i0.ɵɵinject(i1.Location), i0.ɵɵinject(i3.DeviceDetectorService)); }, token: PlatformService, providedIn: "root" });
    return PlatformService;
}());
export { PlatformService };
