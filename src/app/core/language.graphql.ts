import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export interface Language {
  code: string;
  text: string;
  currency: string;

  /**
   * Indicates whether given language is currently active.
   * To be set separately after data is retrieved, hence optional.
   */
  current?: boolean;
}

export interface QueryResponse {
  languages: {
    edges: [{
      node: Language;
    }];
  };
}

export const languageQuery: DocumentNode = gql`
  query Languages {
    languages {
      edges {
        node {
          code
          text
          currency
        }
      }
    }
  }
`;
