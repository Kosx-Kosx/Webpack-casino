import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

export interface FeatureStatusResponse {
  payment_maintenance_mode: boolean;
}

@Injectable({ providedIn: 'root' })
export class FeatureStatusService {

  private currentFeatureStatus$ = this.http.get<FeatureStatusResponse>(`{{apiEndpoint}}/service-status`).pipe(
    shareReplay(1),
  );

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Use to check if deposits and withdrawals should be blocked on the website.
   *
   * Meant to be downloaded only once from the server, so will get the status of first request on demand,
   * and then will just replay it for any other place until site is closed / refreshed.
   *
   * @returns {Observable<boolean>} Observable that emits boolean. If it emits true, do not let user create any transaction.
   */
  public getPaymentMaintenanceModeStatus(): Observable<boolean> {
    return this.currentFeatureStatus$.pipe(
      map(v => v.payment_maintenance_mode),
    );
  }
}
