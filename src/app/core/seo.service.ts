import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { AppConfig, APP_CONFIG } from 'app/core/app.config';
import { PlatformService } from 'app/core/platform.service';
import { defer, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { LanguageService } from './language.service';
import { RouteService } from './route.service';
import { seoQuery, SeoQueryResponse } from './seo.graphql';

@Injectable({ providedIn: 'root' })
export class SeoService {
  currentMetaTags: MetaDefinition[];

  private renderer: Renderer2;

  apiData$ = defer(() => this.routeService.url$)
    .pipe(
      switchMap(url => this.apollo.use('get').query<SeoQueryResponse>({ query: seoQuery, variables: { url } })),
      map(({ data }) => data.seo),
    );

  constructor(
    private apollo: Apollo,
    private routeService: RouteService,
    private titleService: Title,
    private metaService: Meta,
    @Inject(APP_CONFIG) private config: AppConfig,
    rendererFactory: RendererFactory2,
    private platformService: PlatformService,
    private languageService: LanguageService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initialize() {
    this.routeService.primaryOutletData$.subscribe(() => {
      this.updateHreflangs();
    });

    combineLatest([
      this.routeService.primaryOutletData$,
      this.apiData$,
    ])
      .subscribe(([seoRouter, seoApi]) => {
        /*  Preferred title order:
            1. Title set in BO
            2. Title set in routing data with optional brand name suffix
            3. Brand name
        */
        let title = this.config.title.brandName;
        if (seoRouter && seoRouter.title) {
          const suffixedTitle = [seoRouter.title, this.config.title.brandName].join(this.config.title.separator);
          // Add suffix if we're under 55 chars - See https://moz.com/learn/seo/title-tag
          title = suffixedTitle.length <= 55 ? suffixedTitle : seoRouter.title;
        }
        if (seoApi && seoApi.title) {
          title = seoApi.title;
        }
        this.titleService.setTitle(title);

        if (this.currentMetaTags && this.currentMetaTags.length > 0) {
          this.currentMetaTags.forEach(tag => {
              this.metaService.removeTag(`${tag.type}="${tag.name}"`);
          });
          this.currentMetaTags = [];
        }

        if (seoApi && seoApi.metaTags) {
          this.currentMetaTags = [...seoApi.metaTags];
          seoApi.metaTags.forEach(tag => {

            // tag.type can be whatever user inputs in BO, so better to narrow the use case
            switch (tag.type) {
              case 'property':
                this.metaService.addTag({property: tag.name , content: tag.content});
                break;
              case 'name':
                this.metaService.addTag(tag);
                break;
            }
          });
        }
      });
  }

  private updateHreflangs() {
    const blacklist = [
      /scratch-card\//,
      /support\//,
      /casino\//,
      /automaten\//,
      /live-casino\//,
      /info\//,
    ];

    const existingCanonicalLink = this.platformService.document.querySelector(`link[rel='canonical']`);
    const existingAlternateLinks = this.platformService.document.querySelectorAll(`link[rel='alternate']`);
    const pathName = this.platformService.document.location.pathname;
    const pathNameNoLang = pathName.substring(pathName.indexOf('/', 1));

    if (blacklist.find(value => value.test(pathName))) {
      return;
    }

    if (existingCanonicalLink) {
      this.renderer.removeChild(this.platformService.document.head, existingCanonicalLink);
    }

    if (existingAlternateLinks) {
      existingAlternateLinks.forEach(element => {
        this.renderer.removeChild(this.platformService.document.head, element);
      });
    }

    this.languageService.locales$.subscribe(languages => {
      languages.map((language, index) => {
        const link: HTMLLinkElement = this.renderer.createElement('link');

        // The first language in the list is considered as default for cases when no language is specified in the url
        if (index === 0) {
          link.setAttribute('hreflang', 'x-default');
        } else {
          link.setAttribute('hreflang', language.code);
        }
        link.setAttribute('rel', 'alternate');
        link.setAttribute('href', `${this.platformService.document.location.origin}/${language.code}${pathNameNoLang}`);
        this.renderer.appendChild(this.platformService.document.head, link);
      });

      this.languageService.locale$.subscribe(locale => {
        const linkCanonical: HTMLLinkElement = this.renderer.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        linkCanonical.setAttribute('href', `${this.platformService.document.location.origin}/${locale.code}${pathNameNoLang}`);
        this.renderer.appendChild(this.platformService.document.head, linkCanonical);
      });
    });
  }

}
