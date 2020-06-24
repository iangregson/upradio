import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { v4 as uuid } from 'uuid';
import EventEmitter from 'eventemitter3';
import { UpRadioPeerRpcMsg, UpRadioPeerRpcService } from './UpRadioPeerRpc';
import { App } from '@upradio-client/app';

export const MAX_CONNECTIONS: number = Number(process.env.MAX_CONNECTIONS) || 1;

export type UpRadioPeerId = string;

export enum UpRadioPeerState {
  BROADCAST = 'BROADCAST',
  RELAY = 'RELAY'
}

export interface IUpRadioPeer {
  id: UpRadioPeerId;
  peer: Peer;
  events: EventEmitter;
  dataConnections: Map<UpRadioPeerId, DataConnection>;
  mediaConnections: Map<UpRadioPeerId, MediaConnection>;
  status: UpRadioPeerState;
  maxConnectionsReached: boolean;
  init(): void;
  connect(id: UpRadioPeerId): DataConnection;
  reconnect(): void;
  call(id: UpRadioPeerId, stream: MediaStream): MediaConnection;
  on(event: string, callback: any): void;
  off(event: string, callback: any): void;
}

export class UpRadioPeer implements IUpRadioPeer {
  public id: UpRadioPeerId;
  public peer: Peer;
  public dataConnections: Map<string, DataConnection>;
  public mediaConnections: Map<string, MediaConnection>;
  public status: UpRadioPeerState;
  public events: EventEmitter = new EventEmitter();

  
  constructor(id?: UpRadioPeerId, status?: UpRadioPeerState, debug: number = 3) {
    this.id = id || uuid();
    this.status = status || UpRadioPeerState.BROADCAST;
    this.peer = new Peer(this.id, {
      debug,
      host: process.env.PEER_SERVER,
      port: 443,
      secure: true,
      path: process.env.PEER_PATH,
      key: process.env.PEER_KEY
    });
    this.dataConnections = new Map<string, DataConnection>();
    this.mediaConnections = new Map<string, MediaConnection>();
    return this;
  }

  get maxConnectionsReached(): boolean {
    return this.mediaConnections.size === MAX_CONNECTIONS;
  }
  
  public init(): void {
    UpRadioPeerService.init(this);
  }
  public connect(id: UpRadioPeerId): DataConnection {
    const connection: DataConnection = this.peer.connect(id);
    UpRadioPeerService.initDataConnection(this, connection);
    return connection;
  }
  public reconnect(): void {
    this.peer.reconnect();
  }
  public call(id: UpRadioPeerId, stream: MediaStream): MediaConnection {
    UpRadioPeerService.closeMediaConnections(this);
    const connection = this.peer.call(id, stream);
    UpRadioPeerService.initMediaConnection(this, connection);
    return connection;
  }
  public on(event: string, callback: () => void): void {
    this.peer.on(event, callback);
  }
  public off(event: string, callback: () => void): void {
    this.peer.off(event, callback);
  }
}

