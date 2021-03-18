var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
import { fragment as CategoryFragment } from './category/category.graphql';
export var casinoLobbyQuery = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query CasinoLobby($slug: String!, $categorySlug: String, $first: Int, $after: String, $playerState: String, $groups: String) {\n    lobby(slug: $slug, playerState: $playerState, groups: $groups) {\n      categoryConnection(slug: $categorySlug) {\n        edges {\n          node {\n            ...Category\n          }\n        }\n      }\n    }\n  }\n\n  ", "\n"], ["\n  query CasinoLobby($slug: String!, $categorySlug: String, $first: Int, $after: String, $playerState: String, $groups: String) {\n    lobby(slug: $slug, playerState: $playerState, groups: $groups) {\n      categoryConnection(slug: $categorySlug) {\n        edges {\n          node {\n            ...Category\n          }\n        }\n      }\n    }\n  }\n\n  ", "\n"])), CategoryFragment);
var templateObject_1;
