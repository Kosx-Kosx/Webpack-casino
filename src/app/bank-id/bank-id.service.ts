import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, LOCALE_ID, Inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { AnalyticsService } from 'app/analytics/analytics.service';
import { APP_CONFIG, AppConfig } from 'app/core/app.config';
import { CacheService } from 'app/core/cache.service';
import { PlatformService } from 'app/core/platform.service';
import { PusherService } from 'app/pusher';

import {
  BankIdIdentificationMessage,
  BankIdIdentificationUserData,
  BankIdMessage,
  BankIdUserData,
  BankIdMessageStatus,
} from './bank-id-interfaces';

/**
 * @deprecated This service is deprecated as we no longer support SGA
 */
@Injectable()
export class BankIdService {
  /**
   * The default state of BankId (based on brand config & site language)
   * @deprecated This property is deprecated as we no longer support SGA
   */
  private readonly enabledByDefault = this.appConfig.bankIdEnabled && this.locale === 'sv';

  /**
   * Emits when bankId is being enabled or disabled.
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public currentState$ = new BehaviorSubject<boolean>(this.enabledByDefault);

  /**
   * Current state of BankID.
   * The default value is determined here in service. It may be changed later by calling bankIdService.changeState(),
   * for example by selecting country "Sweden" in registration form.
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public get isEnabled(): boolean {
    return this.currentState$.value;
  }

  public set isEnabled(newValue) {
    this.currentState$.next(newValue);
  }

  /**
   * Emits true when BankID state is being changed from the default value.
   * Example: selecting "Sweden" in registration form enables BankID.
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public stateWasChanged$ = new BehaviorSubject<boolean>(false);

  /**
   * Used for getting the bankID validation status and user_exist.
   * @deprecated This property is deprecated as we no longer support SGA
   */
  message$ = new Subject<BankIdMessage>();

  /**
   * Required for register-form. It contains the validated user data. It needs to be a separate subject
   * because it's not possible to pass through the message$ from login and register to it
   * @deprecated This property is deprecated as we no longer support SGA
   */
  userData$ = new BehaviorSubject<BankIdUserData>(null);

  /**
   * Token returned by the iframe success url. Required for login/register to identify the player.
   * @deprecated This property is deprecated as we no longer support SGA
   */
  identToken$ = new BehaviorSubject<string>(null);

  /**
   * Information if user is using mobile or desktop app for BankID authentication
   * @deprecated This property is deprecated as we no longer support SGA
   */
  selectedAppType: 'desktop' | 'mobile';

  /**
   * Cache key for bankId preference setting.
   */
  private readonly forceBankIdLoginStorageKey = 'bankid';

  /**
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public alwaysOfferBankIdLogin: boolean;

  constructor(
    private http: HttpClient,
    private analyticsService: AnalyticsService,
    private cacheService: CacheService,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(LOCALE_ID) private locale: string,
    @Optional() private pusher: PusherService,
    private platform: PlatformService,
  ) {
    if (pusher) {
      this.pusher.on('identification_status', true)
        .subscribe((message: any) => this.onMessage(message as BankIdIdentificationMessage));
    }

    // Check if browser had ever been used to authenticate with BankID
    // and always offer logging in with BankID if thats the case
    this.cacheService.request<boolean>(this.forceBankIdLoginStorageKey).subscribe(force => {
      this.alwaysOfferBankIdLogin = this.appConfig.bankIdEnabled ? !!force : false;
    });

    // On a successful BankID authentication mark the browser as BankId friendly
    if (this.appConfig.bankIdEnabled) {
      this.message$.pipe(
        filter(msg => msg.status === BankIdMessageStatus.SUCCESS),
        first(),
      )
      .subscribe(() => {
        this.alwaysOfferBankIdLogin = true;
        this.cacheService.push(this.forceBankIdLoginStorageKey, true);
      });
    }
  }

  /**
   * Enables or disables BankID state.
   *
   * @param {boolean || null} forcedState Desired state of BankID or null to set the default value.
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public changeState(forcedState: boolean): void {
    if (!this.appConfig.bankIdEnabled) {
      return;
    }

    // Use forced value
    if (typeof forcedState === 'boolean' && forcedState !== this.isEnabled) {
      this.isEnabled = forcedState;
      this.stateWasChanged$.next(true);
    }

    // Reset to the default value
    else if (forcedState === null && this.enabledByDefault !== this.isEnabled) {
      this.isEnabled = this.enabledByDefault;
      this.stateWasChanged$.next(false);
    }
  }

  /**
   * @deprecated This property is deprecated as we no longer support SGA
   */
  identify(personalNumber: string = null) {
    const externalId = this.getExternalId();
    this.pusher.externalId$.next(externalId);
    let ids = `&external_id=${externalId}`;
    if (personalNumber) {
      ids += `&personal_number=${personalNumber}`;
    }
    const url = `${this.platform.location.origin}/bankid.html`;
    const urls = `&success_url=${url}&failed_url=${url}`;
    return this.http.get(`{{apiEndpoint}}/identify?provider=bank-id${ids}${urls}`);
  }

