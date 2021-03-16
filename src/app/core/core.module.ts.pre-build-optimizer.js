import { HammerOptions } from '@angular/material/core';
import { ActionListenerService } from './action-listener.service';
import { HistoryService } from './history.service';
import { SentryInitService } from './sentry/sentry-init.service';
import { SeoService } from './seo.service';
import { storageFactory } from './storage.factory';
var ɵ0 = storageFactory, ɵ1 = {
    touchAction: 'pan-y',
};
var CoreModule = /** @class */ (function () {
    function CoreModule(parentModule, seoService, sentryInitService, _actionListenerService, _historyService, initializers) {
        // Safety guard @see https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
        if (initializers) {
            initializers.forEach(function (start) { return start(); });
        }
        sentryInitService.initialize();
        seoService.initialize();
    }
    return CoreModule;
}());
export { CoreModule };
export { ɵ0, ɵ1 };
