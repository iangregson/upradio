import { UpRadioPeerId, UpRadioPeer } from './UpRadioPeer';
import { DataConnection } from 'peerjs';
import { v4 as uuid } from 'uuid';

export enum UpRadioPeerRPCMessageType {
  ack = 'ack',
  nextPeer = 'nextPeer',
  chat = 'chat'
}

export interface IUpRadioPeerRPCMessage {
  id: string,
  peerId: UpRadioPeerId,
  type: UpRadioPeerRPCMessageType,
  params: any[]
}

export class UpRadioPeerRpcMsg implements IUpRadioPeerRPCMessage {
  public id: string;
  public peerId: UpRadioPeerId;
  public type: UpRadioPeerRPCMessageType;
  public params: any[];

  constructor(peerId: UpRadioPeerId) {
    this.id = uuid();
    this.peerId = peerId;
    this.type = UpRadioPeerRPCMessageType.ack;
    this.params = [];
  }

  toJSON(): IUpRadioPeerRPCMessage {
    return {
      id: this.id,
      peerId: this.peerId,
      type: this.type,
      params: this.params
    };
  }

  ack(msg?: IUpRadioPeerRPCMessage): IUpRadioPeerRPCMessage {
    this.type = UpRadioPeerRPCMessageType.ack;
    if (msg) {
      this.params = [msg.id];
    }
    return this;
  }

  static isAck(msg: IUpRadioPeerRPCMessage) {
    return msg.type === UpRadioPeerRPCMessageType.ack;
  }

  nextPeer(nextPeerId: UpRadioPeerId): IUpRadioPeerRPCMessage {
    this.type = UpRadioPeerRPCMessageType.nextPeer;
    this.params = [nextPeerId];
    return this;
  }
}

export class UpRadioPeerRpcService {
  static parseMessage(data: string): IUpRadioPeerRPCMessage | null {
    if (!data || !data.length) return null;
    try {
      const parsed: IUpRadioPeerRPCMessage = JSON.parse(data);
      if (parsed.id && parsed.type) {
        return parsed;
      } else {
        return null;
      }
    } catch (_) {
      return null;
    }
  }
  static handleMessage(peer: UpRadioPeer, msg: IUpRadioPeerRPCMessage): void {
    peer.events.emit(msg.type, msg.params);
  }
  static nextPeer(peer: UpRadioPeer, connection: DataConnection, nextPeerId: UpRadioPeerId): void {
    const msg = new UpRadioPeerRpcMsg(peer.id).nextPeer(nextPeerId)
    connection.send(msg);
  }
}