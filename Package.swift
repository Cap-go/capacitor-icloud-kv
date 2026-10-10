// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoCapacitorICloudKV",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapgoCapacitorICloudKV",
            targets: ["ICloudKVPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "ICloudKVPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/ICloudKVPlugin"),
        .testTarget(
            name: "ICloudKVPluginTests",
            dependencies: ["ICloudKVPlugin"],
            path: "ios/Tests/ICloudKVPluginTests")
    ]
)
