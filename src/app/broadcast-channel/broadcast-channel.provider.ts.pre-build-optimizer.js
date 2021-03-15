import BroadcastChannel from 'broadcast-channel';
import * as i0 from "@angular/core";
var BroadcastChannelProvider = /** @class */ (function () {
    function BroadcastChannelProvider() {
        this.channels = [];
    }
    BroadcastChannelProvider.prototype.get = function (channelName) {
        var channel = this.channels.find(function (item) { return item.name === channelName; });
        if (!channel) {
            channel = new BroadcastChannel(channelName);
            this.channels.push(channel);
        }
        return channel;
    };
    BroadcastChannelProvider.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function BroadcastChannelProvider_Factory() { return new BroadcastChannelProvider(); }, token: BroadcastChannelProvider, providedIn: "root" });
    return BroadcastChannelProvider;
}());
export { BroadcastChannelProvider };
