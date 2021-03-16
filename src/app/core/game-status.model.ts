import { IGameStatus } from 'app/core/game.interface';

export enum GameStatus {
  NOT_ENABLED = 'gameNotEnabled',
  LOGIN_REQUIRED = 'loginRequired',
  NOT_FOUND = 'notFound',
  INTERNAL_ERROR = 'internalError',
  /**
   * Used f.e. when user hasn't accepted the latest Terms and Conditions and somehow managed to log in.
   */
  PERMISSION_DENIED = 'playerHasNoPermission',
}

export const getGameErrorStatus = (game: IGameStatus, userLoggedIn = true, checkLoginRequired = true): GameStatus | null => {
  if (!game) {
    return GameStatus.NOT_FOUND;
  }

  if (!game.enabled) {
    return GameStatus.NOT_ENABLED;
  }

  if (checkLoginRequired && !userLoggedIn && game.loginRequired) {
    return GameStatus.LOGIN_REQUIRED;
  }

  return null;
};
