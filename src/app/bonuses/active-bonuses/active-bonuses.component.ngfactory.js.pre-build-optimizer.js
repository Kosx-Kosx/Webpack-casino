/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
import * as i0 from "./active-bonuses.component.scss.shim.ngstyle";
import * as i1 from "@angular/core";
import * as i2 from "../bonus/bonus.component.ngfactory";
import * as i3 from "../bonus/bonus.component";
import * as i4 from "../bonuses.config";
import * as i5 from "../../modal/modal.service";
import * as i6 from "../../../../node_modules/@angular/material/button/typings/index.ngfactory";
import * as i7 from "@angular/material/button";
import * as i8 from "@angular/cdk/platform";
import * as i9 from "@angular/cdk/a11y";
import * as i10 from "@angular/platform-browser/animations";
import * as i11 from "../../modal-shared/confirm/confirm.directive";
import * as i12 from "@angular/common";
import * as i13 from "../../notifications/inline-notification/inline-notification.component.ngfactory";
import * as i14 from "../../notifications/inline-notification/inline-notification.component";
import * as i15 from "../../notifications/notifications.config";
import * as i16 from "../../notifications/notifications-queue.service";
import * as i17 from "../../user/user-currency.pipe";
import * as i18 from "../../user/user.service";
import * as i19 from "./active-bonuses.component";
import * as i20 from "angulartics2";
import * as i21 from "../../core/bonus.service";
var styles_ActiveBonusesComponent = [i0.styles];
var RenderType_ActiveBonusesComponent = i1.ɵcrt({ encapsulation: 0, styles: styles_ActiveBonusesComponent, data: {} });
export { RenderType_ActiveBonusesComponent as RenderType_ActiveBonusesComponent };
function View_ActiveBonusesComponent_2(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 8, null, null, null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 7, "xc-bonus", [["mode", "active"]], null, null, null, i2.View_BonusComponent_0, i2.RenderType_BonusComponent)), i1.ɵdid(2, 49152, null, 0, i3.BonusComponent, [i4.BONUSES_CONFIG, i5.ModalService], { bonus: [0, "bonus"], mode: [1, "mode"] }, null), (_l()(), i1.ɵeld(3, 0, null, 0, 5, "button", [["mat-button", ""]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], [[null, "xcConfirm"], [null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (i1.ɵnov(_v, 5).loadConfirmComponent() !== false);
        ad = (pd_0 && ad);
    } if (("xcConfirm" === en)) {
        var pd_1 = (($event && _co.cancel(_v.context.$implicit)) !== false);
        ad = (pd_1 && ad);
    } return ad; }, i6.View_MatButton_0, i6.RenderType_MatButton)), i1.ɵdid(4, 180224, null, 0, i7.MatButton, [i1.ElementRef, i8.Platform, i9.FocusMonitor, [2, i10.ANIMATION_MODULE_TYPE]], { disabled: [0, "disabled"], color: [1, "color"] }, null), i1.ɵdid(5, 16384, null, 0, i11.ConfirmDirective, [i5.ModalService], { title: [0, "title"], question: [1, "question"] }, { xcConfirm: "xcConfirm" }), i1.ɵppd(6, 1), i1.ɵpid(131072, i12.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵted(-1, 0, ["Cancel bonus"]))], function (_ck, _v) { var _co = _v.component; var currVal_0 = _v.context.$implicit; var currVal_1 = "active"; _ck(_v, 2, 0, currVal_0, currVal_1); var currVal_4 = _co.cancelling; var currVal_5 = _co.config.activeCancelBtnColor; _ck(_v, 4, 0, currVal_4, currVal_5); var currVal_6 = _v.context.$implicit.name; var currVal_7 = i1.ɵinlineInterpolate(1, "Are you sure you want to cancel your bonus of ", i1.ɵunv(_v, 5, 1, i1.ɵnov(_v, 7).transform(i1.ɵunv(_v, 5, 1, _ck(_v, 6, 0, i1.ɵnov(_v.parent.parent, 0), _v.context.$implicit.balance)))), "?"); _ck(_v, 5, 0, currVal_6, currVal_7); }, function (_ck, _v) { var currVal_2 = (i1.ɵnov(_v, 4).disabled || null); var currVal_3 = (i1.ɵnov(_v, 4)._animationMode === "NoopAnimations"); _ck(_v, 3, 0, currVal_2, currVal_3); }); }
function View_ActiveBonusesComponent_1(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 2, null, null, null, null, null, null, null)), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_ActiveBonusesComponent_2)), i1.ɵdid(2, 278528, null, 0, i12.NgForOf, [i1.ViewContainerRef, i1.TemplateRef, i1.IterableDiffers], { ngForOf: [0, "ngForOf"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonuses; _ck(_v, 2, 0, currVal_0); }, null); }
function View_ActiveBonusesComponent_3(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-inline-notification", [["message", "You do not have any active bonuses. Check the promotions page for our latest offers!"], ["title", "No active bonuses"], ["type", "info"]], null, null, null, i13.View_InlineNotificationComponent_0, i13.RenderType_InlineNotificationComponent)), i1.ɵdid(1, 49152, null, 0, i14.InlineNotificationComponent, [i15.NOTIFICATIONS_CONFIG, i16.NotificationsQueueService], { title: [0, "title"], message: [1, "message"], type: [2, "type"] }, null)], function (_ck, _v) { var currVal_0 = "No active bonuses"; var currVal_1 = "You do not have any active bonuses. Check the promotions page for our latest offers!"; var currVal_2 = "info"; _ck(_v, 1, 0, currVal_0, currVal_1, currVal_2); }, null); }
export function View_ActiveBonusesComponent_0(_l) { return i1.ɵvid(2, [i1.ɵpid(0, i17.UserCurrencyPipe, [i1.LOCALE_ID, i18.UserService]), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_ActiveBonusesComponent_1)), i1.ɵdid(2, 16384, null, 0, i12.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_ActiveBonusesComponent_3)), i1.ɵdid(4, 16384, null, 0, i12.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonuses.length; _ck(_v, 2, 0, currVal_0); var currVal_1 = !_co.bonuses.length; _ck(_v, 4, 0, currVal_1); }, null); }
export function View_ActiveBonusesComponent_Host_0(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-active-bonuses", [], null, null, null, View_ActiveBonusesComponent_0, RenderType_ActiveBonusesComponent)), i1.ɵdid(1, 49152, null, 0, i19.ActiveBonusesComponent, [i4.BONUSES_CONFIG, i20.Angulartics2, i21.BonusService, i16.NotificationsQueueService], null, null)], null, null); }
var ActiveBonusesComponentNgFactory = i1.ɵccf("xc-active-bonuses", i19.ActiveBonusesComponent, View_ActiveBonusesComponent_Host_0, { bonuses: "bonuses" }, {}, []);
export { ActiveBonusesComponentNgFactory as ActiveBonusesComponentNgFactory };