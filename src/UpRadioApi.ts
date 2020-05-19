import { UpRadioPeerId } from "./UpRadioPeer/UpRadioPeer";
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { UpRadioApiError } from "@upradio-server/api";

export type UpRadioChannelName = string;
export type UpRadioApiSessionToken = string;

export const API_KEY_HEADER_NAME = 'X-UpRadio-Api-Token'

export interface IUpRadioApiService {
  login(peerId: UpRadioPeerId): Promise<UpRadioApiSessionToken>;
  channelVerify(token: UpRadioApiSessionToken, peerId: UpRadioPeerId, channelName: UpRadioChannelName): Promise<Response>;
  channelResolve(token: UpRadioApiSessionToken, peerId: UpRadioPeerId, channelName: UpRadioChannelName): Promise<Response>;
  heartbeat(token: UpRadioApiSessionToken, channelName?: UpRadioChannelName): Promise<Response>;
}

export class UpRadioApiService {
  static async login(peerId: UpRadioPeerId): Promise<UpRadioApiSessionToken | null> {
    const words = Utf8.parse(`${Date.now()}:${process.env.PEER_KEY}:${peerId}`);
    const token = Base64.stringify(words);
    return fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'Accept': 'text/html',    
        'Content-Type': 'application/json'
      }
    }).then((r: Response) => r.text() || null)
      .catch((_: Error) => null)
  }
  static async channelVerify(token: UpRadioApiSessionToken, channelName: UpRadioChannelName): Promise<Response> {
    return fetch('/api/channel/verify', {
      method: 'PUT',
      body: JSON.stringify({ channelName }),
      headers: {
        'Accept': 'text/html',
        'Content-Type': 'application/json',
        [API_KEY_HEADER_NAME]: token
      }
    });
  }
  static async channelResolve(token: UpRadioApiSessionToken, channelName: UpRadioChannelName): Promise<Response> {
    return fetch('/api/channel/resolve', {
      method: 'PUT',
      body: JSON.stringify({ channelName }),
      headers: {
        'Accept': 'text/html',
        'Content-Type': 'application/json',
        [API_KEY_HEADER_NAME]: token
      }
    });
  }
  static async heartbeat(token: UpRadioApiSessionToken, channelName?: UpRadioChannelName): Promise<Response> {
    return fetch('/api/heartbeat', {
      method: 'PUT',
      body: JSON.stringify({ channelName }),
      headers: {
        'Accept': 'text/html',
        'Content-Type': 'application/json',
        [API_KEY_HEADER_NAME]: token
      }
    });
  }
}

export class UpRadioApi {
  public peerId: UpRadioPeerId;
  public token: UpRadioApiSessionToken | null | undefined;

  constructor(peerId: UpRadioPeerId) {
    this.peerId = peerId;
  }

  public async init(sessionToken?: UpRadioApiSessionToken): Promise<void> {
    // Get a valid token with exponential backoff
    this.token = sessionToken;

    let delaySeconds = 0;
    let retries = 0;
    const MAX_RETRIES = 3;
    
    const backoff = () => new Promise((resolve) => {
      setTimeout(resolve, delaySeconds * 1000);
    });

    while (!this.token) {
      await backoff();

      await this.login(this.peerId);

      if (!this.token) {
        delaySeconds += delaySeconds === 0 ? 1 : delaySeconds;
        retries++;
      }
      
      if (retries > MAX_RETRIES) break;
    }
  }
  public async login(peerId: UpRadioPeerId): Promise<UpRadioApiSessionToken> {
    this.token = await UpRadioApiService.login(peerId);
    return <string>this.token;
  }
  public async heartbeat(channelName?: UpRadioChannelName): Promise<void> {
    if (!this.token) await this.login(this.peerId);
    
    let response = await UpRadioApiService.heartbeat(<string>this.token, channelName);
    
    if (!response.ok && response.status === 401) {
      await this.login(this.peerId);
      response = await UpRadioApiService.heartbeat(<string>this.token);
    }
    
    if (!response.ok && response.status === 409) {
      throw new UpRadioApiError(409, 'Channel name conflict');
    }
  }
  public async channelVerify(channelName: UpRadioChannelName): Promise<void> {
    if (!this.token) await this.login(this.peerId);
    
    let response = await UpRadioApiService.channelVerify(<string>this.token, channelName);

    if (!response.ok && response.status === 401) {
      await this.login(this.peerId);
      response = await UpRadioApiService.channelVerify(<string>this.token, channelName);
    }

    if (!response.ok && response.status === 409) {
      throw new UpRadioApiError(409, 'Channel name conflict');
    }
  }
  public async channelResolve(channelName: UpRadioChannelName): Promise<UpRadioPeerId> {
    if (!this.token) await this.login(this.peerId);
    
    let response = await UpRadioApiService.channelResolve(<string>this.token, channelName);

    if (!response.ok && response.status === 404) {
      throw new UpRadioApiError(404, 'Channel not found');
    }

    return response.text();
  }
}