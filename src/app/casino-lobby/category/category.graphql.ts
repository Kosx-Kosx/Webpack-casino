import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragment as LayoutFragment, Layout } from '../layout/layout.graphql';

export interface Category {
  slug: string;
  name: string;
  layoutConnection: {
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    },
    edges: Array<{
      node: Layout;
    }>;
  };
}

export const fragment: DocumentNode = gql`
  fragment Category on LobbyCategory {
    slug
    name
    layoutConnection(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...Layout
        }
      }
    }
  }

  ${LayoutFragment}
`;
