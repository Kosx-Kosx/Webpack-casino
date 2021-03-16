var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
export var seoQuery = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query Seo($url: String!) {\n    seo(url: $url) {\n      title\n      links {\n        rel\n        href\n      }\n      metaTags {\n        name\n        content\n        type\n      }\n    }\n  }\n"], ["\n  query Seo($url: String!) {\n    seo(url: $url) {\n      title\n      links {\n        rel\n        href\n      }\n      metaTags {\n        name\n        content\n        type\n      }\n    }\n  }\n"])));
var templateObject_1;
