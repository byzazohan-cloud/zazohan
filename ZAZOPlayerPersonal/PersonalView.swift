import SwiftUI
import MusicKit

struct PersonalView: View {
    @EnvironmentObject private var model: MusicAppModel

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Sana özel")
                        .font(.largeTitle.bold())

                    VStack(alignment: .leading, spacing: 12) {
                        Label("Reklamsız", systemImage: "nosign")
                        Label("Apple Music kataloğunda arama", systemImage: "magnifyingglass")
                        Label("Zazaca / Kürtçe hızlı arama", systemImage: "music.quarternote.3")
                        Label("Arka planda oynatma", systemImage: "iphone.and.arrow.forward")
                    }
                    .padding(18)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(ZazoTheme.card, in: RoundedRectangle(cornerRadius: 20))

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Bağlantı")
                            .font(.headline)
                        Text(model.authorizationStatus == .authorized ? "Apple Music bağlı" : "Apple Music bağlantısı gerekli")
                            .foregroundStyle(model.authorizationStatus == .authorized ? .green : .secondary)

                        if model.authorizationStatus != .authorized {
                            Button("Apple Music'e bağlan") {
                                Task { await model.requestAuthorization() }
                            }
                            .buttonStyle(.borderedProminent)
                            .tint(.pink)
                        }
                    }
                    .padding(18)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(ZazoTheme.card, in: RoundedRectangle(cornerRadius: 20))

                    Text("Tam parça oynatma, Apple Music hesabının katalog erişimi ve üyelik durumuna bağlıdır.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
                .padding(18)
            }
            .background(ZazoTheme.background.ignoresSafeArea())
            .navigationBarHidden(true)
        }
    }
}
