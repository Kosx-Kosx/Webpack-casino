var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
import { fragment as LayoutFragment } from '../layout/layout.graphql';
export var fragment = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment Category on LobbyCategory {\n    slug\n    name\n    layoutConnection(first: $first, after: $after) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      edges {\n        node {\n          ...Layout\n        }\n      }\n    }\n  }\n\n  ", "\n"], ["\n  fragment Category on LobbyCategory {\n    slug\n    name\n    layoutConnection(first: $first, after: $after) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      edges {\n        node {\n          ...Layout\n        }\n      }\n    }\n  }\n\n  ", "\n"])), LayoutFragment);
var templateObject_1;
