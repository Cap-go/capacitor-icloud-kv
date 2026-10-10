import { registerPlugin } from '@capacitor/core';

import type { ICloudKVPlugin } from './definitions';

const ICloudKV = registerPlugin<ICloudKVPlugin>('ICloudKV', {
  web: () => import('./web').then((m) => new m.ICloudKVWeb()),
});

export * from './definitions';
export { ICloudKV };
