/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
import * as i0 from "./casino-game.component.scss.shim.ngstyle";
import * as i1 from "@angular/core";
import * as i2 from "@angular/router";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/tooltip";
import * as i5 from "@angular/cdk/overlay";
import * as i6 from "@angular/cdk/scrolling";
import * as i7 from "@angular/cdk/platform";
import * as i8 from "@angular/cdk/a11y";
import * as i9 from "@angular/cdk/bidi";
import * as i10 from "../../../node_modules/@angular/material/icon/typings/index.ngfactory";
import * as i11 from "@angular/material/icon";
import * as i12 from "../shared/go-to-deposit.directive";
import * as i13 from "../core/action.service";
import * as i14 from "../panic/panic-counter-button/panic-counter-button.component.ngfactory";
import * as i15 from "../panic/panic-counter-button/panic-counter-button.component";
import * as i16 from "../panic/panic.service";
import * as i17 from "../core/platform.service";
import * as i18 from "../shared/fluid-container/fluid-container.component.ngfactory";
import * as i19 from "../shared/fluid-container/fluid-container.component";
import * as i20 from "../game-vendors/evolution/evolution-game-adapter/evolution-game-adapter.component.ngfactory";
import * as i21 from "../game-vendors/evolution/evolution-game-adapter/evolution-game-adapter.component";
import * as i22 from "../game-vendors/netent/netent.component.ngfactory";
import * as i23 from "../game-vendors/netent/netent.component";
import * as i24 from "./game-redirection.service";
import * as i25 from "../core/history.service";
import * as i26 from "../reality-check/reality-check.service";
import * as i27 from "../core/sentry/sentry.service";
import * as i28 from "../user/user.service";
import * as i29 from "../game-vendors/playngo/playngo.component.ngfactory";
import * as i30 from "../game-vendors/playngo/playngo.component";
import * as i31 from "../game-vendors/playngo/playngo.service";
import * as i32 from "../game-vendors/game-iframe/game-iframe.component.ngfactory";
import * as i33 from "../game-vendors/game-iframe/game-iframe.component";
import * as i34 from "../game-vendors/game-iframe/game-iframe.config";
import * as i35 from "../cooling-period/cool-off-overlay/cool-off-overlay.component.ngfactory";
import * as i36 from "../cooling-period/cool-off-overlay/cool-off-overlay.component";
import * as i37 from "../cooling-period/cooling-period.service";
import * as i38 from "../panic/panic-drag-button/panic-drag-button.component.ngfactory";
import * as i39 from "../panic/panic-drag-button/panic-drag-button.component";
import * as i40 from "../layout/layout.config";
import * as i41 from "../shared/loader/loader.component.ngfactory";
import * as i42 from "../shared/loader/loader.component";
import * as i43 from "../reality-check/reality-check-hide/reality-check-hide.component.ngfactory";
import * as i44 from "../reality-check/reality-check-hide/reality-check-hide.component";
import * as i45 from "../reality-check/reality-check.config";
import * as i46 from "./casino-game-sync.service";
import * as i47 from "../broadcast-channel/broadcast-channel.service";
import * as i48 from "../core/jurisdiction.service";
import * as i49 from "./casino-game.component";
import * as i50 from "../analytics/analytics.service";
import * as i51 from "../layout/layout.service";
import * as i52 from "../modal/modal.service";
import * as i53 from "../core/route.service";
import * as i54 from "../welcome-back/welcome-back.service";
import * as i55 from "apollo-angular";
import * as i56 from "../compliance/compliance.service";
import * as i57 from "../notifications/notifications-queue.service";
import * as i58 from "./casino-game.config";
var styles_CasinoGameComponent = [i0.styles];
var RenderType_CasinoGameComponent = i1.ɵcrt({ encapsulation: 0, styles: styles_CasinoGameComponent, data: {} });
export { RenderType_CasinoGameComponent as RenderType_CasinoGameComponent };
function View_CasinoGameComponent_2(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 0, null, null, null, null, null, null, null))], null, null); }
function View_CasinoGameComponent_3(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Playing for real money"]))], null, null); }
function View_CasinoGameComponent_4(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Playing for fun"]))], null, null); }
function View_CasinoGameComponent_5(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 5, null, null, null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 0, "br", [], null, null, null, null, null)), (_l()(), i1.ɵeld(2, 0, null, null, 3, "a", [], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], function (_v, en, $event) { var ad = true; if (("click" === en)) {
        var pd_0 = (i1.ɵnov(_v, 3).onClick($event.button, $event.ctrlKey, $event.metaKey, $event.shiftKey) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), i1.ɵdid(3, 671744, null, 0, i2.RouterLinkWithHref, [i2.Router, i2.ActivatedRoute, i3.LocationStrategy], { routerLink: [0, "routerLink"] }, null), i1.ɵpad(4, 1), (_l()(), i1.ɵted(-1, null, ["Responsible Gaming"]))], function (_ck, _v) { var currVal_2 = _ck(_v, 4, 0, "/info/responsible-gaming"); _ck(_v, 3, 0, currVal_2); }, function (_ck, _v) { var currVal_0 = i1.ɵnov(_v, 3).target; var currVal_1 = i1.ɵnov(_v, 3).href; _ck(_v, 2, 0, currVal_0, currVal_1); }); }
function View_CasinoGameComponent_6(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 16777216, null, null, 7, "div", [["class", "control-button"], ["container", "body"], ["data-e2e", "game-button-focus-mode"], ["matTooltip", "Toggle focus mode"], ["matTooltipPosition", "left"]], null, [[null, "longpress"], [null, "keydown"], [null, "touchend"]], function (_v, en, $event) { var ad = true; if (("longpress" === en)) {
        var pd_0 = (i1.ɵnov(_v, 1).show() !== false);
        ad = (pd_0 && ad);
    } if (("keydown" === en)) {
        var pd_1 = (i1.ɵnov(_v, 1)._handleKeydown($event) !== false);
        ad = (pd_1 && ad);
    } if (("touchend" === en)) {
        var pd_2 = (i1.ɵnov(_v, 1)._handleTouchend() !== false);
        ad = (pd_2 && ad);
    } return ad; }, null, null)), i1.ɵdid(1, 147456, null, 0, i4.MatTooltip, [i5.Overlay, i1.ElementRef, i6.ScrollDispatcher, i1.ViewContainerRef, i1.NgZone, i7.Platform, i8.AriaDescriber, i8.FocusMonitor, i4.MAT_TOOLTIP_SCROLL_STRATEGY, [2, i9.Directionality], [2, i4.MAT_TOOLTIP_DEFAULT_OPTIONS]], { position: [0, "position"], message: [1, "message"] }, null), (_l()(), i1.ɵeld(2, 0, null, null, 2, "mat-icon", [["class", "btn-focus-mode mat-icon"], ["role", "img"], ["svgIcon", "fullscreen"]], [[8, "hidden", 0], [2, "mat-icon-inline", null]], [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.toggleFocusMode() !== false);
        ad = (pd_0 && ad);
    } return ad; }, i10.View_MatIcon_0, i10.RenderType_MatIcon)), i1.ɵdid(3, 638976, null, 0, i11.MatIcon, [i1.ElementRef, i11.MatIconRegistry, [8, null]], { svgIcon: [0, "svgIcon"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵeld(5, 0, null, null, 2, "mat-icon", [["class", "btn-focus-mode mat-icon"], ["role", "img"], ["svgIcon", "fullscreen-exit"]], [[8, "hidden", 0], [2, "mat-icon-inline", null]], [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.toggleFocusMode() !== false);
        ad = (pd_0 && ad);
    } return ad; }, i10.View_MatIcon_0, i10.RenderType_MatIcon)), i1.ɵdid(6, 638976, null, 0, i11.MatIcon, [i1.ElementRef, i11.MatIconRegistry, [8, null]], { svgIcon: [0, "svgIcon"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var currVal_0 = "left"; var currVal_1 = "Toggle focus mode"; _ck(_v, 1, 0, currVal_0, currVal_1); var currVal_4 = "fullscreen"; _ck(_v, 3, 0, currVal_4); var currVal_7 = "fullscreen-exit"; _ck(_v, 6, 0, currVal_7); }, function (_ck, _v) { var _co = _v.component; var currVal_2 = i1.ɵunv(_v, 2, 0, i1.ɵnov(_v, 4).transform(_co.layoutService.focusModeIsActive$)); var currVal_3 = i1.ɵnov(_v, 3).inline; _ck(_v, 2, 0, currVal_2, currVal_3); var currVal_5 = !i1.ɵunv(_v, 5, 0, i1.ɵnov(_v, 7).transform(_co.layoutService.focusModeIsActive$)); var currVal_6 = i1.ɵnov(_v, 6).inline; _ck(_v, 5, 0, currVal_5, currVal_6); }); }
