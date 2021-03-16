import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface IAppEvent {
  type: string;
  payload: any;
}

export enum ModalEvents {
  termsModalOpen = 'on-terms-modal-open',
  termsModalClose = 'on-terms-modal-close',
  depositModalClose = 'on-deposit-modal-close',
}

/**
 * TODO: this global event manager was created in haste finish it of when there will be some time.
 */
@Injectable({
  providedIn: 'root',
})
export class EventManagerService {
  private eventEmitter = new EventEmitter<IAppEvent>();

  public on(type: string): Observable<any> {
    return this.eventEmitter.pipe(
      filter((event: IAppEvent) => event.type === type),
    );
  }

  public emit(type: string, payload: any = null) {
    this.eventEmitter.emit({ type, payload });
  }
}
