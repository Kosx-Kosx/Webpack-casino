import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, of, Subject, zip } from 'rxjs';
import { map, switchMap, tap, filter, distinctUntilChanged, mapTo } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from 'app/core/app.config';
import { CacheService } from 'app/core/cache.service';
import { UserService, IUser } from 'app/user';

import {
  IRiskCategories,
  IRiskValues,
  IUserWithRisk,
  IMentorIndividualMessagesResponse,
  IMentorIndividualMessage,
} from './risk.interface';

@Injectable({ providedIn: 'root' })
export class RiskService {

  private readonly mentorMessagesStorageKey = 'mentor-msg';

  private messageToMarkAsRead$ = new Subject<IMentorIndividualMessage>();

  /**
   * This is needed because `UserService.currentLoggedInUser` cannot have `shareReplay(1)`.
   *
   * The reason for this is that we cannot allow user data to be cached when next user logs in,
   * but in this service we need to access current user at later stage, so here we need
   * to use `currentUser` and we're making sure that we won't run anything for guest user.
   */
  private newUserLogin$ = this.userService.currentUser.pipe(
    distinctUntilChanged((prev, curr) => prev.id === curr.id),
    switchMap(user => this.userService.isUserLoggedIn.pipe(
      filter(Boolean),
      mapTo(user as IUser),
    )),
  );

  constructor(
    private cacheService: CacheService,
    private http: HttpClient,
    private userService: UserService,
    @Inject(APP_CONFIG) appConfig: AppConfig,
  ) {
    if (appConfig.riskFeaturesEnabled) {
      // Handle marking messages as shown (deleting them from saved messages in cache)
      this.newUserLogin$.pipe(
        switchMap(user => this.messageToMarkAsRead$.pipe(
          switchMap(msgToMark => this.getCachedMentorMessages(user).pipe(
            map(messages => messages.filter(msg => msg.MessageID !== msgToMark.MessageID)),
          )),
          switchMap(updatedMsgs => this.saveMentorMessages(user, updatedMsgs)),
        )),
      ).subscribe();
    }
  }

  /** Returns risk categories in a standardized way */
  getCategories(): Observable<IRiskCategories> {
    return this.http.get<IUserWithRisk>(`{{apiEndpoint}}/players/risk-profile`).pipe(
      switchMap(data => {
        // Risk profile data may be unavailable for some users
        return (data.risk_profile && data.risk_profile.RiskCategoryGlobalID) ?
        of({
          globalRisk: this.interpretRiskById(data.risk_profile.RiskCategoryGlobalID),
          moneyRisk: this.interpretRiskById(data.risk_profile.RiskCategoryMoneyID),
          timeRisk: this.interpretRiskById(data.risk_profile.RiskCategoryTimeID),
          responsibleGamingRisk: this.interpretRiskById(data.risk_profile.RiskCategoryResponsibleGamingID),
        }) :
        of(null);
      }),
    );
  }

  /**
   * Gets all the messages from mentor for current user which have not been returned before.
   *
   * The logic is as follows: If the message has "ReadDate" field that equals '01.01.0001', it means it's returned for the first time.
   * It also includes all the messages not shown previously from localStorage.
   *
   * @returns {Observable<string[]>} a stream that emits all currently new messages as an array of strings
   */
  getAllUnreadMentorMessages(): Observable<IMentorIndividualMessage[]> {
    return this.newUserLogin$.pipe(
      switchMap(user =>
        zip(
          this.getNewMentorMessages(),
          this.getCachedMentorMessages(user),
        )
        .pipe(
          map(([newMessages, cachedMessages]) => cachedMessages.concat(newMessages)),
          tap(messages => this.saveMentorMessages(user, messages)),
        ),
      ),
    );
  }

  /**
   * Mark given mentor message as read, which results in removing it from localStorage and
   * making sure it will not be shown again after next login.
   *
   * @param {IMentorIndividualMessage} messageToMark a message to be removed from localStorage
   */
  markMentorMessageAsRead(messageToMark: IMentorIndividualMessage) {
    this.messageToMarkAsRead$.next(messageToMark);
  }

  private interpretRiskById(riskId: string): IRiskValues {
    switch (riskId) {
      case '1':
        return {
          levelName: 'minimal',
          percentage: 10,
        };
      case '2':
        return {
          levelName: 'low',
          percentage: 30,
        };
      case '3':
        return {
          levelName: 'medium',
          percentage: 60,
        };
      case '4':
        return {
          levelName: 'high',
          percentage: 90,
        };
    }
  }

  private getNewMentorMessages(): Observable<IMentorIndividualMessage[]> {
    return this.http.get<IMentorIndividualMessagesResponse>(`{{apiEndpoint}}/messages/mentor`).pipe(
      map(response => response.messageList.filter(message => message.ReadDate === '01.01.0001')),
    );
  }

  private getCachedMentorMessages(user: IUser): Observable<IMentorIndividualMessage[]> {
    return this.cacheService.requestUserData<IMentorIndividualMessage[]>(user, this.mentorMessagesStorageKey, []);
  }

  private saveMentorMessages(user: IUser, messages: IMentorIndividualMessage[]): Observable<boolean> {
    return this.cacheService.pushUserData(user, this.mentorMessagesStorageKey, messages);
  }
}