function View_CasinoGameComponent_7(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 16777216, null, null, 4, "div", [["class", "control-button"], ["container", "body"], ["data-e2e", "game-button-deposit"], ["matTooltip", "Make deposit"], ["matTooltipPosition", "left"]], null, [[null, "longpress"], [null, "keydown"], [null, "touchend"]], function (_v, en, $event) { var ad = true; if (("longpress" === en)) {
        var pd_0 = (i1.ɵnov(_v, 1).show() !== false);
        ad = (pd_0 && ad);
    } if (("keydown" === en)) {
        var pd_1 = (i1.ɵnov(_v, 1)._handleKeydown($event) !== false);
        ad = (pd_1 && ad);
    } if (("touchend" === en)) {
        var pd_2 = (i1.ɵnov(_v, 1)._handleTouchend() !== false);
        ad = (pd_2 && ad);
    } return ad; }, null, null)), i1.ɵdid(1, 147456, null, 0, i4.MatTooltip, [i5.Overlay, i1.ElementRef, i6.ScrollDispatcher, i1.ViewContainerRef, i1.NgZone, i7.Platform, i8.AriaDescriber, i8.FocusMonitor, i4.MAT_TOOLTIP_SCROLL_STRATEGY, [2, i9.Directionality], [2, i4.MAT_TOOLTIP_DEFAULT_OPTIONS]], { position: [0, "position"], message: [1, "message"] }, null), (_l()(), i1.ɵeld(2, 0, null, null, 2, "mat-icon", [["class", "btn-deposit mat-icon"], ["role", "img"], ["svgIcon", "deposit"], ["xcGoToDeposit", ""]], [[2, "mat-icon-inline", null]], [[null, "click"]], function (_v, en, $event) { var ad = true; if (("click" === en)) {
        var pd_0 = (i1.ɵnov(_v, 4).onClick() !== false);
        ad = (pd_0 && ad);
    } return ad; }, i10.View_MatIcon_0, i10.RenderType_MatIcon)), i1.ɵdid(3, 638976, null, 0, i11.MatIcon, [i1.ElementRef, i11.MatIconRegistry, [8, null]], { svgIcon: [0, "svgIcon"] }, null), i1.ɵdid(4, 16384, null, 0, i12.GoToDepositDirective, [i13.ActionService, i2.Router], null, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var currVal_0 = "left"; var currVal_1 = "Make deposit"; _ck(_v, 1, 0, currVal_0, currVal_1); var currVal_3 = "deposit"; _ck(_v, 3, 0, currVal_3); }, function (_ck, _v) { var currVal_2 = i1.ɵnov(_v, 3).inline; _ck(_v, 2, 0, currVal_2); }); }
