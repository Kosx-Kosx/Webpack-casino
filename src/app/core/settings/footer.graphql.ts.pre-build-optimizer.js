var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
export var footerQuery = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query Footers {\n    footers {\n      footers {\n        content\n        dynamicCuracaoSeal\n      }\n    }\n  }\n"], ["\n  query Footers {\n    footers {\n      footers {\n        content\n        dynamicCuracaoSeal\n      }\n    }\n  }\n"])));
var templateObject_1;
