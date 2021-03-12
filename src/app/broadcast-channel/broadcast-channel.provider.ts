import { Injectable } from '@angular/core';
import BroadcastChannel from 'broadcast-channel';

@Injectable({
  providedIn: 'root',
})
export class BroadcastChannelProvider {
  private channels: BroadcastChannel[] = [];

  get<T = any>(channelName: string): BroadcastChannel<T> {
    let channel = this.channels.find((item) => item.name === channelName);

    if (!channel) {
      channel = new BroadcastChannel(channelName);
      this.channels.push(channel);
    }

    return channel;
  }
}