function View_CasinoGameComponent_8(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 16777216, null, null, 7, "a", [["class", "control-button"], ["container", "body"], ["data-e2e", "game-button-search"], ["matTooltip", "Search games"], ["matTooltipPosition", "left"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"], [null, "longpress"], [null, "keydown"], [null, "touchend"]], function (_v, en, $event) { var ad = true; if (("click" === en)) {
        var pd_0 = (i1.ɵnov(_v, 1).onClick($event.button, $event.ctrlKey, $event.metaKey, $event.shiftKey) !== false);
        ad = (pd_0 && ad);
    } if (("longpress" === en)) {
        var pd_1 = (i1.ɵnov(_v, 5).show() !== false);
        ad = (pd_1 && ad);
    } if (("keydown" === en)) {
        var pd_2 = (i1.ɵnov(_v, 5)._handleKeydown($event) !== false);
        ad = (pd_2 && ad);
    } if (("touchend" === en)) {
        var pd_3 = (i1.ɵnov(_v, 5)._handleTouchend() !== false);
        ad = (pd_3 && ad);
    } return ad; }, null, null)), i1.ɵdid(1, 671744, null, 0, i2.RouterLinkWithHref, [i2.Router, i2.ActivatedRoute, i3.LocationStrategy], { routerLink: [0, "routerLink"] }, null), i1.ɵpod(2, { aside: 0 }), i1.ɵpod(3, { outlets: 0 }), i1.ɵpad(4, 2), i1.ɵdid(5, 147456, null, 0, i4.MatTooltip, [i5.Overlay, i1.ElementRef, i6.ScrollDispatcher, i1.ViewContainerRef, i1.NgZone, i7.Platform, i8.AriaDescriber, i8.FocusMonitor, i4.MAT_TOOLTIP_SCROLL_STRATEGY, [2, i9.Directionality], [2, i4.MAT_TOOLTIP_DEFAULT_OPTIONS]], { position: [0, "position"], message: [1, "message"] }, null), (_l()(), i1.ɵeld(6, 0, null, null, 1, "mat-icon", [["class", "btn-search mat-icon"], ["role", "img"], ["svgIcon", "search"]], [[2, "mat-icon-inline", null]], null, null, i10.View_MatIcon_0, i10.RenderType_MatIcon)), i1.ɵdid(7, 638976, null, 0, i11.MatIcon, [i1.ElementRef, i11.MatIconRegistry, [8, null]], { svgIcon: [0, "svgIcon"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var currVal_2 = _ck(_v, 4, 0, "", _ck(_v, 3, 0, _ck(_v, 2, 0, "search"))); _ck(_v, 1, 0, currVal_2); var currVal_3 = "left"; var currVal_4 = "Search games"; _ck(_v, 5, 0, currVal_3, currVal_4); var currVal_6 = "search"; _ck(_v, 7, 0, currVal_6); }, function (_ck, _v) { var currVal_0 = i1.ɵnov(_v, 1).target; var currVal_1 = i1.ɵnov(_v, 1).href; _ck(_v, 0, 0, currVal_0, currVal_1); var currVal_5 = i1.ɵnov(_v, 7).inline; _ck(_v, 6, 0, currVal_5); }); }
