# ZAZO PLAYER PERSONAL — FIXED Xcode Project

Bu paket artık **gerçek bir `.xcodeproj`** içerir. XcodeGen veya Terminal komutu gerekmez.

## Açılış
1. ZIP'i Mac'te çıkar.
2. `ZAZOPlayerPersonal.xcodeproj` dosyasına çift tıkla.
3. Xcode → **ZAZOPlayerPersonal target → Signing & Capabilities → Team** alanında kendi Apple Developer takımını seç.
4. Gerekirse Bundle Identifier'ı sana özel benzersiz bir değer yap (ör. `com.seninadın.zazoplayer`).
5. Apple Developer → Certificates, Identifiers & Profiles → Identifiers → bu Bundle ID → **App Services → MusicKit** açık olmalı.
6. iPhone'u seçip Run (▶) yap.

## Kullanım
- Uygulama doğrudan **Ara** ekranında açılır.
- İlk kullanımda Apple Music erişim izni istenir.
- Şarkı/sanatçı yaz → sonuç → ▶ → uygulama içinde çal.
- Favoriler cihazda saklanır.
- Arka plan sesi `UIBackgroundModes = audio` ile açık.

## Gereksinim
- iOS 17+
- Apple Music katalog erişimi / tam parça oynatma için uygun Apple Music hesabı ve üyelik gerekir.
- MusicKit, App ID üzerinde **App Service** olarak etkinleştirilir; ekstra `com.apple.developer.musickit` entitlement ekleme.

## Önceki paketteki hata
Önceki ZIP'te `ZAZOPlayerPersonal.xcodeproj` klasörü boştu. Bu sürümde `project.pbxproj` ve shared scheme gerçek olarak eklendi.
