/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
import * as i0 from "./bonus.component.scss.shim.ngstyle";
import * as i1 from "@angular/core";
import * as i2 from "@angular/common";
import * as i3 from "../../../../node_modules/@angular/material/icon/typings/index.ngfactory";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/tooltip";
import * as i6 from "@angular/cdk/overlay";
import * as i7 from "@angular/cdk/scrolling";
import * as i8 from "@angular/cdk/platform";
import * as i9 from "@angular/cdk/a11y";
import * as i10 from "@angular/cdk/bidi";
import * as i11 from "../../shared/read-more/read-more.component.ngfactory";
import * as i12 from "../../shared/read-more/read-more.component";
import * as i13 from "../../modal/modal.service";
import * as i14 from "../../shared/read-more/read-more.config";
import * as i15 from "../../../../node_modules/@angular/material/progress-bar/typings/index.ngfactory";
import * as i16 from "@angular/material/progress-bar";
import * as i17 from "@angular/platform-browser/animations";
import * as i18 from "../../user/user-currency.pipe";
import * as i19 from "../../user/user.service";
import * as i20 from "@angular/flex-layout/extended";
import * as i21 from "@angular/flex-layout/core";
import * as i22 from "./bonus.component";
import * as i23 from "../bonuses.config";
var styles_BonusComponent = [i0.styles];
var RenderType_BonusComponent = i1.ɵcrt({ encapsulation: 0, styles: styles_BonusComponent, data: {} });
export { RenderType_BonusComponent as RenderType_BonusComponent };
function View_BonusComponent_1(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["manual award from BOU"]))], null, null); }
function View_BonusComponent_2(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(1, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonus.name; _ck(_v, 1, 0, currVal_0); }); }
function View_BonusComponent_3(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 16777216, null, null, 1, null, null, null, null, null, null, null)), i1.ɵdid(1, 540672, null, 0, i2.NgTemplateOutlet, [i1.ViewContainerRef], { ngTemplateOutlet: [0, "ngTemplateOutlet"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var currVal_0 = i1.ɵnov(_v.parent, 29); _ck(_v, 1, 0, currVal_0); }, null); }
function View_BonusComponent_4(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 16777216, null, null, 1, null, null, null, null, null, null, null)), i1.ɵdid(1, 540672, null, 0, i2.NgTemplateOutlet, [i1.ViewContainerRef], { ngTemplateOutlet: [0, "ngTemplateOutlet"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var currVal_0 = i1.ɵnov(_v.parent, 31); _ck(_v, 1, 0, currVal_0); }, null); }
function View_BonusComponent_5(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 16777216, null, null, 1, null, null, null, null, null, null, null)), i1.ɵdid(1, 540672, null, 0, i2.NgTemplateOutlet, [i1.ViewContainerRef], { ngTemplateOutlet: [0, "ngTemplateOutlet"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var currVal_0 = i1.ɵnov(_v.parent, 30); _ck(_v, 1, 0, currVal_0); }, null); }
function View_BonusComponent_7(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "button", [["class", "btn-link terms-link"], ["data-e2e", "bonus-terms-link"], ["type", "button"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.openTerms(_co.bonus) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), i1.ɵted(-1, null, ["Terms and Conditions"]))], null, null); }
function View_BonusComponent_6(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 5, "div", [["class", "bonus-footer"]], null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 2, "div", [["class", "left"]], null, null, null, null, null)), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_7)), i1.ɵdid(3, 16384, null, 0, i2.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵeld(4, 0, [["ref", 1]], null, 1, "div", [["class", "right"]], [[8, "hidden", 0]], null, null, null, null)), i1.ɵncd(null, 0)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonus.terms_and_conditions; _ck(_v, 3, 0, currVal_0); }, function (_ck, _v) { var currVal_1 = (!i1.ɵnov(_v, 4) || (i1.ɵnov(_v, 4).children.length === 0)); _ck(_v, 4, 0, currVal_1); }); }
function View_BonusComponent_8(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 16777216, null, null, 2, "mat-icon", [["class", "disabled-info mat-icon"], ["hideDelay", "1000"], ["matTooltip", "Bonus is not available for you"], ["matTooltipPosition", "left"], ["role", "img"], ["svgIcon", "info"]], [[2, "mat-icon-inline", null]], [[null, "touchstart"], [null, "longpress"], [null, "keydown"], [null, "touchend"]], function (_v, en, $event) { var ad = true; if (("longpress" === en)) {
        var pd_0 = (i1.ɵnov(_v, 2).show() !== false);
        ad = (pd_0 && ad);
    } if (("keydown" === en)) {
        var pd_1 = (i1.ɵnov(_v, 2)._handleKeydown($event) !== false);
        ad = (pd_1 && ad);
    } if (("touchend" === en)) {
        var pd_2 = (i1.ɵnov(_v, 2)._handleTouchend() !== false);
        ad = (pd_2 && ad);
    } if (("touchstart" === en)) {
        var pd_3 = (i1.ɵnov(_v, 2).show() !== false);
        ad = (pd_3 && ad);
    } return ad; }, i3.View_MatIcon_0, i3.RenderType_MatIcon)), i1.ɵdid(1, 638976, null, 0, i4.MatIcon, [i1.ElementRef, i4.MatIconRegistry, [8, null]], { svgIcon: [0, "svgIcon"] }, null), i1.ɵdid(2, 147456, [["disabledInfoTooltip", 4]], 0, i5.MatTooltip, [i6.Overlay, i1.ElementRef, i7.ScrollDispatcher, i1.ViewContainerRef, i1.NgZone, i8.Platform, i9.AriaDescriber, i9.FocusMonitor, i5.MAT_TOOLTIP_SCROLL_STRATEGY, [2, i10.Directionality], [2, i5.MAT_TOOLTIP_DEFAULT_OPTIONS]], { position: [0, "position"], message: [1, "message"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var currVal_1 = "info"; _ck(_v, 1, 0, currVal_1); var currVal_2 = "left"; var currVal_3 = "Bonus is not available for you"; _ck(_v, 2, 0, currVal_2, currVal_3); }, function (_ck, _v) { var currVal_0 = i1.ɵnov(_v, 1).inline; _ck(_v, 0, 0, currVal_0); }); }
