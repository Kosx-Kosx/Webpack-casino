var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
export var casinoGameQuery = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query CasinoGame($slug: String!, $returnUrl: String!) {\n    game(vendor_slug: $slug) {\n      name\n      slug\n      vendor\n      vendorProperties(return_url: $returnUrl)\n      jurisdiction\n      width\n      height\n      mobile\n      loginRequired\n      enabled\n      maxBet\n      minBet\n      currency\n    }\n  }\n"], ["\n  query CasinoGame($slug: String!, $returnUrl: String!) {\n    game(vendor_slug: $slug) {\n      name\n      slug\n      vendor\n      vendorProperties(return_url: $returnUrl)\n      jurisdiction\n      width\n      height\n      mobile\n      loginRequired\n      enabled\n      maxBet\n      minBet\n      currency\n    }\n  }\n"])));
var templateObject_1;
