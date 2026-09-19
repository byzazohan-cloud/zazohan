# ZAZO PLAYER PERSONAL — MusicKit sürümü

Bu sürüm web/PWA değil, **gerçek iPhone uygulaması** için hazırlanmış SwiftUI + MusicKit projesidir.

## Ne yapıyor?
- Uygulama doğrudan **Ara** ekranında açılır.
- Şarkı veya sanatçı yazılır, Apple Music kataloğunda aranır.
- Sonuçtaki ▶ düğmesiyle şarkı uygulamadan çıkmadan çalar.
- Reklam yoktur.
- Zazaca / Kürtçe / Kırmancki / Türkçe hızlı arama düğmeleri vardır.
- Favoriler cihazda tutulur.
- Arka plan sesi açıktır.

## İlk kurulum — bir kez
1. Apple Developer hesabında **Certificates, Identifiers & Profiles → Identifiers** bölümüne gir.
2. `com.zazo.playerpersonal` (veya Xcode'da kullanacağın kendi bundle ID) için bir App ID oluştur.
3. App ID içindeki **App Services** sekmesinde **MusicKit** seçeneğini aç.
4. Projeyi Xcode'da aç, **Signing & Capabilities → Team** alanından kendi takımını seç.
5. Gerçek iPhone'a yükle. Apple'ın güncel örnek projesi MusicKit testinin gerçek cihazda yapılmasını istiyor.
6. İlk açılışta Apple Music erişimine izin ver.

> Apple platformlarında Swift MusicKit, kullanıcı token yönetimini otomatik yapar. Uygulamanın içine YouTube API anahtarı koyman gerekmez.

## Xcode projesi
Bu klasörde hem kaynak dosyalar hem de `project.yml` vardır. Mac'te XcodeGen kullanıyorsan:

```bash
brew install xcodegen
cd ZAZO_PLAYER_PERSONAL_MUSICKIT
xcodegen generate
open ZAZOPlayerPersonal.xcodeproj
```

İstersen Xcode'da boş bir iOS App projesi açıp `ZAZOPlayerPersonal` klasöründeki Swift dosyalarını da doğrudan ekleyebilirsin.

## Önemli
Tam parça oynatma, Apple Music kataloğundaki içeriğe ve kullanıcının Apple Music erişimine/üyeliğine bağlıdır. Hiçbir uygulama internetteki her telifli şarkıyı sınırsız ve izinsiz oynatmayı garanti edemez.
