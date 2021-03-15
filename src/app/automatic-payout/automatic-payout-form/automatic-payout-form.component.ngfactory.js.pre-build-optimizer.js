/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
import * as i0 from "./automatic-payout-form.component.scss.shim.ngstyle";
import * as i1 from "@angular/core";
import * as i2 from "../../shared/form-errors/form-errors.component.ngfactory";
import * as i3 from "../../shared/form-errors/form-errors.component";
import * as i4 from "../../shared/loader/loader.component.ngfactory";
import * as i5 from "../../shared/loader/loader.component";
import * as i6 from "../../layout/layout.config";
import * as i7 from "@angular/forms";
import * as i8 from "../../../../node_modules/@angular/material/checkbox/typings/index.ngfactory";
import * as i9 from "@angular/material/checkbox";
import * as i10 from "@angular/cdk/a11y";
import * as i11 from "@angular/platform-browser/animations";
import * as i12 from "../../../../node_modules/@angular/material/form-field/typings/index.ngfactory";
import * as i13 from "@angular/material/form-field";
import * as i14 from "@angular/material/core";
import * as i15 from "@angular/cdk/bidi";
import * as i16 from "@angular/cdk/platform";
import * as i17 from "ng2-currency-mask/src/currency-mask.directive";
import * as i18 from "ng2-currency-mask/src/currency-mask.config";
import * as i19 from "@angular/common";
import * as i20 from "@angular/material/input";
import * as i21 from "@angular/cdk/text-field";
import * as i22 from "../../../../node_modules/@angular/material/button/typings/index.ngfactory";
import * as i23 from "@angular/material/button";
import * as i24 from "./automatic-payout-form.component";
import * as i25 from "../automatic-payout-data.service";
import * as i26 from "../../notifications/notifications-queue.service";
import * as i27 from "../../core/currencies.service";
var styles_AutomaticPayoutFormComponent = [i0.styles];
var RenderType_AutomaticPayoutFormComponent = i1.ɵcrt({ encapsulation: 0, styles: styles_AutomaticPayoutFormComponent, data: {} });
export { RenderType_AutomaticPayoutFormComponent as RenderType_AutomaticPayoutFormComponent };
function View_AutomaticPayoutFormComponent_2(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "div", [["class", "form-control-feedback"]], null, null, null, null, null)), (_l()(), i1.ɵted(1, null, ["Value cannot be bigger than ", ""]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.maxThreshold; _ck(_v, 1, 0, currVal_0); }); }
function View_AutomaticPayoutFormComponent_3(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-form-errors", [["min", "Value has to be at least 1"]], null, null, null, i2.View_FormErrorsComponent_0, i2.RenderType_FormErrorsComponent)), i1.ɵdid(1, 49152, null, 0, i3.FormErrorsComponent, [], { control: [0, "control"], min: [1, "min"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.form.controls.threshold; var currVal_1 = "Value has to be at least 1"; _ck(_v, 1, 0, currVal_0, currVal_1); }, null); }
function View_AutomaticPayoutFormComponent_4(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-loader", [], null, null, null, i4.View_LoaderComponent_0, i4.RenderType_LoaderComponent)), i1.ɵdid(1, 49152, null, 0, i5.LoaderComponent, [i6.LAYOUT_CONFIG], null, null)], null, null); }
function View_AutomaticPayoutFormComponent_5(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, null, null, null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["Save"]))], null, null); }
function View_AutomaticPayoutFormComponent_1(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 45, null, null, null, null, null, null, null)), (_l()(), i1.ɵeld(1, 0, null, null, 1, "p", [["class", "container-description"]], null, null, null, null, null)), (_l()(), i1.ɵted(-1, null, ["When you turn this feature on and set any threshold, you will be prompted to make a withdrawal right after your winnings reach the specified amount."])), (_l()(), i1.ɵeld(3, 0, null, null, 42, "form", [["autocomplete", "off"], ["novalidate", ""]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "submit"], [null, "reset"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("submit" === en)) {
        var pd_0 = (i1.ɵnov(_v, 5).onSubmit($event) !== false);
        ad = (pd_0 && ad);
    } if (("reset" === en)) {
        var pd_1 = (i1.ɵnov(_v, 5).onReset() !== false);
        ad = (pd_1 && ad);
    } if (("submit" === en)) {
        var pd_2 = (_co.onSubmit() !== false);
        ad = (pd_2 && ad);
    } return ad; }, null, null)), i1.ɵdid(4, 16384, null, 0, i7.ɵangular_packages_forms_forms_z, [], null, null), i1.ɵdid(5, 540672, null, 0, i7.FormGroupDirective, [[8, null], [8, null]], { form: [0, "form"] }, null), i1.ɵprd(2048, null, i7.ControlContainer, null, [i7.FormGroupDirective]), i1.ɵdid(7, 16384, null, 0, i7.NgControlStatusGroup, [[4, i7.ControlContainer]], null, null), (_l()(), i1.ɵeld(8, 0, null, null, 31, "div", [["class", "form-group"]], null, null, null, null, null)), (_l()(), i1.ɵeld(9, 0, null, null, 6, "mat-checkbox", [["class", "toggle-checkbox mat-checkbox"], ["data-e2e", "automatic-payout-checkbox"], ["formControlName", "status"]], [[8, "id", 0], [2, "mat-checkbox-indeterminate", null], [2, "mat-checkbox-checked", null], [2, "mat-checkbox-disabled", null], [2, "mat-checkbox-label-before", null], [2, "_mat-animation-noopable", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "change"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("change" === en)) {
        var pd_0 = (_co.onCheckboxChange($event) !== false);
        ad = (pd_0 && ad);
    } return ad; }, i8.View_MatCheckbox_0, i8.RenderType_MatCheckbox)), i1.ɵdid(10, 4374528, null, 0, i9.MatCheckbox, [i1.ElementRef, i1.ChangeDetectorRef, i10.FocusMonitor, i1.NgZone, [8, null], [2, i9.MAT_CHECKBOX_CLICK_ACTION], [2, i11.ANIMATION_MODULE_TYPE]], null, { change: "change" }), i1.ɵprd(1024, null, i7.NG_VALUE_ACCESSOR, function (p0_0) { return [p0_0]; }, [i9.MatCheckbox]), i1.ɵdid(12, 671744, null, 0, i7.FormControlName, [[3, i7.ControlContainer], [8, null], [8, null], [6, i7.NG_VALUE_ACCESSOR], [2, i7.ɵangular_packages_forms_forms_q]], { name: [0, "name"] }, null), i1.ɵprd(2048, null, i7.NgControl, null, [i7.FormControlName]), i1.ɵdid(14, 16384, null, 0, i7.NgControlStatus, [[4, i7.NgControl]], null, null), (_l()(), i1.ɵted(-1, 0, ["Enable this for my account"])), (_l()(), i1.ɵeld(16, 0, null, null, 23, "mat-form-field", [["class", "mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, i12.View_MatFormField_0, i12.RenderType_MatFormField)), i1.ɵdid(17, 7389184, null, 7, i13.MatFormField, [i1.ElementRef, i1.ChangeDetectorRef, [2, i14.MAT_LABEL_GLOBAL_OPTIONS], [2, i15.Directionality], [2, i13.MAT_FORM_FIELD_DEFAULT_OPTIONS], i16.Platform, i1.NgZone, [2, i11.ANIMATION_MODULE_TYPE]], null, null), i1.ɵqud(335544320, 1, { _control: 0 }), i1.ɵqud(335544320, 2, { _placeholderChild: 0 }), i1.ɵqud(335544320, 3, { _labelChild: 0 }), i1.ɵqud(603979776, 4, { _errorChildren: 1 }), i1.ɵqud(603979776, 5, { _hintChildren: 1 }), i1.ɵqud(603979776, 6, { _prefixChildren: 1 }), i1.ɵqud(603979776, 7, { _suffixChildren: 1 }), (_l()(), i1.ɵeld(25, 0, null, 1, 9, "input", [["autocomplete", "off"], ["class", "mat-input-element mat-form-field-autofill-control"], ["currencyMask", ""], ["data-e2e", "automatic-payout-threshold-field"], ["formControlName", "threshold"], ["matInput", ""], ["placeholder", "Threshold"], ["type", "tel"]], [[2, "mat-input-server", null], [1, "id", 0], [1, "placeholder", 0], [8, "disabled", 0], [8, "required", 0], [8, "readOnly", 0], [1, "aria-describedby", 0], [1, "aria-invalid", 0], [1, "aria-required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "blur"], [null, "cut"], [null, "input"], [null, "keydown"], [null, "keypress"], [null, "paste"], [null, "compositionstart"], [null, "compositionend"], [null, "focus"]], function (_v, en, $event) { var ad = true; if (("blur" === en)) {
        var pd_0 = (i1.ɵnov(_v, 26).handleBlur($event) !== false);
        ad = (pd_0 && ad);
    } if (("cut" === en)) {
        var pd_1 = (i1.ɵnov(_v, 26).handleCut($event) !== false);
        ad = (pd_1 && ad);
    } if (("input" === en)) {
        var pd_2 = (i1.ɵnov(_v, 26).handleInput($event) !== false);
        ad = (pd_2 && ad);
    } if (("keydown" === en)) {
        var pd_3 = (i1.ɵnov(_v, 26).handleKeydown($event) !== false);
        ad = (pd_3 && ad);
    } if (("keypress" === en)) {
        var pd_4 = (i1.ɵnov(_v, 26).handleKeypress($event) !== false);
        ad = (pd_4 && ad);
    } if (("paste" === en)) {
        var pd_5 = (i1.ɵnov(_v, 26).handlePaste($event) !== false);
        ad = (pd_5 && ad);
    } if (("input" === en)) {
        var pd_6 = (i1.ɵnov(_v, 28)._handleInput($event.target.value) !== false);
        ad = (pd_6 && ad);
    } if (("blur" === en)) {
        var pd_7 = (i1.ɵnov(_v, 28).onTouched() !== false);
        ad = (pd_7 && ad);
    } if (("compositionstart" === en)) {
        var pd_8 = (i1.ɵnov(_v, 28)._compositionStart() !== false);
        ad = (pd_8 && ad);
    } if (("compositionend" === en)) {
        var pd_9 = (i1.ɵnov(_v, 28)._compositionEnd($event.target.value) !== false);
        ad = (pd_9 && ad);
    } if (("blur" === en)) {
        var pd_10 = (i1.ɵnov(_v, 32)._focusChanged(false) !== false);
        ad = (pd_10 && ad);
    } if (("focus" === en)) {
        var pd_11 = (i1.ɵnov(_v, 32)._focusChanged(true) !== false);
        ad = (pd_11 && ad);
    } if (("input" === en)) {
        var pd_12 = (i1.ɵnov(_v, 32)._onInput() !== false);
        ad = (pd_12 && ad);
    } return ad; }, null, null)), i1.ɵdid(26, 4538368, null, 0, i17.CurrencyMaskDirective, [[2, i18.CURRENCY_MASK_CONFIG], i1.ElementRef, i1.KeyValueDiffers], { options: [0, "options"] }, null), i1.ɵpid(131072, i19.AsyncPipe, [i1.ChangeDetectorRef]), i1.ɵdid(28, 16384, null, 0, i7.DefaultValueAccessor, [i1.Renderer2, i1.ElementRef, [2, i7.COMPOSITION_BUFFER_MODE]], null, null), i1.ɵprd(1024, null, i7.NG_VALUE_ACCESSOR, function (p0_0, p1_0) { return [p0_0, p1_0]; }, [i17.CurrencyMaskDirective, i7.DefaultValueAccessor]), i1.ɵdid(30, 671744, null, 0, i7.FormControlName, [[3, i7.ControlContainer], [8, null], [8, null], [6, i7.NG_VALUE_ACCESSOR], [2, i7.ɵangular_packages_forms_forms_q]], { name: [0, "name"] }, null), i1.ɵprd(2048, null, i7.NgControl, null, [i7.FormControlName]), i1.ɵdid(32, 999424, null, 0, i20.MatInput, [i1.ElementRef, i16.Platform, [6, i7.NgControl], [2, i7.NgForm], [2, i7.FormGroupDirective], i14.ErrorStateMatcher, [8, null], i21.AutofillMonitor, i1.NgZone], { placeholder: [0, "placeholder"], type: [1, "type"] }, null), i1.ɵdid(33, 16384, null, 0, i7.NgControlStatus, [[4, i7.NgControl]], null, null), i1.ɵprd(2048, [[1, 4]], i13.MatFormFieldControl, null, [i20.MatInput]), (_l()(), i1.ɵeld(35, 0, null, 5, 4, "mat-error", [["class", "mat-error"], ["role", "alert"]], [[1, "id", 0]], null, null, null, null)), i1.ɵdid(36, 16384, [[4, 4]], 0, i13.MatError, [], null, null), (_l()(), i1.ɵand(16777216, null, null, 1, null, View_AutomaticPayoutFormComponent_2)), i1.ɵdid(38, 16384, null, 0, i19.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"], ngIfElse: [1, "ngIfElse"] }, null), (_l()(), i1.ɵand(0, [["basicError", 2]], null, 0, null, View_AutomaticPayoutFormComponent_3)), (_l()(), i1.ɵeld(40, 0, null, null, 5, "button", [["class", "btn-block"], ["color", "primary"], ["data-e2e", "automatic-payout-submit-button"], ["mat-button", ""]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], null, null, i22.View_MatButton_0, i22.RenderType_MatButton)), i1.ɵdid(41, 180224, null, 0, i23.MatButton, [i1.ElementRef, i16.Platform, i10.FocusMonitor, [2, i11.ANIMATION_MODULE_TYPE]], { disabled: [0, "disabled"], color: [1, "color"] }, null), (_l()(), i1.ɵand(16777216, null, 0, 1, null, View_AutomaticPayoutFormComponent_4)), i1.ɵdid(43, 16384, null, 0, i19.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i1.ɵand(16777216, null, 0, 1, null, View_AutomaticPayoutFormComponent_5)), i1.ɵdid(45, 16384, null, 0, i19.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_7 = _co.form; _ck(_v, 5, 0, currVal_7); var currVal_21 = "status"; _ck(_v, 12, 0, currVal_21); var currVal_59 = i1.ɵunv(_v, 26, 0, i1.ɵnov(_v, 27).transform(_co.currencyMaskOptions$)); _ck(_v, 26, 0, currVal_59); var currVal_60 = "threshold"; _ck(_v, 30, 0, currVal_60); var currVal_61 = "Threshold"; var currVal_62 = "tel"; _ck(_v, 32, 0, currVal_61, currVal_62); var currVal_64 = (_co.form.controls.threshold.errors && _co.form.controls.threshold.errors.max); var currVal_65 = i1.ɵnov(_v, 39); _ck(_v, 38, 0, currVal_64, currVal_65); var currVal_68 = ((_co.form.invalid || _co.form.pristine) || _co.updateLoading); var currVal_69 = "primary"; _ck(_v, 41, 0, currVal_68, currVal_69); var currVal_70 = _co.updateLoading; _ck(_v, 43, 0, currVal_70); var currVal_71 = !_co.updateLoading; _ck(_v, 45, 0, currVal_71); }, function (_ck, _v) { var currVal_0 = i1.ɵnov(_v, 7).ngClassUntouched; var currVal_1 = i1.ɵnov(_v, 7).ngClassTouched; var currVal_2 = i1.ɵnov(_v, 7).ngClassPristine; var currVal_3 = i1.ɵnov(_v, 7).ngClassDirty; var currVal_4 = i1.ɵnov(_v, 7).ngClassValid; var currVal_5 = i1.ɵnov(_v, 7).ngClassInvalid; var currVal_6 = i1.ɵnov(_v, 7).ngClassPending; _ck(_v, 3, 0, currVal_0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6); var currVal_8 = i1.ɵnov(_v, 10).id; var currVal_9 = i1.ɵnov(_v, 10).indeterminate; var currVal_10 = i1.ɵnov(_v, 10).checked; var currVal_11 = i1.ɵnov(_v, 10).disabled; var currVal_12 = (i1.ɵnov(_v, 10).labelPosition == "before"); var currVal_13 = (i1.ɵnov(_v, 10)._animationMode === "NoopAnimations"); var currVal_14 = i1.ɵnov(_v, 14).ngClassUntouched; var currVal_15 = i1.ɵnov(_v, 14).ngClassTouched; var currVal_16 = i1.ɵnov(_v, 14).ngClassPristine; var currVal_17 = i1.ɵnov(_v, 14).ngClassDirty; var currVal_18 = i1.ɵnov(_v, 14).ngClassValid; var currVal_19 = i1.ɵnov(_v, 14).ngClassInvalid; var currVal_20 = i1.ɵnov(_v, 14).ngClassPending; _ck(_v, 9, 1, [currVal_8, currVal_9, currVal_10, currVal_11, currVal_12, currVal_13, currVal_14, currVal_15, currVal_16, currVal_17, currVal_18, currVal_19, currVal_20]); var currVal_22 = (i1.ɵnov(_v, 17).appearance == "standard"); var currVal_23 = (i1.ɵnov(_v, 17).appearance == "fill"); var currVal_24 = (i1.ɵnov(_v, 17).appearance == "outline"); var currVal_25 = (i1.ɵnov(_v, 17).appearance == "legacy"); var currVal_26 = i1.ɵnov(_v, 17)._control.errorState; var currVal_27 = i1.ɵnov(_v, 17)._canLabelFloat; var currVal_28 = i1.ɵnov(_v, 17)._shouldLabelFloat(); var currVal_29 = i1.ɵnov(_v, 17)._hideControlPlaceholder(); var currVal_30 = i1.ɵnov(_v, 17)._control.disabled; var currVal_31 = i1.ɵnov(_v, 17)._control.autofilled; var currVal_32 = i1.ɵnov(_v, 17)._control.focused; var currVal_33 = (i1.ɵnov(_v, 17).color == "accent"); var currVal_34 = (i1.ɵnov(_v, 17).color == "warn"); var currVal_35 = i1.ɵnov(_v, 17)._shouldForward("untouched"); var currVal_36 = i1.ɵnov(_v, 17)._shouldForward("touched"); var currVal_37 = i1.ɵnov(_v, 17)._shouldForward("pristine"); var currVal_38 = i1.ɵnov(_v, 17)._shouldForward("dirty"); var currVal_39 = i1.ɵnov(_v, 17)._shouldForward("valid"); var currVal_40 = i1.ɵnov(_v, 17)._shouldForward("invalid"); var currVal_41 = i1.ɵnov(_v, 17)._shouldForward("pending"); var currVal_42 = !i1.ɵnov(_v, 17)._animationsEnabled; _ck(_v, 16, 1, [currVal_22, currVal_23, currVal_24, currVal_25, currVal_26, currVal_27, currVal_28, currVal_29, currVal_30, currVal_31, currVal_32, currVal_33, currVal_34, currVal_35, currVal_36, currVal_37, currVal_38, currVal_39, currVal_40, currVal_41, currVal_42]); var currVal_43 = i1.ɵnov(_v, 32)._isServer; var currVal_44 = i1.ɵnov(_v, 32).id; var currVal_45 = i1.ɵnov(_v, 32).placeholder; var currVal_46 = i1.ɵnov(_v, 32).disabled; var currVal_47 = i1.ɵnov(_v, 32).required; var currVal_48 = i1.ɵnov(_v, 32).readonly; var currVal_49 = (i1.ɵnov(_v, 32)._ariaDescribedby || null); var currVal_50 = i1.ɵnov(_v, 32).errorState; var currVal_51 = i1.ɵnov(_v, 32).required.toString(); var currVal_52 = i1.ɵnov(_v, 33).ngClassUntouched; var currVal_53 = i1.ɵnov(_v, 33).ngClassTouched; var currVal_54 = i1.ɵnov(_v, 33).ngClassPristine; var currVal_55 = i1.ɵnov(_v, 33).ngClassDirty; var currVal_56 = i1.ɵnov(_v, 33).ngClassValid; var currVal_57 = i1.ɵnov(_v, 33).ngClassInvalid; var currVal_58 = i1.ɵnov(_v, 33).ngClassPending; _ck(_v, 25, 1, [currVal_43, currVal_44, currVal_45, currVal_46, currVal_47, currVal_48, currVal_49, currVal_50, currVal_51, currVal_52, currVal_53, currVal_54, currVal_55, currVal_56, currVal_57, currVal_58]); var currVal_63 = i1.ɵnov(_v, 36).id; _ck(_v, 35, 0, currVal_63); var currVal_66 = (i1.ɵnov(_v, 41).disabled || null); var currVal_67 = (i1.ɵnov(_v, 41)._animationMode === "NoopAnimations"); _ck(_v, 40, 0, currVal_66, currVal_67); }); }
function View_AutomaticPayoutFormComponent_6(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-loader", [["diameter", "48"]], null, null, null, i4.View_LoaderComponent_0, i4.RenderType_LoaderComponent)), i1.ɵdid(1, 49152, null, 0, i5.LoaderComponent, [i6.LAYOUT_CONFIG], { diameter: [0, "diameter"] }, null)], function (_ck, _v) { var currVal_0 = "48"; _ck(_v, 1, 0, currVal_0); }, null); }
export function View_AutomaticPayoutFormComponent_0(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵand(16777216, null, null, 1, null, View_AutomaticPayoutFormComponent_1)), i1.ɵdid(1, 16384, null, 0, i19.NgIf, [i1.ViewContainerRef, i1.TemplateRef], { ngIf: [0, "ngIf"], ngIfElse: [1, "ngIfElse"] }, null), (_l()(), i1.ɵand(0, [["loading", 2]], null, 0, null, View_AutomaticPayoutFormComponent_6))], function (_ck, _v) { var _co = _v.component; var currVal_0 = !_co.initialLoading; var currVal_1 = i1.ɵnov(_v, 2); _ck(_v, 1, 0, currVal_0, currVal_1); }, null); }
export function View_AutomaticPayoutFormComponent_Host_0(_l) { return i1.ɵvid(0, [(_l()(), i1.ɵeld(0, 0, null, null, 1, "xc-automatic-payout-form", [], null, null, null, View_AutomaticPayoutFormComponent_0, RenderType_AutomaticPayoutFormComponent)), i1.ɵdid(1, 245760, null, 0, i24.AutomaticPayoutFormComponent, [i25.AutomaticPayoutDataService, i7.FormBuilder, i26.NotificationsQueueService, i27.CurrenciesService], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var AutomaticPayoutFormComponentNgFactory = i1.ɵccf("xc-automatic-payout-form", i24.AutomaticPayoutFormComponent, View_AutomaticPayoutFormComponent_Host_0, {}, {}, []);
export { AutomaticPayoutFormComponentNgFactory as AutomaticPayoutFormComponentNgFactory };
