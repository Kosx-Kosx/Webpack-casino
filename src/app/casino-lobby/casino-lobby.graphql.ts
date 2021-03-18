import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragment as CategoryFragment, Category } from './category/category.graphql';

export interface QueryVariables {
  after?: string;
  categorySlug?: string;
  first?: number;
  groups?: string;
  playerState?: 'li' | 'lo';
  slug?: string;
  country?: string; // ICountry.code
}

export interface QueryResponse {
  lobby: {
    categoryConnection: {
      edges: Array<{
        node: Category;
      }>,
    };
  };
}

export const casinoLobbyQuery: DocumentNode = gql`
  query CasinoLobby($slug: String!, $categorySlug: String, $first: Int, $after: String, $playerState: String, $groups: String) {
    lobby(slug: $slug, playerState: $playerState, groups: $groups) {
      categoryConnection(slug: $categorySlug) {
        edges {
          node {
            ...Category
          }
        }
      }
    }
  }

  ${CategoryFragment}
`;
