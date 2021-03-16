import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { Country } from 'app/core/country.model';

export interface QueryResponse {
  countries: {
    edges: [{
      node: Country;
    }];
  };
}

export const countriesQuery: DocumentNode = gql`
  query Countries {
    countries {
      edges {
        node {
          code
          name
          dialCode
          currency
          minimumAge
          enabled
          examplePhone
          states {
            code
            name
          }
        }
      }
    }
  }
`;
