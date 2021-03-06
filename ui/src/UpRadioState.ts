import { App } from './app';
import { UpRadioPeerId, UpRadioPeerState } from './UpRadioPeer';
import { UpRadioMode } from './components/ModeSwitch/ModeSwitch.component';
import { UpRadioChannelName, UpRadioChannelId } from './components/Channel/ChannelEdit.component';
import { UpRadioApiSessionToken } from './UpRadioApi';
import { set, get, del } from 'idb-keyval';

export class Idb {
  static async get(key: string): Promise<string> {
    return get(key);
  }
  static async set(key: string, value: string): Promise<void> {
    await set(key, value);
  }
  static async del(key: string): Promise<void> {
    await del(key);
  }
}

interface UpRadioAppWindow extends Window {
  app: App;
}

export interface IUpRadioAppState {
  peerId?: UpRadioPeerId;
  peerStatus?: UpRadioPeerState;
  mode?: UpRadioMode;
  audioDeviceId?: string;
  channelName?: UpRadioChannelName;
  chatUrl?: string;
  targetChannelName?: UpRadioChannelName;
  channelDescription?: string;
  sessionToken?: UpRadioApiSessionToken;
  channelImage?: string;
  channelId?: UpRadioChannelId;
}

export class UpRadioAppState implements IUpRadioAppState {
  private w: Window | UpRadioAppWindow;
  private interval: NodeJS.Timeout;
  private _: IUpRadioAppState;
  public namespace = 'UpRadioAppState';

  constructor(savedState?: IUpRadioAppState) {
    this.w = window;
    if (savedState) {
      this._ = savedState;
    } else {
      this._ = this.reload();
    }
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

  public setTitle() {
    const channel = this.mode === UpRadioMode.BROADCAST
      ? this.channelName
      : this.targetChannelName;
    document.title = channel ? (channel + ' | UpRadio') : 'UpRadio';
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

  public get audioDeviceId(): string {
    let id: string;
    try {
      const w = <UpRadioAppWindow>this.w;
      id = w.app.localStream.selectedDevice.deviceId;
    } catch (_) { }

    return id || this._.audioDeviceId;
  }
  public set audioDeviceId(id: string) {
    this._.audioDeviceId = id;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.localStream.setSelectedDeviceId(id);
    } catch (_) { }
  }

  public get channelName(): UpRadioChannelName {
    let name: UpRadioChannelName;
    try {
      const w = <UpRadioAppWindow>this.w;
      name = w.app.channelEdit.name;
    } catch (_) { }

    return name || this._.channelName;
  }
  public set channelName(name: UpRadioChannelName) {
    this._.channelName = name;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.channelEdit.name = name;
    } catch (_) { }
  }

  public get chatUrl(): string {
    let url: string;
    try {
      const w = <UpRadioAppWindow>this.w;
      url = w.app.channelEdit.chatUrl;
    } catch (_) { }

    return url || this._.chatUrl;
  }
  public set chatUrl(url: string) {
    this._.chatUrl = url;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.channelEdit.chatUrl = url;
    } catch (_) { }
  }

  public get targetChannelName(): UpRadioChannelName {
    let name: UpRadioChannelName;
    try {
      const w = <UpRadioAppWindow>this.w;
      name = w.app.connectComponent.input.value;
    } catch (_) { }

    return name || this._.targetChannelName;
  }
  public set targetChannelName(name: UpRadioChannelName) {
    this._.targetChannelName = name;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.connectComponent.input.value = name;
    } catch (_) { }
  }

  public get channelDescription(): string {
    let description: string;
    try {
      const w = <UpRadioAppWindow>this.w;
      description = w.app.channelEdit.description;
    } catch (_) { }

    return description || this._.channelDescription;
  }
  public set channelDescription(description: string) {
    this._.channelDescription = description;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.channelEdit.description = description;
    } catch (_) { }
  }

  public get channelImage(): string {
    let image: string;
    try {
      const w = <UpRadioAppWindow>this.w;
      image = w.app.channelEdit.image;
    } catch (_) { }

    return image || this._.channelImage;
  }
  public set channelImage(imageBase64: string) {
    this._.channelImage = imageBase64;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.channelEdit.image = imageBase64;
    } catch (_) { }
  }

  public get channelId(): UpRadioChannelId {
    let id: UpRadioChannelId;
    try {
      const w = <UpRadioAppWindow>this.w;
      id = w.app.channelEdit.id;
    } catch (_) { }

    return id || this._.channelId;
  }
  public set channelId(id: UpRadioChannelId) {
    this._.channelId = id;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.channelEdit.id = id;
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
  
  public get sessionToken(): UpRadioApiSessionToken {
    let token: UpRadioApiSessionToken;
    try {
      const w = <UpRadioAppWindow>this.w;
      token = w.app.api.token;
    } catch (_) { }
    return token || this._.sessionToken;
  }
  public set sessionToken(sessionToken: UpRadioApiSessionToken) {
    this._.sessionToken = sessionToken;
    try {
      const w = <UpRadioAppWindow>this.w;
      w.app.api.token = sessionToken;
    } catch (_) { }
  }

  toJSON() {
    return {
      peerId: this.peerId,
      peerStatus: this.peerStatus,
      mode: this.mode,
      audioDeviceId: this.audioDeviceId,
      channelName: this.channelName,
      targetChannelName: this.targetChannelName,
      channelDescription: this.channelDescription,
      channelImage: this.channelImage,
      sessionToken: this.sessionToken,
      chatUrl: this.chatUrl
    };
  }
  udpate() {
    const w = <UpRadioAppWindow>this.w;
    const props = this.toJSON();
    const localStore = {
      channelName: props.channelName,
      channelDescription: props.channelDescription,
      channelImage: props.channelImage,
      chatUrl: props.chatUrl
    };
    const sessionStore = {
      peerId: props.peerId,
      peerStatus: props.peerStatus,
      mode: props.mode,
      audioDeviceId: props.audioDeviceId,
      targetChannelName: props.targetChannelName,
      sessionToken: props.sessionToken
    };
    w.localStorage.setItem(this.namespace, JSON.stringify(localStore));
    w.sessionStorage.setItem(this.namespace, JSON.stringify(sessionStore));
    Idb.set('UpRadio::savedState', JSON.stringify(this));
    this.setTitle();
  }
  reload(): IUpRadioAppState {
    let savedSession: any;
    let savedLocal: any;
    try {
      savedSession = JSON.parse(this.w.sessionStorage.getItem(this.namespace)) || {};
    } catch (err) {
      this.w.logger.warn('Could not deserialize any existing app state from sessionStorage.');
      savedSession = {};
    }
    try {
      savedLocal = JSON.parse(this.w.localStorage.getItem(this.namespace)) || {};
    } catch (err) {
      this.w.logger.warn('Could not deserialize any existing app state from localStorage.');
      savedLocal = {};
    }
    this._ = {};
    this._.peerId = savedSession.peerId || null;
    this._.peerStatus = savedSession.peerStatus || null;
    this._.mode = savedSession.mode || null;
    this._.audioDeviceId = savedSession.audioDeviceId || null;
    this._.channelName = savedLocal.channelName || null;
    this._.chatUrl = savedLocal.chatUrl || null;
    this._.targetChannelName = savedSession.targetChannelName || null;
    this._.channelDescription = savedLocal.channelDescription || null;
    this._.channelImage = savedLocal.channelImage || null;
    this._.sessionToken = savedSession.sessionToken || null;
    return this._;
  }
}