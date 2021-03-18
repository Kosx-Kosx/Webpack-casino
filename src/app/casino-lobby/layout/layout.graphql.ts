import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragment as BlockFragment, Block } from '../block/block.graphql';

export interface Layout {
  blockMargin: number;
  blocks: Block[];
}

export const fragment: DocumentNode = gql`
  fragment Layout on LobbyCategoryLayout {
    blockMargin
    blocks {
      ...Block
    }
  }

  ${BlockFragment}
`;
