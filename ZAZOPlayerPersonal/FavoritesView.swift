import SwiftUI

struct FavoritesView: View {
    @EnvironmentObject private var model: MusicAppModel
    @Binding var showPlayer: Bool

    var body: some View {
        NavigationStack {
            Group {
                if model.favorites.isEmpty {
                    ContentUnavailableView("Favorilerin boş", systemImage: "heart", description: Text("Arama sonuçlarında kalbe dokunarak şarkı ekleyebilirsin."))
                } else {
                    List(model.favorites) { favorite in
                        Button {
                            Task { await model.playFavorite(favorite) }
                        } label: {
                            HStack(spacing: 12) {
                                FavoriteArtwork(urlString: favorite.artworkURL)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(favorite.title).foregroundStyle(.primary)
                                    Text(favorite.artist).font(.caption).foregroundStyle(.secondary)
                                }
                                Spacer()
                                Image(systemName: "play.fill").foregroundStyle(.pink)
                            }
                        }
                    }
                    .scrollContentBackground(.hidden)
                }
            }
            .background(ZazoTheme.background.ignoresSafeArea())
            .navigationTitle("Favoriler")
        }
    }
}

private struct FavoriteArtwork: View {
    let urlString: String?
    var body: some View {
        Group {
            if let s = urlString, let url = URL(string: s) {
                AsyncImage(url: url) { image in
                    image.resizable().scaledToFill()
                } placeholder: {
                    Color.white.opacity(0.05)
                }
            } else {
                ZStack {
                    Color.white.opacity(0.05)
                    Image(systemName: "music.note").foregroundStyle(.pink)
                }
            }
        }
        .frame(width: 48, height: 48)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
