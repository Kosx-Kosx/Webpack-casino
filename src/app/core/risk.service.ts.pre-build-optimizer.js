import { HttpClient } from '@angular/common/http';
import { of, Subject, zip } from 'rxjs';
import { map, switchMap, tap, filter, distinctUntilChanged, mapTo } from 'rxjs/operators';
import { AppConfig } from 'app/core/app.config';
import { CacheService } from 'app/core/cache.service';
import { UserService } from 'app/user';
import * as i0 from "@angular/core";
import * as i1 from "./cache.service";
import * as i2 from "@angular/common/http";
import * as i3 from "../user/user.service";
import * as i4 from "./app.config";
var RiskService = /** @class */ (function () {
    function RiskService(cacheService, http, userService, appConfig) {
        var _this = this;
        this.cacheService = cacheService;
        this.http = http;
        this.userService = userService;
        this.mentorMessagesStorageKey = 'mentor-msg';
        this.messageToMarkAsRead$ = new Subject();
        /**
         * This is needed because `UserService.currentLoggedInUser` cannot have `shareReplay(1)`.
         *
         * The reason for this is that we cannot allow user data to be cached when next user logs in,
         * but in this service we need to access current user at later stage, so here we need
         * to use `currentUser` and we're making sure that we won't run anything for guest user.
         */
        this.newUserLogin$ = this.userService.currentUser.pipe(distinctUntilChanged(function (prev, curr) { return prev.id === curr.id; }), switchMap(function (user) { return _this.userService.isUserLoggedIn.pipe(filter(Boolean), mapTo(user)); }));
        if (appConfig.riskFeaturesEnabled) {
            // Handle marking messages as shown (deleting them from saved messages in cache)
            this.newUserLogin$.pipe(switchMap(function (user) { return _this.messageToMarkAsRead$.pipe(switchMap(function (msgToMark) { return _this.getCachedMentorMessages(user).pipe(map(function (messages) { return messages.filter(function (msg) { return msg.MessageID !== msgToMark.MessageID; }); })); }), switchMap(function (updatedMsgs) { return _this.saveMentorMessages(user, updatedMsgs); })); })).subscribe();
        }
    }
    /** Returns risk categories in a standardized way */
    RiskService.prototype.getCategories = function () {
        var _this = this;
        return this.http.get("{{apiEndpoint}}/players/risk-profile").pipe(switchMap(function (data) {
            // Risk profile data may be unavailable for some users
            return (data.risk_profile && data.risk_profile.RiskCategoryGlobalID) ?
                of({
                    globalRisk: _this.interpretRiskById(data.risk_profile.RiskCategoryGlobalID),
                    moneyRisk: _this.interpretRiskById(data.risk_profile.RiskCategoryMoneyID),
                    timeRisk: _this.interpretRiskById(data.risk_profile.RiskCategoryTimeID),
                    responsibleGamingRisk: _this.interpretRiskById(data.risk_profile.RiskCategoryResponsibleGamingID),
                }) :
                of(null);
        }));
    };
    /**
     * Gets all the messages from mentor for current user which have not been returned before.
     *
     * The logic is as follows: If the message has "ReadDate" field that equals '01.01.0001', it means it's returned for the first time.
     * It also includes all the messages not shown previously from localStorage.
     *
     * @returns {Observable<string[]>} a stream that emits all currently new messages as an array of strings
     */
    RiskService.prototype.getAllUnreadMentorMessages = function () {
        var _this = this;
        return this.newUserLogin$.pipe(switchMap(function (user) {
            return zip(_this.getNewMentorMessages(), _this.getCachedMentorMessages(user))
                .pipe(map(function (_a) {
                var newMessages = _a[0], cachedMessages = _a[1];
                return cachedMessages.concat(newMessages);
            }), tap(function (messages) { return _this.saveMentorMessages(user, messages); }));
        }));
    };
    /**
     * Mark given mentor message as read, which results in removing it from localStorage and
     * making sure it will not be shown again after next login.
     *
     * @param {IMentorIndividualMessage} messageToMark a message to be removed from localStorage
     */
    RiskService.prototype.markMentorMessageAsRead = function (messageToMark) {
        this.messageToMarkAsRead$.next(messageToMark);
    };
    RiskService.prototype.interpretRiskById = function (riskId) {
        switch (riskId) {
            case '1':
                return {
                    levelName: 'minimal',
                    percentage: 10,
                };
            case '2':
                return {
                    levelName: 'low',
                    percentage: 30,
                };
            case '3':
                return {
                    levelName: 'medium',
                    percentage: 60,
                };
            case '4':
                return {
                    levelName: 'high',
                    percentage: 90,
                };
        }
    };
    RiskService.prototype.getNewMentorMessages = function () {
        return this.http.get("{{apiEndpoint}}/messages/mentor").pipe(map(function (response) { return response.messageList.filter(function (message) { return message.ReadDate === '01.01.0001'; }); }));
    };
    RiskService.prototype.getCachedMentorMessages = function (user) {
        return this.cacheService.requestUserData(user, this.mentorMessagesStorageKey, []);
    };
    RiskService.prototype.saveMentorMessages = function (user, messages) {
        return this.cacheService.pushUserData(user, this.mentorMessagesStorageKey, messages);
    };
    RiskService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function RiskService_Factory() { return new RiskService(i0.ɵɵinject(i1.CacheService), i0.ɵɵinject(i2.HttpClient), i0.ɵɵinject(i3.UserService), i0.ɵɵinject(i4.APP_CONFIG)); }, token: RiskService, providedIn: "root" });
    return RiskService;
}());
export { RiskService };
