import { HttpClient } from '@angular/common/http';
import { shareReplay, map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var FeatureStatusService = /** @class */ (function () {
    function FeatureStatusService(http) {
        this.http = http;
        this.currentFeatureStatus$ = this.http.get("{{apiEndpoint}}/service-status").pipe(shareReplay(1));
    }
    /**
     * Use to check if deposits and withdrawals should be blocked on the website.
     *
     * Meant to be downloaded only once from the server, so will get the status of first request on demand,
     * and then will just replay it for any other place until site is closed / refreshed.
     *
     * @returns {Observable<boolean>} Observable that emits boolean. If it emits true, do not let user create any transaction.
     */
    FeatureStatusService.prototype.getPaymentMaintenanceModeStatus = function () {
        return this.currentFeatureStatus$.pipe(map(function (v) { return v.payment_maintenance_mode; }));
    };
    FeatureStatusService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function FeatureStatusService_Factory() { return new FeatureStatusService(i0.ɵɵinject(i1.HttpClient)); }, token: FeatureStatusService, providedIn: "root" });
    return FeatureStatusService;
}());
export { FeatureStatusService };
