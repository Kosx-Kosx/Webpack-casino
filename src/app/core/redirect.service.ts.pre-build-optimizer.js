import { Router, UrlSerializer } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
var RedirectService = /** @class */ (function () {
    function RedirectService(router, serializer) {
        this.router = router;
        this.serializer = serializer;
        this.loginRedirectUrl = null;
    }
    RedirectService.prototype.hasLoginRedirectUrl = function () {
        return this.loginRedirectUrl !== null;
    };
    RedirectService.prototype.setLoginRedirectUrl = function (value) {
        this.loginRedirectUrl = value;
    };
    RedirectService.prototype.getLoginRedirectUrl = function () {
        var loginRedirectUrl = this.loginRedirectUrl;
        this.loginRedirectUrl = null;
        return loginRedirectUrl;
    };
    RedirectService.prototype.getUrlFromCommands = function (commands) {
        var tree = this.router.createUrlTree(commands);
        return this.serializer.serialize(tree);
    };
    RedirectService.prototype.handleLoginRedirectUrl = function () {
        // if we don't have any redirectUrl, we will be able to close the modal by triggering
        // the redirection in the user-state-manager using this string. We still want to stay
        // in the same page, so we will use the current url as redirectUrl
        if (!this.hasLoginRedirectUrl()) {
            this.setLoginRedirectUrl(this.getUrlWithoutModal(this.router.url));
        }
    };
    /**
     * Remove (modal:***) part from the URL.
     * @param {string} url - url string
     * @returns {string} clean url
     */
    RedirectService.prototype.getUrlWithoutModal = function (url) {
        var cleanUrl = url.split('(modal:')[0];
        return cleanUrl;
    };
    RedirectService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function RedirectService_Factory() { return new RedirectService(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i1.UrlSerializer)); }, token: RedirectService, providedIn: "root" });
    return RedirectService;
}());
export { RedirectService };
