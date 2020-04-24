import template from './app.html';
import { UpRadioPeer, IUpRadioPeer, UpRadioPeerId, UpRadioPeerState, UpRadioPeerService } from './UpRadioPeer';
import ConnectComponent from './components/Connect/Connect.component';
import { MediaConnection } from 'peerjs';
import { LocalStreamComponent } from './components/Streams/LocalStream.component';
import { RemoteStreamComponent } from './components/Streams/RemoteStream.component';
import { ModeSwitchComponent, UpRadioMode } from './components/ModeSwitch/ModeSwitch.component';
import BroadcastComponent from './components/Broadcast/Broadcast.component';

export class App {
  public root: HTMLElement;
  public peer: IUpRadioPeer;
  public modeSwitch: ModeSwitchComponent;
  public localStream: LocalStreamComponent;
  public remoteStream: RemoteStreamComponent;
  public connectComponent: ConnectComponent;
  public broadcastComponent: BroadcastComponent;

  constructor(root: HTMLElement) {
    this.root = root;
    this.root.innerHTML = template;
    this.peer = new UpRadioPeer();
    this.peer.init();
    

    this.root.querySelector('#PeerId').innerHTML += this.peer.peer.id;

    this.modeSwitch = new ModeSwitchComponent(this.root);
    this.root.addEventListener('UpRadio:MODE_SWITCH', this.onModeChange.bind(this));
    this.mode = UpRadioMode.LISTEN;

    
    this.connectComponent = new ConnectComponent(this.root);
    this.connectComponent.connectBtn.onclick = () => {
      console.log('Connecting to ' + this.connectComponent.input.value);
      this.connect(this.connectComponent.input.value);
    }
    this.connectComponent.disconnectBtn.onclick = () => {
      console.log('Disconnecting');
      this.disconnect();
    }
    this.remoteStream = new RemoteStreamComponent(this.root);
    
    this.localStream = new LocalStreamComponent(this.root);
    this.broadcastComponent = new BroadcastComponent(this.root);
    this.broadcastComponent.broadcastBtn.onclick = () => {
      console.log('Broadcasting...');
      this.broadcast();
    };
    this.broadcastComponent.stopBroadcastingBtn.onclick = () => {
      console.log('Ending broadcast...');
      this.stopBroadcast();
    };

    this.localStream.hide();
    this.broadcastComponent.hide();

    console.log(this);
  }

  public onModeChange(e: CustomEvent) {
    const newMode: UpRadioMode = e.detail;

    if (newMode === UpRadioMode.LISTEN) {
      this.broadcastComponent.hide();
      this.localStream.hide();
      this.remoteStream.show();
      this.connectComponent.show();
    } else if (newMode === UpRadioMode.BROADCAST) {
      this.broadcastComponent.show();
      this.localStream.show();
      this.connectComponent.hide();
      this.remoteStream.hide();
    }
  }

  public get mode(): UpRadioMode {
    return this.modeSwitch.value;
  }
  public set mode(mode: UpRadioMode) {
    this.modeSwitch.value = mode;
  }

  public async connect(peerId: UpRadioPeerId): Promise<void> {
    this.peer.status = UpRadioPeerState.RELAY;
    const connection: MediaConnection = this.peer.call(peerId, new MediaStream());
    connection.on('stream', (stream: MediaStream) => {
      this.remoteStream.start(stream);
    });
    this.peer.on('call', (call: MediaConnection) => {
      UpRadioPeerService.initMediaConnection(this.peer, call);
      call.answer(this.remoteStream.stream);
    });
  }
  
  public async disconnect(): Promise<void> {
    UpRadioPeerService.closeMediaConnections(this.peer);
    await this.remoteStream.stop();
    this.peer.status = UpRadioPeerState.OFF_AIR;
    this.peer.off('call', (call: MediaConnection) => {
      UpRadioPeerService.initMediaConnection(this.peer, call);
      call.answer(this.remoteStream.stream);
    });
  }

  public async stopBroadcast(): Promise<void> {
    UpRadioPeerService.closeMediaConnections(this.peer);
    await this.localStream.stop();
    this.peer.status = UpRadioPeerState.OFF_AIR;
    this.peer.off('call', (call: MediaConnection) => {
      UpRadioPeerService.initMediaConnection(this.peer, call);
      call.answer(this.localStream.stream);
    });
  }

  public async broadcast(): Promise<void> {
    await this.localStream.start();
    this.peer.status = UpRadioPeerState.ON_AIR;
    this.peer.on('call', (call: MediaConnection) => {
      UpRadioPeerService.initMediaConnection(this.peer, call);
      call.answer(this.localStream.stream);
    });
  }
}

interface UpRadioAppWindow extends Window {
  app: App;
}

interface IUpRadioAppState {
  peerId: UpRadioPeerId;
  peerStatus: UpRadioPeerState;
  mode: UpRadioMode;
}

export class UpRadioAppState implements IUpRadioAppState {
  private w: UpRadioAppWindow;
  public namespace = 'UpRadioAppState';

  constructor(w: Window, app: App) {
    this.w = Object.assign(w, { app });
    this.w.app = app;

    this.reload();

    const interval = setInterval(() => {
      this.udpate();
    }, 3000);
  }

  public get peerId(): UpRadioPeerId {
    return this.w.app.peer.id;
  }
  public set peerId(id: UpRadioPeerId) {
    this.w.app.peer.id = id;
  }
  
  public get peerStatus(): UpRadioPeerState {
    return this.w.app.peer.status;
  }
  public set peerStatus(state: UpRadioPeerState) {
    this.w.app.peer.status = state;
  }
  
  public get mode(): UpRadioMode {
    return this.w.app.mode;
  }
  public set mode(mode: UpRadioMode) {
    this.w.app.mode = mode;
  }

  toJSON() {
    return {
      peerId: this.peerId,
      peerStatus: this.peerStatus,
      mode: this.mode
    };
  }
  udpate() {
    this.w.sessionStorage.setItem(this.namespace, JSON.stringify(this));
  }
  reload() {
    try {
      const savedState = JSON.parse(this.w.sessionStorage.getItem(this.namespace));
      this.peerId = savedState.peerId;
      this.peerStatus = savedState.peerStatus;
      this.mode = savedState.mode;
    } catch (_) { }
  }
}