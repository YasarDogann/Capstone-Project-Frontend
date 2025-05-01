import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books?_expand=author&_expand=publisher&_embed=categories');
      setBooks(data);
    } catch (error) {
      toast.error('Kitaplar yüklenemedi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/books/${id}`);
        toast.success('Kitap silindi!');
        fetchBooks();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Silme işlemi başarısız');
      }
    }
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="book-list-container">
      <div className="header">
        <h1>Kitap Listesi</h1>
        <Link to="/books/new" className="add-button">+ Yeni Kitap</Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Kitap veya yazar ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kitap Adı</th>
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
              <td>{book.id}</td>
              <td>
                <Link to={`/books/detail/${book.id}`}>{book.name}</Link>
              </td>
              <td>{book.author?.name || '-'}</td>
              <td>{book.publisher?.name || '-'}</td>
              <td>
                {book.categories?.map(c => c.name).join(', ') || '-'}
              </td>
              <td>{book.stock}</td>
              <td className="actions">
                <Link to={`/books/edit/${book.id}`} className="edit-btn">Düzenle</Link>
                <button onClick={() => handleDelete(book.id)} className="delete-btn">Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;