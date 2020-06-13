import template from './app.html';
import './styles.css';
import { UpRadioPeer, IUpRadioPeer, UpRadioPeerId, UpRadioPeerState, UpRadioPeerService } from './UpRadioPeer';
import ConnectComponent from './components/Connect/Connect.component';
import { MediaConnection } from 'peerjs';
import { LocalStreamComponent } from './components/Streams/LocalStream.component';
import { RemoteStreamComponent } from './components/Streams/RemoteStream.component';
import { ModeSwitchComponent, UpRadioMode } from './components/ModeSwitch/ModeSwitch.component';
import { EventEmitter } from 'events';
import { UpRadioStatusBar } from './components/Status';
import logger, { LogLevel } from 'peerjs/lib/logger';
import { IUpRadioAppState } from './UpRadioState';
import { ChannelEditComponent, UpRadioChannelStatus } from './components/Channel/ChannelEdit.component';
import { UpRadioApi, UpRadioChannelName } from './UpRadioApi';
import { UpRadioApiError } from '@upradio-server/api';
import { ChannelInfo } from './components/Channel/ChannelInfo.component';

const HEARTBEAT_INTERVAL_SECONDS = 300;
// const HEARTBEAT_INTERVAL_SECONDS = 5;
const DEBUG_LEVEL: number  = Number(process.env.DEBUG_LEVEL) || LogLevel.Errors;
logger.logLevel = DEBUG_LEVEL;
window.logger = logger;

export class App {
  public root: HTMLElement;
  public nav: HTMLElement;;
  public listenSection: HTMLElement;
  public broadcastSection: HTMLElement;
  public statusSection: HTMLElement;
  public streamSection: HTMLElement;
  
  public peer: IUpRadioPeer;
  public events = new EventEmitter();
  public modeSwitch: ModeSwitchComponent;
  public localStream: LocalStreamComponent;
  public remoteStream: RemoteStreamComponent;
  public connectComponent: ConnectComponent;
  public channelEdit: ChannelEditComponent;
  public channelInfo: ChannelInfo;
  public statusComponent: UpRadioStatusBar;
  public api: UpRadioApi;
  public heartbeat: NodeJS.Timeout;

  constructor(root: HTMLElement, options?: IUpRadioAppState) {
    this.root = root;
    this.root.innerHTML = template;
    this.listenSection = root.querySelector('section#listen');
    this.broadcastSection = root.querySelector('section#broadcast');
    this.nav = document.querySelector('nav');
    this.statusSection = root.querySelector('section#status');
    this.streamSection = root.querySelector('section#stream');
    
    this.peer = new UpRadioPeer(options.peerId, options.peerStatus, DEBUG_LEVEL);
    this.peer.init();
    
    this.api = new UpRadioApi(this.peer.id)
    
    AppService.initComponents(this);
    AppService.initOptions(this, options);
    AppService.switchMode(this, this.mode);

    this.events.emit('status::message', { text: 'Creating session...', level: 'log' });
    
    this.api.init(options.sessionToken)
      .then(() => this.events.emit('status::message', { text: 'Session started.', level: 'success' }))
      .catch((err: UpRadioApiError) => {
        this.events.emit('status::message', { text: err.message, level: 'error' });
      });
    
     this.heartbeat = setInterval(() => {
      this.api.heartbeat(this.channelEdit.channelId)
        .catch((err: UpRadioApiError) => {
          this.channelEdit.channelStatus = UpRadioChannelStatus.invalid;
          if (err.status === 409) {
            this.events.emit('status::message', { 
              text: 'Channel name conflict. Please choose a different channel name.',
              level: 'error'
            });
          } else {
            this.events.emit('status::message', { 
              text: err.message,
              level: 'error'
            });
          }
        });
    }, HEARTBEAT_INTERVAL_SECONDS * 1000);
    
    // Handle call handoff from some incoming data connection
    this.peer.events.on('nextPeer', (nextPeer: UpRadioPeerId) => {
      this.connect(nextPeer);
    });
  }

  public onModeChange(event: { mode: UpRadioMode }) {
    AppService.switchMode(this, event.mode);
  }

  public get mode(): UpRadioMode {
    return this.modeSwitch.value;
  }
  public set mode(mode: UpRadioMode) {
    this.modeSwitch.value = mode;
  }

  public async connect(channelName: UpRadioChannelName): Promise<void> {
    this.events.emit('status::message', { text: 'Connecting...', level: 'info' });
    this.peer.status = UpRadioPeerState.RELAY;
    this.remoteStream.getDialTone();
    
    const peerId = await this.api.channelResolve(channelName)
      .catch((err: UpRadioApiError) => {
        this.events.emit('status::message', { text: err.message, level: 'error' });
      });

    if (!peerId) return;

    const connection: MediaConnection = this.peer.call(peerId, this.remoteStream.dialTone);
    connection.on('stream', (stream: MediaStream) => {
      this.events.emit('status::message', { text: 'Connected', level: 'success' });
      this.remoteStream.start(stream);
    });
    connection.on('close', () => {
      this.events.emit('status::message', { text: 'Broadcast stopped', level: 'info' });
      this.remoteStream.stop();
    })
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
    this.events.emit('status::message', { text: 'Disconnecting...', level: 'info' });
    UpRadioPeerService.closeMediaConnections(this.peer);
    await this.remoteStream.stop().catch(console.error);
    this.peer.status = UpRadioPeerState.OFF_AIR;
    this.events.emit('status::message', { text: 'Disconnected', level: 'info' });
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
    UpRadioPeerService.closeMediaConnections(app.peer);
    app.listenSection.classList.add('hidden');
    app.broadcastSection.classList.remove('hidden');
    app.channelEdit.show();
    app.localStream.show();
    app.channelInfo.hide();
    app.remoteStream.hide();
  }
  static engageListenMode(app: App): void {
    UpRadioPeerService.closeMediaConnections(app.peer);
    app.listenSection.classList.remove('hidden');
    app.broadcastSection.classList.add('hidden');
    app.channelEdit.hide();
    app.localStream.hide();
    app.remoteStream.show();
  }
  static initComponents(app: App): void {
    app.channelEdit = new ChannelEditComponent(app.broadcastSection, app.api, app.peer);
    app.channelEdit.on('status::message', payload => app.events.emit('status::message', payload));
    app.statusComponent = new UpRadioStatusBar(app.statusSection, app.events);
    
    app.connectComponent = new ConnectComponent(app.nav);
    app.channelInfo = new ChannelInfo(app.listenSection);
    app.modeSwitch = new ModeSwitchComponent(app.nav);
    app.modeSwitch.on('MODE_SWITCH', app.onModeChange.bind(app));

    app.remoteStream = new RemoteStreamComponent(app.streamSection);
    app.localStream = new LocalStreamComponent(app.streamSection);
    app.localStream.broadcastBtn.onclick = app.broadcast.bind(app);
    app.localStream.stopBroadcastingBtn.onclick = app.stopBroadcast.bind(app);
  }
  static initOptions(app: App, options: IUpRadioAppState) {
    app.connectComponent.input.value = options.targetChannelName || null;
    app.channelEdit.name = options.channelName || null;
    app.channelEdit.description = options.channelDescription || null;
    app.channelEdit.image = options.channelImage || null;
    app.mode = options.mode || UpRadioMode.LISTEN;
    app.localStream.setSelectedDeviceId(options.audioDeviceId);
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
