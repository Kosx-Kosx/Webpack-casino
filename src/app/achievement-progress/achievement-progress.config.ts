import { InjectionToken } from '@angular/core';

export interface AchievementConfig {
  levelAchievementChainName: string;
  defaultLevelName: string;
  /** Determines if the achievement bar is hiding when user scrolls down */
  achievementBarAlwaysVisible?: boolean;
}

export const defaultAchievementConfig: AchievementConfig = {
  levelAchievementChainName: 'main',
  defaultLevelName: '1',
  achievementBarAlwaysVisible: false,
};

export const ACHIEVEMENT_CONFIG = new InjectionToken<AchievementConfig>('user-achievemnt-config', {
  providedIn: 'root',
  factory: () => defaultAchievementConfig,
});
