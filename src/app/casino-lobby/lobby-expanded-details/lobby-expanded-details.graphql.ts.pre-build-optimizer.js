var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
export var gameDetailQuery = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GameDetails($id: ID) {\n    game(id: $id) {\n      id\n      slug\n      name\n      vendor\n      vendorName\n      enabled\n      loginRequired\n      description\n      thumbnails\n    }\n  }\n"], ["\n  query GameDetails($id: ID) {\n    game(id: $id) {\n      id\n      slug\n      name\n      vendor\n      vendorName\n      enabled\n      loginRequired\n      description\n      thumbnails\n    }\n  }\n"])));
var templateObject_1;
