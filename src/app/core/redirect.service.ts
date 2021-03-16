import { Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RedirectService {

  private loginRedirectUrl: string = null;

  constructor(
    private router: Router,
    private serializer: UrlSerializer,
  ) { }

  hasLoginRedirectUrl() {
    return this.loginRedirectUrl !== null;
  }

  setLoginRedirectUrl(value: string) {
    this.loginRedirectUrl = value;
  }

  getLoginRedirectUrl() {
    const loginRedirectUrl = this.loginRedirectUrl;
    this.loginRedirectUrl = null;
    return loginRedirectUrl;
  }

  getUrlFromCommands(commands: any[]): string {
    const tree = this.router.createUrlTree(commands);
    return this.serializer.serialize(tree);
  }

  handleLoginRedirectUrl(): void {
    // if we don't have any redirectUrl, we will be able to close the modal by triggering
    // the redirection in the user-state-manager using this string. We still want to stay
    // in the same page, so we will use the current url as redirectUrl
    if (!this.hasLoginRedirectUrl()) {
      this.setLoginRedirectUrl(this.getUrlWithoutModal(this.router.url));
    }
  }

  /**
   * Remove (modal:***) part from the URL.
   * @param {string} url - url string
   * @returns {string} clean url
   */
  getUrlWithoutModal(url: string): string {
    const [cleanUrl] = url.split('(modal:');
    return cleanUrl;
  }
}
