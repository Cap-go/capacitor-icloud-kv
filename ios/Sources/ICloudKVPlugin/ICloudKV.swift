import Foundation

/// Thin wrapper around `NSUbiquitousKeyValueStore` that only stores strings.
@objc public class ICloudKV: NSObject {
    private let store: NSUbiquitousKeyValueStore

    public init(store: NSUbiquitousKeyValueStore = .default) {
        self.store = store
        super.init()
    }

    public func get(_ key: String) -> String? {
        return store.string(forKey: key)
    }

    public func set(_ key: String, _ value: String) {
        store.set(value, forKey: key)
    }

    public func remove(_ key: String) {
        store.removeObject(forKey: key)
    }

    public func getAll() -> [String: String] {
        return store.dictionaryRepresentation.compactMapValues { $0 as? String }
    }

    public func synchronize() -> Bool {
        return store.synchronize()
    }

    public func isAvailable() -> Bool {
        return FileManager.default.ubiquityIdentityToken != nil
    }

    public static func reasonName(_ code: Int) -> String {
        switch code {
        case NSUbiquitousKeyValueStoreInitialSyncChange: return "initialSync"
        case NSUbiquitousKeyValueStoreQuotaViolationChange: return "quotaViolation"
        case NSUbiquitousKeyValueStoreAccountChange: return "accountChange"
        default: return "server"
        }
    }

    @objc public func getPluginVersion() -> String {
        return "native"
    }
}
