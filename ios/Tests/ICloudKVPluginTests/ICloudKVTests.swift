import XCTest
@testable import ICloudKVPlugin

class ICloudKVTests: XCTestCase {
    func testReasonNames() {
        XCTAssertEqual(ICloudKV.reasonName(NSUbiquitousKeyValueStoreServerChange), "server")
        XCTAssertEqual(ICloudKV.reasonName(NSUbiquitousKeyValueStoreInitialSyncChange), "initialSync")
        XCTAssertEqual(ICloudKV.reasonName(NSUbiquitousKeyValueStoreQuotaViolationChange), "quotaViolation")
        XCTAssertEqual(ICloudKV.reasonName(NSUbiquitousKeyValueStoreAccountChange), "accountChange")
    }

    func testGetPluginVersion() {
        XCTAssertEqual("native", ICloudKV().getPluginVersion())
    }
}
