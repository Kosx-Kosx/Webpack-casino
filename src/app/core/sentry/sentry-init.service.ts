import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationRef, Injectable, Inject, LOCALE_ID, ErrorHandler, VERSION, Renderer2, RendererFactory2 } from '@angular/core';
import { addBreadcrumb, configureScope, init, Severity, captureException, captureMessage } from '@sentry/browser';
import { Dedupe } from '@sentry/integrations';
import { Breadcrumb, BreadcrumbHint, Event, EventHint } from '@sentry/types';
import { TimeoutError, combineLatest, of, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, distinctUntilKeyChanged, first, catchError, take } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from 'app/core/app.config';
import { ENVIRONMENT, EnvConfig } from 'app/core/environment.config';
import { LocationService } from 'app/core/location';
import { PlatformService } from 'app/core/platform.service';
import { RealityCheckService } from 'app/reality-check/reality-check.service';
import { UserService, IUser } from 'app/user';

import { SENTRY_CONFIG, SentryConfig } from './sentry.config';
import { SentryGeneralFingerprint, SentryURLDetails, SentryGraphQLRequestDetails, SentryResponseExtraData } from './sentry.interface';
import { SentryService } from './sentry.service';

declare global {
  interface Window {
    SENTRY_RELEASE: string;
  }
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error: any) {
    captureException(error.originalError || error);
    console.error(error);
  }
}

@Injectable({ providedIn: 'root' })
export class SentryInitService {
  private renderer: Renderer2;

