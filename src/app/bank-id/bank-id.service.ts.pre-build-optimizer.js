import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { AnalyticsService } from 'app/analytics/analytics.service';
import { AppConfig } from 'app/core/app.config';
import { CacheService } from 'app/core/cache.service';
import { PlatformService } from 'app/core/platform.service';
import { PusherService } from 'app/pusher';
import { BankIdMessageStatus, } from './bank-id-interfaces';
/**
 * @deprecated This service is deprecated as we no longer support SGA
 */
var BankIdService = /** @class */ (function () {
    function BankIdService(http, analyticsService, cacheService, appConfig, locale, pusher, platform) {
        var _this = this;
        this.http = http;
        this.analyticsService = analyticsService;
        this.cacheService = cacheService;
        this.appConfig = appConfig;
        this.locale = locale;
        this.pusher = pusher;
        this.platform = platform;
        /**
         * The default state of BankId (based on brand config & site language)
         * @deprecated This property is deprecated as we no longer support SGA
         */
        this.enabledByDefault = this.appConfig.bankIdEnabled && this.locale === 'sv';
        /**
         * Emits when bankId is being enabled or disabled.
         * @deprecated This property is deprecated as we no longer support SGA
         */
        this.currentState$ = new BehaviorSubject(this.enabledByDefault);
        /**
         * Emits true when BankID state is being changed from the default value.
         * Example: selecting "Sweden" in registration form enables BankID.
         * @deprecated This property is deprecated as we no longer support SGA
         */
        this.stateWasChanged$ = new BehaviorSubject(false);
        /**
         * Used for getting the bankID validation status and user_exist.
         * @deprecated This property is deprecated as we no longer support SGA
         */
        this.message$ = new Subject();
        /**
         * Required for register-form. It contains the validated user data. It needs to be a separate subject
         * because it's not possible to pass through the message$ from login and register to it
         * @deprecated This property is deprecated as we no longer support SGA
         */
        this.userData$ = new BehaviorSubject(null);
        /**
         * Token returned by the iframe success url. Required for login/register to identify the player.
         * @deprecated This property is deprecated as we no longer support SGA
         */
        this.identToken$ = new BehaviorSubject(null);
        /**
         * Cache key for bankId preference setting.
         */
        this.forceBankIdLoginStorageKey = 'bankid';
        if (pusher) {
            this.pusher.on('identification_status', true)
                .subscribe(function (message) { return _this.onMessage(message); });
        }
        // Check if browser had ever been used to authenticate with BankID
        // and always offer logging in with BankID if thats the case
        this.cacheService.request(this.forceBankIdLoginStorageKey).subscribe(function (force) {
            _this.alwaysOfferBankIdLogin = _this.appConfig.bankIdEnabled ? !!force : false;
        });
        // On a successful BankID authentication mark the browser as BankId friendly
        if (this.appConfig.bankIdEnabled) {
            this.message$.pipe(filter(function (msg) { return msg.status === BankIdMessageStatus.SUCCESS; }), first())
                .subscribe(function () {
                _this.alwaysOfferBankIdLogin = true;
                _this.cacheService.push(_this.forceBankIdLoginStorageKey, true);
            });
        }
    }
    Object.defineProperty(BankIdService.prototype, "isEnabled", {
        /**
         * Current state of BankID.
         * The default value is determined here in service. It may be changed later by calling bankIdService.changeState(),
         * for example by selecting country "Sweden" in registration form.
         * @deprecated This property is deprecated as we no longer support SGA
         */
        get: function () {
            return this.currentState$.value;
        },
        set: function (newValue) {
            this.currentState$.next(newValue);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Enables or disables BankID state.
     *
     * @param {boolean || null} forcedState Desired state of BankID or null to set the default value.
     * @deprecated This property is deprecated as we no longer support SGA
     */
    BankIdService.prototype.changeState = function (forcedState) {
        if (!this.appConfig.bankIdEnabled) {
            return;
        }
        // Use forced value
        if (typeof forcedState === 'boolean' && forcedState !== this.isEnabled) {
            this.isEnabled = forcedState;
            this.stateWasChanged$.next(true);
        }
        // Reset to the default value
        else if (forcedState === null && this.enabledByDefault !== this.isEnabled) {
            this.isEnabled = this.enabledByDefault;
            this.stateWasChanged$.next(false);
        }
    };
    /**
     * @deprecated This property is deprecated as we no longer support SGA
     */
    BankIdService.prototype.identify = function (personalNumber) {
        if (personalNumber === void 0) { personalNumber = null; }
        var externalId = this.getExternalId();
        this.pusher.externalId$.next(externalId);
        var ids = "&external_id=" + externalId;
        if (personalNumber) {
            ids += "&personal_number=" + personalNumber;
        }
        var url = this.platform.location.origin + "/bankid.html";
        var urls = "&success_url=" + url + "&failed_url=" + url;
        return this.http.get("{{apiEndpoint}}/identify?provider=bank-id" + ids + urls);
    };
    /**
     * @deprecated This property is deprecated as we no longer support SGA
     */
    BankIdService.prototype.clearExternalChannel = function () {
        this.pusher.externalId$.next(null);
    };
    /**
     * External id is a unique identifier for every identify request and is used by our platform
     * to send pusher notifications through a unique channel created from it.
     */
    BankIdService.prototype.getExternalId = function () {
        return "sso-" + this.getUniqueId();
    };
    BankIdService.prototype.getUniqueId = function () {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
    };
    BankIdService.prototype.onMessage = function (data) {
        // This is a hack for an edge case situation where user validates himself but core is unable to connect bankID
        // with the account because bankID is already used by another account
        var validated = data.status === BankIdMessageStatus.SUCCESS && data.identified;
        this.userData$.next(validated ? this.convertPersonalData(data.ident_id, data.result) : null);
        this.message$.next({
            status: validated ? BankIdMessageStatus.SUCCESS : BankIdMessageStatus.FAILED,
            url: data.url,
            user_exists: data.user_exists,
            error_message: data.error_message,
        });
        this.clearExternalChannel();
    };
    BankIdService.prototype.convertPersonalData = function (ident_id, data) {
        var password = this.getUniqueId();
        return {
            birthday: this.getBirthDateFromPersonalNumber(ident_id),
            first_name: data.first_name,
            last_name: data.last_name,
            gender: this.getGenderFromPersonalNumber(ident_id),
            mobile_number: data.phone ? data.phone.substring(4) : '',
            postcode: data.postal_code || 'N/A',
            city: data.city || 'N/A',
            address: data.street || 'N/A',
            password: password,
            password_confirm: password,
        };
    };
    /**
     * @deprecated This property is deprecated as we no longer support SGA
     */
    BankIdService.prototype.setApp = function (appType) {
        this.selectedAppType = appType;
    };
    /**
     * @deprecated This property is deprecated as we no longer support SGA
     */
    BankIdService.prototype.sendAnalyticsForBankID = function (status, isLogin) {
        var action = (isLogin ? 'login' : 'register') + "_" + status;
        var trackedProperties = {
            method: 'bankID',
            selectedAppType: this.selectedAppType,
        };
        this.analyticsService.send(action, trackedProperties);
    };
    /**
     * Return date of birth casted from personalNumber
     * @param {string} personalNumber swedish personal number in format YYYYMMDDNNNN
     * @returns {string} date of birth in ISO format
     */
    BankIdService.prototype.getBirthDateFromPersonalNumber = function (personalNumber) {
        var year = personalNumber.substring(0, 4);
        var month = personalNumber.substring(4, 6);
        var day = personalNumber.substring(6, 8);
        return new Date(year + "-" + month + "-" + day).toISOString();
    };
    /**
     * Personal number is a 12 digit number. The first 8 char is date of birth,
     * the third char from the remaining 4 digit suggest the gender of the user.
     * Male: odd | Female: even
     */
    BankIdService.prototype.getGenderFromPersonalNumber = function (personalNumber) {
        var genderDigit = Number(personalNumber.substring(10, 11));
        return genderDigit % 2 ? 'male' : 'female';
    };
    return BankIdService;
}());
export { BankIdService };
