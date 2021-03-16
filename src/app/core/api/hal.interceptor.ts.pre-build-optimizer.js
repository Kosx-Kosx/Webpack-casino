import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
var HalInterceptor = /** @class */ (function () {
    function HalInterceptor() {
    }
    HalInterceptor.prototype.intercept = function (req, next) {
        return next
            .handle(req)
            .pipe(map(function (event) {
            // Flatten HAL resources and OAuth objects
            if (event instanceof HttpResponse
                && (event.url.includes('/oauth')
                    || (
                    // `startsWith` is used because value can include encoding, f.e. `application/hal+json; charset=UTF-8`
                    event.headers.get('content-type')
                        && event.headers.get('content-type').startsWith('application/hal+json')))) {
                // `event.body` is readonly, but we want to replace it with our new object
                event.body = copyAndFlatten(event.body);
            }
            return event;
        }));
    };
    HalInterceptor.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function HalInterceptor_Factory() { return new HalInterceptor(); }, token: HalInterceptor, providedIn: "root" });
    return HalInterceptor;
}());
export { HalInterceptor };
/**
 * Deep copy and flatten a HAL resource.
 *
 * @param resource The HAL resource object.
 */
function copyAndFlatten(resource) {
    // Stop traversing if we hit a scalar
    if (!resource || typeof resource !== 'object') {
        return resource;
    }
    // PHP JSON date is already in ISO 8601 format, just return it
    if (resource.date) {
        // TODO: remove when FAPI-625 and XCAF-1107 are released everywhere
        if (resource.timezone) {
            return resource.date.substr(0, 10) + "T" + resource.date.substr(11, 12) + "Z";
        }
        return resource.date;
    }
    // Traverse down and flatten the HAL objects
    var copy = Array.isArray(resource) ? [] : {};
    // tslint:disable-next-line forin
    for (var prop in resource) {
        switch (prop) {
            case 'key':
            case '_links':
                // Skip HAL links and key name
                break;
            case '_embedded':
            case 'value':
                // Flatten embedded resources
                // tslint:disable-next-line forin
                for (var key in resource[prop]) {
                    copy[key] = copyAndFlatten(resource[prop][key]);
                }
                break;
            default:
                copy[prop] = copyAndFlatten(resource[prop]);
                break;
        }
    }
    return copy;
}
