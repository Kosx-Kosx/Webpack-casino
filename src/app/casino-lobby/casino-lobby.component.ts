import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnInit, OnDestroy } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { combineLatest, Subscription, Observable } from 'rxjs';
import { switchMap, distinctUntilChanged, map, distinctUntilKeyChanged } from 'rxjs/operators';

import { CASINO_CONFIG, CasinoConfig } from 'app/core/casino.config';
import { FavouriteGamesService } from 'app/core/favourite-games.service';
import { LocationService } from 'app/core/location';
import { ILocation } from 'app/core/location/location.interface';
import { PlatformService } from 'app/core/platform.service';
import { SentryService } from 'app/core/sentry/sentry.service';
import { GameSearchInlineVariation } from 'app/game-shared/game-search-inline/game-search-inline.interface';
import { UserService } from 'app/user';

import { casinoLobbyQuery, QueryResponse, QueryVariables } from './casino-lobby.graphql';
import { Category } from './category/category.graphql';

@Component({
  selector: 'xc-casino-lobby',
  templateUrl: './casino-lobby.component.html',
  styleUrls: ['./casino-lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasinoLobbyComponent implements OnInit, OnDestroy {
  private _lobbySlug: string;
  private _categoryName: string;
  private subscriptions = new Subscription();

  gameSearchInlineVariations = GameSearchInlineVariation;
  loading = true;
  queryRef: QueryRef<QueryResponse>;
  activeCategory: Category;
  categories: Category[] = [];
  navItemWidth = this.casinoConfig.scrollableCategoriesItemWidth || 150;
  isMobile: boolean;
  areCategoriesScrollable = true;

  @Input()
  set lobbySlug(lobbySlug: string) {
    if (this._lobbySlug !== lobbySlug) {
      this._lobbySlug = lobbySlug;

      if (this.queryRef) {
        this.queryRef.setVariables({
          slug: lobbySlug,
        });
      }
    }
  }

  get lobbySlug() {
    return this._lobbySlug;
  }

  @Input()
  set categoryName(value: string) {
    if (value) {
      this._categoryName = value;
      this.setActiveCategory(value);
    }
  }

  get categoryName() {
    return this._categoryName;
  }

  get showLoadMore() {
    return this.activeCategory && this.activeCategory.layoutConnection.pageInfo.hasNextPage;
  }

  constructor(
    @Inject(CASINO_CONFIG) public casinoConfig: CasinoConfig,
    public media: MediaObserver,
    private apollo: Apollo,
    private favouriteGamesService: FavouriteGamesService,
    private changeDetector: ChangeDetectorRef,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private sentryService: SentryService,
    platform: PlatformService,
  ) {
    this.isMobile = !platform.isDesktop();
  }

  ngOnInit() {
    this.subscriptions.add(
      combineLatest([
        this.userService.isUserLoggedIn.pipe(
          distinctUntilChanged(),
        ),
        this.locationService.location$.pipe(
          distinctUntilKeyChanged('country'),
        ),
        this.userService.currentGroups$.pipe(
          // distinctUntilChanged doesn't work with arrays. Use a custom comparator
          distinctUntilChanged((beforeArray, afterArray) =>
            beforeArray.length === afterArray.length && beforeArray.every(
              (beforeValue, beforeIndex) => beforeValue === afterArray[beforeIndex],
            ),
          ),
        ),
      ])
      .pipe(
        switchMap(([isUserLoggedIn, loc, groups]) => combineLatest(
          this.fetchLobby(isUserLoggedIn, loc, groups),
          this.favouriteGamesService.favouriteGamesCategory$,
        )),
      )
      .subscribe(([{data, loading}, favouriteCategory]) => {
        const categories = this.deeplyUnfreeze(data);

        this.categories = [...categories];
        if (!!favouriteCategory) {
          this.categories.unshift(favouriteCategory);
        }

        if (!favouriteCategory && this.categoryName === 'favourite-games') {
          this.redirectToFirstCategory(true);
        } else {
          this.setActiveCategory(this.categoryName);
        }
        this.loading = loading;
        this.changeDetector.markForCheck();
      }),
    );

    this.subscriptions.add(
      this.media.asObservable().pipe(
        map(() => this.media.isActive(`lt-${this.casinoConfig.scrollableCategoriesBreakpoint}`)),
        distinctUntilChanged(),
      ).subscribe((isActive: boolean) => {
        this.areCategoriesScrollable = isActive;
        this.changeDetector.markForCheck();
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private fetchLobby(isUserLoggedIn: boolean, loc: ILocation, groups: number[]): Observable<ApolloQueryResult<QueryResponse>> {
    this.queryRef = this.apollo.use('get').watchQuery<QueryResponse, QueryVariables>({
      query: casinoLobbyQuery,
      variables: {
        slug: this.lobbySlug,
        first: this.isMobile ? 6 : 12,
        playerState: isUserLoggedIn ? 'li' : 'lo',
        country: loc.country.code,
        groups: groups.join(','),
      },
    });

    return this.queryRef.valueChanges;
  }

  private deeplyUnfreeze(data: QueryResponse) {
    if (!data.lobby || !data.lobby.categoryConnection || !data.lobby.categoryConnection.edges) {
      return [];
    }
    return data.lobby.categoryConnection.edges.map(item => ({
      ...item.node,
      layoutConnection: {
        ...item.node.layoutConnection,
        edges: item.node.layoutConnection.edges,
      },
    }));
  }

  async loadMore() {
    this.loading = true;
    // try...catch is used because of apollo bug that happens when fetchMore started loading data,
    // but then loading is interrupted by destroying a component
    // https://github.com/apollographql/apollo-client/issues/4114#issuecomment-502111099
    try {
      await this.queryRef.fetchMore({
        variables: {
          after: this.activeCategory.layoutConnection.pageInfo.endCursor,
          categorySlug: this.activeCategory.slug,
        },
        updateQuery: (previousQueryResult: QueryResponse, { fetchMoreResult }) => {
          // Roses are red, my name is not dave, this makes no sense, microwave.
          const moreCategoryNode = fetchMoreResult.lobby.categoryConnection.edges[0].node;
          return {
            lobby: {
              ...previousQueryResult.lobby,
              categoryConnection: {
                ...previousQueryResult.lobby.categoryConnection,
                edges: previousQueryResult.lobby.categoryConnection.edges.map(categoryEdge => {
                  const categoryNode = categoryEdge.node;
                  if (categoryNode.slug !== moreCategoryNode.slug) {
                    return categoryEdge;
                  }

                  return {
                    ...categoryEdge,
                    node: {
                      ...categoryEdge.node,
                      layoutConnection: {
                        ...moreCategoryNode.layoutConnection,
                        edges: categoryNode.layoutConnection.edges.concat(moreCategoryNode.layoutConnection.edges),
                      },
                    },
                  };
                }),
              },
            },
          };
        },
      });
    } catch (error) {
      console.error(error);
      this.sentryService.captureException('Lobby fetchMore() failed to load more data', 'lobby-fetch-more');
    }
  }

  setActiveCategory(slug: string) {
    if (!slug) {
      // Redirect to first category if no slug in url
      this.redirectToFirstCategory();
    } else {
      const activeCategory = this.categories.find(category => category.slug === slug);
      if (activeCategory) {
        this.activeCategory = activeCategory;
        this.changeDetector.markForCheck();
      } else {
        // Redirect to first category if wrong slug in url
        this.redirectToFirstCategory();
      }
    }
  }

  navigateTo(category: Category) {
    this.activeCategory = category;
    this.router.navigate([category.slug], {
      relativeTo: this.route.parent,
      replaceUrl: true,
    });
  }

  private redirectToFirstCategory(relativeToParent: boolean = false) {
    if (!!this.categories.length) {
      // Do not load favourite games category as a first category during loading lobby
      const path = this.categories.length > 1 && this.categories[0].slug === 'favourite-games' ? this.categories[1].slug
        : this.categories[0].slug;
      this.router.navigate([path], {
        relativeTo: relativeToParent ? this.route.parent : this.route,
        replaceUrl: true,
      });
    }
  }
}
