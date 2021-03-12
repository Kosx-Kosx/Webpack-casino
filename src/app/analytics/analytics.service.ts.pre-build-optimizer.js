var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Angulartics2 } from 'angulartics2';
import { PlatformService } from 'app/core/platform.service';
import * as i0 from "@angular/core";
import * as i1 from "angulartics2";
import * as i2 from "../core/platform.service";
var AnalyticsService = /** @class */ (function () {
    function AnalyticsService(angulartics, platformService) {
        this.angulartics = angulartics;
        this.platformService = platformService;
    }
    Object.defineProperty(AnalyticsService.prototype, "googleAnalyticsClientId", {
        get: function () {
            var gaCookie = this.platformService.window.document.cookie
                .split('; ')
                .find(function (cookie) { return cookie.startsWith('_ga'); });
            return gaCookie && gaCookie.match(/(\d{2,}\.\d{2,})/g)[0] || null;
        },
        enumerable: true,
        configurable: true
    });
    AnalyticsService.prototype.send = function (action, trackedProperties) {
        trackedProperties.gaClientId = this.googleAnalyticsClientId;
        this.angulartics.eventTrack.next({
            action: action,
            properties: __assign({}, trackedProperties, { gtmCustom: trackedProperties }),
        });
    };
    AnalyticsService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function AnalyticsService_Factory() { return new AnalyticsService(i0.ɵɵinject(i1.Angulartics2), i0.ɵɵinject(i2.PlatformService)); }, token: AnalyticsService, providedIn: "root" });
    return AnalyticsService;
}());
export { AnalyticsService };
