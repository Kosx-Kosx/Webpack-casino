var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
export var languageQuery = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query Languages {\n    languages {\n      edges {\n        node {\n          code\n          text\n          currency\n        }\n      }\n    }\n  }\n"], ["\n  query Languages {\n    languages {\n      edges {\n        node {\n          code\n          text\n          currency\n        }\n      }\n    }\n  }\n"])));
var templateObject_1;
