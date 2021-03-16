import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { UserService } from 'app/user';
import { of, Observable, BehaviorSubject, Subject } from 'rxjs';
import { switchMap, distinctUntilChanged, take, map, shareReplay, tap, takeUntil } from 'rxjs/operators';

import { Block } from 'app/casino-lobby/block/block.graphql';
import { Category } from 'app/casino-lobby/category/category.graphql';
import { Layout } from 'app/casino-lobby/layout/layout.graphql';
import { IGameThumb } from 'app/core/game.interface';

import { CASINO_CONFIG, CasinoConfig } from './casino.config';

@Injectable({
  providedIn: 'root',
})
export class FavouriteGamesService {
  private _favouriteGames$ = new BehaviorSubject<IGameThumb[]>([]);
  private cancelRequest$ = new Subject();
  /**
   * Emits array of favourite games
   */
  private favouriteGames$ = this._favouriteGames$.pipe(
    distinctUntilChanged((beforeArray, afterArray) => beforeArray.length === afterArray.length && beforeArray.every(
      (beforeValue, beforeIndex) => beforeValue.slug === afterArray[beforeIndex].slug,
    )),
    map((games) => games.sort((a, b) => a.slug.localeCompare(b.slug))),
    shareReplay(1),
  );

  /**
   * Emits favourite games category for casino lobby
   */
  public favouriteGamesCategory$: Observable<Category | null> = this.favouriteGames$.pipe(
    switchMap((games) => {
      if (games.length) {
        const favouriteGamesCategory = this.createCategory(games);
        return of(favouriteGamesCategory);
      } else {
        return of(null);
      }
    }),
    shareReplay(1),
  );

  constructor(
    private http: HttpClient,
    private userService: UserService,
    @Inject(CASINO_CONFIG) public casinoConfig: CasinoConfig,
  ) {
    if (this.casinoConfig.showFavouriteGames) {
      this.fetchFavouriteGames().subscribe((games) => this._favouriteGames$.next(games));
    }
  }

  /**
   * Determines if the game belongs to favourite games
   * @param {IGameThumb} game Game to be checked
   */
  public isFavouriteGame(game: IGameThumb) {
    return this.favouriteGames$.pipe(
      map((favouriteGames) => favouriteGames.some((favGame) => favGame.vendor === game.vendor && favGame.slug === game.slug)),
      distinctUntilChanged(),
    );
  }

  /**
   * Adds or removes selected game to the favourite games category
   * @param {IGameThumb} game Game that will be added (if not belongs) or removed (if belongs)
   */
  public toggleFavouriteGame(game: IGameThumb) {
    return this.favouriteGames$.pipe(
      take(1),
      map((favouriteGames) => {
        const gameExists = favouriteGames.find((favGame) => favGame.vendor === game.vendor && favGame.slug === game.slug) !== undefined;
        if (gameExists) {
          favouriteGames = favouriteGames.filter((favGame) => {
            return `${game.vendor}-${game.slug}` !== `${favGame.vendor}-${favGame.slug}`;
          });
        } else {
          favouriteGames = [...favouriteGames, game];
        }
        this._favouriteGames$.next(favouriteGames);
        this.cancelRequest$.next();

        return favouriteGames;
      }),
      switchMap((favouriteGames) => {
        return this.save(favouriteGames);
      }),
    );
  }

  private fetchFavouriteGames(): Observable<IGameThumb[]> {
    return this.userService.isUserLoggedIn.pipe(
      switchMap(isUserLoggedIn => {
        if (isUserLoggedIn) {
          const params = {
            my: 'true',
          };
          return this.http.get<{games: IGameThumb[]}>(`{{apiEndpoint}}/games`, { params }).pipe(
            map(({ games }) => games),
            map((games) => games.map(this.normalizeGameProperties)),
          );
        } else {
          return of([]);
        }
      }),
    );
  }

  private save(favouriteGames: IGameThumb[]): Observable<IGameThumb[]> {
    const gameIds = favouriteGames.map(({ vendor, slug }) => `${vendor}-${slug}`);

    return this.http.put<any>(`{{apiEndpoint}}/games?my`, {games: gameIds}).pipe(
      takeUntil(this.cancelRequest$),
      map(({ games }) => games),
      map((games) => games.map(this.normalizeGameProperties)),
      tap((favGames: IGameThumb[]) => this._favouriteGames$.next(favGames)),
    );
  }

  private createCategory(games: IGameThumb[]): Category {
    const favouriteGamesCategory: Category = {
      slug: 'favourite-games',
      name: 'Favourite games',

      layoutConnection: {
        pageInfo: {
          endCursor: '',
          hasNextPage: false,
        },
        edges: this.createBlocks(games),
      },
    };
    return favouriteGamesCategory;
  }

  private createBlocks(favouriteGames: IGameThumb[]): Array<{node: Layout}> {
    const edges = new Array<{node: Layout}>();
    let node: Layout = {
      blockMargin: 10,
      blocks: [],
    };
    let blockIndex = -1;
    favouriteGames.forEach((game, gameIndex) => {
      if (gameIndex % 4 === 0) {
        blockIndex = -1;
        node = {
          blockMargin: 10,
          blocks: [],
        };
        edges.push({ node });
      }
      blockIndex++;
      // calculating game thumbnail position inside block layout taking into account that we only use 1x1 block in 2x2 layout
      const block: Block = {
        type: 'game',
        col: (blockIndex % 2) + 1,
        row: Math.floor(blockIndex / 2) + 1,
        sizeX: 1,
        sizeY: 1,
        game,
        promotions: null,
      };
      node.blocks.push(block);
    });
    return edges;
  }

  private normalizeGameProperties(game: any): IGameThumb {
    return {
      id: game.id,
      vendor: game.vendor,
      slug: game.slug,
      name: game.name,
      maxBet: game.max_bet,
      minBet: game.min_bet,
      currency: game.currency,
      thumbnails: game.thumbnails,
      label: game.label,
      categories: game.categories,
      vendorName: game.vendor_name,
      subVendor: game.sub_vendor,
      subVendorName: game.sub_vendor_name,
      loginRequired: game.login_required,
      enabled: game.enabled,
    };
  }
}
