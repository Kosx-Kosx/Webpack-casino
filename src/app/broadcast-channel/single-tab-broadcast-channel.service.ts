import { Injectable } from '@angular/core';
import { EventEmitter } from 'eventemitter3';
import { Observable, fromEvent } from 'rxjs';

import { IBroadcastChannelService } from './broadcast-channel.service';

@Injectable()
export class SingleTabBroadcastChannelService implements IBroadcastChannelService {
  public isMaster = true;
  public onUpgradeToLeader = Promise.resolve(null);

  private em = new EventEmitter();

  public on<T = any>(type: string): Observable<T> {
    return fromEvent<T>(this.em, type);
  }

  public emit<T = any>(type: string, payload: T): void {
    this.em.emit(type, payload);
  }

  public close(): void {
    this.em.removeAllListeners();
  }
}
