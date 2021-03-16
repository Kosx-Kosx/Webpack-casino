import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

export class BlacklistPreloadModules implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return !route.data || route.data && route.data.preload !== false ? load() : of(null);
  }
}
