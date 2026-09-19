import SwiftUI
import MusicKit

struct SearchView: View {
    @EnvironmentObject private var model: MusicAppModel
    @Binding var showPlayer: Bool

    private let quickTerms = ["Zazaca", "Kürtçe", "Kırmancki", "Türkçe"]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    header
                    searchBox
                    quickButtons

                    if model.authorizationStatus != .authorized {
                        authorizationCard
                    }

                    if model.isSearching {
                        HStack(spacing: 10) {
                            ProgressView()
                            Text("Müzik aranıyor…")
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 18)
                    }

                    if !model.songs.isEmpty {
                        Text("Şarkılar")
                            .font(.title2.bold())

                        LazyVStack(spacing: 10) {
                            ForEach(model.songs, id: \.id) { song in
                                SongRow(song: song) {
                                    Task { await model.play(song) }
                                }
                            }
                        }
                    } else if !model.query.isEmpty && !model.isSearching {
                        ContentUnavailableView("Şarkını ara", systemImage: "music.note.list", description: Text("Şarkı veya sanatçı adını yaz ve direkt dinle."))
                            .padding(.top, 26)
                    }
                }
                .padding(18)
                .padding(.bottom, model.currentSong == nil ? 20 : 92)
            }
            .background(ZazoTheme.background.ignoresSafeArea())
            .navigationBarHidden(true)
        }
    }

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("ZAZO PLAYER")
                    .font(.system(size: 30, weight: .black, design: .rounded))
                Text("Reklamsız kişisel müzik alanın")
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Image(systemName: "waveform.circle.fill")
                .font(.system(size: 40))
                .foregroundStyle(.pink)
        }
    }

    private var searchBox: some View {
        HStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(.secondary)
            TextField("Şarkı veya sanatçı ara…", text: $model.query)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .submitLabel(.search)
                .onSubmit { model.search() }
            if !model.query.isEmpty {
                Button {
                    model.query = ""
                    model.songs = []
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(.secondary)
                }
            }
            Button("Ara") { model.search() }
                .fontWeight(.bold)
        }
        .padding(.horizontal, 16)
        .frame(height: 56)
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.white.opacity(0.08)))
    }

    private var quickButtons: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(quickTerms, id: \.self) { term in
                    Button(term) { model.quickSearch(term) }
                        .buttonStyle(ZazoChipStyle())
                }
            }
        }
    }

    private var authorizationCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Apple Music kataloğuna bağlan", systemImage: "music.note")
                .font(.headline)
            Text("Bir kez izin ver. Sonrasında sadece şarkıyı ara ve dinle.")
                .foregroundStyle(.secondary)
            Button("Bağlan") {
                Task { await model.requestAuthorization() }
            }
            .buttonStyle(.borderedProminent)
            .tint(.pink)
        }
        .padding(16)
        .background(ZazoTheme.card, in: RoundedRectangle(cornerRadius: 20))
    }
}

struct SongRow: View {
    @EnvironmentObject private var model: MusicAppModel
    let song: Song
    let play: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            ArtworkThumb(artwork: song.artwork, size: 54)

            VStack(alignment: .leading, spacing: 4) {
                Text(song.title)
                    .font(.headline)
                    .lineLimit(1)
                Text(song.artistName)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }

            Spacer(minLength: 8)

            Button {
                model.toggleFavorite(song)
            } label: {
                Image(systemName: model.isFavorite(song) ? "heart.fill" : "heart")
                    .foregroundStyle(model.isFavorite(song) ? .pink : .secondary)
                    .frame(width: 34, height: 34)
            }
            .buttonStyle(.plain)

            Button(action: play) {
                Image(systemName: "play.fill")
                    .font(.headline)
                    .frame(width: 42, height: 42)
                    .background(Color.pink, in: Circle())
                    .foregroundStyle(.white)
            }
            .buttonStyle(.plain)
        }
        .padding(10)
        .background(ZazoTheme.card, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}