export class UpRadioPeerService {
  static init(peer: IUpRadioPeer) {
    peer.on('open', () => {
      // Workaround for peer.reconnect deleting previous id
      if (peer.peer.id === null) {
        peer.peer.id = peer.id;
      }
    });
    
    peer.on('connection', (connection: DataConnection) => {
      UpRadioPeerService.initDataConnection(peer, connection);
    });

    peer.on('disconnected', () => {
      window.logger.log('Connection lost. Please reconnect');
      // Workaround for peer.reconnect deleting previous id
      peer.reconnect();
    });

    peer.on('close', () => {
      peer.dataConnections.clear()
      peer.mediaConnections.clear()
      window.logger.log('Connection destroyed. Please refresh');
    });

    peer.on('error', (err: any) => {
      window.logger.error('UpradioPeerError: ', err);
    });
  }
  static initMediaConnection(peer: UpRadioPeer, connection: MediaConnection): void {
    window.logger.log('MediaConnection with ' + connection.peer);
    
    connection.on('close', () => {
      window.logger.log('MediaConnection closed on peer id ' + connection.peer);
      peer.mediaConnections.delete(connection.peer);
    });
    
    connection.on('error', (err: any) => {
      window.logger.error('MediaConnectionError for peer id ' + connection.peer, err);
    });
    
    peer.mediaConnections.set(connection.peer, connection);
  }
  static initDataConnection(peer: UpRadioPeer, connection: DataConnection): void {
    window.logger.log('DataConnection with ' + connection.peer);
    
    connection.on('close', () => {
      window.logger.log('DataConnection closed on peer id ' + connection.peer);
      peer.dataConnections.delete(connection.peer);
    });
    
    connection.on('error', (err: any) => {
      window.logger.error('DataConnectionError for peer id ' + connection.peer, err);
    });

    connection.on('data', (data: string) => {
      const msg = UpRadioPeerRpcService.parseMessage(data);
      if (!msg) return;

      UpRadioPeerRpcService.handleMessage(peer, msg);
    });
  
    peer.dataConnections.set(connection.peer, connection);
  }
  static closeAllConnections(peer: UpRadioPeer): void {
    for (let entry of peer.dataConnections.entries()) {
      let connection: DataConnection = entry[1];
      connection.close();
    }
    for (let entry of peer.mediaConnections.entries()) {
      let connection: MediaConnection = entry[1];
      connection.close();
    }
    peer.mediaConnections.clear();
    peer.dataConnections.clear();
  }
  static closeMediaConnections(peer: UpRadioPeer): void {
    for (let entry of peer.mediaConnections.entries()) {
      let connection: MediaConnection = entry[1];
      connection.close();
    }
    peer.mediaConnections.clear();
  }
  static closeDataConnections(peer: UpRadioPeer): void {
    for (let entry of peer.dataConnections.entries()) {
      let connection: DataConnection = entry[1];
      connection.close();
    }
    peer.dataConnections.clear();
  }
  static handoffConnection(peer: UpRadioPeer, call: MediaConnection): void {
    const nextPeer = Array.from(peer.mediaConnections.values()).pop();
    if (!nextPeer) {
      throw new Error('Unable to handoff connection: no nextPeer available');
    }
    const connection: DataConnection = peer.connect(call.peer);
    connection.on('open', () => {
      UpRadioPeerRpcService.nextPeer(peer, connection, nextPeer.peer);
      
      connection.on('data', (data: string) => {
        const msg = UpRadioPeerRpcService.parseMessage(data);
        if (!msg) return;
        
        if (UpRadioPeerRpcMsg.isAck(msg)) connection.close();
      });
    });
  }
  static answerCall(app: App, call: MediaConnection): void {
    window.logger.debug('[UpRadioPeerService::answerCall] check existing connections', call);
    if (app.peer.mediaConnections.has(call.peer)) {
      const existingMediaConnection = app.peer.mediaConnections.get(call.peer);
      existingMediaConnection && existingMediaConnection.close();
      
      const existingDataConnection = app.peer.dataConnections.get(call.peer);
      existingDataConnection && existingMediaConnection.close();
      
      app.peer.mediaConnections.delete(call.peer);
      app.peer.dataConnections.delete(call.peer);
      window.logger.debug('[UpRadioPeerService::answerCall] removed existing connections');
    }
    UpRadioPeerService.initMediaConnection(app.peer, call);
    const dataConnection = app.peer.connect(call.peer);
    dataConnection.on('open', () => {
      UpRadioPeerRpcService.setChannelInfo(app.peer, dataConnection, app.channelInfo);
      UpRadioPeerRpcService.setChannelOnAirStatus(app.peer, dataConnection, app.localStream.onAirStatus);
      window.logger.debug('[UpRadioPeerService::answerCall] sent channel info and status');
    });
    window.logger.debug('[UpRadioPeerService::answerCall] initialized new connections. Answering call.');
    
    call.answer(app.localStream.stream);
  }
}
