var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
import { fragment as BlockFragment } from '../block/block.graphql';
export var fragment = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment Layout on LobbyCategoryLayout {\n    blockMargin\n    blocks {\n      ...Block\n    }\n  }\n\n  ", "\n"], ["\n  fragment Layout on LobbyCategoryLayout {\n    blockMargin\n    blocks {\n      ...Block\n    }\n  }\n\n  ", "\n"])), BlockFragment);
var templateObject_1;
