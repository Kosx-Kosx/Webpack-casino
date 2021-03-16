import { Renderer2, RendererFactory2 } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { AppConfig } from 'app/core/app.config';
import { PlatformService } from 'app/core/platform.service';
import { defer, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LanguageService } from './language.service';
import { RouteService } from './route.service';
import { seoQuery } from './seo.graphql';
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
import * as i2 from "./route.service";
import * as i3 from "@angular/platform-browser";
import * as i4 from "./app.config";
import * as i5 from "./platform.service";
import * as i6 from "./language.service";
var SeoService = /** @class */ (function () {
    function SeoService(apollo, routeService, titleService, metaService, config, rendererFactory, platformService, languageService) {
        var _this = this;
        this.apollo = apollo;
        this.routeService = routeService;
        this.titleService = titleService;
        this.metaService = metaService;
        this.config = config;
        this.platformService = platformService;
        this.languageService = languageService;
        this.apiData$ = defer(function () { return _this.routeService.url$; })
            .pipe(switchMap(function (url) { return _this.apollo.use('get').query({ query: seoQuery, variables: { url: url } }); }), map(function (_a) {
            var data = _a.data;
            return data.seo;
        }));
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    SeoService.prototype.initialize = function () {
        var _this = this;
        this.routeService.primaryOutletData$.subscribe(function () {
            _this.updateHreflangs();
        });
        combineLatest([
            this.routeService.primaryOutletData$,
            this.apiData$,
        ])
            .subscribe(function (_a) {
            var seoRouter = _a[0], seoApi = _a[1];
            /*  Preferred title order:
                1. Title set in BO
                2. Title set in routing data with optional brand name suffix
                3. Brand name
            */
            var title = _this.config.title.brandName;
            if (seoRouter && seoRouter.title) {
                var suffixedTitle = [seoRouter.title, _this.config.title.brandName].join(_this.config.title.separator);
                // Add suffix if we're under 55 chars - See https://moz.com/learn/seo/title-tag
                title = suffixedTitle.length <= 55 ? suffixedTitle : seoRouter.title;
            }
            if (seoApi && seoApi.title) {
                title = seoApi.title;
            }
            _this.titleService.setTitle(title);
            if (_this.currentMetaTags && _this.currentMetaTags.length > 0) {
                _this.currentMetaTags.forEach(function (tag) {
                    _this.metaService.removeTag(tag.type + "=\"" + tag.name + "\"");
                });
                _this.currentMetaTags = [];
            }
            if (seoApi && seoApi.metaTags) {
                _this.currentMetaTags = seoApi.metaTags.slice();
                seoApi.metaTags.forEach(function (tag) {
                    // tag.type can be whatever user inputs in BO, so better to narrow the use case
                    switch (tag.type) {
                        case 'property':
                            _this.metaService.addTag({ property: tag.name, content: tag.content });
                            break;
                        case 'name':
                            _this.metaService.addTag(tag);
                            break;
                    }
                });
            }
        });
    };
    SeoService.prototype.updateHreflangs = function () {
        var _this = this;
        var blacklist = [
            /scratch-card\//,
            /support\//,
            /casino\//,
            /automaten\//,
            /live-casino\//,
            /info\//,
        ];
        var existingCanonicalLink = this.platformService.document.querySelector("link[rel='canonical']");
        var existingAlternateLinks = this.platformService.document.querySelectorAll("link[rel='alternate']");
        var pathName = this.platformService.document.location.pathname;
        var pathNameNoLang = pathName.substring(pathName.indexOf('/', 1));
        if (blacklist.find(function (value) { return value.test(pathName); })) {
            return;
        }
        if (existingCanonicalLink) {
            this.renderer.removeChild(this.platformService.document.head, existingCanonicalLink);
        }
        if (existingAlternateLinks) {
            existingAlternateLinks.forEach(function (element) {
                _this.renderer.removeChild(_this.platformService.document.head, element);
            });
        }
        this.languageService.locales$.subscribe(function (languages) {
            languages.map(function (language, index) {
                var link = _this.renderer.createElement('link');
                // The first language in the list is considered as default for cases when no language is specified in the url
                if (index === 0) {
                    link.setAttribute('hreflang', 'x-default');
                }
                else {
                    link.setAttribute('hreflang', language.code);
                }
                link.setAttribute('rel', 'alternate');
                link.setAttribute('href', _this.platformService.document.location.origin + "/" + language.code + pathNameNoLang);
                _this.renderer.appendChild(_this.platformService.document.head, link);
            });
            _this.languageService.locale$.subscribe(function (locale) {
                var linkCanonical = _this.renderer.createElement('link');
                linkCanonical.setAttribute('rel', 'canonical');
                linkCanonical.setAttribute('href', _this.platformService.document.location.origin + "/" + locale.code + pathNameNoLang);
                _this.renderer.appendChild(_this.platformService.document.head, linkCanonical);
            });
        });
    };
    SeoService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SeoService_Factory() { return new SeoService(i0.ɵɵinject(i1.Apollo), i0.ɵɵinject(i2.RouteService), i0.ɵɵinject(i3.Title), i0.ɵɵinject(i3.Meta), i0.ɵɵinject(i4.APP_CONFIG), i0.ɵɵinject(i0.RendererFactory2), i0.ɵɵinject(i5.PlatformService), i0.ɵɵinject(i6.LanguageService)); }, token: SeoService, providedIn: "root" });
    return SeoService;
}());
export { SeoService };
