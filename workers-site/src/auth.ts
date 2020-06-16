import { UpRadioApiSessionToken, API_KEY_HEADER_NAME } from "./api";
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { UpRadioApiError, UpRadioPeerId } from "./api";
import { IUpRadioApiRequest } from './api';
import { UpRadioKvStore } from './kvstore';

export class UpRadioAuthService {
  static async authenticate(req: IUpRadioApiRequest): Promise<IUpRadioApiRequest> {
    const token = req.headers.get(API_KEY_HEADER_NAME) || undefined;
    
    if (!token) {
      req.isAuthenticated = false;
    }

    const peerId = await UpRadioAuthService.hasToken(token);

    if (!peerId) {
      req.isAuthenticated = false;
    } else {
      req.isAuthenticated = true;
      req.peerId = peerId;
      req.token = <UpRadioApiSessionToken>token;
    }

    if (!req.isAuthenticated) {
      throw new UpRadioApiError(401, 'Unauthorized');
    }
    
    return req;
  }
  static async newToken(token: string): Promise<UpRadioApiSessionToken> {
    const wordArray = Base64.parse(token);
    const utf8Token = Utf8.stringify(wordArray);
    const [date, key, peerId] = utf8Token.split(':');
    if (!date || !key || !peerId) throw new UpRadioApiError(400, 'Could not generate token from input.');
    if (key !== PEER_KEY) throw new UpRadioApiError(400, 'Could not generate token from input.');
    const newToken = Base64.stringify(sha256(date + peerId));
    await UpRadioKvStore.put(newToken, peerId);
    return newToken;
  }
  static async hasToken(token: UpRadioApiSessionToken | undefined): Promise<UpRadioPeerId | null> {
    const t: UpRadioPeerId | null = await UpRadioKvStore.get(token);
    
    return t;
  }
}
