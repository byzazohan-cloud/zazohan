# ZAZO PLAYER V1.3.6 STABILITY LIBRARY

Bu sürüm, yeni sade/premium tasarımın çalışan uygulama sürümüdür.

- Uygulama doğrudan müzik arama ekranında açılır.
- 30 saniyelik önizleme sonuçları gösterilmez; yalnızca tam oynatılabilen kaynaklar listelenir.
- Alt menü: Ara / Kütüphane / Listeler / İndirilenler.
- Ayarlar sağ üstteki dişli simgesine taşındı.
- Video özelliği kaldırılmadı; yan menüden erişilebilir.
- Yeni koyu + pembe ZAZO tasarım dili eklendi.
- Açılış ekranı ve sade oynatıcı görünümü eklendi.
- Favori, çalma listesi, çevrimdışı dosya ve kendi medya dosyaları korunur.
- Düşük güç modu korunur.

İnternet kaynakları `config.js` üzerinden yapılandırılır. API anahtarlarını yalnızca uygun alan adı/API kısıtlamalarıyla kullanın.


## V1.3.6 düzeltmeleri
- Arama sonuçlarındaki iç içe buton yapısı kaldırıldı; iPhone dokunma davranışı düzeltildi.
- Kütüphane artık geçici arama sonuçlarını kalıcı içerik gibi göstermiyor.
- Kütüphane Şarkılar / Sanatçılar / Albümler / Dosyalar olarak ayrıldı.
- Çalma listesi sonunda otomatik olarak alakasız şarkı eklenmesi engellendi.
- Otomatik sıra genişletme yalnızca internet arama sonuçlarından başlatılan müzikte çalışıyor.
- Sıra genişletme aynı şarkının farklı sürümlerini tekrar eklememeye çalışıyor.


## V1.3.6 katalog düzeltmesi
- Katalog bağlı değilken artık yanlış biçimde 'müzik yok' denmez.
- Ayarlar > Müzik kataloğu > Bağla ile YouTube Data API anahtarı bir kez cihazda saklanabilir.
- Sonrasında kullanıcı yalnızca arama çubuğunu kullanır.
- Geniş katalog bağlı değilse açık kaynak araması sürer ve gerektiğinde YouTube web araması seçeneği sunulur.


## V1.3.6 arama ekranında oynatma
- Şarkı sonucu artık arama ekranından ayrılmadan çalar.
- Arama ekranında Şimdi Çalıyor kartı açılır.
- Oynat/durdur, önceki/sonraki, süre çubuğu, favori ve liste kontrolleri aynı ekrandadır.
- YouTube sonucu varsa resmi gömülü oynatıcı aynı arama ekranında açılır.
- İstenirse Tam ekran düğmesiyle geniş oynatıcı açılabilir.
