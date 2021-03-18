import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CasinoConfig, CASINO_CONFIG } from 'app/core/casino.config';
import { IGameThumb } from 'app/core/game.interface';
import { RedirectService } from 'app/core/redirect.service';
import { UserService } from 'app/user/user.service';
import { Subscription } from 'rxjs';

import { DetailsControllerService } from '../details-controller.service';

@Component({
  selector: 'xc-lobby-expanded-details',
  templateUrl: './lobby-expanded-details.component.html',
  styleUrls: ['./lobby-expanded-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyExpandedDetailsComponent implements OnInit, OnDestroy {
  @Input() public layoutIndex: number;

  @HostBinding('class.visible')
  public visible = false;
  public loading = true;

  public leftOffset = 0;

  public game: IGameThumb | null = null;

  public gamePath: string;

  public background: SafeStyle;

  public isUserLoggedIn$ = this.userService.isUserLoggedIn;

  private subscription: Subscription;

  constructor(
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef,
    private userService: UserService,
    private redirectService: RedirectService,
    private router: Router,
    public detailsController: DetailsControllerService,
    @Inject(CASINO_CONFIG) public casinoConfig: CasinoConfig,
  ) {
  }

  public ngOnInit() {
    this.subscription = this.detailsController.details$.subscribe(({ layoutIndex, leftOffset, game, loading }) => {
      this.visible = layoutIndex === this.layoutIndex;
      this.leftOffset = leftOffset;
      this.game = game;
      this.loading = loading;
      this.background = game ? this.getSafeBackground(game.thumbnails['600x280']) : 'none';
      this.gamePath = game ? `/play/${game.vendor}-${game.slug}` : '';
      this.changeDetector.markForCheck();
    });
  }

  private getSafeBackground(background: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${background}')`);
  }

  public loginAndPlay() {
    this.redirectService.setLoginRedirectUrl(this.gamePath);

    this.router.navigate(['', {
      outlets: {
        modal: 'login',
      },
    }]);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
