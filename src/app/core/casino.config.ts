import { InjectionToken } from '@angular/core';

export interface CasinoConfig {
  /**
   * `true`: brand has slots/live games lobby
   * `false`: brand doesn't have Slots/Live Games lobby (eg. sunmaker.de, which only has Sports)
   */
  enabled?: boolean;

  /**
   * `true`: brand has favourite games feature
   * `false`: brand doesn't have favourite games feature
   */
  showFavouriteGames?: boolean;

  /**
   *  Enables/Disables Game Search filter options per brand
   */
  showSearchFilter: boolean;

  /**
   * List of supported lobby slugs.
   *
   * Slug for given lobby is REQUIRED to be whitelisted here to actually work.
   */
  lobbyWhitelist: string[];

  /**
   * List of disabled lobby slugs for german jurisdiction.
   */
   lobbyBlacklistByGermanJurisdiction?: string[];

  /**
   * Define if you want to show the search games button on game categories lobby on mobile devices
   */
  showSearchButton: boolean;

  /**
   * Define if you want to show min and max bet information on lobby game thumb
   */
  showMinMaxBet: boolean;

  /**
   * Value that determines whether the lobby header title is shown or not.
   *
   * Caution: If set to true, make sure that all possible lobby names within given brand are staged for translation in casino component.
   */
  showLobbyTitle: boolean;

  /**
   * Value that determines whether the promotion banner and winners widget are shown on top of the lobby.
   */
  showLobbyBanner: boolean;

  /**
   * Breakpoint below which categories are wider than container width and must be displayed as a horizontally scrollable bar
   * to avoid overflowing the container.
   *
   * The lowest possible breakpoint should be used for better UX.
   *
   * If the number of categories may increase then usually using `lg` is a safe option.
   *
   * @TODO consider adding automatic detection of when switching to scrollable view is required.
   */
  scrollableCategoriesBreakpoint: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Width (in pixels) of a single category item.
   *
   * All items will have equal width set in this param.
   */
  scrollableCategoriesItemWidth?: number;

  /**
   * Value that determines if the categories are shown in center alignment.
   *
   * `true` categories have center alignment.
   * `false` categories have left alignment.
   */
  scrollableCategoriesCenterAlignment?: boolean;

  /**
   * `true` adds search component into the lobby categories bar.
   *
   * `false` hides it
   */
  showInlineSearch: boolean;

  /**
   * `always` shows selected game modal always on mobile devices.
   *
   * `loggedout` shows selected game modal only when user is logged out. When user is logged in, the game is started immediately.
   *
   * `thumbCover` shows game details always on game thumbnail.
   *
   * `false` does not show selected game modal in any case. The game is started immediately.
   */
  showMobileSelectedGameModal?: 'always' | 'loggedout' | 'thumbCover' | false;

  /**
   * `false` means that, in staging/production environments, the routes are going to start with /lang/.
   *
   * `true` means that, in staging/production environments, we're not going to have any /lang/ url segment.
   */
  noLanguagesInRoutes?: boolean;

  /** All config related to game thumbs */
  gameThumb?: {
    footer: {
      isVisible: boolean,
      showVolatility: boolean,
    };
    /**
     * Defines which button is displayed in a game thumb for logged out desktop users:
     *
     * - `false`: "Play for fun" is used. Clicking it starts a game.
     *
     * - `true`: "Game info" is used. Clicking it opens game details.
     */
    showGameInfo: boolean;
    /**
     * Defines if game vendor should be visible.
     */
    showGameVendor: boolean,
    showRibbonIn3D: boolean;
    /**
     * Defines if "Login and Play" button should be visible for logged out users.
     * When "Conversion modal" is enabled then most likely this button should be hidden (eg. in SM).
     *
     * Note: this applies to game thumb only, so desktop only. Mobile uses "Selected game" modal.
     */
    showLoginAndPlayBtn?: boolean;

    /**
     * List of game vendors for which jackpot is displayed inside a game thumbnail.
     */
    jackpotVendors?: string[];

    /**
     * Controls whether game vendor or subvendor should be presented in a template.
     *
     * `false`: game vendor is always preferred
     *
     * `true`: game subvendor is used. If game has no subvendor then vendor is used.
     */
    preferSubvendor?: boolean;
  };
}

export const CASINO_CONFIG = new InjectionToken<CasinoConfig>('casino');
