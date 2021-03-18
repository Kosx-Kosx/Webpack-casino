import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { IGameThumb } from 'app/core/game.interface';
import { gameThumbFragment } from 'app/game-shared/game-thumb/game-thumb.graphql';
import { IPromoSpaceDTO } from 'app/media-box/promo-space-dto';
import { promotionFragment } from 'app/media-box/promotions.graphql';

export interface Block {
  type: string;
  col: number;
  row: number;
  sizeX: number;
  sizeY: number;
  game: IGameThumb;
  promotions: IPromoSpaceDTO[];
}

export const fragment: DocumentNode = gql`
  fragment Block on LobbyCategoryLayoutBlock {
    type
    col
    row
    sizeX
    sizeY
    game {
      ...GameThumb
    }
    promotions {
      ...PromotionFragment
    }
  }

  ${gameThumbFragment}
  ${promotionFragment}
`;
