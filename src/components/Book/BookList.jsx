import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const BookList = () => {
  const [books, setBooks] = useState([]); // Kitapları saklamak için state
  const [loading, setLoading] = useState(true); // Yüklenme durumunu takip eden state
  const [searchTerm, setSearchTerm] = useState(''); // Arama çubuğu için girilen terimi saklayan state

   // API'den kitap verilerini getiren fonksiyo
  const fetchBooks = async () => {
    try {
      // Yazar ve yayınevi bilgilerini genişleterek kitapları çekiyoruz
      const { data } = await api.get('/books?_expand=author&_expand=publisher&_embed=categories');
      setBooks(data); // Kitapları state'e kaydet
    } catch (error) {
      toast.error('Kitaplar yüklenemedi'); // Hata oluşursa kullanıcıya bildirim göster
      console.error(error);
    } finally {
      setLoading(false); // Yükleme tamamlandı
    }
  };

  // Sayfa yüklendiğinde kitapları getir
  useEffect(() => {
    fetchBooks();
  }, []);

  // Kitabı silmek için fonksiyon
  const handleDelete = async (id) => {
    if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/books/${id}`); // API üzerinden sil
        toast.success('Kitap silindi!'); // Başarı bildirimi
        fetchBooks(); // Listeyi güncelle
      } catch (error) {
        toast.error(error.response?.data?.message || 'Silme işlemi başarısız');
      }
    }
  };

  // Arama terimine göre kitapları filtrele
  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Veriler yükleniyorsa "Yükleniyor" mesajı göster
  if (loading) return <div className="loading">Yükleniyor...</div>;


  return (
    <div className="table-list-container">
      <div className="header">
        <h1>Kitap Listesi</h1>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Kitap veya yazar ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <Link to="/books/new" className="add-button">
            <span>+</span> Yeni Kitap Ekle
          </Link>
        </div>
      </div>
  
      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kitap Adı</th>
              <th>Yayınlanma Tarihi</th>
              <th>Yazar</th>
              <th>Yayınevi</th>
              <th>Kategoriler</th>
              <th>Stok</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.id}>
                <td data-label="ID">{book.id}</td>
                <td data-label="Kitap Adı">
                  <Link to={`/books/detail/${book.id}`} className="name-link">
                    {book.name}
                  </Link>
                </td>
                <td>{book.publicationYear}</td>
                <td data-label="Yazar">{book.author?.name || '-'}</td>
                <td data-label="Yayınevi">{book.publisher?.name || '-'}</td>
                <td data-label="Kategoriler">
                  {book.categories?.map(c => c.name).join(', ') || '-'}
                </td>
                <td data-label="Stok">
                  <span className={`stock-badge ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {book.stock > 0 ? 'Mevcut' : 'Tükendi'}
                  </span>
                </td>
                <td data-label="İşlemler" className="actions">
                  <Link to={`/books/edit/${book.id}`} className="action-btn edit">
                    <svg viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </Link>
                  <button onClick={() => handleDelete(book.id)} className="action-btn delete">
                    <svg viewBox="0 0 24 24"  fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  // return (
  //   <div className="book-list-container">
  //     <div className="header">
  //       <h1>Kitap Listesi</h1>
  //       <Link to="/books/new" className="add-button">+ Yeni Kitap</Link>
  //     </div>

  //     <div className="search-bar">
  //       <input
  //         type="text"
  //         placeholder="Kitap veya yazar ara..."
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //       />
  //     </div>

  //     <table>
  //       <thead>
  //         <tr>
  //           <th>ID</th>
  //           <th>Kitap Adı</th>
  //           <th>Yayın Yılı</th>
  //           <th>Yazar</th>
  //           <th>Yayınevi</th>
  //           <th>Kategoriler</th>
  //           <th>Stok</th>
  //           <th>İşlemler</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {filteredBooks.map(book => (
  //           <tr key={book.id}>
  //             <td>{book.id}</td>
  //             <td>
  //               <Link to={`/books/detail/${book.id}`}>{book.name}</Link>
  //             </td>
  //             <td>{book.publicationYear}</td>
  //             <td>{book.author?.name || '-'}</td>
  //             <td>{book.publisher?.name || '-'}</td>
  //             <td>
  //               {book.categories?.map(c => c.name).join(', ') || '-'}
  //             </td>
  //             <td>{book.stock}</td>
  //             <td className="actions">
  //               <Link to={`/books/edit/${book.id}`} className="edit-btn">Düzenle</Link>
  //               <button onClick={() => handleDelete(book.id)} className="delete-btn">Sil</button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
};

export default BookList;