function View_CasinoGameComponent_9(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-panic-counter-button", [], null, null, null, i14.View_PanicCounterButtonComponent_0, i14.RenderType_PanicCounterButtonComponent)), i1.ɵdid(1, 49152, null, 0, i15.PanicCounterButtonComponent, [i16.PanicService, i17.PlatformService], null, null)], null, null); }
function View_CasinoGameComponent_1(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 46, null, null, null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, [[2, 0], ["wrapperElem", 1]], null, 45, "div", [["class", "wrapper"]], [[2, "focus-mode-active", null]], null, null, null, null)), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵeld(3, 0, [[1, 0], ["headerElem", 1]], null, 3, "header", [], null, null, null, null, null)), (_l()(), i1.ɵeld(4, 0, null, null, 2, "h1", [["class", "title"]], null, null, null, null, null)), (_l()(), i1.ɵted(5, null, [" ", " "])), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵeld(7, 0, [[5, 0], ["gameViewElem", 1]], null, 39, "div", [["class", "game-view"]], null, null, null, null, null)), (_l()(), i1.ɵeld(8, 0, null, null, 23, "div", [], null, null, null, null, null)), (_l()(), i1.ɵeld(9, 0, null, null, 7, "xc-fluid-container", [], [[2, "no-pointer", null], [4, "width", "px"], [4, "height", "px"]], null, null, i18.View_FluidContainerComponent_0, i18.RenderType_FluidContainerComponent)), i1.ɵdid(10, 770048, null, 0, i19.FluidContainerComponent, [i17.PlatformService, i1.ChangeDetectorRef], { verticalMargin: [0, "verticalMargin"], horizontalMargin: [1, "horizontalMargin"], minWidth: [2, "minWidth"], minHeight: [3, "minHeight"], container: [4, "container"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, 0, 1, null, View_CasinoGameComponent_2)), i1.ɵdid(16, 540672, null, 0, i3.NgTemplateOutlet, [i1.ViewContainerRef], { ngTemplateOutlet: [0, "ngTemplateOutlet"] }, null), (_l()(), i1.ɵeld(17, 0, [[4, 0], ["footerElem", 1]], null, 14, "footer", [], null, null, null, null, null)), (_l()(), i1.ɵeld(18, 0, null, null, 6, "span", [], null, null, null, null, null)), i1.ɵdid(19, 16384, null, 0, i3.NgSwitch, [], { ngSwitch: [0, "ngSwitch"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_3)), i1.ɵdid(22, 278528, null, 0, i3.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i3.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_4)), i1.ɵdid(24, 16384, null, 0, i3.NgSwitchDefault, [i1.ViewContainerRef, i1.TemplateRef, i3.NgSwitch], null, null), (_l()(), i1.ɵeld(25, 0, null, null, 3, "span", [["class", "system-time"]], null, null, null, null, null)), (_l()(), i1.ɵted(26, null, ["", ""])), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), i1.ɵppd(28, 2), (_l()(), i1.ɵand(16777216, null, null, 2, null, View_CasinoGameComponent_5)), i1.ɵdid(30, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵeld(32, 0, [[3, 0], ["controlsElem", 1]], null, 14, "aside", [], null, null, null, null, null)), (_l()(), i1.ɵeld(33, 16777216, null, null, 3, "div", [["class", "control-button"], ["container", "body"], ["data-e2e", "game-button-close"], ["matTooltip", "Close game"], ["matTooltipPosition", "left"]], null, [[null, "longpress"], [null, "keydown"], [null, "touchend"]], function (_v, en, $event) { var ad = true; if (("longpress" === en)) {
        var pd_0 = (i1.ɵnov(_v, 34).show() !== false);
        ad = (pd_0 && ad);
    } if (("keydown" === en)) {
        var pd_1 = (i1.ɵnov(_v, 34)._handleKeydown($event) !== false);
        ad = (pd_1 && ad);
    } if (("touchend" === en)) {
        var pd_2 = (i1.ɵnov(_v, 34)._handleTouchend() !== false);
        ad = (pd_2 && ad);
    } return ad; }, null, null)), i1.ɵdid(34, 147456, null, 0, i4.MatTooltip, [i5.Overlay, i1.ElementRef, i6.ScrollDispatcher, i1.ViewContainerRef, i1.NgZone, i7.Platform, i8.AriaDescriber, i8.FocusMonitor, i4.MAT_TOOLTIP_SCROLL_STRATEGY, [2, i9.Directionality], [2, i4.MAT_TOOLTIP_DEFAULT_OPTIONS]], { position: [0, "position"], message: [1, "message"] }, null), (_l()(), i1.ɵeld(35, 0, null, null, 1, "mat-icon", [["class", "close-game mat-icon"], ["role", "img"], ["svgIcon", "close"]], [[2, "mat-icon-inline", null]], [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.closeGame() !== false);
        ad = (pd_0 && ad);
    } return ad; }, i10.View_MatIcon_0, i10.RenderType_MatIcon)), i1.ɵdid(36, 638976, null, 0, i11.MatIcon, [i1.ElementRef, i11.MatIconRegistry, [8, null]], { svgIcon: [0, "svgIcon"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_6)), i1.ɵdid(38, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(16777216, null, null, 2, null, View_CasinoGameComponent_7)), i1.ɵdid(40, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_8)), i1.ɵdid(43, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(16777216, null, null, 2, null, View_CasinoGameComponent_9)), i1.ɵdid(45, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef])], function (_ck, _v) { var _co = _v.component; var currVal_5 = (_co.verticalMargin || 90); var currVal_6 = (_co.horizontalMargin || 50); var tmp_7_0 = null; var currVal_7 = ((((tmp_7_0 = i1.ɵunv(_v, 10, 2, i1.ɵnov(_v, 11).transform(_co.game$))) == null) ? null : tmp_7_0.width) || 640); var tmp_8_0 = null; var currVal_8 = ((((tmp_8_0 = i1.ɵunv(_v, 10, 3, i1.ɵnov(_v, 12).transform(_co.game$))) == null) ? null : tmp_8_0.height) || 480); var currVal_9 = (i1.ɵunv(_v, 10, 4, i1.ɵnov(_v, 13).transform(_co.layoutService.focusModeIsActive$)) ? "" : ".scroll-content"); _ck(_v, 10, 0, currVal_5, currVal_6, currVal_7, currVal_8, currVal_9); var currVal_10 = i1.ɵnov(_v.parent, 13); _ck(_v, 16, 0, currVal_10); var currVal_11 = i1.ɵunv(_v, 19, 0, i1.ɵnov(_v, 20).transform(_co.isUserLoggedIn$)); _ck(_v, 19, 0, currVal_11); var currVal_12 = true; _ck(_v, 22, 0, currVal_12); var currVal_14 = i1.ɵunv(_v, 30, 0, i1.ɵnov(_v, 31).transform(_co.responsibleGamingLinkEnabled$)); _ck(_v, 30, 0, currVal_14); var currVal_15 = "left"; var currVal_16 = "Close game"; _ck(_v, 34, 0, currVal_15, currVal_16); var currVal_18 = "close"; _ck(_v, 36, 0, currVal_18); var currVal_19 = (_co.focusModeIsEnabled && !_co.isMobile); _ck(_v, 38, 0, currVal_19); var currVal_20 = (i1.ɵunv(_v, 40, 0, i1.ɵnov(_v, 41).transform(_co.isUserLoggedIn$)) && _co.showDepositButton); _ck(_v, 40, 0, currVal_20); var currVal_21 = _co.showSearchButton; _ck(_v, 43, 0, currVal_21); var currVal_22 = i1.ɵunv(_v, 45, 0, i1.ɵnov(_v, 46).transform(_co.panicService.showButton$)); _ck(_v, 45, 0, currVal_22); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = i1.ɵunv(_v, 1, 0, i1.ɵnov(_v, 2).transform(_co.layoutService.focusModeIsActive$)); _ck(_v, 1, 0, currVal_0); var tmp_1_0 = null; var currVal_1 = (((tmp_1_0 = i1.ɵunv(_v, 5, 0, i1.ɵnov(_v, 6).transform(_co.gameData$))) == null) ? null : tmp_1_0.name); _ck(_v, 5, 0, currVal_1); var currVal_2 = (i1.ɵunv(_v, 9, 0, i1.ɵnov(_v, 14).transform(_co.casinoGameSyncService.isPlayingAllowed$)) === false); var currVal_3 = i1.ɵnov(_v, 10).hostWidth; var currVal_4 = i1.ɵnov(_v, 10).hostHeight; _ck(_v, 9, 0, currVal_2, currVal_3, currVal_4); var currVal_13 = i1.ɵunv(_v, 26, 0, _ck(_v, 28, 0, i1.ɵnov(_v.parent, 0), i1.ɵunv(_v, 26, 0, i1.ɵnov(_v, 27).transform(_co.systemClock$)), "HH:mm")); _ck(_v, 26, 0, currVal_13); var currVal_17 = i1.ɵnov(_v, 36).inline; _ck(_v, 35, 0, currVal_17); }); }
