import { EnvConfig } from './environment.config';
import * as i0 from "@angular/core";
import * as i1 from "./environment.config";
var Logger = /** @class */ (function () {
    function Logger(environment) {
        this.environment = environment;
    }
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.environment.consoleLogs) {
            // tslint:disable:no-console
            console.log.apply(console, args);
        }
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.environment.consoleLogs) {
            // tslint:disable:no-console
            console.warn.apply(console, args);
        }
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.environment.consoleLogs) {
            // tslint:disable:no-console
            console.error.apply(console, args);
        }
    };
    Logger.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function Logger_Factory() { return new Logger(i0.ɵɵinject(i1.ENVIRONMENT)); }, token: Logger, providedIn: "root" });
    return Logger;
}());
export { Logger };
