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

  constructor(root: HTMLElement, options?: IUpRadioAppState) {
    this.root = root;
    this.root.innerHTML = template;
    this.peer = new UpRadioPeer(options.peerId, options.peerStatus);
    this.peer.init();
    

    this.root.querySelector('#PeerId').innerHTML += this.peer.peer.id;

    this.modeSwitch = new ModeSwitchComponent(this.root);
    this.root.addEventListener('UpRadio:MODE_SWITCH', this.onModeChange.bind(this));
    this.mode = options.mode || UpRadioMode.LISTEN;

    
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

    if (this.mode === UpRadioMode.LISTEN) {
      this.localStream.hide();
      this.broadcastComponent.hide();
    } else {
      this.connectComponent.hide();
      this.remoteStream.hide();
    }

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
    this.remoteStream.getDialTone();
    const connection: MediaConnection = this.peer.call(peerId, this.remoteStream.dialTone);
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
  private w: Window | UpRadioAppWindow;
  private interval: NodeJS.Timeout;
  private _: IUpRadioAppState;
  public namespace = 'UpRadioAppState';

  constructor(w: Window = window) {
    this.w = w;
    this._ = this.reload();
  }
  
  public init(app: App): this {
    Object.assign(this.w, { app });

    // Save app state every 3 seconds
    this.udpate();
    this.interval = setInterval(() => {
      this.udpate();
    }, 3 * 1000);

    return this;
  }

  public get peerId(): UpRadioPeerId {
    let id: UpRadioPeerId;
    try {
      const w = <UpRadioAppWindow>this.w;
      id = w.app.peer.id;
    } catch (_) { }

    return id || this._.peerId;
  }
  public set peerId(id: UpRadioPeerId) {
    this._.peerId = id;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.peer.id = id;
    } catch (_) { }
  }
  
  public get peerStatus(): UpRadioPeerState {
    let status: UpRadioPeerState;
    try {
      const w = <UpRadioAppWindow>this.w;
      status = w.app.peer.status;
    } catch (_) { }
    return status || this._.peerStatus;
  }
  public set peerStatus(state: UpRadioPeerState) {
    this._.peerStatus = state;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.peer.status = state;
    } catch (_) { }
  }
  
  public get mode(): UpRadioMode {
    let m: UpRadioMode;
    try {
      const w = <UpRadioAppWindow>this.w;
      m = w.app.mode;
    } catch (_) { }
    return m || this._.mode;
  }
  public set mode(mode: UpRadioMode) {
    this._.mode = mode;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.mode = mode;
    } catch (_) { }
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
  reload(): IUpRadioAppState {
    let savedState: any;
    try {
      savedState = JSON.parse(this.w.sessionStorage.getItem(this.namespace));
    } catch (err) {
      console.warn('Could not deserialize any existing app state.');
    }
    this._ = <IUpRadioAppState>savedState || { peerId: null, peerStatus: null, mode: null };
    return this._;
  }
}