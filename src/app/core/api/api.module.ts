import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS, APOLLO_NAMED_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache, defaultDataIdFromObject, IdGetterObj } from 'apollo-cache-inmemory';

import { ApiInterceptor } from './api.interceptor';
import { GraphQLInterceptor } from './graphql.interceptor';
import { HalInterceptor } from './hal.interceptor';

interface IdGetterGame extends IdGetterObj {
  id?: string;
  slug?: string;
  label?: string;
  categories?: string[];
}

const APOLLO_MEMORY_CACHE = new InjectionToken<InMemoryCache>('apollo memory cache');

export function apolloOptions(cache: InMemoryCache, httpLink: HttpLink) {
  return {
    cache,
    link: httpLink.create({
      uri: '{{apiEndpoint}}/graphql',
    }),
  };
}

export function apolloNamedOptions(cache: InMemoryCache, httpLink: HttpLink) {
  return {
    get: {
      cache,
      link: httpLink.create({
        uri: '{{apiEndpoint}}/graphql',
        method: 'GET',
      }),
    },
  };
}

export function apolloMemory() {
  return new InMemoryCache({
    dataIdFromObject: object => {
      // When `object.__typename` or `object.id` or `object._id` are not unique enough
      // we need to help Apollo find the unique identifier to be used in deduplication of objects.
      // When `null` is returned the object will not be cached.
      switch (object.__typename) {
        // When multiple lobbies are returned then Apollo can't see the difference between game in lobby A and the same game in lobby B.
        // FAPI returns the same `game.id` for a game in lobby A and in lobby B, even though `game.categories` are different.
        // Apollo by default caches the first occurrence of the game object because `game.id` is the same.
        // @see GT-203
        case 'Game':
          const game: IdGetterGame = object;

          // Some GQL queries don't return ID
          if (!game.id) {
            return null;
          }

          // FAPI returns base64 encoded Mongo game ID with `Game` prefix, eg. `Game:5d8214e5c53612c74b8b4568`
          let uniqueCacheId = atob(game.id);

          // All properties that can be different even though game ID is still the same should be taken into ID calculation
          if (game.categories) {
            uniqueCacheId +=  `:${game.categories.join('|')}`;
          }
          if (game.label) {
            uniqueCacheId += `:${game.label}`;
          }

          // In the case of Japanese characters, we need to encode these strings.
          // The following is a recommended solution in order to safely encode strings
          // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
          return btoa(encodeURIComponent(uniqueCacheId).
            replace(/[!'()*]/g, (c) => {
              return '%' + c.charCodeAt(0).toString(16);
            }),
          );
        default: return defaultDataIdFromObject(object); // fall back to default handling
      }
    },
  });
}

@NgModule({
  imports: [
    ApolloModule,
    HttpClientModule,
    HttpLinkModule,
  ],
})
export class ApiModule {
  static forRoot(): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HalInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: GraphQLInterceptor,
          multi: true,
        },
        {
          provide: APOLLO_MEMORY_CACHE,
          useFactory: apolloMemory,
        },
        {
          provide: APOLLO_OPTIONS,
          useFactory: apolloOptions,
          deps: [APOLLO_MEMORY_CACHE, HttpLink],
        },
        {
          provide: APOLLO_NAMED_OPTIONS ,
          useFactory: apolloNamedOptions,
          deps: [APOLLO_MEMORY_CACHE, HttpLink],
        },
      ],
    };
  }
}
