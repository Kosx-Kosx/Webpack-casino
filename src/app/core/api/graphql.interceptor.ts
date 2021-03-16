import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraphQLInterceptor implements HttpInterceptor {
  // stripping excessive whitespace from graphql queries to reduce network overhead
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const query = req.params.get('query');
    if (query) {
      req = req.clone({
        setParams: {
          query: query
            .replace(/\s+/g, ' ')
            .replace(/ ?([:,){}]) /g, '$1'),
        },
      });
    }

    return next.handle(req);
  }
}