  /**
   * @deprecated This property is deprecated as we no longer support SGA
   */
  clearExternalChannel() {
    this.pusher.externalId$.next(null);
  }

  /**
   * External id is a unique identifier for every identify request and is used by our platform
   * to send pusher notifications through a unique channel created from it.
   */
  private getExternalId(): string {
    return `sso-${this.getUniqueId()}`;
  }

  private getUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  private onMessage(data: BankIdIdentificationMessage) {
    // This is a hack for an edge case situation where user validates himself but core is unable to connect bankID
    // with the account because bankID is already used by another account
    const validated = data.status === BankIdMessageStatus.SUCCESS && data.identified;
    this.userData$.next(validated ? this.convertPersonalData(data.ident_id, data.result) : null);

    this.message$.next({
      status: validated ? BankIdMessageStatus.SUCCESS : BankIdMessageStatus.FAILED,
      url: data.url,
      user_exists: data.user_exists,
      error_message: data.error_message,
    } as BankIdMessage);

    this.clearExternalChannel();
  }

  private convertPersonalData(ident_id: string, data: BankIdIdentificationUserData) {
    const password = this.getUniqueId();
    return {
      birthday: this.getBirthDateFromPersonalNumber(ident_id),
      first_name: data.first_name,
      last_name: data.last_name,
      gender: this.getGenderFromPersonalNumber(ident_id),
      mobile_number: data.phone ? data.phone.substring(4) : '',
      postcode: data.postal_code || 'N/A',
      city: data.city || 'N/A',
      address: data.street || 'N/A',
      password,
      password_confirm: password,
    };
  }

  /**
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public setApp(appType: 'desktop' | 'mobile'): void {
    this.selectedAppType = appType;
  }

  /**
   * @deprecated This property is deprecated as we no longer support SGA
   */
  public sendAnalyticsForBankID(status: string, isLogin: boolean): void {
    const action = `${isLogin ? 'login' : 'register'}_${status}`;
    const trackedProperties = {
      method: 'bankID',
      selectedAppType: this.selectedAppType,
    };
    this.analyticsService.send(action, trackedProperties);
  }

  /**
   * Return date of birth casted from personalNumber
   * @param {string} personalNumber swedish personal number in format YYYYMMDDNNNN
   * @returns {string} date of birth in ISO format
   */
  private getBirthDateFromPersonalNumber(personalNumber: string): string {
    const year = personalNumber.substring(0, 4);
    const month = personalNumber.substring(4, 6);
    const day = personalNumber.substring(6, 8);
    return new Date(`${year}-${month}-${day}`).toISOString();
  }

  /**
   * Personal number is a 12 digit number. The first 8 char is date of birth,
   * the third char from the remaining 4 digit suggest the gender of the user.
   * Male: odd | Female: even
   */
  private getGenderFromPersonalNumber(personalNumber: string) {
    const genderDigit = Number(personalNumber.substring(10, 11));
    return genderDigit % 2 ? 'male' : 'female';
  }
}
