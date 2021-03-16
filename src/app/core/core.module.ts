import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, PLATFORM_ID, Optional, SkipSelf, Inject } from '@angular/core';
import { GestureConfig, MAT_HAMMER_OPTIONS, HammerOptions } from '@angular/material/core';
import { Title, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { CacheModule, CACHE } from '@ngx-cache/core';
import { BrowserCacheModule } from '@ngx-cache/platform-browser';

import { BankIdModule } from 'app/bank-id/bank-id.module';
import { PrerenderModule } from 'app/prerender/prerender.module';

import { ActionListenerService } from './action-listener.service';
import { ApiModule } from './api';
import { APP_START } from './app-start';
import { BlacklistPreloadModules } from './blacklist-preload.strategy';
import { HistoryService } from './history.service';
import { SentryInitService } from './sentry/sentry-init.service';
import { SeoService } from './seo.service';
import { storageFactory } from './storage.factory';

@NgModule({
  imports: [
    ApiModule.forRoot(), // we can use forRoot here only because its CoreModule and it is only imported in root module
    BankIdModule.forRoot(),
    BrowserCacheModule.forRoot([{
      provide: CACHE,
      useFactory: storageFactory,
      deps: [PLATFORM_ID],
    }]),
    CacheModule.forRoot(),
    CommonModule,
    PrerenderModule,
  ],
  providers: [
    BlacklistPreloadModules,
    Title,
    DatePipe,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig,
    },
    {
      provide: MAT_HAMMER_OPTIONS,
      useValue: {
        touchAction: 'pan-y',
      } as HammerOptions,
    },
  ],
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule,
    seoService: SeoService,
    sentryInitService: SentryInitService,
    _actionListenerService: ActionListenerService,
    _historyService: HistoryService,
    @Optional() @Inject(APP_START) initializers: Array<() => void> | null,
  ) {
    // Safety guard @see https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }

    if (initializers) {
      initializers.forEach((start) => start());
    }

    sentryInitService.initialize();
    seoService.initialize();
  }
}
