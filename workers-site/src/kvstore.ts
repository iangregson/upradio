import { KVNamespace } from '@cloudflare/workers-types'

declare global {
  const UPRADIO_KV: KVNamespace;
  const PEER_KEY: string;
}

export const DEFAULT_TTL_SECONDS = 60 * 10; // 10 minutes

export class UpRadioKvStore {
  static async get(key?: string): Promise<string | null> {
    if (!key) return null;
    return UPRADIO_KV.get(key) || null;
  }
  static async put(key?: string, value?: string | null, ttl: number = DEFAULT_TTL_SECONDS): Promise<void> {
    if (!key || !value) return;
    return UPRADIO_KV.put(key, value, { expirationTtl: ttl });
  }
  static async delete(key?: string): Promise<void> {
    if (!key) return;
    return UPRADIO_KV.delete(key);
  }
}
