import { ChangeDetectorRef, OnDestroy, OnInit, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CasinoConfig } from 'app/core/casino.config';
import { RedirectService } from 'app/core/redirect.service';
import { UserService } from 'app/user/user.service';
import { DetailsControllerService } from '../details-controller.service';
var LobbyExpandedDetailsComponent = /** @class */ (function () {
    function LobbyExpandedDetailsComponent(sanitizer, changeDetector, userService, redirectService, router, detailsController, casinoConfig) {
        this.sanitizer = sanitizer;
        this.changeDetector = changeDetector;
        this.userService = userService;
        this.redirectService = redirectService;
        this.router = router;
        this.detailsController = detailsController;
        this.casinoConfig = casinoConfig;
        this.visible = false;
        this.loading = true;
        this.leftOffset = 0;
        this.game = null;
        this.isUserLoggedIn$ = this.userService.isUserLoggedIn;
    }
    LobbyExpandedDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.detailsController.details$.subscribe(function (_a) {
            var layoutIndex = _a.layoutIndex, leftOffset = _a.leftOffset, game = _a.game, loading = _a.loading;
            _this.visible = layoutIndex === _this.layoutIndex;
            _this.leftOffset = leftOffset;
            _this.game = game;
            _this.loading = loading;
            _this.background = game ? _this.getSafeBackground(game.thumbnails['600x280']) : 'none';
            _this.gamePath = game ? "/play/" + game.vendor + "-" + game.slug : '';
            _this.changeDetector.markForCheck();
        });
    };
    LobbyExpandedDetailsComponent.prototype.getSafeBackground = function (background) {
        return this.sanitizer.bypassSecurityTrustStyle("url('" + background + "')");
    };
    LobbyExpandedDetailsComponent.prototype.loginAndPlay = function () {
        this.redirectService.setLoginRedirectUrl(this.gamePath);
        this.router.navigate(['', {
                outlets: {
                    modal: 'login',
                },
            }]);
    };
    LobbyExpandedDetailsComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return LobbyExpandedDetailsComponent;
}());
export { LobbyExpandedDetailsComponent };
