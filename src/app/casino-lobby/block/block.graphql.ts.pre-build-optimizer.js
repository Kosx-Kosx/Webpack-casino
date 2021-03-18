var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
import { gameThumbFragment } from 'app/game-shared/game-thumb/game-thumb.graphql';
import { promotionFragment } from 'app/media-box/promotions.graphql';
export var fragment = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment Block on LobbyCategoryLayoutBlock {\n    type\n    col\n    row\n    sizeX\n    sizeY\n    game {\n      ...GameThumb\n    }\n    promotions {\n      ...PromotionFragment\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  fragment Block on LobbyCategoryLayoutBlock {\n    type\n    col\n    row\n    sizeX\n    sizeY\n    game {\n      ...GameThumb\n    }\n    promotions {\n      ...PromotionFragment\n    }\n  }\n\n  ", "\n  ", "\n"])), gameThumbFragment, promotionFragment);
var templateObject_1;
