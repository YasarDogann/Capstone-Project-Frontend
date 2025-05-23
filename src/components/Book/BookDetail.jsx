import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const BookDetail = () => {
  const { id } = useParams(); // URL'den id parametresini al
  const navigate = useNavigate(); // Sayfa yönlendirme için navigate fonksiyonu
  const [book, setBook] = useState(null); // Kitap detaylarını tutan state
  const [loading, setLoading] = useState(true); // Yükleme durumu state'i

  // Kitap detaylarını API'den çeken efekt
  useEffect(() => {
    const fetchBook = async () => {
      try {
        // API'den kitap detaylarını al
        // _expand ile yazar ve yayınevi bilgilerini,
        // _embed ile kategori bilgilerini dahil ediyoruz
        const { data } = await api.get(`/books/${id}?_expand=author&_expand=publisher&_embed=categories`);
        setBook(data);
      } catch (err) {
        toast.error('Kitap bilgileri yüklenemedi'); // Hata durumunda kullanıcıyı bilgilendir
        console.error('Detay sayfası hatası:', err);
        navigate('/books'); // Kitaplar listesine yönlendir
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (!book) return <div className="not-found">Kitap bulunamadı</div>;

  // Ana render
  return (
    <div className="detail-wrapper">
      <div className="detail-header">
        <h1>{book.name}</h1>
        <div className="detail-buttons">
          <button 
          onClick={() => navigate(`/books/edit/${id}`)}
          className='submit-btn'
          >Düzenle</button>
          <button 
          onClick={() => navigate('/books')}
          className='cancel-btn'>Listeye Dön</button>
        </div>
      </div>

      <div className="detail-content-grid">
        <div className="detail-card">
          <h2>Genel Bilgiler</h2>
          <p><strong>ID:</strong> {book.id}</p>
          <p><strong>Yayın Yılı:</strong> {book.publicationYear}</p>
          <p><strong>Stok:</strong> {book.stock}</p>
        </div>

        <div className="detail-card">
          <h2>Yazar Bilgileri</h2>
          <p><strong>Ad:</strong> {book.author?.name || '-'}</p>
          <p><strong>Doğum Tarihi:</strong> {book.author?.birthDate || '-'}</p>
          <p><strong>Ülke:</strong> {book.author?.country || '-'}</p>
        </div>

        <div className="detail-card">
          <h2>Yayınevi Bilgileri</h2>
          <p><strong>Ad:</strong> {book.publisher?.name || '-'}</p>
          <p><strong>Kuruluş Yılı:</strong> {book.publisher?.establishmentYear || '-'}</p>
          <p><strong>Adres:</strong> {book.publisher?.address || '-'}</p>
        </div>

        <div className="detail-card">
          <h2>Kategoriler</h2>
          {book.categories?.length > 0 ? (
            <ul>
              {book.categories.map(category => (
                <li key={category.id}>
                  <strong>{category.name}:</strong> {category.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>Kategori bilgisi yok</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;