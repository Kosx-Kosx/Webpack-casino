import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var BonusService = /** @class */ (function () {
    function BonusService(http) {
        this.http = http;
        this.bonusCancelled$ = new Subject();
    }
    BonusService.prototype.storeBonus = function (bonus) {
        this.storedBonus = bonus;
    };
    BonusService.prototype.useStoredBonus = function () {
        var bonus = this.storedBonus || null;
        this.storedBonus = null;
        return bonus;
    };
    BonusService.prototype.getAvailable = function () {
        return this.http.get("{{apiEndpoint}}/bonuses").pipe(map(function (data) { return data.bonuses; }));
    };
    BonusService.prototype.getAvailableForDeposit = function () {
        return this.http.get("{{apiEndpoint}}/bonuses?deposit").pipe(map(function (data) { return data.bonuses; }));
    };
    BonusService.prototype.getActive = function () {
        return this.http.get("{{apiEndpoint}}/bonuses?active").pipe(map(function (data) { return data.bonuses; }));
    };
    BonusService.prototype.getClaimed = function () {
        return this.http.get("{{apiEndpoint}}/bonuses?claimed").pipe(map(function (data) { return data.bonuses; }));
    };
    BonusService.prototype.claimVoucher = function (code) {
        return this.http.post("{{apiEndpoint}}/use-voucher", { code: code }).pipe(map(function (data) {
            if (!data.success) {
                throw data;
            }
            return data;
        }));
    };
    BonusService.prototype.cancel = function (bonus) {
        var _this = this;
        return this.http.delete("{{apiEndpoint}}/bonuses/" + bonus.id)
            .pipe(tap(function () { return _this.bonusCancelled$.next(); }));
    };
    BonusService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function BonusService_Factory() { return new BonusService(i0.ɵɵinject(i1.HttpClient)); }, token: BonusService, providedIn: "root" });
    return BonusService;
}());
export { BonusService };