function View_BonusComponent_10(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 2, "div", [["class", "active-bonus-description"]], null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 1, "xc-read-more", [], null, null, null, i11.View_ReadMoreComponent_0, i11.RenderType_ReadMoreComponent)), i1.ɵdid(2, 573440, null, 0, i12.ReadMoreComponent, [i13.ModalService, i14.READ_MORE_CONFIG, i1.LOCALE_ID], { content: [0, "content"], title: [1, "title"], limit: [2, "limit"], limitJa: [3, "limitJa"], completeWords: [4, "completeWords"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonus.description; var currVal_1 = _co.bonus.name; var currVal_2 = 200; var currVal_3 = 90; var currVal_4 = true; _ck(_v, 2, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4); }, null); }
function View_BonusComponent_9(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 5, "div", [["class", "bonus-progress"]], null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 1, "mat-progress-bar", [["aria-valuemax", "100"], ["aria-valuemin", "0"], ["class", "mat-progress-bar"], ["role", "progressbar"]], [[1, "aria-valuenow", 0], [1, "mode", 0], [2, "_mat-animation-noopable", null]], null, null, i15.View_MatProgressBar_0, i15.RenderType_MatProgressBar)), i1.ɵdid(2, 49152, null, 0, i16.MatProgressBar, [i1.ElementRef, [2, i17.ANIMATION_MODULE_TYPE], [2, i16.MAT_PROGRESS_BAR_LOCATION]], { value: [0, "value"] }, null), (_l()(), i1.ɵeld(3, 0, null, null, 2, "span", [["class", "bonus-value wagered-percent"]], null, null, null, null, null)), (_l()(), i1.ɵted(4, null, ["", "%"])), i1.ɵppd(5, 2), (_l()(), i1.ɵeld(6, 0, null, null, 15, "div", [["class", "bonus-details"]], null, null, null, null, null)), (_l()(), i1.ɵeld(7, 0, null, null, 8, "div", [["class", "bonus-detail"]], null, null, null, null, null)), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_10)), i1.ɵdid(9, 16384, null, 0, i2.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵeld(10, 0, null, null, 1, "span", [["class", "bonus-label"]], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Amount received:"])), (_l()(), i1.ɵeld(12, 0, null, null, 3, "span", [["class", "bonus-value"]], null, null, null, null, null)), (_l()(), i1.ɵted(13, null, ["", ""])), i1.ɵppd(14, 1), i1.ɵpid(131072, i2.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵeld(16, 0, null, null, 5, "div", [["class", "bonus-detail"]], null, null, null, null, null)), (_l()(), i1.ɵeld(17, 0, null, null, 1, "span", [["class", "bonus-label"]], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Expires:"])), (_l()(), i1.ɵeld(19, 0, null, null, 2, "span", [["class", "bonus-value"]], null, null, null, null, null)), (_l()(), i1.ɵted(20, null, ["", ""])), i1.ɵppd(21, 2)], function (_ck, _v) { var _co = _v.component; var currVal_3 = _co.bonus.wagered; _ck(_v, 2, 0, currVal_3); var currVal_5 = (_co.config.activeBonusDescription && _co.bonus.description); _ck(_v, 9, 0, currVal_5); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = i1.ɵnov(_v, 2).value; var currVal_1 = i1.ɵnov(_v, 2).mode; var currVal_2 = (i1.ɵnov(_v, 2)._animationMode === "NoopAnimations"); _ck(_v, 1, 0, currVal_0, currVal_1, currVal_2); var currVal_4 = i1.ɵunv(_v, 4, 0, _ck(_v, 5, 0, i1.ɵnov(_v.parent, 0), _co.bonus.wagered, "1.0-2")); _ck(_v, 4, 0, currVal_4); var currVal_6 = i1.ɵunv(_v, 13, 0, i1.ɵnov(_v, 15).transform(i1.ɵunv(_v, 13, 0, _ck(_v, 14, 0, i1.ɵnov(_v.parent, 1), _co.bonus.amount)))); _ck(_v, 13, 0, currVal_6); var currVal_7 = i1.ɵunv(_v, 20, 0, _ck(_v, 21, 0, i1.ɵnov(_v.parent, 2), _co.bonus.expiry_date, "dd/MM/yyyy")); _ck(_v, 20, 0, currVal_7); }); }
function View_BonusComponent_12(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-read-more", [], null, null, null, i11.View_ReadMoreComponent_0, i11.RenderType_ReadMoreComponent)), i1.ɵdid(1, 573440, null, 0, i12.ReadMoreComponent, [i13.ModalService, i14.READ_MORE_CONFIG, i1.LOCALE_ID], { content: [0, "content"], title: [1, "title"], limit: [2, "limit"], limitJa: [3, "limitJa"], completeWords: [4, "completeWords"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonus.description; var currVal_1 = _co.bonus.name; var currVal_2 = 200; var currVal_3 = 90; var currVal_4 = true; _ck(_v, 1, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4); }, null); }
function View_BonusComponent_13(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "div", [["class", "bonus-description"]], null, null, null, null, null)), (_l()(), i1.ɵted(1, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonus.description; _ck(_v, 1, 0, currVal_0); }); }
function View_BonusComponent_11(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_12)), i1.ɵdid(1, 16384, null, 0, i2.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_13)), i1.ɵdid(3, 16384, null, 0, i2.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.config.readMoreEnabled; _ck(_v, 1, 0, currVal_0); var currVal_1 = !_co.config.readMoreEnabled; _ck(_v, 3, 0, currVal_1); }, null); }
function View_BonusComponent_15(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["bonus"]))], null, null); }
function View_BonusComponent_16(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["bonus_money"]))], null, null); }
function View_BonusComponent_17(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["free_spins"]))], null, null); }
function View_BonusComponent_18(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["ticket_bonus"]))], null, null); }
function View_BonusComponent_19(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["prepaid_ticket"]))], null, null); }
function View_BonusComponent_20(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["real_money"]))], null, null); }
function View_BonusComponent_21(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(1, null, ["", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.bonus.reward; _ck(_v, 1, 0, currVal_0); }); }
function View_BonusComponent_14(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 32, "div", [["class", "bonus-details"]], null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 5, "div", [["class", "bonus-detail"]], null, null, null, null, null)), (_l()(), i1.ɵeld(2, 0, null, null, 1, "span", [["class", "bonus-label"]], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Date:"])), (_l()(), i1.ɵeld(4, 0, null, null, 2, "span", [["class", "bonus-value"]], null, null, null, null, null)), (_l()(), i1.ɵted(5, null, ["", ""])), i1.ɵppd(6, 2), (_l()(), i1.ɵeld(7, 0, null, null, 18, "div", [["class", "bonus-detail"]], null, null, null, null, null)), (_l()(), i1.ɵeld(8, 0, null, null, 1, "span", [["class", "bonus-label"]], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Type:"])), (_l()(), i1.ɵeld(10, 0, null, null, 15, "span", [["class", "bonus-value"]], null, null, null, null, null)), i1.ɵdid(11, 16384, null, 0, i2.NgSwitch, [], { ngSwitch: [0, "ngSwitch"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_15)), i1.ɵdid(13, 278528, null, 0, i2.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_16)), i1.ɵdid(15, 278528, null, 0, i2.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_17)), i1.ɵdid(17, 278528, null, 0, i2.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_18)), i1.ɵdid(19, 278528, null, 0, i2.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_19)), i1.ɵdid(21, 278528, null, 0, i2.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_20)), i1.ɵdid(23, 278528, null, 0, i2.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_21)), i1.ɵdid(25, 16384, null, 0, i2.NgSwitchDefault, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], null, null), (_l()(), i1.ɵeld(26, 0, null, null, 6, "div", [["class", "bonus-detail"]], null, null, null, null, null)), (_l()(), i1.ɵeld(27, 0, null, null, 1, "span", [["class", "bonus-label"]], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Amount:"])), (_l()(), i1.ɵeld(29, 0, null, null, 3, "span", [["class", "bonus-value"]], null, null, null, null, null)), (_l()(), i1.ɵted(30, null, ["", ""])), i1.ɵppd(31, 1), i1.ɵpid(131072, i2.AsyncPipe, [i1.ChangeDetectorRef])], function (_ck, _v) { var _co = _v.component; var currVal_1 = _co.bonus.reward; _ck(_v, 11, 0, currVal_1); var currVal_2 = "bonus"; _ck(_v, 13, 0, currVal_2); var currVal_3 = "bonus_money"; _ck(_v, 15, 0, currVal_3); var currVal_4 = "free_spins"; _ck(_v, 17, 0, currVal_4); var currVal_5 = "ticket_bonus"; _ck(_v, 19, 0, currVal_5); var currVal_6 = "prepaid_ticket"; _ck(_v, 21, 0, currVal_6); var currVal_7 = "real_money"; _ck(_v, 23, 0, currVal_7); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = i1.ɵunv(_v, 5, 0, _ck(_v, 6, 0, i1.ɵnov(_v.parent, 2), _co.bonus.activated_date, "dd/MM/yyyy")); _ck(_v, 5, 0, currVal_0); var currVal_8 = i1.ɵunv(_v, 30, 0, i1.ɵnov(_v, 32).transform(i1.ɵunv(_v, 30, 0, _ck(_v, 31, 0, i1.ɵnov(_v.parent, 1), _co.bonus.amount)))); _ck(_v, 30, 0, currVal_8); }); }
export function View_BonusComponent_0(_l) { return i1.ɵvid(2, [i1.ɵpid(0, i2.DecimalPipe, [i1.LOCALE_ID]), i1.ɵpid(0, i18.UserCurrencyPipe, [i1.LOCALE_ID, i19.UserService]), i1.ɵpid(0, i2.DatePipe, [i1.LOCALE_ID]), (_l()(), i1.ɵeld(3, 0, null, null, 25, "div", [["class", "bonus-container"]], [[2, "disabled", null]], null, null, null, null)), i1.ɵprd(512, null, i2.ɵNgClassImpl, i2.ɵNgClassR2Impl, [i1.IterableDiffers, i1.KeyValueDiffers, i1.ElementRef, i1.Renderer2]), i1.ɵdid(5, 278528, null, 0, i2.NgClass, [i2.ɵNgClassImpl], { klass: [0, "klass"], ngClass: [1, "ngClass"] }, null), i1.ɵdid(6, 933888, null, 0, i20.DefaultClassDirective, [i1.ElementRef, i21.StyleUtils, i21.MediaMarshaller, i2.ɵNgClassImpl, [6, i2.NgClass]], { ngClass: [0, "ngClass"], klass: [1, "klass"] }, null), (_l()(), i1.ɵeld(7, 0, null, null, 17, "div", [["class", "bonus-content-wrapper"]], null, null, null, null, null)), (_l()(), i1.ɵeld(8, 0, null, null, 1, "div", [["class", "bonus-thumb"]], null, null, null, null, null)), (_l()(), i1.ɵeld(9, 0, null, null, 0, "img", [["class", "mw-100"]], [[8, "src", 4]], null, null, null, null)), (_l()(), i1.ɵeld(10, 0, null, null, 14, "div", [["class", "bonus-content"]], null, null, null, null, null)), (_l()(), i1.ɵeld(11, 0, null, null, 5, "h4", [["class", "bonus-name"]], null, null, null, null, null)), i1.ɵdid(12, 16384, null, 0, i2.NgSwitch, [], { ngSwitch: [0, "ngSwitch"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_1)), i1.ɵdid(14, 278528, null, 0, i2.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_2)), i1.ɵdid(16, 16384, null, 0, i2.NgSwitchDefault, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], null, null), (_l()(), i1.ɵeld(17, 0, null, null, 7, null, null, null, null, null, null, null)), i1.ɵdid(18, 16384, null, 0, i2.NgSwitch, [], { ngSwitch: [0, "ngSwitch"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_3)), i1.ɵdid(20, 278528, null, 0, i2.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_4)), i1.ɵdid(22, 278528, null, 0, i2.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_5)), i1.ɵdid(24, 16384, null, 0, i2.NgSwitchDefault, [i1.ViewContainerRef, i1.TemplateRef, i2.NgSwitch], null, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_6)), i1.ɵdid(26, 16384, null, 0, i2.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_BonusComponent_8)), i1.ɵdid(28, 16384, null, 0, i2.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(0, [["active", 2]], null, 0, null, View_BonusComponent_9)), (_l()(), i1.ɵand(0, [["available", 2]], null, 0, null, View_BonusComponent_11)), (_l()(), i1.ɵand(0, [["claimed", 2]], null, 0, null, View_BonusComponent_14))], function (_ck, _v) { var _co = _v.component; var currVal_1 = "bonus-container"; var currVal_2 = _co.mode; _ck(_v, 5, 0, currVal_1, currVal_2); var currVal_3 = _co.mode; var currVal_4 = "bonus-container"; _ck(_v, 6, 0, currVal_3, currVal_4); var currVal_6 = _co.bonus.name; _ck(_v, 12, 0, currVal_6); var currVal_7 = "manual award from BOU"; _ck(_v, 14, 0, currVal_7); var currVal_8 = _co.mode; _ck(_v, 18, 0, currVal_8); var currVal_9 = "active"; _ck(_v, 20, 0, currVal_9); var currVal_10 = "claimed"; _ck(_v, 22, 0, currVal_10); var currVal_11 = (_co.mode !== "claimed"); _ck(_v, 26, 0, currVal_11); var currVal_12 = _co.isDisabled; _ck(_v, 28, 0, currVal_12); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.isDisabled; _ck(_v, 3, 0, currVal_0); var currVal_5 = (_co.bonus.image || "assets/images/bonus-symbol.png"); _ck(_v, 9, 0, currVal_5); }); }
export function View_BonusComponent_Host_0(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-bonus", [], null, null, null, View_BonusComponent_0, RenderType_BonusComponent)), i1.ɵdid(1, 49152, null, 0, i22.BonusComponent, [i23.BONUSES_CONFIG, i13.ModalService], null, null)], null, null); }
var BonusComponentNgFactory = i1.ɵccf("xc-bonus", i22.BonusComponent, View_BonusComponent_Host_0, { bonus: "bonus", mode: "mode" }, {}, ["*"]);
export { BonusComponentNgFactory as BonusComponentNgFactory };
