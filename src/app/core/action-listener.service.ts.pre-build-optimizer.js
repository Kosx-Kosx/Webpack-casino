import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActionService } from './action.service';
import { PlatformService } from './platform.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./action.service";
import * as i3 from "@angular/router";
import * as i4 from "./platform.service";
var ActionListenerService = /** @class */ (function () {
    function ActionListenerService(location, actionService, router, platform) {
        this.location = location;
        this.actionService = actionService;
        this.router = router;
        this.platform = platform;
        platform.window.addEventListener('message', this.listener.bind(this));
    }
    ActionListenerService.prototype.listener = function (event) {
        var data = event.data;
        /* We should not trigger callback when:
          - there is no event data (Relax issue XCAF-1615)
          - the action is our own action (xc-action)
          - there is nothing provided as action for callback
        */
        if (!data || data.type !== 'xc-action' || !data.action) {
            return;
        }
        this.process(data.action, data.params);
    };
    ActionListenerService.prototype.process = function (action, params) {
        if (params === void 0) { params = {}; }
        switch (action) {
            case 'reload':
                return this.platform.location.reload();
            case 'back':
                return this.location.back();
            default:
                var url = this.actionService.getHref(action, params);
                return this.router.navigateByUrl(url);
        }
    };
    ActionListenerService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ActionListenerService_Factory() { return new ActionListenerService(i0.ɵɵinject(i1.Location), i0.ɵɵinject(i2.ActionService), i0.ɵɵinject(i3.Router), i0.ɵɵinject(i4.PlatformService)); }, token: ActionListenerService, providedIn: "root" });
    return ActionListenerService;
}());
export { ActionListenerService };
