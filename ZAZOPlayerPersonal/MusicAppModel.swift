import Foundation
import MusicKit

@MainActor
final class MusicAppModel: ObservableObject {
    @Published var query = ""
    @Published var songs: [Song] = []
    @Published var artists: [Artist] = []
    @Published var albums: [Album] = []
    @Published var isSearching = false
    @Published var message: String?
    @Published var currentSong: Song?
    @Published var isPlaying = false
    @Published var authorizationStatus: MusicAuthorization.Status = MusicAuthorization.currentStatus
    @Published var favorites: [FavoriteSong] = []

    let player = ApplicationMusicPlayer.shared
    private var searchTask: Task<Void, Never>?
    private let favoritesKey = "zazo.personal.favorites.v1"

    init() {
        loadFavorites()
    }

    func requestAuthorization() async {
        authorizationStatus = await MusicAuthorization.request()
        if authorizationStatus != .authorized {
            message = "Apple Music erişimine izin verilmesi gerekiyor."
        }
    }

    func search(_ term: String? = nil) {
        let raw = (term ?? query).trimmingCharacters(in: .whitespacesAndNewlines)
        guard raw.count >= 2 else {
            songs = []
            artists = []
            albums = []
            return
        }

        query = raw
        searchTask?.cancel()
        searchTask = Task { [weak self] in
            guard let self else { return }
            self.isSearching = true
            self.message = nil
            defer { self.isSearching = false }

            do {
                var request = MusicCatalogSearchRequest(term: raw, types: [Song.self, Artist.self, Album.self])
                request.limit = 30
                let response = try await request.response()
                guard !Task.isCancelled else { return }
                self.songs = Array(response.songs)
                self.artists = Array(response.artists)
                self.albums = Array(response.albums)
                if self.songs.isEmpty {
                    self.message = "Bu aramada şarkı bulunamadı. Farklı yazımla tekrar deneyebilirsin."
                }
            } catch is CancellationError {
                return
            } catch {
                self.message = "Arama yapılamadı: \(error.localizedDescription)"
            }
        }
    }

    func quickSearch(_ text: String) {
        query = text
        search(text)
    }

    func play(_ song: Song, from queue: [Song]? = nil) async {
        if authorizationStatus != .authorized {
            await requestAuthorization()
            guard authorizationStatus == .authorized else { return }
        }

        do {
            let source = queue?.isEmpty == false ? queue! : songs
            let playQueue = source.isEmpty ? [song] : source
            player.queue = ApplicationMusicPlayer.Queue(for: playQueue, startingAt: song)
            currentSong = song
            try await player.play()
            isPlaying = true
            addToRecent(song)
        } catch {
            message = "Bu şarkı oynatılamadı. Apple Music üyeliğini ve internet bağlantını kontrol et."
        }
    }

    func togglePlayPause() async {
        if isPlaying {
            player.pause()
            isPlaying = false
        } else {
            do {
                try await player.play()
                isPlaying = true
            } catch {
                message = "Oynatma başlatılamadı."
            }
        }
    }

    func next() async {
        do {
            try await player.skipToNextEntry()
            isPlaying = true
        } catch {
            message = "Sıradaki şarkıya geçilemedi."
        }
    }

    func previous() async {
        do {
            try await player.skipToPreviousEntry()
            isPlaying = true
        } catch {
            message = "Önceki şarkıya geçilemedi."
        }
    }

    func toggleFavorite(_ song: Song) {
        let id = song.id.rawValue
        if let index = favorites.firstIndex(where: { $0.id == id }) {
            favorites.remove(at: index)
        } else {
            favorites.insert(FavoriteSong(song: song), at: 0)
        }
        saveFavorites()
    }

    func isFavorite(_ song: Song) -> Bool {
        favorites.contains(where: { $0.id == song.id.rawValue })
    }

    func playFavorite(_ favorite: FavoriteSong) async {
        do {
            var request = MusicCatalogResourceRequest<Song>(matching: \.id, equalTo: MusicItemID(rawValue: favorite.id))
            request.limit = 1
            let response = try await request.response()
            if let song = response.items.first {
                await play(song, from: [song])
            } else {
                message = "Bu favori artık katalogda bulunamadı."
            }
        } catch {
            message = "Favori şarkı açılamadı."
        }
    }

    private func addToRecent(_ song: Song) {
        var recent = UserDefaults.standard.stringArray(forKey: "zazo.personal.recent") ?? []
        recent.removeAll(where: { $0 == song.id.rawValue })
        recent.insert(song.id.rawValue, at: 0)
        UserDefaults.standard.set(Array(recent.prefix(30)), forKey: "zazo.personal.recent")
    }

    private func loadFavorites() {
        guard let data = UserDefaults.standard.data(forKey: favoritesKey),
              let decoded = try? JSONDecoder().decode([FavoriteSong].self, from: data) else { return }
        favorites = decoded
    }

    private func saveFavorites() {
        guard let data = try? JSONEncoder().encode(favorites) else { return }
        UserDefaults.standard.set(data, forKey: favoritesKey)
    }
}

struct FavoriteSong: Codable, Identifiable, Hashable {
    let id: String
    let title: String
    let artist: String
    let artworkURL: String?

    init(song: Song) {
        id = song.id.rawValue
        title = song.title
        artist = song.artistName
        artworkURL = song.artwork?.url(width: 300, height: 300)?.absoluteString
    }
}
