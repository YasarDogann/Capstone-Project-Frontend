# Capstone Project - Kütüphane Yönetim Sistemi

Bu proje, React Router kullanarak tek sayfalık bir uygulama (SPA) geliştirilmesini amaçlayan bir kitap yönetim sistemi örneğidir. Kullanıcılar, kitaplarla ilgili CRUD işlemleri yapabilirler. Yayımcı, kategori, kitap, yazar ve kitap alma işlemleri üzerinde gerçekleştirebilecekleri işlemler mevcuttur.

## Proje Özeti

React Router kullanarak uygulama tek sayfa (SPA) şeklinde geliştirilmiştir. Her sayfada ilgili CRUD işlemleri yapılabilir. Ayrıca başarılı/başarısız operasyonlar sonucu kullanıcı bilgilendirilmektedir (window.alert kullanılmaz). Tasarım özgür olup, Responsive tasarım yapılmamıştır ve 1200px genişliğinde çalışması yeterlidir.

Proje, Backend ve Database üzerinden işlem yapabilmek için ilgili yapılandırmalar yapılmış ve canlıya alınmıştır. 

## Özellikler

- **Yayımcı**: Yayımcı bilgilerini görüntüleme, ekleme, güncelleme ve silme işlemleri.
- **Kategori**: Kitap kategorilerini görüntüleme, ekleme, güncelleme ve silme işlemleri.
- **Kitap**: Kitap bilgilerini görüntüleme, ekleme, güncelleme ve silme işlemleri.
- **Yazar**: Yazar bilgilerini görüntüleme, ekleme, güncelleme ve silme işlemleri.
- **Kitap Alma**: Kullanıcıların kitap satın alabilmesi.

## Kullanılacak Teknolojiler

- **Frontend**: React, React Router
- **Backend**: (Backend yapılandırması sizinle paylaşılacaktır)
- **CSS Framework**: Tailwind, Material veya Bootstrap (Seçiminize bağlı)
- **API Bağlantısı**: Axios
- **Veritabanı**: (Backend tarafından sağlanan veritabanı)

## Başlangıç

### Gereksinimler

- Node.js
- npm (veya yarn)

### Projeyi Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için şu adımları izleyin:

1. **Proje dosyalarını indirin**
   ```bash
   git clone https://github.com/YasarDogann/Capstone-Project-Frontend.git

2. **Gerekli bağımlılıkları yükleyin**
    ```
    cd book-management-system
    npm install
    ```

3. **Projeyi başlatın**
     ```
     npm start


### CRUD İşlemleri
Her sayfada (Yayımcı, Kategori, Kitap, Yazar, Kitap Alma) aşağıdaki CRUD işlemleri yapılabilir:

## Yayımcı :
    - Okuma: Yayımcıların listesini görüntüleme.
    - Ekleme: Yeni yayımcı ekleme.
    - Güncelleme: Mevcut yayımcıyı güncelleme.
    - Silme: Yayımcıyı silme.

## Kategori :
    - Okuma: Kategorileri görüntüleme.
    - Ekleme: Yeni kategori ekleme.
    - Güncelleme: Mevcut kategoriyi güncelleme.
    - Silme: kategori silme.

## Kitap :
    - Okuma: Kitapları listeleme.
    - Ekleme: Yeni kitap ekleme.
    - Güncelleme: Kitap güncelleme.
    - Silme: Kitap silme.

## Yazar :
    - Okuma: Yazarları görüntüleme.
    - Ekleme: Yeni yazar ekleme.
    - Güncelleme: Mevcut yazar bilgilerini güncelleme.
    - Silme:  yazarı silme.

## Ödünç Alma : 
    - Okuma : ödünç alınan kitap bilgilerini görüntüler
    - Ekleme : Ödünç alınan kitap bilgilerini ekle
    - Güncelleme : Ödünç alınan kitabın iade tarihi ve ödünç alan kişi adı güncelleme
    - Silme : Bilgileri silme

# Ekran Görüntüleri
 ## Anasayfa :
 ![Anasayfa](https://github.com/user-attachments/assets/c7d0c7d4-9313-4893-8e74-202980f3116d)


 ## Yayınevi : 
 ![yayınevi](https://github.com/user-attachments/assets/b220d437-8df6-419b-8522-43f33d95d042)


 ## Kategori : 
 ![Kategori](https://github.com/user-attachments/assets/b5c31930-0563-4658-a42f-e3a98d8ed0c8)


 ## Kitap : 
 ![Kitap](https://github.com/user-attachments/assets/9def080d-86df-48dd-9551-b73857ee1239)
 ![kitapekle](https://github.com/user-attachments/assets/06d45a73-816a-4803-a441-65cd03d7d579)


 ## Yazar :
 ![Yazar](https://github.com/user-attachments/assets/f6378568-7d6d-4ae2-9f4a-8e46c6986e96)


 ## Ödünç Alınan Kitaplar :
 ![Ödünç](https://github.com/user-attachments/assets/7f792118-d11d-4bb0-a3b3-5cb18c67072e)
