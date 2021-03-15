import { Apollo } from 'apollo-angular';
import { Subject, combineLatest, defer, EMPTY, merge, of, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, pairwise, share, switchMap, tap } from 'rxjs/operators';
import { SessionService } from 'app/core/session';
import { NotificationsQueueService, NotificationEnumType } from 'app/notifications';
import { PusherService } from 'app/pusher';
import { UserService } from 'app/user';
import { AchievementConfig } from './achievement-progress.config';
import { achievementProgressQuery, achievementLevelsQuery, } from './achievement-progress.graphql';
import * as i0 from "@angular/core";
import * as i1 from "./achievement-progress.config";
import * as i2 from "apollo-angular";
import * as i3 from "../pusher/pusher.service";
import * as i4 from "../user/user.service";
import * as i5 from "../core/session/session.service";
import * as i6 from "../notifications/notifications-queue.service";
var AchievementProgressService = /** @class */ (function () {
    function AchievementProgressService(achievementConfig, apollo, pusher, userService, sessionService, notificationsQueue) {
        var _this = this;
        this.achievementConfig = achievementConfig;
        this.apollo = apollo;
        this.levelNameStorageKey = 'LAST_ACHIEVEMENT_LEVEL';
        this.availableLevels = [];
        /**
         * List of the achieved levels reached in the same user session.
         */
        this.levelUpNotificationQueue = [];
        /**
         * (for internal use) manual triggering request for updating user achievement progress
         */
        this.progressUpdateTrigger$ = new Subject();
        this.requestLevels().subscribe(function (levels) { return _this.availableLevels = levels; });
        // TODO - kill this timer call when replaced by push notifications.
        // Using the interval for now is only for a temporary period to show updated status
        this.achievementProgress$ = defer(function () { return combineLatest([
            userService.isUserLoggedIn,
            userService.currentUser,
            userService.isLoggedInNonSga$,
        ])
            .pipe(
        // TODO: why do we provide guest as currentUser???
        switchMap(function (_a) {
            var loggedIn = _a[0], user = _a[1], isLoggedInNonSga = _a[2];
            return (loggedIn && isLoggedInNonSga) ? of(user) : of({ id: null });
        }), 
        // for each different player start new observable tracking his progress
        distinctUntilChanged(function (a, b) { return a.id === b.id; }), tap(function (user) { return _this.jurisdiction = user.jurisdiction; }), 
        // new observable for each new player
        switchMap(function (user) { return user.id ? merge(
        // periodic updates
        timer(0, 30000), 
        // manual triggered updates (like for example push notification)
        _this.progressUpdateTrigger$).pipe(
        // if manual trigger is close to periodic update we care only about last of them
        debounceTime(1000), switchMap(function () { return _this.requestProgress(user); })) : EMPTY; })); }).pipe(share());
        // Compare the last 2 achievement updates. If the name is different and user is the same, then the user got a new level.
        this.levelUp$ = this.achievementProgress$
            .pipe(pairwise(), filter(function (_a) {
            var update1 = _a[0], update2 = _a[1];
            return update1.achievement.name !== update2.achievement.name && update1.user === update2.user;
        }), map(function (_a) {
            var update = _a[1];
            return update;
        }), share());
        // trigger progress update to get more precise progress value after pusher notification
        // TODO: get the correct value from push notification then it can be merged with achievementProgress$
        // without need to trigger manual progress updates
        pusher.on('user_achievement_progress').pipe(map(function (event) { return ({
            achievement: {
                name: event.name,
            },
            progressPercentage: event.progress_percentage,
        }); }))
            .subscribe(this.updateProgress.bind(this));
        // Reset localstorage and levelUpNotificationQueue on logout/login to prevent leaking data between different user accounts
        sessionService.event$.pipe(filter(function (event) { return event.name === 'start' || event.name === 'revoke'; }))
            .subscribe(function () {
            localStorage.removeItem(_this.levelNameStorageKey);
            _this.levelUpNotificationQueue = [];
        });
        this.achievementProgress$.subscribe(function (ua) {
            var storedLevels = JSON.parse(localStorage.getItem(_this.levelNameStorageKey))
                || { lastReadLevel: ua.achievement.name, levelUpNotificationQueue: [] };
            _this.levelUpNotificationQueue = storedLevels.levelUpNotificationQueue;
            if (storedLevels.lastReadLevel !== ua.achievement.name) {
                var lastLevelIndex = _this.availableLevels.indexOf(storedLevels.lastReadLevel);
                var currentLevelIndex = _this.availableLevels.indexOf(ua.achievement.name);
                if (lastLevelIndex !== -1 && currentLevelIndex !== -1 && lastLevelIndex !== currentLevelIndex) {
                    _this.availableLevels.slice(lastLevelIndex + 1, currentLevelIndex + 1).forEach(function (name) {
                        if (!_this.levelUpNotificationQueue.find(function (f) { return f.name === name; })) {
                            _this.levelUpNotificationQueue.unshift({ name: name, unread: true });
                            storedLevels.levelUpNotificationQueue = _this.levelUpNotificationQueue;
                        }
                    });
                }
            }
            localStorage.setItem(_this.levelNameStorageKey, JSON.stringify(storedLevels));
        });
        // initialize notifications
        this.levelUp$.subscribe(function (achievement) {
            var message = _this.jurisdiction === 'sga' ? NotificationEnumType.LEVEL_UP_SGA : NotificationEnumType.LEVEL_UP;
            notificationsQueue.showByType(message, { name: achievement.achievement.name });
        });
    }
    AchievementProgressService.prototype.updateLastReadNotification = function () {
        if (this.levelUpNotificationQueue && this.levelUpNotificationQueue.length) {
            this.levelUpNotificationQueue.forEach(function (f) { return f.unread = false; });
            var storedLevels = {
                lastReadLevel: this.levelUpNotificationQueue[0].name,
                levelUpNotificationQueue: this.levelUpNotificationQueue,
            };
            localStorage.setItem(this.levelNameStorageKey, JSON.stringify(storedLevels));
        }
    };
    AchievementProgressService.prototype.dismissNotifications = function () {
        var storedLevels = {
            lastReadLevel: this.levelUpNotificationQueue[0].name,
            levelUpNotificationQueue: [],
        };
        this.levelUpNotificationQueue = [];
        localStorage.setItem(this.levelNameStorageKey, JSON.stringify(storedLevels));
    };
    AchievementProgressService.prototype.updateProgress = function () {
        this.progressUpdateTrigger$.next();
    };
    AchievementProgressService.prototype.requestLevels = function () {
        return this.apollo.query({
            query: achievementLevelsQuery,
            variables: {
                name: this.achievementConfig.levelAchievementChainName,
            },
            fetchPolicy: 'network-only',
        })
            .pipe(map(function (_a) {
            var data = _a.data;
            return data.achievementChains.edges[0].node.achievements.edges.map(function (e) { return e.node.name; });
        }));
    };
    AchievementProgressService.prototype.requestProgress = function (user) {
        var _this = this;
        return this.apollo
            .query({
            query: achievementProgressQuery,
            variables: {
                name: this.achievementConfig.levelAchievementChainName,
            },
            fetchPolicy: 'network-only',
        })
            .pipe(map(function (_a) {
            var data = _a.data;
            return data.achievementChains.edges[0].node;
        }), filter(function (achievementChain) { return achievementChain.enabled; }), map(function (achievementChain) {
            var connection = achievementChain.userAchievementConnection;
            var achievementNode = connection && connection.edges && connection.edges.length
                ? connection.edges[0].node
                : null;
            var progressPercentage = achievementNode && connection ? achievementNode.progressPercentage : 0;
            return {
                achievement: {
                    name: achievementNode ? achievementNode.achievement.name : _this.achievementConfig.defaultLevelName,
                },
                progressPercentage: Math.floor(progressPercentage),
                user: user.id,
            };
        }));
    };
    AchievementProgressService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function AchievementProgressService_Factory() { return new AchievementProgressService(i0.ɵɵinject(i1.ACHIEVEMENT_CONFIG), i0.ɵɵinject(i2.Apollo), i0.ɵɵinject(i3.PusherService), i0.ɵɵinject(i4.UserService), i0.ɵɵinject(i5.SessionService), i0.ɵɵinject(i6.NotificationsQueueService)); }, token: AchievementProgressService, providedIn: "root" });
    return AchievementProgressService;
}());
export { AchievementProgressService };