  constructor(
    private applicationRef: ApplicationRef,
    private locationService: LocationService,
    private platformService: PlatformService,
    private realityCheckService: RealityCheckService,
    private rendererFactory: RendererFactory2,
    private sentryService: SentryService,
    private userService: UserService,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(ENVIRONMENT) private environment: EnvConfig,
    @Inject(LOCALE_ID) private currentLocale: string,
    @Inject(SENTRY_CONFIG) private sentryConfig: SentryConfig,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Polyfill for missing URL API in IE11.
   *
   * @param {string} url The url to be parsed
   * @returns {SentryURLDetails} equivalent of new Url()
   */
  private parseUrl(url: string): SentryURLDetails {
    // Empty <a href=""> returns url of the current document instead of the link
    if (typeof url !== 'string' || !url.length) {
      return {};
    }

    const urlDetails = this.platformService.document.createElement('a');
    urlDetails.href = url;

    return {
      hash: urlDetails.hash,
      host: urlDetails.host,
      origin: urlDetails.origin,
      pathname: urlDetails.pathname,
      protocol: urlDetails.protocol,
      search: urlDetails.search,
    };
  }

  /**
   * Decodes and extracts details from GraphQL request url
   *
   * @param {SentryURLDetails} url Parsed url
   * @returns {SentryGraphQLRequestDetails} Details as an object
   */
  private parseGraphQLUrl(url: SentryURLDetails): SentryGraphQLRequestDetails {
    if (url.pathname !== '/graphql' || url.search.indexOf('operationName=') === -1) {
      return {};
    }

    let operationName: any = url.search.match(/operationName=([^&]*)/);
    operationName = this.sentryService.forceSafeString(
      Array.isArray(operationName) ? operationName[1] : '',
    );

    let query: any = url.search.match(/query=([^&]*)/);
    query = this.sentryService.forceSafeString(
      Array.isArray(query) ? decodeURI(query[1]) : '{}',
    );

    let variables: any = url.search.match(/variables=([^&]*)/);
    variables = Array.isArray(variables) ? variables[1] : '{}';
    try { variables = JSON.parse(decodeURI(variables)); } catch (e) {}

    return {
      operationName,
      query,
      variables,
    };
  }

  /**
   * Bind some context to reported errors.
   * This gives the ability to drill down into the number of users affecting an issue.
   */
  public initialize() {
    if (!this.environment.sentryDsn) {
      return;
    }

    const currentEnvironment = this.platformService.getEnvironmentType();
    if (!this.sentryConfig.allowedEnvironments.includes(currentEnvironment)) {
      console.warn(`Sentry is disabled for this environment (${currentEnvironment})`);
      return;
    }

    if (Array.isArray(this.sentryConfig.ignoredFingerprintsProd) && currentEnvironment === 'production') {
      this.sentryConfig.ignoredFingerprints = this.sentryConfig.ignoredFingerprintsProd;
    }

    // `#RELEASE_ID#` string (defined in `index.html`) is being replaced by Bamboo deployment process.
    // Adding the default value to avoid error when it gets removed from `index.html`
    const releaseId = this.platformService.window.SENTRY_RELEASE || currentEnvironment;

    init({
      // `dsn` is "Client Key". Every Sentry project has it's own dsn.
      // `localhost` errors report to dedicated project to avoid polluting real errors.
      dsn: currentEnvironment === 'localhost'
        ? 'https://d96112dd7b084a8f9e87b0228c7e8301@o271098.ingest.sentry.io/1731604'
        : this.environment.sentryDsn,
      environment: `${this.appConfig.brand.toUpperCase()} - ${currentEnvironment}`,
      beforeBreadcrumb: this.onBeforeBreadcrumb.bind(this),
      beforeSend: this.onBeforeSend.bind(this),
      // If `#RELEASE_ID#` remained unchanged in means that deployment wasn't involved and app is running outside staging/prod env
      // or Bamboo post-deployment task is not set.
      release: `${this.appConfig.brand.toUpperCase()}#${releaseId.replace('#RELEASE_ID#', currentEnvironment)}`,
      integrations: integrations => {
        if (this.sentryConfig.deduplicateEvents) {
          integrations = integrations.concat(new Dedupe());
        }
        return integrations;
      },
    });

    this.saveContextData();
  }

  /**
   * Grabs extra information about eg. user or environment that will help filter out events.
   */
  private saveContextData() {
    configureScope(scope => {
      // Current locale
      scope.setTag('locale_id', this.currentLocale);

      // AdBlocker enabled or not
      scope.setTag('has_adblocker', this.hasAdBlocker().toString());

      // Check connection to FAPI.
      // Location service is used because this service is always used during app init anyway.
      // @TODO: this is not a perfect method because many other services may have already failed before this is resolved.
      // We need to detect it earlier. Maybe use APP_INITIALIZER?
      scope.setTag('fapi_connection_status', 'detecting');
      const fapiConnectionStatus$: Observable<string> = this.locationService.location$.pipe(
        map(() => '200'),
        catchError((error) => {
          return of(
            error instanceof HttpErrorResponse
              ? error.status.toString() // Network error
              : (error.error ? error.error.message.toString() : 'unknown'), // Client error
          );
        }),
        take(1),
      );
      fapiConnectionStatus$.subscribe(status => {
        scope.setTag('fapi_connection_status', status);
      });

      // App state (helps with debugging service worker issues)
      scope.setTag('is_app_stable', 'false');
      this.applicationRef.isStable.pipe(
        first(isStable => isStable),
      ).subscribe(() => {
        scope.setTag('is_app_stable', 'true');
        scope.addBreadcrumb({
          category: 'App state',
          message: 'App is now stable',
          level: Severity.Info,
        });
      });

      // User context
      combineLatest([
        this.userService.currentUserState.pipe(
          distinctUntilChanged(),
        ),
        this.userService.currentUser.pipe(
          distinctUntilKeyChanged('id'),
        ),
      ]).pipe(
        debounceTime(100),
        map(([currentUserState, currentUser]) => {
          scope.setTag('user_state', currentUserState);

          scope.setUser({
            // No need to `setTag` because `user.id` tag is created automatically when calling `setUser`
            id: (currentUser && currentUser.id) || '-',
            state: currentUserState,
          });

          scope.addBreadcrumb({
            category: 'User state',
            message: `User ID: ${(currentUser && currentUser.id) || '-'}; User state: ${currentUserState}`,
            level: Severity.Info,
          });

          // Tags to help filter down users
          [
            'country',
            'currency',
            'jurisdiction',
          ].forEach((key: keyof IUser) => {
            scope.setTag(
              key,
              currentUser && typeof currentUser[key] !== 'undefined' ? currentUser[key].toString() : 'undefined',
            );
          });
        }),
      ).subscribe();

      // Brand
      scope.setTag('brand', this.appConfig.brand);

      // Mobile / desktop
      scope.setTag('is_mobile', this.platformService.isDesktop() ? 'false' : 'true');

      // NG version
      scope.setTag('ng_version_major', VERSION.major);
      scope.setTag('ng_version', VERSION.full);

      // Detect OFFLINE/ONLINE state. Helps investigate if FAPI connection problem was because of lost internet connection
      // or because user has browser extension which blocks FAPI requests.
      // Note: In Chrome and Safari `online` means that there is ANY kind of connection available (eg. LAN, not necessarily Internet)
      scope.setTag('was_offline', 'false');
      this.platformService.window.addEventListener('offline', () => {
        scope.addBreadcrumb({
          category: `Connectivity`,
          message: `Connection is now offline`,
          level: Severity.Info,
        });
        scope.setTag('was_offline', 'true');
      });
      // Even is emitted only when connection was offline and then comes back online. It doesn't emit at app launch.
      this.platformService.window.addEventListener('online', () => {
        scope.addBreadcrumb({
          category: `Connectivity`,
          message: `Connection came back online`,
          level: Severity.Info,
        });

        // Is a DESH user is currently playing a game then we need to know that confirmation of showing the reality check modal
        // possibly failed to be sent because of the lost connection.
        if (this.realityCheckService.currentGameSession) {
          captureMessage('Connection came back online', Severity.Info);
        }
      });

      scope.setTag('was_tab_hidden', 'false');
      this.platformService.document.addEventListener('visibilitychange', () => {
        const currentVisibility = this.platformService.document.visibilityState;
        scope.addBreadcrumb({
          category: `Visibility`,
          message: `Browser tab visibility is now: ${currentVisibility}`,
          level: Severity.Info,
        });
        scope.setTag('visibility_state', currentVisibility);
        if (currentVisibility !== 'visible') {
          scope.setTag('was_tab_hidden', 'true');
        }
      });

      // Test support for LocalStorage
      scope.setTag('has_localstorage', 'false');
      try {
        const storageKey = `Test ${Math.random().toString()}`;
        this.platformService.window.localStorage.setItem(storageKey, 'ok');
        if (this.platformService.window.localStorage.getItem(storageKey) !== 'ok') {
          throw Error('LocalStorage not working');
        }
        this.platformService.window.localStorage.removeItem(storageKey);
        scope.setTag('has_localstorage', 'true');
      } catch (error) {
      }

      // Save info if XCAF is running inside an iframe
      scope.setTag('is_iframed', this.platformService.window.self !== this.platformService.window.top);

      // Save info if XCAF is running inside a Playcherry mobile app
      scope.setTag('is_playcherry_webview', this.platformService.navigator.userAgent.includes('playcherryapps').toString());

      // Save referrer f.e. to detect which URL embeds XCAF in an iframe
      const referrerAnchorTestElem = this.platformService.document.createElement('a');
      referrerAnchorTestElem.href = this.platformService.document.referrer;
      /** Host name of the referrer or "false" string when there's no such (when page was loaded directly via URL) */
      const referrerHost = referrerAnchorTestElem.host !== this.platformService.document.location.host
        ? referrerAnchorTestElem.host
        : false;
      scope.setTag('referrer', referrerHost ? this.platformService.document.referrer : 'false');
      scope.setTag('referrer_host', referrerHost.toString());

      // Browser ID may be useful in grouping multiple events from the same browser tab
      scope.setTag('tab_id', this.platformService.getUniqueTabId());
    });
  }

  /**
   * Handler for Sentry's `beforeBreadcrumb`
   *
   * @param {Breadcrumb} breadcrumb
   * @param {BreadcrumbHint} hint
   * @returns {(Breadcrumb | null)}
   */
  private onBeforeBreadcrumb(breadcrumb: Breadcrumb, hint: BreadcrumbHint): Breadcrumb | null {
    // Add extra context about XHR errors
    if (breadcrumb.category === 'xhr') {
      configureScope(scope => {
        const httpStatus: number = hint.xhr.status || (breadcrumb.data ? breadcrumb.data.status_code : 0);
        const responseUrl = this.sentryService.forceSafeString(
          hint.xhr.responseURL || (breadcrumb.data ? breadcrumb.data.url : ''),
        );
        const responseBody = this.sentryService.forceSafeString(
          hint.xhr.response || hint.xhr.responseText,
        );
        const responseUrlDetails = this.parseUrl(responseUrl);
        const graphQLRequestDetails = this.parseGraphQLUrl(responseUrlDetails);

        // Try parsing response as object
        let responseObject: any = {};
        try {
            responseObject = JSON.parse(responseBody);
        } catch (e) {}

        // Extract GraphQL errors that are returned with HTTP status 200
        let graphQLErrors: any[] = [];
        let graphQLErrorDetails: any = {};
        if (Array.isArray(responseObject.errors) && responseObject.errors.length) {
          graphQLErrors = responseObject.errors;
          graphQLErrorDetails = responseObject.errors[0];
        }
        const isFapiRequest = /frontapi/.test(responseUrlDetails.host);

        // Add default tag values
        scope.setTag('graphql_failed_operation', 'false');
        scope.setTag('has_error_response_0_3rdparty', 'false');
        scope.setTag('has_error_response_0_fapi', 'false');
        scope.setTag('has_error_response_5xx', 'false');
        scope.setTag('has_error_response_any', 'false');
        scope.setTag('has_error_response_assets', 'false');
        scope.setTag('has_error_response_fapi', 'false');
        scope.setTag('has_error_response_graphql', 'false');
        scope.setTag('has_error_response_unauth', 'false');

        // Omarsys sends a lot of user details in GET query params. Need to remove it all for data safety.
        if (/omarsys\.com$/.test(responseUrlDetails.host)) {
          breadcrumb.data.url = breadcrumb.data.url.replace(responseUrlDetails.search, '/QUERY_PARAMS_REMOVED');
        }

        // HTTP 4xx are errors
        if ((httpStatus === 0 || httpStatus >= 400)
            // ignore expected error responses
            && (!(httpStatus === 422 && responseUrlDetails.pathname === '/players')) // Blocked by iovation
            // do not ignore Forced logout response to collect more data for issue GT-310
            // && (!(httpStatus === 403 && responseUrlDetails.pathname === '/balances')) // Forced logout
            && (!(httpStatus === 404 && responseUrlDetails.pathname === '/payment-methods/last')) // When user has never used a credit card
            && (!(httpStatus === 404 && responseUrlDetails.pathname === '/game-sessions/current')) // When user not made a spin yet
        ) {
          let extraData: SentryResponseExtraData = {
            url: responseUrl,
            method: breadcrumb.data ? breadcrumb.data.method : '',
            status_code: httpStatus,
            status_text: hint.xhr.statusText,
            title: responseObject.title,
            detail: responseObject.detail,
            response: responseBody,
          };

          if (graphQLRequestDetails.operationName) {
              extraData = {
                ...extraData,
                gql_operation: graphQLRequestDetails.operationName,
                gql_variables: graphQLRequestDetails.variables,
                gql_query: graphQLRequestDetails.query,
              };
          }

          // Add context data
          scope.setTag('has_error_response_any', 'true');
          scope.setTag('http_status', httpStatus + '');
          // Add tags to help filter down FAPI errors
          if (isFapiRequest) {
            scope.setTag('has_error_response_fapi', 'true');
            scope.setTag('error_fapi_path', responseUrlDetails.pathname); // helps filtering by endpoint (eg /location vs /graphql)
          }

          // Add extra breadcrumb with more context (eg. response body)
          addBreadcrumb({
            message: `HTTP error`,
            level: Severity.Error,
            data: extraData,
          });

          // Status: 404 for assets
          if (/\.(css|eot|gif|ico|jpeg|jpg|otf|png|svg|swf|ttf|woff|woff2)$/.test(responseUrlDetails.pathname)) {
            scope.setTag('has_error_response_assets', 'true');
            return;
          }

          // Status: 401 + 403 for FAPI
          // FAPI, when auth token is expired, returns 401/403 even for requests to `/location`. No need to analyze it.
          if (isFapiRequest && [401, 403].includes(httpStatus)) {
            scope.setTag('has_error_response_unauth', 'true');
            scope.setTag('error_fapi_path', responseUrlDetails.pathname); // helps filtering by endpoint (eg /location vs /graphql)
            const fingerprint = [
              SentryGeneralFingerprint.FAPI_UNAUTHORIZED,
              responseUrlDetails.pathname,
              `XHR_${httpStatus}`,
            ];
            scope.setFingerprint(fingerprint);
            scope.addBreadcrumb({
              message: `Adding fingerprint: ${fingerprint.join('|')}`,
              level: Severity.Info,
            });
            return;
          }

          // HTTP Status 0 means that XHR request either has not been sent at all (eg. blocked by AdBlock, lost connection on mobile),
          // or it was aborted before completing it (eg. when observable with an ongoing HTTP request is unsubscribed by onDestroy)
          if (httpStatus === 0) {
            // This is not FAPI - stop processing. Much likely that Omarsys calls are just blocked by ad blockers.
            if (!isFapiRequest) {
              scope.setTag('has_error_response_0_3rdparty', 'true');
              scope.setFingerprint([
                SentryGeneralFingerprint.CONNECTION_FAILED_3RDPARTY,
              ]);
              scope.addBreadcrumb({
                message: `Adding fingerprint: ${SentryGeneralFingerprint.CONNECTION_FAILED_3RDPARTY}`,
                level: Severity.Info,
              });
            }

            // Blocked FAPI request with HTTP 0 status
            // Most of cases for 0 status are cancelled request (eg. when user exits lobby before request to fetch lobby has completed).
            // We only need to know when requests related to logging game session duration are failing (tracking reality check).
            else {
              this.sentryService.setFingerprint([
                SentryGeneralFingerprint.FAPI_CONNECTION_FAILED,
                responseUrlDetails.pathname,
                `XHR_${httpStatus}`,
              ]);
              scope.setTag('has_error_response_0_fapi', 'true');
            }

            return;
          }

          // Status: 5xx - server errors. It should also be logged in our internal backend Sentry.
          if (httpStatus >= 500 && httpStatus < 600) {
            scope.setTag('has_error_response_5xx', 'true');

            // Status: 504 or 500 with "timeout" message
            // Happens always when CoreAPI is being deployed
            if (httpStatus === 504 || (httpStatus === 500 && responseObject.detail === 'Receive timed out')) {
              scope.setFingerprint([
                SentryGeneralFingerprint.TIMEOUT,
              ]);
              scope.addBreadcrumb({
                message: `Adding fingerprint: ${SentryGeneralFingerprint.TIMEOUT}`,
                level: Severity.Info,
              });
              return;
            }

            // Status: 5xx, other than timeout
            else {
              scope.setFingerprint([
                SentryGeneralFingerprint.HTTP_5xx_ERROR,
              ]);
              scope.addBreadcrumb({
                message: `Adding fingerprint: ${SentryGeneralFingerprint.HTTP_5xx_ERROR}`,
                level: Severity.Info,
              });
              return;
            }
          }

          // Status: other than above
          // Merge similar error codes by HTTP status + host + pathname (avoid unique query params)
          // Not-grouped errors differ only by their call stack, which would generate many duplicates in reports.
          const errorFingerprint: string[] = [
            isFapiRequest ? 'FAPI' : responseUrlDetails.host, // Add 3rd party host or just `FAPI`
            responseUrlDetails.pathname,
            `XHR_${httpStatus}`,
          ];
          if (extraData.gql_operation) {
            scope.setTag('graphql_failed_operation', extraData.gql_operation);
            errorFingerprint.push(extraData.gql_operation);
          }
          scope.setFingerprint(errorFingerprint);
          // Add breadcrumb to more visibly explain why eg. various GraphQL errors were merged
          scope.addBreadcrumb({
            message: `HTTP XHR error. Adding fingerprint: ${errorFingerprint.join('|')}`,
            level: Severity.Info,
          });
        }

        // Successful HTTP responses with a GraphQL errors in response body (GQL syntax errors or server errors)
        else if (graphQLErrorDetails.message) {
          scope.setTag('has_error_response_graphql', 'true');

          let gqlData: object = {
            url: responseUrl,
            method: breadcrumb.data ? breadcrumb.data.method : '',
            category: graphQLErrorDetails.category,
            message: graphQLErrorDetails.message,
            errors: graphQLErrors,
          };

          if (graphQLRequestDetails.operationName) {
            gqlData = {
              ...gqlData,
              gql_operation: graphQLRequestDetails.operationName,
              gql_variables: graphQLRequestDetails.variables,
              gql_query: graphQLRequestDetails.query,
            };
          }

          addBreadcrumb({
            category: 'GraphQL',
            message: `GraphQL error response`,
            level: Severity.Error,
            data: gqlData,
          });

          if (graphQLErrorDetails.message === 'Internal server error') {
            scope.setFingerprint([
              SentryGeneralFingerprint.HTTP_5xx_ERROR,
            ]);
            scope.addBreadcrumb({
              message: `Adding fingerprint: ${SentryGeneralFingerprint.HTTP_5xx_ERROR}`,
              level: Severity.Info,
            });
            return;
          }

          // Extra data is not available in POST requests. Don't add such fingerprint. It would be not precise enough.
          if (graphQLRequestDetails.operationName) {
            const fingerprint: string[] = [
              SentryGeneralFingerprint.GRAPHQL_ERROR,
              graphQLRequestDetails.operationName,
              graphQLErrorDetails.category,
              graphQLErrorDetails.message,
            ];
            scope.setFingerprint(fingerprint);
            scope.setTag('graphql_failed_operation', graphQLRequestDetails.operationName);
            scope.addBreadcrumb({
              message: `Adding fingerprint: ${fingerprint.join('|')}`,
              level: Severity.Info,
            });
            this.sentryService.captureException(
              new Error(`GraphQL Error (${graphQLRequestDetails.operationName})`),
              graphQLRequestDetails.operationName ? `gql_${graphQLRequestDetails.operationName}` : null,
            );
          }

        }
      });
    }

    // When some components initialize there are some weird fake `click` events emitted
    // even though user don't click anything
    if (breadcrumb.category === 'ui.click'
      && !(hint.event instanceof MouseEvent)
      && !(hint.event instanceof KeyboardEvent)
    ) {
      return null;
    }

    // Generate more readable selector path to clicked element
    if (breadcrumb.category === 'ui.click' && hint.event.path) {
      let breadcrumbReadableSelector = '';
      /** `true` when an element which has unique enough attribute was found */
      let readableElementFound = false;
      // Go up in the DOM tree of the clicked element
      hint.event.path.forEach((element: HTMLElement) => {
        if (element.getAttribute) {
          if (element.tagName !== 'XC-ROOT') {
            const componentTagName = (/^XC\-.*/.test(element.tagName) ? element.tagName : '');
            const anchorText = (element.tagName === 'A' ? element.textContent : '')
              .replace(/\r?\n|\r/g, ' ') // replace new lines with spaces
              .replace(/ +(?= )/g, ''); // replace multiple spaces into a single space
            const buttonText = (element.tagName === 'BUTTON' ? element.textContent : '')
              .replace(/\r?\n|\r/g, ' ')
              .replace(/ +(?= )/g, '');
            const matButtonColor = (element.getAttribute('mat-button') !== null && element.getAttribute('color'));
            const linkTitle = ['A', 'BUTTON'].includes(element.tagName) ? element.getAttribute('title') : '';
            const elementReadableSelector = (element.getAttribute('data-e2e') ? `[data=e2e="${element.getAttribute('data-e2e')}"]` : '')
              + (element.getAttribute('svgicon') ? `[svgicon="${element.getAttribute('svgicon')}"]` : '')
              + (element.getAttribute('formcontrolname') ? `[formcontrolname=${element.getAttribute('formcontrolname')}]` : '')
              + (matButtonColor ? `[mat-button][color="${element.getAttribute('color')}"]` : '')
              + (linkTitle ? `[title="${linkTitle}"]` : '') // Note: when xc-loader shows up then text will be empty
              + (anchorText ? `(anchorText:${anchorText})` : '')
              + (buttonText ? `(buttonText:${buttonText})` : '')
            ;
            if (componentTagName) {
              breadcrumbReadableSelector = breadcrumbReadableSelector
                  ? `${componentTagName} > ${breadcrumbReadableSelector}`
                  : componentTagName;
            }
            if (elementReadableSelector) {
              readableElementFound = true;
              breadcrumbReadableSelector = breadcrumbReadableSelector
                ? `${elementReadableSelector} > ${breadcrumbReadableSelector}`
                : elementReadableSelector;
            }
          }
        }
      });
      breadcrumb.message = this.sentryService.forceSafeString(readableElementFound ? breadcrumbReadableSelector : breadcrumb.message);
    }

    // Escape eg. input's `type="password"`
    if (breadcrumb.category === 'ui.input') {
      breadcrumb.message = this.sentryService.forceSafeString(breadcrumb.message);
    }

    // Escape paths, eg. `modal:reset-password`
    if (breadcrumb.category === 'navigation' && breadcrumb.data) {
      breadcrumb.data.from = this.sentryService.forceSafeString(breadcrumb.data.from);
      breadcrumb.data.to = this.sentryService.forceSafeString(breadcrumb.data.to);
    }

    // Note: same logic is applied for `breadcrumb.category === XHR`
    if (breadcrumb.level === 'error' && breadcrumb.data && breadcrumb.data.url && breadcrumb.data.url) {
      const omarsysUrlDetails = this.parseUrl(breadcrumb.data.url);
      if (/omarsys\.com$/.test(omarsysUrlDetails.host)) {
        breadcrumb.data.url = breadcrumb.data.url.replace(omarsysUrlDetails.search, '/QUERY_PARAMS_REMOVED');
      }
    }

    // Omarsys console calls contain users personal data. Need to escape it.
    if (breadcrumb.category === 'console' && breadcrumb.message && /\.omarsys\.com/.test(JSON.stringify(breadcrumb.message))) {
      breadcrumb.message = 'OMARSYS LOG MESSAGE WAS REMOVED TO PREVENT STORING USERS PERSONAL DATA';
      delete breadcrumb.data.extra;
    }

    // Ionic is sending unnecessary debug messages, which by default are hidden in browser console but Sentry catches them anyway
    // Example: `menu, gesture unlisten left`
    if (breadcrumb.category === 'console' && breadcrumb.message && /^menu, /.test(breadcrumb.message)) {
      return null;
    }

    // RealityCheck service is sending debug messages both to console (when enabled for current env)
    // and to breadcrumbs (always). Remove console logs to avoid duplicated entries.
    // Example: `%cRealityCheckService - LOGIN - STOP`
    if (breadcrumb.category === 'console' && breadcrumb.message && /RealityCheckService -/.test(breadcrumb.message)) {
      return null;
    }

    // Detect "Loading chunk failed" error and report it to Sentry.
    // Error will be fixed in STABLE-6, however let's keep the detector in place in case the error comes back.
    if (breadcrumb.category === 'console' && breadcrumb.data && typeof breadcrumb.data.extra === 'object') {
      if (JSON.stringify(breadcrumb.data.extra).search(/Loading chunk [^\s]+ failed/m) > -1) {
        this.sentryService.captureException(
          'Loading chunk failed',
          SentryGeneralFingerprint.LOADING_CHUNK_FAILED,
        );
      }
    }

    return breadcrumb;
  }

  /**
   * Handler for Sentry's `beforeSend`
   *
   * @param {Event} event
   * @param {EventHint} [hint]
   * @returns {(Promise<Event | null> | Event | null)}
   */
  private onBeforeSend(event: Event, hint?: EventHint): Promise<Event | null> | Event | null {
    const eventType: 'exception' | 'message' = event.exception ? 'exception' : 'message';

    // To clearly see if logic in this service was applied or not. Helps in debugging sentry service.
    event.tags.sentry_analyzed = 'true';

    // `captureMessage()` doesn't return `event.exception`. We only need to analyze exceptions.
    if (eventType === 'exception') {

      const originalException: any = hint.originalException || {};
      let exceptionType = event.message ? 'Message' : Array.isArray(event.exception.values) && event.exception.values[0].type;
      exceptionType = exceptionType ?  exceptionType : originalException.name;
      const exceptionSrc = originalException.srcElement && originalException.srcElement.src;

      // Detect timeouts
      if (!exceptionType && originalException instanceof TimeoutError) {
        exceptionType = 'TimeoutError';
        event.fingerprint = [
          SentryGeneralFingerprint.TIMEOUT,
        ];
      }

      event.tags.exception_type = exceptionType;
      event.tags.exception_src = exceptionSrc;

      // Merge iovation errors (might be common in non-prod)
      if (typeof exceptionSrc === 'string' && (exceptionSrc.indexOf('iovation-loader') > -1 || exceptionSrc.indexOf('/iojs/') > -1)) {
        event.fingerprint = [
          SentryGeneralFingerprint.IOVATION_LOADER,
        ];
      }

      // Detect "Loading chunk" error. It should've already been fingerprinted in beforeBreadcrumb, so just to double check
      if ((originalException && originalException.message && /Loading chunk [^\s]+ failed/mi.test(originalException.message))) {
        event.fingerprint = [
          SentryGeneralFingerprint.LOADING_CHUNK_FAILED,
        ];
      }

      // Detect "Expression Changed After It Has Been Checked".
      // It should've already been fingerprinted in beforeBreadcrumb, so just to double check.
      if ((originalException && originalException.message && /ExpressionChangedAfterItHasBeenChecked/mi.test(originalException.message))) {
        event.fingerprint = [
          SentryGeneralFingerprint.EXPRESSION_CHANGED,
        ];
      }

      // Detect and group "NS_ERROR_NOT_INITIALIZED" error
      if (originalException && originalException.message && originalException.message.includes('NS_ERROR_NOT_INITIALIZED')) {
        event.fingerprint = [
          SentryGeneralFingerprint.NS_ERROR_NOT_INITIALIZED,
        ];
      }

      // Ignoring exceptions coming from Omarsys.
      // Their endpoint domain is often blocked by anti-tracking tools which generates a lot of exceptions.
      if (
          originalException.rejection
          && originalException.rejection.config
          && originalException.rejection.config.url
          && /\.omarsys\.com/.test(originalException.rejection.config.url)
        ) {
        event.fingerprint = [
          SentryGeneralFingerprint.OMARSYS,
        ];
      }
    }

    // There are some known errors that are thrown at a high volume. By ignoring them we can make reports readable
    // and avoid exceeding available event quota.
    // @TODO Ideally XCAF should not throw any exceptions. Below block should be removed when XCAF handles all errors correctly.
    if (Array.isArray(event.fingerprint)
        && this.sentryConfig.ignoredFingerprints.includes(
          event.fingerprint[0].replace('syntheticException_', '').replace('syntheticMessage_', ''),
        )
      ) {
      console.warn(`Sentry event will be ignored (${event.fingerprint[0]})`, event);
      return null;
    }

    switch (eventType) {
      case 'exception':
        console.warn(`Sentry is sending exception number ${event.event_id}. Include this number when reporting a technical issue.`, event);
        break;
      case 'message':
        console.warn(`Sentry is sending message number ${event.event_id}. Include this number when reporting a technical issue.`, event);
        break;
    }

    return event;
  }

  /**
   * Detects AdBlocker and similar browser extensions.
   */
  private hasAdBlocker(): boolean {
    const elem: HTMLDivElement = this.renderer.createElement('div');
    // AdBlockers are adding stylesheets having `display:none !important` to elements with these classes
    this.renderer.setAttribute(
      elem,
      'class',
      'adblock-detector pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
    );
    this.renderer.appendChild(this.platformService.document.body, elem);
    return elem.clientWidth === 0;
  }
}
