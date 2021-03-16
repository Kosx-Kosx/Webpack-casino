import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HalInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(
        map(event => {
          // Flatten HAL resources and OAuth objects
          if (
            event instanceof HttpResponse
            && (
              event.url.includes('/oauth')
              || (
                // `startsWith` is used because value can include encoding, f.e. `application/hal+json; charset=UTF-8`
                event.headers.get('content-type')
                && event.headers.get('content-type').startsWith('application/hal+json')
              )
            )
          ) {
            // `event.body` is readonly, but we want to replace it with our new object
            (event.body as any) = copyAndFlatten(event.body);
          }
          return event;
        }),
      );
  }
}

/**
 * Deep copy and flatten a HAL resource.
 *
 * @param resource The HAL resource object.
 */
function copyAndFlatten(resource: { [key: string]: any } | null) {
  // Stop traversing if we hit a scalar
  if (!resource || typeof resource !== 'object') {
    return resource;
  }

  // PHP JSON date is already in ISO 8601 format, just return it
  if (resource.date) {
    // TODO: remove when FAPI-625 and XCAF-1107 are released everywhere
    if (resource.timezone) {
      return `${resource.date.substr(0, 10)}T${resource.date.substr(11, 12)}Z`;
    }
    return resource.date;
  }

  // Traverse down and flatten the HAL objects
  const copy: any = Array.isArray(resource) ? [] : {};
  // tslint:disable-next-line forin
  for (const prop in resource) {
    switch (prop) {
      case 'key':
      case '_links':
        // Skip HAL links and key name
        break;
      case '_embedded':
      case 'value':
        // Flatten embedded resources
        // tslint:disable-next-line forin
        for (const key in resource[prop]) {
          copy[key] = copyAndFlatten(resource[prop][key]);
        }
        break;
      default:
        copy[prop] = copyAndFlatten(resource[prop]);
        break;
    }
  }

  return copy;
}
