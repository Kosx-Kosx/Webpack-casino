/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
import * as i0 from "./claimed-bonuses.component.scss.shim.ngstyle";
import * as i1 from "@angular/core";
import * as i2 from "../bonus/bonus.component.ngfactory";
import * as i3 from "../bonus/bonus.component";
import * as i4 from "../bonuses.config";
import * as i5 from "../../modal/modal.service";
import * as i6 from "@angular/common";
import * as i7 from "../../notifications/inline-notification/inline-notification.component.ngfactory";
import * as i8 from "../../notifications/inline-notification/inline-notification.component";
import * as i9 from "../../notifications/notifications.config";
import * as i10 from "../../notifications/notifications-queue.service";
import * as i11 from "./claimed-bonuses.component";
var styles_ClaimedBonusesComponent = [i0.styles];
var RenderType_ClaimedBonusesComponent = i1.ɵcrt({ encapsulation: 0, styles: styles_ClaimedBonusesComponent, data: {} });
export { RenderType_ClaimedBonusesComponent as RenderType_ClaimedBonusesComponent };
function View_ClaimedBonusesComponent_2(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 2, null, null, null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 1, "xc-bonus", [["mode", "claimed"]], null, null, null, i2.View_BonusComponent_0, i2.RenderType_BonusComponent)), i1.ɵdid(2, 49152, null, 0, i3.BonusComponent, [i4.BONUSES_CONFIG, i5.ModalService], { bonus: [0, "bonus"], mode: [1, "mode"] }, null)], function (_ck, _v) { var currVal_0 = _v.context.$implicit; var currVal_1 = "claimed"; _ck(_v, 2, 0, currVal_0, currVal_1); }, null); }
function View_ClaimedBonusesComponent_1(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 2, null, null, null, null, null, null, null)), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_ClaimedBonusesComponent_2)), i1.ɵdid(2, 278528, null, 0, i6.NgForOf, [i1.ViewContainerRef, i1.TemplateRef, i1.IterableDiffers], { ngForOf: [0, "ngForOf"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonuses; _ck(_v, 2, 0, currVal_0); }, null); }
function View_ClaimedBonusesComponent_3(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-inline-notification", [["message", "You have not claimed any bonus yet."], ["title", "No claimed bonuses"], ["type", "info"]], null, null, null, i7.View_InlineNotificationComponent_0, i7.RenderType_InlineNotificationComponent)), i1.ɵdid(1, 49152, null, 0, i8.InlineNotificationComponent, [i9.NOTIFICATIONS_CONFIG, i10.NotificationsQueueService], { title: [0, "title"], message: [1, "message"], type: [2, "type"] }, null)], function (_ck, _v) { var currVal_0 = "No claimed bonuses"; var currVal_1 = "You have not claimed any bonus yet."; var currVal_2 = "info"; _ck(_v, 1, 0, currVal_0, currVal_1, currVal_2); }, null); }
export function View_ClaimedBonusesComponent_0(_l) { return i1.ɵvid(2, [(_l()(), i1.ɵand(16777216, null, null, 1, null, View_ClaimedBonusesComponent_1)), i1.ɵdid(1, 16384, null, 0, i6.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_ClaimedBonusesComponent_3)), i1.ɵdid(3, 16384, null, 0, i6.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonuses.length; _ck(_v, 1, 0, currVal_0); var currVal_1 = !_co.bonuses.length; _ck(_v, 3, 0, currVal_1); }, null); }
export function View_ClaimedBonusesComponent_Host_0(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-claimed-bonuses", [], null, null, null, View_ClaimedBonusesComponent_0, RenderType_ClaimedBonusesComponent)), i1.ɵdid(1, 49152, null, 0, i11.ClaimedBonusesComponent, [], null, null)], null, null); }
var ClaimedBonusesComponentNgFactory = i1.ɵccf("xc-claimed-bonuses", i11.ClaimedBonusesComponent, View_ClaimedBonusesComponent_Host_0, { bonuses: "bonuses" }, {}, []);
export { ClaimedBonusesComponentNgFactory as ClaimedBonusesComponentNgFactory };
