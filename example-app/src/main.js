import './style.css';

import { Capacitor } from '@capacitor/core';
import { ICloudKV } from '@capgo/capacitor-icloud-kv';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

const output = document.getElementById('plugin-output');
const keyInput = document.getElementById('kv-key');
const valueInput = document.getElementById('kv-value');

const setOutput = (value) => {
  output.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
};

if (Capacitor.isNativePlatform()) {
  void CapacitorUpdater.notifyAppReady().catch((error) => {
    console.error('CapacitorUpdater.notifyAppReady failed', error);
  });
}

const run = (id, action) => {
  document.getElementById(id).addEventListener('click', async () => {
    try {
      setOutput((await action()) ?? 'OK');
    } catch (error) {
      setOutput(`Error: ${error?.message ?? error}`);
    }
  });
};

run('kv-set', () => ICloudKV.set({ key: keyInput.value, value: valueInput.value }));
run('kv-get', () => ICloudKV.get({ key: keyInput.value }));
run('kv-all', () => ICloudKV.getAll());
run('kv-available', () => ICloudKV.isAvailable());

void ICloudKV.addListener('change', (event) => setOutput({ event: 'change', ...event }));
