var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { combineLatest, Subscription } from 'rxjs';
import { switchMap, distinctUntilChanged, map, distinctUntilKeyChanged } from 'rxjs/operators';
import { CasinoConfig } from 'app/core/casino.config';
import { FavouriteGamesService } from 'app/core/favourite-games.service';
import { LocationService } from 'app/core/location';
import { PlatformService } from 'app/core/platform.service';
import { SentryService } from 'app/core/sentry/sentry.service';
import { GameSearchInlineVariation } from 'app/game-shared/game-search-inline/game-search-inline.interface';
import { UserService } from 'app/user';
import { casinoLobbyQuery } from './casino-lobby.graphql';
var CasinoLobbyComponent = /** @class */ (function () {
    function CasinoLobbyComponent(casinoConfig, media, apollo, favouriteGamesService, changeDetector, locationService, route, router, userService, sentryService, platform) {
        this.casinoConfig = casinoConfig;
        this.media = media;
        this.apollo = apollo;
        this.favouriteGamesService = favouriteGamesService;
        this.changeDetector = changeDetector;
        this.locationService = locationService;
        this.route = route;
        this.router = router;
        this.userService = userService;
        this.sentryService = sentryService;
        this.subscriptions = new Subscription();
        this.gameSearchInlineVariations = GameSearchInlineVariation;
        this.loading = true;
        this.categories = [];
        this.navItemWidth = this.casinoConfig.scrollableCategoriesItemWidth || 150;
        this.areCategoriesScrollable = true;
        this.isMobile = !platform.isDesktop();
    }
    Object.defineProperty(CasinoLobbyComponent.prototype, "lobbySlug", {
        get: function () {
            return this._lobbySlug;
        },
        set: function (lobbySlug) {
            if (this._lobbySlug !== lobbySlug) {
                this._lobbySlug = lobbySlug;
                if (this.queryRef) {
                    this.queryRef.setVariables({
                        slug: lobbySlug,
                    });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CasinoLobbyComponent.prototype, "categoryName", {
        get: function () {
            return this._categoryName;
        },
        set: function (value) {
            if (value) {
                this._categoryName = value;
                this.setActiveCategory(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CasinoLobbyComponent.prototype, "showLoadMore", {
        get: function () {
            return this.activeCategory && this.activeCategory.layoutConnection.pageInfo.hasNextPage;
        },
        enumerable: true,
        configurable: true
    });
    CasinoLobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.add(combineLatest([
            this.userService.isUserLoggedIn.pipe(distinctUntilChanged()),
            this.locationService.location$.pipe(distinctUntilKeyChanged('country')),
            this.userService.currentGroups$.pipe(
            // distinctUntilChanged doesn't work with arrays. Use a custom comparator
            distinctUntilChanged(function (beforeArray, afterArray) {
                return beforeArray.length === afterArray.length && beforeArray.every(function (beforeValue, beforeIndex) { return beforeValue === afterArray[beforeIndex]; });
            })),
        ])
            .pipe(switchMap(function (_a) {
            var isUserLoggedIn = _a[0], loc = _a[1], groups = _a[2];
            return combineLatest(_this.fetchLobby(isUserLoggedIn, loc, groups), _this.favouriteGamesService.favouriteGamesCategory$);
        }))
            .subscribe(function (_a) {
            var _b = _a[0], data = _b.data, loading = _b.loading, favouriteCategory = _a[1];
            var categories = _this.deeplyUnfreeze(data);
            _this.categories = categories.slice();
            if (!!favouriteCategory) {
                _this.categories.unshift(favouriteCategory);
            }
            if (!favouriteCategory && _this.categoryName === 'favourite-games') {
                _this.redirectToFirstCategory(true);
            }
            else {
                _this.setActiveCategory(_this.categoryName);
            }
            _this.loading = loading;
            _this.changeDetector.markForCheck();
        }));
        this.subscriptions.add(this.media.asObservable().pipe(map(function () { return _this.media.isActive("lt-" + _this.casinoConfig.scrollableCategoriesBreakpoint); }), distinctUntilChanged()).subscribe(function (isActive) {
            _this.areCategoriesScrollable = isActive;
            _this.changeDetector.markForCheck();
        }));
    };
    CasinoLobbyComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
    };
    CasinoLobbyComponent.prototype.fetchLobby = function (isUserLoggedIn, loc, groups) {
        this.queryRef = this.apollo.use('get').watchQuery({
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
    };
    CasinoLobbyComponent.prototype.deeplyUnfreeze = function (data) {
        if (!data.lobby || !data.lobby.categoryConnection || !data.lobby.categoryConnection.edges) {
            return [];
        }
        return data.lobby.categoryConnection.edges.map(function (item) { return (__assign({}, item.node, { layoutConnection: __assign({}, item.node.layoutConnection, { edges: item.node.layoutConnection.edges }) })); });
    };
    CasinoLobbyComponent.prototype.loadMore = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loading = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.queryRef.fetchMore({
                                variables: {
                                    after: this.activeCategory.layoutConnection.pageInfo.endCursor,
                                    categorySlug: this.activeCategory.slug,
                                },
                                updateQuery: function (previousQueryResult, _a) {
                                    var fetchMoreResult = _a.fetchMoreResult;
                                    // Roses are red, my name is not dave, this makes no sense, microwave.
                                    var moreCategoryNode = fetchMoreResult.lobby.categoryConnection.edges[0].node;
                                    return {
                                        lobby: __assign({}, previousQueryResult.lobby, { categoryConnection: __assign({}, previousQueryResult.lobby.categoryConnection, { edges: previousQueryResult.lobby.categoryConnection.edges.map(function (categoryEdge) {
                                                    var categoryNode = categoryEdge.node;
                                                    if (categoryNode.slug !== moreCategoryNode.slug) {
                                                        return categoryEdge;
                                                    }
                                                    return __assign({}, categoryEdge, { node: __assign({}, categoryEdge.node, { layoutConnection: __assign({}, moreCategoryNode.layoutConnection, { edges: categoryNode.layoutConnection.edges.concat(moreCategoryNode.layoutConnection.edges) }) }) });
                                                }) }) }),
                                    };
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        this.sentryService.captureException('Lobby fetchMore() failed to load more data', 'lobby-fetch-more');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CasinoLobbyComponent.prototype.setActiveCategory = function (slug) {
        if (!slug) {
            // Redirect to first category if no slug in url
            this.redirectToFirstCategory();
        }
        else {
            var activeCategory = this.categories.find(function (category) { return category.slug === slug; });
            if (activeCategory) {
                this.activeCategory = activeCategory;
                this.changeDetector.markForCheck();
            }
            else {
                // Redirect to first category if wrong slug in url
                this.redirectToFirstCategory();
            }
        }
    };
    CasinoLobbyComponent.prototype.navigateTo = function (category) {
        this.activeCategory = category;
        this.router.navigate([category.slug], {
            relativeTo: this.route.parent,
            replaceUrl: true,
        });
    };
    CasinoLobbyComponent.prototype.redirectToFirstCategory = function (relativeToParent) {
        if (relativeToParent === void 0) { relativeToParent = false; }
        if (!!this.categories.length) {
            // Do not load favourite games category as a first category during loading lobby
            var path = this.categories.length > 1 && this.categories[0].slug === 'favourite-games' ? this.categories[1].slug
                : this.categories[0].slug;
            this.router.navigate([path], {
                relativeTo: relativeToParent ? this.route.parent : this.route,
                replaceUrl: true,
            });
        }
    };
    return CasinoLobbyComponent;
}());
export { CasinoLobbyComponent };
