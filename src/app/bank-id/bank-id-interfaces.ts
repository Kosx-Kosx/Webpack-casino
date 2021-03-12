/**
 * Interface for the bankid identification response received via push notification
 */
export interface BankIdIdentificationMessage {
  /**
   * Shows if user is a registered player in our casino or not.
   */
  user_exists: boolean;
  ident_id: string;
  status: BankIdMessageStatus;
  url: string;
  result: BankIdIdentificationUserData;
  token: string;
  identified: boolean;
  error_message: string;
}

/**
 * Interface for the identified person. This data is part of the BankIdIdentificationMessage.
 */
export interface BankIdIdentificationUserData {
  first_name: string;
  last_name: string;
  gender: 'MALE' | 'FEMALE';
  street: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
}

export enum BankIdMessageStatus {
  PENDING = '2',
  FAILED = '3',
  SUCCESS = '4',
}

/**
 * Simplified interface for the identified user that can be used to fill the registration fields
 */
export interface BankIdUserData {
  first_name: string;
  last_name: string;
  gender: string;
  mobile_number: string;
  postcode: string;
  city: string;
  address: string;
}

/**
 * Simplified interface for BankIdIdentificationMessage containing only the required informations
 */
export interface BankIdMessage {
  user_exists: boolean;
  token: string;
  status: BankIdMessageStatus;
  url: string;
  error_message: string;
}
