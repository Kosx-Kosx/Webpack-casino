import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export interface IUserAchievement {
  achievement: {
    name: string;
  };
  progressPercentage: number;
  /**
   * Specifies to whom does that achievement belong important while relogin to different account
   */
  user: string;
}

export interface IAchievementProgressResponse {
  achievementChains: {
    edges: [
      {
        node: {
          enabled: boolean;
          userAchievementConnection: {
            edges: [
              {
                node: {
                  achievement: {
                    name: string;
                  };
                  progressPercentage: number;
                },
              }
            ],
          },
        },
      }
    ],
  };
}

export interface IAchievementLevelsResponse {
  achievementChains: {
    edges: [
      {
        node: {
          achievements: {
            edges: [
              {
                node: {
                  name: string;
                },
              }
            ],
          },
        },
      }
    ],
  };
}

export const achievementProgressQuery: DocumentNode = gql`
  query userAchievementsQuery($name: String) {
    achievementChains(name: $name) {
      edges {
        node {
          enabled
          userAchievementConnection(last: 1) {
            edges {
              node {
                achievement {
                  name
                }
                progressPercentage
              }
            }
          }
        }
      }
    }
  }
`;

export const achievementLevelsQuery: DocumentNode = gql`
  query achievementLevelsQuery($name: String) {
    achievementChains(name: $name) {
      edges {
        node {
          achievements: achievementConnection {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;
