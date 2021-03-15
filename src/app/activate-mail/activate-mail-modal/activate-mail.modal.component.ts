import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { CloseModalActions } from 'app/modal/close-modal-actions.enum';
import { ModalComponent } from 'app/modal/modal.component';
import { NotificationEnumType, NotificationsQueueService, INotification } from 'app/notifications';
import { UserService } from 'app/user';

@Component({
  selector: 'xc-activate-mail',
  templateUrl: './activate-mail-modal.component.html',
})
export class ActivateMailModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild(ModalComponent, { static: false }) modal: ModalComponent;

  public CloseModalActions = CloseModalActions;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    private angulartics: Angulartics2,
    private notifications: NotificationsQueueService,
  ) { }

  ngAfterViewInit() {
    const { code } = this.route.snapshot.params;

    if (code) {
      const trackedProperties = {
        method: 'email',
      };

      this.userService.activate(code)
        .pipe(
          untilDestroyed(this),
        )
        .subscribe(
          () => {
            this.notifications.showByType<INotification>(NotificationEnumType.GUEST_ACTIVATION_SUCCESS);
            this.angulartics.eventTrack.next({
              action: 'activation_succeed',
              properties: {
                ...trackedProperties,
                gtmCustom: trackedProperties,
              },
            });
            this.modal.close();
          },
          () => {
            this.notifications.showByType(NotificationEnumType.GUEST_ACTIVATION_ERROR);
            this.angulartics.eventTrack.next({
              action: 'activation_failed',
              properties: {
                ...trackedProperties,
                gtmCustom: trackedProperties,
              },
            });
            this.modal.close();
          },
        );
    } else {
      // this window is just about open, show the loader and close itself once user activated
      // when user by any change goes here without code, the modal have to close itself as user can't do it on its own
      // We just show the same error that shows when activation is unsuccessful because he's not really activated
      this.notifications.showByType(NotificationEnumType.GUEST_ACTIVATION_ERROR);
      this.modal.close();
    }
  }

  ngOnDestroy() { }
}