function View_CasinoGameComponent_12(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 0, null, null, null, null, null, null, null))], null, null); }
function View_CasinoGameComponent_11(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 2, null, null, null, null, null, null, null)), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_12)), i1.ɵdid(2, 540672, null, 0, i3.NgTemplateOutlet, [i1.ViewContainerRef], { ngTemplateOutlet: [0, "ngTemplateOutlet"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var currVal_0 = i1.ɵnov(_v.parent.parent, 15); _ck(_v, 2, 0, currVal_0); }, null); }
function View_CasinoGameComponent_13(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 0, null, null, null, null, null, null, null))], null, null); }
function View_CasinoGameComponent_14(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 4, "div", [["class", "mobile-footer"]], null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 3, "a", [], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], function (_v, en, $event) { var ad = true; if (("click" === en)) {
        var pd_0 = (i1.ɵnov(_v, 2).onClick($event.button, $event.ctrlKey, $event.metaKey, $event.shiftKey) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), i1.ɵdid(2, 671744, null, 0, i2.RouterLinkWithHref, [i2.Router, i2.ActivatedRoute, i3.LocationStrategy], { routerLink: [0, "routerLink"] }, null), i1.ɵpad(3, 1), (_l()(), i1.ɵted(-1, null, ["Responsible Gaming"]))], function (_ck, _v) { var currVal_2 = _ck(_v, 3, 0, "/info/responsible-gaming"); _ck(_v, 2, 0, currVal_2); }, function (_ck, _v) { var currVal_0 = i1.ɵnov(_v, 2).target; var currVal_1 = i1.ɵnov(_v, 2).href; _ck(_v, 1, 0, currVal_0, currVal_1); }); }
