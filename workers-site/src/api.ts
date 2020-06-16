
import { UpRadioAuthService } from './auth';
import { UpRadioChannelService } from './channel';
import { UpRadioKvStore } from './kvstore';

export type UpRadioPeerId = string;
export type UpRadioApiSessionToken = string;

export const API_KEY_HEADER_NAME = 'X-UpRadio-Api-Token';

export interface IUpRadioApiRequest extends Request {
  isAuthenticated: boolean;
  peerId: UpRadioPeerId;
  token: UpRadioApiSessionToken;
}

export class UpRadioApiError extends Error {
  status: number
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.message = message;
    this.status = status;
  }

  toResponse(): Response {
    return new Response(this.message, { status: this.status });
  }
}

export class UpRadioApiResponse {
  static ok(): Response {
    return new Response('OK', { status: 200 });
  }
  static json(data: any) {
    try {
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (_) {
      return UpRadioApiResponse.error();
    }
  }
  static text(data: string) {
    try {
      return new Response(data, { status: 200 });
    } catch (_) {
      return UpRadioApiResponse.error();
    }
  }
  static badRequest() {
    return new Response('Bad Request', { status: 400 });
  }
  static conflict() {
    return new Response('Conflict', { status: 409 });
  }
  static notFound() {
    return new Response('Not found', { status: 404 });
  }
  static error(err?: UpRadioApiError | Error) {
    if (err && err instanceof UpRadioApiError) {
      return err.toResponse();
    }
    return new Response('Interval server error', { status: 500 });
  }
}

export class UpRadioApiRouter {
  static async route(req: IUpRadioApiRequest): Promise<Response> {
    const path = new URL(req.url).pathname;

    let response: Response;

    try {
      switch (path) {
        case '/api/login':
          response = await UpRadioApiRouter.login(req);
          break;
        case '/api/channel/verify':
          await UpRadioAuthService.authenticate(req);
          response = await UpRadioApiRouter.channelVerify(req);
          break;
        case '/api/channel/resolve':
          await UpRadioAuthService.authenticate(req);
          response = await UpRadioApiRouter.channelResolve(req);
          break;
        case '/api/heartbeat':
          await UpRadioAuthService.authenticate(req);
          response = await UpRadioApiRouter.heartbeat(req);
          break;
      
        default:
          response = UpRadioApiResponse.notFound();
          break;
      }
    } catch (err) {
      console.error(err);
      response = UpRadioApiResponse.error(err);
    }

    return response;
  }

  static async login(req: Request): Promise<Response> {
    let token: string | null = null;
    try {
      const payload = await req.json();
      token = payload.token;
    } catch (err) {
      throw new UpRadioApiError(400, 'No token provided');
    }
    
    if (!token) {
      throw new UpRadioApiError(400, 'No token provided');
    }
    const newToken = await UpRadioAuthService.newToken(<string>token);
    
    if (!newToken || typeof newToken !== 'string') {
      throw new Error('Problem generating token.');
    }

    return UpRadioApiResponse.text(newToken);
  }
  
  static async heartbeat(req: IUpRadioApiRequest): Promise<Response> {
    const { channelName } = await req.json();

    if (channelName) {
      if (!await UpRadioChannelService.verify(channelName, req.peerId)) {
        return UpRadioApiResponse.conflict();
      }
      // Update the KV store to ensure ttl is extended
      await UpRadioKvStore.put(channelName, req.peerId);
    }
    
    // Update the KV store to ensure ttl is extended
    await UpRadioKvStore.put(req.token, req.peerId);

    return UpRadioApiResponse.ok();
  }

  static async channelResolve(req: IUpRadioApiRequest) {    
    const { channelName } = await req.json();

    if (!channelName) {
      throw new UpRadioApiError(400, 'No channel name to resolve');
    }
    
    const peerId = await UpRadioChannelService.resolve(channelName);
    
    if (!peerId) {
      throw new UpRadioApiError(404, 'Channel not found.');
    }
    
    return UpRadioApiResponse.text(peerId);
  }

  static async channelVerify(req: IUpRadioApiRequest) {
    const { channelName } = await req.json();

    if (!channelName) {
      throw new UpRadioApiError(400, 'No channel name to verify');
    }
    
    if (!await UpRadioChannelService.verify(channelName, req.peerId)) {
      return UpRadioApiResponse.conflict();
    }
    
    return UpRadioApiResponse.ok();
  }
}
