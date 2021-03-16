import { InjectionToken } from '@angular/core';

export interface LanguageRestriction {
  language: string;
  allowedCountries: string[];
}

export interface LanguageConfig {
  /**
   * Configuration option to restrict a specific language for a list of countries
   */
  restrictions: LanguageRestriction[];
}

export const LANGUAGE_CONFIG = new InjectionToken<LanguageConfig>('language-config');

export const defaultLanguageConfig: LanguageConfig = {
  restrictions: [],
};
