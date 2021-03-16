import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export interface SeoEntry {
  title: string;
  links: Array<{
    rel: string;
    href: string;
  }>;
  metaTags: Array<{
    name: string;
    content: string;
    type: string;
  }>;
}

export interface SeoQueryResponse {
  seo: SeoEntry;
}

export const seoQuery: DocumentNode = gql`
  query Seo($url: String!) {
    seo(url: $url) {
      title
      links {
        rel
        href
      }
      metaTags {
        name
        content
        type
      }
    }
  }
`;
