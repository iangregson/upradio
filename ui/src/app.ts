import template from './app.html';
import { UpRadioPeer, IUpRadioPeer, UpRadioPeerId, UpRadioPeerState, UpRadioPeerService } from './UpRadioPeer';
import ConnectComponent from './components/Connect/Connect.component';
import { MediaConnection, DataConnection } from 'peerjs';
import { LocalStreamComponent } from './components/Streams/LocalStream.component';
import { RemoteStreamComponent } from './components/Streams/RemoteStream.component';
import { ModeSwitchComponent, UpRadioMode } from './components/ModeSwitch/ModeSwitch.component';
import EventEmitter from 'eventemitter3';
import { UpRadioStatusBar } from './components/Status';
import { IUpRadioAppState } from './UpRadioState';
import { ChannelEditComponent, UpRadioChannelStatus, UpRadioChannelId, UpRadioOnAirStatus } from './components/Channel/ChannelEdit.component';
import { UpRadioApi, UpRadioChannelName } from './UpRadioApi';
import { UpRadioApiError } from './UpRadioApi';
import { ChannelInfo, UpRadioChannelInfo } from './components/Channel/ChannelInfo.component';
import { Logger, LogLevel } from './components/logger';
import { UpRadioPeerRpcService } from './UpRadioPeer/UpRadioPeerRpc';

const HEARTBEAT_INTERVAL_SECONDS = 300;
// const HEARTBEAT_INTERVAL_SECONDS = 5;
const DEBUG_LEVEL: number  = Number(process.env.DEBUG_LEVEL);

