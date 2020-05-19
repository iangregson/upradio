import template from './app.html';
import './styles.css';
import { UpRadioPeer, IUpRadioPeer, UpRadioPeerId, UpRadioPeerState, UpRadioPeerService } from './UpRadioPeer';
import ConnectComponent from './components/Connect/Connect.component';
import { MediaConnection } from 'peerjs';
import { LocalStreamComponent } from './components/Streams/LocalStream.component';
import { RemoteStreamComponent } from './components/Streams/RemoteStream.component';
import { ModeSwitchComponent, UpRadioMode } from './components/ModeSwitch/ModeSwitch.component';
import BroadcastComponent from './components/Broadcast/Broadcast.component';
import { EventEmitter } from 'events';
import { UpRadioStatusBar } from './components/Status';
import logger, { LogLevel } from 'peerjs/lib/logger';
import { IUpRadioAppState } from './UpRadioState';
import { ChannelComponent } from './components/Channel/Channel.component';
import { UpRadioApi, UpRadioChannelName } from './UpRadioApi';
import { UpRadioApiError } from '@upradio-server/api';

// const HEARTBEAT_INTERVAL_SECONDS = 300;
const HEARTBEAT_INTERVAL_SECONDS = 5;
const DEBUG_LEVEL: number  = Number(process.env.DEBUG_LEVEL) || LogLevel.Errors;
logger.logLevel = DEBUG_LEVEL;
window.logger = logger;

export class App {
  public root: HTMLElement;
  public peer: IUpRadioPeer;
  public events = new EventEmitter();
  public modeSwitch: ModeSwitchComponent;
  public localStream: LocalStreamComponent;
  public remoteStream: RemoteStreamComponent;
  public connectComponent: ConnectComponent;
  public channel: ChannelComponent;
  public broadcastComponent: BroadcastComponent;
  public statusComponent: UpRadioStatusBar;
  public api: UpRadioApi;
  public heartbeat: NodeJS.Timeout;

  constructor(root: HTMLElement, options?: IUpRadioAppState) {
    this.root = root;
    this.root.innerHTML = template;
    
    this.peer = new UpRadioPeer(options.peerId, options.peerStatus, DEBUG_LEVEL);
    this.peer.init();
    
    this.api = new UpRadioApi(this.peer.id)
    this.api.init(options.sessionToken);
    this.heartbeat = setInterval(() => {
      this.api.heartbeat(this.channel.name)
        .catch((err: UpRadioApiError) => {
          if (err.status === 409) {
            this.events.emit('status::error', { 
              message: 'Channel name conflict. Please choose a different channel name.'
            });
          }
        });
    }, HEARTBEAT_INTERVAL_SECONDS * 1000);
    
    AppService.initComponents(this);
    this.channel.name = options.channelName || null;
    this.channel.description = options.channelDescription || null;
    this.mode = options.mode || UpRadioMode.LISTEN;
    AppService.switchMode(this, this.mode);
    
    // Handle call handoff from some incoming data connection
    this.peer.events.on('nextPeer', (nextPeer: UpRadioPeerId) => {
      this.connect(nextPeer);
    });
  }

  public onModeChange(e: CustomEvent) {
    const newMode: UpRadioMode = e.detail;
    AppService.switchMode(this, newMode);
  }

  public get mode(): UpRadioMode {
    return this.modeSwitch.value;
  }
  public set mode(mode: UpRadioMode) {
    this.modeSwitch.value = mode;
  }

  public async connect(channelName: UpRadioChannelName): Promise<void> {
    this.peer.status = UpRadioPeerState.RELAY;
    this.remoteStream.getDialTone();
    const peerId = await this.api.channelResolve(channelName);
    const connection: MediaConnection = this.peer.call(peerId, this.remoteStream.dialTone);
    connection.on('stream', (stream: MediaStream) => {
      this.remoteStream.start(stream);
    });
    this.peer.on('call', (call: MediaConnection) => {
      if (this.peer.maxConnectionsReached) {
        UpRadioPeerService.handoffConnection(this.peer, call);
        return;
      }
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
    this.events.emit('status::message', { text: 'Ending broadcast...', level: 'info' });
    UpRadioPeerService.closeMediaConnections(this.peer);
    await this.localStream.stop();
    this.peer.status = UpRadioPeerState.OFF_AIR;
    this.peer.off('call', (call: MediaConnection) => {
      UpRadioPeerService.initMediaConnection(this.peer, call);
      call.answer(this.localStream.stream);
    });
  }

  public async broadcast(): Promise<void> {
    this.events.emit('status::message', { text: 'Starting broadcast...', level: 'info' });
    await this.localStream.start();
    this.peer.status = UpRadioPeerState.ON_AIR;
    this.peer.on('call', (call: MediaConnection) => {
      if (this.peer.maxConnectionsReached) {
        UpRadioPeerService.handoffConnection(this.peer, call);
        return;
      }
      UpRadioPeerService.initMediaConnection(this.peer, call);
      call.answer(this.localStream.stream);
    });
  }
}

export class AppService {
  static engageBroadcastMode(app: App): void {
    app.broadcastComponent.show();
    app.localStream.show();
    app.connectComponent.hide();
    app.remoteStream.hide();
  }
  static engageListenMode(app: App): void {
    app.broadcastComponent.hide();
    app.localStream.hide();
    app.connectComponent.show();
    app.remoteStream.show();
  }
  static initComponents(app: App): void {
    app.channel = new ChannelComponent(app.root, app.api);
    app.statusComponent = new UpRadioStatusBar(document.querySelector('footer'), app.events);
    
    app.modeSwitch = new ModeSwitchComponent(app.root);
    app.root.addEventListener('UpRadio:MODE_SWITCH', app.onModeChange.bind(app));
    
    app.connectComponent = new ConnectComponent(app.root);
    app.connectComponent.disconnectBtn.onclick = app.disconnect.bind(app);
    app.connectComponent.connectBtn.onclick = () => {
      app.connect(app.connectComponent.input.value);
    }

    app.remoteStream = new RemoteStreamComponent(app.root);
    app.localStream = new LocalStreamComponent(app.root);
    
    app.broadcastComponent = new BroadcastComponent(app.root);
    app.broadcastComponent.broadcastBtn.onclick = app.broadcast.bind(app);
    app.broadcastComponent.stopBroadcastingBtn.onclick = app.stopBroadcast.bind(app);
  }
  static switchMode(app: App, newMode: UpRadioMode): void {
    switch (newMode) {
      case UpRadioMode.LISTEN:
        AppService.engageListenMode(app);
        break;
      case UpRadioMode.BROADCAST:
        AppService.engageBroadcastMode(app);
        break;
    }
  }
}
