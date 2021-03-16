import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { switchMap, distinctUntilChanged, take, map, shareReplay, tap, takeUntil } from 'rxjs/operators';
import { CasinoConfig } from './casino.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../user/user.service";
import * as i3 from "./casino.config";
var FavouriteGamesService = /** @class */ (function () {
    function FavouriteGamesService(http, userService, casinoConfig) {
        var _this = this;
        this.http = http;
        this.userService = userService;
        this.casinoConfig = casinoConfig;
        this._favouriteGames$ = new BehaviorSubject([]);
        this.cancelRequest$ = new Subject();
        /**
         * Emits array of favourite games
         */
        this.favouriteGames$ = this._favouriteGames$.pipe(distinctUntilChanged(function (beforeArray, afterArray) { return beforeArray.length === afterArray.length && beforeArray.every(function (beforeValue, beforeIndex) { return beforeValue.slug === afterArray[beforeIndex].slug; }); }), map(function (games) { return games.sort(function (a, b) { return a.slug.localeCompare(b.slug); }); }), shareReplay(1));
        /**
         * Emits favourite games category for casino lobby
         */
        this.favouriteGamesCategory$ = this.favouriteGames$.pipe(switchMap(function (games) {
            if (games.length) {
                var favouriteGamesCategory = _this.createCategory(games);
                return of(favouriteGamesCategory);
            }
            else {
                return of(null);
            }
        }), shareReplay(1));
        if (this.casinoConfig.showFavouriteGames) {
            this.fetchFavouriteGames().subscribe(function (games) { return _this._favouriteGames$.next(games); });
        }
    }
    /**
     * Determines if the game belongs to favourite games
     * @param {IGameThumb} game Game to be checked
     */
    FavouriteGamesService.prototype.isFavouriteGame = function (game) {
        return this.favouriteGames$.pipe(map(function (favouriteGames) { return favouriteGames.some(function (favGame) { return favGame.vendor === game.vendor && favGame.slug === game.slug; }); }), distinctUntilChanged());
    };
    /**
     * Adds or removes selected game to the favourite games category
     * @param {IGameThumb} game Game that will be added (if not belongs) or removed (if belongs)
     */
    FavouriteGamesService.prototype.toggleFavouriteGame = function (game) {
        var _this = this;
        return this.favouriteGames$.pipe(take(1), map(function (favouriteGames) {
            var gameExists = favouriteGames.find(function (favGame) { return favGame.vendor === game.vendor && favGame.slug === game.slug; }) !== undefined;
            if (gameExists) {
                favouriteGames = favouriteGames.filter(function (favGame) {
                    return game.vendor + "-" + game.slug !== favGame.vendor + "-" + favGame.slug;
                });
            }
            else {
                favouriteGames = favouriteGames.concat([game]);
            }
            _this._favouriteGames$.next(favouriteGames);
            _this.cancelRequest$.next();
            return favouriteGames;
        }), switchMap(function (favouriteGames) {
            return _this.save(favouriteGames);
        }));
    };
    FavouriteGamesService.prototype.fetchFavouriteGames = function () {
        var _this = this;
        return this.userService.isUserLoggedIn.pipe(switchMap(function (isUserLoggedIn) {
            if (isUserLoggedIn) {
                var params = {
                    my: 'true',
                };
                return _this.http.get("{{apiEndpoint}}/games", { params: params }).pipe(map(function (_a) {
                    var games = _a.games;
                    return games;
                }), map(function (games) { return games.map(_this.normalizeGameProperties); }));
            }
            else {
                return of([]);
            }
        }));
    };
    FavouriteGamesService.prototype.save = function (favouriteGames) {
        var _this = this;
        var gameIds = favouriteGames.map(function (_a) {
            var vendor = _a.vendor, slug = _a.slug;
            return vendor + "-" + slug;
        });
        return this.http.put("{{apiEndpoint}}/games?my", { games: gameIds }).pipe(takeUntil(this.cancelRequest$), map(function (_a) {
            var games = _a.games;
            return games;
        }), map(function (games) { return games.map(_this.normalizeGameProperties); }), tap(function (favGames) { return _this._favouriteGames$.next(favGames); }));
    };
    FavouriteGamesService.prototype.createCategory = function (games) {
        var favouriteGamesCategory = {
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
    };
    FavouriteGamesService.prototype.createBlocks = function (favouriteGames) {
        var edges = new Array();
        var node = {
            blockMargin: 10,
            blocks: [],
        };
        var blockIndex = -1;
        favouriteGames.forEach(function (game, gameIndex) {
            if (gameIndex % 4 === 0) {
                blockIndex = -1;
                node = {
                    blockMargin: 10,
                    blocks: [],
                };
                edges.push({ node: node });
            }
            blockIndex++;
            // calculating game thumbnail position inside block layout taking into account that we only use 1x1 block in 2x2 layout
            var block = {
                type: 'game',
                col: (blockIndex % 2) + 1,
                row: Math.floor(blockIndex / 2) + 1,
                sizeX: 1,
                sizeY: 1,
                game: game,
                promotions: null,
            };
            node.blocks.push(block);
        });
        return edges;
    };
    FavouriteGamesService.prototype.normalizeGameProperties = function (game) {
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
    };
    FavouriteGamesService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function FavouriteGamesService_Factory() { return new FavouriteGamesService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.UserService), i0.ɵɵinject(i3.CASINO_CONFIG)); }, token: FavouriteGamesService, providedIn: "root" });
    return FavouriteGamesService;
}());
export { FavouriteGamesService };
