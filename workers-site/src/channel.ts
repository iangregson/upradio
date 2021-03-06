import { UpRadioPeerId } from "./api";
import { UpRadioKvStore } from './kvstore';

export type UpRadioChannelName = string;

export class UpRadioChannelService {
  static async verify(channelName: UpRadioChannelName, peerId: UpRadioPeerId): Promise<boolean> {
    // If channel doesn't exist, give it to peerId
    let channelOwner: UpRadioPeerId | null = await UpRadioKvStore.get(channelName);

    if (!channelOwner) {
      channelOwner = peerId;
      await UpRadioKvStore.put(channelName, channelOwner);
      return true;
    }

    // If channel exists, its owner must be the given peerId
    return channelOwner === peerId;
  }
  static async resolve(channelName: UpRadioChannelName): Promise<UpRadioPeerId | null> {
    return UpRadioKvStore.get(channelName);
  }
}