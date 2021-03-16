import { InjectionToken } from '@angular/core';

/**
 * Functions injected on this token will run after application finish initialization.
 * All Angular core functionalities should be already available for injection into derived services.
 * This is needed because of this issue with APP_INITIALIZER:
 * @see https://stackoverflow.com/a/58411081/2789884
 *
 * @example
 * export function InitializeSomeServiceThatNeedsInitialization(service) {
 *   return service.initialize();
 * }
 * ...
 * providers: [
 *   SomeServiceThatNeedsInitialization,
 *   {
 *     provide: APP_START,
 *     useFactory: InitializeSomeServiceThatNeedsInitialization,
 *     deps: [SomeServiceThatNeedsInitialization],
 *     multi: true,
 *   },
 * ],
 */
export const APP_START = new InjectionToken<() => void>('app-start');
