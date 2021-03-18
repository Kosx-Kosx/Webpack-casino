import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const gameDetailQuery: DocumentNode = gql`
  query GameDetails($id: ID) {
    game(id: $id) {
      id
      slug
      name
      vendor
      vendorName
      enabled
      loginRequired
      description
      thumbnails
    }
  }
`;
