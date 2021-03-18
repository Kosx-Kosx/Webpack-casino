import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export interface FooterQueryResponse {
  footers: {
    footers: Array<{
      content: string,
      dynamicCuracaoSeal: boolean,
    }>,
  };
}

export const footerQuery: DocumentNode = gql`
  query Footers {
    footers {
      footers {
        content
        dynamicCuracaoSeal
      }
    }
  }
`;
