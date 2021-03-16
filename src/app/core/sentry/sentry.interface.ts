export enum SentryGeneralFingerprint {
  APP_INITIALIZATION = 'app_initialization',
  ASSET_MISSING = 'asset_missing',
  CONNECTION_FAILED_3RDPARTY = 'no_connection_3rdparty',
  EXPRESSION_CHANGED = 'expression_changed',
  FAPI_CONNECTION_FAILED = 'fapi_connection_failed',
  FAPI_UNAUTHORIZED = 'fapi_unauthorized',
  GAME_VENDOR_PROPERTIES = 'game_vendor_properties',
  GRAPHQL_ERROR = 'graphql_error',
  HTTP_5xx_ERROR = 'http_5xx_error',
  IOVATION_LOADER = 'iovation_loader',
  LOADING_CHUNK_FAILED = 'loading_chunk_failed',
  NS_ERROR_NOT_INITIALIZED = 'NS_ERROR_NOT_INITIALIZED',
  OMARSYS = 'omarsys',
  TIMEOUT = 'http_timeout',
}

export interface SentryURLDetails {
  hash?: string;
  host?: string;
  origin?: string;
  pathname?: string;
  protocol?: string;
  search?: string;
}

export interface SentryGraphQLRequestDetails {
  operationName?: string;
  query?: string;
  variables?: object;
}

export interface SentryResponseExtraData {
  url: string;
  method: string;
  status_code: number;
  status_text: string;
  title: string;
  detail: string;
  response: string;
  gql_operation?: string;
  gql_variables?: object;
  gql_query?: string;
}
