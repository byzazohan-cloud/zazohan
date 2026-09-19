import SwiftUI
import MusicKit

struct MiniPlayer: View {
    @EnvironmentObject private var model: MusicAppModel
    let song: Song
    @Binding var showPlayer: Bool

    var body: some View {
        HStack(spacing: 12) {
            ArtworkThumb(artwork: song.artwork, size: 48)
            VStack(alignment: .leading, spacing: 2) {
                Text(song.title).font(.subheadline.bold()).lineLimit(1)
                Text(song.artistName).font(.caption).foregroundStyle(.secondary).lineLimit(1)
            }
            Spacer()
            Button {
                Task { await model.togglePlayPause() }
            } label: {
                Image(systemName: model.isPlaying ? "pause.fill" : "play.fill")
                    .font(.title3)
            }
            Button {
                Task { await model.next() }
            } label: {
                Image(systemName: "forward.fill")
            }
        }
        .padding(10)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.white.opacity(0.08)))
        .contentShape(Rectangle())
        .onTapGesture { showPlayer = true }
    }
}

struct FullPlayerView: View {
    @EnvironmentObject private var model: MusicAppModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            ZazoTheme.background.ignoresSafeArea()
            if let song = model.currentSong {
                VStack(spacing: 24) {
                    HStack {
                        Button { dismiss() } label: {
                            Image(systemName: "chevron.down")
                                .font(.title2.bold())
                        }
                        Spacer()
                        Text("ŞİMDİ ÇALIYOR")
                            .font(.caption.bold())
                            .foregroundStyle(.secondary)
                        Spacer()
                        Color.clear.frame(width: 28, height: 28)
                    }

                    ArtworkThumb(artwork: song.artwork, size: 320)
                        .shadow(color: .pink.opacity(0.16), radius: 30)

                    VStack(spacing: 7) {
                        Text(song.title)
                            .font(.title2.bold())
                            .multilineTextAlignment(.center)
                        Text(song.artistName)
                            .font(.title3)
                            .foregroundStyle(.secondary)
                    }

                    HStack(spacing: 44) {
                        Button {
                            Task { await model.previous() }
                        } label: {
                            Image(systemName: "backward.fill").font(.title)
                        }

                        Button {
                            Task { await model.togglePlayPause() }
                        } label: {
                            Image(systemName: model.isPlaying ? "pause.fill" : "play.fill")
                                .font(.system(size: 32, weight: .bold))
                                .frame(width: 76, height: 76)
                                .background(Color.pink, in: Circle())
                                .foregroundStyle(.white)
                        }

                        Button {
                            Task { await model.next() }
                        } label: {
                            Image(systemName: "forward.fill").font(.title)
                        }
                    }

                    Button {
                        model.toggleFavorite(song)
                    } label: {
                        Label(model.isFavorite(song) ? "Favorilerden çıkar" : "Favorilere ekle", systemImage: model.isFavorite(song) ? "heart.fill" : "heart")
                    }
                    .buttonStyle(.bordered)
                    .tint(.pink)

                    Spacer()
                }
                .padding(22)
            } else {
                ContentUnavailableView("Henüz şarkı yok", systemImage: "music.note")
            }
        }
    }
}

struct ArtworkThumb: View {
    let artwork: Artwork?
    let size: CGFloat

    var body: some View {
        Group {
            if let url = artwork?.url(width: Int(size * 2), height: Int(size * 2)) {
                AsyncImage(url: url) { image in
                    image.resizable().scaledToFill()
                } placeholder: {
                    placeholder
                }
            } else {
                placeholder
            }
        }
        .frame(width: size, height: size)
        .clipShape(RoundedRectangle(cornerRadius: max(10, size * 0.08), style: .continuous))
    }

    private var placeholder: some View {
        ZStack {
            LinearGradient(colors: [.pink.opacity(0.9), .purple.opacity(0.8)], startPoint: .topLeading, endPoint: .bottomTrailing)
            Image(systemName: "music.note")
                .font(.system(size: size * 0.32, weight: .bold))
                .foregroundStyle(.white)
        }
    }
}
