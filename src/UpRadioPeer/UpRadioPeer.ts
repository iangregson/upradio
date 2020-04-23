import Peer, { DataConnection } from 'peerjs';
import { v4 as uuid } from 'uuid';
import ConnectComponent from '../components/Connect/Connect.component';

export interface IUpRadioPeer {
  id: string;
  peer: Peer;
  connections: Map<string, DataConnection>;
  init(): void;
  connect(id: string): void;
  broadcast(stream: MediaStream): void;
}

export class UpRadioPeer {
  public id: string;
  public peer: Peer;
  public connections: Map<string, DataConnection>;

  
  constructor() {
    this.id = uuid();
    this.connections = new Map<string, DataConnection>();
    this.peer = new Peer(this.id, { debug: 2 });
    return this;
  }
  
  init(): void {
    // When peerjs instance connects to peerjs server
    this.peer.on('open', (id: string) => {
      // Workaround for peer.reconnect deleting previous id
      if (this.peer.id === null) {
          console.log('Received null id from peer open');
          this.peer.id = this.id;
      }
      console.log('Connected to peerjs server');
    });

    this.peer.on('connection', (connection: DataConnection) => {
      console.log('Connected with ' + connection.peer);
      connection.on('data', (data: any) => {
        console.log('Data recieved', data);
      });
      connection.on('close', () => {
        console.log('Connection with ' + connection.peer + 'was closed.');
        this.connections.delete(connection.peer);
      });
      this.connections.set(connection.peer, connection);
    });
  
    this.peer.on('disconnected', () => {
      console.log('Connection lost. Please reconnect');
      // Workaround for peer.reconnect deleting previous id
      this.peer.reconnect();
    });
    this.peer.on('close', () => {
      this.connections.clear()
      console.log('Connection destroyed. Please refresh');
    });
    this.peer.on('error', (err: any) => {
        console.error(err);
    });
  }
  connect(id: string): void {
    const connection: DataConnection = this.peer.connect(id);
    this.connections.set(connection.peer, connection);
  }
  broadcast(stream: MediaStream): void {
    const peerIds = Array.from(this.connections.keys());
    for (let id of peerIds) {
      console.log('Calling', id)
      this.peer.call(id, stream);
    }
  }
}
