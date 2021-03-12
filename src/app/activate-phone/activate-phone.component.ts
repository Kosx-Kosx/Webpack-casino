import { Component, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, timer, merge, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mapTo, shareReplay, switchMap, tap, filter, take } from 'rxjs/operators';

import { PlatformService } from 'app/core/platform.service';
import { ModalComponent } from 'app/modal/modal.component';
import { UserService } from 'app/user';

import { ACTIVATE_PHONE_CONFIG, ActivatePhoneConfig } from './activate-phone.config';

type StepType = 'activate' | 'change';

@Component({
  selector: 'xc-activate-phone',
  templateUrl: './activate-phone.component.html',
  styleUrls: ['./activate-phone.component.scss'],
})
export class ActivatePhoneComponent implements OnInit, OnDestroy {

  @ViewChild(ModalComponent, { static: false }) modal: ModalComponent;

  step: StepType = 'activate';
  resending = false;
  showPromotion = this.config.showPromotion === 'only-on-desktop' && this.platform.isDesktop() || this.config.showPromotion === 'always';

  showInfo$ = this.route.params
    .pipe(
      map(params => params.showInfo),
      shareReplay(1),
    );

  phone$ = this.route.params
    .pipe(
      map(params => params.phone),
      shareReplay(1),
    );

  canResend$ = this.userService.guest
    .pipe(
      map(data => data.last_sms_sent),
      distinctUntilChanged(),
      map(lastSent => lastSent + this.config.activateResendDelay - Date.now()),
      switchMap(delay => {
        return merge(
          of(false),
          timer(delay).pipe(mapTo(true)),
        );
      }),
      shareReplay(1),
    );

  private subscription: Subscription = null;

  constructor(
    private platform: PlatformService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    @Inject(ACTIVATE_PHONE_CONFIG) public config: ActivatePhoneConfig,
  ) { }

  ngOnInit(): void {
    this.subscription = this.userService.isActivated$.pipe(
      filter(Boolean),
      take(1),
    ).subscribe(() => {
      this.modal.close();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setStep(value: StepType) {
    this.step = value;
  }

  onPhoneChange(phone: string) {
    this.setStep('activate');
    this.router.navigate([{ outlets: { modal: [ 'activate-phone', phone, { showInfo: true } ] } }], { replaceUrl: true });
  }

  resend(phone: string) {
    this.resending = true;
    return this.userService.resendActivationCode(phone)
      .pipe(tap(() => this.resending = false))
      .subscribe();
  }

  onPromotionLoad(promosCount: number) {
    setTimeout(() => {
      this.modal.asideEnabled = promosCount > 0;
    });
  }

  onCloseClick(): void {
    this.modal.close();
  }
}
