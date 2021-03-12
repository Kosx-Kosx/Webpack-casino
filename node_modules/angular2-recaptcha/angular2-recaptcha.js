"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var captcha_component_1 = require("./lib/captcha.component");
var captcha_service_1 = require("./lib/captcha.service");
var ReCaptchaModule = /** @class */ (function () {
    function ReCaptchaModule() {
    }
    ReCaptchaModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [captcha_component_1.ReCaptchaComponent],
                    exports: [captcha_component_1.ReCaptchaComponent],
                    providers: [captcha_service_1.RECAPTCHA_SERVICE_PROVIDER]
                },] },
    ];
    return ReCaptchaModule;
}());
exports.ReCaptchaModule = ReCaptchaModule;
__export(require("./lib/captcha.component"));
