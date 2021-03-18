import { MediaObserver } from '@angular/flex-layout';
import { Apollo } from 'apollo-angular';
import { combineLatest, ReplaySubject, of } from 'rxjs';
import { map, shareReplay, switchMap, startWith } from 'rxjs/operators';
import { RouteService } from 'app/core/route.service';
import { CasinoLobbyConfig } from './casino-lobby.config';
import { gameDetailQuery } from './lobby-expanded-details/lobby-expanded-details.graphql';
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
import * as i2 from "@angular/flex-layout/core";
import * as i3 from "../core/route.service";
import * as i4 from "./casino-lobby.config";
var DetailsControllerService = /** @class */ (function () {
    function DetailsControllerService(apollo, media, routeService, config) {
        var _this = this;
        this.apollo = apollo;
        this.media = media;
        this.routeService = routeService;
        this.config = config;
        this.focusedBlock$ = new ReplaySubject();
        this.active = this.config.useExpandedDetails;
        this.details$ = combineLatest([
            this.media.asObservable().pipe(map(function (changes) { return changes[0]; }), 
            // convert screen size to amount of layouts per row
            map(function (change) { return _this.config.layoutColumnsPerSize[change.mqAlias] || 1; })),
            this.focusedBlock$,
        ]).pipe(switchMap(function (_a) {
            var layoutsPerRow = _a[0], _b = _a[1], _c = _b === void 0 ? {} : _b, _d = _c.layoutIndex, layoutIndex = _d === void 0 ? null : _d, _e = _c.blockIndex, blockIndex = _e === void 0 ? null : _e, _f = _c.block, block = _f === void 0 ? null : _f;
            if (layoutIndex === null) {
                return of({});
            }
            var showLayoutIndex = layoutsPerRow * (Math.floor(layoutIndex / layoutsPerRow) + 1) - 1;
            var leftOffset = Math.floor((layoutIndex + (blockIndex + .5) * block.sizeX / 2) / layoutsPerRow * 1000) / 10 % 100;
            return _this.apollo.query({
                query: gameDetailQuery,
                variables: {
                    id: block.game.id,
                },
            })
                .pipe(map(function (_a) {
                var game = _a.data.game;
                return ({ game: game, layoutIndex: showLayoutIndex, leftOffset: leftOffset, loading: false });
            }), startWith({ game: block.game, layoutIndex: showLayoutIndex, leftOffset: leftOffset, loading: true }));
        }), shareReplay());
        this.routeService.navigation$.subscribe(function () { return _this.blur(); });
    }
    DetailsControllerService.prototype.focus = function (layoutIndex, blockIndex, block) {
        this.focusedBlock$.next({
            layoutIndex: layoutIndex,
            blockIndex: blockIndex,
            block: block,
        });
    };
    DetailsControllerService.prototype.blur = function () {
        this.focusedBlock$.next();
    };
    DetailsControllerService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function DetailsControllerService_Factory() { return new DetailsControllerService(i0.ɵɵinject(i1.Apollo), i0.ɵɵinject(i2.MediaObserver), i0.ɵɵinject(i3.RouteService), i0.ɵɵinject(i4.CASINO_LOBBY_CONFIG)); }, token: DetailsControllerService, providedIn: "root" });
    return DetailsControllerService;
}());
export { DetailsControllerService };
