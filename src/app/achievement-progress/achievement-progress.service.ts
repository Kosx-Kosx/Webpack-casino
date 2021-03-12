import { Injectable, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, Subject, combineLatest, defer, EMPTY, merge, of, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, pairwise, share, switchMap, tap } from 'rxjs/operators';

import { SessionService } from 'app/core/session';
import { NotificationsQueueService, NotificationEnumType, INotification } from 'app/notifications';
import { PusherService } from 'app/pusher';
import { UserService, IUser, IGuestUser } from 'app/user';

import { IAchievementProgressEvent } from './achievement-progress-event.interface';
import { ACHIEVEMENT_CONFIG, AchievementConfig } from './achievement-progress.config';
import {
  achievementProgressQuery,
  IAchievementProgressResponse,
  IUserAchievement,
  achievementLevelsQuery,
  IAchievementLevelsResponse,
} from './achievement-progress.graphql';

/**
 * Interface used by notifications system.
 */
export interface ILevelUpNotification extends INotification {
  name: string;
  unread: boolean;
}

/**
 * Used for storing level up notification handled internally by achievement module
 */
export type ILevelUpInfo = Pick<ILevelUpNotification, 'name' | 'unread'>;

export interface IStoredLevels {
  lastReadLevel: string;
  levelUpNotificationQueue: ILevelUpInfo[];
}

@Injectable({ providedIn: 'root' })
export class AchievementProgressService {

  private levelNameStorageKey = 'LAST_ACHIEVEMENT_LEVEL';
  public availableLevels: string[] = [];

  /**
   * List of the achieved levels reached in the same user session.
   */
  public levelUpNotificationQueue: ILevelUpInfo[] = [];

  /**
   * Level up notification should be called when two last progress updates for particular player differ by level name.
   */
  public levelUp$: Observable<IUserAchievement>;

  /**
   * Progress update can be triggered by either pusher notification, periodic updates or manual trigger by calling updateProgress method.
   */
  public achievementProgress$: Observable<IUserAchievement>;

  /**
   * (for internal use) manual triggering request for updating user achievement progress
   */
  private progressUpdateTrigger$ = new Subject<void>();

  private jurisdiction: string;

  constructor(
    @Inject(ACHIEVEMENT_CONFIG) private achievementConfig: AchievementConfig,
    private apollo: Apollo,
    pusher: PusherService,
    userService: UserService,
    sessionService: SessionService,
    notificationsQueue: NotificationsQueueService,
  ) {
    this.requestLevels().subscribe(levels => this.availableLevels = levels);

    // TODO - kill this timer call when replaced by push notifications.
    // Using the interval for now is only for a temporary period to show updated status
    this.achievementProgress$ = defer(() => combineLatest([
      userService.isUserLoggedIn,
      userService.currentUser,
      userService.isLoggedInNonSga$,
    ])
    .pipe(
      // TODO: why do we provide guest as currentUser???
      switchMap(([loggedIn, user, isLoggedInNonSga]) => (loggedIn && isLoggedInNonSga) ? of(user) : of<IUser>({ id: null } as IUser)),
      // for each different player start new observable tracking his progress
      distinctUntilChanged((a, b) => a.id === b.id),
      tap(user => this.jurisdiction = user.jurisdiction),
      // new observable for each new player
      switchMap((user) => user.id ? merge(
          // periodic updates
          timer(0, 30000),
          // manual triggered updates (like for example push notification)
          this.progressUpdateTrigger$,
        ).pipe(
          // if manual trigger is close to periodic update we care only about last of them
          debounceTime(1000),
          switchMap(() => this.requestProgress(user)),
        ) : EMPTY),
    )).pipe(share());

    // Compare the last 2 achievement updates. If the name is different and user is the same, then the user got a new level.
    this.levelUp$ = this.achievementProgress$
      .pipe(
        pairwise(),
        filter(([update1, update2]) => update1.achievement.name !== update2.achievement.name && update1.user === update2.user),
        map(([, update]) => update),
        share(),
      );

    // trigger progress update to get more precise progress value after pusher notification
    // TODO: get the correct value from push notification then it can be merged with achievementProgress$
    // without need to trigger manual progress updates
    pusher.on<IAchievementProgressEvent>('user_achievement_progress').pipe(
      map(event => ({
        achievement: {
          name: event.name,
        },
        progressPercentage: event.progress_percentage, // is this ever different than 0?
      } as IUserAchievement)),
    )
    .subscribe(this.updateProgress.bind(this));

    // Reset localstorage and levelUpNotificationQueue on logout/login to prevent leaking data between different user accounts
    sessionService.event$.pipe(
      filter(event => event.name === 'start' || event.name === 'revoke'),
    )
    .subscribe(() => {
      localStorage.removeItem(this.levelNameStorageKey);
      this.levelUpNotificationQueue = [];
    });

    this.achievementProgress$.subscribe((ua: IUserAchievement) => {
      const storedLevels: IStoredLevels = JSON.parse(localStorage.getItem(this.levelNameStorageKey))
        || { lastReadLevel: ua.achievement.name, levelUpNotificationQueue: [] };

      this.levelUpNotificationQueue = storedLevels.levelUpNotificationQueue;
      if (storedLevels.lastReadLevel !== ua.achievement.name) {
        const lastLevelIndex = this.availableLevels.indexOf(storedLevels.lastReadLevel);
        const currentLevelIndex = this.availableLevels.indexOf(ua.achievement.name);

        if (lastLevelIndex !== -1 && currentLevelIndex !== -1 && lastLevelIndex !== currentLevelIndex) {
          this.availableLevels.slice(lastLevelIndex + 1, currentLevelIndex + 1).forEach(name => {
            if (!this.levelUpNotificationQueue.find(f => f.name === name)) {
              this.levelUpNotificationQueue.unshift({ name, unread: true });
              storedLevels.levelUpNotificationQueue = this.levelUpNotificationQueue;
            }
          });
        }
      }

      localStorage.setItem(this.levelNameStorageKey, JSON.stringify(storedLevels));
    });

    // initialize notifications
    this.levelUp$.subscribe((achievement) => {
      const message = this.jurisdiction === 'sga' ? NotificationEnumType.LEVEL_UP_SGA : NotificationEnumType.LEVEL_UP;
      notificationsQueue.showByType<ILevelUpNotification>(message, { name: achievement.achievement.name });
    });
  }

