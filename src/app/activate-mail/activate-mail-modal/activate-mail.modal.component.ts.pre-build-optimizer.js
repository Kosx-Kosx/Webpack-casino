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
import { AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CloseModalActions } from 'app/modal/close-modal-actions.enum';
import { ModalComponent } from 'app/modal/modal.component';
import { NotificationEnumType, NotificationsQueueService } from 'app/notifications';
import { UserService } from 'app/user';
var ActivateMailModalComponent = /** @class */ (function () {
    function ActivateMailModalComponent(userService, route, angulartics, notifications) {
        this.userService = userService;
        this.route = route;
        this.angulartics = angulartics;
        this.notifications = notifications;
        this.CloseModalActions = CloseModalActions;
    }
    ActivateMailModalComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var code = this.route.snapshot.params.code;
        if (code) {
            var trackedProperties_1 = {
                method: 'email',
            };
            this.userService.activate(code)
                .pipe(untilDestroyed(this))
                .subscribe(function () {
                _this.notifications.showByType(NotificationEnumType.GUEST_ACTIVATION_SUCCESS);
                _this.angulartics.eventTrack.next({
                    action: 'activation_succeed',
                    properties: __assign({}, trackedProperties_1, { gtmCustom: trackedProperties_1 }),
                });
                _this.modal.close();
            }, function () {
                _this.notifications.showByType(NotificationEnumType.GUEST_ACTIVATION_ERROR);
                _this.angulartics.eventTrack.next({
                    action: 'activation_failed',
                    properties: __assign({}, trackedProperties_1, { gtmCustom: trackedProperties_1 }),
                });
                _this.modal.close();
            });
        }
        else {
            // this window is just about open, show the loader and close itself once user activated
            // when user by any change goes here without code, the modal have to close itself as user can't do it on its own
            // We just show the same error that shows when activation is unsuccessful because he's not really activated
            this.notifications.showByType(NotificationEnumType.GUEST_ACTIVATION_ERROR);
            this.modal.close();
        }
    };
    ActivateMailModalComponent.prototype.ngOnDestroy = function () { };
    return ActivateMailModalComponent;
}());
export { ActivateMailModalComponent };
