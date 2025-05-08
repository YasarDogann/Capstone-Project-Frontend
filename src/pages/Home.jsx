import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

// Kütüphane Yönetim Sistemi'ne genel bakış sağlayan Home bileşeni
const Home = () => {
  // Sistem içindeki çeşitli varlıkların sayısını tutmak için state (durum) tanımı
  const [dataCounts, setDataCounts] = useState({
    authors: 0,     // Yazar sayısı
    books: 0,       // Kitap sayısı
    publishers: 0,  // Yayınevi sayısı
    categories: 0,  // Kategori sayısı
    borrowings: 0,  // Ödünç alınan kitap sayısı
  });

  // Bileşen yüklendiğinde API'den verileri çekmek için useEffect kullanılı
  useEffect(() => {
    // API'den varlıkların sayısını çekmek için tanımlanan asenkron fonksiyon
    const fetchCounts = async () => {
      try {
        // Aynı anda birden fazla veri isteği gönderilir
        const [authors, books, publishers, categories, borrowings] = await Promise.all([
          api.get('/authors'),
          api.get('/books'),
          api.get('/publishers'),
          api.get('/categories'),
          api.get('/borrows'),
        ]);

        // Gelen verilerin uzunluklarıyla state güncellenir
        setDataCounts({
          authors: authors.data.length,
          books: books.data.length,
          publishers: publishers.data.length,
          categories: categories.data.length,
          borrowings: borrowings.data.length,
        });
      } catch (err) {
        console.error('Error fetching data counts:', err); // Veri çekme sırasında hata olursa konsola yazdırılır
      }
    };

    fetchCounts(); // Fonksiyon çağrılır
  }, []);

  return (
    // Ana sayfa için içerik kapsayıcısı
    <div className="page-content">
      <h1>Kütüphane Yönetim Sistemine Hoşgeldiniz...</h1>
      <ul className="list-container">
        <li>Authors: {dataCounts.authors}</li>
        <li>Books: {dataCounts.books}</li>
        <li>Publishers: {dataCounts.publishers}</li>
        <li>Categories: {dataCounts.categories}</li>
        <li>Borrowings: {dataCounts.borrowings}</li>
      </ul>
    </div>
  );
};

export default Home; // Home bileşeni dışa aktarılır, böylece diğer dosyalarda kullanılabilir