function View_CasinoGameComponent_10(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 10, "div", [["class", "fullscreen-frame"]], [[2, "with-footer", null]], null, null, null, null)), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, null, 3, null, View_CasinoGameComponent_11)), i1.ɵdid(3, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_13)), i1.ɵdid(7, 540672, null, 0, i3.NgTemplateOutlet, [i1.ViewContainerRef], { ngTemplateOutlet: [0, "ngTemplateOutlet"] }, null), (_l()(), i1.ɵand(16777216, null, null, 2, null, View_CasinoGameComponent_14)), i1.ɵdid(9, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef])], function (_ck, _v) { var _co = _v.component; var currVal_1 = ((i1.ɵunv(_v, 3, 0, i1.ɵnov(_v, 4).transform(_co.gameLaunchingDone$)) !== true) && (i1.ɵunv(_v, 3, 0, i1.ɵnov(_v, 5).transform(_co.casinoGameSyncService.isPlayingAllowed$)) !== false)); _ck(_v, 3, 0, currVal_1); var currVal_2 = i1.ɵnov(_v.parent, 13); _ck(_v, 7, 0, currVal_2); var currVal_3 = (i1.ɵunv(_v, 9, 0, i1.ɵnov(_v, 10).transform(_co.mobileResponsibleGamingLinkEnabled$)) === true); _ck(_v, 9, 0, currVal_3); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = (i1.ɵunv(_v, 0, 0, i1.ɵnov(_v, 1).transform(_co.mobileResponsibleGamingLinkEnabled$)) === true); _ck(_v, 0, 0, currVal_0); }); }
function View_CasinoGameComponent_16(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "div", [["class", "redirecting"]], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Redirection in progress..."]))], null, null); }
function View_CasinoGameComponent_18(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-evolution-game-adapter", [], null, null, null, i20.View_EvolutionGameAdapterComponent_0, i20.RenderType_EvolutionGameAdapterComponent)), i1.ɵdid(1, 4243456, null, 0, i21.EvolutionGameAdapterComponent, [i17.PlatformService], { game: [0, "game"] }, null)], function (_ck, _v) { var currVal_0 = _v.parent.context.ngIf; _ck(_v, 1, 0, currVal_0); }, null); }
function View_CasinoGameComponent_19(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-netent", [], null, null, null, i22.View_NetentComponent_0, i22.RenderType_NetentComponent)), i1.ɵdid(1, 770048, null, 0, i23.NetentComponent, [i13.ActionService, i24.GameRedirectionService, i25.HistoryService, i17.PlatformService, i26.RealityCheckService, i2.Router, i27.SentryService, i28.UserService], { game: [0, "game"] }, null)], function (_ck, _v) { var currVal_0 = _v.parent.context.ngIf; _ck(_v, 1, 0, currVal_0); }, null); }
function View_CasinoGameComponent_20(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-playngo", [], null, null, null, i29.View_PlayngoComponent_0, i29.RenderType_PlayngoComponent)), i1.ɵdid(1, 704512, null, 0, i30.PlayngoComponent, [i31.PlayngoService, i17.PlatformService], { game: [0, "game"] }, null)], function (_ck, _v) { var currVal_0 = _v.parent.context.ngIf.vendorProperties; _ck(_v, 1, 0, currVal_0); }, null); }
function View_CasinoGameComponent_21(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 2, null, null, null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 1, "xc-game-iframe", [], null, null, null, i32.View_GameIframeComponent_0, i32.RenderType_GameIframeComponent)), i1.ɵdid(2, 770048, null, 0, i33.GameIframeComponent, [i17.PlatformService, i26.RealityCheckService, i2.Router, i27.SentryService, i28.UserService, i34.GAME_IFRAME_CONFIG], { game: [0, "game"] }, null)], function (_ck, _v) { var currVal_0 = _v.parent.context.ngIf; _ck(_v, 2, 0, currVal_0); }, null); }
function View_CasinoGameComponent_22(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-cool-off-overlay", [], null, null, null, i35.View_CoolOffOverlayComponent_0, i35.RenderType_CoolOffOverlayComponent)), i1.ɵdid(1, 49152, null, 0, i36.CoolOffOverlayComponent, [i37.CoolingPeriodService, i17.PlatformService], null, null)], null, null); }
function View_CasinoGameComponent_17(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 13, null, null, null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 12, null, null, null, null, null, null, null)), i1.ɵdid(2, 16384, null, 0, i3.NgSwitch, [], { ngSwitch: [0, "ngSwitch"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_18)), i1.ɵdid(4, 278528, null, 0, i3.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i3.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_19)), i1.ɵdid(6, 278528, null, 0, i3.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i3.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_20)), i1.ɵdid(8, 278528, null, 0, i3.NgSwitchCase, [i1.ViewContainerRef, i1.TemplateRef, i3.NgSwitch], { ngSwitchCase: [0, "ngSwitchCase"] }, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_21)), i1.ɵdid(10, 16384, null, 0, i3.NgSwitchDefault, [i1.ViewContainerRef, i1.TemplateRef, i3.NgSwitch], null, null), (_l()(), i1.ɵand(16777216, null, null, 2, null, View_CasinoGameComponent_22)), i1.ɵdid(12, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var _co = _v.component; var currVal_0 = ((_v.context.ngIf == null) ? null : _v.context.ngIf.vendor); _ck(_v, 2, 0, currVal_0); var currVal_1 = "evolution"; _ck(_v, 4, 0, currVal_1); var currVal_2 = "netent"; _ck(_v, 6, 0, currVal_2); var currVal_3 = "playngo"; _ck(_v, 8, 0, currVal_3); var tmp_4_0 = null; var currVal_4 = ((((tmp_4_0 = i1.ɵunv(_v, 12, 0, i1.ɵnov(_v, 13).transform(_co.coolingPeriodService.coolOffCountdown$))) == null) ? null : tmp_4_0.seconds) > 0); _ck(_v, 12, 0, currVal_4); }, null); }
function View_CasinoGameComponent_23(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 0, null, null, null, null, null, null, null))], null, null); }
function View_CasinoGameComponent_24(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 2, "xc-panic-drag-button", [], [[8, "className", 0]], null, null, i38.View_PanicDragButtonComponent_0, i38.RenderType_PanicDragButtonComponent)), i1.ɵdid(1, 49152, null, 0, i39.PanicDragButtonComponent, [i16.PanicService, i40.LAYOUT_CONFIG], null, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef])], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = i1.ɵunv(_v, 0, 0, i1.ɵnov(_v, 2).transform(_co.gameVendor$)); _ck(_v, 0, 0, currVal_0); }); }
function View_CasinoGameComponent_25(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 4, "div", [["class", "login-required"]], null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 1, "h2", [], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["This game is only for logged in users."])), (_l()(), i1.ɵeld(3, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["You have to log in to be able to play this game."]))], null, null); }
function View_CasinoGameComponent_15(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵand(16777216, null, null, 2, null, View_CasinoGameComponent_16)), i1.ɵdid(1, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, null, 2, null, View_CasinoGameComponent_17)), i1.ɵdid(4, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"], ngIfElse: [1, "ngIfElse"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, null, 2, null, View_CasinoGameComponent_23)), i1.ɵdid(7, 540672, null, 0, i3.NgTemplateOutlet, [i1.ViewContainerRef], { ngTemplateOutlet: [0, "ngTemplateOutlet"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, null, 3, null, View_CasinoGameComponent_24)), i1.ɵdid(10, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_25)), i1.ɵdid(14, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var _co = _v.component; var currVal_0 = (i1.ɵunv(_v, 1, 0, i1.ɵnov(_v, 2).transform(_co.isRedirecting$)) === true); _ck(_v, 1, 0, currVal_0); var currVal_1 = i1.ɵunv(_v, 4, 0, i1.ɵnov(_v, 5).transform(_co.game$)); var currVal_2 = i1.ɵnov(_v.parent, 15); _ck(_v, 4, 0, currVal_1, currVal_2); var currVal_3 = ((i1.ɵunv(_v, 7, 0, i1.ɵnov(_v, 8).transform(_co.casinoGameSyncService.isPlayingAllowed$)) === false) ? i1.ɵnov(_v.parent, 14) : ""); _ck(_v, 7, 0, currVal_3); var currVal_4 = ((_co.isMobile && i1.ɵunv(_v, 10, 0, i1.ɵnov(_v, 11).transform(_co.gameLaunchingDone$))) && i1.ɵunv(_v, 10, 0, i1.ɵnov(_v, 12).transform(_co.panicService.showButton$))); _ck(_v, 10, 0, currVal_4); var currVal_5 = _co.loginRequired; _ck(_v, 14, 0, currVal_5); }, null); }
function View_CasinoGameComponent_28(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "p", [["class", "message"]], null, null, null, null, null)), (_l()(), i1.ɵted(1, null, ["Close the other tab to play ", "."]))], null, function (_ck, _v) { var currVal_0 = ((_v.context.ngIf == null) ? null : _v.context.ngIf.name); _ck(_v, 1, 0, currVal_0); }); }
function View_CasinoGameComponent_27(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 5, null, null, null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 1, "h3", [["class", "header"]], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Game can be played only in one tab."])), (_l()(), i1.ɵand(16777216, null, null, 2, null, View_CasinoGameComponent_28)), i1.ɵdid(4, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var _co = _v.component; var currVal_0 = i1.ɵunv(_v, 4, 0, i1.ɵnov(_v, 5).transform(_co.gameData$)); _ck(_v, 4, 0, currVal_0); }, null); }
function View_CasinoGameComponent_26(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 3, "div", [["class", "instance-blocked"], ["data-e2e", "game-instance-blocked"]], null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 2, "div", [["class", "content"]], null, null, null, null, null)), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_27)), i1.ɵdid(3, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"], ngIfElse: [1, "ngIfElse"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = !_co.loading; var currVal_1 = i1.ɵnov(_v.parent, 15); _ck(_v, 3, 0, currVal_0, currVal_1); }, null); }
function View_CasinoGameComponent_30(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 2, "div", [["class", "loader"]], null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 1, "xc-loader", [["diameter", "72"]], null, null, null, i41.View_LoaderComponent_0, i41.RenderType_LoaderComponent)), i1.ɵdid(2, 49152, null, 0, i42.LoaderComponent, [i40.LAYOUT_CONFIG], { diameter: [0, "diameter"] }, null)], function (_ck, _v) { var currVal_0 = "72"; _ck(_v, 2, 0, currVal_0); }, null); }
function View_CasinoGameComponent_29(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵand(16777216, null, null, 1, null, View_CasinoGameComponent_30)), i1.ɵdid(1, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(0, null, null, 0))], function (_ck, _v) { var _co = _v.component; var currVal_0 = !_co.loginRequired; _ck(_v, 1, 0, currVal_0); }, null); }
export function View_CasinoGameComponent_0(_l) { return i1.ɵvid(2, [i1.ɵpid(0, i3.DatePipe, [i1.LOCALE_ID]), i1.ɵqud(671088640, 1, { headerElem: 0 }), i1.ɵqud(671088640, 2, { wrapperElem: 0 }), i1.ɵqud(671088640, 3, { controlsElem: 0 }), i1.ɵqud(671088640, 4, { footerElem: 0 }), i1.ɵqud(671088640, 5, { gameViewElem: 0 }), (_l()(), i1.ɵeld(6, 0, null, null, 6, "xc-reality-check-hide", [], [[2, "rc-open", null]], [[null, "contentReadded"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("contentReadded" === en)) {
        var pd_0 = (_co.gameShouldReset$.next(true) !== false);
        ad = (pd_0 && ad);
    } return ad; }, i43.View_RealityCheckHideComponent_0, i43.RenderType_RealityCheckHideComponent)), i1.ɵdid(7, 180224, null, 0, i44.RealityCheckHideComponent, [i26.RealityCheckService, i45.REALITY_CHECK_CONFIG], null, { contentReadded: "contentReadded" }), i1.ɵpid(131072, i3.AsyncPipe, [i1.ChangeDetectorRef]), (_l()(), i1.ɵand(16777216, null, 0, 1, null, View_CasinoGameComponent_1)), i1.ɵdid(10, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(16777216, null, 0, 1, null, View_CasinoGameComponent_10)), i1.ɵdid(12, 16384, null, 0, i3.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(0, [["gameFrame", 2]], null, 0, null, View_CasinoGameComponent_15)), (_l()(), i1.ɵand(0, [["instanceBlocked", 2]], null, 0, null, View_CasinoGameComponent_26)), (_l()(), i1.ɵand(0, [["loader", 2]], null, 0, null, View_CasinoGameComponent_29))], function (_ck, _v) { var _co = _v.component; var currVal_1 = !_co.isMobile; _ck(_v, 10, 0, currVal_1); var currVal_2 = _co.isMobile; _ck(_v, 12, 0, currVal_2); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = i1.ɵunv(_v, 6, 0, i1.ɵnov(_v, 8).transform(_co.realityCheckService.isOpen$)); _ck(_v, 6, 0, currVal_0); }); }
