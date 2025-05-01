import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const BorrowingList = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBorrowings = async () => {
    try {
      const { data } = await api.get('/borrows');
      setBorrowings(data);
    } catch (error) {
      toast.error('Ödünç kayıtları yüklenemedi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bu ödünç kaydını silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/borrows/${id}`);
        toast.success('Kayıt silindi!');
        fetchBorrowings();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Silme işlemi başarısız');
      }
    }
  };

  const filteredBorrowings = borrowings.filter(borrowing =>
    borrowing.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrowing.book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="borrowing-list-container">
      <div className="header">
        <h1>Ödünç Kayıtları</h1>
        <Link to="/borrowings/new" className="add-button">+ Yeni Kayıt</Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Ödünç alan veya kitap adı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ödünç Alan</th>
            <th>Email</th>
            <th>Kitap</th>
            <th>Yazar</th>
            <th>Ödünç Tarihi</th>
            <th>İade Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredBorrowings.map(borrowing => (
            <tr key={borrowing.id}>
              <td>{borrowing.id}</td>
              <td>{borrowing.borrowerName}</td>
              <td>{borrowing.borrowerMail}</td>
              <td>{borrowing.book.name}</td>
              <td>{borrowing.book.author.name}</td>
              <td>{new Date(borrowing.borrowingDate).toLocaleDateString()}</td>
              <td>{borrowing.returnDate ? new Date(borrowing.returnDate).toLocaleDateString() : '-'}</td>
              <td className="actions">
                <Link to={`/borrowings/edit/${borrowing.id}`} className="edit-btn">Düzenle</Link>
                <button 
                  onClick={() => handleDelete(borrowing.id)}
                  className="delete-btn"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowingList;