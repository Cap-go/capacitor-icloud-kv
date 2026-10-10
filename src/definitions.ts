import type { PluginListenerHandle } from '@capacitor/core';

/**
 * Where the values are stored on the current platform.
 *
 * - `icloud`: iOS `NSUbiquitousKeyValueStore`, synced to every device signed in to the same Apple Account.
 * - `google-backup`: Android `SharedPreferences` included in Android Backup, restored when the app is installed on a new device.
 * - `local`: Web `localStorage`, never leaves the browser.
 */
export type ICloudKVBackend = 'icloud' | 'google-backup' | 'local';

/**
 * Options for reading one value.
 */
export interface GetOptions {
  /**
   * Key to read. iOS limits keys to 64 bytes (UTF-8).
   */
  key: string;
}

/**
 * Result of reading one value.
 */
export interface GetResult {
  /**
   * Stored string, or `null` when the key does not exist.
   */
  value: string | null;
}

/**
 * Options for writing one value.
 */
export interface SetOptions {
  /**
   * Key to write. iOS limits keys to 64 bytes (UTF-8).
   */
  key: string;
  /**
   * String to store. Serialize objects with `JSON.stringify`.
   * On iOS the whole store is limited to 1 MB and 1024 keys.
   */
  value: string;
}

/**
 * Options for deleting one value.
 */
export interface RemoveOptions {
  /**
   * Key to delete.
   */
  key: string;
}

/**
 * Result of reading every value.
 */
export interface GetAllResult {
  /**
   * Every stored key and its string value.
   */
  values: Record<string, string>;
}

/**
 * Result of a synchronize request.
 */
export interface SynchronizeResult {
  /**
   * `true` when the in-memory values were written to disk and queued for upload.
   * This does not mean the upload finished: the system decides when to sync.
   */
  synchronized: boolean;
}

/**
 * Availability of the cloud store.
 */
export interface AvailabilityResult {
  /**
   * `true` when values will leave the device (iOS: signed in to iCloud; Android: always `true`, backup itself is user-controlled).
   */
  available: boolean;
  /**
   * Storage backend used on this platform.
   */
  backend: ICloudKVBackend;
}

/**
 * Why values changed from outside the app.
 *
 * - `server`: another device pushed a newer value.
 * - `initialSync`: first download after install or after signing in.
 * - `quotaViolation`: the 1 MB / 1024 keys limit was exceeded; reduce what you store.
 * - `accountChange`: the user signed in to a different Apple Account; local values were replaced.
 */
export type ChangeReason = 'server' | 'initialSync' | 'quotaViolation' | 'accountChange';

/**
 * Payload of the `change` event.
 */
export interface ChangeEvent {
  /**
   * Keys whose value changed. Read them again with `get` or `getAll`.
   */
  keys: string[];
  /**
   * Why the values changed.
   */
  reason: ChangeReason;
}

/**
 * Plugin version payload.
 */
export interface PluginVersionResult {
  /**
   * Version identifier returned by the platform implementation.
   */
  version: string;
}

/**
 * Small key-value store that follows the user to a new phone.
 *
 * iOS uses iCloud key-value storage (`NSUbiquitousKeyValueStore`), Android stores the values in a
 * `SharedPreferences` file that Android Backup restores on a new device, and Web uses `localStorage`.
 * Use it for progress, settings and other small state, not for files or photos.
 */
export interface ICloudKVPlugin {
  /**
   * Read one value.
   */
  get(options: GetOptions): Promise<GetResult>;

  /**
   * Write one value. It is uploaded when the system decides, usually within seconds when online.
   */
  set(options: SetOptions): Promise<void>;

  /**
   * Delete one value.
   */
  remove(options: RemoveOptions): Promise<void>;

  /**
   * Read every stored key and value.
   */
  getAll(): Promise<GetAllResult>;

  /**
   * Flush pending writes and ask the system to sync. Call it when the app goes to background.
   */
  synchronize(): Promise<SynchronizeResult>;

  /**
   * Check whether values actually leave the device and which backend is used.
   */
  isAvailable(): Promise<AvailabilityResult>;

  /**
   * Listen for values changed by another device (iOS only; never fires on Android and Web).
   */
  addListener(eventName: 'change', listenerFunc: (event: ChangeEvent) => void): Promise<PluginListenerHandle>;

  /**
   * Remove every listener added by this plugin.
   */
  removeAllListeners(): Promise<void>;

  /**
   * Returns the platform implementation version marker.
   */
  getPluginVersion(): Promise<PluginVersionResult>;
}
