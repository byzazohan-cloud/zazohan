import SwiftUI

@main
struct ZAZOPlayerPersonalApp: App {
    @StateObject private var model = MusicAppModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(model)
                .preferredColorScheme(.dark)
        }
    }
}
