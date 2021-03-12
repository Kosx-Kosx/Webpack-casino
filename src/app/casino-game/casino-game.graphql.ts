import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { Jurisdiction } from 'app/core/jurisdiction.type';

export interface Game {
  name: string;
  slug: string;
  vendor: string;
  vendorProperties: { [property: string]: string | number | object | boolean } | null;
  jurisdiction: Jurisdiction;
  width: number;
  height: number;
  loginRequired: boolean;
  mobile: boolean;
  enabled: boolean;
  maxBet: number;
  minBet: number;
  currency: string;
  /** Equals to `${vendor}-${slug}`. Used in DESH RC. */
  id?: string;
}

export interface CasinoGameResponse {
  game: Game;
}

export const casinoGameQuery: DocumentNode = gql`
  query CasinoGame($slug: String!, $returnUrl: String!) {
    game(vendor_slug: $slug) {
      name
      slug
      vendor
      vendorProperties(return_url: $returnUrl)
      jurisdiction
      width
      height
      mobile
      loginRequired
      enabled
      maxBet
      minBet
      currency
    }
  }
`;
