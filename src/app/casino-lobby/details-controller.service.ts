import { Injectable, Inject } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Apollo } from 'apollo-angular';
import { combineLatest, ReplaySubject, of, Observable } from 'rxjs';
import { map, shareReplay, switchMap, startWith } from 'rxjs/operators';

import { IGameThumb } from 'app/core/game.interface';
import { RouteService } from 'app/core/route.service';

import { Block } from './block/block.graphql';
import { CasinoLobbyConfig, CASINO_LOBBY_CONFIG } from './casino-lobby.config';
import { gameDetailQuery } from './lobby-expanded-details/lobby-expanded-details.graphql';

interface ISelectedThumb {
  layoutIndex: number;
  blockIndex: number;
  block: Block;
}

interface IChosenDetails {
  game: IGameThumb;
  layoutIndex: number;
  leftOffset: number;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class DetailsControllerService {

  private focusedBlock$ = new ReplaySubject<ISelectedThumb>();

  public active = this.config.useExpandedDetails;

  public details$: Observable<IChosenDetails> = combineLatest([
    this.media.asObservable().pipe(
      map((changes: MediaChange[]) => changes[0]),
      // convert screen size to amount of layouts per row
      map((change: MediaChange): number => (this.config.layoutColumnsPerSize as any)[change.mqAlias] || 1),
    ),
    this.focusedBlock$,
  ]).pipe(
    switchMap(([
      layoutsPerRow,
      { layoutIndex = null, blockIndex = null, block = null } = {} as ISelectedThumb,
    ]: [
      number,
      ISelectedThumb,
    ]) => {
      if (layoutIndex === null) {
        return of({} as IChosenDetails);
      }

      const showLayoutIndex = layoutsPerRow * (Math.floor(layoutIndex / layoutsPerRow) + 1) - 1;
      const leftOffset = Math.floor((layoutIndex + (blockIndex + .5) * block.sizeX / 2) / layoutsPerRow * 1000) / 10 % 100;

      return this.apollo.query({
        query: gameDetailQuery,
        variables: {
          id: block.game.id,
        },
      })
      .pipe(
        map(({ data: { game } }: any) => ({ game, layoutIndex: showLayoutIndex, leftOffset, loading: false } as IChosenDetails)),
        startWith({ game: block.game, layoutIndex: showLayoutIndex, leftOffset, loading: true } as IChosenDetails),
      );
    }),
    shareReplay<IChosenDetails>(),
  );

  constructor(
    private apollo: Apollo,
    private media: MediaObserver,
    private routeService: RouteService,
    @Inject(CASINO_LOBBY_CONFIG) private config: CasinoLobbyConfig,
  ) {
    this.routeService.navigation$.subscribe(() => this.blur());
  }

  public focus(layoutIndex: number, blockIndex: number, block: Block) {
    this.focusedBlock$.next({
      layoutIndex,
      blockIndex,
      block,
    });
  }

  public blur() {
    this.focusedBlock$.next();
  }
}
