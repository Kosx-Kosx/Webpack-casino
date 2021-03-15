import { Angulartics2 } from 'angulartics2';
import * as Tracking from 'cherrytech-event-tracking-js-sdk';
import { EventTrackingConfig } from './event-tracking.config';
import * as i0 from "@angular/core";
import * as i1 from "angulartics2";
import * as i2 from "./event-tracking.config";
var Angulartics2EventTracking = /** @class */ (function () {
    function Angulartics2EventTracking(angulartics2, config) {
        var _this = this;
        // Should enable event tracking only if there is config for it.
        if (config) {
            this.tracker = Tracking.createTracker(config.id || 'tracker', config);
            angulartics2.pageTrack
                .pipe(angulartics2.filterDeveloperMode())
                .subscribe(function (page) { return _this.pageTrack(page.path); });
            angulartics2.eventTrack
                .pipe(angulartics2.filterDeveloperMode())
                .subscribe(function (event) { return _this.eventTrack(event.action, event.properties); });
            angulartics2.setUsername
                .pipe(angulartics2.filterDeveloperMode())
                .subscribe(function (username) { return _this.setUsername(username); });
            angulartics2.setUserProperties
                .pipe(angulartics2.filterDeveloperMode())
                .subscribe(function (properties) { return _this.setUserProperties(properties); });
        }
    }
    Angulartics2EventTracking.prototype.pageTrack = function (path) {
        this.tracker.trackPageView({ path: path });
    };
    Angulartics2EventTracking.prototype.eventTrack = function (action, properties) {
        this.tracker.track(action, properties);
    };
    Angulartics2EventTracking.prototype.setUsername = function (username) {
        this.tracker.identify(username);
    };
    Angulartics2EventTracking.prototype.setUserProperties = function (properties) {
        this.tracker.identify(properties.id, properties);
    };
    Angulartics2EventTracking.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function Angulartics2EventTracking_Factory() { return new Angulartics2EventTracking(i0.ɵɵinject(i1.Angulartics2), i0.ɵɵinject(i2.EVENT_TRACKING_CONFIG)); }, token: Angulartics2EventTracking, providedIn: "root" });
    return Angulartics2EventTracking;
}());
export { Angulartics2EventTracking };
