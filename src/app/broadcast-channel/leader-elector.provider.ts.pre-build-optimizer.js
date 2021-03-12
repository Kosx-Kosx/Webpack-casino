var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { InjectionToken } from '@angular/core';
export var LEADER_ELECTION = new InjectionToken('broadcast-channel-leader-election');
/**
 * Signals when browser tabs is switched to being master tab for broadcast channel.
 */
var LeaderElectorProvider = /** @class */ (function () {
    function LeaderElectorProvider(leaderElection) {
        this.leaderElection = leaderElection;
        this.electors = {};
    }
    LeaderElectorProvider.prototype.get = function (channel, options) {
        var elector = this.electors[channel.name];
        if (!elector) {
            this.electors[channel.name] = elector = this.leaderElection.create(channel, __assign({ fallbackInterval: 10000, responseTime: 3000 }, options));
        }
        return elector;
    };
    return LeaderElectorProvider;
}());
export { LeaderElectorProvider };
