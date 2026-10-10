import Foundation
import Capacitor

@objc(ICloudKVPlugin)
public class ICloudKVPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ICloudKVPlugin"
    public let jsName = "ICloudKV"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "get", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAll", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "synchronize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPluginVersion", returnType: CAPPluginReturnPromise)
    ]

    private let implementation = ICloudKV()

    override public func load() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(storeDidChange(_:)),
            name: NSUbiquitousKeyValueStore.didChangeExternallyNotification,
            object: NSUbiquitousKeyValueStore.default
        )
        // Pull the latest values from iCloud as soon as the app starts.
        _ = implementation.synchronize()
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    @objc private func storeDidChange(_ notification: Notification) {
        let info = notification.userInfo ?? [:]
        let keys = info[NSUbiquitousKeyValueStoreChangedKeysKey] as? [String] ?? []
        let code = info[NSUbiquitousKeyValueStoreChangeReasonKey] as? Int ?? NSUbiquitousKeyValueStoreServerChange
        notifyListeners("change", data: ["keys": keys, "reason": ICloudKV.reasonName(code)])
    }

    @objc func get(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("key is required")
            return
        }
        call.resolve(["value": implementation.get(key) ?? NSNull()])
    }

    @objc func set(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), let value = call.getString("value") else {
            call.reject("key and value are required")
            return
        }
        implementation.set(key, value)
        call.resolve()
    }

    @objc func remove(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("key is required")
            return
        }
        implementation.remove(key)
        call.resolve()
    }

    @objc func getAll(_ call: CAPPluginCall) {
        call.resolve(["values": implementation.getAll()])
    }

    @objc func synchronize(_ call: CAPPluginCall) {
        call.resolve(["synchronized": implementation.synchronize()])
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": implementation.isAvailable(), "backend": "icloud"])
    }

    @objc func getPluginVersion(_ call: CAPPluginCall) {
        call.resolve(["version": implementation.getPluginVersion()])
    }
}
