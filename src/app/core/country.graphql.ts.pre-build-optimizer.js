var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
export var countriesQuery = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query Countries {\n    countries {\n      edges {\n        node {\n          code\n          name\n          dialCode\n          currency\n          minimumAge\n          enabled\n          examplePhone\n          states {\n            code\n            name\n          }\n        }\n      }\n    }\n  }\n"], ["\n  query Countries {\n    countries {\n      edges {\n        node {\n          code\n          name\n          dialCode\n          currency\n          minimumAge\n          enabled\n          examplePhone\n          states {\n            code\n            name\n          }\n        }\n      }\n    }\n  }\n"])));
var templateObject_1;
