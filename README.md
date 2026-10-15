# @capgo/capacitor-icloud-kv

Keep small app state (progress, settings, streaks) when the user gets a new phone. On iOS it is synced through iCloud key-value storage to every device on the same Apple Account; on Android it is restored by Android Backup on a new device.

<a href="https://capgo.app/?ref=plugin_icloud_kv"><img src="https://capgo.app/readme-banner.svg?repo=Cap-go/capacitor-icloud-kv" alt="Capgo - Build Capacitor apps with AI, ship updates instantly" /></a>

<div align="center">
  <p><b>Capgo</b>: push fixes to your Capacitor users in minutes, build signed iOS and Android apps without a Mac, and roll back in one click.</p>
  <h2><a href="https://capgo.app/register/?ref=plugin_icloud_kv">➡️ Get started for free</a></h2>
  <p>14-day unlimited free trial. No credit card required</p>
</div>

> 🤖 **Building with an AI coding agent?** Install [Capgo skills](https://capgo.app/skills/?ref=plugin_icloud_kv) so Claude Code, Codex, Cursor, Copilot, or Gemini CLI know how to install and use `@capgo/capacitor-icloud-kv` in your Capacitor app: `npx skills add Cap-go/capgo-skills`. Then ask your agent: *"Add @capgo/capacitor-icloud-kv to my Capacitor app and wire it up."* [Agent setup guides](https://capgo.app/agents/?ref=plugin_icloud_kv) · [Hosted MCP](https://capgo.app/docs/ai/mcp/?ref=plugin_icloud_kv)

## Key features

- **No account, no server**: uses the user's own iCloud on iOS and Android Backup on Android.
- **Survives a lost phone**: values come back on the new device after restore or sign-in.
- **Live sync on iOS**: a `change` event fires when another iPhone or iPad writes a newer value.
- **Simple API**: `get`, `set`, `remove`, `getAll`, `synchronize`, `isAvailable`.
- **Web fallback**: `localStorage`, so the same code runs in the browser.

## What it is not for

iCloud key-value storage holds at most **1 MB and 1024 keys** per app (keys up to 64 bytes). Store compact JSON (progress, settings), not photos or files. Values are strings: use `JSON.stringify` / `JSON.parse`.

## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/icloud-kv/

## Compatibility

| Plugin version | Capacitor compatibility | Maintained |
| -------------- | ----------------------- | ---------- |
| v8.\*.\*       | v8.\*.\*                | ✅          |

> **Note:** The major version of this plugin follows the major version of Capacitor.

## Install

```bash
npm install @capgo/capacitor-icloud-kv
npx cap sync
```

## iOS setup

1. In Xcode, select your app target, **Signing & Capabilities** > **+ Capability** > **iCloud**, then tick **Key-value storage**. This adds to `App.entitlements`:

   ```xml
   <key>com.apple.developer.ubiquity-kvstore-identifier</key>
   <string>$(TeamIdentifierPrefix)$(CFBundleIdentifier)</string>
   ```

2. Regenerate your provisioning profile so it contains the iCloud capability (Xcode does this with automatic signing).

Without the entitlement the store still works but stays on the device.

## Android setup

Nothing to add: Android Auto Backup is on by default (`android:allowBackup="true"`). If your app defines `android:fullBackupContent` or `android:dataExtractionRules`, include the shared preferences file `CapgoICloudKV.xml`.

Android has no live sync between two devices: values are restored when the app is installed on a new phone with the same Google account.

## Usage

```ts
import { ICloudKV } from '@capgo/capacitor-icloud-kv';

// Save progress
await ICloudKV.set({ key: 'progress', value: JSON.stringify(state) });

// Restore on launch
const { value } = await ICloudKV.get({ key: 'progress' });
if (value) state = JSON.parse(value);

// Another device updated it (iOS)
await ICloudKV.addListener('change', async ({ keys }) => {
  if (keys.includes('progress')) {
    const { value } = await ICloudKV.get({ key: 'progress' });
    // merge or replace local state
  }
});

// Is the user signed in to iCloud?
const { available, backend } = await ICloudKV.isAvailable();
```

## API

<docgen-index>

* [`get(...)`](#get)
* [`set(...)`](#set)
* [`remove(...)`](#remove)
* [`getAll()`](#getall)
* [`synchronize()`](#synchronize)
* [`isAvailable()`](#isavailable)
* [`addListener('change', ...)`](#addlistenerchange-)
* [`removeAllListeners()`](#removealllisteners)
* [`getPluginVersion()`](#getpluginversion)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Small key-value store that follows the user to a new phone.

iOS uses iCloud key-value storage (`NSUbiquitousKeyValueStore`), Android stores the values in a
`SharedPreferences` file that Android Backup restores on a new device, and Web uses `localStorage`.
Use it for progress, settings and other small state, not for files or photos.

### get(...)

```typescript
get(options: GetOptions) => Promise<GetResult>
```

Read one value.

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code><a href="#getoptions">GetOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#getresult">GetResult</a>&gt;</code>

--------------------


### set(...)

```typescript
set(options: SetOptions) => Promise<void>
```

Write one value. It is uploaded when the system decides, usually within seconds when online.

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code><a href="#setoptions">SetOptions</a></code> |

--------------------


### remove(...)

```typescript
remove(options: RemoveOptions) => Promise<void>
```

Delete one value.

| Param         | Type                                                    |
| ------------- | ------------------------------------------------------- |
| **`options`** | <code><a href="#removeoptions">RemoveOptions</a></code> |

--------------------


### getAll()

```typescript
getAll() => Promise<GetAllResult>
```

Read every stored key and value.

**Returns:** <code>Promise&lt;<a href="#getallresult">GetAllResult</a>&gt;</code>

--------------------


### synchronize()

```typescript
synchronize() => Promise<SynchronizeResult>
```

Flush pending writes and ask the system to sync. Call it when the app goes to background.

**Returns:** <code>Promise&lt;<a href="#synchronizeresult">SynchronizeResult</a>&gt;</code>

--------------------


### isAvailable()

```typescript
isAvailable() => Promise<AvailabilityResult>
```

Check whether values actually leave the device and which backend is used.

**Returns:** <code>Promise&lt;<a href="#availabilityresult">AvailabilityResult</a>&gt;</code>

--------------------


### addListener('change', ...)

```typescript
addListener(eventName: 'change', listenerFunc: (event: ChangeEvent) => void) => Promise<PluginListenerHandle>
```

Listen for values changed by another device (iOS only; never fires on Android and Web).

| Param              | Type                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| **`eventName`**    | <code>'change'</code>                                                   |
| **`listenerFunc`** | <code>(event: <a href="#changeevent">ChangeEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Remove every listener added by this plugin.

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<PluginVersionResult>
```

Returns the platform implementation version marker.

**Returns:** <code>Promise&lt;<a href="#pluginversionresult">PluginVersionResult</a>&gt;</code>

--------------------


### Interfaces


#### GetResult

Result of reading one value.

| Prop        | Type                        | Description                                           |
| ----------- | --------------------------- | ----------------------------------------------------- |
| **`value`** | <code>string \| null</code> | Stored string, or `null` when the key does not exist. |


#### GetOptions

Options for reading one value.

| Prop      | Type                | Description                                       |
| --------- | ------------------- | ------------------------------------------------- |
| **`key`** | <code>string</code> | Key to read. iOS limits keys to 64 bytes (UTF-8). |


#### SetOptions

Options for writing one value.

| Prop        | Type                | Description                                                                                                        |
| ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **`key`**   | <code>string</code> | Key to write. iOS limits keys to 64 bytes (UTF-8).                                                                 |
| **`value`** | <code>string</code> | String to store. Serialize objects with `JSON.stringify`. On iOS the whole store is limited to 1 MB and 1024 keys. |


#### RemoveOptions

Options for deleting one value.

| Prop      | Type                | Description    |
| --------- | ------------------- | -------------- |
| **`key`** | <code>string</code> | Key to delete. |


#### GetAllResult

Result of reading every value.

| Prop         | Type                                                            | Description                            |
| ------------ | --------------------------------------------------------------- | -------------------------------------- |
| **`values`** | <code><a href="#record">Record</a>&lt;string, string&gt;</code> | Every stored key and its string value. |


#### SynchronizeResult

Result of a synchronize request.

| Prop               | Type                 | Description                                                                                                                                           |
| ------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`synchronized`** | <code>boolean</code> | `true` when the in-memory values were written to disk and queued for upload. This does not mean the upload finished: the system decides when to sync. |


#### AvailabilityResult

Availability of the cloud store.

| Prop            | Type                                                        | Description                                                                                                                    |
| --------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **`available`** | <code>boolean</code>                                        | `true` when values will leave the device (iOS: signed in to iCloud; Android: always `true`, backup itself is user-controlled). |
| **`backend`**   | <code><a href="#icloudkvbackend">ICloudKVBackend</a></code> | Storage backend used on this platform.                                                                                         |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### ChangeEvent

Payload of the `change` event.

| Prop         | Type                                                  | Description                                                       |
| ------------ | ----------------------------------------------------- | ----------------------------------------------------------------- |
| **`keys`**   | <code>string[]</code>                                 | Keys whose value changed. Read them again with `get` or `getAll`. |
| **`reason`** | <code><a href="#changereason">ChangeReason</a></code> | Why the values changed.                                           |


#### PluginVersionResult

Plugin version payload.

| Prop          | Type                | Description                                                 |
| ------------- | ------------------- | ----------------------------------------------------------- |
| **`version`** | <code>string</code> | Version identifier returned by the platform implementation. |


### Type Aliases


#### Record

Construct a type with a set of properties K of type T

<code>{
 [P in K]: T;
 }</code>


#### ICloudKVBackend

Where the values are stored on the current platform.

- `icloud`: iOS `NSUbiquitousKeyValueStore`, synced to every device signed in to the same Apple Account.
- `google-backup`: Android `SharedPreferences` included in Android Backup, restored when the app is installed on a new device.
- `local`: Web `localStorage`, never leaves the browser.

<code>'icloud' | 'google-backup' | 'local'</code>


#### ChangeReason

Why values changed from outside the app.

- `server`: another device pushed a newer value.
- `initialSync`: first download after install or after signing in.
- `quotaViolation`: the 1 MB / 1024 keys limit was exceeded; reduce what you store.
- `accountChange`: the user signed in to a different Apple Account; local values were replaced.

<code>'server' | 'initialSync' | 'quotaViolation' | 'accountChange'</code>

</docgen-api>
