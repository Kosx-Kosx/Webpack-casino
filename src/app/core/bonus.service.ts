import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Bonus } from './bonus.model';

@Injectable({ providedIn: 'root' })
export class BonusService {

  public bonusCancelled$ = new Subject();

  private storedBonus: Bonus;

  constructor(private http: HttpClient) { }

  public storeBonus(bonus: Bonus) {
    this.storedBonus = bonus;
  }

  public useStoredBonus(): Bonus {
    const bonus = this.storedBonus || null;
    this.storedBonus = null;
    return bonus;
  }

  public getAvailable() {
    return this.http.get<{ bonuses: Bonus[] }>(`{{apiEndpoint}}/bonuses`).pipe(
      map(data => data.bonuses),
    );
  }

  public getAvailableForDeposit() {
    return this.http.get<{ bonuses: Bonus[] }>(`{{apiEndpoint}}/bonuses?deposit`).pipe(
      map(data => data.bonuses),
    );
  }

  public getActive() {
    return this.http.get<{ bonuses: Bonus[] }>(`{{apiEndpoint}}/bonuses?active`).pipe(
      map(data => data.bonuses),
    );
  }

  public getClaimed() {
    return this.http.get<{ bonuses: Bonus[] }>(`{{apiEndpoint}}/bonuses?claimed`).pipe(
      map(data => data.bonuses),
    );
  }

  public claimVoucher(code: string) {
    return this.http.post<{ success: boolean }>(`{{apiEndpoint}}/use-voucher`, { code }).pipe(
      map(data => {
        if (!data.success) {
          throw data;
        }
        return data;
      }),
    );
  }

  public cancel(bonus: Bonus) {
    return this.http.delete(`{{apiEndpoint}}/bonuses/${bonus.id}`)
      .pipe(tap(() => this.bonusCancelled$.next()));
  }
}
