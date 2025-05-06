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


  return(
    <div className="table-list-container">
      <div className="header">
        <h1>Ödünç Kayıtları</h1>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Ödünç alan adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <Link to="/borrowings/new" className="add-button">+ Yeni Kayıt</Link>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="modern-table">
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
                <td data-label="ID">{borrowing.id}</td>
                <td data-label="Ödünç Alan">
                  <Link to={`/borrowings/detail/${borrowing.id}`}
                  className='name-link'>
                    {borrowing.borrowerName}
                  </Link>
                </td>
                
                <td>{borrowing.borrowerMail}</td>
                <td>{borrowing.book.name}</td>
                <td>{borrowing.book.author.name}</td>
                <td>{new Date(borrowing.borrowingDate).toLocaleDateString()}</td>
                {/* <td>{borrowing.returnDate ? new Date(borrowing.returnDate).toLocaleDateString() : 'İade edilmedi'}</td> */}
                <td>
                  {borrowing.returnDate && !isNaN(new Date(borrowing.returnDate)) ? (
                    <span className="badge badge-success">
                      {new Date(borrowing.returnDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="badge badge-warning">İade edilmedi</span>
                  )}
                </td>
                <td data-label="İşlemler" className="actions">
                  <Link to={`/borrowings/edit/${borrowing.id}`} className="action-btn edit">
                    <svg viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </Link>
                  <button onClick={() => handleDelete(borrowing.id)} className="action-btn delete">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
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
};

export default BorrowingList;