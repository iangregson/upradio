import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { v4 as uuid } from 'uuid';



export type UpRadioPeerId = string;

export enum UpRadioPeerState {
  OFF_AIR = 'OFF_AIR',
  ON_AIR = 'ON_AIR',
  RELAY = 'RELAY'
}

export interface IUpRadioPeer {
  id: UpRadioPeerId;
  peer: Peer;
  dataConnections: Map<UpRadioPeerId, DataConnection>;
  mediaConnections: Map<UpRadioPeerId, MediaConnection>;
  status: UpRadioPeerState;
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

  
  constructor(id?: UpRadioPeerId, status?: UpRadioPeerState, debug: number = 3) {
    this.id = id || uuid();
    this.status = status || UpRadioPeerState.OFF_AIR;
    
    this.peer = new Peer(this.id, {
      debug,
      host: 'upradio.herokuapp.com',
      port: 8090,
      path: '/peer-server',
      key: '6f833b93aaba'
    });
    this.dataConnections = new Map<string, DataConnection>();
    this.mediaConnections = new Map<string, MediaConnection>();
    return this;
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
    peer.on('open', (id: UpRadioPeerId) => {
      // Workaround for peer.reconnect deleting previous id
      if (peer.peer.id === null) {
        peer.peer.id = peer.id;
      }
    });
    
    peer.on('connection', (connection: DataConnection) => {
      UpRadioPeerService.initDataConnection(peer, connection);
    });

    peer.on('disconnected', () => {
      console.log('Connection lost. Please reconnect');
      // Workaround for peer.reconnect deleting previous id
      peer.reconnect();
    });

    peer.on('close', () => {
      peer.dataConnections.clear()
      peer.mediaConnections.clear()
      console.log('Connection destroyed. Please refresh');
    });

    peer.on('error', (err: any) => {
      console.error('UpradioPeerError: ', err);
    });
  }
  static initMediaConnection(peer: UpRadioPeer, connection: MediaConnection): void {
    console.log('MediaConnection with ' + connection.peer);
    
    connection.on('close', () => {
      console.log('MediaConnection closed on peer id ' + connection.peer);
      peer.mediaConnections.delete(connection.peer);
    });
    
    connection.on('error', (err: any) => {
      console.error('MediaConnectionError for peer id ' + connection.peer, err);
    });
    
    peer.mediaConnections.set(connection.peer, connection);
  }
  static initDataConnection(peer: UpRadioPeer, connection: DataConnection): void {
    console.log('DataConnection with ' + connection.peer);
    
    connection.on('close', () => {
      console.log('DataConnection closed on peer id ' + connection.peer);
      peer.dataConnections.delete(connection.peer);
    });
    
    connection.on('error', (err: any) => {
      console.error('DataConnectionError for peer id ' + connection.peer, err);
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
  }
  static closeMediaConnections(peer: UpRadioPeer): void {
    for (let entry of peer.mediaConnections.entries()) {
      let connection: MediaConnection = entry[1];
      connection.close();
    }
  }
  static closeDataConnections(peer: UpRadioPeer): void {
    for (let entry of peer.dataConnections.entries()) {
      let connection: DataConnection = entry[1];
      connection.close();
    }
  }
}