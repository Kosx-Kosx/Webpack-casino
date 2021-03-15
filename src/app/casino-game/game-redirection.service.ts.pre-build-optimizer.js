import { combineLatest, of } from 'rxjs';
import { map, distinctUntilKeyChanged } from 'rxjs/operators';
import { CasinoGameConfig } from 'app/casino-game/casino-game.config';
import { PlatformService } from 'app/core/platform.service';
import { UserService } from 'app/user';
var GameRedirectionService = /** @class */ (function () {
    function GameRedirectionService(platformService, userService, config) {
        this.platformService = platformService;
        this.userService = userService;
        this.config = config;
    }
    /**
     * This method determines if (based on device, jurisdiction, game vendor etc) we can redirect users
     * away to a full page or iframe must be used instead in order to put game in an iframe and use XCAF features
     * like Reality Check modal.
     *
     * @param {Game} game Game object
     * @returns {Observable<boolean>}
     */
    GameRedirectionService.prototype.isIframeRequired = function (game) {
        var _this = this;
        // Desktop always uses iframe
        if (!game.mobile) {
            return of(true);
        }
        return combineLatest([
            this.userService.currentUser.pipe(distinctUntilKeyChanged('jurisdiction')),
            this.userService.isUserLoggedIn,
        ]).pipe(map(function (_a) {
            var currentUser = _a[0], isLoggedIn = _a[1];
            var isIframeEnabled = _this.config.mobileIframeVendors && Object.keys(_this.config.mobileIframeVendors).includes(game.vendor)
                && (_this.config.mobileIframeVendors[game.vendor] === true
                    || (Array.isArray(_this.config.mobileIframeVendors[game.vendor])
                        && _this.config.mobileIframeVendors[game.vendor].includes(currentUser.jurisdiction)));
            // Enable iframe only for vendors where this is supported and logged in users coming from specific jurisdictions
            return isLoggedIn && isIframeEnabled;
        }));
    };
    /**
     * Players should be redirected to a standalone game page whenever this is possible
     * because game running as a full page ensures the best UX (better performance, real fullscreen).
     *
     * This method, when redirection to a full page is allowed, redirects page right away and returns `null`.
     *
     * When iframe needs to be used method returns the game object.
     *
     * @param {Game} game Game object
     * @returns {Observable<Game | null>} `null` when game will be redirected; the same `game` object when no redirection is needed
     */
    GameRedirectionService.prototype.redirectOrPassThrough = function (game) {
        var _this = this;
        // Some vendors are very custom and all logic (including mobile redirection) should be handled inside them.
        // Eg. Netent doesn't even have `launch_url` in game properties.
        // Such vendors should just pass through.
        if ([
            'netent',
        ].includes(game.vendor)) {
            return of(game);
        }
        return this.isIframeRequired(game).pipe(map(function (isIframeRequired) {
            if (isIframeRequired) {
                return game;
            }
            _this.platformService.gotoAbsoluteUrl(game.vendorProperties.launch_url, true);
            return null;
        }));
    };
    return GameRedirectionService;
}());
export { GameRedirectionService };
