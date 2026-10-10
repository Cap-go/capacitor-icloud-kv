import { WebPlugin } from '@capacitor/core';

import type {
  AvailabilityResult,
  GetAllResult,
  GetOptions,
  GetResult,
  ICloudKVPlugin,
  PluginVersionResult,
  RemoveOptions,
  SetOptions,
  SynchronizeResult,
} from './definitions';

const PREFIX = 'CapgoICloudKV.';

export class ICloudKVWeb extends WebPlugin implements ICloudKVPlugin {
  async get(options: GetOptions): Promise<GetResult> {
    return { value: localStorage.getItem(PREFIX + options.key) };
  }

  async set(options: SetOptions): Promise<void> {
    localStorage.setItem(PREFIX + options.key, options.value);
  }

  async remove(options: RemoveOptions): Promise<void> {
    localStorage.removeItem(PREFIX + options.key);
  }

  async getAll(): Promise<GetAllResult> {
    const values: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) values[k.slice(PREFIX.length)] = localStorage.getItem(k) ?? '';
    }
    return { values };
  }

  async synchronize(): Promise<SynchronizeResult> {
    return { synchronized: true };
  }

  async isAvailable(): Promise<AvailabilityResult> {
    return { available: false, backend: 'local' };
  }

  async getPluginVersion(): Promise<PluginVersionResult> {
    return { version: 'web' };
  }
}
