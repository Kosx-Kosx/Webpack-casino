import { EventEmitter } from '@angular/core';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
export var ModalEvents;
(function (ModalEvents) {
    ModalEvents["termsModalOpen"] = "on-terms-modal-open";
    ModalEvents["termsModalClose"] = "on-terms-modal-close";
    ModalEvents["depositModalClose"] = "on-deposit-modal-close";
})(ModalEvents || (ModalEvents = {}));
/**
 * TODO: this global event manager was created in haste finish it of when there will be some time.
 */
var EventManagerService = /** @class */ (function () {
    function EventManagerService() {
        this.eventEmitter = new EventEmitter();
    }
    EventManagerService.prototype.on = function (type) {
        return this.eventEmitter.pipe(filter(function (event) { return event.type === type; }));
    };
    EventManagerService.prototype.emit = function (type, payload) {
        if (payload === void 0) { payload = null; }
        this.eventEmitter.emit({ type: type, payload: payload });
    };
    EventManagerService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function EventManagerService_Factory() { return new EventManagerService(); }, token: EventManagerService, providedIn: "root" });
    return EventManagerService;
}());
export { EventManagerService };
