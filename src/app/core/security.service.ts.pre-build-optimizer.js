import { of } from 'rxjs';
import * as i0 from "@angular/core";
var SecurityService = /** @class */ (function () {
    function SecurityService() {
        /**
         * During registration and payments, the API expects us to send a code
         * to help identify scammers etc. An example of such a service is Iovation.
         * "Finished" version is emitted if device detection was able to complete within 500ms.
         * Otherwise returns any available code or just an empty string.
         */
        this.securityCode$ = of('');
    }
    SecurityService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SecurityService_Factory() { return new SecurityService(); }, token: SecurityService, providedIn: "root" });
    return SecurityService;
}());
export { SecurityService };
