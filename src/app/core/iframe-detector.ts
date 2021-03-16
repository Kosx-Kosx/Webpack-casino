// tslint:disable: no-restricted-globals

export enum IframeDetectorError {
  GENERIC = 'This app cannot be launched inside an iframe.',
}

/**
 * @returns
 * `false`:
 * - if XCAF doesn't run in an iframe, or
 * - if XCAF runs in an iframe, and parent host is whitelisted
 *
 * `true` when XCAF runs in an iframe and parent host is not whitelisted.
 */
function isInUnauthorizedIframe() {
  /** Host names that are allowed to embed XCAF in an iframe (f.e. when XCAF is launched inside a mobile app) */
  const allowedParentHosts: string[] = [
  ];
  let isIframedAndUnauthorized = false;

  if (window.self !== window.top) {
    const anchorTestElem = document.createElement('a');
    // `referrer` equals to to the URL of parent page.
    // Note: when navigation occurs inside iframe then referrer changes to the previous  URL of the iframe.
    // Note2: ComeOn mobile app embeds XCAF inside an iframe (webView). Mobile app has `playcherryapps` string in the user agent string.
    anchorTestElem.href = document.referrer;
    isIframedAndUnauthorized = !allowedParentHosts.includes(anchorTestElem.host) && !navigator.userAgent.includes('playcherryapps');
  }
  return isIframedAndUnauthorized;
}

/**
 * Removes all DOM nodes from BODY and replaces them with the error message.
 */
function displayIframeSecurityError() {
  while (document.body.firstChild) {
    document.body.firstChild.remove();
  }
  document.body.style.background = '#fff';
  document.body.style.color = '#f00';
  const divElem = document.createElement('div');
  divElem.appendChild(document.createTextNode(IframeDetectorError.GENERIC));
  document.body.appendChild(divElem);
}

/**
 * Checks if requirements related to running XCAF inside an iframe were met.
 *
 * If checks fail then tries to escape from iframe to top window. Shows error message if escape fails.
 *
 * @see STABLE-94
 *
 * @returns `false` if XCAF runs inside an iframe and parent host is not whitelisted.
 *
 * Returns `true`:
 * - if XCAF doesn't run inside an iframe, or
 * - if XCAF runs inside an iframe and parent host is whitelisted.
 */
export function iframeRequirementsPassed() {
  let launchAllowed = true;
  if (isInUnauthorizedIframe()) {
    launchAllowed = false;
    try {
      // Escape from an iframe. Browser allows it only when parent and iframe share the same origin or with sandbox="allow-top-navigation".
      // We do such redirect f.e. when click on "Home" button in a mobile game redirects iframe to XCAF.
      top.location.href = self.location.href;
    } catch {
      // Escape is not possible, most likely because parent as a different origin.
      // XCAF can work correctly in this case, but we don't want it because parent is not in `allowedParentHosts`.
      // XCAF won't work in case when iframe is sandboxed with `allow-scripts` flag, but without `allow-same-origin` flag,
      // because requests to FAPI would be sent with `origin: null`, so it would be rejected by FAPI.
      displayIframeSecurityError();
    }
  }
  return launchAllowed;
}
