import SwiftUI
import MusicKit

struct RootView: View {
    @EnvironmentObject private var model: MusicAppModel
    @State private var selection = 0
    @State private var showPlayer = false

    var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $selection) {
                SearchView(showPlayer: $showPlayer)
                    .tag(0)
                    .tabItem { Label("Ara", systemImage: "magnifyingglass") }

                FavoritesView(showPlayer: $showPlayer)
                    .tag(1)
                    .tabItem { Label("Favoriler", systemImage: "heart.fill") }

                PersonalView()
                    .tag(2)
                    .tabItem { Label("Benim", systemImage: "person.crop.circle") }
            }
            .tint(.pink)

            if let song = model.currentSong {
                MiniPlayer(song: song, showPlayer: $showPlayer)
                    .padding(.horizontal, 12)
                    .padding(.bottom, 58)
            }
        }
        .sheet(isPresented: $showPlayer) {
            FullPlayerView()
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
        }
        .alert("ZAZO PLAYER", isPresented: Binding(
            get: { model.message != nil },
            set: { if !$0 { model.message = nil } }
        )) {
            Button("Tamam", role: .cancel) { model.message = nil }
        } message: {
            Text(model.message ?? "")
        }
    }
}
