import * as i0 from "@angular/core";
var GraphQLInterceptor = /** @class */ (function () {
    function GraphQLInterceptor() {
    }
    // stripping excessive whitespace from graphql queries to reduce network overhead
    GraphQLInterceptor.prototype.intercept = function (req, next) {
        var query = req.params.get('query');
        if (query) {
            req = req.clone({
                setParams: {
                    query: query
                        .replace(/\s+/g, ' ')
                        .replace(/ ?([:,){}]) /g, '$1'),
                },
            });
        }
        return next.handle(req);
    };
    GraphQLInterceptor.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function GraphQLInterceptor_Factory() { return new GraphQLInterceptor(); }, token: GraphQLInterceptor, providedIn: "root" });
    return GraphQLInterceptor;
}());
export { GraphQLInterceptor };
