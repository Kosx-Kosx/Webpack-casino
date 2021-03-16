import { UrlSegment } from '@angular/router';

/**
 * Returns an object that Angular Routing matcher expects or null if we don't have a lobby for given URL.
 *
 * @see https://angular.io/api/router/UrlMatcher
 *
 * @todo Get rid of it and create a proper injectable class for it if this is ever done: https://github.com/angular/angular/issues/17145
 * Then we can move the lobby routing to casino module and have only one definition of it.
 *
 * @param {UrlSegment[]} url Array of Url Segments. Should be passed on from initial matcher function.
 * @param {string[]} lobbyWhitelist list of whitelisted lobby slugs for matching
 */
export function matchLobbyFromUrl(url: UrlSegment[], lobbyWhitelist: string[]) {
  if (url.length && lobbyWhitelist.includes(url[0].path)) {
    return {
      consumed: [url[0]],
      posParams: {
        lobby: url[0],
      },
    };
  }
  return null;
}
