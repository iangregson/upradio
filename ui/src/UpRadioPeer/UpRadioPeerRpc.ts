import { UpRadioPeerId, UpRadioPeer } from './UpRadioPeer';
import { DataConnection } from 'peerjs';
import { v4 as uuid } from 'uuid';
import { UpRadioChannelInfo } from '@upradio-client/components/Channel/ChannelInfo.component';
import { UpRadioOnAirStatus } from '@upradio-client/components/Channel/ChannelEdit.component';

export enum UpRadioPeerRPCMessageType {
  ack = 'ack',
  nextPeer = 'nextPeer',
  setChannelInfo = 'setChannelInfo',
  setChannelOnAirStatus = 'setChannelOnAirStatus',
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
  
  setChannelInfo(channelInfo: UpRadioChannelInfo): IUpRadioPeerRPCMessage {
    this.type = UpRadioPeerRPCMessageType.setChannelInfo;
    this.params = [channelInfo];
    return this;
  }

  setChannelOnAirStatus(status: UpRadioOnAirStatus): IUpRadioPeerRPCMessage {
    this.type = UpRadioPeerRPCMessageType.setChannelOnAirStatus;
    this.params = [status];
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
    window.logger.debug(`RPC::receive::${msg.type}`, msg);
    peer.events.emit(msg.type, msg.params);
  }
  static nextPeer(peer: UpRadioPeer, connection: DataConnection, nextPeerId: UpRadioPeerId): void {
    const msg = new UpRadioPeerRpcMsg(peer.id).nextPeer(nextPeerId);
    connection.send(JSON.stringify(msg));
  }
  static setChannelInfo(peer: UpRadioPeer, connection: DataConnection, channelInfo: UpRadioChannelInfo): void {
    const msg = new UpRadioPeerRpcMsg(peer.id).setChannelInfo(channelInfo);
    window.logger.debug('RPC::send::setChannelInfo', channelInfo);
    connection.send(JSON.stringify(msg));
  }
  static setChannelOnAirStatus(peer: UpRadioPeer, connection: DataConnection, status: UpRadioOnAirStatus): void {
    const msg = new UpRadioPeerRpcMsg(peer.id).setChannelOnAirStatus(status);
    window.logger.debug('RPC::send::setChannelOnAirStatus', status);
    connection.send(JSON.stringify(msg));
  }
}