  public updateLastReadNotification() {
    if (this.levelUpNotificationQueue && this.levelUpNotificationQueue.length) {
      this.levelUpNotificationQueue.forEach(f => f.unread = false);
      const storedLevels: IStoredLevels = {
        lastReadLevel: this.levelUpNotificationQueue[0].name,
        levelUpNotificationQueue: this.levelUpNotificationQueue,
      };

      localStorage.setItem(this.levelNameStorageKey, JSON.stringify(storedLevels));
    }
  }

  public dismissNotifications() {
    const storedLevels: IStoredLevels = {
      lastReadLevel: this.levelUpNotificationQueue[0].name,
      levelUpNotificationQueue: [],
    };
    this.levelUpNotificationQueue = [];
    localStorage.setItem(this.levelNameStorageKey, JSON.stringify(storedLevels));
  }

  public updateProgress() {
    this.progressUpdateTrigger$.next();
  }

  private requestLevels() {
    return this.apollo.query<IAchievementLevelsResponse>({
      query: achievementLevelsQuery,
      variables: {
        name: this.achievementConfig.levelAchievementChainName,
      },
      fetchPolicy: 'network-only',
    })
    .pipe(map(({data}) => data.achievementChains.edges[0].node.achievements.edges.map(e => e.node.name)));
  }

  private requestProgress(user: IUser | IGuestUser) {
    return this.apollo
      .query<IAchievementProgressResponse>({
        query: achievementProgressQuery,
        variables: {
          name: this.achievementConfig.levelAchievementChainName,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(({ data }) => data.achievementChains.edges[0].node),
        filter(achievementChain => achievementChain.enabled),
        map(achievementChain => {
          const connection = achievementChain.userAchievementConnection;
          const achievementNode = connection && connection.edges && connection.edges.length
            ? connection.edges[0].node
            : null;

          const progressPercentage = achievementNode && connection ? achievementNode.progressPercentage : 0;

          return {
            achievement: {
              name: achievementNode ? achievementNode.achievement.name : this.achievementConfig.defaultLevelName,
            },
            progressPercentage: Math.floor(progressPercentage),
            user: user.id, // we need to know to whom does that update belongs to
          } as IUserAchievement;
        }),
      );
  }
}
