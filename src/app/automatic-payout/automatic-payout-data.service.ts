import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/** Fields needed to setup Automatic Payout feature */
export interface AutomaticPayoutRequest {
  /** Whether the feature is currently enabled for given user. By design, user can toggle it at will. */
  status: boolean;
  /** Amount of won money (in user's currency) that will cause Automatic Payout feature to kick in. */
  threshold: number;
}

/** Fields returned when current settings are retrieved. Contains everything in AutomaticPayoutRequest and adds extra fields. */
export interface AutomaticPayoutResponse extends AutomaticPayoutRequest {
  id: number;
  /** This will only be false if, for any reason, the settings were not saved correctly despite the overall call being ok. */
  stored: boolean;
  /** What is the max value that user is able to input as threshold */
  max_threshold: number;
}

/**
 * Implements functionality specified in XCB-399
 */
@Injectable()
export class AutomaticPayoutDataService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Fetches current automatic payout settings for current user.
   *
   * Users who never set it will have default ones returned, whatever is the current default on the server.
   *
   * @returns {Observable<AutomaticPayoutResponse>} an observable that emits requested settings
   */
  public getCurrentSettings(): Observable<AutomaticPayoutResponse> {
    return this.http.get<AutomaticPayoutResponse>(`{{apiEndpoint}}/auto-withdrawal-settings`);
  }

  /**
   * Updates current automatic payout settings for current user.
   *
   * Even if the status is disabled, we're sending the current threshold so user wouldn't have to set it again
   * if he/she decides to turn it back on after disabling.
   *
   * @param status whether user wants this feature to be enabled or not
   * @param threshold current threshold value set by user
   * @returns {Observable<AutomaticPayoutResponse>} an observable that emits current settings after update
   */
  public saveNewSettings(status: boolean, threshold: number): Observable<AutomaticPayoutResponse> {
    return this.http.post<AutomaticPayoutResponse>(`{{apiEndpoint}}/auto-withdrawal-settings`, {
      status,
      threshold,
    });
  }
}