export function View_CasinoGameComponent_Host_0(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 2, "xc-casino-game", [], null, null, null, View_CasinoGameComponent_0, RenderType_CasinoGameComponent)), i1.ɵprd(131584, null, i46.CasinoGameSyncService, i46.CasinoGameSyncService, [i47.BroadcastChannelService, i48.JurisdictionService, i17.PlatformService]), i1.ɵdid(2, 180224, null, 0, i49.CasinoGameComponent, [i50.AnalyticsService, i24.GameRedirectionService, i25.HistoryService, i2.Router, i51.LayoutService, i52.ModalService, i17.PlatformService, i53.RouteService, i27.SentryService, i37.CoolingPeriodService, i16.PanicService, i26.RealityCheckService, i54.WelcomeBackService, i46.CasinoGameSyncService, i55.Apollo, i1.ChangeDetectorRef, i56.ComplianceService, i1.ElementRef, i2.ActivatedRoute, i57.NotificationsQueueService, i28.UserService, i58.CASINO_GAME_CONFIG, i40.LAYOUT_CONFIG], null, null)], null, null); }
var CasinoGameComponentNgFactory = i1.ɵccf("xc-casino-game", i49.CasinoGameComponent, View_CasinoGameComponent_Host_0, {}, {}, []);
export { CasinoGameComponentNgFactory as CasinoGameComponentNgFactory };