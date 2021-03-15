import { Component, OnInit } from '@angular/core';

import { AchievementProgressService } from 'app/achievement-progress/achievement-progress.service';
import { easeInOut } from 'app/shared/animations/animations';
import { UserService } from 'app/user';

@Component({
  selector: 'xc-achievement-notifications',
  templateUrl: './achievement-notifications.component.html',
  styleUrls: ['./achievement-notifications.component.scss'],
  animations: [ easeInOut ],
})
export class AchievementNotificationsComponent implements OnInit {

  isSgaPlayer$ = this.userService.isSgaPlayer$;

  constructor(
    public achievementService: AchievementProgressService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.achievementService.updateLastReadNotification();
  }
}
