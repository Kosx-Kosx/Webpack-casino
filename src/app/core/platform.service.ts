import { DOCUMENT, Location as NgLocation } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';

import { Device, IOSDeviceName } from './device.type';
import { EnvironmentType } from './environment-type.type';
import { ENVIRONMENT, EnvConfig } from './environment.config';

declare global {
  interface Window {
    Modernizr: ModernizrStatic;
  }
}

/**
 * Handle platform specific interaction like DOM manipulation.
 */
@Injectable({ providedIn: 'root' })
export class PlatformService {
  /**
   * The global window object.
   */
  public window: Window;

  /**
   * The global location object.
   */
  public location: Location;

  /**
   * The global navigator object.
   */
  public navigator: Navigator;

  /**
   * Detect if we are on IE11 needed for determining max length for get requests (2,048 characters on IE)
   */
  public isIE11: boolean;

  /**
   * Unique tab identifier
   */
  private browserTabId: string;

  /**
   * Compares the current device info with the desktop devices to check if the current device is a desktop device.
   * @returns `true` if the current platform is a desktop browser or `false` otherwise.
   */
  isDesktop: () => boolean;

  /**
   * Compares the current device info with the tablet devices to check if the current device is a tablet.
   * @returns `true` if the current platform is a tablet browser or `false` otherwise.
   */
  isTablet: () => boolean;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    @Inject(ENVIRONMENT) private environment: EnvConfig,
    private ngLocation: NgLocation,
    deviceDetector: DeviceDetectorService,
  ) {
    this.window = this.document.defaultView;
    this.location = this.document.location;
    this.navigator = this.window.navigator;

    // Adding this listener in order to enable the accessibility outline only after the user presses the tab key
    // @see BM-163
    this.window.addEventListener('keydown', this.enableAccessibility);

    // @see https://stackoverflow.com/questions/21825157/internet-explorer-11-detection
    this.isIE11 = !!(window as any).MSInputMethodContext && !!(document as any).documentMode;

    // TODO: what about isMobile shouldn't it also be bound?
    this.isDesktop = deviceDetector.isDesktop.bind(deviceDetector);
    this.isTablet = deviceDetector.isTablet.bind(deviceDetector);
  }

  /**
   * Compares the current device info with the mobile application User Agent.
   * @returns `true` if the current platform is a mobile application for iOS or `false` otherwise.
   */
  isIOSMobileApplication(): boolean {
    return this.navigator.userAgent.includes('playcherryios');
  }

  /**
   * Create an absolute URL from a relative one.
   *
   * @param url The relative URL.
   */
  prepareAbsoluteUrl(url: string) {
    return `${this.location.protocol}//${this.location.host}${this.ngLocation.prepareExternalUrl(url)}`;
  }

  /**
   * Go to an absolute URL with or without a new history entry.
   *
   * @param url The URL to go to.
   * @param replace `true` to replace the last history entry or `false` to add a new one.
   */
  gotoAbsoluteUrl(url: string, replace: boolean = false) {
    const method = replace ? 'replace' : 'assign';
    this.location[method](url);
  }

  /**
   * Get the current platform device alias.
   */
  getDevice(): Device {
    return !this.isDesktop() ? 'mobile' : 'desktop';
  }

  /** Generates unique identifier that no other browser tab has ever been given in current browser */
  private generateUniqueTabId() {
    const keyName = 'xc-last-tab-index';
    const lastTabIndex = this.window.localStorage.getItem(keyName);
    const currentTabIndex = lastTabIndex ? +lastTabIndex + 1 : 0;
    this.window.localStorage.setItem(keyName, currentTabIndex.toString());
    // Date and random number should be unique enough. Every init of XCAF increases index counter, which main role is for debug.
    // Due to the fact that access performance to localStorage is very slow in compare with in-memory operations
    // it's very likely that when two tabs refresh at the same time then both will have the same tab index
    return `${Date.now()}_${currentTabIndex.toString()}_${Math.floor(Math.random() * 10000)}`;
  }

  public getUniqueTabId() {
    if (this.browserTabId) {
      return this.browserTabId;
    }
    return this.browserTabId = this.generateUniqueTabId();
  }

  /**
   * Get whether the current platform supports touch input or not.
   */
  isTouch(): boolean {
    return this.window['Modernizr'] && this.window['Modernizr'].touchevents
      || !!(this.window.navigator.pointerEnabled && this.window.navigator.maxTouchPoints > 1); // MS Surface
  }

  /**
   * Get DOM element outer width (includes padding, border and margins).
   * Use in no sooner than at ngAfterViewInit stage.
   *
   * @param elem DOM node
   * @returns {Number} outer width in pixels. `0` when node is hidden.
   */
  public outerElemWidth(elem: HTMLElement) {
    if (!elem) {
      return 0;
    }
    const style = getComputedStyle(elem);
    return style.display === 'none' ? 0 : elem.offsetWidth + parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
  }

  /**
   * Get DOM element outer height (includes padding, border and margins).
   * Use in no sooner than at ngAfterViewInit stage.
   *
   * @param elem DOM node
   * @returns {Number} outer height in pixels. `0` when node is hidden.
   */
  public outerElemHeight(elem: HTMLElement) {
    if (!elem) {
      return 0;
    }
    const style = getComputedStyle(elem);
    return style.display === 'none' ? 0 : elem.offsetHeight + parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
  }

  /**
   * Load an external script dynamically and insert it in the body.
   */
  loadExternalScript(id: string, src: string, reload: boolean = false) {
    return new Observable<HTMLScriptElement>(observer => {
      // Complete if already loaded
      let script = this.document.getElementById(id) as HTMLScriptElement;
      if (script) {
        if (reload) {
          this.document.body.removeChild(script);
        } else {
          observer.next(script);
          observer.complete();
          return;
        }
      }

      // Load the script
      script = this.document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.onerror = (oError: ErrorEvent) => {
        // Make sure there is an error thrown even when observable doesn't catch it
        console.error('Script error in', oError.srcElement, oError);
        return observer.error.call(observer, oError);
      };

      script.onload = () => {
        observer.next(script);
        observer.complete();
      };

      this.document.body.appendChild(script);
    });
  }

  /**
   * Attempt to remove service workers on demand.
   * @returns {Promise} Promise that should fulfill when all workers are dead.
   */
  public unregisterServiceWorkers() {
    return new Promise((resolve) => {
      const navigator = this.window.navigator;
      if (navigator && navigator.serviceWorker) {
        return navigator.serviceWorker.getRegistrations()
          .then(registrations => Promise.all(registrations.map(reg => reg.unregister())))
          .then(resolve, resolve);
      }
      resolve();
    });
  }

  /**
   * Detect if platform is iOS
   * @returns {IOSDeviceName | false}
   */
  detectIOS(): IOSDeviceName | false {
    switch (navigator.platform) {
      case 'iPad':
        return 'iPad';
      case 'iPhone':
        return 'iPhone';
      case 'iPod':
        return 'iPod';
    }
    return false;
  }

  /**
   * Returns the environment type that app is currently running at.
   *
   * @returns {EnvironmentType} Name of the environment
   */
  public getEnvironmentType(): EnvironmentType {
    let environmentType: EnvironmentType = 'production';

    if (!this.environment.production) {
      environmentType = 'localhost';
      // Eg. staging.eurolotto.com, staging-xcaf.eurolotto.com, eurolotto-stg-k8s.xcaliber.io
      if (/(staging|stg)/.test(this.window.location.hostname)) {
        environmentType = 'staging';
      }
      // Eg. smc-xcaf-smc-gt-220-sentry.kbox.k8s.xcaliber.io, smc-xcaf-smc-gt-220-sentry.kbox-ext.k8s.xcaliber.io
      else if (/k8s\.xcaliber\.io$/.test(this.window.location.hostname)) {
        environmentType = 'falcon';
      }
    }

    return environmentType;
  }

  private enableAccessibility = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      this.document.body.classList.add('allow-outline');
      this.window.removeEventListener('keydown', this.enableAccessibility);
    }
  }
}
