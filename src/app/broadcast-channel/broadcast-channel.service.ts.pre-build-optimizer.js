import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';
import { Logger } from 'app/core/logger';
import { BroadcastChannelProvider } from './broadcast-channel.provider';
import { LeaderElectorProvider } from './leader-elector.provider';
import * as i0 from "@angular/core";
import * as i1 from "./broadcast-channel.provider";
import * as i2 from "./leader-elector.provider";
import * as i3 from "../core/logger";
export var BROADCAST_CHANNEL_NAME = new InjectionToken('broadcast-channel-name');
var BroadcastChannelService = /** @class */ (function () {
    function BroadcastChannelService(broadcastChannelProvider, leaderElectorProvider, channelName, logger) {
        var _this = this;
        this.broadcastChannelProvider = broadcastChannelProvider;
        this.leaderElectorProvider = leaderElectorProvider;
        this.channelName = channelName;
        this.logger = logger;
        /** Name of broadcast channel used for communication */
        this.CHANNEL_NAME = 'main';
        this.broadcastChannel = this.broadcastChannelProvider.get(this.channelName);
        this.connection = {};
        this.messages$ = new Observable(function (observer) {
            var handler = function (message) {
                observer.next(message);
            };
            _this.broadcastChannel.addEventListener('message', handler);
            return function () {
                _this.broadcastChannel.removeEventListener('message', handler);
            };
        });
        this.leaderElector = this.leaderElectorProvider.get(this.broadcastChannel);
        /**
         * Signals when opened window/browser tab is elected as leader and
         * can be used to initialize logic that should only run once per all browser tabs.
         */
        this.onUpgradeToLeader = this.leaderElector.awaitLeadership();
    }
    Object.defineProperty(BroadcastChannelService.prototype, "isMaster", {
        get: function () {
            return this.leaderElector.isLeader;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create observer that listens to specific types of messages.
     *
     * @param {string} type defines what messages type should be handled by created observer
     */
    BroadcastChannelService.prototype.on = function (type) {
        var _this = this;
        if (!this.connection[type]) {
            this.connection[type] = this.messages$.pipe(filter(function (message) { return message.type === type; }), tap(function (message) { return _this.logger.log('%cBroadcastChannelService:on', 'color: #080', type, message); }), map(function (_a) {
                var payload = _a.payload;
                return payload;
            }), share());
        }
        return this.connection[type];
    };
    /**
     * Emits messages to other tabs.
     *
     * @param type choose what message type listener you want to target
     * @param payload additional data related to message
     */
    BroadcastChannelService.prototype.emit = function (type, payload) {
        this.logger.log('%cBroadcastChannelService:emit', 'color: #0a0', type, payload);
        this.broadcastChannel.postMessage({ type: type, payload: payload });
    };
    BroadcastChannelService.prototype.close = function () {
        this.broadcastChannel.close();
    };
    BroadcastChannelService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function BroadcastChannelService_Factory() { return new BroadcastChannelService(i0.ɵɵinject(i1.BroadcastChannelProvider), i0.ɵɵinject(i2.LeaderElectorProvider), i0.ɵɵinject(BROADCAST_CHANNEL_NAME), i0.ɵɵinject(i3.Logger)); }, token: BroadcastChannelService, providedIn: "root" });
    return BroadcastChannelService;
}());
export { BroadcastChannelService };