window.logger = new Logger(DEBUG_LEVEL);

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
  public channelInfoComponent: ChannelInfo;
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
  }

  public get channelInfo(): UpRadioChannelInfo {
    return this.mode === UpRadioMode.BROADCAST 
      ? this.channelEdit.channelInfo.channelInfo
      : this.channelInfoComponent.channelInfo;
  }
  
  public get targetChannelId(): UpRadioChannelId {
    return this.connectComponent.input.value;
  }
  
  public set targetChannelId(cId: UpRadioChannelId) {
    this.connectComponent.input.value = cId;
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

  public async call(channelId: UpRadioChannelId): Promise<void> {
    this.events.emit('status::message', { text: 'Connecting...', level: 'info' });
    this.remoteStream.getDialTone();
    
    const peerId = await this.api.channelResolve(channelId)
      .catch((err: UpRadioApiError) => {
        this.events.emit('status::message', { text: err.message, level: 'error' });
      });

    if (!peerId) return;

    const connection: MediaConnection = this.peer.call(peerId, this.remoteStream.dialTone);
    this.events.emit('status::message', { text: 'Connected. Awaiting stream...', level: 'info' });
    this.remoteStream.playBtn.disabled = true;
    connection.on('stream', (stream: MediaStream) => {
      this.events.emit('status::message', { text: 'Connected', level: 'success' });
      window.logger.debug(`[app#call][connection.on('stream')]`);
      this.remoteStream.start(stream);
      this.remoteStream.playBtn.disabled = false;
    });
    connection.on('close', () => {
      this.events.emit('status::message', { text: 'Broadcast stopped', level: 'info' });
      this.remoteStream.stop();
      this.remoteStream.onAirStatus = UpRadioOnAirStatus.OFF_AIR;
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
  
  public async endCall(): Promise<void> {
    this.events.emit('status::message', { text: 'Disconnecting...', level: 'info' });
    UpRadioPeerService.closeMediaConnections(this.peer);
    await this.remoteStream.stop().catch(err => window.logger.error(err));
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
    this.channelEdit.onAirStatus = UpRadioOnAirStatus.OFF_AIR;
    this.peer.off('call', (call: MediaConnection) => {
      if (this.peer.maxConnectionsReached) {
        UpRadioPeerService.handoffConnection(this.peer, call);
        return;
      }
      UpRadioPeerService.initMediaConnection(this.peer, call);
      call.answer(this.localStream.stream);
    });
  }

  public async broadcast(): Promise<void> {
    this.events.emit('status::message', { text: 'Starting broadcast...', level: 'info' });
    await this.localStream.start();
    this.channelEdit.onAirStatus = UpRadioOnAirStatus.ON_AIR;
    this.peer.on('call', (call: MediaConnection) => {
      window.logger.debug(`[app]on('call')`, call);
      if (this.peer.maxConnectionsReached) {
        UpRadioPeerService.handoffConnection(this.peer, call);
        return;
      }
      UpRadioPeerService.answerCall(this, call);
    });
  }
}

export class AppService {
  static engageBroadcastMode(app: App): void {
    UpRadioPeerService.closeMediaConnections(app.peer);
    app.peer.status = UpRadioPeerState.BROADCAST;
    app.listenSection.classList.add('hidden');
    app.broadcastSection.classList.remove('hidden');
    app.channelEdit.show();
    app.localStream.show();
    app.channelInfoComponent.hide();
    app.remoteStream.hide();
    AppService.initBroadcastEvents(app);
  }
  static engageListenMode(app: App): void {
    UpRadioPeerService.closeMediaConnections(app.peer);
    app.peer.status = UpRadioPeerState.RELAY;
    app.listenSection.classList.remove('hidden');
    app.broadcastSection.classList.add('hidden');
    app.channelEdit.hide();
    app.localStream.hide();
    app.remoteStream.show();
    AppService.initRelayEvents(app);
  }
  static initComponents(app: App): void {
    app.channelEdit = new ChannelEditComponent(app.broadcastSection, app.api, app.peer);
    app.channelEdit.on('status::message', payload => app.events.emit('status::message', payload));
    app.statusComponent = new UpRadioStatusBar(app.statusSection, app.events);
    
    app.connectComponent = new ConnectComponent(app.nav);
    app.channelInfoComponent = new ChannelInfo(app.listenSection, 'UpRadioChannelInfo-Listen');
    app.modeSwitch = new ModeSwitchComponent(app.nav);
    app.modeSwitch.on('MODE_SWITCH', app.onModeChange.bind(app));

    app.remoteStream = new RemoteStreamComponent(app.streamSection);
    app.remoteStream.connectBtn.onclick = () => {
      app.call(app.targetChannelId);
    };
    
    app.localStream = new LocalStreamComponent(app.streamSection);
    app.localStream.broadcastBtn.onclick = app.broadcast.bind(app);
    app.localStream.stopBroadcastingBtn.onclick = app.stopBroadcast.bind(app);
  }
  static initOptions(app: App, options: IUpRadioAppState) {
    app.targetChannelId = options.targetChannelName || null;
    app.channelEdit.name = options.channelName || null;
    app.channelEdit.description = options.channelDescription || null;
    app.channelEdit.image = options.channelImage || null;
    app.mode = options.mode || UpRadioMode.LISTEN;
    app.localStream.setSelectedDeviceId(options.audioDeviceId);
  }
  static initBroadcastEvents(app: App) {
    // Send channel info down to those who connect to us
    app.peer.on('connection', (connection: DataConnection) => {
      connection.on('open', () => {
        UpRadioPeerRpcService.setChannelInfo(app.peer, connection, app.channelInfo);
        UpRadioPeerRpcService.setChannelOnAirStatus(app.peer, connection, app.localStream.onAirStatus);
      });
    });
  }
  static initRelayEvents(app: App) {
    // Handle call handoff from some incoming data connection
    app.peer.events.on('nextPeer', (nextPeer: UpRadioPeerId) => {
      app.call(nextPeer);
    });
    // Handle receipt of channel info
    app.peer.events.on('setChannelInfo', (channelInfos: UpRadioChannelInfo[]) => {
      app.channelInfoComponent.init(channelInfos[0]);
    });
    // Handle receipt of channel status
    app.peer.events.on('setChannelOnAirStatus', (status: UpRadioOnAirStatus[]) => {
      app.remoteStream.onAirStatus = status[0];
    });

    app.peer.on('disconnected', async () => {
      // close current connections
      await app.endCall();
    });
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
