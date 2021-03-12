import { InjectionToken } from '@angular/core';

export interface ColorPaletteConfig {
  main: {
    [key: string]: { [key: string]: string };
  };
  complimentary: {
    [key: string]: { [key: string]: string };
  };
  support: {
    [key: string]: { [key: string]: string };
  };
}

export const defaultColorPaletteConfig: ColorPaletteConfig = {
  main: {},
  complimentary: {},
  support: {},
};

export const COLOR_PALETTE_CONFIG = new InjectionToken<ColorPaletteConfig>('color-palette-config');
