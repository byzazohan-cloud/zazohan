# ZAZO PLAYER V1.2.9 STABILITY

V1.2.8 yeniden tarandı ve yayın öncesi kararlılık sorunları giderildi.

## Düzeltilenler
- Arama timeout'u artık kullanıcı iptali sanılmıyor; servisler yanıt vermezse doğru hata mesajı gösteriliyor.
- Internet Archive keşfi bir sorgu başarısız olduğunda tamamen çökmüyor; çalışan sonuçlar gösteriliyor.
- iPhone/Safari'de kaldığın yerden devam, medya metadata'sı hazır olduktan sonra uygulanıyor.
- Ana müzik oynat/duraklat düğmesi gerçek oynatma durumuyla senkron tutuluyor; autoplay engellenirse yanlış simge kalmıyor.
- Eski bir ses kaynağından gecikmeli gelen hata yeni şarkının fallback zincirini yanlışlıkla tetiklemiyor.
- YouTube eski oynatıcı event'leri yeni içeriğin kuyruğunu/fallback'ini etkileyemiyor.
- OPFS dosyası sistem tarafından silinmişse hayalet “İndirildi” kaydı açılışta temizleniyor.
- UI kartları artık her kart için bütün kuyruğu kopyalamıyor; RAM tüketimi azaltıldı.
- Oynatıcıdaki “Sıradaki” satırları ana sekme yeniden çizilse bile çalışmaya devam ediyor.
- Çalma listelerinde içerikleri yukarı/aşağı taşıma eklendi.
- Eski oynatma konumları sınırsız büyümemesi için kontrollü temizleniyor.
- localStorage erişimi engellenen ortamlarda uygulamanın açılışta çökme riski azaltıldı.
- Kalıcı depolama izninin durumu Ayarlar ekranında gösteriliyor.
- Uygulama kabuğu Service Worker'da ağ yanıtını en fazla 3.5 saniye bekliyor; çevrimdışı açılış hızlandırıldı.
- Manifest'e id/scope/lang/açıklama ve maskable ikon amacı eklendi.

## İnternet kaynakları
`config.js` içindeki YouTube API anahtarı ve Jamendo client ID uygulama sahibine aittir. Statik GitHub Pages yayınında anahtar görünür olacağından YouTube anahtarını yayın domainine/referrer'a göre kısıtla.

YouTube oynatma resmi gömülü oynatıcıyla yapılır. iOS/YouTube kuralları nedeniyle ekran kilidinde arka plan oynatma garanti edilmez.

## Ek tarama düzeltmeleri
- Kullanıcı arama devam ederken başka sekmeye geçerse tamamlanan arama artık o sekmenin ekranını zorla açmıyor.
- Aynı isimli fakat farklı sanatçıların şarkılarının yanlış fallback grubuna girmesi engellendi.
- YouTube kanal adlarındaki yaygın `VEVO / Records / Topic` gürültüsü eşleştirmede temizleniyor.
- Doğrulanmamış Archive sonucu, YouTube bağlıysa otomatik olarak daha güvenilir arama sonucunun önüne geçmiyor.
- Yeni video açarken eski video elemanı tamamen durdurulup kaynağı boşaltılıyor; arkada ses/video kalma riski kapatıldı.
- Archive dosyası çözülürken kullanıcı başka içeriğe geçerse metadata isteği iptal ediliyor.
- Büyük indirmede tarayıcı streaming desteklemiyorsa yüzlerce MB verinin RAM'e alınması engelleniyor.
- Kapak görseli indirme isteğine de timeout eklendi.
- IndexedDB tek bağlantı üzerinden kullanılıyor ve yazma/silme işlemleri transaction tamamlandığında başarılı sayılıyor.
- Kütüphane ve oynatıcı kart kayıtları her yeniden çizimde temizleniyor; uzun kullanımda UI kayıtlarının büyümesi önlendi.
